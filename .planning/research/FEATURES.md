# Feature Landscape

**Domain:** Community-driven collaborative game platform (proposal + voting + evolving game)
**Researched:** 2026-05-18
**Confidence:** MEDIUM-HIGH (based on analysis of Reddit, ProductHunt, Canny, r/place, Twitch Plays Pokemon, feature voting boards, and indie game community platforms)

## Table Stakes

Features users expect. Missing = product feels incomplete or broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Proposal submission** | Core interaction loop -- without it there's no community input | Low | 140-char limit already decided. Inline input, Twitter-style. Must feel effortless. |
| **Upvoting** | Every voting platform has this. Users expect to express preference with one click. | Low | Toggle-able, one per user per proposal. Visual dot counters reinforce brand. |
| **Vote count visibility** | Users need social proof to engage. Hidden counts kill momentum. | Low | Show count publicly. Early platforms that hide votes see lower engagement (Canny research). |
| **User authentication** | Required for vote integrity. Anonymous voting invites manipulation. | Low | Email/password via Supabase starter. Username displayed on proposals. |
| **Proposal status lifecycle** | Users need to know what happened to their idea. "Limbo" erodes trust (Canny best practice). | Low | Open -> Accepted -> Implemented -> Rejected. Admin-controlled transitions. |
| **The game canvas** | The literal product. Without a visible dot, there's nothing to evolve. | Med | White dot on black, subtle pulse. Must be prominently placed, not buried. |
| **Version history / changelog** | Users need proof their proposals matter. "Requested -> shipped" closes the loop. | Med | Link each version to the proposal that inspired it. This is the payoff. |
| **Rate limiting on proposals** | Every voting board learns this lesson. Without limits, spam drowns signal. | Low | 3 per user per day (already decided). Prevents flooding. |
| **Mobile responsiveness** | Over 60% of community platform traffic is mobile. Non-negotiable. | Med | Mobile-first design with touch-friendly vote targets. |
| **Empty state handling** | Cold start is the biggest killer of community platforms. Empty = dead. | Low | Sloppy-narrator voice guiding first users. "Be the first to tell the dot what to do." Critical for day-one experience. |
| **Sort/filter proposals** | Once you have >10 proposals, users can't find what matters. | Low | Sort by: newest, most voted, status. Minimum viable organization. |
| **Basic moderation** | Inappropriate content will appear. Even small communities need this. | Low | Admin can hide/reject proposals. Flag-based in UI or Supabase Dashboard. |

## Differentiators

