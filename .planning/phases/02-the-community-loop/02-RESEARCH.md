# Phase 2: The Community Loop - Research

**Researched:** 2026-05-18
**Domain:** Full-stack CRUD with optimistic UI (Next.js App Router + Supabase)
**Confidence:** HIGH

## Summary

Phase 2 builds the core value proposition of the product: the propose-vote-curate loop. The existing codebase provides a solid foundation -- schema with all four tables already created, RLS policies for reads and inserts, a denormalized `vote_count` column with trigger-based updates, and established patterns for Server Actions with Zod validation. The primary technical challenges are: (1) building optimistic UI for vote toggling using the browser Supabase client, (2) mixing Server Components (feed fetching) with Client Components (vote interactions, admin actions), and (3) a missing RLS DELETE policy on proposals needed for admin moderation.

The architecture is straightforward: a Server Component page fetches proposals with joined author usernames, renders proposal cards, and delegates interactive elements (vote button, admin dropdown) to Client Components. Proposal submission uses a Server Action with `useActionState` (matching the existing auth pattern but returning state instead of redirecting). Vote toggling uses the browser Supabase client directly for optimistic updates. Admin actions use Server Actions with `revalidatePath`.

**Primary recommendation:** Build the proposal feed as a public Server Component page at `/proposals` (or the root `/`), with proposal submission as a `useActionState`-backed form and vote toggling as a client-side Supabase mutation with optimistic state. Add a new migration for the missing admin DELETE policy on proposals and the Sonner `<Toaster />` to the root layout.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Card-based vertical list using 8bitcn Card. Each card shows: proposal text, author username, relative timestamp, dot-based vote counter, status badge. Sorted by vote count, status tabs above (All / Open / Accepted / Implemented).
- **D-02:** Status tabs use a tab bar or badge-based filter buttons. Active tab highlighted. "All" is default.
- **D-03:** Inline input at top of feed, Twitter-style. Single text field with submit button. Character counter counting down from 140. Only visible to authenticated, email-verified users. Unauthenticated see CTA to sign up.
- **D-04:** Character counter with narrator-style feedback at milestones. Validation via Zod schema.
- **D-05:** Server Action for proposal submission with Zod (140-char max, not empty, rate limit). 3/day rate limit enforced via DB function or RLS counting today's proposals.
- **D-06:** Vote toggle via dot icon. Filled/highlighted when voted. Dot as visual DNA.
- **D-07:** Optimistic UI -- vote count and own-vote state update immediately. Browser Supabase client for vote toggle.
- **D-08:** Dot symbols for counts <= 10, numeric with dot icon for > 10.
- **D-09:** Admin dropdown (three-dot trigger) on each card, visible when `is_admin = true`. Items: Accept, Reject, Mark Implemented, Delete.
- **D-10:** Admin can create version when marking "Implemented" -- inline form or dialog for version number and title.
- **D-11:** Admin check server-side via RLS. UI reads `is_admin` from profile for conditional rendering.
- **D-12:** Proposal feed is Server Component. Supabase `.select()` with join for author username. Paginate/limit to ~50.
- **D-13:** Vote button and optimistic update in a Client Component wrapping interactive card elements.
- **D-14:** No realtime subscriptions this phase. Updates on refresh or after own action.
- **D-15:** Rate limit 3/day enforced at DB level or Server Action counting today's proposals.

