import { GameCanvas } from "@/components/game/game-canvas";

export default function Home() {
  return (
    <main className="flex flex-col">
      <div className="text-center py-8 px-5">
        <h1 className="font-[family-name:var(--font-press-start-2p)] text-2xl leading-relaxed">
          It all started with a dot.
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          This is where the dot lives.
        </p>
      </div>
      <GameCanvas />
    </main>
  );
}
