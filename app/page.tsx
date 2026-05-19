import { Suspense } from "react";
import Link from "next/link";
import { GameCanvas } from "@/components/game/game-canvas";
import { DotSeparator } from "@/components/dot-separator";
import { DotLoader } from "@/components/dot-loader";
import { createClient } from "@/lib/supabase/server";
import { ProposalCard } from "@/components/proposals/proposal-card";
import {
  VersionCard,
  type VersionWithProposal,
} from "@/components/versions/version-card";

async function ProposalsPreview() {
  const supabase = await createClient();

  const { data: proposals } = await supabase
    .from("proposals")
    .select("*, profiles(username)")
    .neq("status", "rejected")
    .order("vote_count", { ascending: false })
    .limit(5);

  return (
    <section className="max-w-3xl mx-auto px-5 py-12">
      <h2 className="font-[family-name:var(--font-press-start-2p)] text-sm mb-6">
        Alright, what should happen next?
      </h2>

      {proposals && proposals.length > 0 ? (
        <div className="flex flex-col gap-4">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={{
                ...proposal,
                profiles: proposal.profiles as { username: string } | null,
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Nobody&apos;s proposed anything yet. Be the first to tell the dot
          what to do.
        </p>
      )}

      <div className="text-center mt-6">
        <Link
          href="/proposals"
          className="text-muted-foreground hover:text-foreground underline underline-offset-4 inline-block"
        >
          See all proposals
        </Link>
      </div>
    </section>
  );
}

async function ChangelogPreview() {
  const supabase = await createClient();

  const { data: versions } = await supabase
    .from("versions")
    .select("*, proposals(text, profiles(username))")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <section className="max-w-3xl mx-auto px-5 py-12">
      <h2 className="font-[family-name:var(--font-press-start-2p)] text-sm mb-6">
        The Evolution
      </h2>

      {versions && versions.length > 0 ? (
        <div className="space-y-6">
          {versions.map((version) => (
            <VersionCard
              key={version.id}
              version={
                {
                  ...version,
                  proposals:
                    version.proposals as VersionWithProposal["proposals"],
                } as VersionWithProposal
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Nothing&apos;s happened yet. The dot is still just a dot.
        </p>
      )}

      <div className="text-center mt-6">
        <Link
          href="/changelog"
          className="text-muted-foreground hover:text-foreground underline underline-offset-4 inline-block"
        >
          Full changelog
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Section 1: Hero */}
      <section>
        <GameCanvas />
        <div className="max-w-3xl mx-auto px-5 py-12 text-center">
          <h1 className="font-[family-name:var(--font-press-start-2p)] text-xl leading-relaxed">
            It all started with a dot.
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            It does nothing. You decide what happens next.
          </p>
        </div>
      </section>

      <DotSeparator />

      {/* Section 2: Story */}
      <section className="max-w-3xl mx-auto px-5 py-12">
        <h2 className="font-[family-name:var(--font-press-start-2p)] text-sm mb-6">
          The Story
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          There&apos;s a dot. It sits there. It pulses. That&apos;s it. But
          here&apos;s the thing -- you get to decide what happens to it. Propose
          an idea. Vote on someone else&apos;s. The best ones get built. Every
          version of this game exists because someone like you said &quot;hey,
          what if the dot did this?&quot;
        </p>
      </section>

      <DotSeparator />

      {/* Section 2b: The Vision */}
      <section className="max-w-3xl mx-auto px-5 py-12">
        <h2 className="font-[family-name:var(--font-press-start-2p)] text-sm mb-6">
          The vision. Or whatever this is.
        </h2>
        <div className="text-muted-foreground leading-relaxed space-y-4">
          <p>
            Every game you&apos;ve ever played was designed in a room you
            weren&apos;t in. By people who decided what&apos;s fun before you got
            to touch anything. Then they charged you $70 for the privilege.
          </p>
          <p>
            We wanted to try the opposite. What if nobody decides? What if the
            entire game — every mechanic, every pixel, every dumb feature — comes
            from the people who play it?
          </p>
          <p>
            No creative director. No focus groups. No &quot;we hear your feedback
            and will consider it for a future update.&quot; Just... you say it,
            people vote on it, we build it.
          </p>
          <p>
            Is this a good idea? Honestly, we have no idea. But we figured the
            worst case scenario is a dot on a screen, and the best case is
            something nobody&apos;s ever seen before. Both feel worth trying.
          </p>
        </div>
      </section>

      <DotSeparator />

      {/* Section 2c: The Initiators */}
      <section className="max-w-3xl mx-auto px-5 py-12">
        <h2 className="font-[family-name:var(--font-press-start-2p)] text-sm mb-8">
          The Initiators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Markus */}
          <div className="bg-card border border-border p-6 space-y-4">
            <div className="w-32 h-32 bg-muted mx-auto" aria-label="Pixel portrait of Markus — placeholder" />
            <h3 className="font-[family-name:var(--font-press-start-2p)] text-xs text-center leading-relaxed">
              The Prodigal Game Designer
            </h3>
            <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
              <p>
                Plot twist: Markus actually studied this stuff. Two degrees in
                computer science from the Entertainment Computing Group at
                University of Duisburg-Essen — game design, VR, interactive
                worlds, the whole academic buffet. He was literally trained to
                build games.
              </p>
              <p>
                Then he spent 15 years in banking, education, and digital
                strategy. Building products nobody asked for in rooms where
                &quot;innovation&quot; meant a new PowerPoint template. He
                managed teams, launched platforms, shipped AI products — and
                somewhere along the way forgot he once knew how to make things
                fun.
              </p>
              <p>
                This is him remembering. A dot on a screen. Full circle, if you
                will.
              </p>
            </div>
          </div>

          {/* Daniel */}
          <div className="bg-card border border-border p-6 space-y-4">
            <div className="w-32 h-32 bg-muted mx-auto" aria-label="Pixel portrait of Daniel — placeholder" />
            <h3 className="font-[family-name:var(--font-press-start-2p)] text-xs text-center leading-relaxed">
              The Marketing Guy Who Agreed to This
            </h3>
            <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
              <p>
                Daniel&apos;s job is to make businesses money on the internet. He
                optimizes funnels, runs ad campaigns, fixes what&apos;s broken,
                and tells clients uncomfortable truths about their websites.
                He&apos;s the guy you call when &quot;we tried everything&quot;
                actually means &quot;we tried nothing strategically.&quot;
              </p>
              <p>
                Now he&apos;s here. Helping to launch a dot. A single,
                non-revenue-generating dot with no product-market fit and a
                target audience of &quot;anyone who thinks this is funny.&quot;
                His conversion rate on this project is technically zero. He has
                never been more excited about anything.
              </p>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground text-sm text-center mt-8 leading-relaxed">
          One of us has two degrees in game design and spent 15 years not making
          games. The other optimizes conversion funnels for a living and just
          agreed to promote a dot. Together, we&apos;re unstoppable. Probably.
        </p>
      </section>

      <DotSeparator />

      {/* Section 3: Three-Step CTA */}
      <section className="max-w-3xl mx-auto px-5 py-12 text-center">
        <h2 className="font-[family-name:var(--font-press-start-2p)] text-sm mb-8">
          How it works
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-12">
          <Link
            href="/auth/sign-up"
            className="text-lg text-foreground hover:text-muted-foreground"
          >
            {"\u25CF"} 1. Sign up
          </Link>
          <Link
            href="/proposals"
            className="text-lg text-foreground hover:text-muted-foreground"
          >
            {"\u25CF"} 2. Propose
          </Link>
          <Link
            href="/proposals"
            className="text-lg text-foreground hover:text-muted-foreground"
          >
            {"\u25CF"} 3. Vote
          </Link>
        </div>
        <p className="text-muted-foreground mt-8 text-sm">
          That&apos;s it. No tutorials. No onboarding. Just opinions.
        </p>
      </section>

      <DotSeparator />

      {/* Section 4: Proposals Preview */}
      <Suspense fallback={<DotLoader />}>
        <ProposalsPreview />
      </Suspense>

      <DotSeparator />

      {/* Section 5: Changelog Preview */}
      <Suspense fallback={<DotLoader />}>
        <ChangelogPreview />
      </Suspense>
    </main>
  );
}
