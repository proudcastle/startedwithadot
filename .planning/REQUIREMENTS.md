# Requirements: It All Started With a Dot

**Defined:** 2026-05-18
**Core Value:** The community decides what the game becomes — every feature of the dot is proposed, voted on, and implemented based on collective input.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [ ] **FOUND-01**: Project scaffolded from Supabase Next.js Starter with App Router and TypeScript
- [ ] **FOUND-02**: 8bitcn/ui installed via shadcn registry with monochrome dark theme configured
- [ ] **FOUND-03**: Pixel font (Press Start 2P) for headings and Geist for body text loaded via next/font
- [ ] **FOUND-04**: Tailwind CSS v4 configured with monochrome color palette (black, white, grays only)
- [ ] **FOUND-05**: Database schema created with profiles, proposals, votes, and versions tables
- [ ] **FOUND-06**: Row Level Security policies enforced on all tables with correct read/write rules

### Authentication

- [ ] **AUTH-01**: User can sign up with email and password
- [ ] **AUTH-02**: User chooses a unique, immutable username at registration
- [ ] **AUTH-03**: User can log in and session persists across browser refresh
- [ ] **AUTH-04**: User can reset password via email link
- [ ] **AUTH-05**: User can log out from any page
- [ ] **AUTH-06**: Email verification enforced before user can submit proposals or vote

### Game Canvas

- [ ] **GAME-01**: Full-width canvas renders a single white circle (~20px radius) centered on black background
- [ ] **GAME-02**: Dot has subtle pulse animation (scale ±2px, 3-second cycle) via requestAnimationFrame
- [ ] **GAME-03**: Canvas scales responsively with viewport
- [ ] **GAME-04**: GameCanvas is an isolated React client component with no external dependencies
- [ ] **GAME-05**: Canvas uses useRef for mutable state, not useState, with proper useEffect cleanup

### Proposals

- [ ] **PROP-01**: Authenticated user can submit a proposal (max 140 characters, inline input)
- [ ] **PROP-02**: Character counter displays remaining characters with narrator-style feedback
- [ ] **PROP-03**: Proposals display in a vertical timeline, sorted by votes (most dots first)
- [ ] **PROP-04**: Each proposal shows: text, username, relative timestamp, dot-counter, status indicator
- [ ] **PROP-05**: Proposals filterable by status tabs: All / Open / Accepted / Implemented
- [ ] **PROP-06**: Rate limiting enforced at 3 proposals per user per day
- [ ] **PROP-07**: Unauthenticated users can view proposals but not submit or vote

### Voting

- [ ] **VOTE-01**: Authenticated user can toggle upvote on any proposal (one vote per user per proposal)
- [ ] **VOTE-02**: Votes visualized as dot counters (● symbols) with numeric count above threshold (>10)
- [ ] **VOTE-03**: Own vote visually highlighted when set
- [ ] **VOTE-04**: Optimistic UI update on vote toggle with server reconciliation

### Admin

- [ ] **ADMN-01**: Admin user (flag-based) can change proposal status (Open → Accepted/Rejected, Accepted → Implemented)
- [ ] **ADMN-02**: Admin can create new versions linked to implemented proposals
- [ ] **ADMN-03**: Admin can delete proposals for moderation
- [ ] **ADMN-04**: Admin controls accessible directly in the UI (not only Supabase Dashboard)

### Changelog

- [ ] **CHNG-01**: Version history page displays all versions chronologically (newest first)
- [ ] **CHNG-02**: Each version shows: number, title, date, linked proposal author, description
- [ ] **CHNG-03**: Version number displayed in UI corner linking to changelog (e.g. "v0.1 ● A Dot.")

### Visual Identity

- [ ] **VISL-01**: Dot used as recurring visual DNA: vote indicators, status markers, favicon, loading states, section separators
- [ ] **VISL-02**: All micro-copy written in sloppy-narrator voice (Ferris Bueller/Deadpool tone)
- [ ] **VISL-03**: Empty states have personality-driven copy ("Nothing here yet. Be the first to tell the dot what to do.")
- [ ] **VISL-04**: Auth page copy in narrator voice ("Welcome back. The dot missed you.")
- [ ] **VISL-05**: 404 page with narrator voice ("This page doesn't exist. Much like this game's roadmap.")
- [ ] **VISL-06**: Loading states use pulsing dot instead of spinner
- [ ] **VISL-07**: Section separators use three dots (· · ·) instead of horizontal lines

### Landing Page

- [ ] **LAND-01**: Hero section with full-width game canvas and narrator primary/secondary text
- [ ] **LAND-02**: "The Story" concept explanation section with sloppy-narrator tone inline on landing page
- [ ] **LAND-03**: Three-step CTA (Register → Propose → Vote) with dot bullet points
- [ ] **LAND-04**: Proposals section with "Alright, what should happen next?" heading
- [ ] **LAND-05**: Changelog preview section ("The Evolution") with most recent versions

