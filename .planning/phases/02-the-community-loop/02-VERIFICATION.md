---
phase: 02-the-community-loop
verified: 2026-05-18T23:00:00Z
status: human_needed
score: 5/5 must-haves verified
overrides_applied: 0
deferred:
  - truth: "Database migration pushed and RLS DELETE policy active in live Supabase database"
    addressed_in: "Phase 4"
    evidence: "Phase 4 success criteria 5: 'Site is deployed to Vercel at startedwithadot.com' — deployment phase (DEPL-01) covers pushing all migrations to the live database. STATE.md documents this as a standing project-wide deferral."
human_verification:
  - test: "Proposal submission end-to-end"
    expected: "Authenticated, email-verified user submits a 140-char proposal and it appears in the feed sorted by vote_count descending. Toast appears with narrator message. Submitting 4 proposals in one UTC day is blocked on the 4th attempt."
    why_human: "Requires live Supabase database with schema pushed. Cannot verify DB insert behavior programmatically without running the app."
  - test: "Vote toggle with optimistic UI"
    expected: "Clicking the dot counter immediately increments and highlights white. Clicking again decrements and returns to gray. Refreshing the page preserves vote state from the server."
    why_human: "Optimistic state and rollback behavior requires browser interaction. Vote write path needs live DB with votes table."
  - test: "Status tab filtering"
    expected: "Clicking Open tab updates URL to ?status=open and shows only open proposals. Rejected proposals never appear in the All tab. Tab state is shareable via URL."
    why_human: "Requires live proposals data in DB across multiple statuses to verify filter logic end-to-end."
  - test: "Admin curation controls"
    expected: "User with is_admin=true on their profile sees a three-dot menu on every proposal card. Accept/Reject appear only for open proposals. Mark Implemented appears only for accepted proposals. Delete triggers window.confirm before removing the proposal. Version creation dialog collects version_number and title and creates a versions record."
    why_human: "Requires admin flag set on a profile in the live DB. Dropdown behavior, dialog, and window.confirm require browser interaction."
  - test: "Non-admin users see no admin controls"
    expected: "A logged-in user without is_admin=true sees only the vote button — no three-dot menu."
    why_human: "Requires live auth session and profile lookup against running DB."
---

# Phase 02: The Community Loop — Verification Report

**Phase Goal:** Users can propose ideas, vote on them, and an admin can curate the proposal lifecycle
**Verified:** 2026-05-18T23:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Authenticated user can submit a proposal (140-char limit enforced, rate-limited to 3/day) and see it appear in the feed | VERIFIED | `actions/proposals.ts`: `proposalSchema.safeParse`, UTC rate-limit query with `count >= 3` guard, `revalidatePath("/proposals")` on success. `proposal-input.tsx`: `maxLength={MAX_CHARS}` on input, `useActionState(submitProposal)` binding. |
| 2 | Authenticated user can toggle-vote on any proposal and see dot-based vote counters update instantly (optimistic UI) | VERIFIED | `vote-button.tsx`: optimistic `setVoted`/`setCount` before await, rollback to `prevVoted`/`prevCount` on error. `DotCounter` renders hollow circle / dot symbols / numeric per spec. |
| 3 | Unauthenticated visitor can browse proposals but cannot submit or vote | VERIFIED | `proposal-input.tsx`: renders sign-up CTA with `Link` to `/auth/sign-up` when `!isAuthenticated`. `vote-button.tsx`: button `disabled={!userId \|\| pending}`, `cursor-default` when no userId. Feed page fetches and renders regardless of auth state. |
| 4 | Admin can change proposal status, create versions linked to proposals, and delete proposals for moderation | VERIFIED | `admin-menu.tsx`: `handleStatusChange` calls `updateProposalStatus`, `handleDelete` calls `deleteProposal` with `window.confirm`, version dialog calls `createVersion`. `actions/proposals.ts`: `updateProposalStatus` and `deleteProposal` exported. `actions/versions.ts`: `createVersion` inserts version and marks proposal implemented. `proposal-card-actions.tsx`: conditionally renders `AdminMenu` only when `isAdmin`. |
| 5 | Proposals display in a filterable feed sorted by votes, with status tabs (All/Open/Accepted/Implemented) | VERIFIED | `page.tsx`: `.order("vote_count", { ascending: false })`. Status filter applied via `query.eq("status", status)` or `query.neq("status", "rejected")` for "all" tab. `status-tabs.tsx`: 4 tabs (All/Open/Accepted/Implemented), no Rejected tab, URL param state via `useSearchParams`/`router.push`. |

