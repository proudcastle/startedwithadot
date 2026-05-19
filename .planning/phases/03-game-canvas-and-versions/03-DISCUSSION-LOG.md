# Phase 3: Game Canvas and Versions - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-19
**Phase:** 03-game-canvas-and-versions
**Areas discussed:** Canvas Component, Version History Layout, Version Number Display, Canvas Animation
**Mode:** --auto (all decisions auto-selected)

---

## Canvas Placement

| Option | Description | Selected |
|--------|-------------|----------|
| Home page hero | Canvas on `/` as primary visual, Phase 4 builds landing around it | ✓ |
| Dedicated `/canvas` route | Separate page for the game | |
| Embedded in proposals feed | Canvas above the proposal list | |

**Auto-selected:** Home page hero (recommended — canvas IS the product, should be front and center)

---

## Version History Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated `/changelog` route | Full page with chronological version list | ✓ |
| Section on home page | Changelog preview embedded in landing | |
| Modal/sidebar | Overlay from version number click | |

**Auto-selected:** Dedicated `/changelog` route (recommended — clean separation, Phase 4 adds a preview to landing)

---

## Version Number Display

| Option | Description | Selected |
|--------|-------------|----------|
| Header nav (right side) | "v0.1 ●" near username/auth buttons, links to /changelog | ✓ |
| Footer | Version in footer area | |
| Floating corner badge | Fixed position overlay | |

**Auto-selected:** Header nav (recommended — visible, accessible, matches CHNG-03 "UI corner")

---

## Canvas Animation Approach

| Option | Description | Selected |
|--------|-------------|----------|
| useRef + RAF + sine wave | Mutable refs for animation state, cleanup in useEffect return | ✓ |
| CSS animation | Pure CSS scale animation on a div | |
| useRef + RAF + eased curve | Same as above but with eased timing | |

**Auto-selected:** useRef + RAF + sine wave (recommended — matches GAME-05, proper cleanup prevents memory leaks)

---

## Claude's Discretion

- Canvas pixel ratio handling
- Responsive sizing strategy
- Timeline vs card layout for changelog
- Animation easing details
- Header layout for version number

## Deferred Ideas

None — auto mode stayed within phase scope

---

*Generated in --auto mode: all gray areas auto-selected with recommended defaults*