### Claude's Discretion
- Exact component composition (internal proposal card structure)
- Server Action vs. RPC for vote toggling
- DB function vs. Server Action for rate limiting
- Tab component choice (8bitcn tabs vs. custom filter buttons)
- Pagination strategy (load more vs. fixed page)
- Toast notifications for actions (use Sonner)
- URL state for active filter tab (query params or not)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PROP-01 | Authenticated user can submit proposal (140 chars, inline input) | Server Action + Zod validation + `useActionState` pattern from existing auth code |
| PROP-02 | Character counter with narrator-style feedback | Client Component with controlled input, milestone-based copy |
| PROP-03 | Proposals in vertical timeline sorted by votes | Server Component with `.select().order('vote_count', { ascending: false })` |
| PROP-04 | Each proposal shows text, username, timestamp, dot-counter, status | Supabase join query `proposals(*, profiles(username))` + relative time formatting |
| PROP-05 | Filterable by status tabs (All/Open/Accepted/Implemented) | URL search params or client state for tab, conditional `.eq('status', ...)` filter |
| PROP-06 | Rate limit 3/day enforced | Count query in Server Action: `proposals.select('id', { count: 'exact' }).eq('user_id', userId).gte('created_at', todayStart)` |
| PROP-07 | Unauthenticated can view, not submit/vote | RLS policies already enforce this; UI conditionally hides input |
| VOTE-01 | Toggle upvote, one per user per proposal | Insert/delete on votes table; UNIQUE constraint in schema prevents duplicates |
| VOTE-02 | Dot counter visualization | Render dots for <=10, numeric for >10 |
| VOTE-03 | Own vote visually highlighted | Check if current user's vote exists in fetched data |
| VOTE-04 | Optimistic UI with server reconciliation | Client Component with local state, browser Supabase client mutation |
| ADMN-01 | Admin changes proposal status | Server Action updating proposals.status; RLS UPDATE policy exists |
| ADMN-02 | Admin creates versions linked to proposals | Server Action inserting into versions table; RLS INSERT policy exists |
| ADMN-03 | Admin can delete proposals | **Requires new migration** -- no DELETE policy on proposals yet |
| ADMN-04 | Admin controls in UI | Dropdown menu component, conditional on `is_admin` from profile |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Proposal feed display | Frontend Server (SSR) | -- | Server Component fetches data, renders initial HTML |
| Proposal submission | API / Backend (Server Action) | Frontend Server | Zod validation + DB insert happens server-side |
| Vote toggling | Browser / Client | Database | Optimistic UI requires client-side state; browser Supabase client writes directly |
| Rate limiting | Database / Storage | API / Backend | DB-level count is authoritative; Server Action validates before insert |
| Admin status changes | API / Backend (Server Action) | -- | Mutations via Server Actions, RLS enforces admin check |
| Admin version creation | API / Backend (Server Action) | -- | Insert into versions table, admin-only RLS |
| Admin proposal deletion | API / Backend (Server Action) | Database | Server Action + new RLS DELETE policy needed |
| Auth state detection | Frontend Server (SSR) | Browser / Client | Server reads `getUser()`, passes to client; client reads `is_admin` |
| Status tab filtering | Browser / Client | Frontend Server | Could be URL params (server) or client state; recommend URL params for shareability |

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | ^16.2.6 | App Router, Server Actions, Server Components | Already installed; Server Actions are the mutation pattern [VERIFIED: package.json] |
| React | ^19.2.6 | `useActionState` for forms, `useOptimistic` for vote toggle | Already installed; React 19 hooks are the standard form pattern [VERIFIED: package.json] |
| Zod | ^4.4.3 | Schema validation | Already installed; established pattern in `lib/validations/auth.ts` [VERIFIED: package.json] |
| @supabase/ssr | ^0.10.3 | Server/client Supabase factories | Already installed; `lib/supabase/server.ts` and `client.ts` [VERIFIED: package.json] |
| @supabase/supabase-js | ^2.106.0 | Database queries, RLS | Already installed [VERIFIED: package.json] |
| Sonner | ^2.0.7 | Toast notifications | Already installed but `<Toaster />` not in layout yet [VERIFIED: package.json + layout.tsx] |

### UI Components (already installed)
| Component | Location | Purpose |
|-----------|----------|---------|
| Card | `components/ui/8bit/card.tsx` | Proposal card wrapper [VERIFIED: file exists] |
| Badge | `components/ui/8bit/badge.tsx` | Status indicators [VERIFIED: file exists] |
| Button | `components/ui/8bit/button.tsx` | Submit, vote actions [VERIFIED: file exists] |
| Input | `components/ui/8bit/input.tsx` | Proposal text input [VERIFIED: file exists] |
| DropdownMenu | `components/ui/dropdown-menu.tsx` | Admin actions menu [VERIFIED: file exists] |
| SubmitButton | `components/submit-button.tsx` | Form submit with pending state [VERIFIED: file exists] |

