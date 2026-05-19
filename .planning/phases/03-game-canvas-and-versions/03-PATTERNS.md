# Phase 3: Game Canvas and Versions - Pattern Map

**Mapped:** 2026-05-18
**Files analyzed:** 4 (1 new, 3 modified)
**Analogs found:** 4 / 4

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `components/game/game-canvas.tsx` (NEW) | component | streaming (RAF animation loop) | `components/proposals/vote-button.tsx` | role-match |
| `app/changelog/page.tsx` (NEW) | component (page) | request-response (SSR data fetch) | `app/proposals/page.tsx` | exact |
| `components/header.tsx` (MODIFY) | component (layout) | request-response (SSR data fetch) | self (existing file) | exact |
| `app/page.tsx` (MODIFY) | component (page) | static render | self (existing file) | exact |

## Pattern Assignments

### `components/game/game-canvas.tsx` (component, streaming/animation)

**Analog:** `components/proposals/vote-button.tsx` (closest `"use client"` component with hooks)

**Imports pattern** (vote-button.tsx lines 1-6):
```typescript
"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { DotCounter } from "./dot-counter";
import { toast } from "sonner";
```

**Adaptation for GameCanvas:** Replace with React-only imports. No Supabase, no external deps.
```typescript
"use client";

import { useRef, useEffect, useCallback } from "react";
```

**Core pattern -- `"use client"` component with typed props and hooks** (vote-button.tsx lines 8-20):
```typescript
interface VoteButtonProps {
  proposalId: string;
  userId: string | null;
  initialVoted: boolean;
  initialCount: number;
}

export function VoteButton({
  proposalId,
  userId,
  initialVoted,
  initialCount,
}: VoteButtonProps) {
```

**Key difference for GameCanvas:** No props needed (self-contained). Use `useRef` instead of `useState` for mutable animation state per D-03/GAME-05. The vote-button uses `useState` + `useCallback` -- GameCanvas should use `useRef` + `useEffect` with cleanup.

**No direct analog exists** for the RAF animation loop pattern. Use the RESEARCH.md code example (lines 302-382) as the primary pattern source.

---

### `app/changelog/page.tsx` (page, request-response SSR)

**Analog:** `app/proposals/page.tsx`

**Imports pattern** (lines 1-6):
```typescript
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ProposalInput } from "@/components/proposals/proposal-input";
import { ProposalCard } from "@/components/proposals/proposal-card";
import { ProposalCardActions } from "@/components/proposals/proposal-card-actions";
import { StatusTabs } from "@/components/proposals/status-tabs";
```

**Server Component data fetch pattern** (lines 23-24, 58-71):
```typescript
const supabase = await createClient();

// Build query
const query = supabase
  .from("proposals")
  .select("*, profiles(username)")
  .order("vote_count", { ascending: false })
  .limit(50);

const { data: proposals } = await query;
```

**Adaptation for changelog:** Query `versions` table instead of `proposals`, with nested join to proposals and profiles:
```typescript
const { data: versions } = await supabase
  .from("versions")
  .select("*, proposals(text, profiles(username))")
  .order("created_at", { ascending: false });
```

**Empty state pattern** (lines 109-117):
```typescript
<div className="text-center py-12">
  <h2 className="font-[family-name:var(--font-press-start-2p)] text-xs text-foreground mb-3">
    Nothing here yet.
  </h2>
  <p className="text-muted-foreground">
    Be the first to tell the dot what to do.
  </p>
</div>
```

**Adaptation:** Change copy to narrator-voice per D-08: "No versions yet. The dot is waiting for its first evolution."

**Page wrapper with Suspense pattern** (lines 122-144):
```typescript
export default function ProposalsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <h1 className="font-[family-name:var(--font-press-start-2p)] text-xl text-foreground mb-6">
        Proposals
      </h1>

      <Suspense
        fallback={
          <div className="text-center py-12 text-muted-foreground">
            Loading proposals...
          </div>
        }
      >
        <ProposalFeed searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
```

**Adaptation:** Changelog page is simpler (no searchParams, no auth checks). Can inline the data fetch directly in the default export async function, with Suspense only if splitting into a child component.

**Card rendering pattern from `components/proposals/proposal-card.tsx`** (lines 1-44):
```typescript
import { Card, CardContent } from "@/components/ui/8bit/card";
import { StatusBadge } from "./status-badge";
import { timeAgo } from "@/lib/format";
import type { Database } from "@/types/database";
import type { ReactNode } from "react";

// ...

export function ProposalCard({ proposal, children, actions }: ProposalCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <StatusBadge status={proposal.status} />
        </div>
        <p className="text-base text-foreground mb-3">{proposal.text}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>@{proposal.profiles?.username ?? "unknown"}</span>
            <span>.</span>
            <span>{timeAgo(proposal.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Adaptation:** Each changelog entry uses the same Card + CardContent structure. Replace proposal-specific fields with version fields (version_number, title, description, timeAgo(created_at), linked proposal author). Null-check `version.proposals` before accessing nested fields (per Pitfall 4).

---

### `components/header.tsx` (MODIFY -- add version number)

**Analog:** self (existing file, lines 1-67)

**Existing Supabase query pattern** (lines 7-19):
```typescript
const supabase = await createClient();
const {
  data: { user },
} = await supabase.auth.getUser();

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

