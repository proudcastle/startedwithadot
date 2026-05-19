# Phase 4: Visual Identity and Launch - Research

**Researched:** 2026-05-18
**Domain:** UI polish, SEO metadata, deployment, micro-copy
**Confidence:** HIGH

## Summary

Phase 4 transforms a functional but bare application into a polished, launch-ready product. The work divides into five distinct streams: (1) creating reusable dot-DNA components (DotSeparator, DotLoader), (2) retrofitting narrator voice across all existing micro-copy, (3) expanding the home page from a heading+canvas stub into a full landing page with five sections, (4) replacing default SEO assets (favicon, OG image, metadata), and (5) Vercel deployment.

The codebase is already well-structured for this work. Auth forms, empty states, and error pages already have partial narrator voice -- some copy just needs tuning. The landing page is the largest new build: it requires server-side data fetching (top proposals, recent versions) composed with the existing GameCanvas client component. SEO uses Next.js file-based metadata conventions (opengraph-image.tsx, favicon.ico, icon.png) which are well-documented and straightforward.

**Primary recommendation:** Structure work as three waves: (1) reusable components + narrator retrofit + 404 page, (2) landing page build + footer, (3) SEO assets + deployment verification.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Home page becomes full landing page with 5 vertically stacked sections: Hero, Story, Three-step CTA, Proposals preview, Changelog preview
- **D-02:** Section separators use three dots (dot dot dot) as reusable DotSeparator component
- **D-03:** Proposals section shows top 5 proposals by votes (read-only preview), links to /proposals
- **D-04:** Changelog preview shows 3 most recent versions, links to /changelog
- **D-05:** Audit and update ALL micro-copy to sloppy-narrator voice (auth pages, empty states, errors, 404, footer)
- **D-06:** Create app/not-found.tsx 404 page with narrator voice
- **D-07:** Auth page copy updates per VISL-04
- **D-08:** Dot favicon: white circle on black square, 16x16 and 32x32
- **D-09:** Loading states use pulsing dot (CSS, not canvas) as reusable DotLoader component
- **D-10:** DotSeparator component rendering centered dots in muted color
- **D-11:** Verify existing dot usage (vote counters, version badge) matches visual DNA pattern
- **D-12:** OG image via static file or Next.js opengraph-image.tsx route
- **D-13:** OG tags: title "It All Started With a Dot", description "It's a dot. It does nothing. You decide what happens next."
- **D-14:** Favicon: white dot on black, replace existing default
- **D-15:** Footer with narrator copyright quip and links to changelog, privacy/impressum
- **D-16:** Deploy to Vercel with Supabase env vars
- **D-17:** Responsive mobile-first verification pass

### Claude's Discretion
- Exact narrator copy wording (tone guidelines provided)
- OG image approach (static vs Next.js image route)
- Footer layout details
- Landing page section spacing and visual rhythm
- Placeholder privacy/impressum pages vs just links
- Mobile-specific adjustments
- DotLoader animation parameters

### Deferred Ideas (OUT OF SCOPE)
None

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| VISL-01 | Dot as recurring visual DNA: vote indicators, status markers, favicon, loading states, section separators | DotSeparator + DotLoader components; favicon replacement; audit existing dot usage |
| VISL-02 | All micro-copy in sloppy-narrator voice | Copy audit across all pages; narrator voice guidelines documented |
| VISL-03 | Empty states have personality-driven copy | Proposals and changelog empty states already have narrator copy; verify consistency |
| VISL-04 | Auth page copy in narrator voice | Auth forms already have narrator copy; minor tuning needed |
| VISL-05 | 404 page with narrator voice | New app/not-found.tsx file; Next.js file convention documented |
| VISL-06 | Loading states use pulsing dot | DotLoader component with CSS animation; replace Suspense fallbacks |
| VISL-07 | Section separators use three dots | DotSeparator reusable component |
| LAND-01 | Hero section with canvas and narrator text | Expand existing app/page.tsx; reuse GameCanvas |
| LAND-02 | Story section with narrator tone | New section in landing page |
| LAND-03 | Three-step CTA with dot bullets | New section with links to /auth/sign-up, /proposals |
| LAND-04 | Proposals section with preview feed | Server Component fetching top 5 proposals |
| LAND-05 | Changelog preview with recent versions | Server Component fetching 3 most recent versions |
| SEO-01 | OG tags with title, description, image | Next.js Metadata API in layout.tsx; already partially configured |
| SEO-02 | Favicon as white dot on black | Replace app/favicon.ico; add app/icon.png for 32x32 |
| SEO-03 | OG image with black bg, white dot, title | opengraph-image.tsx using ImageResponse API |
| FOOT-01 | Footer with narrator copyright quip | New Footer component added to root layout |
| FOOT-02 | Footer links to changelog, privacy/impressum | Links in footer; placeholder pages for privacy/impressum |
| DEPL-01 | Deployed to Vercel with Supabase env vars | Vercel deployment (human operational step) |
| DEPL-02 | Domain startedwithadot.com configured | Vercel domain config (human operational step) |
| DEPL-03 | Responsive mobile-first across all pages | Verification pass; existing Tailwind utilities handle responsiveness |

