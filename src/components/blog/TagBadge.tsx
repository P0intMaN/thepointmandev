import Link from "next/link";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  tag: string;
  className?: string;
}

export function TagBadge({ tag, className }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      className={cn(
        "inline-flex items-center rounded border border-[var(--color-bg-border)] bg-[var(--color-bg-muted)] px-2 py-0.5 font-mono text-xs text-[var(--color-text-faint)] transition-colors no-underline hover:border-[var(--color-text-faint)] hover:text-[var(--color-text-muted)] hover:no-underline",
        className
      )}
    >
      #{tag}
    </Link>
  );
}
