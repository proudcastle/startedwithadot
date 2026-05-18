# Walking Skeleton -- It All Started With a Dot

**Phase:** 1
**Generated:** 2026-05-18

## Capability Proven End-to-End

A new user can sign up with email, password, and a unique username, then see their username displayed on a protected page served by the Next.js dev server -- proving the full stack (scaffold, routing, database write via trigger, auth session, styled UI) works.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16 App Router (from `npx create-next-app -e with-supabase`) | Pre-built auth flows, SSR, Server Actions, TypeScript. Starter template gives cookie-based auth, middleware, and Supabase client factories for free. |
| Data layer | Supabase PostgreSQL with Row Level Security | Managed Postgres, built-in RLS for authorization at DB level, typed client SDK. All 4 tables (profiles, proposals, votes, versions) created in Phase 1. |
| Auth | Supabase Auth (email/password) via @supabase/ssr | Cookie-based sessions, server-side token refresh in middleware, email verification support. No third-party auth provider needed. |
| Deployment target | Local dev (`npm run dev`) for Phase 1; Vercel deployment in Phase 4 | Full stack runs locally against Supabase cloud project. Vercel deployment deferred to avoid premature config. |
| Directory layout | App Router convention from Supabase starter | `app/` for routes, `components/` for UI, `actions/` for Server Actions, `lib/supabase/` for client factories, `supabase/migrations/` for SQL |
| CSS framework | Tailwind CSS v4 (CSS-first config) | Required by 8bitcn/ui. Monochrome theme via CSS variables in globals.css. No tailwind.config.ts. |
| UI components | 8bitcn/ui via shadcn registry | Pixel-art styled components built on Radix primitives. Copies into project (no runtime dependency). |
| Fonts | Press Start 2P (headings) + Geist (body) via next/font | Zero-CLS font loading. Press Start 2P for retro headings, Geist for readable body text. |

## Stack Touched in Phase 1

- [x] Project scaffold (Next.js 16 from Supabase starter, build, lint, TypeScript)
- [x] Routing -- auth routes (signup, login, forgot-password, update-password, callback, protected)
- [x] Database -- profile creation via trigger on signup (real write), profile read on protected page (real read)
- [x] UI -- signup form with username field, login form, header with auth state, all styled with 8bitcn
- [x] Deployment -- `npm run dev` exercises the full stack against Supabase cloud

## Out of Scope (Deferred to Later Slices)

- Proposals, voting, and versions UI (Phase 2 and 3 -- tables exist but no UI)
- Game canvas (Phase 3)
- Landing page, SEO, OG tags (Phase 4)
- Vercel deployment and domain configuration (Phase 4)
- Realtime subscriptions (v2)
- Social login (v2)

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- Phase 2: The Community Loop -- proposals submission, voting with dot counters, admin curation, filterable feed
- Phase 3: Game Canvas and Versions -- pulsing dot canvas, version history linked to implemented proposals
- Phase 4: Visual Identity and Launch -- landing page, SEO, narrator polish, Vercel deployment at startedwithadot.com
