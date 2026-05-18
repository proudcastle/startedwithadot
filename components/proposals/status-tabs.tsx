"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/8bit/tabs";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "accepted", label: "Accepted" },
  { value: "implemented", label: "Implemented" },
] as const;

export function StatusTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentStatus = searchParams.get("status") || "all";

  function handleTabChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    const query = params.toString();
    router.push(query ? `/proposals?${query}` : "/proposals");
  }

  return (
    <Tabs value={currentStatus} onValueChange={handleTabChange}>
      <TabsList>
        {STATUS_TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="font-[family-name:var(--font-press-start-2p)] text-xs"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
