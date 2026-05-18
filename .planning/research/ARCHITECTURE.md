# Architecture Patterns

**Domain:** Community platform with embedded collaborative game canvas
**Researched:** 2026-05-18

## Recommended Architecture

Single Next.js App Router application with three distinct layers: a community layer (proposals, voting, changelog), an auth/admin layer (Supabase Auth + RLS), and an isolated game canvas layer (HTML5 Canvas in a self-contained React component). All layers share a single Supabase backend but have clear component boundaries.

```
+--------------------------------------------------+
|  Next.js App Router (Server Components default)   |
|                                                   |
|  +-------------------+  +---------------------+  |
|  | Community Layer    |  | Game Canvas Layer   |  |
|  | (Server Components |  | (Client Component)  |  |
|  |  + Server Actions) |  | useRef + RAF loop   |  |
|  |                    |  | Zero React re-render|  |
|  | - ProposalFeed     |  | - <GameCanvas />    |  |
|  | - VoteButton       |  | - Dot state machine |  |
|  | - ChangelogList    |  | - Version config    |  |
|  | - ProposalForm     |  +---------------------+  |
|  +-------------------+                            |
|                                                   |
|  +-------------------+  +---------------------+  |
|  | Auth Layer         |  | Admin Layer         |  |
|  | (Middleware +      |  | (Server Actions     |  |
|  |  Supabase SSR)     |  |  + RLS policies)    |  |
|  +-------------------+  +---------------------+  |
|                                                   |
+-------------------+-------------------------------+
                    |
        +-----------v-----------+
        |  Supabase Backend     |
        |  - PostgreSQL + RLS   |
        |  - Auth (email/pass)  |
        |  - (Phase 2: Realtime)|
        +------------------------+
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `middleware.ts` | Auth token refresh, route protection, redirect unauthenticated users | Supabase Auth (cookies), Next.js routing |
| `<GameCanvas />` | Render dot, manage animation loop via requestAnimationFrame, read version config | Version config (props or fetch), no direct DB access |
| `<ProposalFeed />` | Server Component listing proposals with vote counts, sorted by recency/votes | Supabase DB via server-side query, renders `<VoteButton />` children |
| `<VoteButton />` | Client Component for toggling upvotes (optimistic UI) | Server Action `toggleVote()`, receives current vote state as prop |
| `<ProposalForm />` | Client Component with 140-char input, rate-limit feedback | Server Action `submitProposal()`, auth context |
| `<ChangelogList />` | Server Component listing implemented versions with linked proposals | Supabase DB via server-side query |
| `<AdminControls />` | Status change buttons (visible to admin flag users) | Server Actions `updateProposalStatus()`, `createVersion()` |
| Server Actions | All write operations: vote toggle, proposal submit, status change, version create | Supabase server client with user context, RLS enforcement |
| Supabase RLS | Row-level read/write policies per table | PostgreSQL policies, enforced on every query |

### Data Flow

**Read path (proposals, changelog, votes):**
```
Browser Request
  -> Next.js Middleware (refresh auth token via cookies)
  -> Server Component (e.g., ProposalFeed)
  -> Supabase server client (with user context from cookies)
  -> PostgreSQL query (RLS enforced)
  -> HTML streamed to browser (React Server Components)
```

**Write path (vote, submit proposal, admin action):**
```
User Click (Client Component)
  -> Server Action invoked (e.g., toggleVote)
  -> Supabase server client created (user context from cookies)
  -> Validate input + check rate limits
  -> PostgreSQL mutation (RLS enforced)
  -> revalidatePath() to refresh Server Components
  -> Updated UI streamed to browser
```

**Game canvas (isolated):**
```
Page Load
  -> Server Component fetches current version config from DB
  -> Passes config as props to <GameCanvas /> (client component)
  -> useEffect initializes canvas context via useRef
  -> requestAnimationFrame loop renders dot with version-specific behavior
  -> Canvas never re-renders from React state changes
  -> Version change = new props -> useEffect cleanup -> reinitialize
