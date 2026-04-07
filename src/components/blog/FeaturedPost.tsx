import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { TagBadge } from "./TagBadge";
import type { BlogPost } from "@/types/blog";

interface FeaturedPostProps {
  post: BlogPost;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const { frontmatter, slug, readingTime, excerpt } = post;

  return (
    <article
      className="pixel-card flex flex-col gap-0 bg-[var(--color-bg-elevated)] p-8"
      style={{ boxShadow: "6px 6px 0 0 #00ff41", borderColor: "var(--color-accent)" }}
    >
      {/* Label row */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="pixel-badge border-[var(--color-accent)] text-[var(--color-accent)]">
          ★ FEATURED
        </span>
        <span className="font-pixel text-[7px] text-[var(--color-warning)]">
          {frontmatter.category}
        </span>
        <span className="font-mono text-xs text-[var(--color-text-faint)]">
          {formatDate(frontmatter.date)} · {readingTime}
        </span>
      </div>

      {/* Title */}
      <Link
        href={`/blog/${slug}`}
        className="mb-4 block font-mono text-xl font-bold leading-snug text-[var(--color-text-primary)] no-underline hover:text-[var(--color-accent)] hover:no-underline sm:text-2xl"
      >
        {frontmatter.title}
      </Link>

      {/* Excerpt */}
      <p className="mb-6 font-mono text-sm leading-relaxed text-[var(--color-text-muted)]">
        {excerpt}
      </p>

      {/* Tags + CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {frontmatter.tags.slice(0, 5).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <Link
          href={`/blog/${slug}`}
          className="pixel-btn border-[var(--color-accent)] px-4 py-2 text-[var(--color-accent)] no-underline hover:no-underline"
        >
          READ ▶
        </Link>
      </div>
    </article>
  );
}