</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Landing page sections | Frontend Server (SSR) | Browser | Server Components fetch data; GameCanvas is client-side |
| Narrator voice copy | Frontend Server (SSR) | -- | Static text in Server Components |
| DotSeparator / DotLoader | Browser / Client | -- | Pure presentational components, CSS-only |
| Favicon / OG image | CDN / Static | Frontend Server | File-based metadata served statically by Next.js |
| SEO metadata | Frontend Server (SSR) | -- | Metadata API generates head tags at render time |
| Footer | Frontend Server (SSR) | -- | Static component in root layout |
| 404 page | Frontend Server (SSR) | -- | Next.js not-found convention |
| Vercel deployment | CDN / Static | -- | Build + deploy pipeline (human operational) |

## Standard Stack

No new dependencies needed. This phase uses only what is already installed.

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | ^16.2.6 | SSR, Metadata API, ImageResponse, not-found convention | All SEO and routing features are built-in [VERIFIED: package.json] |
| React | ^19.2.6 | UI components | Already installed [VERIFIED: package.json] |
| Tailwind CSS | ^4.3.0 | Styling, animations, responsive utilities | Already installed [VERIFIED: package.json] |
| next/og (ImageResponse) | built-in | OG image generation | Ships with Next.js, no extra install [CITED: nextjs.org/docs/app/api-reference/functions/image-response] |
| Sonner | ^2.0.7 | Toast notifications | Already installed for vote/proposal feedback [VERIFIED: package.json] |

### Not Needed
| Library | Why Not |
|---------|---------|
| @vercel/og | Deprecated -- ImageResponse is now exported from `next/og` directly [CITED: nextjs.org docs] |
| Any new packages | Phase is pure UI/content/metadata work using existing stack |

## Architecture Patterns

### System Architecture Diagram

```
Landing Page (app/page.tsx - Server Component)
  |
  +---> Hero Section
  |       +---> GameCanvas (client component, existing)
  |       +---> Narrator text (static)
  |
  +---> DotSeparator (reusable)
  |
  +---> Story Section (static text)
  |
  +---> DotSeparator
  |
  +---> Three-Step CTA (static, links)
  |
  +---> DotSeparator
  |
  +---> Proposals Preview (async Server Component)
  |       +---> Supabase query: top 5 proposals by vote_count
  |       +---> ProposalCard (existing, read-only, no actions slot)
  |
  +---> DotSeparator
  |
  +---> Changelog Preview (async Server Component)
          +---> Supabase query: 3 most recent versions
          +---> VersionCard (existing)

Root Layout (app/layout.tsx)
  +---> Metadata (OG tags, title, description)
  +---> Header (existing)
  +---> {children}
  +---> Footer (NEW)
  +---> Toaster (existing)

SEO Assets (file-based)
  +---> app/favicon.ico (replaced: white dot on black)
  +---> app/icon.png (NEW: 32x32 white dot on black)
  +---> app/opengraph-image.tsx (REPLACED: dynamic generation)
  +---> app/twitter-image.png (REPLACED or symlinked)

Error Handling
  +---> app/not-found.tsx (NEW: narrator 404)
```