```

## Patterns to Follow

### Pattern 1: Server Components by Default, Client Components at Leaf Nodes

**What:** Make every component a Server Component unless it needs interactivity (click handlers, canvas, form state). Push `"use client"` boundaries as far down the tree as possible.

**When:** Always. This is the default posture for Next.js App Router.

**Example:**
```typescript
// app/page.tsx — Server Component (no "use client")
import { GameCanvas } from '@/components/game-canvas'
import { ProposalFeed } from '@/components/proposal-feed'

export default async function Home() {
  const version = await getLatestVersion() // server-side DB call
  return (
    <main>
      <GameCanvas config={version.config} />
      <ProposalFeed />
    </main>
  )
}
```

```typescript
// components/game-canvas.tsx — Client Component (needs canvas + RAF)
"use client"
import { useRef, useEffect } from 'react'

export function GameCanvas({ config }: { config: VersionConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    // ... game loop with requestAnimationFrame
    return () => cancelAnimationFrame(rafRef.current)
  }, [config])

  return <canvas ref={canvasRef} width={400} height={400} />
}
```

### Pattern 2: Server Actions for All Mutations

**What:** Use Next.js Server Actions (not API routes) for every write operation. Server Actions create a Supabase server client with the user's cookie context, so RLS is automatically enforced.

**When:** Every mutation — votes, proposals, status changes, version creation.

**Why:** Eliminates manual API route boilerplate. Server Actions are type-safe, colocated with forms, and automatically handle CSRF. RLS via Supabase means authorization logic lives in the database, not in application code.

**Example:**
```typescript
// actions/proposals.ts
"use server"
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitProposal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const text = formData.get('text') as string
  if (text.length > 140) throw new Error('Too long')

  // Rate limit check (count today's proposals)
  const { count } = await supabase
    .from('proposals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', new Date().toISOString().split('T')[0])

  if ((count ?? 0) >= 3) throw new Error('Daily limit reached')

  await supabase.from('proposals').insert({
    text,
    user_id: user.id,
    status: 'open'
  })

  revalidatePath('/')
}
```

### Pattern 3: Canvas Isolation from React Render Cycle

**What:** The game canvas component keeps all animation state in `useRef`, never in `useState`. React state is only used for values that affect the surrounding UI (not the canvas itself). The `requestAnimationFrame` loop reads from refs, not from state.

**When:** Always for the `<GameCanvas />` component.

**Why:** Canvas rendering at 60fps cannot be coupled to React's reconciliation cycle. Stale closures in RAF callbacks are the most common bug in React canvas code. Refs solve this because `ref.current` always returns the latest value.

**Example:**
```typescript
// All mutable game state lives in refs
const dotRadius = useRef(10)
const pulsePhase = useRef(0)

// RAF loop reads refs, not state
function animate(timestamp: number) {
  pulsePhase.current += 0.02
  const r = dotRadius.current + Math.sin(pulsePhase.current) * 2
  // ... draw to canvas
  rafRef.current = requestAnimationFrame(animate)
}
```

### Pattern 4: Supabase Client Creation Pattern (Server vs Browser)

**What:** Two distinct Supabase client factories: one for server (reads cookies from the request), one for browser (reads cookies from document). Never import the wrong one.

**When:** Every Supabase interaction.

**Why:** Server Components and Server Actions need a server client that reads auth tokens from cookies passed through `next/headers`. Client Components need a browser client. Mixing them up causes auth to silently fail.

**File structure:**
```
lib/supabase/
  server.ts    — createClient() for Server Components + Server Actions
  client.ts    — createClient() for Client Components (browser)
  middleware.ts — updateSession() for middleware token refresh
```

### Pattern 5: Optimistic UI for Votes

**What:** When a user clicks the vote button, immediately update the local vote count and toggle state before the Server Action completes. Roll back on error.

**When:** Vote toggling (the highest-frequency user interaction).

**Why:** Voting must feel instant. Server round-trips of 100-300ms create perceptible lag that makes the UI feel broken.

**Example:**
```typescript
"use client"
import { useOptimistic, useTransition } from 'react'
import { toggleVote } from '@/actions/votes'

