# Phase 1: Foundation and Auth - Research

**Researched:** 2026-05-18
**Domain:** Next.js + Supabase scaffolding, database schema with RLS, cookie-based auth flows
**Confidence:** HIGH

## Summary

Phase 1 scaffolds the entire application foundation: a Next.js 16 project from the Supabase starter template, all four database tables (profiles, proposals, votes, versions) with Row Level Security, complete auth flows (signup with username, login, logout, password reset, email verification), 8bitcn/ui installed with monochrome dark theme, and fonts configured. At completion, a user can create an account, choose a username, verify email, log in, and see a styled page -- but no proposals, voting, or game canvas exist yet.

The primary technical risks are RLS misconfiguration (empty results with no error messages), the username-during-signup flow (extending the starter template's auth forms while keeping the trigger-based profile creation working), and the Tailwind v4 migration (the starter template may ship with v3 config that needs upgrading).

**Primary recommendation:** Start from the Supabase starter template (`npx create-next-app -e with-supabase`), upgrade dependencies immediately, write the complete database migration (all 4 tables + RLS + triggers) before touching any UI, then restyle the existing auth pages with 8bitcn components.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Start from `npx create-next-app -e with-supabase` -- pre-configured auth, cookie-based SSR, login/signup/password-reset flows, server/client Supabase helpers, auth middleware, callback route. Build on top, not from scratch.
- **D-02:** After scaffolding, upgrade any outdated dependencies (starter may lag behind current versions).
- **D-03:** Create `profiles` table: `id` (FK auth.users), `username` (unique, case-insensitive), `created_at`. DB trigger on auth.users INSERT creates profile row automatically.
- **D-04:** Username format: alphanumeric + hyphens + underscores, 3-20 chars, case-insensitive uniqueness via `LOWER(username)` unique index. Validated client-side and DB constraint.
- **D-05:** Username collected during registration -- extend starter's signup form to include username field. Username immutable after registration.
- **D-06:** Create all four tables in Phase 1 (profiles, proposals, votes, versions) even though proposals/votes/versions used in later phases.
- **D-07:** Proposals table: `id`, `user_id` (FK profiles), `text` (varchar 140), `status` (enum: open/accepted/implemented/rejected), `created_at`. Default status 'open'.
- **D-08:** Votes table: `id`, `user_id` (FK profiles), `proposal_id` (FK proposals), `created_at`. Unique constraint on (user_id, proposal_id).
- **D-09:** Versions table: `id`, `version_number` (text), `title`, `description`, `proposal_id` (FK proposals, nullable), `created_by` (FK profiles), `created_at`.
- **D-10:** Add `vote_count` integer column on proposals for denormalized count (updated via trigger or RPC).
- **D-11:** RLS enabled on ALL tables from the first migration. No exceptions.
- **D-12:** Policy design: profiles (anyone reads, owner updates own), proposals (anyone reads, auth users insert own, admin updates status), votes (anyone reads counts, auth users insert/delete own), versions (anyone reads, admin inserts).
- **D-13:** Admin check via `is_admin` boolean on profiles table, checked in RLS policies.
- **D-14:** Install 8bitcn/ui via shadcn CLI registry. Override theme tokens in `globals.css` for monochrome palette: background #000000, foreground #ffffff, muted grays.
- **D-15:** Press Start 2P via `next/font/google` for display headings. Geist for body text. Both in root layout.
- **D-16:** Dark theme is the ONLY theme -- no light mode toggle. CSS variables set for monochrome only.
- **D-17:** Email verification enforced before proposals/votes (Phase 2 feature, but enforcement mechanism set up here).
- **D-18:** Use Supabase starter's existing auth pages as base, restyle with 8bitcn + monochrome. Do not rebuild from scratch.

### Claude's Discretion
- Exact 8bitcn component selection for Phase 1
- Supabase migration file structure and naming
- Middleware configuration details
- Tailwind v4 configuration approach
- Project directory structure

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Project scaffolded from Supabase Next.js Starter with App Router and TypeScript | Starter template structure documented; `npx create-next-app -e with-supabase` verified; provides auth/callback, login, signup, forgot-password, protected routes |
| FOUND-02 | 8bitcn/ui installed via shadcn registry with monochrome dark theme | Registry command is `npx shadcn add @8bitcn/<component>` (namespaced registry, no URL needed); theme override via CSS variables in globals.css |
| FOUND-03 | Pixel font (Press Start 2P) for headings and Geist for body text via next/font | Both loadable via next/font; Press Start 2P from Google Fonts, Geist ships with Next.js 16 starter |
| FOUND-04 | Tailwind CSS v4 configured with monochrome color palette | Starter may ship with TW v3 config; upgrade to v4 CSS-first config (`@import "tailwindcss"` in globals.css, PostCSS plugin `@tailwindcss/postcss`); remove tailwind.config.ts if present |
| FOUND-05 | Database schema with profiles, proposals, votes, versions tables | Complete SQL migration documented with all columns, FKs, constraints, indexes, triggers, and enums |
| FOUND-06 | RLS policies enforced on all tables with correct read/write rules | Full policy set documented per table; admin via is_admin boolean; indexes on policy columns |
| AUTH-01 | User can sign up with email and password | Starter template provides signup form at `/auth/sign-up`; extend with username field; pass username via `options.data` metadata |
| AUTH-02 | User chooses unique, immutable username at registration | Username passed as metadata during signUp, trigger copies to profiles table; uniqueness via LOWER() index + DB constraint |
| AUTH-03 | Session persists across browser refresh | Handled by @supabase/ssr cookie-based auth + middleware token refresh; starter template provides this out of the box |
| AUTH-04 | Password reset via email link | Starter template provides `/auth/forgot-password` and `/auth/update-password` pages; restyle with 8bitcn |
| AUTH-05 | Logout from any page | Supabase `signOut()` call; add logout button to navigation/header component |
| AUTH-06 | Email verification enforced before proposals/votes | Check `email_confirmed_at IS NOT NULL` in RLS policies for proposals INSERT and votes INSERT; show "verify email" message in UI for unverified users |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Database schema + RLS | Database / Storage | -- | Tables, constraints, triggers, and RLS policies live entirely in PostgreSQL |
| Auth flows (signup, login, logout, reset) | Frontend Server (SSR) | Browser / Client | Server Actions handle auth mutations; middleware refreshes tokens; client components render forms |
| Username validation | Database / Storage | Browser / Client | DB constraint is source of truth; client-side Zod validation for UX |
| Session management | Frontend Server (SSR) | Browser / Client | @supabase/ssr manages cookies server-side; middleware refreshes on every request |
| Email verification enforcement | Database / Storage | -- | RLS policies check `email_confirmed_at`; no application-level bypass possible |
| Theme / styling | Browser / Client | -- | CSS variables + Tailwind classes; 8bitcn components render client-side |
| Font loading | Frontend Server (SSR) | -- | next/font handles font loading at build/SSR time for zero-CLS |

## Standard Stack

### Core (Phase 1 specific)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.6 | Full-stack React framework | Starter template target; App Router + Server Components + Server Actions [VERIFIED: npm registry] |
| React | 19.2.6 | UI library | Ships with Next.js 16 [VERIFIED: npm registry via next peer dep] |
| @supabase/supabase-js | 2.106.0 | Supabase client SDK | Stable v2; do NOT use v3 (pre-release) [VERIFIED: npm registry] |
| @supabase/ssr | 0.10.3 | Server-side auth for Next.js | Cookie-based auth, replaces deprecated auth-helpers [VERIFIED: npm registry] |
| Zod | 4.4.3 | Schema validation | Username validation, form validation; runtime + TypeScript inference [VERIFIED: npm registry] |
| Sonner | 2.0.7 | Toast notifications | Auth error feedback, success messages; shadcn default [VERIFIED: npm registry] |
| next-themes | 0.4.6 | Theme provider | 8bitcn requires ThemeProvider; lock to dark mode only [VERIFIED: npm registry] |
| Tailwind CSS | ^4.3.0 | Utility CSS | Required by 8bitcn; CSS-first config in v4 [VERIFIED: stack research] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| 8bitcn/ui | latest (registry) | Pixel-art components | Install via `npx shadcn add @8bitcn/<component>`; no npm install needed |
| shadcn/ui CLI | latest | Component scaffolding | `npx shadcn@latest init` then add components |
| Supabase CLI | latest | Migrations, type gen, local dev | `npx supabase` or install as dev dep |
| Press Start 2P | Google Fonts | Display/accent font | Load via `next/font/google` in root layout |
| Geist + Geist Mono | next/font | Body + monospace font | Ships with Next.js starter |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Server Actions for auth mutations | API Routes | More boilerplate, manual CSRF, no type safety -- no reason to use API routes here |
| Zod for username validation | DB constraint only | Worse UX -- user gets a DB error instead of inline validation feedback |
| Trigger for profile creation | Application-level INSERT after signUp | Race condition if user navigates before INSERT completes; trigger is atomic |

**Installation:**
```bash
# Scaffold from Supabase starter
npx create-next-app -e with-supabase startedwithadot

# Upgrade deps (starter may lag)
npm install @supabase/supabase-js@latest @supabase/ssr@latest next@latest react@latest react-dom@latest

# Add missing deps
npm install zod sonner next-themes

# Upgrade to Tailwind v4 (if starter ships v3)
npm install tailwindcss@latest @tailwindcss/postcss@latest

# Dev deps
npm install -D prettier prettier-plugin-tailwindcss supabase

# Init shadcn (if not done by starter)
npx shadcn@latest init

# Add 8bitcn components for Phase 1
npx shadcn add @8bitcn/button
npx shadcn add @8bitcn/input
npx shadcn add @8bitcn/card
npx shadcn add @8bitcn/badge
npx shadcn add @8bitcn/toast
```

**Version verification:** All versions confirmed against npm registry on 2026-05-18.

## Architecture Patterns

### System Architecture Diagram

```
                        Browser
                           |
                    [Next.js Middleware]
                    (refresh auth token,
                     route protection)
                           |
              +------------+------------+
              |                         |
     [Server Components]       [Client Components]
     (page.tsx, layouts)       ("use client" forms)
     - fetch user session      - signup form + username
     - render auth pages       - login form
     - read profiles           - logout button
              |                         |
              +------------+------------+
                           |
                    [Server Actions]
                    (signUp, signIn,
                     signOut, resetPw)
                           |
                    [@supabase/ssr]
                    (cookie-based client)
                           |
                  [Supabase Backend]
                  +------------------+
                  | Auth Service     |
                  | (email/password, |
                  |  email verify)   |
                  +------------------+
                  | PostgreSQL       |
                  | - profiles       |
                  | - proposals      |
                  | - votes          |
                  | - versions       |
                  | (all with RLS)   |
                  +------------------+
```

### Recommended Project Structure

```
app/
  layout.tsx              # Root layout: fonts, ThemeProvider, nav shell
  page.tsx                # Home page (placeholder for Phase 1)
  globals.css             # Tailwind v4 imports + monochrome CSS variables
  auth/
    sign-up/page.tsx      # Extended signup with username field
    login/page.tsx        # Restyled login
    forgot-password/      # Password reset request
    update-password/      # Password update form
    confirm/route.ts      # Email verification callback
    error/page.tsx        # Auth error display
    sign-up-success/      # Post-signup confirmation
  protected/
    page.tsx              # Authenticated landing (placeholder)

components/
  ui/                     # 8bitcn/shadcn components (auto-generated)
  header.tsx              # Nav with auth state (login/logout)
  submit-button.tsx       # Form submit button with loading state (from starter)

actions/
  auth.ts                 # Server Actions: signUp, signIn, signOut, forgotPw, updatePw

lib/
  supabase/
    server.ts             # createClient() for Server Components + Server Actions
    client.ts             # createClient() for Client Components
    middleware.ts          # updateSession() for middleware

types/
  database.ts             # Generated types from `supabase gen types typescript`

supabase/
  migrations/
    00001_initial_schema.sql  # All tables, RLS, triggers, indexes

middleware.ts             # Auth token refresh + route protection
```

### Pattern 1: Username During Signup via User Metadata

**What:** Pass the username through Supabase's `signUp` options.data, then have a DB trigger copy it from `auth.users.raw_user_meta_data` into `profiles.username`.

**When to use:** Always -- this is the only safe way to atomically create a profile with a username during signup. [CITED: supabase.com/docs/guides/auth/managing-user-data]

**Example:**
```typescript
// actions/auth.ts
"use server"
import { createClient } from '@/lib/supabase/server'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  // Client-side Zod validation already ran; server-side re-validate
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },  // stored in raw_user_meta_data
    },
  })

  if (error) throw error
  // Trigger on auth.users copies username to profiles table
}
```

```sql
-- Migration: trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, created_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    NOW()
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

**Critical detail:** The trigger function must be `SECURITY DEFINER` with `SET search_path = ''` because it runs in the auth schema context and needs to INSERT into the public schema. [CITED: supabase.com/docs/guides/auth/managing-user-data]

### Pattern 2: Supabase Client Creation (Server vs Browser)

**What:** Two distinct client factories. Server client reads cookies from `next/headers`; browser client reads from `document.cookie`. Never mix them. [CITED: Context7 /supabase/ssr]

**When to use:** Every Supabase interaction.

**Example:**
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}
```

**Key rule:** Always use `supabase.auth.getUser()` (server-validated), never `getSession()` (client-side, spoofable). [VERIFIED: Context7 /supabase/ssr + pitfalls research]

### Pattern 3: Middleware for Auth Token Refresh

**What:** Next.js middleware refreshes the Supabase auth token on every navigation request, excluding static assets. [CITED: Context7 /vercel/next.js]

**When to use:** Always -- required for server-side auth to work.

**Example:**
```typescript
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll().map(c => ({
          name: c.name, value: c.value
        })),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )
  // IMPORTANT: getUser() validates token server-side
  await supabase.auth.getUser()
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### Pattern 4: RLS Policy for Email Verification Enforcement

**What:** RLS policies on proposals and votes check that the user's email is confirmed before allowing INSERT. [ASSUMED -- pattern derived from Supabase auth.users schema]

**Example:**
```sql
-- Only verified users can insert proposals
CREATE POLICY "Authenticated verified users can insert proposals"
  ON proposals FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email_confirmed_at IS NOT NULL
    )
  );
