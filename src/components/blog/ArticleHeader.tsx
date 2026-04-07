import { formatDate } from "@/lib/utils";
import { TagBadge } from "./TagBadge";
import type { BlogFrontmatter } from "@/types/blog";

interface ArticleHeaderProps {
  frontmatter: BlogFrontmatter;
  readingTime: string;
}

export function ArticleHeader({ frontmatter, readingTime }: ArticleHeaderProps) {
  return (
    <header className="mb-8 border-b border-[var(--color-bg-border)] pb-8">
      {/* Category */}
      <div className="mb-3">
        <span className="font-mono text-sm font-semibold text-[var(--color-accent)]">
          {frontmatter.category}
        </span>
        {frontmatter.series && (
          <span className="ml-2 font-mono text-sm text-[var(--color-text-faint)]">
            / {frontmatter.series.replace(/-/g, " ")}
            {frontmatter.seriesPart && ` · Part ${frontmatter.seriesPart}`}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
        {frontmatter.title}
      </h1>

      {/* Description */}
      {frontmatter.description && (
        <p className="mb-5 text-lg leading-relaxed text-[var(--color-text-muted)]">
          {frontmatter.description}
        </p>
      )}

      {/* Meta row */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-[var(--color-text-faint)]">
        <span>{formatDate(frontmatter.date)}</span>
        {frontmatter.updated && (
          <span>Updated {formatDate(frontmatter.updated)}</span>
        )}
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
