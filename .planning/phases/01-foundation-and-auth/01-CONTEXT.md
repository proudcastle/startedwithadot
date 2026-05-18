# Phase 1: Foundation and Auth - Context

**Gathered:** 2026-05-18
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers a working Next.js application scaffolded from the Supabase starter template with complete auth flows (signup with username, login, logout, password reset, email verification), the database schema for the entire app (profiles, proposals, votes, versions), Row Level Security on all tables, 8bitcn/ui installed with a monochrome dark theme, and pixel + body fonts loaded. At the end of this phase, a user can create an account, choose a username, verify their email, log in, and see a styled page — but there are no proposals, voting, or game canvas yet.

</domain>

<decisions>
## Implementation Decisions

### Scaffolding
- **D-01:** Start from `npx create-next-app -e with-supabase` — this gives pre-configured auth (cookie-based, SSR-compatible), login/signup/password-reset flows, server/client Supabase helpers, auth middleware, and callback route. Build on top of what the template provides rather than recreating it.
- **D-02:** After scaffolding, upgrade any outdated dependencies (the starter may lag behind current versions of @supabase/ssr, Next.js, etc.).

### Username & Profiles
- **D-03:** Create a `profiles` table with columns: `id` (FK to auth.users), `username` (unique, case-insensitive), `created_at`. A database trigger on `auth.users` INSERT creates the profile row automatically.
- **D-04:** Username format: alphanumeric plus hyphens and underscores, 3-20 characters, case-insensitive uniqueness enforced via `LOWER(username)` unique index. Validated both client-side and via database constraint.
- **D-05:** Username is collected during the registration flow — extend the Supabase starter's signup form to include a username field. Username is immutable after registration.

### Database Schema
- **D-06:** Create all four tables in Phase 1 (profiles, proposals, votes, versions) even though proposals/votes/versions are used in later phases. This avoids migration complexity later and lets Phase 2/3 focus purely on UI and logic.
- **D-07:** Proposals table: `id`, `user_id` (FK profiles), `text` (varchar 140), `status` (enum: open/accepted/implemented/rejected), `created_at`. Default status is 'open'.
- **D-08:** Votes table: `id`, `user_id` (FK profiles), `proposal_id` (FK proposals), `created_at`. Unique constraint on (user_id, proposal_id) enforces one-vote-per-user.
- **D-09:** Versions table: `id`, `version_number` (text, e.g. "0.1"), `title`, `description`, `proposal_id` (FK proposals, nullable), `created_by` (FK profiles), `created_at`.
- **D-10:** Add a `vote_count` integer column on proposals for denormalized count (updated via trigger or RPC). Avoids expensive COUNT queries on every page load.

### Row Level Security
- **D-11:** RLS enabled on ALL tables from the first migration. No exceptions.
- **D-12:** Policy design: profiles (anyone reads, owner updates own), proposals (anyone reads, auth users insert own, admin updates status), votes (anyone reads counts, auth users insert/delete own, unique constraint enforced), versions (anyone reads, admin inserts).
- **D-13:** Admin check via a `is_admin` boolean on profiles table, checked in RLS policies.

### Theme & Fonts
- **D-14:** Install 8bitcn/ui components via shadcn CLI registry. Override theme tokens in `globals.css` for monochrome palette: background #000000, foreground #ffffff, muted grays.
- **D-15:** Load Press Start 2P via `next/font/google` for display headings and UI labels. Load Geist (or Geist Mono) for body text. Both configured in root layout.
- **D-16:** Dark theme is the ONLY theme — no light mode toggle. CSS variables set for monochrome only.

### Auth Flow
- **D-17:** Email verification must be enforced before a user can submit proposals or vote (Phase 2 feature, but the enforcement mechanism is set up here). Unverified users can browse but not interact.
- **D-18:** Use the Supabase starter's existing auth pages as base, then restyle with 8bitcn components and monochrome theme. Do not rebuild auth flows from scratch.

### Claude's Discretion
- Exact 8bitcn component selection (which specific components to install in Phase 1)
- Supabase migration file structure and naming
- Middleware configuration details
- Tailwind v4 configuration approach
- Project directory structure (follow PRP suggestion as starting point)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Core value, constraints, key decisions, out of scope
- `.planning/REQUIREMENTS.md` — Full v1 requirements with REQ-IDs (FOUND-01..06, AUTH-01..06 for this phase)
- `.planning/ROADMAP.md` — Phase structure, success criteria, dependency order

### Research
- `.planning/research/STACK.md` — Validated stack with specific versions, anti-recommendations
- `.planning/research/ARCHITECTURE.md` — Component boundaries, data flow, build order
- `.planning/research/PITFALLS.md` — RLS misconfiguration risks, Canvas/React pitfalls, Supabase traps

### External Documentation
- 8bitcn/ui docs: https://www.8bitcn.com/docs — Component registry, installation, theming
- Supabase Next.js starter: official template docs for auth flow reference

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code

### Established Patterns
- None yet — this phase establishes the foundational patterns

### Integration Points
- Supabase project (to be created) provides Auth and PostgreSQL
- Vercel deployment target (configured in Phase 4)

</code_context>

<specifics>
## Specific Ideas

- The PRP specifies exact background colors: #000000 for canvas, #0a0a0a / #111111 for UI chrome
- Auth page copy should use sloppy-narrator voice even in Phase 1 (e.g., "Join the experiment. All we need is an email and a bad idea.")
- The dot motif should appear where natural even in Phase 1 (favicon, loading states) — but full visual DNA pass is Phase 4
- Username field placeholder: consider narrator-appropriate text

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 1-Foundation and Auth*
*Context gathered: 2026-05-18*
