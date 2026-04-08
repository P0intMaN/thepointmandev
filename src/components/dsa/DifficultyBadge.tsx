import { cn } from "@/lib/utils";

type Difficulty = "easy" | "medium" | "hard";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const styles: Record<Difficulty, string> = {
  easy: "border-green-900 bg-green-950/30 text-green-400",
  medium: "border-amber-900 bg-amber-950/30 text-amber-400",
  hard: "border-red-900 bg-red-950/30 text-red-400",
};

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 font-mono text-sm uppercase",
        styles[difficulty],
        className
      )}
    >
      {difficulty}
    </span>
  );
}
