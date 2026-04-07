import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/mdx/getAllContent";

export const metadata: Metadata = { title: "Tags" };

export default function TagsPage() {
  const tags = getAllTags();
  const sorted = Object.entries(tags).sort((a, b) => b[1] - a[1]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 font-mono text-3xl font-bold text-[var(--color-text-primary)]">
        Tags<span className="text-[var(--color-accent)]">_</span>
      </h1>
      <p className="mb-10 text-[var(--color-text-muted)]">{sorted.length} tags across all content.</p>

      <div className="flex flex-wrap gap-3">
        {sorted.map(([tag, count]) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="flex items-center gap-2 rounded border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 font-mono text-sm transition-colors no-underline hover:border-[var(--color-text-faint)] hover:text-[var(--color-accent)] hover:no-underline"
          >
            <span className="text-[var(--color-text-muted)]">#{tag}</span>
            <span className="text-xs text-[var(--color-text-faint)]">{count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