### Recommended Project Structure (changes only)

```
app/
  page.tsx                    # MODIFIED: full landing page
  layout.tsx                  # MODIFIED: add Footer, update metadata
  not-found.tsx               # NEW: narrator 404 page
  favicon.ico                 # REPLACED: white dot on black
  icon.png                    # NEW: 32x32 white dot on black
  opengraph-image.tsx         # REPLACED: dynamic OG image generation
  twitter-image.png           # REPLACED: matches OG image
components/
  footer.tsx                  # NEW: narrator footer
  dot-separator.tsx           # NEW: reusable "· · ·" separator
  dot-loader.tsx              # NEW: pulsing dot loading indicator
```

### Pattern 1: Next.js File-Based OG Image Generation

**What:** Use `opengraph-image.tsx` in the app directory to generate OG images at build time using JSX.
**When to use:** When OG image needs custom rendering (text + shapes).

```typescript
// Source: nextjs.org/docs/app/api-reference/functions/image-response
// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const alt = "It All Started With a Dot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* White dot */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "white",
            marginBottom: 40,
          }}
        />
        {/* Title */}
        <div style={{ color: "white", fontSize: 48 }}>
          It All Started With a Dot
        </div>
      </div>
    ),
    { ...size }
  );
}
```

### Pattern 2: Not-Found Page (Next.js App Router)

**What:** `app/not-found.tsx` automatically catches unmatched routes.
**When to use:** Global 404 handling.

```typescript
// Source: nextjs.org/docs/app/api-reference/file-conventions/not-found
// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <h1 className="font-[family-name:var(--font-press-start-2p)] text-2xl mb-4">
        404
      </h1>
      <p className="text-muted-foreground mb-6">
        This page doesn't exist. Much like this game's roadmap.
      </p>
      <Link href="/" className="text-foreground underline">
        Back to the dot
      </Link>
    </div>
  );
}
```

### Pattern 3: DotLoader with CSS Pulse Animation

**What:** A small pulsing white dot for Suspense fallbacks, using CSS animation only (no canvas).
**When to use:** Replace all "Loading..." text in Suspense fallbacks.

```typescript
// components/dot-loader.tsx
export function DotLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-4 w-4 rounded-full bg-foreground animate-pulse" />
    </div>
  );
}
```

Tailwind's built-in `animate-pulse` provides the opacity-based pulse. For a scale-based pulse matching the canvas dot, a custom keyframe can be added to globals.css:

```css
@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}
```

### Pattern 4: Landing Page with Mixed Server/Client Components

**What:** The landing page is a Server Component that fetches data and composes client components.
**When to use:** Pages that mix static content with dynamic data.

```typescript
// app/page.tsx (simplified structure)
import { Suspense } from "react";
import { GameCanvas } from "@/components/game/game-canvas";
import { DotSeparator } from "@/components/dot-separator";
import { DotLoader } from "@/components/dot-loader";

export default function Home() {
  return (
    <main>
      {/* Hero - client component inside server page */}
      <section>
        <GameCanvas />
        <div className="text-center">
          <h1>It all started with a dot.</h1>
          <p>It does nothing. You decide what happens next.</p>
        </div>
      </section>

      <DotSeparator />

      {/* Story - pure static */}
      <section>...</section>

      <DotSeparator />

      {/* Proposals preview - async fetch wrapped in Suspense */}
      <Suspense fallback={<DotLoader />}>
        <ProposalsPreview />
      </Suspense>

      <DotSeparator />

      {/* Changelog preview - async fetch wrapped in Suspense */}
      <Suspense fallback={<DotLoader />}>
        <ChangelogPreview />
      </Suspense>
    </main>
  );
}
```

### Pattern 5: Favicon Replacement

**What:** Replace `app/favicon.ico` with a custom white-dot-on-black favicon. Optionally add `app/icon.png` for higher quality.
**When to use:** Custom favicon in Next.js App Router.

The favicon.ico must be placed in `app/` root directory. Next.js automatically serves it. For the 32x32 PNG variant, place `app/icon.png` alongside it -- Next.js generates the appropriate `<link>` tags automatically. [CITED: nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons]

