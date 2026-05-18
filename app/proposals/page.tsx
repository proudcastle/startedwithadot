import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ProposalInput } from "@/components/proposals/proposal-input";
import { ProposalCard } from "@/components/proposals/proposal-card";

async function ProposalFeed() {
  const supabase = await createClient();

  // Fetch current user auth state
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, is_admin")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.is_admin ?? false;
  }

  const isAuthenticated = !!user;
  const isVerified = !!user?.email_confirmed_at;

  // Fetch proposals with author username, sorted by vote count
  const { data: proposals } = await supabase
    .from("proposals")
    .select("*, profiles(username)")
    .order("vote_count", { ascending: false })
    .limit(50);

  return (
    <>
      <div className="mb-6">
        <ProposalInput
          isAuthenticated={isAuthenticated}
          isVerified={isVerified}
        />
      </div>

      {proposals && proposals.length > 0 ? (
        <div className="flex flex-col gap-4">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={{
                ...proposal,
                profiles: proposal.profiles as { username: string } | null,
              }}
              voted={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="font-[family-name:var(--font-press-start-2p)] text-xs text-foreground mb-3">
            Nothing here yet.
          </h2>
          <p className="text-muted-foreground">
            Be the first to tell the dot what to do.
          </p>
        </div>
      )}
    </>
  );
}

export default function ProposalsPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <h1 className="font-[family-name:var(--font-press-start-2p)] text-xl text-foreground mb-6">
        Proposals
      </h1>

      <Suspense
        fallback={
          <div className="text-center py-12 text-muted-foreground">
            Loading proposals...
          </div>
        }
      >
        <ProposalFeed />
      </Suspense>
    </div>
  );
}
