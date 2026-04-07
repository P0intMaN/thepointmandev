import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/mdx/getAllContent";

export const metadata: Metadata = { title: "Tags" };

export default function TagsPage() {
  const tags = getAllTags();
  const sorted = Object.entries(tags).sort((a, b) => b[1] - a[1]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-10 border-b-2 border-[var(--color-bg-border)] pb-8">
        <p className="mb-3 font-pixel text-[7px] text-[var(--color-tip)]">// TOPICS</p>
        <h1 className="mb-3 font-pixel text-lg leading-relaxed text-[var(--color-text-primary)]">
          Tags
          <span
            className="inline-block w-[12px] h-[18px] bg-[var(--color-tip)] ml-[4px] align-middle"
            style={{ animation: "pixel-blink 1s steps(1) infinite" }}
          />
        </h1>
        <p className="font-mono text-sm text-[var(--color-text-muted)]">
          {sorted.length} tags across all content.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {sorted.map(([tag, count]) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="pixel-badge flex items-center gap-2 border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-[var(--color-text-muted)] no-underline hover:border-[var(--color-tip)] hover:text-[var(--color-tip)] hover:no-underline"
          >
            <span>#{tag}</span>
            <span className="text-[var(--color-text-faint)]">{count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
