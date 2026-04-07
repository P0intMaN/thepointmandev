import { formatDate } from "@/lib/utils";
import { TagBadge } from "./TagBadge";
import type { BlogFrontmatter } from "@/types/blog";

interface ArticleHeaderProps {
  frontmatter: BlogFrontmatter;
  readingTime: string;
}

export function ArticleHeader({ frontmatter, readingTime }: ArticleHeaderProps) {
  return (
    <header className="mb-8 border-b-2 border-[var(--color-bg-border)] pb-8">
      {/* Category + series breadcrumb */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="font-pixel text-[7px] text-[var(--color-accent)]">
          {frontmatter.category}
        </span>
        {frontmatter.series && (
          <>
            <span className="font-mono text-xs text-[var(--color-text-faint)]">/</span>
            <span className="font-mono text-xs text-[var(--color-text-faint)]">
              {frontmatter.series.replace(/-/g, " ")}
              {frontmatter.seriesPart && ` · Part ${frontmatter.seriesPart}`}
            </span>
          </>
        )}
      </div>

      {/* Title */}
      <h1 className="mb-4 font-mono text-2xl font-bold leading-tight text-[var(--color-text-primary)] sm:text-3xl">
        {frontmatter.title}
      </h1>

      {/* Description */}
      {frontmatter.description && (
        <p className="mb-5 font-mono text-base leading-relaxed text-[var(--color-text-muted)]">
          {frontmatter.description}
        </p>
      )}

      {/* Meta row */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-[var(--color-text-faint)]">
        <span>{formatDate(frontmatter.date)}</span>
        {frontmatter.updated && <span>Updated {formatDate(frontmatter.updated)}</span>}
        <span>{readingTime}</span>
        {frontmatter.author && <span>by {frontmatter.author}</span>}
      </div>

      {/* Tags */}
      {frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {frontmatter.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </header>
  );
}
