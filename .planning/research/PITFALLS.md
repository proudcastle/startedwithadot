# Pitfalls Research

**Domain:** Community-driven collaborative game platform (voting, proposals, canvas evolution)
**Researched:** 2026-05-18
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: The Graveyard Board -- Stale Proposals Kill Community Trust

**What goes wrong:**
Proposals accumulate without responses, status updates, or resolution. Users submit ideas, vote, and hear nothing back. The board becomes a graveyard of unanswered requests. Users stop participating because they feel ignored. A voting board filled with stale proposals is worse than no board at all -- it signals that nobody is listening.

**Why it happens:**
The admin (creator) treats proposal curation as a secondary task rather than the core product loop. Without a forcing function for regular review, the backlog grows silently. The excitement of building features outpaces the discipline of closing the feedback loop with the community.

**How to avoid:**
- Build the proposal lifecycle as the primary workflow, not a sidebar feature. The admin panel should surface "proposals needing attention" prominently.
- Archive proposals with zero activity after a set period (e.g., 30 days for a small community). Make archival visible -- "This proposal didn't get enough votes."
- When a proposal is Accepted or Rejected, require a brief reason. Even "Not right now" is better than silence.
- When an implemented proposal ships as a new version, auto-notify voters. This is the single highest-impact engagement action -- users who see their votes lead to shipped features become the most active participants.
- Set a V1 goal: admin reviews all open proposals at least weekly.

**Warning signs:**
- More than 10 open proposals with no status change in 2+ weeks
- Declining vote counts on new proposals (users stopped bothering)
- Zero return visits from users who submitted proposals

**Phase to address:**
Phase 1 (MVP). The proposal status lifecycle (Open/Accepted/Implemented/Rejected) must be functional from day one. Without it, the core value proposition -- "the community decides" -- is a lie.

---

### Pitfall 2: Vote Manipulation Destroys Legitimacy

**What goes wrong:**
A user creates multiple accounts to upvote their own proposals, or uses different browsers/incognito to bypass one-vote-per-user restrictions. Even at small scale, if the community suspects votes are rigged, trust collapses permanently. Unlike a product feedback board where stakes are low, this platform's entire identity is "the community decides" -- rigged votes are an existential threat.

**Why it happens:**
Email/password auth with no verification makes throwaway accounts trivial. The one-vote-per-user constraint is only enforced at the database level (user_id + proposal_id unique constraint), which is correct but insufficient if account creation itself is unrestricted.

**How to avoid:**
- Require email verification before allowing votes (not just account creation). The Supabase starter template supports this -- enforce `email_confirmed_at IS NOT NULL` in RLS policies.
- Rate-limit account creation by IP address (Vercel Edge Middleware or Supabase rate limiting).
- Track voting patterns: if a batch of new accounts all vote for the same proposal within minutes, flag it for admin review.
- Consider a minimum account age before voting (e.g., 1 hour) to make multi-account attacks tedious.
- For V1, the 3-proposals-per-day rate limit helps, but add a similar soft limit on voting velocity (e.g., max 20 votes per hour).

**Warning signs:**
- Burst of new account registrations from similar IP ranges
- A proposal jumps from 0 to 15 votes in under an hour when the community is small
- Accounts that only vote (never submit proposals) appearing in clusters

**Phase to address:**
Phase 1. Email verification on signup is table stakes. IP-based rate limiting on account creation should be in Phase 1 or early Phase 2. Pattern detection can wait for Phase 2+.

---

### Pitfall 3: Supabase RLS Misconfiguration Exposes Data or Breaks the App

**What goes wrong:**
Two failure modes, both common:
1. **RLS not enabled on a table**: Every row is publicly accessible through the Supabase REST API. An attacker can read all proposals, user data, or admin flags.
2. **RLS enabled but no policies defined**: Every query returns empty results. The app appears broken with no error messages (empty results are valid responses). Developers spend hours debugging "why does my query return nothing" before realizing RLS is silently blocking.

A third subtle failure: overly broad policies like `USING (true)` on SELECT, which lets any authenticated user read all rows including admin-only data.

**Why it happens:**
Tables created via SQL Editor or migrations don't have RLS enabled by default. Developers test in the Supabase Dashboard SQL Editor, which bypasses RLS entirely, so policies are never exercised during development. The gap between "works in SQL Editor" and "works from the client" is the most common Supabase security bug.

