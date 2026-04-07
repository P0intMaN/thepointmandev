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
    <div className="my-8 border-2 border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-4" style={{ boxShadow: "4px 4px 0 0 #2e2e2e" }}>
      <p className="mb-3 font-pixel text-[7px] text-[var(--color-accent)]">
        // SERIES: {seriesName.replace(/-/g, " ").toUpperCase()}
      </p>
      <ol className="space-y-1.5">
        {posts.map((post, i) => {
          const isCurrent = post.slug === currentSlug;
          return (
            <li key={post.slug} className="flex items-start gap-3">
              <span className={cn("shrink-0 font-pixel text-[8px]", isCurrent ? "text-[var(--color-accent)]" : "text-[var(--color-text-faint)]")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {isCurrent ? (
                <span className="font-mono text-sm font-medium text-[var(--color-text-primary)]">
                  ▶ {post.frontmatter.title}
                </span>
              ) : (
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-mono text-sm text-[var(--color-text-muted)] no-underline hover:text-[var(--color-accent)] hover:no-underline"
                >
                  {post.frontmatter.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {(() => {
        const idx = posts.findIndex((p) => p.slug === currentSlug);
        const prev = posts[idx - 1];
        const next = posts[idx + 1];
        if (!prev && !next) return null;
        return (
          <div className="mt-4 flex gap-4 border-t-2 border-[var(--color-bg-border)] pt-4">
            {prev && (
              <Link href={`/blog/${prev.slug}`} className="font-pixel text-[7px] text-[var(--color-text-faint)] no-underline hover:text-[var(--color-accent)] hover:no-underline">
                ◀ PART {idx}
              </Link>
            )}
            {next && (
              <Link href={`/blog/${next.slug}`} className="ml-auto font-pixel text-[7px] text-[var(--color-text-faint)] no-underline hover:text-[var(--color-accent)] hover:no-underline">
                PART {idx + 2} ▶
              </Link>
            )}
          </div>
        );
      })()}
    </div>
  );
}
