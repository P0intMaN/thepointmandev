import { cn } from "@/lib/utils";

type Difficulty = "easy" | "medium" | "hard";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const styles: Record<Difficulty, string> = {
  easy: "border-[var(--color-accent)] text-[var(--color-accent)]",
  medium: "border-[var(--color-warning)] text-[var(--color-warning)]",
  hard: "border-[var(--color-danger)] text-[var(--color-danger)]",
};

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        "pixel-badge uppercase",
        styles[difficulty],
        className
      )}
    >
      {difficulty}
    </span>
  );
}