export function VoteButton({ proposalId, voted, count }: Props) {
  const [optimistic, setOptimistic] = useOptimistic(
    { voted, count },
    (state) => ({
      voted: !state.voted,
      count: state.voted ? state.count - 1 : state.count + 1
    })
  )
  const [_, startTransition] = useTransition()

  return (
    <button onClick={() => {
      startTransition(async () => {
        setOptimistic(null)
        await toggleVote(proposalId)
      })
    }}>
      {/* Dot-based vote visualization */}
      {Array.from({ length: optimistic.count }).map((_, i) => (
        <span key={i} className="dot-vote" />
      ))}
    </button>
  )
}
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Putting Game State in React useState
**What:** Using `useState` for animation variables (position, phase, radius) inside the canvas component.
**Why bad:** Every `setState` triggers a React re-render. At 60fps, this means 60 unnecessary reconciliation passes per second. Additionally, state values captured in the RAF closure become stale between renders, causing visual glitches.
**Instead:** Use `useRef` for all mutable game state. Only use `useState` for values the surrounding UI needs (e.g., a score display outside the canvas).

### Anti-Pattern 2: API Routes Instead of Server Actions
**What:** Creating `/api/vote`, `/api/proposal` endpoints and calling them with `fetch()` from client components.
**Why bad:** More boilerplate, manual CSRF handling, no type safety between client and server, harder to colocate with the UI that uses them. Server Actions handle all of this automatically.
**Instead:** Use Server Actions for all mutations. Only use Route Handlers for webhook endpoints or truly external API consumers (explicitly out of scope for V1).

### Anti-Pattern 3: Client-Side Data Fetching for Initial Page Load
**What:** Using `useEffect` + `fetch` to load proposals and changelog on mount.
**Why bad:** Causes loading spinners, layout shift, poor SEO, and waterfall requests. Server Components stream HTML with data already rendered.
**Instead:** Fetch data in Server Components. Pass minimal props to Client Components. Use `revalidatePath()` after mutations to refresh server-rendered content.

### Anti-Pattern 4: Authorization Logic in Application Code
**What:** Writing `if (user.role === 'admin')` checks in Server Actions or components to control data access.
**Why bad:** Authorization logic scattered across application code is easy to miss, hard to audit, and doesn't protect against direct database access via Supabase client.
**Instead:** Use Supabase RLS policies as the single source of truth for who can read/write what. Application code can do UI-level checks (show/hide admin buttons), but the database enforces actual access control.

### Anti-Pattern 5: Sharing Canvas Component State with Community UI
**What:** Lifting game canvas state up to a parent component so community components can react to dot behavior.
**Why bad:** Creates tight coupling between two fundamentally different rendering models (React reconciliation vs canvas RAF loop). Changes to game logic ripple into community UI and vice versa.
**Instead:** Keep the game canvas as a pure leaf component that receives config as props and is otherwise opaque. If community UI needs to know about game state in future versions, use a shared event bus or context — but not in V1.

## Suggested File Structure

```
app/
  layout.tsx              # Root layout: fonts, theme, nav shell
  page.tsx                # Home: GameCanvas + ProposalFeed + ChangelogList
  login/page.tsx          # Auth: login form
  signup/page.tsx         # Auth: signup form
  auth/callback/route.ts  # Auth: OAuth callback handler

components/
  game-canvas.tsx         # "use client" — isolated canvas with RAF loop
  proposal-feed.tsx       # Server Component — lists proposals
  proposal-form.tsx       # "use client" — 140-char input + submit
  vote-button.tsx         # "use client" — optimistic vote toggle
  changelog-list.tsx      # Server Component — version history
  admin-controls.tsx      # "use client" — status change buttons (admin only)

actions/
  proposals.ts            # Server Actions: submit, updateStatus
  votes.ts                # Server Actions: toggleVote
  versions.ts             # Server Actions: createVersion

lib/
  supabase/
    server.ts             # Server-side Supabase client factory
    client.ts             # Browser-side Supabase client factory
    middleware.ts          # Session refresh utility

types/
  database.ts             # Generated Supabase types (supabase gen types)
  game.ts                 # Version config type for canvas

middleware.ts             # Next.js middleware: auth refresh + route protection
```

