# Phase 4: Visual Identity and Launch - Pattern Map

**Mapped:** 2026-05-18
**Files analyzed:** 12 (3 new, 9 modified)
**Analogs found:** 12 / 12

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `components/dot-separator.tsx` | component | presentational | `components/proposals/dot-counter.tsx` | role-match |
| `components/dot-loader.tsx` | component | presentational | `components/proposals/dot-counter.tsx` | role-match |
| `components/footer.tsx` | component | presentational | `components/header.tsx` | exact |
| `app/page.tsx` | page | request-response (SSR + Suspense) | `app/changelog/page.tsx` | exact |
| `app/layout.tsx` | config | request-response | self (metadata update) | exact |
| `app/not-found.tsx` | page | presentational | `app/auth/error/page.tsx` | exact |
| `app/opengraph-image.tsx` | utility | static-generation | (no analog -- Next.js convention) | no-analog |
| `app/favicon.ico` | asset | static | (binary replacement) | n/a |
| `app/icon.png` | asset | static | (binary replacement) | n/a |
| `app/globals.css` | config | n/a | self (add keyframe) | exact |
| Auth form files (narrator copy) | component | request-response | `components/login-form.tsx` | exact |
| Suspense fallbacks (proposals, changelog) | component | presentational | `app/proposals/page.tsx` lines 133-138 | exact |

## Pattern Assignments

### `components/dot-separator.tsx` (component, presentational) -- NEW

**Analog:** `components/proposals/dot-counter.tsx`

**Imports pattern** (lines 1-4):
```typescript
// Minimal -- no imports needed for a pure presentational component.
// DotCounter has zero imports. DotSeparator is even simpler.
```

**Core pattern** (lines 6-22):
```typescript
// Simple functional component with typed props, Tailwind classes, entity characters
interface DotCounterProps {
  count: number;
  voted: boolean;
}

export function DotCounter({ count, voted }: DotCounterProps) {
  const dotClass = voted ? "text-foreground" : "text-muted-foreground";
  // Uses HTML entities and Tailwind color classes
  return <span className={dotClass}>{"●".repeat(count)}</span>;
}
```

**Key conventions:**
- No `"use client"` directive (server-renderable by default)
- `text-muted-foreground` for non-interactive visual elements
- `aria-hidden="true"` should be added since dots are decorative

---

### `components/dot-loader.tsx` (component, presentational) -- NEW

**Analog:** `components/proposals/dot-counter.tsx` (structure), `components/game/game-canvas.tsx` (pulse concept)

**Core pattern** -- same minimal functional component as DotCounter:
```typescript
// No imports needed. Pure Tailwind CSS animation.
export function DotLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-4 w-4 rounded-full bg-foreground animate-pulse" />
    </div>
  );
}
```

**Animation reference from game-canvas.tsx** (lines 43-44):
```typescript
// Canvas pulse uses sine wave: BASE_RADIUS + PULSE_AMOUNT * Math.sin(...)
// DotLoader should mirror this feel using CSS @keyframes in globals.css
```

---

### `components/footer.tsx` (component, presentational) -- NEW

**Analog:** `components/header.tsx`

**Imports pattern** (lines 1-5):
```typescript
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/8bit/button";
// Footer is simpler -- only needs Link, no Supabase, no Button
```

**Layout pattern** (lines 31-77):
```typescript
// Header uses: w-full, border-b, h-16, flex items-center
// max-w-5xl mx-auto, justify-between, px-5
<header className="w-full bg-card border-b border-border h-16 flex items-center">
  <div className="w-full max-w-5xl mx-auto flex justify-between items-center px-5">
    <Link href="/" className="font-[family-name:var(--font-press-start-2p)] text-sm">
      startedwithadot
    </Link>
    <nav className="flex items-center gap-4">
      {/* nav links with consistent styling */}
      <Link
        href="/proposals"
        className="font-[family-name:var(--font-press-start-2p)] text-sm text-muted-foreground hover:text-foreground"
      >
        Proposals
      </Link>
    </nav>
  </div>
</header>
```

