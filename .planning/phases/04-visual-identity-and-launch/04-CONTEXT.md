# Phase 4: Visual Identity and Launch - Context

**Gathered:** 2026-05-19
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase transforms the functional app into a polished, launch-ready product. It covers: (1) dot as recurring visual DNA throughout the app (favicon, loading states, section separators, status markers), (2) sloppy-narrator voice across all micro-copy (auth pages, empty states, error messages, 404 page, footer), (3) a full landing page with hero canvas, story section, three-step CTA, proposals feed preview, and changelog preview, (4) SEO with OG tags, OG image, favicon, and meta descriptions, (5) a footer with narrator-style copyright, and (6) responsive mobile-first design verification. At the end of this phase, the site is deployed to Vercel at startedwithadot.com.

</domain>

<decisions>
## Implementation Decisions

### Landing Page Structure
- **D-01:** The home page (`app/page.tsx`) becomes a full landing page with vertically stacked sections: (1) Hero with game canvas and narrator text, (2) "The Story" concept explanation, (3) Three-step CTA (Register → Propose → Vote) with dot bullet points, (4) Proposals feed preview with "Alright, what should happen next?" heading, (5) Changelog preview ("The Evolution") with most recent versions. Currently has heading + GameCanvas — expand into full landing page.
- **D-02:** Section separators use three dots (· · ·) instead of horizontal lines, per VISL-07. Implement as a reusable `<DotSeparator />` component.
- **D-03:** The proposals section on the landing page shows a preview of the feed (top 5 proposals by votes) with a "See all proposals →" link to `/proposals`. Not the full interactive feed — just a read-only preview.
- **D-04:** The changelog preview shows the 3 most recent versions with a "Full changelog →" link to `/changelog`.

### Narrator Voice Retrofit
- **D-05:** Audit and update ALL micro-copy to sloppy-narrator voice. Key areas: auth pages (login, signup, forgot password, update password), empty states (proposals, changelog), error messages (auth error page, form errors), 404 page, footer. The voice is Ferris Bueller / Deadpool — informal, self-aware, slightly irreverent but never mean.
- **D-06:** Create a `app/not-found.tsx` 404 page with narrator voice: "This page doesn't exist. Much like this game's roadmap." (per VISL-05).
- **D-07:** Auth page copy updates per VISL-04: login ("Welcome back. The dot missed you." — already exists), signup (update if needed), forgot password, update password.

### Dot as Visual DNA
- **D-08:** Dot favicon: white circle on black square, 16x16 and 32x32 (per SEO-02). Replace the existing default favicon.
- **D-09:** Loading states use a pulsing dot instead of spinner (per VISL-06). Create a reusable `<DotLoader />` component — a small white dot with pulse animation (CSS, not canvas). Use it in Suspense fallbacks.
- **D-10:** Section separators: `<DotSeparator />` component rendering "· · ·" centered, text-muted-foreground color. Per VISL-07.
- **D-11:** Dots already appear in vote counters (Phase 2) and version badge (Phase 3). This phase ensures consistency — verify existing dot usage matches the visual DNA pattern.

### SEO & Meta
- **D-12:** OG image: static image with black background, white dot, and project title text. Generated as a static file or via Next.js `opengraph-image.tsx` route. Per SEO-03.
- **D-13:** OG tags in root layout metadata: title "It All Started With a Dot", description "It's a dot. It does nothing. You decide what happens next." (per SEO-01). Per-page metadata where appropriate (changelog, proposals).
- **D-14:** Favicon: white dot on black, replace the existing default. 16x16 and 32x32 sizes.

### Footer
- **D-15:** Footer component with narrator-style copyright quip (per FOOT-01): something like "© 2026 The Dot. All rights reserved. (Not that there's much to reserve.)" and links to changelog, privacy/impressum (per FOOT-02). Added to root layout below children.

### Deployment
- **D-16:** Deploy to Vercel with environment variables for Supabase (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY). Domain: startedwithadot.com.
- **D-17:** Responsive mobile-first verification across all pages. No new breakpoint work expected — Tailwind utilities and 8bitcn components are already responsive. This is a verification pass, not a build task.

