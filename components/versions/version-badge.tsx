import { Badge } from "@/components/ui/8bit/badge";
import Link from "next/link";

interface VersionBadgeProps {
  versionNumber: string | null;
}

export function VersionBadge({ versionNumber }: VersionBadgeProps) {
  return (
    <Link href="/changelog">
      <Badge variant="outline">
        <span className="font-[family-name:var(--font-press-start-2p)] text-xs">
          v{versionNumber ?? "0"} ●
        </span>
      </Badge>
    </Link>
  );
}
