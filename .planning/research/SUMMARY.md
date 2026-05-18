# Project Research Summary

**Project:** It All Started With a Dot
**Domain:** Community-driven collaborative game platform (proposal/voting/evolving canvas)
**Researched:** 2026-05-18
**Confidence:** HIGH

## Executive Summary

"It All Started With a Dot" is a community platform where users propose changes to a game canvas (starting as a single pulsing dot), vote on proposals, and watch the creator implement winning ideas as versioned updates. The closest analogies are r/place (community-driven canvas) crossed with Canny/Feature Upvote (proposal voting boards), wrapped in a pixel-art aesthetic with a distinctive "sloppy narrator" voice. Experts build this type of product by prioritizing the feedback loop (propose, vote, ship, prove it shipped) above all visual polish, because community platforms live or die on whether users feel heard.

The recommended approach is a single Next.js 16 App Router application backed by Supabase (PostgreSQL + Auth + Row Level Security), deployed on Vercel. The UI uses 8bitcn/ui (a shadcn-compatible pixel-art component library) for the chrome, while the game canvas is a deliberately isolated HTML5 Canvas component using native browser APIs. Server Components handle all data fetching, Server Actions handle all mutations, and Supabase RLS enforces authorization at the database layer. This stack is well-documented, tightly integrated, and avoids unnecessary abstractions -- no ORM, no state management library, no canvas framework, no API layer beyond Server Actions.

The primary risks are community-side, not technical. The biggest threat is the "graveyard board" -- proposals that go unanswered erode trust and kill engagement permanently. Vote manipulation via throwaway accounts is an existential risk for a platform whose identity is "the community decides." On the technical side, Supabase RLS misconfiguration is the most dangerous silent failure (data exposure or silently empty queries), and the canvas component's imperative API requires disciplined cleanup to avoid memory leaks. All of these are preventable with upfront discipline in Phase 1.

## Key Findings

### Recommended Stack

The stack is deliberately minimal and tightly coupled: Next.js 16 (App Router, Server Components, Server Actions), React 19, TypeScript 5.8+, Tailwind CSS v4.3, 8bitcn/ui via shadcn registry, Supabase (hosted PostgreSQL + Auth + RLS), native HTML5 Canvas API, Zod for validation, Sonner for toasts, and Vercel Pro for deployment. Everything flows from the Supabase Next.js Starter Template (`npx create-next-app -e with-supabase`), which provides pre-built auth flows.

**Core technologies:**
- **Next.js 16 + React 19**: Server Components eliminate client-side data fetching; Server Actions eliminate API boilerplate for all mutations
- **Supabase (PostgreSQL + Auth + RLS)**: Single service for database, authentication, and authorization; RLS enforces one-vote-per-user at the DB level
- **8bitcn/ui**: 65+ pixel-art components built on shadcn/Radix; copies into project with no lock-in; targets exact stack versions
- **Native Canvas API**: A single animated circle does not justify a canvas library; 50-150KB saved
- **Zod**: Schema validation shared between client and server; enforces 140-char limit and rate limiting
- **Vercel Pro**: Zero-config Next.js deployment with Edge Middleware for auth checks

**Critical version constraints:** Next.js 16 requires React 19 and Node >= 20. 8bitcn targets Tailwind v4.3+. Supabase JS must be v2 (v3 is pre-release and unstable). Use `@supabase/ssr`, not the deprecated `auth-helpers` or the beta `@supabase/server`.

### Expected Features

**Must have (table stakes):**
- Game canvas with visible pulsing dot -- the literal product
- User authentication (email/password, email verification required)
- Proposal submission (140-char, inline, rate-limited to 3/day)
- Upvoting (one per user per proposal, toggle-able, dot-based counters)
- Vote count visibility (public counts, social proof)
- Proposal status lifecycle (Open/Accepted/Implemented/Rejected)
- Version history / changelog linked to proposals
- Empty state handling with sloppy-narrator voice
- Sort/filter proposals (newest, most voted, status)
- Basic moderation (admin can hide/reject)
- Mobile responsiveness

**Should have (differentiators):**
- Dot-as-visual-DNA (dots in vote counters, favicon, separators, loading states)
- Sloppy-narrator voice across all micro-copy (errors, tooltips, empty states)
- Monochrome-until-community-earns-color (zero-cost design statement)
- Proposal-to-version linkage with author attribution
- Pixel-art UI shell contrasted with clean game canvas

**Defer (v2+):**
- Real-time voting (WebSocket/Supabase Realtime)
- Notification system
- Social login (Google, Discord, GitHub)
- Gamification (badges, points, leaderboards)
- Comments on proposals
- Public user profiles
- Admin dashboard (use Supabase Dashboard for V1)

### Architecture Approach

Single Next.js App Router application with three clear layers: a community layer (Server Components for reads, Server Actions for writes), an auth/admin layer (Middleware + Supabase SSR + RLS), and an isolated game canvas layer (Client Component with `useRef` + `requestAnimationFrame`, zero React re-renders). All layers share one Supabase backend. The key architectural principle is "Server Components by default, `'use client'` only at leaf nodes that need interactivity."

