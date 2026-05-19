# Phase 3: Game Canvas and Versions - Context

**Gathered:** 2026-05-19
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers two distinct features: (1) a full-width game canvas rendering a single white pulsing dot on a black background, built as an isolated React client component with proper requestAnimationFrame lifecycle, and (2) a version history page displaying all versions chronologically with number, title, date, linked proposal author, and description. A version number indicator in the UI links to the changelog. At the end of this phase, users see the dot and can browse its evolution history.

</domain>

<decisions>
## Implementation Decisions

### Game Canvas Component
- **D-01:** `<GameCanvas />` is a standalone client component (`"use client"`) with zero external dependencies — no canvas libraries (react-konva, PixiJS, etc.). Uses native `canvas.getContext('2d')` only. Per PROJECT.md: "The dot is a single white circle with a pulse animation. This does NOT need a canvas library."
- **D-02:** Canvas renders a single white circle (~20px radius) centered on a solid black background (#000000). The circle is anti-aliased and geometrically clean — this is the "game canvas" world, intentionally contrasting with the pixel-art UI chrome.
- **D-03:** Pulse animation: radius oscillates ±2px around 20px base over a 3-second cycle using a sine wave. Driven by `requestAnimationFrame` with proper cleanup in `useEffect` return. Animation state (current radius, frame ID) stored in `useRef`, NOT `useState`, to avoid re-renders (GAME-05).
- **D-04:** Canvas scales responsively with the viewport — full width of its container, height proportional (e.g., 60vh or aspect-ratio-based). Uses `ResizeObserver` or window resize listener to update canvas dimensions and redraw. Device pixel ratio handling for sharp rendering on HiDPI screens.
- **D-05:** Component placed on the home page (`app/page.tsx`) as the primary visual element. This replaces the current placeholder text. Phase 4 will build the full landing page hero around it, but the canvas is functional now.

### Version History Page
- **D-06:** Dedicated `/changelog` route (`app/changelog/page.tsx`) displaying all versions in reverse chronological order (newest first). Server Component that fetches from the `versions` table with a join to `profiles` for the author username and to `proposals` for the linked proposal text.
- **D-07:** Each version entry shows: version number (e.g., "v0.1"), title, date (formatted with the existing `timeAgo` utility from `lib/format.ts`), linked proposal author username, and description. Displayed as a vertical timeline or card list using 8bitcn Card components.
- **D-08:** Empty state when no versions exist: narrator-voice copy like "No versions yet. The dot is waiting for its first evolution." with personality matching the project voice.

### Version Number in UI
- **D-09:** Current version number displayed in the header (right side, near the nav), formatted as "v{number} ●" (e.g., "v0.1 ●"). Links to `/changelog`. If no versions exist, show "v0 ●" or hide entirely.
- **D-10:** Version number fetched server-side in the Header component — a single query for the latest version by `created_at DESC LIMIT 1`.

### Claude's Discretion
- Canvas pixel ratio handling approach (devicePixelRatio scaling)
- Exact responsive sizing strategy (vh-based, aspect-ratio, or container query)
- Timeline vs card layout for changelog entries
- Whether to show the linked proposal text in the changelog entry or just the author
- Header layout adjustments for version number placement
- Animation easing curve (pure sine vs. eased sine)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Core value, constraints (canvas stays clean/neutral, no pixel-art on canvas)
- `.planning/REQUIREMENTS.md` — Full v1 requirements (GAME-01..05, CHNG-01..03 for this phase)
- `.planning/ROADMAP.md` — Phase structure, success criteria, dependency order

### Prior Phase Context
- `.planning/phases/01-foundation-and-auth/01-CONTEXT.md` — Schema decisions (D-09: versions table structure)
- `.planning/phases/02-the-community-loop/02-CONTEXT.md` — UI patterns, component structure

### Research (from Phase 1)
- `.planning/research/STACK.md` — Stack validation (native Canvas API, no libraries)
- `.planning/research/PITFALLS.md` — Canvas/React pitfalls (RAF cleanup, memory leaks on navigation)

### Existing Code
- `types/database.ts` — Versions table TypeScript types
- `actions/versions.ts` — createVersion Server Action (already exists from Phase 2)
- `lib/validations/proposals.ts` — versionSchema (already exists)
- `lib/format.ts` — timeAgo utility for relative timestamps
- `components/header.tsx` — Header component (add version number here)
- `app/page.tsx` — Current home page placeholder (canvas goes here)
- `components/proposals/admin-menu.tsx` — Version creation dialog (already wired)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/format.ts` — `timeAgo()` utility for changelog date formatting
- `components/ui/8bit/card.tsx` — 8bitcn Card for changelog entries
- `components/ui/8bit/badge.tsx` — Badge for version number display
- `actions/versions.ts` — Version creation already handled by Phase 2
- `types/database.ts` — Full typed schema for versions table

### Established Patterns
- Server Components fetching Supabase data with `createClient()` from `lib/supabase/server.ts`
- Font usage: `font-[family-name:var(--font-press-start-2p)]` for headings
- `"use client"` components with `useRef` for mutable state (see GAME-05 requirement)
- Profile join pattern: `.select("*, profiles(username)")` (used in proposals feed)

### Integration Points
- `app/page.tsx` — Canvas replaces placeholder content
- `components/header.tsx` — Version number link added to nav
- Header already fetches user profile; version query adds one more DB call
- `/changelog` is a new route, no conflicts with existing routes

</code_context>

<specifics>
## Specific Ideas

- The canvas is the "game" — it should feel alive even with just one dot. The pulse should be subtle but noticeable, like breathing.
- Two visual worlds (from PROJECT.md): UI chrome is pixel-art (8bitcn, borders, retro), canvas is clean and geometric. The canvas background is pure #000000, the dot is anti-aliased white.
- Version number in header reinforces that the dot evolves — even "v0 ●" tells a story before any versions exist.
- Changelog entries should feel like a history book of the dot's evolution — each version is a milestone the community decided.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 3-Game Canvas and Versions*
*Context gathered: 2026-05-19*