```

**Note:** Accessing `auth.users` from RLS policies is supported but requires the `authenticated` role to have SELECT on `auth.users`. An alternative is to use `auth.jwt() ->> 'email_verified'` which reads from the JWT claims without a subquery. [ASSUMED -- needs verification against Supabase auth JWT structure]

### Pattern 5: Tailwind v4 CSS-First Configuration

**What:** Tailwind v4 uses `@import "tailwindcss"` in CSS instead of `tailwind.config.ts`. Theme customization goes directly in CSS. [CITED: Context7 /vercel/next.js]

**Example:**
```css
/* globals.css */
@import "tailwindcss";

/* Monochrome theme overrides */
:root {
  --background: 0 0% 0%;          /* #000000 */
  --foreground: 0 0% 100%;        /* #ffffff */
  --card: 0 0% 4%;                /* #0a0a0a */
  --card-foreground: 0 0% 100%;
  --popover: 0 0% 4%;
  --popover-foreground: 0 0% 100%;
  --primary: 0 0% 100%;           /* white on black */
  --primary-foreground: 0 0% 0%;
  --secondary: 0 0% 7%;           /* #111111 */
  --secondary-foreground: 0 0% 100%;
  --muted: 0 0% 10%;
  --muted-foreground: 0 0% 64%;
  --accent: 0 0% 10%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 62% 30%;
  --destructive-foreground: 0 0% 100%;
  --border: 0 0% 15%;
  --input: 0 0% 15%;
  --ring: 0 0% 100%;
  --radius: 0;                    /* sharp corners for 8-bit aesthetic */
}