### Components to Install
| Component | Source | Purpose | When to Use |
|-----------|--------|---------|-------------|
| 8bitcn Tabs | `npx shadcn@latest add --registry https://www.8bitcn.com/r tabs` | Status filter tabs | If using tab UI for proposal filtering [ASSUMED] |
| 8bitcn Dialog | `npx shadcn@latest add --registry https://www.8bitcn.com/r dialog` | Version creation modal | Admin "Mark Implemented" flow (D-10) [ASSUMED] |
| 8bitcn Textarea | `npx shadcn@latest add --registry https://www.8bitcn.com/r textarea` | Proposal input (if multiline wanted) | Only if input is insufficient [ASSUMED] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `useActionState` for proposals | Redirect-on-error (current auth pattern) | `useActionState` returns state inline, better UX for the feed -- no page navigation on error |
| Browser Supabase client for votes | Server Action for votes | Server Action would require `revalidatePath` and full re-render; browser client enables true optimistic UI |
| URL search params for tabs | Client-only state | URL params enable sharing filtered views and back-button support; slightly more complex |
| DB function for rate limit | Server Action count query | DB function is more tamper-proof but adds migration complexity; Server Action count is simpler and sufficient since RLS already protects inserts |

**No new npm packages needed.** Everything required is already installed.

## Architecture Patterns

### System Architecture Diagram

```
[Browser]
  |
  ├── GET /proposals (or /)
  |     └── Server Component: ProposalFeedPage
  |           ├── Fetch: supabase.from('proposals').select('*, profiles(username)')
  |           |          .order('vote_count', { ascending: false }).limit(50)
  |           ├── Fetch: supabase.from('votes').select('proposal_id').eq('user_id', userId)
  |           ├── Fetch: profile.is_admin for current user
  |           └── Render:
  |                 ├── <ProposalInput /> (Client Component, auth-gated)
  |                 |     └── useActionState → submitProposal Server Action
  |                 |           └── Zod validate → rate limit check → INSERT proposals
  |                 |           └── revalidatePath('/proposals')
  |                 ├── <StatusTabs /> (Client Component or server with URL params)
  |                 └── <ProposalCard /> (Server Component shell)
  |                       ├── Static: text, username, timestamp, status badge
  |                       └── <ProposalCardActions /> (Client Component)
  |                             ├── <VoteButton /> → browser supabase.from('votes').insert/delete
  |                             |     └── optimistic state update → reconcile on response
  |                             └── <AdminMenu /> (conditional on is_admin)
  |                                   └── Server Actions: updateStatus, deleteProposal, createVersion
  |                                         └── revalidatePath('/proposals')
  |
  └── Supabase PostgreSQL (RLS enforced)
        ├── proposals (SELECT: all, INSERT: verified auth, UPDATE: admin, DELETE: admin [NEW])
        ├── votes (SELECT: all, INSERT: verified auth, DELETE: own)
        ├── profiles (SELECT: all)
        └── versions (INSERT: admin)
```

### Recommended Project Structure
```
app/
├── proposals/
│   └── page.tsx              # Proposal feed (Server Component)
actions/
├── auth.ts                   # Existing
├── proposals.ts              # submitProposal, updateProposalStatus, deleteProposal
└── versions.ts               # createVersion
lib/
├── validations/
│   ├── auth.ts               # Existing
│   └── proposals.ts          # proposalSchema, versionSchema
├── supabase/
│   ├── server.ts             # Existing
│   └── client.ts             # Existing
└── utils.ts                  # Existing (cn utility)
components/
├── proposals/
│   ├── proposal-feed.tsx     # Feed wrapper (may be inline in page)
│   ├── proposal-input.tsx    # Client Component: input + character counter + submit
│   ├── proposal-card.tsx     # Card layout (Server Component compatible)
│   ├── proposal-card-actions.tsx  # Client Component: vote + admin
│   ├── vote-button.tsx       # Client Component: optimistic vote toggle
│   ├── dot-counter.tsx       # Vote count visualization (dots or numeric)
│   ├── status-badge.tsx      # Status indicator with dot prefix
│   ├── status-tabs.tsx       # Filter tabs
│   └── admin-menu.tsx        # Admin dropdown actions
├── ui/                       # Existing shadcn/8bitcn components
└── ...                       # Existing components
supabase/
└── migrations/
    ├── 00001_initial_schema.sql  # Existing
    └── 00002_admin_delete_proposals.sql  # NEW: admin DELETE policy
types/
└── database.ts               # Existing (already has all table types)
```