### SEO & Meta

- [ ] **SEO-01**: OG tags with title, description ("It's a dot. It does nothing. You decide what happens next."), and OG image
- [ ] **SEO-02**: Favicon as white dot on black background (16x16 / 32x32)
- [ ] **SEO-03**: OG image: black background, white dot, project title text

### Footer

- [ ] **FOOT-01**: Footer with narrator-style copyright and quip
- [ ] **FOOT-02**: Links to changelog, privacy policy / impressum

### Deployment

- [ ] **DEPL-01**: Deployed to Vercel with environment variables for Supabase
- [ ] **DEPL-02**: Domain startedwithadot.com configured
- [ ] **DEPL-03**: Responsive mobile-first design across all pages

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Realtime & Engagement

- **RT-01**: Realtime voting via Supabase Realtime subscriptions
- **RT-02**: Notification when own proposal gets accepted/implemented
- **RT-03**: Social login (Google, Discord, GitHub)

### Community Growth

- **COMM-01**: Public user profiles with proposal history and impact score
- **COMM-02**: Comment threads on proposals
- **COMM-03**: Gamification (badges for implemented proposals)

### Game Evolution

- **EVOL-01**: Playable old versions (version time machine)
- **EVOL-02**: Dynamic game module loading per version

### Monetization

- **MNTZ-01**: Supporter tiers via Stripe
- **MNTZ-02**: Exclusive access to play old versions for supporters

## Out of Scope

| Feature | Reason |
|---------|--------|
| Downvoting | Creates negativity spirals, suppresses minority ideas |
| Payment/donation system | Validate community loop before monetization |
| Playable old versions | Requires game state snapshots, version selector, backward compat |
| Social login | Email/password sufficient for V1 simplicity |
| Realtime voting | High complexity (WebSocket, conflict resolution) for low benefit at V1 scale |
| Admin dashboard | Supabase Dashboard + flag-based UI controls sufficient |
| Public user profiles | Focus is the dot, not social hierarchy |
| Comment system | Turns voting board into forum, needs moderation/threading |
| Categories/tags | 140-char limit already enforces self-describing content |
| Notification system | Users check back manually in V1 |
| External API | No third-party use case exists yet |
| Gamification | Seeing your proposal implemented IS the reward |
| Mobile app | Web-first, mobile app deferred |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | — | Pending |
| FOUND-02 | — | Pending |
| FOUND-03 | — | Pending |
| FOUND-04 | — | Pending |
| FOUND-05 | — | Pending |
| FOUND-06 | — | Pending |
| AUTH-01 | — | Pending |
| AUTH-02 | — | Pending |
| AUTH-03 | — | Pending |
| AUTH-04 | — | Pending |
| AUTH-05 | — | Pending |
| AUTH-06 | — | Pending |
| GAME-01 | — | Pending |
| GAME-02 | — | Pending |
| GAME-03 | — | Pending |
| GAME-04 | — | Pending |
| GAME-05 | — | Pending |
| PROP-01 | — | Pending |
| PROP-02 | — | Pending |
| PROP-03 | — | Pending |
| PROP-04 | — | Pending |
| PROP-05 | — | Pending |
| PROP-06 | — | Pending |
| PROP-07 | — | Pending |
| VOTE-01 | — | Pending |
| VOTE-02 | — | Pending |
| VOTE-03 | — | Pending |
| VOTE-04 | — | Pending |
| ADMN-01 | — | Pending |
| ADMN-02 | — | Pending |
| ADMN-03 | — | Pending |
| ADMN-04 | — | Pending |
| CHNG-01 | — | Pending |
| CHNG-02 | — | Pending |
| CHNG-03 | — | Pending |
| VISL-01 | — | Pending |
| VISL-02 | — | Pending |
| VISL-03 | — | Pending |
| VISL-04 | — | Pending |
| VISL-05 | — | Pending |
| VISL-06 | — | Pending |
| VISL-07 | — | Pending |
| LAND-01 | — | Pending |
| LAND-02 | — | Pending |
| LAND-03 | — | Pending |
| LAND-04 | — | Pending |
| LAND-05 | — | Pending |
| SEO-01 | — | Pending |
| SEO-02 | — | Pending |
| SEO-03 | — | Pending |
| FOOT-01 | — | Pending |
| FOOT-02 | — | Pending |
| DEPL-01 | — | Pending |
| DEPL-02 | — | Pending |
| DEPL-03 | — | Pending |

**Coverage:**
- v1 requirements: 52 total
- Mapped to phases: 0
- Unmapped: 52 ⚠️

---
*Requirements defined: 2026-05-18*
*Last updated: 2026-05-18 after initial definition*
