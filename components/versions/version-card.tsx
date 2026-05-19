import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { timeAgo } from "@/lib/format";
import type { Database } from "@/types/database";

type VersionRow = Database["public"]["Tables"]["versions"]["Row"];

export interface VersionWithProposal extends VersionRow {
  proposals: {
    text: string;
    profiles: { username: string } | null;
  } | null;
}

interface VersionCardProps {
  version: VersionWithProposal;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function VersionCard({ version }: VersionCardProps) {
  const username = version.proposals?.profiles?.username ?? "unknown";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="font-[family-name:var(--font-press-start-2p)] text-xl text-foreground">
            v{version.version_number}
          </span>
          <span className="mx-2 text-muted-foreground">·</span>
          <span className="font-[family-name:var(--font-press-start-2p)] text-xl text-foreground">
            {version.title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {version.description && (
          <p className="text-base text-foreground mb-3">
            {version.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>@{username}</span>
          <span>·</span>
          <span>{timeAgo(version.created_at)}</span>
          {version.proposals?.text && (
            <>
              <span>·</span>
              <span>
                Proposed: &quot;{truncate(version.proposals.text, 60)}&quot;
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