**Generation approach:** Create the favicon programmatically using canvas in a Node.js script, or use the ImageResponse API in an `app/icon.tsx` route for dynamic generation. For a static favicon, creating the .ico file manually or via a build script is simpler.

### Anti-Patterns to Avoid

- **Over-engineering the dot pulse:** The DotLoader is a 4-line component with Tailwind's animate-pulse. Do not create a canvas-based loader or add complex animation libraries.
- **Fetching data in client components for landing page:** The proposals preview and changelog preview must be Server Components with Suspense. Do not use useEffect+fetch patterns.
- **Breaking existing empty states:** The proposals and changelog pages already have narrator-voice empty states. This phase tunes copy, not restructures components.
- **Custom meta tag injection:** Use Next.js Metadata API exclusively. Do not manually add `<meta>` tags to `<head>`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OG image generation | Canvas/sharp/puppeteer pipeline | `next/og` ImageResponse | Built into Next.js, generates at build time, zero dependencies |
| Favicon generation | Complex multi-size .ico builder | Simple .ico file + icon.png | Only need 16x16 and 32x32; a static file is sufficient |
| CSS animations | JS animation library (framer-motion) | Tailwind `animate-pulse` or custom `@keyframes` | Single dot pulse needs 3 lines of CSS, not 30KB of library |
| SEO meta tags | Manual head manipulation | Next.js `Metadata` export + file conventions | Framework handles tag deduplication, inheritance, and type safety |
| Responsive verification | Custom viewport testing setup | Browser DevTools + Tailwind responsive classes | Existing components use Tailwind responsive utilities; verification is manual |

## Common Pitfalls

### Pitfall 1: OG Image Font Loading in ImageResponse
**What goes wrong:** Text in OG images renders with system default font instead of Press Start 2P.
**Why it happens:** ImageResponse runs in an edge/build context where Google Fonts are not available. Fonts must be loaded explicitly via fetch in the image route.
**How to avoid:** Either use a system font (simpler, recommended for V1) or fetch the font file and pass it to ImageResponse's `fonts` option. For this project, the OG image only needs the project title -- a clean sans-serif is fine.
**Warning signs:** OG image preview shows wrong font.

### Pitfall 2: Not-Found Page Must Export Default Function
**What goes wrong:** 404 page doesn't render, shows default Next.js 404.
**Why it happens:** The file must be `app/not-found.tsx` (not `app/404.tsx`) and must export a default function component. In Next.js 16, `app/global-not-found.tsx` is for unmatched routes that need full HTML; `app/not-found.tsx` uses the root layout. [CITED: nextjs.org/docs/app/api-reference/file-conventions/not-found]
**How to avoid:** Use `app/not-found.tsx` with a simple default export. It automatically inherits the root layout.
**Warning signs:** Navigating to /nonexistent shows the default Next.js 404 page.

### Pitfall 3: Landing Page Data Fetching Without Suspense
**What goes wrong:** Build fails or page doesn't render with cacheComponents enabled.
**Why it happens:** Next.js 16 with `cacheComponents: true` requires async data fetching inside Suspense boundaries. The project already uses this pattern (Phase 2/3 decisions).
**How to avoid:** Wrap ProposalsPreview and ChangelogPreview async components in Suspense with DotLoader fallback.
**Warning signs:** Build error mentioning async Server Component outside Suspense.

### Pitfall 4: Existing favicon.ico Not Replaced
**What goes wrong:** Browser shows old Vercel/Next.js favicon despite new file.
**Why it happens:** Browsers aggressively cache favicons. Also, the existing file at `app/favicon.ico` is the Supabase starter default.
**How to avoid:** Replace the file, clear browser cache, verify in incognito mode.
**Warning signs:** Old favicon visible after deployment.

### Pitfall 5: Footer Blocks Content on Mobile
**What goes wrong:** Footer pushes content off screen or overlaps on small viewports.
**Why it happens:** Fixed/sticky footer without accounting for content height.
**How to avoid:** Footer should be a normal flow element at the bottom of the layout, not fixed. Use `min-h-svh` on the main content area to push footer to bottom on short pages.
**Warning signs:** Content hidden behind footer on mobile.

