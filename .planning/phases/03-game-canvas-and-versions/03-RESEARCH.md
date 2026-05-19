# Phase 3: Game Canvas and Versions - Research

**Researched:** 2026-05-18
**Domain:** HTML5 Canvas rendering in React, Supabase data fetching, Next.js Server Components
**Confidence:** HIGH

## Summary

This phase delivers two independent features: (1) a `<GameCanvas />` client component rendering a pulsing white dot on a full-width black canvas using native Canvas API + requestAnimationFrame, and (2) a `/changelog` Server Component page displaying version history from Supabase with a version indicator in the Header.

Both features are technically straightforward. The canvas work is pure client-side rendering with well-documented React patterns (useRef + useEffect + RAF cleanup). The changelog is a standard Server Component data-fetch page following the exact pattern already established in `app/proposals/page.tsx`. No new dependencies are needed -- everything uses the existing stack.

**Primary recommendation:** Build the GameCanvas as a self-contained `"use client"` component with all animation state in refs, then build the changelog page and header version indicator as standard Server Components using the established Supabase fetch pattern.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** GameCanvas is a standalone `"use client"` component with zero external dependencies -- native `canvas.getContext('2d')` only
- **D-02:** White circle (~20px radius) centered on solid black (#000000) background, anti-aliased and geometrically clean
- **D-03:** Pulse animation: radius oscillates +/-2px around 20px base over 3-second cycle using sine wave via RAF. State in useRef, NOT useState
- **D-04:** Canvas scales responsively with viewport using ResizeObserver or resize listener. Device pixel ratio handling for HiDPI
- **D-05:** Canvas placed on home page (`app/page.tsx`) replacing current placeholder text
- **D-06:** `/changelog` route as Server Component, reverse chronological, joins to profiles and proposals
- **D-07:** Each version entry shows: version number, title, date (timeAgo), linked proposal author username, description
- **D-08:** Empty state with narrator-voice copy
- **D-09:** Version number in header (right side, near nav), formatted as "v{number}" with dot, linking to /changelog
- **D-10:** Version number fetched server-side in Header with `created_at DESC LIMIT 1`

### Claude's Discretion
- Canvas pixel ratio handling approach (devicePixelRatio scaling)
- Exact responsive sizing strategy (vh-based, aspect-ratio, or container query)
- Timeline vs card layout for changelog entries
- Whether to show the linked proposal text in the changelog entry or just the author
- Header layout adjustments for version number placement
- Animation easing curve (pure sine vs. eased sine)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GAME-01 | Full-width canvas renders white circle (~20px) centered on black background | Canvas API pattern: arc() + fill() on 2d context, CSS width 100% |
| GAME-02 | Dot has subtle pulse animation (scale +/-2px, 3-second cycle) via RAF | Sine wave: `20 + 2 * Math.sin(timestamp * 2 * Math.PI / 3000)` in RAF loop |
| GAME-03 | Canvas scales responsively with viewport | ResizeObserver + devicePixelRatio scaling pattern documented below |
| GAME-04 | GameCanvas is an isolated React client component with no external dependencies | `"use client"` directive, zero imports beyond React |
| GAME-05 | Canvas uses useRef for mutable state, not useState, with proper useEffect cleanup | React docs confirm: useRef for RAF ID + animation state, cancelAnimationFrame in cleanup |
| CHNG-01 | Version history page displays all versions chronologically (newest first) | Server Component fetch with `.order('created_at', { ascending: false })` |
| CHNG-02 | Each version shows: number, title, date, linked proposal author, description | Join pattern: `.select('*, proposals(text, profiles(username))')` |
| CHNG-03 | Version number in UI corner linking to changelog | Server-side fetch in Header, single query for latest version |

</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Dot rendering + animation | Browser / Client | -- | Canvas API is browser-only; RAF loop is client-side JS |
| Canvas responsive scaling | Browser / Client | -- | ResizeObserver + devicePixelRatio are browser APIs |
| Version history data fetch | Frontend Server (SSR) | Database | Server Component fetches at request time, Supabase provides data |
| Version number in header | Frontend Server (SSR) | Database | Header is already an async Server Component doing DB queries |
| Changelog page rendering | Frontend Server (SSR) | -- | Static HTML from Server Component, no client interactivity needed |

## Standard Stack

### Core (already installed -- no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 19 | ^19.2.6 | useRef, useEffect, "use client" for canvas component | Already in project [VERIFIED: package.json] |
| Next.js 16 | ^16.2.6 | App Router, Server Components for changelog | Already in project [VERIFIED: package.json] |
| @supabase/ssr | ^0.10.3 | Server-side Supabase client for data fetching | Already in project [VERIFIED: package.json] |
| Native Canvas API | (built-in) | 2D circle rendering + animation | Per D-01: no canvas libraries [VERIFIED: CONTEXT.md] |

### Supporting (already installed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| 8bitcn Card | (local copy) | Changelog entry layout | Card/CardHeader/CardContent for each version entry |
| 8bitcn Badge | (local copy) | Version number indicator in header | Small pill showing "v0.1" |

**Installation:** None required. Zero new dependencies for this phase.

## Architecture Patterns

### System Architecture Diagram

```
HOME PAGE (app/page.tsx)
  |
  +--> <GameCanvas />  [client component]
  |      |
  |      +--> useRef(canvasRef)  --> <canvas> DOM element
  |      +--> useRef(animationRef) --> { frameId, startTime }
  |      +--> useEffect() --> RAF loop (draw pulse) --> cleanup: cancelAnimationFrame
  |      +--> useEffect() --> ResizeObserver --> resize canvas --> cleanup: disconnect
  |
HEADER (components/header.tsx) [server component]
  |
  +--> Supabase query: versions.select().order(created_at DESC).limit(1)
  +--> Render: <Link href="/changelog">v{number}</Link>
  |
CHANGELOG PAGE (app/changelog/page.tsx) [server component]
  |
  +--> Supabase query: versions.select(*, proposals(text, profiles(username)))
  |                     .order(created_at DESC)
  +--> Map versions --> <Card> entries with timeAgo(created_at)
  +--> Empty state when no versions
```

### Recommended Project Structure

```
components/
  game/
    game-canvas.tsx        # "use client" -- canvas + RAF animation
app/
  page.tsx                 # Updated: renders <GameCanvas /> instead of placeholder
  changelog/
    page.tsx               # Server Component -- version history list
components/
  header.tsx               # Updated: adds version number link
```

### Pattern 1: Canvas with RAF in React (useRef + useEffect)

**What:** Render a canvas element, store the RAF frame ID and animation state in refs, run the animation loop in useEffect with cleanup.
**When to use:** Any continuous Canvas animation in a React component.
**Example:**

```typescript
// Source: React docs (useEffect cleanup) + Canvas API (MDN)
"use client";

import { useRef, useEffect } from "react";

const BASE_RADIUS = 20;
const PULSE_AMOUNT = 2;
const CYCLE_MS = 3000;

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw(timestamp: number) {
      const radius = BASE_RADIUS + PULSE_AMOUNT * Math.sin(
        (timestamp / CYCLE_MS) * 2 * Math.PI
      );

      // Clear + draw
      ctx!.fillStyle = "#000000";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx!.beginPath();
      ctx!.arc(canvas!.width / 2, canvas!.height / 2, radius, 0, Math.PI * 2);
      ctx!.fillStyle = "#ffffff";
      ctx!.fill();

      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} />;
}
```

[VERIFIED: React docs confirm useEffect cleanup pattern for RAF - Context7 /reactjs/react.dev]

### Pattern 2: HiDPI Canvas Scaling

**What:** Scale canvas internal resolution by devicePixelRatio while keeping CSS size unchanged, so circles render sharp on Retina/HiDPI screens.
**When to use:** Any canvas on a page that may be viewed on HiDPI displays.
**Example:**

```typescript
// Source: MDN Canvas HiDPI guide [CITED: developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas]
function scaleCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, width: number, height: number) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(dpr, dpr);
}
```

### Pattern 3: ResizeObserver for Responsive Canvas

**What:** Watch the canvas container for size changes and re-scale the canvas dimensions accordingly. Preferred over `window.resize` because it responds to container resizes (layout shifts), not just window resizes.
**When to use:** Full-width canvas that must adapt to viewport changes.
**Example:**

```typescript
// Source: MDN ResizeObserver API [CITED: developer.mozilla.org/en-US/docs/Web/API/ResizeObserver]
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;
    scaleCanvas(canvas, ctx, width, height);
  });

  observer.observe(canvas.parentElement!);
  return () => observer.disconnect();
}, []);
```

### Pattern 4: Server Component Data Fetch (established project pattern)

**What:** Async Server Component that creates a Supabase client and fetches data directly.
**When to use:** Any page or component that needs database data without client interactivity.
**Example:**

```typescript
// Source: Existing codebase (app/proposals/page.tsx) [VERIFIED: codebase]
import { createClient } from "@/lib/supabase/server";

async function VersionList() {
  const supabase = await createClient();
  const { data: versions } = await supabase
    .from("versions")
    .select("*, proposals(text, profiles(username))")
    .order("created_at", { ascending: false });

  // render versions...
}
```

### Anti-Patterns to Avoid

- **useState for animation state:** Calling setState on every frame causes re-renders. Use useRef for frameId, timestamp, and computed radius. [VERIFIED: D-03, GAME-05]
- **Missing cancelAnimationFrame cleanup:** Leads to memory leaks when navigating away. The RAF callback continues running on an unmounted component. [VERIFIED: React docs useEffect cleanup]
- **Canvas size via CSS only (no width/height attributes):** Canvas will stretch/blur. Must set `canvas.width` and `canvas.height` attributes to match CSS pixel size times devicePixelRatio. [CITED: MDN Canvas sizing]
- **Forgetting ResizeObserver disconnect:** Same class of leak as missing RAF cleanup. Always disconnect in useEffect return.
- **Creating new Supabase client outside component scope:** Per existing `server.ts` comment: "Don't put this client in a global variable. Always create a new client within each function." [VERIFIED: codebase lib/supabase/server.ts]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HiDPI canvas rendering | Manual pixel ratio math scattered through draw code | Single `scaleCanvas` utility called on resize | Easy to forget dpr in one draw call, causing blurry rendering |
| Relative time formatting | Custom "X minutes ago" logic | Existing `timeAgo()` from `lib/format.ts` | Already built and tested in Phase 2 [VERIFIED: codebase] |
| Card layout for changelog | Custom styled divs | 8bitcn Card/CardHeader/CardContent | Matches project visual identity, already imported [VERIFIED: codebase] |
| Badge for version number | Custom styled span | 8bitcn Badge component | Consistent with pixel-art UI chrome [VERIFIED: codebase] |

**Key insight:** This phase has zero new dependencies because every building block (Canvas API, React hooks, Supabase client, 8bitcn components, timeAgo utility) already exists in the project or the browser.

## Common Pitfalls

### Pitfall 1: Canvas Blurry on Retina/HiDPI Displays
**What goes wrong:** Circle appears blurry or pixelated despite correct coordinates.
**Why it happens:** Canvas internal bitmap resolution defaults to CSS pixel size, which is half the physical pixel size on 2x displays.
**How to avoid:** Multiply `canvas.width` and `canvas.height` by `devicePixelRatio`, then `ctx.scale(dpr, dpr)` so drawing coordinates remain in CSS pixels.
**Warning signs:** Circle edges look soft/fuzzy on Mac or high-end phones.

### Pitfall 2: Memory Leak from Unmounted RAF Loop
**What goes wrong:** Console warning "Can't perform a React state update on an unmounted component" or animation callback continues running after navigation.
**Why it happens:** RAF callback captures canvas ref, continues after component unmounts if not cancelled.
**How to avoid:** Store frameId in useRef, call `cancelAnimationFrame(frameRef.current)` in useEffect cleanup.
**Warning signs:** Dev tools shows increasing memory usage after navigating away from home page and back.

### Pitfall 3: ResizeObserver Loop Error
**What goes wrong:** Browser throws "ResizeObserver loop completed with undelivered notifications" error.
**Why it happens:** Resize callback triggers a layout change that triggers another resize observation.
**How to avoid:** Only update canvas dimensions in the observer callback, do not change container dimensions. The canvas resize should not affect container layout if the canvas uses CSS `display: block; width: 100%`.
**Warning signs:** Console error on resize, especially in development mode.

### Pitfall 4: Supabase Join Returns Null for Proposal-less Versions
**What goes wrong:** Changelog entry crashes when accessing `version.proposals.profiles.username` on a version with no linked proposal.
**Why it happens:** `proposal_id` is nullable in the versions table. A version created without a proposal will have `proposals: null` in the join result.
**How to avoid:** Always null-check `version.proposals` before accessing nested fields. Show "No linked proposal" or similar fallback.
**Warning signs:** TypeScript should catch this if types are correct -- `proposals` is `{ text: string; profiles: { username: string } | null } | null`.

### Pitfall 5: Header Becomes Slow with Version Query
**What goes wrong:** Header adds latency to every page load.
**Why it happens:** Adding a second Supabase query to the Header Server Component (versions query alongside existing profile query).
**How to avoid:** The query is `LIMIT 1` with an index on `created_at`, so it is trivially fast. But if concerned, the Header is already wrapped in `<Suspense>` in `layout.tsx`, so it will not block the page shell.
**Warning signs:** TTFB increase on all pages. Unlikely for a single-row indexed query.

## Code Examples

### Complete GameCanvas Component Structure

```typescript
// Source: Synthesis of React docs (Context7) + MDN Canvas API
// components/game/game-canvas.tsx
"use client";

import { useRef, useEffect, useCallback } from "react";

const BASE_RADIUS = 20;
const PULSE_AMOUNT = 2;
const CYCLE_MS = 3000;

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const sizeRef = useRef({ width: 0, height: 0 });

  const scaleCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();
    sizeRef.current = { width: rect.width, height: rect.height };
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    scaleCanvas();

    function draw(timestamp: number) {
      const { width, height } = sizeRef.current;
      const radius = BASE_RADIUS + PULSE_AMOUNT * Math.sin(
        (timestamp / CYCLE_MS) * 2 * Math.PI
      );

      const dpr = window.devicePixelRatio || 1;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.fillStyle = "#000000";
      ctx!.fillRect(0, 0, width, height);
      ctx!.beginPath();
      ctx!.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
      ctx!.fillStyle = "#ffffff";
      ctx!.fill();

      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [scaleCanvas]);

  // ResizeObserver for responsive scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas?.parentElement) return;

    const observer = new ResizeObserver(() => {
      scaleCanvas();
    });
    observer.observe(canvas.parentElement);
    return () => observer.disconnect();
  }, [scaleCanvas]);

  return (
    <div className="w-full" style={{ height: "60vh" }}>
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
```

### Changelog Page Query Pattern

```typescript
// Source: Existing codebase pattern (proposals page) [VERIFIED: codebase]
// app/changelog/page.tsx
import { createClient } from "@/lib/supabase/server";
import { timeAgo } from "@/lib/format";

export default async function ChangelogPage() {
  const supabase = await createClient();
  const { data: versions } = await supabase
    .from("versions")
    .select("*, proposals(text, profiles(username))")
    .order("created_at", { ascending: false });

  if (!versions || versions.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="font-[family-name:var(--font-press-start-2p)] text-xs mb-3">
          No versions yet.
        </h2>
        <p className="text-muted-foreground">
          The dot is waiting for its first evolution.
        </p>
      </div>
    );
  }

  return (
    // Map versions to Card components...
  );
}
```

### Header Version Number Query

```typescript
// Source: Existing Header pattern [VERIFIED: codebase]
// Addition to components/header.tsx
const { data: latestVersion } = await supabase
  .from("versions")
  .select("version_number")
  .order("created_at", { ascending: false })
  .limit(1)
  .maybeSingle();
// maybeSingle() returns null instead of error when no rows exist
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| window.addEventListener("resize") | ResizeObserver | Widely supported since 2020+ | More reliable, responds to container resizes not just window |
| canvas.width = canvas.offsetWidth | canvas.width = offsetWidth * devicePixelRatio + ctx.scale(dpr) | Always needed for HiDPI | Sharp rendering on all modern screens |
| useEffect with empty deps for animation | Same pattern, React 19 unchanged | Stable | useEffect cleanup for RAF is the canonical React pattern |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `maybeSingle()` returns null (not error) when no versions exist | Header Version Number Query | Would throw runtime error on fresh DB; verify against Supabase JS v2 docs |
| A2 | ResizeObserver is available in all target browsers | Canvas responsive scaling | Would need fallback; but support is 97%+ globally since 2020 |
| A3 | Supabase nested join syntax `versions.select("*, proposals(text, profiles(username))")` works for this 3-table join | Changelog query | May need intermediate join or separate queries if Supabase PostgREST doesn't support 2-level nesting |

## Open Questions

1. **Two-level Supabase join (versions -> proposals -> profiles)**
   - What we know: Single-level joins like `proposals.select("*, profiles(username)")` work (verified in codebase). Supabase PostgREST supports nested resource embedding.
   - What's unclear: Whether `versions.select("*, proposals(text, profiles(username))")` returns the nested profile correctly in a single query.
   - Recommendation: Test at implementation time. If it fails, split into two queries or fetch proposal author separately. Low risk -- PostgREST documentation indicates nested embedding is supported. [ASSUMED]

2. **Canvas container height strategy**
   - What we know: D-04 says "e.g., 60vh or aspect-ratio-based." Claude's discretion.
   - What's unclear: Exact visual balance on the home page before Phase 4 landing page.
   - Recommendation: Use 60vh as starting point. Phase 4 will refine when building the full hero section. Simple CSS change if needed.

## Project Constraints (from CLAUDE.md)

- **Tech Stack:** Next.js App Router + TypeScript, Tailwind CSS v4, 8bitcn/ui, Supabase, HTML5 Canvas, Vercel -- all confirmed for this phase
- **Color:** Strictly monochrome (black/white/grays) -- canvas is #000 background with #fff dot, changelog uses existing monochrome UI
- **Language:** All UI text, code comments in English
- **Canvas:** No pixel-art filters on the canvas itself -- stays clean and neutral (two visual worlds: pixel-art UI chrome vs clean geometric canvas)
- **No external canvas libraries:** Explicitly forbidden per CLAUDE.md and D-01
- **Supabase JS v2 only:** v3 is pre-release, do not use
- **@supabase/ssr for server-side auth:** Not @supabase/server (which is Edge Functions beta)

## Sources

### Primary (HIGH confidence)
- [Context7 /reactjs/react.dev] - useEffect cleanup, useRef for mutable state, RAF animation patterns
- [Existing codebase] - Server Component fetch pattern, Supabase client usage, 8bitcn component APIs, Header structure, timeAgo utility, versions table schema

### Secondary (MEDIUM confidence)
- [MDN Canvas API] - devicePixelRatio scaling, arc() for circles, ResizeObserver API (training knowledge, well-established APIs) [ASSUMED: not re-fetched this session but stable browser APIs]

### Tertiary (LOW confidence)
- None -- all patterns verified against codebase or React docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - zero new dependencies, all verified in existing codebase
- Architecture: HIGH - follows exact patterns from Phase 2 (Server Components, Supabase fetching), canvas patterns from React official docs
- Pitfalls: HIGH - RAF cleanup, HiDPI scaling, ResizeObserver are well-documented concerns with known solutions

**Research date:** 2026-05-18
**Valid until:** 2026-06-18 (stable -- no fast-moving dependencies)