**How to avoid:**
- Enable RLS on every table immediately upon creation. Make it a migration convention: `CREATE TABLE` is always followed by `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` in the same migration file.
- Write RLS policies before writing application code. If you can't write the policy, you don't understand the data model yet.
- Never test RLS from the SQL Editor. Always test from the client SDK with actual user tokens.
- Use `supabase.auth.getUser()` in server code, never `getSession()`. `getSession()` doesn't revalidate the auth token and can be spoofed.
- Index every column referenced in RLS policies (user_id, proposal_id, etc.) -- missing indexes are the top RLS performance killer.
- Be explicit about admin access: use a `profiles.is_admin` flag checked in policies, not role-based assumptions.

**Warning signs:**
- Any table without RLS enabled in the Supabase Dashboard
- Queries that work in SQL Editor but return empty from the client (or vice versa)
- Performance degradation on tables with RLS but no indexes on policy columns

**Phase to address:**
Phase 1. RLS must be correct from the first migration. Retrofitting RLS onto a live database with existing data is painful and error-prone.

---

### Pitfall 4: The Canvas Component Becomes a Memory-Leaking Re-render Nightmare

**What goes wrong:**
The `<GameCanvas />` React component creates a new canvas context or animation frame on every render. In React's strict mode (development), components mount/unmount/mount, doubling the problem. Event listeners pile up. Animation frames stack. Memory usage climbs until the tab crashes or performance degrades to single-digit FPS.

**Why it happens:**
HTML5 Canvas has an imperative API that conflicts with React's declarative model. Developers use `useEffect` to set up canvas drawing but forget cleanup functions. `requestAnimationFrame` loops aren't cancelled on unmount. Canvas elements aren't properly disposed. The problem is invisible during development because the component only mounts once -- it surfaces in production when users navigate between pages and the component re-mounts.

**How to avoid:**
- Always return a cleanup function from `useEffect` that cancels `requestAnimationFrame` and removes event listeners.
- Use a single `useRef` for the canvas element and drawing context. Never create a new context on re-render.
- Keep canvas logic outside React's render cycle entirely. The `useEffect` should set up the imperative canvas code once, and the cleanup should tear it down completely.
- For the V1 "pulsing dot" animation: use a single `requestAnimationFrame` loop with a cancel ID stored in a ref.
- Test the component by navigating away and back repeatedly. Check the browser's memory profiler for climbing allocations.

```typescript
// Correct pattern
const canvasRef = useRef<HTMLCanvasElement>(null);
const animationRef = useRef<number>(0);

useEffect(() => {
  const ctx = canvasRef.current?.getContext('2d');
  if (!ctx) return;

  const animate = () => {
    // draw frame
    animationRef.current = requestAnimationFrame(animate);
  };
  animate();

  return () => cancelAnimationFrame(animationRef.current);
}, []);
```

**Warning signs:**
- Memory usage in browser devtools climbs over time without user interaction
- Multiple animation loops running simultaneously (visible as flickering or accelerating animation)
- "Canvas2D: Multiple readback operations" warnings in console

**Phase to address:**
Phase 1. The canvas component is in the MVP. Get the imperative/declarative boundary right from the start -- retrofitting cleanup into a canvas component that "mostly works" is a debugging nightmare.

---

### Pitfall 5: Next.js Middleware Auth Thrashing

**What goes wrong:**
The Supabase auth middleware runs on every request by default, including static assets (`_next/static`, `_next/image`, favicon). This causes unnecessary Supabase auth calls on every page load, slowing page transitions and occasionally producing 400 errors when prefetching triggers multiple concurrent auth checks. In extreme cases, the middleware creates an infinite redirect loop: unauthenticated user hits protected route, redirects to login, middleware fires on login page, redirects again.

**Why it happens:**
The default Next.js middleware matcher runs on all routes. The Supabase starter template includes a matcher config, but developers modify it without understanding the implications. Additionally, `supabase.auth.getSession()` is used in middleware instead of `getUser()`, which doesn't revalidate the token and can produce stale auth state.

**How to avoid:**
- Use a restrictive middleware matcher that excludes static assets:
  ```typescript
  export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
  };
  ```
