import { Card, CardContent } from "@/components/ui/8bit/card";
import { StatusBadge } from "./status-badge";
import { DotCounter } from "./dot-counter";
import { timeAgo } from "@/lib/format";
import type { Database } from "@/types/database";
import type { ReactNode } from "react";

type ProposalStatus = Database["public"]["Enums"]["proposal_status"];

interface ProposalCardProps {
  proposal: {
    id: string;
    text: string;
    status: ProposalStatus;
    vote_count: number;
    created_at: string;
    profiles: { username: string } | null;
  };
  voted: boolean;
  children?: ReactNode;
}

export function ProposalCard({ proposal, voted, children }: ProposalCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <StatusBadge status={proposal.status} />
          {children}
        </div>

        <p className="text-base text-foreground mb-3">{proposal.text}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>@{proposal.profiles?.username ?? "unknown"}</span>
            <span>·</span>
            <span>{timeAgo(proposal.created_at)}</span>
          </div>
          <DotCounter count={proposal.vote_count} voted={voted} />
        </div>
      </CardContent>
    </Card>
  );
}
