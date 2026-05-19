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

      <div className="mt-3">
        <Link
          href="/proposals"
          className="text-muted-foreground hover:text-foreground underline underline-offset-4 inline-block text-xs"
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
      <h2 className="font-[family-name:var(--font-press-start-2p)] text-[10px] mb-8 uppercase tracking-wider">
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
      {/* Section 1: Hero — Game + Proposals side by side on desktop */}
      <section className="max-w-5xl mx-auto px-5 py-12">
        <div className="text-center mb-10">
          <h1 className="font-[family-name:var(--font-press-start-2p)] text-sm sm:text-base leading-[2]">
            It all started with a dot.
          </h1>
          <p className="text-muted-foreground mt-3">
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

      <DotSeparator />

      {/* Section 2: Story */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="font-[family-name:var(--font-press-start-2p)] text-[10px] mb-8 uppercase tracking-wider">
          So here&apos;s the deal.
        </h2>
        <div className="text-muted-foreground leading-relaxed space-y-4">
          <p>
            This is a game. Right now it&apos;s just a dot on a screen. Pretty
            underwhelming, I know.
          </p>
          <p>
            But this dot? It&apos;s yours. Well, not yours <em>yours</em> — it
            belongs to everyone who shows up here.
          </p>
          <p>
            Here&apos;s how it works: You tell us what the dot should do. Move?
            Sure. Change color? Why not. Grow legs and fight aliens? ...we&apos;ll
            talk about it.
          </p>
          <p>
            Everyone votes. The best ideas get built. The dot evolves. Repeat.
          </p>
          <p>
            No roadmap. No game design document. No five-year plan. Just a dot, a
            community, and whatever happens next.
          </p>
          <p>
            Could be the most community-driven game ever made. Could also be a dot
            forever. Honestly? Both outcomes are fine.
          </p>
        </div>
      </section>

      <DotSeparator />

      {/* Section 2b: The Vision */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="font-[family-name:var(--font-press-start-2p)] text-[10px] mb-8 uppercase tracking-wider">
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
      <section className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="font-[family-name:var(--font-press-start-2p)] text-[10px] mb-10 uppercase tracking-wider">
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
              <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
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
                The Marketing Guy Who Agreed to This But Still Doesn&apos;t Understand
              </h3>
              <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
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
            </CardContent>
          </Card>
        </div>

        <p className="text-muted-foreground text-sm text-center mt-10 leading-relaxed">
          One of us has two degrees in game design and spent 15 years not making
          games. The other optimizes conversion funnels for a living and just
          agreed to promote a dot. Together, we&apos;re unstoppable. Probably.
        </p>
      </section>

      <DotSeparator />

      {/* Section 3: Three-Step CTA */}
      <section className="max-w-5xl mx-auto px-5 py-16 text-center">
        <h2 className="font-[family-name:var(--font-press-start-2p)] text-[10px] mb-10 uppercase tracking-wider">
          How it works
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-16">
          <Link
            href="/auth/sign-up"
            className="text-foreground hover:text-muted-foreground"
          >
            {"\u25CF"} 1. Sign up
          </Link>
          <Link
            href="/proposals"
            className="text-foreground hover:text-muted-foreground"
          >
            {"\u25CF"} 2. Propose
          </Link>
          <Link
            href="/proposals"
            className="text-foreground hover:text-muted-foreground"
          >
            {"\u25CF"} 3. Vote
          </Link>
        </div>
        <p className="text-muted-foreground mt-10 text-sm">
          That&apos;s it. No tutorials. No onboarding. Just opinions.
        </p>
      </section>

      <DotSeparator />

      {/* Section 4: Changelog Preview */}
      <Suspense fallback={<DotLoader />}>
        <ChangelogPreview />
      </Suspense>
    </main>
  );
}
