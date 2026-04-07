import Link from "next/link";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";

interface SeriesNavProps {
  posts: BlogPost[];
  currentSlug: string;
  seriesName: string;
}

export function SeriesNav({ posts, currentSlug, seriesName }: SeriesNavProps) {
  return (
    <div className="my-8 rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-4">
      <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-text-faint)]">
        Series: {seriesName.replace(/-/g, " ")}
      </p>
      <ol className="space-y-1">
        {posts.map((post, i) => {
          const isCurrent = post.slug === currentSlug;
          return (
            <li key={post.slug} className="flex items-start gap-2">
              <span
                className={cn(
                  "mt-0.5 font-mono text-xs",
                  isCurrent ? "text-[var(--color-accent)]" : "text-[var(--color-text-faint)]"
                )}
              >
                {String(i + 1).padStart(2, "0")}.
              </span>
              {isCurrent ? (
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {post.frontmatter.title}
                </span>
              ) : (
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm text-[var(--color-text-muted)] no-underline hover:text-[var(--color-accent)] hover:no-underline"
                >
                  {post.frontmatter.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {/* Prev / Next */}
      {(() => {
        const idx = posts.findIndex((p) => p.slug === currentSlug);
        const prev = posts[idx - 1];
        const next = posts[idx + 1];
        if (!prev && !next) return null;
        return (
          <div className="mt-4 flex gap-4 border-t border-[var(--color-bg-border)] pt-4">
            {prev && (
              <Link
                href={`/blog/${prev.slug}`}
                className="text-xs text-[var(--color-text-faint)] no-underline hover:text-[var(--color-accent)] hover:no-underline"
              >
                ← Part {idx}
              </Link>
            )}
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="ml-auto text-xs text-[var(--color-text-faint)] no-underline hover:text-[var(--color-accent)] hover:no-underline"
              >
                Part {idx + 2} →
              </Link>
            )}
          </div>
        );
      })()}
    </div>
  );
}