- Use `getUser()` not `getSession()` in server-side auth checks.
- Define public routes explicitly (home page, login, signup) and only redirect on protected routes.
- Test the middleware by watching the Network tab -- auth calls should only fire on page navigations, not asset loads.

**Warning signs:**
- Supabase auth API calls appearing for every static asset in the Network tab
- Page loads taking 500ms+ longer than expected
- Intermittent 400 errors on page navigation
- Redirect loops on the login page

**Phase to address:**
Phase 1. The Supabase starter template handles this reasonably well, but any modification to the middleware matcher needs to be tested immediately.

---

### Pitfall 6: Building Features Before the Community Loop Works

**What goes wrong:**
Development energy goes into the game canvas, visual polish, pixel-art UI, and technical infrastructure while the proposal-vote-implement-version cycle remains incomplete or clunky. The product launches with a beautiful dot and no way for the community to meaningfully interact with it. Users arrive, see a static dot, don't understand the value proposition, and leave.

**Why it happens:**
The canvas and visual design are technically interesting and produce visible progress. The community loop (submit proposal, vote, admin reviews, status changes, version ships) is boring CRUD with complex state management. Developers gravitate toward the fun work.

**How to avoid:**
- Enforce a strict build order: proposals and voting must be functional before any canvas polish beyond the basic pulsing dot.
- The "sloppy narrator" voice and 8bitcn styling can be applied after the mechanics work, not before.
- Define "MVP complete" as: a user can register, submit a proposal, vote on proposals, and see proposal statuses change. The canvas showing a dot is necessary but not sufficient.
- The first version entry in the changelog should exist before launch, even if manually created: "v0.1 -- A dot appears."

**Warning signs:**
- More than 50% of development time spent on canvas/visual work before the proposal flow is functional
- The proposal submission form is "almost done" while the canvas has complex animations
- No end-to-end test of the full community loop (register, propose, vote, admin status change)

**Phase to address:**
Phase 1, enforced via milestone ordering. The proposal system is the product; the canvas is a feature of the product.

---

### Pitfall 7: Version History Without Audit Trail Integrity

**What goes wrong:**
The changelog/version history becomes disconnected from actual proposals. An admin implements a feature but forgets to link it to the originating proposal. Or multiple proposals are combined into one version but only one is credited. Over time, the "community decided this" narrative breaks because there's no verifiable chain from proposal to implementation.

**Why it happens:**
The version creation workflow treats the link to proposals as optional metadata rather than required data. The admin creates a version entry with a description but skips the tedious step of linking back to the specific proposal(s) that inspired it.

**How to avoid:**
- Make the proposal-to-version link a required foreign key, not optional. A version must reference at least one proposal.
- When an admin changes a proposal status to "Implemented," require selecting or creating the version it was implemented in.
- Display the linked proposals on each version entry: "This version was inspired by proposals from @user1, @user2."
- Consider making the link bidirectional: proposals show "Implemented in v0.3" and versions show "Based on proposal #12."

**Warning signs:**
- Version entries with no linked proposals
- Proposals stuck in "Accepted" status with no path to "Implemented"
- Community members asking "what happened to my proposal?" after a version ships

