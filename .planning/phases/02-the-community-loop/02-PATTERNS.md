# Phase 2: The Community Loop - Pattern Map

**Mapped:** 2026-05-18
**Files analyzed:** 14 new/modified files
**Analogs found:** 14 / 14

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `app/proposals/page.tsx` | route/page | request-response | `app/auth/sign-up/page.tsx` | role-match |
| `actions/proposals.ts` | controller | CRUD | `actions/auth.ts` | exact |
| `actions/versions.ts` | controller | CRUD | `actions/auth.ts` | exact |
| `lib/validations/proposals.ts` | utility/validation | transform | `lib/validations/auth.ts` | exact |
| `lib/format.ts` | utility | transform | (new utility, no analog) | -- |
| `components/proposals/proposal-input.tsx` | component (client) | request-response | `components/sign-up-form.tsx` | role-match |
| `components/proposals/proposal-card.tsx` | component (server) | request-response | `components/header.tsx` | role-match |
| `components/proposals/proposal-card-actions.tsx` | component (client) | CRUD | `components/logout-button.tsx` | role-match |
| `components/proposals/vote-button.tsx` | component (client) | CRUD | `components/logout-button.tsx` | role-match |
| `components/proposals/dot-counter.tsx` | component (presentational) | transform | `components/submit-button.tsx` | partial |
| `components/proposals/status-badge.tsx` | component (presentational) | transform | `components/submit-button.tsx` | partial |
| `components/proposals/status-tabs.tsx` | component (client) | request-response | (new pattern -- URL param filter) | partial |
| `components/proposals/admin-menu.tsx` | component (client) | CRUD | `components/logout-button.tsx` | role-match |
| `supabase/migrations/00002_admin_delete_proposals.sql` | migration | CRUD | `supabase/migrations/00001_initial_schema.sql` | exact |
| `app/layout.tsx` (modify) | config/layout | -- | self | exact |

## Pattern Assignments

### `actions/proposals.ts` (controller, CRUD)

**Analog:** `actions/auth.ts`

**Imports pattern** (lines 1-6):
```typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import { signUpSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
```

**Adaptation for proposals:** Replace `redirect` with state-return pattern (no redirect on error). Replace `signUpSchema` with `proposalSchema`. Add `revalidatePath` from `next/cache`.

**Core Server Action pattern** (lines 8-53):
```typescript
export async function signUp(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    username: formData.get("username") as string,
  };

  const result = signUpSchema.safeParse(rawData);

  if (!result.success) {
    const firstError = result.error.issues[0];
    return redirect(
      `/auth/sign-up?error=${encodeURIComponent(firstError.message)}`
    );
  }

  const supabase = await createClient();
  // ... DB operation ...

  if (error) {
    return redirect(
      `/auth/sign-up?error=${encodeURIComponent("Something went wrong.")}`
    );
  }
}
```

**Key adaptation:** `submitProposal` must use `useActionState` signature: `(prevState: ActionState, formData: FormData) => Promise<ActionState>` returning `{ message, success }` instead of redirecting. `updateProposalStatus` and `deleteProposal` follow the same `createClient() -> auth check -> DB mutation -> revalidatePath` structure.

**Auth check pattern** (lines 24-25 + header.tsx lines 7-10):
```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

**Error handling pattern** (lines 37-50):
```typescript
if (error) {
  // Check for specific constraint violations
  if (error.message.includes("duplicate key") || error.message.includes("...")) {
    return redirect(`/...?error=${encodeURIComponent("Specific error")}`);
  }
  return redirect(`/...?error=${encodeURIComponent("Generic error")}`);
}
```

**Adaptation:** Return `{ message, success: false }` instead of redirect for inline error display.

---

### `actions/versions.ts` (controller, CRUD)

**Analog:** `actions/auth.ts` (same patterns as `actions/proposals.ts` above)

Same Server Action structure: `"use server"` directive, `createClient()`, auth check, Zod validation, DB insert, `revalidatePath`. Admin-only -- relies on RLS but should also check `is_admin` from profile for defense-in-depth.

---

### `lib/validations/proposals.ts` (utility/validation, transform)

**Analog:** `lib/validations/auth.ts`

**Full file pattern** (lines 1-18):
```typescript
import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username needs at least 3 characters. Even the dot has standards.")
  .max(20, "20 characters max. Keep it tight.")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Letters, numbers, hyphens, underscores. That's the alphabet here."
  );

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: usernameSchema,
});

export type SignUpInput = z.infer<typeof signUpSchema>;
```

**Key patterns to replicate:**
- Narrator-voice error messages in Zod validators
- Export both the schema and the inferred TypeScript type
- Use `z.object()` wrapper for multi-field schemas

---

### `app/proposals/page.tsx` (route/page, request-response)

**Analog:** `app/auth/sign-up/page.tsx`

**Page structure pattern** (lines 1-14):
```typescript
import { SignUpForm } from "@/components/sign-up-form";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-[480px]">
        <Suspense>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  );
}
```

**Adaptation:** Proposals page is a Server Component that fetches data (unlike auth pages which are thin wrappers). Follow the data-fetching pattern from `components/header.tsx` (lines 6-19) for Supabase queries:
```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