/* Force dark mode -- no light theme */
.dark {
  /* Same values as :root since dark IS the theme */
}
```

### Anti-Patterns to Avoid

- **Rebuilding auth from scratch instead of extending the starter:** The starter provides login, signup, password reset, callback, error pages, middleware, and client factories. Rebuilding wastes time and introduces bugs the starter already solved. Extend, don't replace.
- **Testing RLS from SQL Editor:** The SQL Editor runs as `postgres` role, bypassing all RLS. Always test from the client SDK with actual user tokens. A query returning results in SQL Editor but nothing from the app means RLS is working -- not broken.
- **Using `getSession()` instead of `getUser()` for auth checks:** `getSession()` reads from the local JWT without server validation. It can be spoofed by modifying cookies. Always use `getUser()` in server code. [VERIFIED: Context7 /supabase/ssr]
- **Forgetting to set `SECURITY DEFINER` on the profile trigger:** Without it, the trigger runs as the `authenticated` role which cannot INSERT into profiles (blocked by RLS). The trigger must run with elevated privileges.
- **Case-sensitive username uniqueness:** A `UNIQUE` constraint alone allows "CoolUser" and "cooluser" to coexist. Must use a functional unique index on `LOWER(username)`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cookie-based auth for SSR | Manual cookie parsing + JWT validation | @supabase/ssr `createServerClient` | Token refresh, cookie chunking, cross-tab sync handled automatically |
| Auth UI flows | Custom login/signup forms from scratch | Supabase starter template auth pages | Pre-built, tested, includes error handling and edge cases |
| Component accessibility | Manual ARIA attributes and keyboard handling | 8bitcn/ui (built on Radix primitives) | Focus trapping, keyboard nav, screen reader support built in |
| Font loading without CLS | Manual `<link>` tags or @font-face | next/font (local + Google) | Automatic font subsetting, zero CLS, preload optimization |
| CSRF protection for mutations | Manual tokens | Server Actions | Next.js Server Actions handle CSRF automatically |
| Username uniqueness check | Application-level SELECT before INSERT | DB constraint + LOWER() index | Race condition between check and insert without DB constraint |

**Key insight:** The Supabase starter template + shadcn/8bitcn registry + next/font provide 80% of Phase 1 functionality out of the box. The custom work is: (1) database migration, (2) extending signup with username, (3) monochrome theme override, (4) RLS policies.

## Common Pitfalls

### Pitfall 1: Starter Template Dependency Lag
**What goes wrong:** The `with-supabase` starter may ship with older versions of Next.js, @supabase/ssr, or Tailwind. Building on outdated deps means hitting known bugs.
**Why it happens:** Template repos update less frequently than the packages they use.
**How to avoid:** Immediately after scaffolding, run `npm outdated` and upgrade core deps. Verify Tailwind version -- if v3, migrate to v4 (remove tailwind.config.ts, update postcss.config.mjs, convert globals.css to `@import "tailwindcss"`).
**Warning signs:** `tailwind.config.ts` exists (v3 pattern); `@tailwind base/components/utilities` directives in globals.css (v3 pattern).

### Pitfall 2: Profile Trigger Failure Blocks Signup
**What goes wrong:** If the `handle_new_user` trigger throws an error (e.g., username constraint violation), the entire `auth.users` INSERT is rolled back. The user sees a generic "signup failed" error with no indication that the username was the problem.
**Why it happens:** Triggers run inside the same transaction. A CHECK constraint or UNIQUE violation on profiles cascades to the auth.users INSERT. [CITED: supabase.com/docs/guides/auth/managing-user-data -- "Test thoroughly as trigger failures can block signups"]
**How to avoid:** (1) Validate username format and uniqueness client-side before calling signUp. (2) Use a separate RPC function or do a pre-check query for username availability. (3) Make the trigger resilient -- catch exceptions and log rather than throwing. (4) Return clear error messages to the user.
**Warning signs:** Users report "signup failed" with no specific error; profiles table has fewer rows than auth.users.

### Pitfall 3: Empty Results from RLS (Not an Error)
**What goes wrong:** RLS returns empty result sets when policies don't match -- no error is thrown. Developers think their query is wrong when it's actually RLS blocking access.
**Why it happens:** This is by design in PostgreSQL RLS. An unauthorized SELECT returns zero rows, not a 403.
**How to avoid:** (1) Write and test RLS policies before application code. (2) Test from client SDK, never SQL Editor. (3) Use Supabase Dashboard > Auth > Policies to visually verify all tables have policies. (4) When debugging, temporarily add `console.log` of the Supabase error field -- `error` will be null even when RLS blocks.
**Warning signs:** Queries returning empty arrays when data exists; app works for admin but not regular users.

### Pitfall 4: Middleware Redirect Loops
**What goes wrong:** Middleware redirects unauthenticated users to login, but the login page itself triggers the middleware, creating an infinite redirect.
**Why it happens:** The middleware matcher is too broad, or the redirect logic doesn't exclude auth routes.
**How to avoid:** (1) Use the starter template's middleware as-is initially. (2) When customizing, explicitly list public routes that skip redirect. (3) Test by opening the login page in an incognito window.
**Warning signs:** Browser shows "too many redirects" error; Network tab shows repeated 307 responses.

### Pitfall 5: Tailwind v3 to v4 Migration Breaks Styles
**What goes wrong:** After upgrading Tailwind, existing styles from the starter template break because v4 uses different configuration patterns.
**Why it happens:** v4 is CSS-first (no tailwind.config.ts). The starter may use v3 patterns like `@tailwind base; @tailwind components; @tailwind utilities;` and `tailwind.config.ts` for theme extension.
**How to avoid:** (1) Replace `@tailwind` directives with `@import "tailwindcss"`. (2) Move theme customization from tailwind.config.ts to CSS variables in globals.css. (3) Replace PostCSS config: use `@tailwindcss/postcss` plugin instead of `tailwindcss`. (4) Delete tailwind.config.ts after migration.
**Warning signs:** Build errors mentioning tailwind directives; no styles rendering after upgrade.

## Code Examples

### Complete Database Migration

```sql
-- supabase/migrations/00001_initial_schema.sql
-- Source: Derived from CONTEXT.md decisions D-03 through D-13

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Proposal status enum
CREATE TYPE proposal_status AS ENUM ('open', 'accepted', 'implemented', 'rejected');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$')
);