**Footer should mirror:**
- `w-full` + `border-t border-border` (top border instead of bottom)
- `max-w-5xl mx-auto px-5` for consistent content width
- `text-muted-foreground hover:text-foreground` for links
- Server Component (no `"use client"`)

---

### `app/page.tsx` (page, request-response + Suspense) -- MODIFIED (major expansion)

**Analog:** `app/changelog/page.tsx` (SSR page with async data fetching + Suspense)

**Imports pattern** (lines 1-8):
```typescript
import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { VersionCard, type VersionWithProposal } from "@/components/versions/version-card";
import Link from "next/link";
```

**Metadata export pattern** (lines 10-13):
```typescript
export const metadata: Metadata = {
  title: "The Evolution | startedwithadot",
  description: "Every version of the dot, decided by the community.",
};
```

**Async data-fetching component pattern** (lines 15-58):
```typescript
async function VersionList() {
  const supabase = await createClient();

  const { data: versions } = await supabase
    .from("versions")
    .select("*, proposals(text, profiles(username))")
    .order("created_at", { ascending: false });

  if (!versions || versions.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="font-[family-name:var(--font-press-start-2p)] text-xs text-foreground mb-3">
          No versions yet.
        </h2>
        <p className="text-muted-foreground mb-4">
          The dot is waiting for its first evolution. Go propose something.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {versions.map((version) => (
        <VersionCard key={version.id} version={...} />
      ))}
    </div>
  );
}
```

**Page structure with Suspense** (lines 60-81):
```typescript
export default function ChangelogPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <h1 className="font-[family-name:var(--font-press-start-2p)] text-xl text-foreground mb-2">
        The Evolution
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Every version, decided by you.
      </p>

      <Suspense
        fallback={
          <div className="text-center py-12 text-muted-foreground">
            Loading versions...
          </div>
        }
      >
        <VersionList />
      </Suspense>
    </div>
  );
}
```

**Landing page should use this exact pattern for ProposalsPreview and ChangelogPreview:**
- Define `async function ProposalsPreview()` and `async function ChangelogPreview()` as inline async Server Components
- Wrap each in `<Suspense fallback={<DotLoader />}>`
- Use `createClient()` + Supabase query inside each
- Static sections (Hero, Story, CTA) need no Suspense

**Secondary analog for proposals query:** `app/proposals/page.tsx` (lines 58-71):
```typescript
const query = supabase
  .from("proposals")
  .select("*, profiles(username)")
  .order("vote_count", { ascending: false })
  .limit(50);
// For landing preview: .neq("status", "rejected").limit(5)
```

---

### `app/layout.tsx` (config, request-response) -- MODIFIED

**Current file is the analog itself.** Modifications:

1. **Metadata update** (lines 14-18) -- expand to full OG tags:
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "It All Started With a Dot",
  description: "A community platform where the dot evolves through proposals and voting.",
};
// Replace description, add openGraph + twitter objects
```

2. **Add Footer** (line 59) -- insert `<Footer />` between `{children}` and `<Toaster />`:
```typescript
<Suspense>
  <Header />
</Suspense>
{children}
{/* ADD: <Footer /> here */}
<Toaster />
```

---

### `app/not-found.tsx` (page, presentational) -- NEW

**Analog:** `app/auth/error/page.tsx`

**Full structure** (lines 26-57):
```typescript
export default function Page({...}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-[480px]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="font-[family-name:var(--font-press-start-2p)] text-xl leading-relaxed">
                Something went wrong.
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* error message */}
              <Link href="/auth/login" className="inline-block text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">
                Try Again
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

**Key conventions to copy:**
- `min-h-svh` for full-viewport centering
- `font-[family-name:var(--font-press-start-2p)]` for heading
- `text-muted-foreground` for body text
- `underline underline-offset-4` for link styling
- 404 page is simpler: no Card needed, just centered text with Link back to "/"

---

### `app/opengraph-image.tsx` (utility, static-generation) -- NEW/REPLACED

**No existing analog** in the codebase. Uses Next.js `ImageResponse` API convention from research.