### Pattern 1: Server Action with useActionState (Proposal Submission)
**What:** Server Action returns a state object instead of redirecting. Client uses `useActionState` to display inline errors/success.
**When to use:** When the form is embedded in a page and should not navigate on submit.
**Example:**
```typescript
// Source: Next.js official docs (nextjs.org/docs/app/guides/forms)
// actions/proposals.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { proposalSchema } from "@/lib/validations/proposals";
import { revalidatePath } from "next/cache";

type ActionState = { message: string; success: boolean } | undefined;

export async function submitProposal(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email_confirmed_at) {
    return { message: "You need to verify your email first.", success: false };
  }

  const text = formData.get("text") as string;
  const result = proposalSchema.safeParse({ text });

  if (!result.success) {
    return { message: result.error.issues[0].message, success: false };
  }

  // Rate limit check
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("proposals")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", todayStart.toISOString());

  if ((count ?? 0) >= 3) {
    return { message: "Three ideas a day. That's the limit. Quality over quantity.", success: false };
  }

  const { error } = await supabase
    .from("proposals")
    .insert({ user_id: user.id, text: result.data.text });

  if (error) {
    return { message: "Something broke. The dot is investigating.", success: false };
  }

  revalidatePath("/proposals");
  return { message: "Proposal submitted. The dot is listening.", success: true };
}
```

### Pattern 2: Optimistic Vote Toggle (Client Component)
**What:** Client-side vote toggle using browser Supabase client with immediate UI feedback.
**When to use:** When the interaction needs to feel instant and the user is authenticated.
**Example:**
```typescript
// Source: React 19 useOptimistic + Supabase client pattern
// components/proposals/vote-button.tsx
"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface VoteButtonProps {
  proposalId: string;
  userId: string | null;
  initialVoted: boolean;
  initialCount: number;
}

export function VoteButton({ proposalId, userId, initialVoted, initialCount }: VoteButtonProps) {
  const [voted, setVoted] = useState(initialVoted);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);

  const toggleVote = useCallback(async () => {
    if (!userId || pending) return;
    setPending(true);

    // Optimistic update
    const newVoted = !voted;
    setVoted(newVoted);
    setCount(prev => newVoted ? prev + 1 : prev - 1);

    const supabase = createClient();

    if (newVoted) {
      const { error } = await supabase
        .from("votes")
        .insert({ user_id: userId, proposal_id: proposalId });
      if (error) {
        // Rollback
        setVoted(voted);
        setCount(count);
      }
    } else {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("user_id", userId)
        .eq("proposal_id", proposalId);
      if (error) {
        setVoted(voted);
        setCount(count);
      }
    }
    setPending(false);
  }, [voted, count, userId, proposalId, pending]);

  return (
    <button onClick={toggleVote} disabled={!userId || pending}>
      <span className={voted ? "text-foreground" : "text-muted-foreground"}>
        {/* Dot counter visualization */}
      </span>
    </button>
  );
}
```

### Pattern 3: Supabase Join Query for Feed
**What:** Fetch proposals with author username using PostgREST embedded resources.
**When to use:** Server Component data fetching.
**Example:**
```typescript
// Source: Supabase PostgREST docs (context7.com/supabase/postgrest-js)
const { data: proposals } = await supabase
  .from("proposals")
  .select("*, profiles(username)")
  .order("vote_count", { ascending: false })
  .limit(50);

// With status filter
const query = supabase
  .from("proposals")
  .select("*, profiles(username)")
  .order("vote_count", { ascending: false })
  .limit(50);

if (status && status !== "all") {
  query.eq("status", status);
}

const { data: proposals } = await query;
```

