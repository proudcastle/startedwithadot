"use client";

import { VoteButton } from "./vote-button";

interface ProposalCardActionsProps {
  proposalId: string;
  userId: string | null;
  isAdmin: boolean;
  initialVoted: boolean;
  initialCount: number;
}

export function ProposalCardActions({
  proposalId,
  userId,
  isAdmin,
  initialVoted,
  initialCount,
}: ProposalCardActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* AdminMenu will be added in Plan 03 */}
      <VoteButton
        proposalId={proposalId}
        userId={userId}
        initialVoted={initialVoted}
        initialCount={initialCount}
      />
    </div>
  );
}