**Pattern from RESEARCH.md:**
```typescript
import { ImageResponse } from "next/og";

export const alt = "It All Started With a Dot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ background: "black", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "white", marginBottom: 40 }} />
        <div style={{ color: "white", fontSize: 48 }}>It All Started With a Dot</div>
      </div>
    ),
    { ...size }
  );
}
```

---

### `app/globals.css` (config) -- MODIFIED

**Current file is the analog itself.** Add custom keyframe after existing rules (after line 89):

```css
/* Custom dot-pulse animation for DotLoader */
@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}
```

---

### Suspense Fallback Replacements (proposals/page.tsx, changelog/page.tsx) -- MODIFIED

**Current pattern** in `app/proposals/page.tsx` (lines 133-138):
```typescript
<Suspense
  fallback={
    <div className="text-center py-12 text-muted-foreground">
      Loading proposals...
    </div>
  }
>
```

**Replace with:**
```typescript
<Suspense fallback={<DotLoader />}>
```

Same pattern in `app/changelog/page.tsx` (lines 70-75).

---

## Shared Patterns

### Press Start 2P Heading Font
**Source:** Used consistently across all files
**Apply to:** All new headings (landing page sections, 404, footer)
```typescript
className="font-[family-name:var(--font-press-start-2p)] text-xl"
// Sizes used: text-2xl (main h1), text-xl (page titles), text-lg (section headings), text-xs (small headings)
```

### Muted Foreground for Secondary Text
**Source:** All existing components
**Apply to:** All body copy, descriptions, links, separators
```typescript
className="text-muted-foreground"
// Links: "text-muted-foreground hover:text-foreground"
// With underline: "underline underline-offset-4"
```

### Content Width Container
**Source:** `components/header.tsx` line 32, `app/proposals/page.tsx` line 128, `app/changelog/page.tsx` line 62
**Apply to:** Landing page sections, footer
```typescript
// Header: max-w-5xl mx-auto px-5
// Pages: max-w-3xl mx-auto px-5
// Landing sections should use max-w-3xl for content, max-w-5xl for full-width elements
```

### Server Component Data Fetching
**Source:** `app/changelog/page.tsx` lines 15-21, `app/proposals/page.tsx` lines 23-71
**Apply to:** ProposalsPreview and ChangelogPreview in landing page
```typescript
async function DataComponent() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("table")
    .select("...")
    .order("...", { ascending: false })
    .limit(N);
  // Render or show empty state
}
```

### Empty State Pattern
**Source:** `app/changelog/page.tsx` lines 23-39, `app/proposals/page.tsx` lines 108-117
**Apply to:** Landing page preview sections (if no data)
```typescript
<div className="text-center py-12">
  <h2 className="font-[family-name:var(--font-press-start-2p)] text-xs text-foreground mb-3">
    Nothing here yet.
  </h2>
  <p className="text-muted-foreground">
    Narrator-voice message here.
  </p>
</div>
```

### Narrator Voice Tone
**Source:** Established across auth forms and empty states
**Apply to:** All new copy (404, footer, landing page, any updated micro-copy)

Existing voice examples:
- `login-form.tsx`: "The dot missed you." / "The dot is not angry, just disappointed."
- `sign-up-form.tsx`: "All we need is an email and a bad idea."
- `forgot-password-form.tsx`: "Happens to the best of us. Even dots forget things."
- `changelog/page.tsx`: "The dot is waiting for its first evolution."
- `proposals/page.tsx`: "Be the first to tell the dot what to do."

**Pattern:** Self-aware, slightly irreverent, dot-as-character. Short sentences. No exclamation marks.

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `app/opengraph-image.tsx` | utility | static-generation | No ImageResponse routes exist yet; use Next.js convention from RESEARCH.md |
| `app/favicon.ico` | asset | static | Binary file replacement; no code pattern needed |
| `app/icon.png` | asset | static | Binary file creation; no code pattern needed |

## Metadata

**Analog search scope:** `app/`, `components/`
**Files scanned:** 15 (all relevant pages and components)
**Pattern extraction date:** 2026-05-18