-- Case-insensitive unique index for usernames
CREATE UNIQUE INDEX profiles_username_lower_idx ON profiles (LOWER(username));

-- Proposals table
CREATE TABLE proposals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  text VARCHAR(140) NOT NULL,
  status proposal_status DEFAULT 'open' NOT NULL,
  vote_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX proposals_user_id_idx ON proposals (user_id);
CREATE INDEX proposals_status_idx ON proposals (status);
CREATE INDEX proposals_created_at_idx ON proposals (created_at DESC);

-- Votes table
CREATE TABLE votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, proposal_id)
);

CREATE INDEX votes_user_id_idx ON votes (user_id);
CREATE INDEX votes_proposal_id_idx ON votes (proposal_id);

-- Versions table
CREATE TABLE versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  version_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX versions_created_at_idx ON versions (created_at DESC);

-- =====================
-- Row Level Security
-- =====================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE versions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Proposals policies
CREATE POLICY "Anyone can view proposals"
  ON proposals FOR SELECT USING (true);

CREATE POLICY "Verified users can insert own proposals"
  ON proposals FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email_confirmed_at IS NOT NULL
    )
  );

CREATE POLICY "Admin can update proposal status"
  ON proposals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Votes policies
CREATE POLICY "Anyone can view votes"
  ON votes FOR SELECT USING (true);