## Suggested Build Order

Build order follows data dependency chains. Each layer depends on the one before it.

```
Phase 1: Foundation
  1. Supabase project setup + database schema (tables, RLS policies)
  2. Next.js project from Supabase starter template
  3. Middleware (auth token refresh)
  4. Supabase client factories (server.ts, client.ts)
  5. Auth pages (login, signup) — uses starter template

Phase 2: Game Canvas (independent, no DB writes)
  6. <GameCanvas /> with hardcoded dot config (pulse animation)
  7. Version config type definition
  8. Fetch version config from DB, pass as props

Phase 3: Community Core (depends on auth + DB)
  9. Proposal submission (form + server action + RLS)
  10. Proposal feed (server component, sorted list)
  11. Vote toggle (server action + optimistic UI + RLS)
  12. Rate limiting (3/day check in server action)

Phase 4: Admin + Changelog (depends on proposals existing)
  13. Admin status change (server action + admin RLS policy)
  14. Version creation (links implemented proposals)
  15. Changelog display (server component)

Phase 5: Polish
  16. Dot-based vote visualization
  17. 8bitcn/ui component integration
  18. Sloppy narrator copy across all text
  19. SEO (OG tags, meta, favicon)
  20. Mobile responsive pass
```

**Dependency rationale:**
- Auth must exist before any user-specific feature (proposals, votes, admin).
- Game canvas has zero dependency on community features and can be built in parallel with auth.
- Proposals must exist before votes (you vote on proposals).
- Proposals must have statuses before admin controls make sense.
- Versions depend on implemented proposals existing.
- Changelog depends on versions.
- Polish (8bitcn, copy, SEO) is a cross-cutting concern that touches everything, so it goes last.

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| Proposal queries | Server Component direct query, no caching | Add `unstable_cache` or ISR with `revalidate` interval | Move to edge caching + Supabase Realtime subscriptions |
| Vote counts | Count on read (aggregate query) | Materialized view or denormalized count column | Separate vote count table with async updates |
| Canvas rendering | Client-side only, trivial | Client-side only, trivial | Client-side only, trivial (canvas is local) |
| Auth token refresh | Middleware on every request | Same (Supabase handles scale) | Same (stateless JWT, Supabase scales horizontally) |
| Rate limiting | Check in Server Action (count query) | Same with index on (user_id, created_at) | Move to Redis/Upstash for atomic rate limiting |

The canvas is inherently scalable because it runs entirely on the client. The bottleneck at scale is always the proposal/vote read path, which is a standard database scaling problem solvable with caching, denormalization, and eventually Supabase Realtime.

## Sources

- [Supabase + Next.js Auth Setup](https://supabase.com/docs/guides/auth/server-side/nextjs) (Official docs, HIGH confidence)
- [Supabase Next.js Starter Template](https://vercel.com/templates/next.js/supabase) (Official template, HIGH confidence)
- [Next.js App Router Architecture](https://nextjs.org/docs/architecture) (Official docs, HIGH confidence)
- [Engineering behind r/place](https://saikumarchintada.medium.com/engineering-behind-r-place-a7eb53bcf5f1) (MEDIUM confidence, community analysis)
- [Reddit on building r/place](https://www.fastly.com/blog/reddit-on-building-scaling-rplace) (HIGH confidence, first-party engineering post)
- [React Canvas with useRef pattern](https://dev.to/shaishav_patel_271fdcd61a/building-snake-in-react-canvas-raf-loop-mutable-refs-to-avoid-stale-closures-and-wall-wrap-3gbg) (MEDIUM confidence, community pattern)
- [Next.js + Supabase production lessons](https://catjam.fi/articles/next-supabase-what-do-differently) (MEDIUM confidence, practitioner experience)
- Context7: Next.js `/vercel/next.js` — Server Actions, App Router patterns (HIGH confidence)
- Context7: Supabase `/supabase/supabase` — Middleware, RLS, server client (HIGH confidence)
