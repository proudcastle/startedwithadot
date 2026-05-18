import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ProposalInput } from "@/components/proposals/proposal-input";
import { ProposalCard } from "@/components/proposals/proposal-card";
import { ProposalCardActions } from "@/components/proposals/proposal-card-actions";
import { StatusTabs } from "@/components/proposals/status-tabs";

const VALID_STATUSES = ["open", "accepted", "implemented"] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];

function isValidStatus(value: string): value is ValidStatus {
  return (VALID_STATUSES as readonly string[]).includes(value);
}

async function ProposalFeed({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : undefined;

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

  // Fetch user's votes in a single query for O(1) lookup
  const userVoteSet = new Set<string>();
  if (user) {
    const { data: votes } = await supabase
      .from("votes")
      .select("proposal_id")
      .eq("user_id", user.id);
    if (votes) {
      for (const vote of votes) {
        userVoteSet.add(vote.proposal_id);
      }
    }
  }

  // Build proposal query with optional status filter
  const query = supabase
    .from("proposals")
    .select("*, profiles(username)")
    .order("vote_count", { ascending: false })
    .limit(50);

  if (status && isValidStatus(status)) {
    query.eq("status", status);
  } else {
    // Hide rejected proposals from the "all" view
    query.neq("status", "rejected");
  }

  const { data: proposals } = await query;

  return (
    <>
      <div className="mb-6">
        <ProposalInput
          isAuthenticated={isAuthenticated}
          isVerified={isVerified}
        />
      </div>

      <div className="mb-6">
        <StatusTabs />
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
              actions={
                <ProposalCardActions
                  proposalId={proposal.id}
                  userId={user?.id ?? null}
                  isAdmin={isAdmin}
                  initialVoted={userVoteSet.has(proposal.id)}
                  initialCount={proposal.vote_count}
                />
              }
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

export default function ProposalsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
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
        <ProposalFeed searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
