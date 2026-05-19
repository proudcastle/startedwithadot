import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
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
          No versions yet.
        </h2>
        <p className="text-muted-foreground mb-4">
          The dot is waiting for its first evolution. Go propose something.
        </p>
        <Link
          href="/proposals"
          className="text-foreground underline hover:text-muted-foreground"
        >
          Propose an idea
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
      <h1 className="font-[family-name:var(--font-press-start-2p)] text-xl text-foreground mb-2">
        The Evolution
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Every version, decided by you.
      </p>

      <Suspense
        fallback={
          <div className="text-center py-12 text-muted-foreground">
            Loading versions...
          </div>
        }
      >
        <VersionList />
      </Suspense>
    </div>
  );
}
