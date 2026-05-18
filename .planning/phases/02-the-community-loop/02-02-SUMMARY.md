---
phase: 02-the-community-loop
plan: 02
subsystem: proposals
tags: [voting, optimistic-ui, url-params, status-tabs, 8bitcn-tabs]
dependency_graph:
  requires:
    - phase: 02-01
      provides: proposal-feed, proposal-card, dot-counter, supabase-client-pattern
  provides:
    - vote-toggle-optimistic
    - status-tab-filtering
    - proposal-card-actions-slot
  affects: [02-03]
tech_stack:
  added: [8bitcn-tabs]
  patterns: [optimistic-vote-toggle, url-param-filtering, set-based-vote-lookup, actions-slot-pattern]
key_files:
  created:
    - components/proposals/vote-button.tsx
    - components/proposals/proposal-card-actions.tsx
    - components/proposals/status-tabs.tsx
  modified:
    - app/proposals/page.tsx
    - components/proposals/proposal-card.tsx
    - components/ui/8bit/styles/retro.css
key_decisions:
  - "Moved searchParams reading inside Suspense boundary for Next.js 16 cacheComponents compatibility"
  - "ProposalCard uses actions slot instead of static DotCounter for interactive vote button"
  - "User votes fetched in single query with Set-based O(1) lookup, not per-card"
patterns-established:
  - "Optimistic client mutation: useState for local state, createClient() for browser Supabase, rollback on error"
  - "URL param filtering: useSearchParams + router.push in client component, server reads searchParams prop"
  - "Actions slot pattern: Server Component card delegates interactive elements via ReactNode prop"
requirements-completed: [VOTE-01, VOTE-02, VOTE-03, VOTE-04, PROP-05]
duration: 3min
completed: 2026-05-18
---

# Phase 02 Plan 02: Voting and Status Tabs Summary

Optimistic vote toggle with dot-counter visualization, single-query vote lookup, and URL-param-based status tab filtering using 8bitcn Tabs component.

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-18T22:08:35Z
- **Completed:** 2026-05-18T22:12:06Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Interactive vote toggle with immediate optimistic feedback and error rollback with toast notification
- Status tabs (All/Open/Accepted/Implemented) filter feed via URL search params for shareability
- User votes fetched in single query with Set-based O(1) lookup -- no per-card queries
- ProposalCard refactored to actions slot pattern for interactive bottom-right elements

## Task Commits

Each task was committed atomically:

1. **Task 1: Status tabs with URL param filtering** - `be2472b` (feat)
2. **Task 2: Vote button with optimistic UI and card actions** - `89f0e62` (feat)

## Files Created/Modified
- `components/proposals/status-tabs.tsx` - Client component: 8bitcn Tabs with useSearchParams URL state
- `components/proposals/vote-button.tsx` - Client component: optimistic vote toggle with rollback
- `components/proposals/proposal-card-actions.tsx` - Client wrapper composing VoteButton (AdminMenu placeholder for Plan 03)
- `app/proposals/page.tsx` - Added status filtering, user vote fetch, ProposalCardActions wiring
- `components/proposals/proposal-card.tsx` - Replaced static DotCounter with actions slot
- `components/ui/8bit/styles/retro.css` - Removed duplicate Google Fonts import (already loaded via next/font)

## Decisions Made
1. **searchParams inside Suspense**: Next.js 16 cacheComponents treats searchParams as uncached data. Moved reading into ProposalFeed (inside Suspense) to avoid blocking the page shell.
2. **Actions slot pattern**: Replaced the `voted` prop and static DotCounter on ProposalCard with an `actions` ReactNode slot. This cleanly separates server-rendered card content from client-interactive elements.
3. **Single vote query**: Fetch all user votes in one query, build a Set for O(1) per-card lookup. Follows the anti-pattern warning from research (no per-card vote queries).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] searchParams outside Suspense causes build failure in Next.js 16**
- **Found during:** Task 1 build verification
- **Issue:** Awaiting `searchParams` in the page component (outside Suspense) triggers "Uncached data was accessed outside of <Suspense>" build error.
- **Fix:** Passed searchParams promise down to ProposalFeed component inside the Suspense boundary, where it is awaited.
- **Files modified:** app/proposals/page.tsx
- **Verification:** npm run build passes
- **Committed in:** be2472b (Task 1 commit)

**2. [Rule 2 - Missing Critical] ProposalCard needed actions slot for interactive vote button**
- **Found during:** Task 2 implementation
- **Issue:** ProposalCard had a static DotCounter in the bottom-right with a `voted` boolean prop. The new VoteButton needs to replace this with an interactive client component.
- **Fix:** Replaced `voted` prop and static DotCounter with an `actions` ReactNode slot. This is a non-breaking change -- the card accepts any ReactNode.
- **Files modified:** components/proposals/proposal-card.tsx
- **Verification:** npm run build passes
- **Committed in:** 89f0e62 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 missing critical)
**Impact on plan:** Both fixes necessary for correctness. No scope creep.

## Issues Encountered
- 8bitcn tabs install command required `.json` extension on registry URL (400 error without it). Resolved by using `https://www.8bitcn.com/r/tabs.json`.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Vote toggle and status filtering complete, ready for Plan 03 (admin curation)
- ProposalCardActions has AdminMenu placeholder ready for Plan 03 integration
- The `isAdmin` flag is already fetched and passed through, awaiting admin UI

---
*Phase: 02-the-community-loop*
*Completed: 2026-05-18*
