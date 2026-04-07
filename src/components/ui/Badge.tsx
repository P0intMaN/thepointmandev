import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Variant = "default" | "category" | "difficulty-easy" | "difficulty-medium" | "difficulty-hard" | "tag";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  default:
    "bg-[var(--color-bg-muted)] text-[var(--color-text-muted)] border border-[var(--color-bg-border)]",
  category:
    "bg-[var(--color-accent-dim)] text-[var(--color-accent)] border border-[var(--color-accent-dim)]",
  tag: "bg-[var(--color-bg-muted)] text-[var(--color-text-faint)] border border-[var(--color-bg-border)] hover:text-[var(--color-text-muted)] hover:border-[var(--color-text-faint)] transition-colors cursor-pointer",
  "difficulty-easy":
    "bg-green-950/50 text-green-400 border border-green-900",
  "difficulty-medium":
    "bg-amber-950/50 text-amber-400 border border-amber-900",
  "difficulty-hard":
    "bg-red-950/50 text-red-400 border border-red-900",
};

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-xs px-2 py-0.5 rounded-[var(--radius-sm)]",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
