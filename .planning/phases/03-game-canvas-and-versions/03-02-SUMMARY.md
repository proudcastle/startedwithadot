---
phase: 03-game-canvas-and-versions
plan: 02
subsystem: ui
tags: [changelog, versions, server-components, suspense, supabase-joins]

requires:
  - phase: 01-foundation-and-auth
    provides: App shell, header, Supabase client, database schema with versions table
  - phase: 02-proposal-and-voting-loop
    provides: Proposal card pattern, status badge pattern, admin version creation flow
provides:
  - Version history changelog page at /changelog
  - VersionCard component for rendering version entries
  - VersionBadge component for header version indicator
  - Header integration with live version number
affects: [04-polish-and-launch]

tech-stack:
  added: []
  patterns:
    - "Suspense-wrapped async Server Component for data fetching (Next.js 16 cacheComponents)"
    - "Two-level nested Supabase join: versions -> proposals -> profiles"
    - "Null-safe nested object access with ?? fallback for join results"

key-files:
  created:
    - components/versions/version-card.tsx
    - components/versions/version-badge.tsx
    - app/changelog/page.tsx
  modified:
    - components/header.tsx

key-decisions:
  - "Suspense boundary required for changelog data fetch (Next.js 16 cacheComponents blocks uncached data outside Suspense)"
  - "VersionCard type extends Database Row with nullable join shape for type safety"

patterns-established:
  - "Version display pattern: VersionCard with nested proposal/profile join data"
  - "Header badge pattern: VersionBadge as server component with maybeSingle() query"

requirements-completed: [CHNG-01, CHNG-02, CHNG-03]

duration: 2min
completed: 2026-05-19
---

# Phase 3 Plan 2: Version History Changelog Summary

**Changelog page at /changelog with reverse-chronological version cards and header version badge linking to it**

## Performance

- **Duration:** 2 min
- **Started:** 2026-05-19T10:49:46Z
- **Completed:** 2026-05-19T10:51:44Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- VersionCard component displays version number, title, description, author, date, and linked proposal text with 60-char truncation
- VersionBadge renders clickable "v{N}" indicator in header using 8bitcn Badge variant="outline", shows "v0" when no versions exist
- Changelog page fetches versions with two-level nested Supabase join (versions -> proposals -> profiles)
- Empty state uses narrator voice: "The dot is waiting for its first evolution. Go propose something." with CTA link to /proposals
- Header queries latest version number and renders VersionBadge before Proposals link

## Task Commits

Each task was committed atomically:

1. **Task 1: Create VersionCard and VersionBadge components** - `ba6c74a` (feat)
2. **Task 2: Create changelog page and add version badge to header** - `59639ba` (feat)

## Files Created/Modified
- `components/versions/version-card.tsx` - Server Component rendering a single version entry with Card, nested join data, timeAgo, and proposal text truncation
- `components/versions/version-badge.tsx` - Server Component rendering a Badge with version number linking to /changelog
- `app/changelog/page.tsx` - Changelog page with Suspense-wrapped async VersionList, metadata export, empty state with narrator copy
- `components/header.tsx` - Added VersionBadge import, latest version query, and badge rendering in nav

## Decisions Made
- Added Suspense boundary for changelog data fetch -- Next.js 16 cacheComponents requires uncached data to be inside Suspense (same pattern as proposals page)
- Defined VersionWithProposal type extending Database Row with nullable join shape for type-safe nested access

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added Suspense boundary for changelog page**
- **Found during:** Task 2 (Changelog page creation)
- **Issue:** Next.js 16 cacheComponents mode blocks builds when uncached Supabase data is fetched outside Suspense
- **Fix:** Split into VersionList async component wrapped in Suspense, matching proposals page pattern
- **Files modified:** app/changelog/page.tsx
- **Verification:** Build succeeds with /changelog as Partial Prerender route
- **Committed in:** 59639ba (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential for build success. No scope creep -- follows established project pattern.

## Issues Encountered
None beyond the auto-fixed Suspense requirement.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Version history UI complete, ready for Phase 4 polish and launch
- All core loop components (proposals, voting, admin, canvas, versions) are now functional
- Phase 3 fully complete (both plans done)

---
## Self-Check: PASSED

All files exist, all commits verified, all key patterns confirmed.

*Phase: 03-game-canvas-and-versions*
*Completed: 2026-05-19*