### Pitfall 6: Narrator Voice Inconsistency
**What goes wrong:** Some pages have narrator voice, others don't. Tone varies wildly.
**Why it happens:** Copy is spread across 10+ files and updated piecemeal.
**How to avoid:** Do a systematic audit. The existing narrator voice is already well-established: "The dot missed you", "The dot is investigating", "The dot believes in you." New copy should match this established tone.
**Warning signs:** Reading through the app feels like different people wrote different pages.

## Code Examples

### Landing Page Proposals Preview (Server Component)

```typescript
// Inline in app/page.tsx or extracted to components/landing/proposals-preview.tsx
import { createClient } from "@/lib/supabase/server";
import { ProposalCard } from "@/components/proposals/proposal-card";
import Link from "next/link";

async function ProposalsPreview() {
  const supabase = await createClient();
  const { data: proposals } = await supabase
    .from("proposals")
    .select("*, profiles(username)")
    .neq("status", "rejected")
    .order("vote_count", { ascending: false })
    .limit(5);

  return (
    <section className="max-w-3xl mx-auto px-5 py-12">
      <h2 className="font-[family-name:var(--font-press-start-2p)] text-lg mb-6">
        Alright, what should happen next?
      </h2>
      {proposals && proposals.length > 0 ? (
        <div className="flex flex-col gap-4">
          {proposals.map((p) => (
            <ProposalCard
              key={p.id}
              proposal={{
                ...p,
                profiles: p.profiles as { username: string } | null,
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No proposals yet. Be the first to tell the dot what to do.
        </p>
      )}
      <div className="text-center mt-6">
        <Link
          href="/proposals"
          className="text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          See all proposals
        </Link>
      </div>
    </section>
  );
}
```

### Footer Component

```typescript
// components/footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>&copy; 2026 The Dot. All rights reserved. (Not that there&apos;s much to reserve.)</p>
        <nav className="flex gap-4">
          <Link href="/changelog" className="hover:text-foreground">Changelog</Link>
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/impressum" className="hover:text-foreground">Impressum</Link>
        </nav>
      </div>
    </footer>
  );
}
```

### DotSeparator Component

```typescript
// components/dot-separator.tsx
export function DotSeparator() {
  return (
    <div className="flex items-center justify-center py-8 text-muted-foreground text-lg tracking-[0.5em]" aria-hidden="true">
      &middot; &middot; &middot;
    </div>
  );
}
```

### Metadata Update (Root Layout)

```typescript
// In app/layout.tsx - update the metadata export
export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "It All Started With a Dot",
    template: "%s | startedwithadot",
  },
  description: "It's a dot. It does nothing. You decide what happens next.",
  openGraph: {
    title: "It All Started With a Dot",
    description: "It's a dot. It does nothing. You decide what happens next.",
    url: defaultUrl,
    siteName: "startedwithadot",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "It All Started With a Dot",
    description: "It's a dot. It does nothing. You decide what happens next.",
  },
};
```

## Existing Narrator Voice Audit

Current copy already in narrator voice (no changes needed):

| File | Copy | Status |
|------|------|--------|
| login-form.tsx | "Welcome back." / "The dot missed you." | Good |
| login-form.tsx | "Wrong email or password. The dot is not angry, just disappointed." | Good |
| login-form.tsx | "Something went wrong. Try again -- the dot believes in you." | Good |
| sign-up-form.tsx | "Join the experiment." / "All we need is an email and a bad idea." | Good |
| sign-up-form.tsx | "That username is taken. The dot got here first." | Good |
| forgot-password-form.tsx | "Happens to the best of us. Even dots forget things." | Good |
| update-password-form.tsx | "New password time." / "Make it something the dot would be proud of." | Good |
| auth/error/page.tsx | "Something went wrong." / "the dot believes in you" | Good |
| sign-up-success/page.tsx | "Check your email." / "The dot is waiting." | Good |
| protected/page.tsx | "You're in." / "Verify your email to unlock the fun stuff." | Good |
| proposals/page.tsx (empty) | "Nothing here yet." / "Be the first to tell the dot what to do." | Good |
| changelog/page.tsx (empty) | "No versions yet." / "The dot is waiting for its first evolution." | Good |

