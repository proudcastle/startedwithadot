interface DotCounterProps {
  count: number;
  voted: boolean;
}

export function DotCounter({ count, voted }: DotCounterProps) {
  const dotClass = voted ? "text-foreground" : "text-muted-foreground";

  if (count === 0) {
    return <span className={dotClass}>&#9675;</span>;
  }

  if (count <= 10) {
    return <span className={dotClass}>{"●".repeat(count)}</span>;
  }

  return (
    <span className={dotClass}>
      ● <span className="text-sm">{count}</span>
    </span>
  );
}
