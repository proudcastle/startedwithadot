# Phase 1: Foundation and Auth - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-18
**Phase:** 1-Foundation and Auth
**Areas discussed:** Scaffolding approach, Username validation rules, Database schema design, Theme/font configuration
**Mode:** --auto (all decisions auto-selected)

---

## Scaffolding Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Supabase starter template | `npx create-next-app -e with-supabase` — pre-built auth | ✓ |
| Plain Next.js + manual Supabase | More control, more work | |

**User's choice:** [auto] Supabase starter template (recommended default — PRP explicitly specifies this)
**Notes:** PRP section "Boilerplate: Supabase Next.js Starter" explicitly mandates this approach.

---

## Username Validation Rules

| Option | Description | Selected |
|--------|-------------|----------|
| Alphanumeric + hyphens/underscores, 3-20 chars | Standard web username format | ✓ |
| Freeform text | More flexible but harder to moderate | |
| Alphanumeric only | Restrictive, no separators | |

**User's choice:** [auto] Alphanumeric + hyphens/underscores (recommended default)
**Notes:** Case-insensitive uniqueness via LOWER() index.

---

## Database Schema Design

| Option | Description | Selected |
|--------|-------------|----------|
| All tables in Phase 1 + separate profiles | Create full schema upfront, profiles via trigger | ✓ |
| Tables per phase | Only create tables when needed | |
| Extend auth.users metadata | Use Supabase raw_user_meta_data | |

**User's choice:** [auto] All tables in Phase 1 with separate profiles (recommended default — Supabase best practice, PRP specifies profiles table)
**Notes:** Denormalized vote_count on proposals for performance.

---

## Theme/Font Configuration

| Option | Description | Selected |
|--------|-------------|----------|
| CSS custom properties override | Override shadcn theme tokens in globals.css | ✓ |
| Tailwind config only | Theme via tailwind.config.ts | |
| Custom theme file | Separate theme configuration | |

**User's choice:** [auto] CSS custom properties (recommended default)
**Notes:** Press Start 2P for headings, Geist for body. Dark-only, no light mode.

---

## Claude's Discretion

- Exact 8bitcn component selection for Phase 1
- Supabase migration file structure and naming
- Middleware configuration details
- Tailwind v4 configuration specifics
- Project directory structure

## Deferred Ideas

None — discussion stayed within phase scope.