**Major components:**
1. **`middleware.ts`** -- Auth token refresh on navigation (restrictive matcher excluding static assets)
2. **`<GameCanvas />`** -- Isolated Client Component; all state in refs, RAF loop, receives version config as props
3. **`<ProposalFeed />`** -- Server Component listing proposals with vote counts; renders `<VoteButton />` children
4. **`<VoteButton />`** -- Client Component with `useOptimistic` for instant vote feedback
5. **`<ProposalForm />`** -- Client Component with 140-char input, submits via Server Action
6. **Server Actions** -- All write operations (vote, propose, status change, version create) go through Supabase server client with RLS enforcement
7. **Supabase RLS policies** -- Single source of truth for authorization; application code does UI-level checks only

### Critical Pitfalls

1. **Stale Proposal Graveyard** -- Unanswered proposals destroy community trust. Mitigation: admin reviews weekly, status changes require a reason, archive inactive proposals after 30 days.
2. **Vote Manipulation** -- Throwaway accounts undermine legitimacy. Mitigation: require email verification before voting, rate-limit account creation by IP, enforce voting velocity limits.
3. **Supabase RLS Misconfiguration** -- Tables without RLS enabled are fully exposed; tables with RLS but no policies silently return empty. Mitigation: enable RLS in every migration, write policies before application code, test from client SDK never SQL Editor, use `getUser()` not `getSession()`.
4. **Canvas Memory Leaks** -- Missing `useEffect` cleanup causes stacked RAF loops and climbing memory. Mitigation: always return cleanup function, store animation ID in ref, test by navigating away and back repeatedly.
5. **Building Features Before the Loop Works** -- Spending time on canvas polish while the propose/vote/implement cycle is incomplete. Mitigation: enforce strict build order; proposals and voting must be functional before any canvas work beyond basic dot.

## Implications for Roadmap

### Phase 1: Foundation and Auth
**Rationale:** Every feature depends on the database schema and authentication. The Supabase starter template provides auth scaffolding, but RLS policies and the data model must be correct from the first migration. This is where the most dangerous pitfalls (RLS misconfiguration, middleware thrashing) are introduced or prevented.
**Delivers:** Working Supabase project with schema (profiles, proposals, votes, versions), RLS policies on all tables, auth flow (signup with email verification, login, logout), middleware with restrictive matcher, Supabase client factories (server + browser).
**Addresses:** User authentication (table stakes), email verification (vote manipulation prevention)
**Avoids:** RLS misconfiguration pitfall, middleware auth thrashing pitfall

### Phase 2: The Community Loop
**Rationale:** The proposal/vote cycle is the product. Nothing else matters until this works end-to-end. This phase must be completed and manually tested as a full loop (register, propose, vote, admin changes status) before any canvas or visual work.
**Delivers:** Proposal submission with 140-char limit and rate limiting, proposal feed (Server Component), vote toggle with optimistic UI, proposal status lifecycle (admin controls), basic moderation (hide/reject).
**Addresses:** Proposal submission, upvoting, vote count visibility, rate limiting, proposal status lifecycle, basic moderation, sort/filter, empty states
**Avoids:** "Building features before the community loop works" pitfall, stale proposal graveyard (status lifecycle in place from day one)

### Phase 3: Game Canvas and Version System
**Rationale:** The canvas is independent of the community layer and could theoretically be built in parallel, but the version system depends on proposals existing. Grouping canvas + versions here ensures the dot is not over-invested before the loop works. The version-to-proposal linkage is enforced as a required FK from the start.
**Delivers:** `<GameCanvas />` with pulsing dot animation (proper RAF cleanup), version config type, version creation by admin (linked to proposals), changelog display.
**Addresses:** Game canvas (table stakes), version history, proposal-to-version linkage (differentiator)
**Avoids:** Canvas memory leak pitfall, version history without audit trail pitfall

### Phase 4: Visual Identity and Polish
**Rationale:** The 8bitcn/ui integration, dot-as-visual-DNA, sloppy-narrator copy, and mobile polish are cross-cutting concerns that touch every component. Applying them last avoids rework and ensures the underlying mechanics are solid.
**Delivers:** 8bitcn/ui component integration across all UI, dot-based vote visualization, sloppy-narrator copy in all text strings, SEO (OG tags, favicon, meta), mobile responsive pass, monochrome theme enforcement.
**Addresses:** Dot-as-visual-DNA (differentiator), sloppy-narrator voice (differentiator), pixel-art UI shell (differentiator), mobile responsiveness (table stakes)
**Avoids:** Over-investing in visuals before mechanics work