let username: string | null = null;
if (user) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();
  username = profile?.username ?? null;
}
```

**Adaptation:** Fetch proposals with join, user votes, and is_admin flag. Pass data down to child components. Use `searchParams` for status tab filtering.

---

### `components/proposals/proposal-input.tsx` (client component, request-response)

**Analog:** `components/sign-up-form.tsx`

**"use client" + imports pattern** (lines 1-19):
```typescript
"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/8bit/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { signUpSchema, usernameSchema } from "@/lib/validations/auth";
import { signUp } from "@/actions/auth";
```

**Client-side Zod validation pattern** (lines 56-68):
```typescript
const validateField = (field: string, value: string) => {
  const errors = { ...fieldErrors };

  if (field === "username") {
    const result = usernameSchema.safeParse(value);
    if (!result.success) {
      errors.username = result.error.issues[0].message;
    } else {
      delete errors.username;
    }
  }

  setFieldErrors(errors);
};
```

**Error display pattern** (lines 140-143):
```typescript
{fieldErrors.username && (
  <p className="text-sm text-destructive">
    {fieldErrors.username}
  </p>
)}
```

**Adaptation:** Use `useActionState` (React 19) instead of manual `handleSubmit`. Single input field with character counter instead of multi-field form. Show/hide based on auth state (prop-driven).

---

### `components/proposals/proposal-card.tsx` (server component, request-response)

**Analog:** `components/header.tsx`

**Server Component + conditional rendering pattern** (lines 1-61):
```typescript
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/8bit/button";
import { LogoutButton } from "./logout-button";

