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
        "pixel-badge inline-flex items-center border-[var(--color-bg-border)] bg-[var(--color-bg-muted)] px-2 py-0.5 text-[var(--color-text-faint)] no-underline hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:no-underline",
        className
      )}
    >
      #{tag}
    </Link>
  );
}
