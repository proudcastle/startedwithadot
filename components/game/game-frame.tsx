"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/8bit/card";
import { GameCanvas } from "./game-canvas";

export function GameFrame() {
  const [lost, setLost] = useState(false);

  return (
    <Card>
      <div
        className="px-4 py-2 border-b border-border text-center cursor-default select-none"
        onMouseEnter={() => setLost(true)}
        onMouseLeave={() => setLost(false)}
      >
        <span className="font-[family-name:var(--font-press-start-2p)] text-[10px] text-muted-foreground">
          {lost ? "You lost The Game" : "The Game...?"}
        </span>
      </div>
      <CardContent className="p-0!">
        <GameCanvas />
      </CardContent>
    </Card>
  );
}
