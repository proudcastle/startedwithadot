# Phase 2: The Community Loop - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-18
**Phase:** 02-the-community-loop
**Areas discussed:** Proposal Feed Layout, Proposal Input, Voting Interaction, Admin Controls
**Mode:** --auto (all decisions auto-selected)

---

## Proposal Feed Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Card-based vertical list | Reuses existing 8bitcn Card, each card holds all proposal data | ✓ |
| Compact timeline rows | Minimal per-row display, denser feed | |
| Table-style list | Structured columns, more data-heavy | |

**Auto-selected:** Card-based vertical list (recommended default — reuses existing 8bitcn Card component, fits pixel-art aesthetic)
**Notes:** 8bitcn Card already installed. Badge component available for status indicators.

---

## Proposal Input Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Inline at top of feed | Twitter-style, always visible, single field + submit | ✓ |
| Separate page | Dedicated /propose route | |
| Modal dialog | Dialog overlay triggered by button | |

**Auto-selected:** Inline at top of feed (recommended default — matches PROP-01 "inline input" requirement)
**Notes:** Requirements explicitly say "inline input". Character counter with narrator feedback.

---

## Voting Interaction

| Option | Description | Selected |
|--------|-------------|----------|
| Dot icon toggle (●) | Click dot to toggle vote, fills when voted | ✓ |
| Dedicated vote button | Explicit "Vote" button per proposal | |
| Click counter area | Tap the entire counter region | |

**Auto-selected:** Dot icon toggle (●) (recommended default — reinforces dot-as-DNA visual concept)
**Notes:** Optimistic UI with client-side Supabase. Dot symbols for counts ≤10, numeric for >10.

---

## Admin Controls

| Option | Description | Selected |
|--------|-------------|----------|
| Dropdown menu per proposal | ⋯ trigger, admin-only, contains status changes + delete | ✓ |
| Inline buttons on card | Visible action buttons for admin on each card | |
| Separate admin tab/view | Dedicated admin interface for curation | |

**Auto-selected:** Dropdown menu per proposal (recommended default — reuses existing dropdown-menu component, keeps feed clean)
**Notes:** Menu items: Accept, Reject, Mark Implemented, Delete. Version creation on "Implemented" status.

---

## Claude's Discretion

- Component composition details for proposal cards
- Server Action vs RPC for vote toggling
- Rate limiting implementation approach (DB function vs Server Action check)
- Tab component choice
- Pagination strategy
- Toast notification usage
- URL state management for filter tabs

## Deferred Ideas

None — auto mode stayed within phase scope

---

*Generated in --auto mode: all gray areas auto-selected with recommended defaults*