**Phase to address:**
Phase 1. The data model must enforce this relationship from the start. Adding a required FK to a table with existing data requires a migration to backfill.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip email verification on signup | Faster onboarding, less friction | Vote manipulation via throwaway accounts | Never -- the platform's integrity depends on one-human-one-vote |
| Use `getSession()` instead of `getUser()` in server code | Slightly faster (no network call) | Auth token can be spoofed; security vulnerability | Never in middleware or API routes |
| Store vote counts as a denormalized column on proposals | Faster reads, simpler queries | Count drifts from actual votes if toggle logic has bugs | MVP only -- add a trigger or view in Phase 2 |
| Admin moderation via Supabase Dashboard only | No custom admin UI to build | Clunky workflow, admin forgets to link proposals to versions | Phase 1 only -- build minimal admin actions in-app by Phase 2 |
| Skip canvas cleanup in useEffect | "It works in dev" | Memory leaks in production, crashes on mobile Safari | Never |
| Hardcode the "sloppy narrator" strings inline | Fast iteration on copy | Impossible to maintain consistent voice; can't search for all user-facing strings | Phase 1 only -- extract to a constants file by Phase 2 |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Supabase Auth (Next.js) | Using deprecated `@supabase/auth-helpers-nextjs` | Use `@supabase/ssr` package -- the auth-helpers package is deprecated |
| Supabase Auth (Middleware) | Calling `getSession()` for auth checks | Use `getUser()` which revalidates with the Supabase Auth server every time |
| Supabase Auth (OAuth redirect) | Expecting tokens on the server after OAuth redirect | Tokens arrive as hash params, only accessible client-side; the browser sets auth cookies after render |
| Supabase RLS (Views) | Assuming views respect RLS | Views bypass RLS by default because they run as the postgres user; use `security_invoker = true` on views |
| Supabase RLS (Functions) | Creating `security definer` functions that bypass RLS | Prefer `security invoker` functions; only use `security definer` for specific admin operations |
| Vercel (Environment) | Using `NEXT_PUBLIC_` prefix for Supabase service role key | Only the anon key should be public; the service role key must be server-only (`SUPABASE_SERVICE_ROLE_KEY`) |
| 8bitcn/ui | Expecting full shadcn/ui component parity | Component catalog is still growing; audit available components early and plan custom builds for gaps |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Fetching all proposals on every page load | Slow page loads, high Supabase egress | Paginate proposals (e.g., 20 per page), add cursor-based pagination | 100+ proposals |
| Counting votes with `SELECT COUNT(*)` per proposal | N+1 query problem on proposal list page | Use a materialized vote count (trigger or database function) or aggregate in a single query | 50+ proposals with 100+ votes each |
| No index on `votes.proposal_id` or `votes.user_id` | RLS policy checks slow down linearly | Add indexes on every FK column and every column referenced in RLS policies | 1000+ votes |
| Canvas animation running when tab is not visible | Battery drain, mobile thermal throttling | Use `document.hidden` / `visibilitychange` event to pause animation | Immediately on mobile |
| Loading all version history on the changelog page | Slow initial load, unnecessary data transfer | Paginate or lazy-load older versions | 20+ versions |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Admin flag (`is_admin`) stored only in client state | Any user can set themselves as admin via devtools | Store admin flag in `profiles` table, enforce via RLS policies server-side |
| Proposal status changes allowed by any authenticated user | Community members can accept/reject their own proposals | RLS policy on status updates: `USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true))` |
| Rate limiting only on the client side | Bypassed with curl or Postman | Enforce rate limits in Supabase RLS or Vercel Edge Middleware, not just in React |
| No profanity or abuse filtering on proposals | Offensive content visible to all users | Add basic text filtering on proposal submission; even a simple blocklist is better than nothing |
| Version history editable after publication | Admin can silently rewrite history, destroying trust | Make version entries append-only; edits create a new revision, not overwrite |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No feedback after voting | User unsure if vote registered | Immediate visual confirmation -- the dot counter increments, button state changes |
| Proposal submission with no character count | User types 200 chars, gets rejected | Show live character count (X/140) with the input, disable submit above limit |
| No empty state for "no proposals yet" | New user sees a blank page, thinks the site is broken | Sloppy narrator empty state: "Nobody's proposed anything yet. You could be the first. No pressure. (Okay, a little pressure.)" |
| Hiding the proposal form behind navigation | User doesn't discover how to participate | Proposal input should be visible on the main proposals page, not behind a "New Proposal" button on a separate page |
| Status changes with no explanation | Proposal rejected with no reason; user feels dismissed | Even a one-line reason ("Too similar to v0.2") preserves trust |
| No indication of what happens after voting | User votes but doesn't understand the lifecycle | Brief explainer: "Proposals with enough votes get reviewed by the creator. The best ones become new versions of the dot." |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Auth flow:** Often missing email verification enforcement -- verify that unverified emails cannot vote or submit proposals
- [ ] **Vote toggle:** Often missing the "un-vote" path -- verify that clicking the vote button again removes the vote and decrements the count
- [ ] **Proposal submission:** Often missing rate limit enforcement -- verify that the 4th proposal in a day is actually blocked, not just warned
- [ ] **RLS policies:** Often missing UPDATE/DELETE policies -- verify that users cannot edit/delete other users' proposals via the API
- [ ] **Admin status changes:** Often missing the proposal-to-version link requirement -- verify that "Implemented" status requires a version reference
- [ ] **Canvas component:** Often missing cleanup on unmount -- verify by navigating away and back, checking for duplicate animation loops
- [ ] **Mobile responsiveness:** Often missing canvas scaling -- verify that the canvas renders correctly on a 375px-wide viewport
- [ ] **Error states:** Often missing Supabase error handling -- verify that a failed vote (network error) shows a user-facing message, not a silent failure
- [ ] **Username uniqueness:** Often missing case-insensitive check -- verify that "CoolUser" and "cooluser" cannot both register

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Stale proposal graveyard | LOW | Batch-archive old proposals, post a "fresh start" announcement, commit to weekly reviews |
| Vote manipulation detected | MEDIUM | Audit vote records, remove suspicious accounts, add email verification retroactively, communicate transparently with community |
| RLS misconfiguration (data exposed) | HIGH | Audit all tables immediately, enable RLS + add policies, rotate Supabase API keys, assess what data was accessible |
| Canvas memory leaks in production | LOW | Deploy fix with proper useEffect cleanup, no data loss involved |
| Auth middleware causing redirect loops | MEDIUM | Revert middleware changes, test with restrictive matcher, deploy fix |
| Version history disconnected from proposals | MEDIUM | Manual backfill of proposal-version links, add FK constraint with migration, update admin workflow |
| Community trust collapse (silence/manipulation) | HIGH | Transparent post explaining what happened, visible corrective actions, potentially reset votes on affected proposals |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Stale proposals | Phase 1 (proposal lifecycle) | Admin can change status; proposals show status clearly; archived proposals are visible but distinct |
| Vote manipulation | Phase 1 (email verification) + Phase 2 (pattern detection) | Unverified users cannot vote; test by creating second account with same email |
| RLS misconfiguration | Phase 1 (database setup) | Every table has RLS enabled; test all CRUD operations from client SDK, not SQL Editor |
| Canvas memory leaks | Phase 1 (canvas component) | Navigate away and back 10 times; memory profiler shows flat allocation |
| Middleware auth thrashing | Phase 1 (auth setup) | Network tab shows zero auth calls for static assets; no redirect loops on public pages |
| Features before community loop | Phase 1 (milestone ordering) | Full proposal lifecycle works before any canvas enhancements beyond basic dot |
| Version-proposal disconnect | Phase 1 (data model) | FK constraint exists; admin cannot create version without linking a proposal |
| Content moderation | Phase 2 (scaling) | Basic profanity filter on proposals; admin can hide proposals; report mechanism exists |
| Vote count performance | Phase 2 (optimization) | Proposal list page loads in under 1s with 100+ proposals |