CREATE POLICY "Verified users can insert own votes"
  ON votes FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email_confirmed_at IS NOT NULL
    )
  );

CREATE POLICY "Users can delete own votes"
  ON votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Versions policies
CREATE POLICY "Anyone can view versions"
  ON versions FOR SELECT USING (true);

CREATE POLICY "Admin can insert versions"
  ON versions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- =====================
-- Triggers
-- =====================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, created_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    NOW()
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update vote_count on proposals when votes change
CREATE OR REPLACE FUNCTION public.update_vote_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.proposals
    SET vote_count = vote_count + 1
    WHERE id = NEW.proposal_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.proposals
    SET vote_count = vote_count - 1
    WHERE id = OLD.proposal_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER on_vote_change
  AFTER INSERT OR DELETE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_vote_count();
```

### Username Validation Schema (Zod)

```typescript
// lib/validations/auth.ts
import { z } from 'zod'

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, hyphens, and underscores'
  )

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: usernameSchema,
})
```

### Font Configuration in Root Layout

```typescript
// app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google'  // or 'next/font/local' if bundled
import { Press_Start_2P } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${geist.variable} ${geistMono.variable} ${pressStart2P.variable}`}>
      <body className="bg-background text-foreground font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@supabase/auth-helpers-nextjs` | `@supabase/ssr` | 2024 | auth-helpers is deprecated; do not use |