**Score: 5/5 truths verified**

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/proposals/page.tsx` | Server Component proposal feed page | VERIFIED | Exists, 145 lines. Fetches from `supabase.from("proposals").select("*, profiles(username)")`, passes auth/vote state down. |
| `actions/proposals.ts` | submitProposal, updateProposalStatus, deleteProposal Server Actions | VERIFIED | Exists, 124 lines. All three actions exported with `"use server"`. |
| `lib/validations/proposals.ts` | Zod schemas for proposal and version | VERIFIED | Exports `proposalSchema`, `versionSchema`, `ProposalInput`, `VersionInput`. |
| `lib/format.ts` | Relative timestamp utility | VERIFIED | Exports `timeAgo` using `Intl.RelativeTimeFormat("en", { style: "narrow" })`. |
| `components/proposals/proposal-input.tsx` | Client Component inline proposal form | VERIFIED | `"use client"`, `useActionState` from `"react"`, `maxLength={140}`, milestone messages at 140/50/20/0, Sonner toasts on success/error. |
| `components/proposals/proposal-card.tsx` | Proposal card layout | VERIFIED | Uses `Card`/`CardContent`, shows status badge, text, username, timestamp, `actions` slot. |
| `components/proposals/dot-counter.tsx` | Vote count dot visualization | VERIFIED | Hollow circle for 0, `"●".repeat(count)` for 1-10, `● {count}` for >10. |
| `components/proposals/status-badge.tsx` | Status indicator with dot prefix | VERIFIED | Uses `Badge`, renders `● {STATUS_LABELS[status]}` with Press Start 2P font. |
| `components/proposals/vote-button.tsx` | Optimistic vote toggle client component | VERIFIED | `"use client"`, `createClient` from browser client, optimistic state, rollback, 44px touch target. |
| `components/proposals/proposal-card-actions.tsx` | Client wrapper for interactive card elements | VERIFIED | `"use client"`, conditionally renders `AdminMenu` when `isAdmin`, always renders `VoteButton`. |
| `components/proposals/status-tabs.tsx` | Filter tabs with URL param state | VERIFIED | `"use client"`, `useSearchParams` + `useRouter`, 4 tabs, URL push on change. |
| `components/proposals/admin-menu.tsx` | Admin dropdown with status change and delete actions | VERIFIED | `"use client"`, `DropdownMenu` with `MoreHorizontal` trigger, Accept/Reject/Mark Implemented/Delete items, version creation `Dialog`, `window.confirm` before delete. |
| `actions/versions.ts` | createVersion Server Action | VERIFIED | `"use server"`, Zod validates `versionNumber`/`title`, inserts to `versions`, updates proposal to `implemented`. |
| `supabase/migrations/00002_admin_delete_proposals.sql` | RLS DELETE policy for admin proposal deletion | VERIFIED | `CREATE POLICY "Admin can delete proposals" ON proposals FOR DELETE ... EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)` |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `proposal-input.tsx` | `actions/proposals.ts` | `useActionState(submitProposal)` | WIRED | `useActionState(submitProposal, undefined)` on line 29-32. Import from `@/actions/proposals` on line 6. |
| `app/proposals/page.tsx` | `supabase.from('proposals')` | Server Component data fetch | WIRED | `.from("proposals").select("*, profiles(username)").order("vote_count", ...)` in `ProposalFeed`. |
| `actions/proposals.ts` | `lib/validations/proposals.ts` | Zod schema import | WIRED | `import { proposalSchema } from "@/lib/validations/proposals"` on line 4. |
| `vote-button.tsx` | `supabase.from('votes')` | Browser Supabase client insert/delete | WIRED | `supabase.from("votes").insert(...)` and `.delete().eq(...)` in `toggleVote`. |
| `status-tabs.tsx` | `app/proposals/page.tsx` | URL search param `?status=` | WIRED | `router.push` with `?status=` param in tabs; page reads `params.status` from `searchParams` prop. |
| `app/proposals/page.tsx` | `supabase.from('votes')` | Fetch user votes for highlight state | WIRED | `.from("votes").select("proposal_id").eq("user_id", user.id)` — Set built for O(1) lookup. |
| `admin-menu.tsx` | `actions/proposals.ts` | Server Action calls for status/delete | WIRED | `import { updateProposalStatus, deleteProposal }` on line 24. Called in `handleStatusChange` and `handleDelete`. |
| `admin-menu.tsx` | `actions/versions.ts` | Server Action for version creation | WIRED | `import { createVersion }` on line 25. Called in `handleCreateVersion`. |
| `supabase/migrations/00002_admin_delete_proposals.sql` | `proposals` table | RLS DELETE policy | WIRED | Policy `FOR DELETE` on `proposals` table with `is_admin` check in SQL file. Not yet pushed to live DB (see Deferred Items). |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `app/proposals/page.tsx` | `proposals` | `supabase.from("proposals").select("*, profiles(username)")` | Yes — real DB query with join | FLOWING |
| `vote-button.tsx` | `voted`, `count` | `initialVoted`/`initialCount` from server + optimistic `useState` updates | Yes — server state + client optimism | FLOWING |
| `proposal-input.tsx` | `state` (action result) | `useActionState(submitProposal)` | Yes — real Server Action result | FLOWING |
| `admin-menu.tsx` | action results | `updateProposalStatus`, `deleteProposal`, `createVersion` Server Actions | Yes — real Server Actions calling DB | FLOWING |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| TypeScript compilation | `npx tsc --noEmit` (per plan task verification) | Documented as passing in SUMMARY files | SKIP — no runnable check without DB |
| Build passes | `npm run build` (per plan task verification) | Documented as passing in all 3 SUMMARY files | SKIP — requires Next.js build environment |

Step 7b: SKIPPED — behavioral checks require running server with live Supabase database. All verifiable static checks passed via code inspection above.

---

### Probe Execution

Step 7c: No probe scripts declared in plan files or found at `scripts/*/tests/probe-*.sh`. SKIPPED.

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| PROP-01 | 02-01 | Authenticated user can submit a proposal (max 140 characters, inline input) | SATISFIED | `submitProposal` action + `proposal-input.tsx` with `maxLength=140` |
| PROP-02 | 02-01 | Character counter with narrator-style feedback | SATISFIED | `getMilestoneMessage()` in `proposal-input.tsx` at 140/50/20/0 remaining |
| PROP-03 | 02-01 | Proposals sorted by votes (most dots first) | SATISFIED | `.order("vote_count", { ascending: false })` in `page.tsx` |
| PROP-04 | 02-01 | Each proposal shows: text, username, relative timestamp, dot-counter, status indicator | SATISFIED | `proposal-card.tsx` renders all five elements |
| PROP-05 | 02-02 | Proposals filterable by status tabs: All / Open / Accepted / Implemented | SATISFIED | `status-tabs.tsx` + URL param filtering in `page.tsx` |
| PROP-06 | 02-01 | Rate limiting at 3 proposals per user per day | SATISFIED | UTC-based `count >= 3` guard in `submitProposal` |
| PROP-07 | 02-01 | Unauthenticated users can view but not submit or vote | SATISFIED | `proposal-input.tsx` sign-up CTA; `vote-button.tsx` disabled when `!userId` |
| VOTE-01 | 02-02 | Authenticated user can toggle upvote (one vote per user per proposal) | SATISFIED | `vote-button.tsx` insert/delete on votes table; UNIQUE constraint at DB level |
| VOTE-02 | 02-02 | Votes visualized as dot counters with numeric above threshold | SATISFIED | `dot-counter.tsx`: dots for ≤10, `● {count}` for >10 |
| VOTE-03 | 02-02 | Own vote visually highlighted | SATISFIED | `DotCounter` uses `text-foreground` when `voted=true`, `text-muted-foreground` otherwise |
| VOTE-04 | 02-02 | Optimistic UI update with server reconciliation | SATISFIED | `vote-button.tsx`: optimistic state set before await, rollback on error |
| ADMN-01 | 02-03 | Admin can change proposal status (Open→Accepted/Rejected, Accepted→Implemented) | SATISFIED | `updateProposalStatus` action + `admin-menu.tsx` conditional menu items per status |
| ADMN-02 | 02-03 | Admin can create new versions linked to implemented proposals | SATISFIED | `createVersion` action + version dialog in `admin-menu.tsx` |
| ADMN-03 | 02-03 | Admin can delete proposals for moderation | SATISFIED | `deleteProposal` action + `window.confirm` in `admin-menu.tsx`; RLS DELETE policy in migration |
| ADMN-04 | 02-03 | Admin controls accessible directly in UI (not only Supabase Dashboard) | SATISFIED | `admin-menu.tsx` rendered in `proposal-card-actions.tsx` when `isAdmin=true` |

**All 15 requirements: SATISFIED** (code artifacts verified)

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `components/proposals/admin-menu.tsx` | 134, 146 | `placeholder=` attribute | Info | HTML input placeholder attributes — not a stub indicator. Normal form UX. |

No TBD, FIXME, XXX, or structural stubs found in any phase-modified file.

---

### Deferred Items

Items not yet met but explicitly addressed in later milestone phases.

| # | Item | Addressed In | Evidence |
|---|------|-------------|----------|
| 1 | Database migration `00002_admin_delete_proposals.sql` pushed to live Supabase database | Phase 4 | Phase 4 success criteria 5: "Site is deployed to Vercel at startedwithadot.com" covers deployment including migration push (DEPL-01). STATE.md documents this as a standing project-wide deferral consistent with Phase 1 behavior. |

---

### Human Verification Required

#### 1. Proposal Submission End-to-End

**Test:** Log in with a verified email account. Navigate to `/proposals`. Submit a proposal under 140 characters. Submit a second and third proposal. Attempt a fourth submission in the same UTC day.
**Expected:** First three submissions succeed with a Sonner toast ("Proposal submitted. The dot is listening.") and the proposal appears in the feed. The fourth submission returns the rate-limit error toast ("Three ideas a day. That's the limit. Quality over quantity.").
**Why human:** Requires live Supabase database with schema pushed and an authenticated browser session.

#### 2. Vote Toggle with Optimistic UI

**Test:** As an authenticated user, click the dot counter on any proposal. Then click it again. Then refresh the page.
**Expected:** On first click: count increments immediately and dots turn white (foreground color). On second click: count decrements and dots return to gray (muted-foreground). After refresh: vote state matches what was last set (persisted from server).
**Why human:** Optimistic state, rollback path, and server persistence require browser interaction against a running DB.

#### 3. Status Tab Filtering

**Test:** Navigate to `/proposals`. Click "Open" tab, then "Accepted", then "Implemented", then "All". Directly load `/proposals?status=open`.
**Expected:** URL updates to `?status=open` (or removes param for All). Feed shows only proposals matching the selected status. Rejected proposals never appear in Any tab view.
**Why human:** Requires proposals with varied statuses in the database to exercise all filter branches.

#### 4. Admin Curation Controls

**Test:** Set `is_admin=true` on a profile in Supabase Dashboard. Log in as that user. Navigate to `/proposals`. Observe proposal cards. Click the three-dot menu on an open proposal, click Accept. Click the three-dot menu on the now-accepted proposal, click Mark Implemented — fill in version number and title in the dialog. Click the three-dot menu on any proposal, click Delete, confirm the dialog.
**Expected:** Three-dot menu (MoreHorizontal icon) appears on every card for the admin user. Accept/Reject visible only for open proposals. Mark Implemented visible only for accepted proposals. Version creation dialog saves a record to `versions` table and marks the proposal as implemented. Delete removes the proposal after confirmation.
**Why human:** Requires live DB with admin flag, browser interaction for dropdown and dialog, and `window.confirm` cannot be automated.

#### 5. Non-Admin User Sees No Admin Controls

**Test:** Log in as a user without `is_admin=true`. Navigate to `/proposals`.
**Expected:** Proposal cards show only the vote button in the bottom-right. No three-dot menu is visible.
**Why human:** Requires two separate user accounts and live auth sessions to contrast admin vs. non-admin rendering.

---

### Gaps Summary

No code gaps found. All 15 requirements are satisfied by substantive, wired, and data-flowing implementations. The only outstanding item is the database migration push to the live Supabase instance — this is a human operational step documented as a standing project-wide deferral and addressed by Phase 4 deployment.

The 5 human verification items above are operationally required but represent expected browser/database integration testing, not missing code functionality.

---

_Verified: 2026-05-18T23:00:00Z_
_Verifier: Claude (gsd-verifier)_