### Claude's Discretion
- Exact narrator copy for each text string (tone guidelines provided, specific wording flexible)
- OG image generation approach (static file vs. Next.js image route)
- Footer layout details
- Landing page section spacing and visual rhythm
- Whether to create placeholder privacy/impressum pages or just links
- Mobile-specific adjustments if any are needed during verification
- Exact DotLoader animation parameters (size, speed)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Core value, constraints (monochrome, narrator voice, dot DNA)
- `.planning/REQUIREMENTS.md` — Full v1 requirements (VISL-01..07, LAND-01..05, SEO-01..03, FOOT-01..02, DEPL-01..03)
- `.planning/ROADMAP.md` — Phase structure, success criteria

### Prior Phase Context
- `.planning/phases/01-foundation-and-auth/01-CONTEXT.md` — Theme, fonts, auth flow decisions
- `.planning/phases/02-the-community-loop/02-CONTEXT.md` — Proposal feed layout, voting UI, admin controls
- `.planning/phases/03-game-canvas-and-versions/03-CONTEXT.md` — Canvas component, changelog, version badge

### Research (from Phase 1)
- `.planning/research/STACK.md` — Stack validation, Sonner, next-themes, Vercel deployment

### Existing Code (key files to modify/extend)
- `app/page.tsx` — Current home page (heading + GameCanvas), becomes landing page
- `app/layout.tsx` — Root layout with metadata, fonts, ThemeProvider, Header, Toaster
- `app/globals.css` — Monochrome theme CSS variables
- `components/header.tsx` — Header with nav, auth, version badge
- `components/game/game-canvas.tsx` — Game canvas component (used in hero)
- `components/proposals/proposal-card.tsx` — Proposal card (used in landing preview)
- `components/versions/version-card.tsx` — Version card (used in changelog preview)
- `app/auth/error/page.tsx` — Auth error page (narrator voice update)
- `components/login-form.tsx` — Login form (narrator voice check)
- `components/sign-up-form.tsx` — Signup form (narrator voice check)
- `components/forgot-password-form.tsx` — Password reset (narrator voice check)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/game/game-canvas.tsx` — GameCanvas for landing hero
- `components/proposals/proposal-card.tsx` — ProposalCard for landing preview
- `components/proposals/dot-counter.tsx` — DotCounter already implements dot DNA in votes
- `components/proposals/status-badge.tsx` — StatusBadge with dot prefix
- `components/versions/version-card.tsx` — VersionCard for changelog preview
- `components/versions/version-badge.tsx` — VersionBadge with dot symbol
- `lib/format.ts` — timeAgo utility
- `lib/supabase/server.ts` — Server-side Supabase client for landing page data

### Established Patterns
- Server Components for data fetching with Suspense boundaries
- 8bitcn Card/Badge/Button/Input components with monochrome theme
- Press Start 2P for headings via `font-[family-name:var(--font-press-start-2p)]`
- Narrator voice examples: "The dot is waiting.", "Quality over quantity.", "The dot is investigating."

### Integration Points
- `app/page.tsx` — Landing page expansion (biggest change)
- `app/layout.tsx` — Add Footer component, update metadata
- `app/not-found.tsx` — New 404 page
- Root layout Suspense fallbacks — replace with DotLoader
- Vercel deployment — new concern, env vars needed

</code_context>

<specifics>
## Specific Ideas

- The landing page should feel like a manifesto — "This is a dot. It does nothing. You decide what happens next." The tone is playful nihilism meets community empowerment.
- Three-step CTA: "1. Sign up ● 2. Propose ● 3. Vote" — simple, dot-punctuated, links to relevant pages
- Footer quip examples: "© 2026 The Dot. Still just a dot." or "Made by nobody. Shaped by everybody."
- 404 page: "This page doesn't exist. Much like this game's roadmap." — self-aware about the experimental nature
- The favicon should be the simplest possible representation: a white filled circle on a black square

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 4-Visual Identity and Launch*
*Context gathered: 2026-05-19*