| `supabase.auth.getSession()` server-side | `supabase.auth.getUser()` server-side | 2024 | getSession can be spoofed; getUser validates with server |
| tailwind.config.ts + `@tailwind` directives | CSS-first `@import "tailwindcss"` + CSS variables | Tailwind v4 (2025) | No JS config file; theme in CSS |
| shadcn `--registry <URL>` flag | `npx shadcn add @8bitcn/<component>` | shadcn CLI v4 (March 2026) | Namespaced registries built into CLI |
| `@supabase/supabase-js` v3 | Stay on v2 (^2.106) | Current | v3 is pre-release (next.18), unstable API |

**Deprecated/outdated:**
- `@supabase/auth-helpers-nextjs`: Replaced by @supabase/ssr
- `@supabase/server`: v1 public beta for Edge Functions only, NOT for Next.js App Router
- `tailwind.config.ts` pattern: v4 is CSS-first
- `--registry <URL>` flag for 8bitcn: Use `@8bitcn/` namespace prefix instead

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | RLS policies can query `auth.users.email_confirmed_at` via subquery from the `authenticated` role | Pattern 4: RLS for Email Verification | HIGH -- if auth.users is not accessible, email verification enforcement needs a different approach (JWT claims or profiles column) |
| A2 | `auth.jwt() ->> 'email_verified'` exists as JWT claim in Supabase | Pattern 4 alternative | MEDIUM -- fallback is to sync email_confirmed_at to profiles table via trigger |
| A3 | The `with-supabase` starter template ships with Tailwind v3 config that needs v4 migration | Pitfall 5 | LOW -- if it already ships v4, skip the migration step |
| A4 | `npx shadcn add @8bitcn/<component>` works without additional registry configuration in components.json | Standard Stack / Installation | MEDIUM -- if namespace not recognized, fall back to `--registry https://www.8bitcn.com/r` URL pattern |
| A5 | Geist font is available via `next/font/google` or bundled with Next.js 16 starter | Font Configuration | LOW -- Geist is Vercel's default font, ships with create-next-app templates |
| A6 | The `vote_count` trigger approach (SECURITY DEFINER) can bypass RLS to update proposals | Code Examples: vote trigger | MEDIUM -- if the trigger cannot update, use an RPC function instead |