**Version query to add** (after existing profile query, before return):
```typescript
const { data: latestVersion } = await supabase
  .from("versions")
  .select("version_number")
  .order("created_at", { ascending: false })
  .limit(1)
  .maybeSingle();
```

**Nav link pattern to follow** (lines 32-37):
```typescript
<nav className="flex items-center gap-4">
  <Link
    href="/proposals"
    className="font-[family-name:var(--font-press-start-2p)] text-sm text-muted-foreground hover:text-foreground"
  >
    Proposals
  </Link>
```

**Adaptation:** Add a version indicator link (Badge or plain Link) before the Proposals link. Use Badge component from `components/ui/8bit/badge.tsx` for the "v{number}" pill, or a simple styled Link matching existing nav items.

**Badge usage pattern from `components/proposals/status-badge.tsx`** (lines 1-25):
```typescript
import { Badge } from "@/components/ui/8bit/badge";

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="outline">
      <span className="font-[family-name:var(--font-press-start-2p)] text-xs">
        . {STATUS_LABELS[status]}
      </span>
    </Badge>
  );
}
```

---

### `app/page.tsx` (MODIFY -- add GameCanvas)

**Analog:** self (existing file, lines 1-14)

**Current structure:**
```typescript
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <h1 className="font-[family-name:var(--font-press-start-2p)] text-2xl leading-relaxed">
          It all started with a dot.
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          This is where the dot lives. More coming soon.
        </p>
      </div>
    </main>
  );
}
```

**Adaptation:** Replace the placeholder `<div>` with `<GameCanvas />`. Import the new client component. Per D-05, this is the primary visual element. The heading/text may be kept above or below the canvas, or removed -- Phase 4 builds the full hero.

---

## Shared Patterns

### Server-Side Supabase Client
**Source:** `lib/supabase/server.ts` (used in `app/proposals/page.tsx` line 2, `components/header.tsx` line 2)
**Apply to:** `app/changelog/page.tsx`, `components/header.tsx` (already uses it)
```typescript
import { createClient } from "@/lib/supabase/server";

// Inside async Server Component:
const supabase = await createClient();
```

### Font Classes
**Source:** `app/proposals/page.tsx` line 129, `components/header.tsx` line 27
**Apply to:** All new UI elements (changelog heading, empty state, version badge)
```typescript
// Heading / display text:
className="font-[family-name:var(--font-press-start-2p)] text-xl text-foreground"

// Body / muted text:
className="text-muted-foreground"
```

### timeAgo Utility
**Source:** `lib/format.ts` (used in `components/proposals/proposal-card.tsx` line 3)
**Apply to:** `app/changelog/page.tsx` for version date formatting
```typescript
import { timeAgo } from "@/lib/format";

// Usage:
<span>{timeAgo(version.created_at)}</span>
```

### 8bitcn Card Component
**Source:** `components/ui/8bit/card.tsx` (used in `components/proposals/proposal-card.tsx` line 1)
**Apply to:** `app/changelog/page.tsx` for version entries
```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/8bit/card";
```

### 8bitcn Badge Component
**Source:** `components/ui/8bit/badge.tsx` (used in `components/proposals/status-badge.tsx` line 1)
**Apply to:** `components/header.tsx` for version number indicator
```typescript
import { Badge } from "@/components/ui/8bit/badge";
```

### Database Types
**Source:** `types/database.ts` (used in `components/proposals/proposal-card.tsx` line 4)
**Apply to:** `app/changelog/page.tsx` for version type annotations
```typescript
import type { Database } from "@/types/database";

type Version = Database["public"]["Tables"]["versions"]["Row"];
```

### Null-Safe Profile Access
**Source:** `components/proposals/proposal-card.tsx` line 35
**Apply to:** `app/changelog/page.tsx` -- same pattern for nested join results
```typescript
// Proposal card pattern:
<span>@{proposal.profiles?.username ?? "unknown"}</span>

// Changelog adaptation (two-level join):
<span>@{version.proposals?.profiles?.username ?? "unknown"}</span>
```

### Page Layout Container
**Source:** `app/proposals/page.tsx` line 128
**Apply to:** `app/changelog/page.tsx`
```typescript
<div className="max-w-3xl mx-auto px-5 py-12">
```

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `components/game/game-canvas.tsx` | component | streaming (RAF loop) | No existing client component uses Canvas API, requestAnimationFrame, useRef for animation state, or ResizeObserver. This is the first canvas/animation component in the codebase. Use RESEARCH.md code examples (lines 302-382) as the primary pattern source. |

## Metadata

**Analog search scope:** `app/`, `components/`, `lib/`, `actions/`, `types/`
**Files scanned:** 31 source files (excluding node_modules)
**Pattern extraction date:** 2026-05-18
