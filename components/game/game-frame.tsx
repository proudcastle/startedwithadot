"use client";

import { useState } from "react";
import { GameCanvas } from "./game-canvas";

export function GameFrame() {
  const [lost, setLost] = useState(false);

  return (
    <div className="relative border-4 border-foreground">
      <div
        className="bg-card px-4 py-2 border-b-4 border-foreground text-center cursor-default select-none"
        onMouseEnter={() => setLost(true)}
        onMouseLeave={() => setLost(false)}
      >
        <span className="font-[family-name:var(--font-press-start-2p)] text-[10px] text-muted-foreground">
          {lost ? "You lost The Game" : "The Game...?"}
        </span>
      </div>
      <GameCanvas />
    </div>
  );
}