## Sources

- [Feature Upvote - Feature voting: How to make it work](https://featureupvote.com/blog/feature-voting/)
- [Savio - Feature Voting Tools and Pitfalls](https://www.savio.io/blog/feature-voting/)
- [Supabase Docs - Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Docs - Securing your API](https://supabase.com/docs/guides/api/securing-your-api)
- [ProsperaSoft - Fixing RLS Misconfigurations in Supabase](https://prosperasoft.com/blog/database/supabase/supabase-rls-issues/)
- [Precursor Security - Row-Level Recklessness: Supabase Security Testing](https://www.precursorsecurity.com/blog/row-level-recklessness-testing-supabase-security)
- [Supabase Docs - Troubleshooting Next.js Auth Issues](https://supabase.com/docs/guides/troubleshooting/how-do-you-troubleshoot-nextjs---supabase-auth-issues-riMCZV)
- [Supabase Docs - Setting up Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Feature Upvote - How we prevent voting manipulation](https://help.featureupvote.com/article/29-how-do-you-prevent-voting-manipulation)
- [Konva.js - How to avoid Memory Leaks with Canvas](https://konvajs.org/docs/performance/Avoid_Memory_Leaks.html)
- [GetStream - How to Scale Content Moderation Without Compromising UX](https://getstream.io/blog/scaling-content-moderation/)
- [What Twitch Plays Pokemon Teaches Us About Video Game Communities](https://www.popmatts.com/179402-what-twitch-plays-pokemon-teaches-us-about-video-game-communities-2495683867.html)

---
*Pitfalls research for: Community-driven collaborative game platform*
*Researched: 2026-05-18*
