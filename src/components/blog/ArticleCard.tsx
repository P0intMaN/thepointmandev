import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { TagBadge } from "./TagBadge";
import type { BlogPost } from "@/types/blog";

interface ArticleCardProps {
  post: BlogPost;
  compact?: boolean;
}

export function ArticleCard({ post, compact = false }: ArticleCardProps) {
  const { frontmatter, slug, readingTime, excerpt } = post;

  if (compact) {
    return (
      <Link
        href={`/blog/${slug}`}
        className="pixel-card group flex flex-col gap-1 bg-[var(--color-bg-elevated)] p-4 no-underline hover:no-underline"
      >
        <span className="font-pixel text-[7px] text-[var(--color-accent)]">
          {frontmatter.category}
        </span>
        <span className="font-mono text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]">
          {frontmatter.title}
        </span>
        <span className="font-mono text-xs text-[var(--color-text-faint)]">
          {formatDate(frontmatter.date)} · {readingTime}
        </span>
      </Link>
    );
  }

  return (
    <article className="pixel-card flex flex-col gap-3 bg-[var(--color-bg-elevated)] p-5">
      {/* Category + meta */}
      <div className="flex items-center gap-3">
        <span className="font-pixel text-[7px] text-[var(--color-accent)]">
          {frontmatter.category}
        </span>
        <span className="font-mono text-xs text-[var(--color-text-faint)]">
          {formatDate(frontmatter.date)} · {readingTime}
        </span>
      </div>

      {/* Title */}
      <Link
        href={`/blog/${slug}`}
        className="font-mono text-base font-semibold leading-snug text-[var(--color-text-primary)] no-underline hover:text-[var(--color-accent)] hover:no-underline"
      >
        {frontmatter.title}
      </Link>

      {/* Excerpt */}
      <p className="line-clamp-2 font-mono text-sm leading-relaxed text-[var(--color-text-muted)]">
        {excerpt}
      </p>

      {/* Tags */}
      {frontmatter.tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {frontmatter.tags.slice(0, 4).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  );
}