Features that set product apart. Not expected by default, but create unique value.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Dot-as-visual-DNA** | Votes rendered as dots, status indicators as dots, loading states as dots. No other platform has this level of thematic consistency. Turns a constraint into identity. | Med | Dots in vote counters, favicon, separators, loading spinners. The dot IS the brand. |
| **Sloppy-narrator voice** | Ferris Bueller/Deadpool tone in every micro-copy string. Empty states, errors, tooltips -- all personality. Most platforms are sterile; this one has character. | Low | Not a feature to build -- it's a writing discipline. But it's a massive differentiator in feel. Must be consistent across every string. |
| **Monochrome-until-community-earns-color** | Color absence as a design statement. The community literally unlocks color through proposals. This is r/place meets progression mechanic. | Low | Zero implementation cost (it's the default). But narratively powerful. The first color proposal will be a community milestone event. |
| **Proposal-to-version linkage** | Most changelogs are dev-written. Here, every version traces back to a community proposal with a named author. The community sees its fingerprints on the game. | Med | Requires clean data model: version -> proposal -> user. The "credits" of each version. |
| **The evolving game concept itself** | No other platform starts with literally nothing and lets the community define everything. r/place had a fixed canvas. TPP had a fixed game. This is a blank slate that becomes whatever the community wills. | High | The concept is the differentiator. Execution risk is in maintaining momentum across versions. |
| **Pixel-art UI shell vs. clean game canvas** | Deliberate contrast between retro-game UI chrome (8bitcn) and pristine game canvas. The shell says "game," the canvas says "potential." | Med | Two visual languages coexisting. Most platforms pick one aesthetic. This tension is intentional and memorable. |
| **Constraint-driven proposal format** | 140-char limit forces Twitter-level clarity. No essay proposals, no feature specs. "Make the dot bounce." "Add gravity." Brevity creates scannable, votable ideas. | Low | Already decided. But worth noting as differentiator -- most feature boards allow unlimited text, which produces noise. |
| **Creator-as-curator model** | Unlike democratic-only platforms, the creator curates and implements. This is closer to a benevolent-dictator open source model. Prevents the "designed by committee" problem that kills community products. | Low | Not a code feature -- it's a governance model. But it's core to why this works where others fail. Community proposes, creator decides. |

## Anti-Features

Features to explicitly NOT build. Each has a clear rationale.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Downvoting** | Downvotes create negativity spirals. Reddit's downvote culture suppresses minority ideas. Upvote-only preserves positive dynamics and keeps proposal authors from feeling attacked. | Upvote-only. If something is bad, it simply doesn't rise. Natural selection, not punishment. |
| **Comments on proposals** | Comments turn a voting board into a forum. Forums need moderation, threading, notification -- massive complexity for V1. Comments also create arguments that discourage new users. | Keep it simple: propose and vote. If discussion is needed, it happens off-platform (Discord, social media). |
| **Real-time voting updates** | WebSocket infrastructure, Supabase Realtime setup, optimistic UI updates, conflict resolution. Massive complexity for near-zero user benefit at low scale. | Page refresh shows new votes. At <1000 users, nobody notices the lag. Phase 2 feature. |
| **Public user profiles** | Profile pages need content (bio, avatar, history). They create social hierarchies and status games. Not needed when the focus is the dot, not the users. | Username displayed on proposals. That's it. The dot is the star, not the users. |
| **Categories/tags for proposals** | At low proposal volume, categories are overhead. With 140-char proposals, the proposal IS its own summary. Categories add navigation complexity and decision paralysis for submitters. | Let proposals stand alone. The 140-char limit already enforces self-describing content. |
| **Notification system** | Email notifications, in-app notifications, preferences UI, unsubscribe flows. Huge feature surface for V1. | Users check back manually. The sloppy narrator can tease this: "We'd tell you when something happens, but we haven't learned how yet." |
| **Social login (Google, Discord, GitHub)** | Each OAuth provider adds configuration, token management, and potential failure points. Email/password is simpler and universal. | Email/password only. Social login is Phase 2+ when user acquisition matters more than simplicity. |
| **Playable old versions** | Version archaeology requires storing game state snapshots, building a version selector, maintaining backward compatibility. Enormous complexity. | Show version history as a timeline/changelog. Describe what changed, don't replay it. |
| **External API** | API design, rate limiting, documentation, versioning, auth tokens. No third-party use case exists yet. | Internal API only (Next.js server actions / API routes for the app itself). |
| **Gamification (badges, points, leaderboards)** | Leaderboards create power users who dominate. Badges feel corporate. Points systems need careful balancing. All of this distracts from the core loop: propose, vote, watch the dot evolve. | The reward IS seeing your proposal implemented. That's more meaningful than any badge. The version history with your name on it IS the leaderboard. |
| **Admin dashboard** | Custom admin UI is a full product in itself. Forms, tables, RBAC, audit logs. | Use Supabase Dashboard directly for admin operations. Flag-based admin detection in the app UI for status changes. |
| **Payment/donation system** | Monetization before community validation puts the cart before the horse. Payment integration adds PCI compliance, Stripe integration, subscription management. | Validate the community loop first. Monetization is a future phase after proving people care. |

## Feature Dependencies

```
User Authentication
  |
  +---> Proposal Submission (requires authenticated user)
  |       |
  |       +---> Upvoting (requires proposals to exist + auth for one-vote-per-user)
  |       |
  |       +---> Rate Limiting (requires knowing who submitted)
  |
  +---> Admin Capabilities (requires auth + admin flag)
          |
          +---> Proposal Status Lifecycle (admin changes status)
          |
          +---> Version Creation (admin links version to proposal)
                  |
                  +---> Changelog / Version History (requires versions to exist)

Game Canvas (independent -- can be built in parallel)
  |
  +---> Version-driven canvas updates (requires version system)

Sort/Filter (requires proposals to exist)

Empty States (independent -- should be built early, before content exists)

Dot-as-visual-DNA (independent -- visual design system, applies everywhere)
```

## MVP Recommendation

**Phase 1 -- The Loop (ship to validate):**

Prioritize in this order:

1. **Game canvas with the dot** -- The thing people came to see
2. **User authentication** -- Gate for proposal/voting integrity
3. **Proposal submission** -- The core input mechanism
4. **Upvoting with dot counters** -- The core feedback mechanism
5. **Empty state handling** -- Critical for cold start; the first visitor sees this
6. **Proposal status lifecycle** -- Admin can mark proposals accepted/rejected/implemented
7. **Basic moderation** -- Admin can hide inappropriate proposals
8. **Rate limiting** -- Prevent spam from day one

**Phase 2 -- The Payoff:**

9. **Version history / changelog** -- Prove that proposals lead to real changes
10. **Proposal-to-version linkage** -- The "your idea became real" moment
11. **Sort/filter proposals** -- Needed once proposal count grows
12. **Mobile polish** -- Responsive from day one, but deeper mobile optimization here

**Defer:**

- **Real-time voting** -- Add when concurrent users justify WebSocket infrastructure
- **Notification system** -- Add when re-engagement becomes a problem
- **Social login** -- Add when user acquisition outweighs simplicity
- **Gamification** -- The version history IS the gamification; don't add artificial layers

**Rationale:** The MVP must prove one thing: *people will propose ideas for a dot and vote on them.* If that loop works, everything else follows. If it doesn't, no amount of features saves the product. Ship the loop, seed it with a few creator proposals, and watch if organic engagement emerges.

## Critical Success Factors

### Cold Start Strategy
The biggest risk is not missing features -- it's an empty platform. Research on community platforms consistently shows that empty states kill engagement. Mitigation:
- Creator seeds 3-5 initial proposals to avoid the "you're the first" problem
- Sloppy narrator voice makes even empty states entertaining
- The dot itself is content -- it's always there, pulsing, waiting
- Share the URL in existing communities (Twitter, Reddit, Discord) with a clear call-to-action

### Closing the Loop
Research from Canny, ProductHunt, and feature voting boards unanimously agrees: the #1 engagement killer is proposals that go nowhere. Users must see their votes lead to real changes. The changelog/version system is not a "nice to have" -- it's the mechanism that proves the platform works. It can come in Phase 2, but it must come soon.

### Governance Model
The creator-as-curator model (vs. pure democracy) is a deliberate design choice informed by Twitch Plays Pokemon's lessons. TPP introduced democracy mode as an emergency measure and found it slower and less exciting than the chaos of anarchy mode. For this project, the creator curates to maintain quality and vision, while the community provides direction. This avoids "designed by committee" outcomes while preserving community ownership.

## Sources

- [Canny: Feature voting best practices](https://canny.io/blog/feature-voting-best-practices/)
- [Savio: Feature voting tools and pitfalls](https://www.savio.io/blog/feature-voting/)
- [Reddit voting system mechanics](https://dicloak.com/blog-detail/what-is-reddits-voting-system-heres-how-it-works)
- [r/place Wikipedia](https://en.wikipedia.org/wiki/R/place)
- [Twitch Plays Pokemon governance lessons](https://medium.com/web3-australia/lessons-in-decentralised-from-governance-from-twitch-plays-pokemon-e24fefe93185)
- [Twitch Plays Pokemon Wikipedia](https://en.wikipedia.org/wiki/Twitch_Plays_Pok%C3%A9mon)
- [Product Hunt anti-spam measures](https://help.producthunt.com/en/articles/11869098-how-does-product-hunt-ensure-fair-voting-and-prevent-spam-or-vote-manipulation)
- [Community gamification mechanics](https://www.gainsight.com/blog/community-gamification/)
- [Changelog best practices](https://theroadmapai.com/blog/product-changelog-best-practices-how-to-write-updates-users-actually-read)
- [Empty state UX design](https://mobbin.com/glossary/empty-state)
- [Paul Olyslager: Reddit UX drives discussion](https://www.paulolyslager.com/breakdown-how-reddit-ux-drives-discussion/)
- [Feature Upvote for game developers](https://featureupvote.com/)