### Pattern 4: Admin Server Actions
**What:** Server Actions for admin-only operations, protected by auth + admin check.
**When to use:** Status changes, version creation, proposal deletion.
**Example:**
```typescript
// Source: Established pattern from actions/auth.ts + Supabase RLS
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProposalStatus(
  proposalId: string,
  newStatus: "accepted" | "rejected" | "implemented"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // RLS enforces admin check, but we also check client-side
  const { error } = await supabase
    .from("proposals")
    .update({ status: newStatus })
    .eq("id", proposalId);

  if (error) return { error: error.message };

  revalidatePath("/proposals");
  return { success: true };
}
```

### Anti-Patterns to Avoid
- **Fetching votes per-card in a loop:** Do NOT query votes individually for each proposal card. Fetch all user votes for visible proposals in a single query, then match client-side.
- **Using Server Actions for vote toggle:** Server Actions trigger full re-renders via `revalidatePath`. For the vote toggle, use the browser Supabase client to avoid page flicker and enable true optimistic UI.
- **Putting admin logic in Client Components without server backup:** The admin dropdown renders client-side, but ALL mutations must go through Server Actions (or browser Supabase with RLS). Never trust the client `is_admin` flag alone -- RLS is the enforcement layer.
- **Redirecting on proposal submission error:** Unlike the auth flow, the proposal input is inline in the feed. Redirecting on error would lose the user's context. Use `useActionState` to return error messages in-place.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Relative timestamps | Custom date math | `Intl.RelativeTimeFormat` or a 2KB helper | Edge cases with timezones, "just now" vs "1 minute ago" thresholds |
| Vote count denormalization | Manual count queries on every render | Existing DB trigger `update_vote_count` | Already built in migration; trigger handles INSERT and DELETE atomically |
| Accessible dropdown menu | Custom div with click handlers | Existing `DropdownMenu` (Radix) component | Focus trapping, keyboard navigation, ARIA attributes handled by Radix |
| Form state management | useState + manual submission | `useActionState` (React 19) | Handles pending state, error state, form reset natively |
| Toast notifications | Custom notification system | Sonner (already installed) | 2.5KB, works with Server Actions, accessible |

**Key insight:** The database schema and RLS policies are already built. Phase 2 is primarily UI work with Server Actions as the glue layer. Avoid re-engineering the data layer.

## Common Pitfalls

### Pitfall 1: Stale vote_count After Optimistic Update
**What goes wrong:** The optimistic client-side count diverges from the server-side `vote_count` (updated by DB trigger). On next page load, the count "jumps" because the trigger-updated value differs from what the client showed.
**Why it happens:** The DB trigger updates `vote_count` on the proposals row, but the client only adjusts its local state by +/- 1. If the trigger update fails or if there's a race condition, they diverge.
**How to avoid:** After the client-side vote mutation succeeds, the optimistic count is good enough. The Server Component re-fetches on next navigation/refresh, which gives the authoritative `vote_count` from the DB. Do NOT try to re-fetch the count after every vote -- that defeats the purpose of optimistic UI.
**Warning signs:** Vote count flickering between values.

### Pitfall 2: Missing RLS DELETE Policy on Proposals
**What goes wrong:** Admin tries to delete a proposal (ADMN-03) but gets a 403/permission denied from Supabase.
**Why it happens:** The initial migration (`00001_initial_schema.sql`) has no DELETE policy on the proposals table. Only SELECT, INSERT, and UPDATE policies exist.
**How to avoid:** Add a new migration with the admin DELETE policy before implementing the delete feature.
**Warning signs:** `error: new row violates row-level security policy` on delete operations.

### Pitfall 3: Zod v4 Error Access Pattern
**What goes wrong:** Code accesses `error.errors` instead of `error.issues` and gets undefined.
**Why it happens:** Zod v4 changed the error structure. The project already noted this in STATE.md decisions.
**How to avoid:** Always use `result.error.issues[0]` not `result.error.errors[0]`. The existing auth code already follows this pattern. [VERIFIED: actions/auth.ts line 18]

