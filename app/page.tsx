import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { GameFrame } from "@/components/game/game-frame";
import { DotSeparator } from "@/components/dot-separator";
import { DotLoader } from "@/components/dot-loader";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/8bit/card";
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
    <div>
      <h3 className="font-[family-name:var(--font-press-start-2p)] text-[8px] mb-4 uppercase tracking-wider text-muted-foreground">
        What should happen next?
      </h3>

      {proposals && proposals.length > 0 ? (
        <div className="flex flex-col gap-2">
          {proposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardContent className="px-3 py-2">
                <p className="text-xs leading-relaxed">
                  {proposal.text}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">
                    @{(proposal.profiles as { username: string } | null)?.username ?? "anon"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {"\u25CF"} {proposal.vote_count}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nobody&apos;s proposed anything yet. Be the first to tell the dot
          what to do.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        <Link
          href="/proposals"
          className="inline-block text-center bg-accent text-accent-foreground font-[family-name:var(--font-press-start-2p)] text-[10px] px-5 py-3 border-2 border-foreground hover:brightness-110 transition-all"
        >
          Submit a proposal &rarr;
        </Link>
        <Link
          href="/proposals"
          className="text-muted-foreground hover:text-foreground underline underline-offset-4 inline-block text-xs text-center"
        >
          See all proposals
        </Link>
      </div>
    </div>
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
    <section className="max-w-5xl mx-auto px-5 py-16">
      <h2 className="font-[family-name:var(--font-press-start-2p)] text-base sm:text-lg mb-8 uppercase tracking-wider">
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
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            No history yet. You could be the first thing that ever happened to
            this dot.
          </p>
          <Link
            href="/proposals"
            className="inline-block bg-accent text-accent-foreground font-[family-name:var(--font-press-start-2p)] text-[10px] px-5 py-3 border-2 border-foreground hover:brightness-110 transition-all"
          >
            Make history &rarr;
          </Link>
        </div>
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
      {/* Section 1: Hero -- Game + Proposals side by side on desktop */}
      <section className="max-w-5xl mx-auto px-5 py-12">
        <div className="text-center mb-10">
          <h1 className="font-[family-name:var(--font-press-start-2p)] text-2xl sm:text-4xl leading-[2]">
            It all started with a dot.
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            It does nothing. You decide what happens next.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
          <div>
            <GameFrame />
          </div>
          <div className="text-sm">
            <Suspense fallback={<DotLoader />}>
              <ProposalsPreview />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Section 2: How it works -- 3 cards, right after hero */}
      <section className="max-w-5xl mx-auto px-5 py-16 text-center">
        <h2 className="font-[family-name:var(--font-press-start-2p)] text-base sm:text-xl mb-10 uppercase tracking-wider">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <span className="font-[family-name:var(--font-press-start-2p)] text-2xl block mb-3">1</span>
              <Link
                href="/auth/sign-up"
                className="font-[family-name:var(--font-press-start-2p)] text-[10px] uppercase hover:text-accent transition-colors"
              >
                Sign up
              </Link>
              <p className="text-sm text-muted-foreground mt-2">
                Takes 30 seconds. We only need an email.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <span className="font-[family-name:var(--font-press-start-2p)] text-2xl block mb-3">2</span>
              <Link
                href="/proposals"
                className="font-[family-name:var(--font-press-start-2p)] text-[10px] uppercase hover:text-accent transition-colors"
              >
                Propose
              </Link>
              <p className="text-sm text-muted-foreground mt-2">
                Tell the dot what to do. 140 characters. Make it count.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <span className="font-[family-name:var(--font-press-start-2p)] text-2xl block mb-3">3</span>
              <Link
                href="/proposals"
                className="font-[family-name:var(--font-press-start-2p)] text-[10px] uppercase hover:text-accent transition-colors"
              >
                Vote
              </Link>
              <p className="text-sm text-muted-foreground mt-2">
                The best ideas rise. The community decides.
              </p>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground mt-10 text-sm">
          That&apos;s it. No tutorials. No onboarding. Just opinions.
        </p>
      </section>

      <DotSeparator />

      {/* Section 3: The Manifesto -- merged Story + Vision */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="font-[family-name:var(--font-press-start-2p)] text-base sm:text-xl mb-8 uppercase tracking-wider">
          Why this exists
        </h2>
        <div className="text-muted-foreground leading-relaxed space-y-4 text-base">
          <p>
            This is a game. Right now it&apos;s just a dot on a screen. Pretty
            underwhelming, I know. But every game you&apos;ve ever played was
            designed in a room you weren&apos;t in. By people who decided
            what&apos;s fun before you got to touch anything.
          </p>
          <p>
            We wanted to try the opposite. You say it, people vote on it, we
            build it. No roadmap. No game design document. No five-year plan.
            Just a dot, a community, and whatever happens next.
          </p>
          <p>
            Could be the most community-driven game ever made. Could also be a
            dot forever. Honestly? Both outcomes are fine.
          </p>
          <p>
            The worst case scenario is a dot on a screen, and the best case is
            something nobody&apos;s ever seen before. Both feel worth trying.
          </p>
        </div>
      </section>

      <DotSeparator />

      {/* Section 4: The Initiators -- shortened bios */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="font-[family-name:var(--font-press-start-2p)] text-base sm:text-xl mb-10 uppercase tracking-wider">
          The Initiators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Markus */}
          <Card>
            <CardContent className="p-8 space-y-5">
              <Image
                src="/images/Markus-8Bit.png"
                alt="Pixel portrait of Markus"
                width={128}
                height={128}
                className="mx-auto"
                style={{ imageRendering: "pixelated" }}
              />
              <h3 className="font-[family-name:var(--font-press-start-2p)] text-[9px] text-center leading-relaxed uppercase">
                The Prodigal Game Designer
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Two degrees in game design. Spent 15 years in banking and
                digital strategy instead of making games. Built products nobody
                asked for in rooms where &quot;innovation&quot; meant a new
                PowerPoint template. This is him remembering.
              </p>
              <p className="text-muted-foreground text-xs italic text-center">
                &ldquo;A dot on a screen. Full circle, if you will.&rdquo;
              </p>
            </CardContent>
          </Card>

          {/* Daniel */}
          <Card>
            <CardContent className="p-8 space-y-5">
              <Image
                src="/images/Daniel-8Bit.png"
                alt="Pixel portrait of Daniel"
                width={128}
                height={128}
                className="mx-auto"
                style={{ imageRendering: "pixelated" }}
              />
              <h3 className="font-[family-name:var(--font-press-start-2p)] text-[9px] text-center leading-relaxed uppercase">
                The Marketing Guy Who Agreed to This
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Makes businesses money on the internet for a living. Now
                he&apos;s helping launch a single, non-revenue-generating dot
                with no product-market fit. His conversion rate on this project
                is technically zero.
              </p>
              <p className="text-muted-foreground text-xs italic text-center">
                &ldquo;He has never been more excited about anything.&rdquo;
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <DotSeparator />

      {/* Section 5: Changelog Preview */}
      <Suspense fallback={<DotLoader />}>
        <ChangelogPreview />
      </Suspense>
    </main>
  );
}