Copy that may need minor narrator tuning:

| File | Current Copy | Suggested Update |
|------|-------------|-----------------|
| proposals/page.tsx | "Proposals" (h1) | Could stay as-is or get a subtitle |
| proposals/page.tsx | "Loading proposals..." | Replace with DotLoader |
| changelog/page.tsx | "Loading versions..." | Replace with DotLoader |
| app/page.tsx | "This is where the dot lives." | Replaced by full landing page |
| layout.tsx metadata | "A community platform where the dot evolves..." | Update to narrator description |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@vercel/og` package for OG images | `next/og` built-in ImageResponse | Next.js 14+ | No extra dependency needed |
| `app/404.tsx` for not-found | `app/not-found.tsx` (or `global-not-found.tsx` for full HTML) | Next.js 13+ App Router | Must use correct file name |
| Manual `<link rel="icon">` in layout | File-based `app/favicon.ico` + `app/icon.png` convention | Next.js 13+ | Automatic tag generation |
| Static metadata only | `metadata` export + `generateMetadata` function | Next.js 13+ | Type-safe, composable metadata |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Existing opengraph-image.png is the Supabase starter default and should be replaced | SEO Assets | Low -- worst case we replace a custom image, but file examination shows it is a starter template file |
| A2 | Privacy and impressum pages can be placeholder pages for V1 | Footer | Low -- links need destinations; empty placeholder pages with narrator copy are acceptable |
| A3 | Vercel deployment is a human operational step, not automated via CLI | Deployment | Medium -- if CI/CD is expected, planner needs to know. Config shows no Vercel CLI installed. |

## Open Questions

1. **Favicon generation method**
   - What we know: Need white dot on black, 16x16 and 32x32, in .ico format
   - What's unclear: Whether to generate programmatically (Node script with canvas) or use an `app/icon.tsx` dynamic route
   - Recommendation: Use `app/icon.tsx` with ImageResponse for the PNG icon, keep a static `favicon.ico` (create manually or via script). Simplest approach: replace the existing favicon.ico with a pre-made file.

2. **Privacy / Impressum pages**
   - What we know: Footer links to these per FOOT-02
   - What's unclear: Whether to create actual pages or link to external/placeholder
   - Recommendation: Create minimal placeholder pages with narrator voice ("This page exists because lawyers exist.") that can be filled in later.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build/dev | Yes | v22.18.0 | -- |
| Vercel CLI | Deployment | No | -- | Deploy via Vercel Dashboard (git push) |
| next/og (ImageResponse) | OG image | Yes (built-in) | Next.js 16 | -- |

**Missing dependencies with no fallback:**
- None

**Missing dependencies with fallback:**
- Vercel CLI not installed -- deploy via Vercel Dashboard or `npx vercel` if needed

## Project Constraints (from CLAUDE.md)

- **Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, 8bitcn/ui, Supabase, HTML5 Canvas, Vercel
- **Language:** All UI text, code comments, commit messages in English
- **Color:** Strictly monochrome (black/white/grays) until community introduces color
- **Auth:** Email/password only in V1
- **Canvas:** No pixel-art filters on canvas itself
- **No new dependencies:** Phase uses existing stack only
- **Supabase JS v2, not v3:** Stick with @supabase/supabase-js ^2.x
- **Fonts:** Geist for body, Press Start 2P for headings/display only (not body text)

## Sources

### Primary (HIGH confidence)
- Next.js metadata/OG image docs via Context7 (/websites/nextjs) -- topics: metadata, opengraph-image, favicon, not-found
- Existing codebase files (app/layout.tsx, components/*.tsx, app/*/page.tsx) -- verified current state
- package.json -- verified all dependency versions

### Secondary (MEDIUM confidence)
- CLAUDE.md stack documentation -- verified against package.json

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies, everything verified in package.json
- Architecture: HIGH - patterns directly from Next.js docs and established codebase conventions
- Pitfalls: HIGH - based on documented Next.js conventions and project-specific patterns from prior phases

**Research date:** 2026-05-18
**Valid until:** 2026-06-18 (stable -- no fast-moving dependencies)
