import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { DotLoader } from "@/components/dot-loader";
import {
  VersionCard,
  type VersionWithProposal,
} from "@/components/versions/version-card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Evolution | startedwithadot",
  description: "Every version of the dot, decided by the community.",
};

async function VersionList() {
  const supabase = await createClient();

  const { data: versions } = await supabase
    .from("versions")
    .select("*, proposals(text, profiles(username))")
    .order("created_at", { ascending: false });

  if (!versions || versions.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="font-[family-name:var(--font-press-start-2p)] text-xs text-foreground mb-3">
          Nothing here. Yet.
        </h2>
        <p className="text-muted-foreground mb-6">
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
    );
  }

  return (
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
  );
}

export default function ChangelogPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <h1 className="font-[family-name:var(--font-press-start-2p)] text-2xl sm:text-3xl text-foreground mb-2">
        The Evolution
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Every version, decided by you.
      </p>

      <Suspense fallback={<DotLoader />}>
        <VersionList />
      </Suspense>
    </div>
  );
}