### Pitfall 4: Supabase Client Created in Module Scope
**What goes wrong:** Server-side Supabase client is created once and shared across requests, causing cookie contamination between users.
**Why it happens:** The server client factory in `lib/supabase/server.ts` uses `cookies()` which is request-scoped. If the client is cached in module scope, it uses stale cookies.
**How to avoid:** Always call `await createClient()` inside the function that needs it, never store it in a variable outside the function. The existing code already documents this with a comment. [VERIFIED: lib/supabase/server.ts line 8]

### Pitfall 5: Rate Limit Timezone Issues
**What goes wrong:** "3 proposals per day" resets at different times for different users, or doesn't reset at all for certain timezones.
**Why it happens:** Using `new Date().setHours(0,0,0,0)` gives midnight in the server's timezone, not the user's.
**How to avoid:** Use UTC consistently. `todayStart = new Date(); todayStart.setUTCHours(0,0,0,0)` -- or use Supabase's `now()::date` for a DB-level day boundary. Since this is a fun creative tool (not financial), UTC-based days are acceptable and simpler.
**Warning signs:** Users in certain timezones can submit more or fewer than 3 proposals.

### Pitfall 6: Sonner Toaster Not in Layout
**What goes wrong:** Toast notifications never appear because there's no `<Toaster />` component rendered.
**Why it happens:** Sonner is installed as a dependency but the provider component was never added to the root layout.
**How to avoid:** Add `<Toaster />` from `sonner` to `app/layout.tsx` inside the `<ThemeProvider>`. [VERIFIED: layout.tsx has no Toaster; package.json has sonner]

## Code Examples

### Proposal Zod Schema
```typescript
// lib/validations/proposals.ts
// Follows established pattern from lib/validations/auth.ts
import { z } from "zod";

export const proposalSchema = z.object({
  text: z
    .string()
    .min(1, "The dot is waiting. Say something.")
    .max(140, "140 characters. That's all you get."),
});

export type ProposalInput = z.infer<typeof proposalSchema>;

export const versionSchema = z.object({
  versionNumber: z
    .string()
    .min(1, "Every version needs a number.")
    .max(20, "Keep it short."),
  title: z
    .string()
    .min(1, "Give this version a name.")
    .max(100, "Shorter title, please."),
});

export type VersionInput = z.infer<typeof versionSchema>;
```

### Relative Timestamp Helper
```typescript
// lib/format.ts
// Source: Intl.RelativeTimeFormat (browser built-in)
const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];

const formatter = new Intl.RelativeTimeFormat("en", { style: "narrow" });

export function timeAgo(dateStr: string): string {
  let duration = (new Date(dateStr).getTime() - Date.now()) / 1000;
  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
  return "";
}
```

### Dot Counter Component
```typescript
// components/proposals/dot-counter.tsx
interface DotCounterProps {
  count: number;
  voted: boolean;
}

export function DotCounter({ count, voted }: DotCounterProps) {
  const dotClass = voted ? "text-foreground" : "text-muted-foreground";

  if (count <= 10) {
    return (
      <span className={dotClass}>
        {"●".repeat(count) || "○"}
      </span>
    );
  }

  return (
    <span className={dotClass}>
      ● {count}
    </span>
  );
}
```

### Migration: Admin DELETE Policy
```sql
-- supabase/migrations/00002_admin_delete_proposals.sql
-- ADMN-03: Admin can delete proposals for moderation

CREATE POLICY "Admin can delete proposals"
  ON proposals FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useFormState` (React 18) | `useActionState` (React 19) | React 19 stable (2024) | Different import path and API signature [VERIFIED: Next.js docs] |
| `error.errors` (Zod v3) | `error.issues` (Zod v4) | Zod v4 (2025) | Breaking change; project already adapted [VERIFIED: actions/auth.ts] |
| `@supabase/auth-helpers-nextjs` | `@supabase/ssr` | 2024 | Project already uses @supabase/ssr [VERIFIED: package.json] |
| Manual redirect on Server Action error | `useActionState` return value | React 19 | Enables inline error display without navigation [CITED: nextjs.org/docs/app/guides/forms] |

