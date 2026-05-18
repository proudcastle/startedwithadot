---
phase: 02-the-community-loop
plan: 01
subsystem: proposals
tags: [proposal-submission, feed-display, server-actions, character-counter, rate-limiting]
dependency_graph:
  requires: [01-01, 01-02]
  provides: [proposal-feed, proposal-submission, proposal-validation]
  affects: [02-02, 02-03]
tech_stack:
  added: [sonner-toaster]
  patterns: [useActionState-form, suspense-data-fetching, server-component-feed, narrator-voice-copy]
key_files:
  created:
    - actions/proposals.ts
    - app/proposals/page.tsx
    - components/proposals/proposal-input.tsx
    - components/proposals/proposal-card.tsx
    - components/proposals/dot-counter.tsx
    - components/proposals/status-badge.tsx
    - lib/validations/proposals.ts
    - lib/format.ts
  modified:
    - app/layout.tsx
    - components/header.tsx
decisions:
  - "Used Suspense boundary for /proposals feed instead of export const dynamic (incompatible with Next.js 16 cacheComponents)"
  - "ProposalFeed extracted as async Server Component inside Suspense for Partial Prerender compatibility"
  - "Vote state hardcoded to false (voted=false) in this plan -- voting toggle is Plan 02-02 scope"
metrics:
  duration: 3min
  completed: 2026-05-18
---

# Phase 02 Plan 01: Proposal Submission and Feed Summary

Inline proposal form with 140-char counter, Zod validation, UTC rate limiting (3/day), and card-based feed sorted by vote count using Server Actions and Suspense streaming.

## What Was Built

### Task 1: Validation schemas, format utility, and Sonner Toaster setup (e9ab569)

Created `lib/validations/proposals.ts` with `proposalSchema` (1-140 char text) and `versionSchema` (version number + title) following the exact Zod v4 pattern from auth validations with narrator-voice error messages. Created `lib/format.ts` with `timeAgo()` function using `Intl.RelativeTimeFormat` for relative timestamps. Added Sonner `<Toaster />` to root layout inside ThemeProvider.

### Task 2: Server Action, feed page, and all components (91aabca)

Created `actions/proposals.ts` with `submitProposal` Server Action -- validates auth, checks email verification, validates text via Zod, enforces UTC-based 3/day rate limit, inserts proposal, and calls `revalidatePath`. Uses the `useActionState` signature pattern (prevState, formData) returning `{ message, success }`.

Created four proposal components:
- `proposal-input.tsx`: Client Component with `useActionState`, controlled input with maxLength=140, character counter with narrator milestones at 140/50/20/0 remaining, Sonner toast on success/error, auth-gated (CTA for unauthenticated, verification message for unverified)
- `proposal-card.tsx`: Card layout with status badge, proposal text, username, relative timestamp, and dot counter
- `dot-counter.tsx`: Hollow circle for 0, filled dots for 1-10, numeric for >10
- `status-badge.tsx`: 8bitcn Badge with dot prefix and Press Start 2P font

Created `app/proposals/page.tsx` with Suspense-wrapped async `ProposalFeed` component that fetches proposals with joined author usernames, sorted by vote_count descending. Handles empty state with narrator copy.

Added "Proposals" nav link to header.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Next.js 16 cacheComponents incompatibility with route segment config**
- **Found during:** Task 2 build verification
- **Issue:** `export const dynamic = "force-dynamic"` is not compatible with `nextConfig.cacheComponents` in Next.js 16. The `connection()` API from `next/server` also failed because data fetching outside Suspense blocks the entire page.
- **Fix:** Extracted async data fetching into a `ProposalFeed` Server Component wrapped in `<Suspense>`. The page shell (heading) renders as static HTML while the feed streams in dynamically.
- **Files modified:** `app/proposals/page.tsx`
- **Commit:** 91aabca

## Decisions Made

1. **Suspense over dynamic export**: Next.js 16 with `cacheComponents` requires Suspense boundaries for uncached data instead of `export const dynamic`. This enables Partial Prerender (static shell + streamed content).
2. **Vote state hardcoded**: `voted={false}` is passed to all ProposalCards since voting is Plan 02-02 scope. No stub -- the DotCounter renders correctly with the unvoted visual state.
3. **isAdmin fetched but unused**: Admin flag is fetched in the feed for forward-compatibility with Plan 02-03, but no admin UI is rendered in this plan.

## Verification

- `npm run build` passes with zero errors
- Route `/proposals` renders as Partial Prerender
- TypeScript compilation clean (`npx tsc --noEmit` passes)

## Self-Check: PASSED

All 8 created files verified on disk. Both commit hashes (e9ab569, 91aabca) found in git log.
