interface ComplexityProps {
  time: string;
  space: string;
}

export function Complexity({ time, space }: ComplexityProps) {
  return (
    <div className="my-4 flex flex-wrap gap-3">
      <span className="inline-flex items-center gap-1.5 rounded border border-green-900 bg-green-950/30 px-3 py-1 font-mono text-xs text-green-400">
        <span className="text-[var(--color-text-faint)]">time:</span>
        {time}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded border border-cyan-900 bg-cyan-950/30 px-3 py-1 font-mono text-xs text-cyan-400">
        <span className="text-[var(--color-text-faint)]">space:</span>
        {space}
      </span>
    </div>
  );
}
