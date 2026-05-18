# Technology Stack

**Project:** It All Started With a Dot
**Researched:** 2026-05-18

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js | ^16.2.6 | Full-stack React framework | Latest stable LTS. App Router is mature, Server Components reduce client JS, Server Actions eliminate API boilerplate for votes/proposals. Supabase starter template targets this. | HIGH |
| React | ^19.2.6 | UI library | Ships with Next.js 16. useActionState for form handling, use() for Suspense, compiler optimizations reduce manual memoization. | HIGH |
| TypeScript | ^5.8 or ^6.0 | Type safety | Non-negotiable for Supabase type generation (`supabase gen types`). Next.js 16 ships with TS 6 support but TS 5.8 is also fully compatible. Use whichever the starter template installs. | HIGH |
| Tailwind CSS | ^4.3.0 | Utility-first CSS | CSS-first config (no tailwind.config.js), 5x faster builds, Lightning CSS engine. 8bitcn/ui targets v4.3+. | HIGH |

### UI Components

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| 8bitcn/ui | latest (registry) | Pixel-art component library | 65+ retro-styled components built on shadcn/ui + Radix primitives. Includes gaming-specific components (Health Bar, XP Bar) that could be repurposed for vote visualizations. Copies into project (no dependency lock-in). Targets Next.js 16 + Tailwind v4.3 + React 19. | HIGH |
| shadcn/ui (CLI v4) | latest | Component scaffolding | 8bitcn uses shadcn's registry system. CLI v4 (March 2026) adds `--dry-run` and `--diff` flags for safe component additions. You install shadcn first, then add 8bitcn as a registry. | HIGH |
| Radix UI primitives | (via 8bitcn) | Accessible headless components | Brought in automatically by 8bitcn/shadcn components. Handles focus trapping, keyboard navigation, ARIA attributes. Do NOT install separately. | HIGH |

### Database & Auth

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Supabase (hosted) | Latest cloud | Auth + PostgreSQL + RLS | Managed Postgres with Row Level Security for vote integrity (one vote per user per proposal enforced at DB level). Built-in email/password auth. Free tier sufficient for V1. | HIGH |
| @supabase/supabase-js | ^2.105 | Client SDK | Stable v2 branch. v3 is in pre-release (v3.0.0-next.18) -- do NOT use v3 yet, it is unstable. | HIGH |
| @supabase/ssr | ^0.10.3 | Server-side auth for Next.js | Creates server/browser clients with cookie-based auth. Replaces deprecated auth-helpers. Note: `@supabase/server` exists but is v1 public beta for Edge Functions only -- not a replacement for @supabase/ssr in Next.js. | HIGH |

### Canvas & Rendering

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Native Canvas API | (browser built-in) | Game dot rendering | The dot is a single white circle with a pulse animation. This does NOT need Konva, PixiJS, or any canvas library. Native `canvas.getContext('2d')` + `requestAnimationFrame` is the right tool. Adding a library would be over-engineering a circle. | HIGH |

**Canvas implementation pattern:**
```typescript
// Client component with useRef + useEffect + requestAnimationFrame
'use client';
import { useRef, useEffect } from 'react';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (time: number) => {
      // Clear, draw circle with pulse based on time
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
```

**When to reconsider:** If the community proposes complex interactions (particles, physics, multi-object scenes), consider adding Konva (react-konva) for declarative canvas management, or PixiJS for WebGL-accelerated rendering. Not before.

### Form Handling & Validation

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Zod | ^4.4.3 | Schema validation | Runtime validation + TypeScript type inference. Define proposal schema once, use on client and server. The 140-char limit, rate limiting checks, and auth validation all go through Zod. | HIGH |
| React Hook Form | ^7.x | Form state management | Only if forms become complex. For the 140-char proposal input (single field), React 19's useActionState + Server Actions + Zod is sufficient without RHF. | MEDIUM |
| @hookform/resolvers | ^3.x | Zod-to-RHF bridge | Only needed if using React Hook Form. | MEDIUM |

**Recommendation:** Start with Server Actions + Zod only. The proposal form is a single text input -- RHF adds unnecessary complexity. Add RHF later only if multi-field forms emerge.

