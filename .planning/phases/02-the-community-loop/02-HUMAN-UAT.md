---
status: resolved
phase: 02-the-community-loop
source: [02-VERIFICATION.md]
started: 2026-05-19
updated: 2026-05-19
---

## Current Test

[all tests complete]

## Tests

### 1. Proposal submission end-to-end
expected: Submit proposals, confirm rate limit blocks on 4th attempt
result: passed (after RLS fix — auth.users permission denied, resolved with migration 00003)

### 2. Vote toggle with optimistic UI
expected: Click to vote, verify instant update and server persistence on refresh
result: passed

### 3. Status tab filtering
expected: Feed filters correctly and rejected proposals are hidden from "All" tab
result: passed

### 4. Admin curation controls
expected: Accept/Reject/Implement/Delete with correct conditional menu items and version dialog
result: passed

### 5. Non-admin sees no admin controls
expected: Regular users see no admin dropdown on proposal cards
result: passed

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0
blocked: 0

## Bugs Found During UAT

### BUG-1: RLS INSERT policies query auth.users (permission denied)
- **Severity:** blocking
- **Fix:** Migration 00003 — removed email verification from RLS, enforced in Server Actions instead
- **Commit:** 68015f4

### BUG-2: Header not refreshing after login/logout
- **Severity:** UX
- **Fix:** Replaced router.push() with window.location.href for auth state changes
- **Commit:** 68015f4

## Gaps
