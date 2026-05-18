"use client";

import { VoteButton } from "./vote-button";
import { AdminMenu } from "./admin-menu";

interface ProposalCardActionsProps {
  proposalId: string;
  userId: string | null;
  isAdmin: boolean;
  proposalStatus: string;
  initialVoted: boolean;
  initialCount: number;
}

export function ProposalCardActions({
  proposalId,
  userId,
  isAdmin,
  proposalStatus,
  initialVoted,
  initialCount,
}: ProposalCardActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <AdminMenu proposalId={proposalId} proposalStatus={proposalStatus} />
      )}
      <VoteButton
        proposalId={proposalId}
        userId={userId}
        initialVoted={initialVoted}
        initialCount={initialCount}
      />
    </div>
  );
}