### Fonts

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Geist + Geist Mono | (via next/font) | Primary UI font | 8bitcn/ui itself uses Geist (Vercel's font). The pixel-art aesthetic comes from CSS borders/styling, not the font. Using a pixel font would make text hard to read at small sizes. Match what 8bitcn uses. | HIGH |
| Press Start 2P | (via next/font/google) | Accent/display font | Use sparingly for headings, the logo, or empty states. Not for body text (illegible below 16px). Available on Google Fonts, load via `next/font/google` for zero-CLS. | MEDIUM |

**Font strategy:**
- **Body text, inputs, buttons:** Geist (matches 8bitcn)
- **Headings, branding, "sloppy narrator" callouts:** Press Start 2P (retro accent)
- **Code/monospace:** Geist Mono

### Toast / Notifications

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Sonner | ^2.x | Toast notifications | 2.5KB gzipped, shadcn/ui's default toast library, works with Server Actions. Used for vote confirmations, proposal submission feedback, auth errors. | HIGH |

### Theme Management

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| next-themes | ^0.4.6 | Dark/light mode | Likely unnecessary for V1 since the design is strictly monochrome dark. But 8bitcn/ui ships with ThemeProvider integration, so include it for free. Default to dark, disable toggle until community proposes light mode. | MEDIUM |

### Infrastructure

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Vercel Pro | N/A | Hosting + CDN + Edge | Zero-config Next.js deployment. Edge Middleware for auth checks. Preview deployments for PRs. Domain: startedwithadot.com. | HIGH |
| Vercel Analytics | built-in | Performance monitoring | Free with Vercel Pro. Core Web Vitals tracking. | HIGH |

### Dev Tooling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| ESLint | ^9.x | Linting | Next.js 16 ships with flat config. Use next/core-web-vitals preset. | HIGH |
| Prettier | ^3.x | Formatting | Consistent code style. Add prettier-plugin-tailwindcss for class sorting. | HIGH |
| Supabase CLI | latest | Local dev, migrations, type gen | `supabase gen types typescript` for type-safe DB queries. Local Supabase for development. | HIGH |
| Biome | ^1.x | Alternative linter/formatter | 8bitcn uses Biome. Consider adopting instead of ESLint+Prettier for speed, but it is less ecosystem-integrated. Only if you want to match 8bitcn's toolchain. | LOW |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Canvas lib | Native Canvas API | react-konva, PixiJS | Overkill for a single animated circle. Adds 50-150KB of unnecessary JS. Revisit when game complexity demands it. |
| Auth | Supabase Auth | NextAuth/Auth.js, Clerk | Supabase Auth is built-in, free, and avoids a third-party dependency. Email/password is trivial with Supabase. |
| Database | Supabase PostgreSQL | PlanetScale, Neon, Turso | Supabase bundles auth+DB+RLS in one service. Splitting would add integration complexity for no benefit. |
| ORM | Supabase client (direct) | Prisma, Drizzle | Supabase's typed client + RLS is simpler than an ORM for this schema. The data model is 4 tables (users, proposals, votes, versions). Prisma adds build complexity. |
| State management | None (Server Components) | Zustand, Jotai, Redux | Server Components + Server Actions handle data fetching and mutations. No client-side global state needed for V1. |
| Forms | Server Actions + Zod | React Hook Form | Single-field form does not need RHF overhead. |
| CSS framework | Tailwind CSS v4 | CSS Modules, styled-components | 8bitcn/ui requires Tailwind. No choice here. |
| Component lib | 8bitcn/ui | Pixelact UI, custom | 8bitcn is shadcn-based (copy-paste, full control), actively maintained, 65+ components, targets exact stack (Next 16 + TW4 + React 19). Pixelact UI is React-only and less mature. |
| Toast | Sonner | react-hot-toast | Sonner is shadcn's default, same size as react-hot-toast, better Server Action integration. |
| Hosting | Vercel | Netlify, Railway, Fly.io | Next.js is built by Vercel. Zero-config deployment, edge middleware, preview deploys. No reason to fight this. |

## What NOT to Use

| Technology | Why Not |
|------------|---------|
| Prisma / Drizzle ORM | Adds build step, type generation conflicts with Supabase's own type gen, unnecessary abstraction over 4 tables |
| Redux / Zustand / Jotai | No client-side global state needed. Server Components fetch data, Server Actions mutate it. |
| Framer Motion | Heavy (30KB+). The only animation is the dot pulse (Canvas) and simple CSS transitions (Tailwind). |
| NextAuth / Auth.js | Would duplicate what Supabase Auth already provides for free. |
| tRPC | Over-engineering. Server Actions replace the need for a typed API layer in this app. |
| @supabase/supabase-js v3 | Pre-release (v3.0.0-next.18). Unstable API, breaking changes expected. Stick with v2. |
| @supabase/server | v1 public beta, designed for Edge Functions/Hono/H3 -- not for Next.js App Router. Use @supabase/ssr instead. |
| Pixel fonts for body text | Press Start 2P is illegible below 16px. Use Geist for readability, pixel font only for display. |
| Canvas libraries (V1) | react-konva, PixiJS, Phaser -- all overkill for a single circle. |

## Installation

```bash
# Create project from Supabase starter
npx create-next-app -e with-supabase startedwithadot

# Core dependencies (most come from starter template)
npm install @supabase/supabase-js @supabase/ssr sonner zod next-themes

# Initialize shadcn (if not already done by starter)
npx shadcn@latest init

# Add 8bitcn registry -- then add components individually:
# npx shadcn@latest add --registry https://www.8bitcn.com/r button
# npx shadcn@latest add --registry https://www.8bitcn.com/r card
# npx shadcn@latest add --registry https://www.8bitcn.com/r input
# npx shadcn@latest add --registry https://www.8bitcn.com/r badge
# npx shadcn@latest add --registry https://www.8bitcn.com/r progress
# npx shadcn@latest add --registry https://www.8bitcn.com/r toast
# npx shadcn@latest add --registry https://www.8bitcn.com/r dialog
# npx shadcn@latest add --registry https://www.8bitcn.com/r tabs

# Dev dependencies
npm install -D prettier prettier-plugin-tailwindcss

# Supabase CLI (if not installed globally)
npm install -D supabase
```

**Note on 8bitcn registry URL:** Verify the exact registry URL at https://www.8bitcn.com/docs before running. The pattern above follows shadcn's registry convention but the URL path may differ.

## Key Version Constraints

| Constraint | Reason |
|-----------|--------|
| Next.js 16 requires React 19 | Cannot use React 18 with Next.js 16 |
| 8bitcn targets TW v4.3+ | Do not use Tailwind v3 |
| Supabase JS v2, not v3 | v3 is pre-release, unstable |
| Node.js >= 20 | Required by Next.js 16 |

## Database Schema (Supabase PostgreSQL)

Four core tables with RLS policies:

```sql
-- profiles (extends auth.users)
-- proposals (user_id FK, text, status enum, created_at)
-- votes (user_id FK, proposal_id FK, unique constraint)
-- versions (version_number, proposal_id FK, description, created_at)
```

**Critical RLS patterns:**
- Proposals: Anyone can SELECT, authenticated users can INSERT (with rate limit check via DB function), only admin can UPDATE status
- Votes: Anyone can SELECT (count), authenticated users can INSERT/DELETE own votes, UNIQUE(user_id, proposal_id) enforces one-vote-per-user at DB level
- Versions: Anyone can SELECT, only admin can INSERT
- Always index columns used in RLS policies (user_id, proposal_id, status)

## Sources

- [Next.js 16.2 release blog](https://nextjs.org/blog/next-16-2) - HIGH confidence
- [8bitcn/ui GitHub repository](https://github.com/TheOrcDev/8bitcn-ui) - HIGH confidence
- [8bitcn/ui documentation](https://www.8bitcn.com/docs) - HIGH confidence
- [Tailwind CSS v4.3 releases](https://github.com/tailwindlabs/tailwindcss/releases) - HIGH confidence
- [shadcn/ui CLI v4 changelog](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) - HIGH confidence
- [Supabase Next.js quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) - HIGH confidence
- [@supabase/ssr npm](https://www.npmjs.com/package/@supabase/ssr) - HIGH confidence
- [@supabase/server GitHub](https://github.com/supabase/server) - HIGH confidence (verified beta status)
- [Supabase RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security) - HIGH confidence
- [Zod v4 release notes](https://zod.dev/v4) - HIGH confidence
- [Sonner vs react-hot-toast comparison](https://www.pkgpulse.com/guides/react-hot-toast-vs-react-toastify-vs-sonner-2026) - MEDIUM confidence
- [Fabric.js vs Konva vs PixiJS comparison](https://www.pkgpulse.com/blog/fabricjs-vs-konva-vs-pixijs-canvas-2d-graphics-libraries-2026) - MEDIUM confidence
- [Press Start 2P on Google Fonts](https://fonts.google.com/specimen/Press%2BStart%2B2P) - HIGH confidence
- [next-themes GitHub](https://github.com/pacocoursey/next-themes) - HIGH confidence
