# It All Started With a Dot

## What This Is

A community platform with an embedded collaborative game where a single black dot on a canvas evolves through community proposals and voting. Users submit ideas for what the dot should do, vote on each other's proposals, and the creator curates and implements the best ones — each implementation becoming a new version. The platform targets an international audience with a pixel-art aesthetic, sloppy-narrator voice, and radical simplicity.

## Core Value

The community decides what the game becomes — every feature of the dot is proposed, voted on, and implemented based on collective input. If the voting and proposal system doesn't work, nothing else matters.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Game canvas rendering a single white dot on black background with subtle pulse
- [ ] User registration with email/password and unique username
- [ ] Proposal submission (140-char limit, Twitter-style inline input)
- [ ] Upvote system with dot-based visual counters (toggleable, one per user per proposal)
- [ ] Proposal status lifecycle (Open/Accepted/Implemented/Rejected, admin-controlled)
- [ ] Changelog / version history linked to implemented proposals
- [ ] 8bitcn/ui pixel-art component library with monochrome dark theme
- [ ] Sloppy-narrator voice throughout all micro-copy
- [ ] Dot as recurring visual DNA (votes, status indicators, favicon, loading states, separators)
- [ ] Admin capabilities (status changes, version creation, moderation)
- [ ] Rate limiting (3 proposals per user per day)
- [ ] SEO with OG tags, favicon, and meta descriptions
- [ ] Responsive mobile-first design
- [ ] Vercel deployment at startedwithadot.com

### Out of Scope

- Payment / donation system — not needed for V1 community validation
- Supporter tiers / ultimate version — monetization deferred
- Playable old versions — complexity too high for V1
- Social login (Google, Discord, GitHub) — email/password sufficient
- Realtime voting — Phase 2 feature (Supabase Realtime)
- Admin dashboard — Supabase Dashboard sufficient for V1
- Public user profiles — community sees username only
- Comment system on proposals — keep interaction model simple
- Downvoting — upvote-only preserves positive community dynamics
- Categories/tags for proposals — 140-char limit enforces clarity
- Notification system — deferred to Phase 2+
- External API — no third-party clients in V1

## Context

The project builds on the official Supabase Next.js Starter Template (`npx create-next-app -e with-supabase`) which provides pre-configured auth flows (login, signup, password reset, session management, protected routes via middleware). The UI layer uses 8bitcn/ui, a shadcn-compatible pixel-art component library. The game canvas is an isolated React component (`<GameCanvas />`) that starts as a simple white circle on black — a black box that evolves version by version.

The visual language has two deliberate worlds: the UI chrome (8bitcn pixel-art, monochrome, retro) and the game canvas (clean, anti-aliased, geometrically perfect). This contrast is intentional — the shell says "game," the content is still a blank slate.

The "sloppy narrator" voice (Ferris Bueller / Deadpool tone) permeates every text string — empty states, error messages, tooltips, auth flows. If a text sounds boring, it's wrong.

Domain: startedwithadot.com. Deployment: Vercel Pro.

## Constraints

- **Tech Stack**: Next.js (App Router, TypeScript), Tailwind CSS v4, 8bitcn/ui, Supabase (Auth + PostgreSQL), HTML5 Canvas, Vercel deployment
- **Language**: All UI text, code comments, commit messages in English (PRP is German, everything Claude produces is English)
- **Color**: Strictly monochrome (black/white/grays) until the community introduces color through proposals
- **Proposal Length**: 140 characters max — deliberate constraint forcing clarity
- **Auth**: Email/password only in V1, no social login
- **Admin**: Flag-based in UI or Supabase Dashboard, no custom admin panel
- **Game Canvas**: No pixel-art filters on the canvas itself — it stays clean and neutral, only changes through community decisions

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase Next.js Starter as foundation | Pre-built auth, SSR-compatible, reduces boilerplate | — Pending |
| 8bitcn/ui for pixel-art aesthetic | shadcn-compatible, copies into project, brings retro look out-of-box | — Pending |
| 140-char proposal limit | Forces clarity like early Twitter, prevents essay-proposals | — Pending |
| Dots as vote visualization | Reinforces dot-as-DNA concept, unique visual identity | — Pending |
| No realtime in V1 | Simplicity first, page refresh shows new votes, Realtime is Phase 2 | — Pending |
| Monochrome-only until community adds color | Color absence is a statement — community earns it through proposals | — Pending |
| Game canvas as React component (not iframe) | Simpler for V1, can evolve to dynamic module loading later | — Pending |
| Username immutable after registration | Prevents identity confusion in proposal history | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-18 after initialization*
