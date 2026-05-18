import { Badge } from "@/components/ui/8bit/badge";
import type { Database } from "@/types/database";

type ProposalStatus = Database["public"]["Enums"]["proposal_status"];

const STATUS_LABELS: Record<ProposalStatus, string> = {
  open: "Open",
  accepted: "Accepted",
  implemented: "Implemented",
  rejected: "Rejected",
};

interface StatusBadgeProps {
  status: ProposalStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="outline">
      <span className="font-[family-name:var(--font-press-start-2p)] text-xs">
        ● {STATUS_LABELS[status]}
      </span>
    </Badge>
  );
}
