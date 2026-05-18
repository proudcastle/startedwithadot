# Roadmap: It All Started With a Dot

## Overview

This roadmap delivers a community platform where users propose changes to a pulsing dot on a canvas, vote on proposals, and watch the creator implement winning ideas as versioned updates. The build order follows the research mandate: foundation and auth first (everything depends on it), the community feedback loop second (the actual product), the game canvas and version system third (closes the loop visually), and visual polish plus launch last (touches everything, avoids rework). Four phases, coarse granularity, each delivering a vertical slice of working functionality.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation and Auth** - Database schema, RLS policies, and complete auth flow from the Supabase starter template (completed 2026-05-18)
- [ ] **Phase 2: The Community Loop** - Proposals, voting, and admin curation working end-to-end
- [ ] **Phase 3: Game Canvas and Versions** - Pulsing dot canvas and version history linked to implemented proposals
- [ ] **Phase 4: Visual Identity and Launch** - Pixel-art polish, landing page, SEO, narrator voice, and Vercel deployment

## Phase Details

### Phase 1: Foundation and Auth

**Goal**: Users can create accounts, log in, and interact with a fully secured database backend
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06
**Success Criteria** (what must be TRUE):

  1. User can sign up with email/password, choose a unique username, and receive a verification email
  2. User can log in and their session persists across browser refresh; user can log out from any page
  3. User can reset a forgotten password via email link
  4. Database tables (profiles, proposals, votes, versions) exist with RLS policies enforced on every table
  5. 8bitcn/ui components render correctly with monochrome dark theme and pixel font headings

**Plans**: 2 plans

Plans:
**Wave 1**

- [x] 01-01-PLAN.md — Walking Skeleton: scaffold, theme, fonts, DB schema + RLS, signup with username E2E

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — Auth Lifecycle: login, logout, password reset, email verification enforcement, human verify

### Phase 2: The Community Loop

**Goal**: Users can propose ideas, vote on them, and an admin can curate the proposal lifecycle
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: PROP-01, PROP-02, PROP-03, PROP-04, PROP-05, PROP-06, PROP-07, VOTE-01, VOTE-02, VOTE-03, VOTE-04, ADMN-01, ADMN-02, ADMN-03, ADMN-04
**Success Criteria** (what must be TRUE):

  1. Authenticated user can submit a proposal (140-char limit enforced, rate-limited to 3/day) and see it appear in the feed
  2. Authenticated user can toggle-vote on any proposal and see dot-based vote counters update instantly (optimistic UI)
  3. Unauthenticated visitor can browse proposals but cannot submit or vote
  4. Admin can change proposal status (Open/Accepted/Rejected/Implemented), create versions linked to proposals, and delete proposals for moderation
  5. Proposals display in a filterable feed sorted by votes, with status tabs (All/Open/Accepted/Implemented)

**Plans**: 3 plans
**UI hint**: yes

Plans:
**Wave 1**

- [x] 02-01-PLAN.md — Proposal submission + feed display: inline input with character counter, card-based feed sorted by votes, Sonner toasts, rate limiting

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 02-02-PLAN.md — Voting + status tabs: optimistic vote toggle with dot counters, status filter tabs via URL params

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 02-03-PLAN.md — Admin curation: status changes, proposal deletion, version creation dialog, DB migration push

### Phase 3: Game Canvas and Versions

**Goal**: Users see a pulsing dot on a full-width canvas and can browse a changelog of versions linked to implemented proposals
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: GAME-01, GAME-02, GAME-03, GAME-04, GAME-05, CHNG-01, CHNG-02, CHNG-03
**Success Criteria** (what must be TRUE):

  1. A white circle pulses on a black full-width canvas that scales with the viewport
  2. GameCanvas is an isolated client component with proper RAF cleanup (no memory leaks on navigation)
  3. Version history page shows all versions chronologically with number, title, date, linked proposal author, and description
  4. Current version number is visible in the UI corner and links to the changelog

**Plans**: TBD
**UI hint**: yes

Plans:

- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Visual Identity and Launch

**Goal**: The platform has its full pixel-art aesthetic, narrator voice, landing page, SEO, and is deployed live at startedwithadot.com
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: VISL-01, VISL-02, VISL-03, VISL-04, VISL-05, VISL-06, VISL-07, LAND-01, LAND-02, LAND-03, LAND-04, LAND-05, SEO-01, SEO-02, SEO-03, FOOT-01, FOOT-02, DEPL-01, DEPL-02, DEPL-03
**Success Criteria** (what must be TRUE):

  1. Dots appear as recurring visual DNA throughout the app: vote indicators, status markers, favicon, loading states, and section separators
  2. All micro-copy uses sloppy-narrator voice including auth pages, empty states, error messages, 404 page, and footer
  3. Landing page renders hero with game canvas, story section, three-step CTA, proposals feed, and changelog preview
  4. OG tags, favicon (white dot on black), and meta descriptions are present and render correctly in link previews
  5. Site is deployed to Vercel at startedwithadot.com and is responsive across mobile and desktop

**Plans**: TBD
**UI hint**: yes

Plans:

- [ ] 04-01: TBD
- [ ] 04-02: TBD
- [ ] 04-03: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation and Auth | 2/2 | Complete   | 2026-05-18 |
| 2. The Community Loop | 2/3 | In progress | - |
| 3. Game Canvas and Versions | 0/2 | Not started | - |
| 4. Visual Identity and Launch | 0/3 | Not started | - |
