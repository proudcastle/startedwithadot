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