export async function Header() {
  // ...data fetching...
  return (
    <header className="w-full bg-card border-b border-border h-16 flex items-center">
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center px-5">
        {/* ... */}
        {user ? (
          <>{/* authenticated UI */}</>
        ) : (
          <>{/* unauthenticated UI */}</>
        )}
      </div>
    </header>
  );
}
```

**Key patterns:**
- Named export (not default) for non-page components
- 8bitcn component imports from `@/components/ui/8bit/*`
- Conditional rendering based on auth state
- Tailwind utility classes with `text-muted-foreground`, `bg-card`, `border-border`

**Adaptation:** ProposalCard is a presentational component (receives data via props, not fetching). Wraps interactive parts in Client Component children.

---

### `components/proposals/vote-button.tsx` (client component, CRUD)

**Analog:** `components/logout-button.tsx`

**Client Component with browser Supabase client pattern** (lines 1-21):
```typescript
"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/8bit/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button onClick={logout} variant="outline" size="sm">
      Log Out
    </Button>
  );
}
```

**Key patterns:**
- `"use client"` directive
- `createClient()` from `@/lib/supabase/client` (browser client, sync call -- no `await`)
- Async handler triggered by user interaction
- Named export function component

**Adaptation:** Add `useState` for optimistic vote state. Use `supabase.from("votes").insert()` / `.delete()` instead of auth operations. Add rollback on error.

---

### `components/proposals/proposal-card-actions.tsx` (client component, CRUD)

**Analog:** `components/logout-button.tsx` (same client interaction pattern)

Wrapper Client Component that composes `VoteButton` and conditionally renders `AdminMenu`. Receives `userId`, `isAdmin`, `proposalId`, `initialVoted`, `initialCount` as props from the Server Component parent.

---

### `components/proposals/admin-menu.tsx` (client component, CRUD)

**Analog:** `components/logout-button.tsx` (client interaction) + `components/ui/dropdown-menu.tsx` (UI primitive)

**DropdownMenu usage pattern** (from `components/ui/dropdown-menu.tsx` exports):
```typescript
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
```

**Adaptation:** Trigger is a `...` button. Menu items call Server Actions (`updateProposalStatus`, `deleteProposal`). "Mark Implemented" opens a dialog for version creation.

---

### `components/proposals/dot-counter.tsx` (presentational, transform)

**Analog:** `components/submit-button.tsx`

**Simple presentational component pattern** (lines 1-22):
```typescript
"use client";

import { Button } from "@/components/ui/8bit/button";
import { type ComponentProps } from "react";

type SubmitButtonProps = ComponentProps<typeof Button> & {
  pendingText?: string;
  isPending?: boolean;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  isPending = false,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={isPending} {...props}>
      {isPending ? pendingText : children}
    </Button>
  );
}
```

**Key patterns:**
- TypeScript interface for props
- Destructured props with defaults
- Conditional rendering based on prop state

**Adaptation:** Pure display component. No client directive needed (can be Server Component). Takes `count` and `voted` props.

---

### `components/proposals/status-badge.tsx` (presentational, transform)

**Analog:** Same pattern as `dot-counter.tsx` above. Import Badge from `@/components/ui/8bit/badge`. Map status enum to styling variants and dot prefix text.

---

### `components/proposals/status-tabs.tsx` (client component, request-response)

**Analog:** Partial match -- no existing tab/filter pattern in codebase.

**Closest pattern:** The conditional rendering and navigation patterns from `components/header.tsx` (nav links with active state). For URL param management, use `useSearchParams` + `useRouter` from `next/navigation` (already used in `components/sign-up-form.tsx` line 16).

**URL param pattern from sign-up-form.tsx** (line 34):
```typescript
const searchParams = useSearchParams();
const serverError = searchParams.get("error");
```

**Adaptation:** Read `status` param, render tab buttons, update URL on tab click via `router.push`.

---

### `supabase/migrations/00002_admin_delete_proposals.sql` (migration, CRUD)

**Analog:** `supabase/migrations/00001_initial_schema.sql`

**Admin RLS policy pattern** (lines 102-110):
```sql
CREATE POLICY "Admin can update proposal status"
  ON proposals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

**Adaptation:** Copy exact pattern, change `FOR UPDATE` to `FOR DELETE`.

---

### `app/layout.tsx` (modify -- add Toaster)

**Analog:** Self (existing file)

**Current ThemeProvider block** (lines 54-59):
```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem={false}
  forcedTheme="dark"
  disableTransitionOnChange
>
  <Suspense>
    <Header />
  </Suspense>
  {children}
</ThemeProvider>
```

**Modification:** Add `import { Toaster } from "sonner"` and `<Toaster />` inside `<ThemeProvider>` after `{children}`.

---

## Shared Patterns

### Authentication Check (Server-Side)
**Source:** `actions/auth.ts` lines 24-25, `components/header.tsx` lines 7-10
**Apply to:** `actions/proposals.ts`, `actions/versions.ts`, `app/proposals/page.tsx`
```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

### Authentication Check (Email Verification)
**Source:** Inferred from `components/sign-up-form.tsx` and CONTEXT.md D-03
**Apply to:** `actions/proposals.ts` (submitProposal), vote button auth gating
```typescript
if (!user || !user.email_confirmed_at) {
  return { message: "Verify your email first.", success: false };
}
```

### Browser Supabase Client Usage
**Source:** `components/logout-button.tsx` lines 3, 11
**Apply to:** `components/proposals/vote-button.tsx`
```typescript
import { createClient } from "@/lib/supabase/client";
// Inside event handler (sync call, no await):
const supabase = createClient();
```

### Server Supabase Client Usage
**Source:** `lib/supabase/server.ts` lines 9-34
**Apply to:** All Server Actions, all Server Components
```typescript
import { createClient } from "@/lib/supabase/server";
// Inside function (async call, always await):
const supabase = await createClient();
```

### Zod Validation + Error Access
**Source:** `actions/auth.ts` lines 15-22, `lib/validations/auth.ts` lines 1-18
**Apply to:** `actions/proposals.ts`, `lib/validations/proposals.ts`
```typescript
const result = signUpSchema.safeParse(rawData);
if (!result.success) {
  const firstError = result.error.issues[0]; // Zod v4: .issues not .errors
  // handle error...
}
```

### 8bitcn Component Imports
**Source:** `components/sign-up-form.tsx` lines 4-13
**Apply to:** All new UI components
```typescript
import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import { Badge } from "@/components/ui/8bit/badge";
```

### Font Usage
**Source:** `components/header.tsx` line 29, `components/sign-up-form.tsx` line 109
**Apply to:** Headings in proposal feed
```typescript
className="font-[family-name:var(--font-press-start-2p)] text-sm"
```

### Error Display
**Source:** `components/sign-up-form.tsx` lines 140-143
**Apply to:** `proposal-input.tsx` error messages
```typescript
{error && (
  <p className="text-sm text-destructive">{error}</p>
)}
```

### Tailwind Color Tokens
**Source:** Throughout existing components
**Apply to:** All new components
- `text-foreground` -- primary text
- `text-muted-foreground` -- secondary text
- `bg-card` -- card backgrounds
- `border-border` -- borders
- `text-destructive` -- error text

### Profile Fetch Pattern (for is_admin)
**Source:** `components/header.tsx` lines 14-19
**Apply to:** `app/proposals/page.tsx` (fetch is_admin for current user)
```typescript
const { data: profile } = await supabase
  .from("profiles")
  .select("username, is_admin")
  .eq("id", user.id)
  .single();
```

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `lib/format.ts` | utility | transform | No existing utility files beyond `lib/utils.ts` (which only has `cn`). Use RESEARCH.md `Intl.RelativeTimeFormat` pattern. |

## Metadata

**Analog search scope:** `actions/`, `lib/`, `components/`, `app/`, `supabase/migrations/`, `types/`
**Files scanned:** 22 existing files read
**Pattern extraction date:** 2026-05-18