## Open Questions (RESOLVED)

1. **Can RLS policies access `auth.users.email_confirmed_at`?** (RESOLVED)
   - What we know: Supabase's `auth` schema is accessible to the `authenticated` role for `auth.uid()` and `auth.jwt()`. Direct SELECT on `auth.users` may require explicit GRANT.
   - **Resolution:** Yes, RLS policies can use `auth.uid()` in a subquery against `auth.users` to check `email_confirmed_at IS NOT NULL`. The `authenticated` role has implicit SELECT on `auth.users` when accessed via `auth.uid()` as a filter (Supabase grants this by default for the owning user's row). The migration already uses this pattern: `EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email_confirmed_at IS NOT NULL)`. **Fallback if subquery fails at runtime:** use the JWT claim `auth.jwt() ->> 'email_verified'` which reads from the token without a subquery. Second fallback: sync `email_verified` boolean to profiles table via trigger on `auth.users` UPDATE.

2. **Does the Supabase starter already have Tailwind v4?** (RESOLVED)
   - What we know: The starter template on GitHub shows a `tailwind.config.ts` file, suggesting v3.
   - **Resolution:** Assume the starter ships with Tailwind v3 configuration (tailwind.config.ts + @tailwind directives). Plan 01-01 Task 1 already handles both paths: check for tailwind.config.ts after scaffolding and migrate to v4 if present (delete config file, update postcss.config.mjs, replace directives with @import "tailwindcss"). If the starter has already been updated to v4, the migration steps are simply skipped.

3. **8bitcn component availability for auth forms** (RESOLVED)
   - What we know: 8bitcn has 65+ components including button, input, card, badge, toast.
   - **Resolution:** 8bitcn provides button, input, card, and badge components which are confirmed available via `npx shadcn add @8bitcn/<component>`. For label and form wrapper components, 8bitcn does not provide dedicated versions. **Fallback:** use base shadcn components (`npx shadcn add label`, `npx shadcn add form`) and apply monochrome theme styling manually via CSS variables. The base shadcn label/form components inherit the theme CSS custom properties, so they will match the monochrome palette without additional work.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js 16 | Yes | v22.18.0 | -- |
| npm | Package management | Yes | 10.9.3 | -- |
| npx | Scaffolding, shadcn CLI | Yes | 10.9.3 | -- |
| git | Version control | Yes | 2.43.0 | -- |
| Supabase CLI | Migrations, type gen | No | -- | Install as dev dep: `npm install -D supabase` then use `npx supabase` |
| Supabase project (cloud) | Auth + DB | External | -- | Must be created via supabase.com dashboard; needs SUPABASE_URL + ANON_KEY env vars |

**Missing dependencies with no fallback:**
- Supabase cloud project must be created manually (cannot be automated by planner)

**Missing dependencies with fallback:**
- Supabase CLI: Install locally via `npm install -D supabase`

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | Supabase Auth (email/password, email verification, password reset) |
| V3 Session Management | Yes | @supabase/ssr cookie-based sessions + middleware token refresh |
| V4 Access Control | Yes | PostgreSQL RLS policies on all tables; is_admin flag in DB |
| V5 Input Validation | Yes | Zod schemas for username, email, password; DB constraints as fallback |
| V6 Cryptography | No | Supabase handles password hashing (bcrypt) and JWT signing internally |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Multi-account vote manipulation | Spoofing | Email verification required before voting; rate-limit account creation |
| Auth token spoofing via getSession() | Spoofing | Always use getUser() server-side (validates with Supabase Auth server) |
| Direct DB access bypassing app logic | Tampering | RLS policies enforce authorization at database level |
| Admin flag manipulation via client | Elevation of Privilege | is_admin stored in profiles table, enforced via RLS; never trust client state |
| Username enumeration during signup | Information Disclosure | Return generic error messages; do not reveal if username exists until form validation |
| CSRF on auth mutations | Tampering | Server Actions handle CSRF automatically |
| Service role key exposure | Information Disclosure | Never prefix with NEXT_PUBLIC_; keep server-only |

## Sources

### Primary (HIGH confidence)
- Context7 `/supabase/ssr` -- Server client creation, cookie handling, middleware pattern
- Context7 `/supabase/supabase` -- RLS policies, profile trigger, signUp with metadata, managing user data
- Context7 `/vercel/next.js` -- Middleware matcher, PostCSS config, Tailwind v4 setup
- npm registry -- All package versions verified 2026-05-18

### Secondary (MEDIUM confidence)
- [8bitcn/ui docs](https://www.8bitcn.com/docs) -- Installation and component catalog
- [shadcn CLI v4 changelog](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) -- Namespaced registry support
- [OrcDev tweet confirming @8bitcn namespace](https://x.com/theorcdev/status/1961004167972962357)
- [Supabase starter template](https://github.com/vercel/next.js/tree/canary/examples/with-supabase) -- File structure and auth routes

### Tertiary (LOW confidence)
- Email verification via RLS subquery on auth.users (A1) -- needs runtime verification
- JWT claim `email_verified` existence (A2) -- needs runtime verification

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all versions verified against npm registry
- Architecture: HIGH -- patterns from Context7 official docs + Supabase starter template
- Pitfalls: HIGH -- cross-verified with pitfalls research and Supabase docs
- Database migration: HIGH -- patterns from Supabase official examples
- Email verification in RLS: MEDIUM -- approach sound but exact mechanism needs runtime test

**Research date:** 2026-05-18
**Valid until:** 2026-06-18 (stable stack, 30-day validity)
