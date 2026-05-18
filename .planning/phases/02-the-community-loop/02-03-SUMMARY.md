---
phase: 02-the-community-loop
plan: 03
subsystem: proposals
tags: [admin-curation, status-management, proposal-deletion, version-creation, rls-policy]
dependency_graph:
  requires:
    - phase: 02-01
      provides: proposal-feed, submit-proposal-action, validation-schemas
    - phase: 02-02
      provides: vote-toggle-optimistic, proposal-card-actions-slot
  provides:
    - admin-status-changes
    - admin-proposal-deletion
    - version-creation-from-proposals
    - rls-delete-policy
  affects: []
tech_stack:
  added: [8bitcn-dialog]
  patterns: [admin-dropdown-menu, server-action-status-mutation, version-creation-dialog, rls-delete-policy]
key_files:
  created:
    - supabase/migrations/00002_admin_delete_proposals.sql
    - actions/versions.ts
    - components/proposals/admin-menu.tsx
    - components/ui/dialog.tsx
    - components/ui/8bit/dialog.tsx
  modified:
    - actions/proposals.ts
    - components/proposals/proposal-card-actions.tsx
    - app/proposals/page.tsx
    - components/ui/8bit/styles/retro.css
key_decisions:
  - "RLS DELETE policy pattern mirrors existing UPDATE policy for consistency"
  - "Version creation also marks linked proposal as implemented in same action"
  - "Menu items conditionally shown based on valid status transitions (Open->Accepted/Rejected, Accepted->Implemented)"
requirements-completed: [ADMN-01, ADMN-02, ADMN-03, ADMN-04]
duration: 3min
completed: 2026-05-18
---

# Phase 02 Plan 03: Admin Curation Summary

Admin dropdown menu with status changes, proposal deletion, and version creation dialog -- closing the propose-vote-curate loop so the dot evolves through community decisions.

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-18T22:14:57Z
- **Completed:** 2026-05-18T22:18:02Z
- **Tasks:** 3 (2 auto + 1 checkpoint auto-approved)
- **Files modified:** 9

## Accomplishments

- RLS DELETE policy on proposals table for admin-only deletion
- updateProposalStatus and deleteProposal Server Actions added to actions/proposals.ts
- createVersion Server Action with Zod validation that also marks proposal as implemented
- Admin three-dot dropdown menu with context-appropriate actions based on proposal status
- Version creation dialog with version number and title inputs
- Delete action with window.confirm friction before destructive operation
- ProposalCardActions conditionally renders AdminMenu for admin users only
- 8bitcn Dialog component installed (retro.css Google Fonts duplicate removed)

## Task Commits

1. **Task 1: Database migration, admin Server Actions, and version creation** - `359103d` (feat)
2. **Task 2: Admin dropdown menu, version creation dialog, and card wiring** - `69c3358` (feat)
3. **Task 3: Push database migration** - Auto-approved (deferred to user)

## Files Created/Modified

- `supabase/migrations/00002_admin_delete_proposals.sql` - RLS DELETE policy for admin proposal deletion
- `actions/proposals.ts` - Added updateProposalStatus and deleteProposal exports
- `actions/versions.ts` - createVersion Server Action with Zod validation
- `components/proposals/admin-menu.tsx` - Client component: dropdown menu + version creation dialog
- `components/proposals/proposal-card-actions.tsx` - Added AdminMenu conditional rendering + proposalStatus prop
- `app/proposals/page.tsx` - Passes proposalStatus to ProposalCardActions
- `components/ui/dialog.tsx` - shadcn dialog base component (installed by 8bitcn)
- `components/ui/8bit/dialog.tsx` - 8bitcn retro-styled dialog wrapper
- `components/ui/8bit/styles/retro.css` - Removed duplicate Google Fonts import

## Decisions Made

1. **RLS DELETE mirrors UPDATE pattern**: The new DELETE policy uses the identical `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)` pattern from the existing UPDATE policy for consistency.
2. **Version creation sets proposal status**: createVersion atomically inserts the version and updates the linked proposal to "implemented" status, avoiding a two-step manual process.
3. **Conditional menu items**: Accept/Reject only shown for "open" proposals, Mark Implemented only for "accepted" -- enforcing valid state transitions in the UI (RLS enforces at DB level).

## Deviations from Plan

None - plan executed exactly as written.

## Deferred Items

### Database Migration Push

The migration file `supabase/migrations/00002_admin_delete_proposals.sql` is committed but NOT pushed to the live Supabase database. The user must run `npx supabase db push` with valid Supabase credentials to apply both migrations (00001 and 00002). This is the same deferral from Phase 1 (see STATE.md decision: "Schema push deferred").

**To apply:**
1. Set `SUPABASE_ACCESS_TOKEN` in environment
2. Run `npx supabase db push`
3. Verify "Admin can delete proposals" policy exists in Supabase Dashboard
4. Set `is_admin=true` on your profile for testing

## Verification

- `npm run build` passes with zero errors
- TypeScript compilation clean
- Route `/proposals` renders as Partial Prerender

## Self-Check: PASSED

All 8 key files verified on disk. Both commit hashes (359103d, 69c3358) found in git log.
