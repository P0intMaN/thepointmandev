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
        className="group relative flex flex-col gap-1 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-4 transition-all duration-300 hover:border-[var(--color-accent)]/40 no-underline hover:no-underline"
      >
        {/* Shimmer line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#4ade80]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="font-mono text-sm text-[var(--color-text-faint)]">
          {frontmatter.category}
        </span>
        <span className="text-base font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]">
          {frontmatter.title}
        </span>
        <span className="font-mono text-sm text-[var(--color-text-faint)]">
          {formatDate(frontmatter.date)} · {readingTime}
        </span>
      </Link>
    );
  }

  return (
    <article className="group relative flex flex-col gap-3 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-5 transition-all duration-300 hover:border-[var(--color-accent)]/40">
      {/* Shimmer line at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#4ade80]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* Corner glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.06) 0%, transparent 65%)" }}
      />

      {/* Category + meta */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm font-medium text-[var(--color-accent)]">
          {frontmatter.category}
        </span>
        <span className="font-mono text-sm text-[var(--color-text-faint)]">
          {formatDate(frontmatter.date)} · {readingTime}
        </span>
      </div>

      {/* Title */}
      <Link
        href={`/blog/${slug}`}
        className="text-lg font-semibold leading-snug text-[var(--color-text-primary)] no-underline hover:text-[var(--color-accent)] hover:no-underline"
      >
        {frontmatter.title}
      </Link>

      {/* Excerpt */}
      <p className="line-clamp-2 text-base leading-relaxed text-[var(--color-text-muted)]">
        {excerpt}
      </p>

      {/* Tags */}
      {frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {frontmatter.tags.slice(0, 4).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  );
}