**Deprecated/outdated:**
- `useFormState` from `react-dom`: Replaced by `useActionState` from `react` in React 19
- `@supabase/auth-helpers-nextjs`: Replaced by `@supabase/ssr` (already done in this project)

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | 8bitcn tabs component exists in registry and is compatible | Components to Install | Would need custom tab buttons instead; low risk since badge-based buttons are the fallback |
| A2 | 8bitcn dialog component exists in registry | Components to Install | Would need to use shadcn dialog directly or build inline form; low risk |
| A3 | 8bitcn textarea component may be useful for proposal input | Components to Install | Input field may be sufficient for 140-char single-line; textarea is optional |
| A4 | Browser Supabase client can insert/delete votes with current RLS | Architecture | High risk if wrong -- but RLS policies for votes INSERT and DELETE are verified in migration SQL |

## Open Questions

1. **Where does the proposal feed live in the URL structure?**
   - What we know: Currently `app/page.tsx` is a placeholder. `app/proposals/page.tsx` is the natural location.
   - What's unclear: Should the feed be at `/proposals` or replace the home page at `/`?
   - Recommendation: Create at `/proposals` for now. Phase 4 (landing page) will determine the home page layout. Add a link in the header nav.

2. **Tab state: URL params or client state?**
   - What we know: URL params enable sharing filtered views and back-button support.
   - What's unclear: Whether the overhead of `searchParams` in the Server Component is worth it for a simple filter.
   - Recommendation: Use URL search params (`?status=open`). Server Components in Next.js App Router natively receive `searchParams` as a prop. This makes the feed shareable and bookmarkable.

3. **Rate limit: Server Action count vs. DB function?**
   - What we know: Both approaches work. DB function is more tamper-proof. Server Action count is simpler.
   - What's unclear: Whether a sophisticated attacker could bypass the Server Action rate limit.
   - Recommendation: Use Server Action count query. RLS already prevents unauthenticated inserts, and the Server Action adds the rate limit check. A DB function adds migration complexity for minimal V1 security gain. If abuse becomes a problem, add a DB function later.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes (inherited) | Supabase Auth (email/password), `getUser()` check in Server Actions |
| V3 Session Management | Yes (inherited) | Supabase SSR cookie-based sessions via middleware |
| V4 Access Control | Yes | RLS policies enforce per-table permissions; `is_admin` flag for admin actions |
| V5 Input Validation | Yes | Zod schemas for proposal text (140-char max), version fields |
| V6 Cryptography | No | No new crypto operations in this phase |

### Known Threat Patterns for this Phase

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Vote manipulation (multiple votes) | Tampering | UNIQUE(user_id, proposal_id) constraint + RLS INSERT policy requiring auth.uid() = user_id |
| Rate limit bypass | Tampering | Server-side count check in Server Action (not client-enforceable); RLS as backstop |
| Admin privilege escalation | Elevation of Privilege | `is_admin` checked via RLS policy (reads `profiles` table), not via client-supplied flag |
| XSS via proposal text | Tampering | React's default JSX escaping prevents XSS; proposal text rendered as text content, never as HTML |
| Proposal deletion by non-admin | Tampering | RLS DELETE policy (new migration) checks `is_admin`; Server Action also validates |

## Sources

### Primary (HIGH confidence)
- Codebase files: `actions/auth.ts`, `lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/validations/auth.ts`, `types/database.ts`, `supabase/migrations/00001_initial_schema.sql`, `components/header.tsx`, `app/layout.tsx`, `package.json` -- all verified via direct file reads
- Context7 `/websites/nextjs` -- Server Actions, `useActionState`, `revalidatePath` patterns
- Context7 `/supabase/postgrest-js` -- Embedded resource queries, insert, delete patterns

### Secondary (MEDIUM confidence)
- Next.js official docs (nextjs.org/docs/app/guides/forms) -- `useActionState` pattern [CITED]
- Supabase RLS documentation pattern -- policy structure matches what's in migration [CITED]

### Tertiary (LOW confidence)
- None -- all findings verified against codebase or official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- everything already installed and verified in package.json
- Architecture: HIGH -- follows established patterns from Phase 1, all tables/types exist
- Pitfalls: HIGH -- verified against actual codebase (missing DELETE policy, Zod v4, Sonner gap)

**Research date:** 2026-05-18
**Valid until:** 2026-06-18 (stable stack, no fast-moving dependencies)
