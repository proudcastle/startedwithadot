# Phase 2: The Community Loop - Context

**Gathered:** 2026-05-18
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the core community feedback loop: authenticated users can submit proposals (140-char limit, rate-limited to 3/day), vote on proposals (toggle upvote, one per user per proposal with optimistic UI), and browse a filterable proposal feed sorted by votes. An admin can change proposal statuses (Open/Accepted/Rejected/Implemented), create versions linked to implemented proposals, and delete proposals for moderation. Unauthenticated visitors can browse but not submit or vote. At the end of this phase, the full propose-vote-curate cycle works end-to-end — the product's core value is functional.

</domain>

<decisions>
## Implementation Decisions

### Proposal Feed Layout
- **D-01:** Card-based vertical list using the existing 8bitcn Card component. Each card shows: proposal text, author username, relative timestamp, dot-based vote counter, and status badge. Cards stack vertically, sorted by vote count (most dots first) with status tabs above (All / Open / Accepted / Implemented).
- **D-02:** Status tabs use a simple tab bar (install 8bitcn tabs component if needed, or use badge-based filter buttons). Active tab is visually highlighted. "All" is the default tab.

### Proposal Input
- **D-03:** Inline input at the top of the proposal feed, Twitter-style. Single text field with submit button. Character counter shows remaining characters (counts down from 140). Input only visible to authenticated, email-verified users — unauthenticated visitors see a CTA to sign up instead.
- **D-04:** Character counter should provide narrator-style feedback at milestones (e.g., approaching limit). Validation via Zod schema matching the established pattern from `actions/auth.ts`.
- **D-05:** Server Action for proposal submission with Zod validation (140-char max, not empty, rate limit check). Rate limit of 3 proposals/day enforced via a database function or RLS policy counting today's proposals per user.

### Voting Interaction
- **D-06:** Vote toggle via clicking a dot icon (●) next to each proposal. Clicking toggles the vote on/off. The dot fills/highlights when the user has voted. Reinforces "dot as DNA" visual language.
- **D-07:** Optimistic UI — vote count and own-vote state update immediately on click, then reconcile with server response. Use the browser Supabase client for the vote toggle (client-side mutation for instant feedback).
- **D-08:** Vote count displays as dot symbols (● ● ●) for counts ≤ 10, then switches to numeric display with a single dot icon (● 42) for counts > 10.

### Admin Controls
- **D-09:** Admin actions appear as a dropdown menu (⋯ trigger) on each proposal card, visible only when `is_admin = true` on the user's profile. Menu items: "Accept", "Reject", "Mark Implemented", "Delete". Status changes are immediate (Server Action).
- **D-10:** Admin can create a new version when marking a proposal as "Implemented" — a simple inline form or dialog asking for version number and title. This links the version to the proposal.
- **D-11:** Admin check is done server-side via RLS policies (already designed in Phase 1 D-12, D-13). The UI reads `is_admin` from the profile to conditionally render admin controls.

### Data Fetching & State
- **D-12:** Proposal feed is a Server Component that fetches proposals with their vote counts and status. Use Supabase's `.select()` with a join to get author username. Paginate or limit to a reasonable initial set (e.g., 50 most-voted).
- **D-13:** Voting requires client-side interactivity — the vote button and optimistic update logic live in a Client Component that wraps each proposal card's interactive elements.
- **D-14:** No realtime subscriptions in this phase (per PROJECT.md key decision). Users see updated vote counts on page refresh or after their own vote action.

### Rate Limiting
- **D-15:** Rate limit of 3 proposals per day per user, enforced at the database level via an RPC function or a check in the Server Action that counts proposals with `created_at >= today` for the current user. Rejected with a narrator-voice error message.

### Claude's Discretion
- Exact component composition (how proposal cards are structured internally)
- Server Action vs. RPC function choice for vote toggling
- Whether to use a Supabase database function for rate limiting or handle it in the Server Action
- Tab component choice (8bitcn tabs vs. custom filter buttons)
- Pagination strategy (load more button vs. fixed page)
- Toast notifications for actions (use Sonner, already in project constraints)
- URL state for active filter tab (query params or not)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Core value, constraints, key decisions, out-of-scope items
- `.planning/REQUIREMENTS.md` — Full v1 requirements (PROP-01..07, VOTE-01..04, ADMN-01..04 for this phase)
- `.planning/ROADMAP.md` — Phase structure, success criteria, dependency order

### Prior Phase Context
- `.planning/phases/01-foundation-and-auth/01-CONTEXT.md` — Foundation decisions (schema design D-06..D-13, auth patterns D-17..D-18)

### Research (from Phase 1)
- `.planning/research/STACK.md` — Validated stack with specific versions, anti-recommendations
- `.planning/research/ARCHITECTURE.md` — Component boundaries, data flow, build order
- `.planning/research/PITFALLS.md` — RLS misconfiguration risks, Supabase traps

### Existing Code
- `types/database.ts` — Generated TypeScript types for all tables (proposals, votes, profiles, versions)
- `actions/auth.ts` — Established Server Action + Zod validation pattern
- `lib/supabase/server.ts` — Server-side Supabase client factory
- `lib/supabase/client.ts` — Browser-side Supabase client factory
- `middleware.ts` — Auth middleware protecting `/protected` routes
- `components/header.tsx` — Header with auth-aware nav (pattern for conditional UI)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/ui/8bit/card.tsx` — 8bitcn Card for proposal cards
- `components/ui/8bit/badge.tsx` — 8bitcn Badge for status indicators (open/accepted/implemented/rejected)
- `components/ui/8bit/button.tsx` — 8bitcn Button for submit and actions
- `components/ui/8bit/input.tsx` — 8bitcn Input for proposal text field
- `components/ui/dropdown-menu.tsx` — Dropdown for admin actions menu
- `components/submit-button.tsx` — Existing form submit button with pending state
- `types/database.ts` — Full typed schema including `proposal_status` enum

### Established Patterns
- Server Actions with Zod validation and redirect-on-error (`actions/auth.ts`)
- Server Components fetching Supabase data with `createClient()` from `lib/supabase/server.ts`
- Client-side Supabase via `createClient()` from `lib/supabase/client.ts`
- Font usage: `font-[family-name:var(--font-press-start-2p)]` for headings
- Profile fetching pattern: `.from("profiles").select("username").eq("id", user.id).single()`
- Auth state check: `supabase.auth.getUser()` in Server Components
- Email verification check: `!!user.email_confirmed_at`

### Integration Points
- Header nav needs a link to proposals feed (or it becomes the main page)
- Protected route pattern in middleware — proposals page should be public (read), interactions protected
- The home page (`app/page.tsx`) is currently a placeholder — proposal feed likely replaces or lives alongside it

</code_context>

<specifics>
## Specific Ideas

- Dot-based vote counters: ● ● ● for small counts, ● 42 for larger — this is the visual DNA of the project
- Character counter with narrator personality: "140 characters. Make them count." → "Getting tight..." → "Almost out of characters, choose wisely."
- Status badges should use dot prefixes: "● Open", "● Accepted", "● Implemented", "● Rejected" with subtle gray variation
- The proposal feed is the heart of the product — it should feel immediate and responsive, not like a form-heavy admin interface
- Admin dropdown trigger should be subtle (⋯) so it doesn't clutter the feed for regular users

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 2-The Community Loop*
*Context gathered: 2026-05-18*