### Phase 5: Hardening and Launch Prep
**Rationale:** Pre-launch hardening addresses the remaining pitfalls and "looks done but isn't" items. Cold start seeding, content moderation basics, and the full checklist verification happen here.
**Delivers:** Email verification enforcement verified, vote un-toggle verified, rate limit enforcement verified, RLS audit complete, canvas cleanup verified, username uniqueness verified, error states verified, cold start content seeded (3-5 creator proposals, v0.1 changelog entry), basic profanity filter on proposals.
**Addresses:** Cold start strategy (critical success factor), content moderation (table stakes)
**Avoids:** Community trust collapse from launch-day issues

### Phase Ordering Rationale

- **Foundation before features**: RLS policies and auth are prerequisites for every user-facing feature. Getting them wrong is the highest-cost pitfall.
- **Community loop before canvas**: Research unanimously shows that community platforms die from broken feedback loops, not from missing visual features. The canvas is content; the proposal system is the product.
- **Version system with canvas**: The version-to-proposal link is what closes the community loop ("your idea became real"). It must ship soon after the loop works.
- **Polish last**: 8bitcn integration, narrator copy, and mobile polish touch every component. Doing them last avoids rework and lets copy be written against real UI states.
- **Hardening as final gate**: The "looks done but isn't" checklist from PITFALLS.md is the launch gate. Every item must be verified.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Supabase RLS policy design for the specific schema (profiles, proposals, votes, versions) -- the research identifies patterns but the exact policies need careful per-table planning.
- **Phase 3:** Canvas component architecture if game complexity grows beyond a pulsing dot -- currently well-scoped but any community proposal for complex interactions changes the calculus.

Phases with standard patterns (skip research-phase):
- **Phase 2:** Standard CRUD with Server Actions + Supabase. Well-documented, established patterns from official docs and starter template.
- **Phase 4:** 8bitcn/ui integration follows shadcn registry patterns. Tailwind v4 theming is well-documented.
- **Phase 5:** Verification and testing -- no novel research needed, just disciplined execution of the checklist.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies verified against official docs and current releases. Version constraints are clear. No speculative choices. |
| Features | MEDIUM-HIGH | Table stakes well-supported by feature voting platform research. Differentiators are design decisions, not technical unknowns. Cold start strategy is the main uncertainty. |
| Architecture | HIGH | Server Components + Server Actions + Supabase RLS is the officially recommended pattern from both Next.js and Supabase docs. Canvas isolation pattern is well-established. |
| Pitfalls | HIGH | Every pitfall is sourced from documented failure modes in either Supabase, Next.js, or community platform domains. Prevention strategies are concrete. |

**Overall confidence:** HIGH

### Gaps to Address

- **Cold start engagement**: Research identifies it as the biggest risk but there is no validated playbook for seeding a community of this type. The creator must commit to weekly proposal reviews and active seeding. This is an operational discipline, not a technical solution.
- **8bitcn/ui component coverage**: The library has 65+ components but may not cover every UI need. Audit available components against the design during Phase 4 planning; plan custom builds for gaps.
- **Vote count performance at scale**: The research flags N+1 query patterns on the proposal list page. Denormalized counts are acceptable for MVP but a materialized view or trigger should be planned for Phase 2.
- **Content moderation depth**: Basic profanity filtering is planned for Phase 5, but community platform research shows moderation needs grow non-linearly. If the platform gains traction, moderation tooling becomes a priority quickly.

## Sources

### Primary (HIGH confidence)
- Context7: Next.js `/vercel/next.js` -- Server Actions, App Router, middleware patterns
- Context7: Supabase `/supabase/supabase` -- Auth, RLS, server client, SSR
- [Next.js 16.2 release blog](https://nextjs.org/blog/next-16-2)
- [Supabase Next.js quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Auth server-side setup](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [8bitcn/ui documentation](https://www.8bitcn.com/docs)
- [Zod v4 release notes](https://zod.dev/v4)

### Secondary (MEDIUM confidence)
- [Canny feature voting best practices](https://canny.io/blog/feature-voting-best-practices/)
- [Savio feature voting pitfalls](https://www.savio.io/blog/feature-voting/)
- [Engineering behind r/place](https://saikumarchintada.medium.com/engineering-behind-r-place-a7eb53bcf5f1)
- [Reddit on building/scaling r/place](https://www.fastly.com/blog/reddit-on-building-scaling-rplace)
- [Twitch Plays Pokemon governance lessons](https://medium.com/web3-australia/lessons-in-decentralised-from-governance-from-twitch-plays-pokemon-e24fefe93185)
- [Next.js + Supabase production lessons](https://catjam.fi/articles/next-supabase-what-do-differently)
- [Feature Upvote: preventing voting manipulation](https://help.featureupvote.com/article/29-how-do-you-prevent-voting-manipulation)

### Tertiary (LOW confidence)
- Community blog posts on React Canvas patterns (consistent advice, but not official sources)
- Sonner vs react-hot-toast comparisons (minor decision, low stakes)

---
*Research completed: 2026-05-18*
*Ready for roadmap: yes*
