import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";

interface FeaturedPostProps {
  post: BlogPost;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const { frontmatter, slug, readingTime, excerpt } = post;

  return (
    <article className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-8 transition-all duration-300 hover:border-[#4ade80]/50">
      {/* Shimmer line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#4ade80]/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* Corner glow — stronger for featured */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.08) 0%, transparent 65%)" }}
      />

      {/* Category + meta */}
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-sm font-bold text-[var(--color-accent)]">
          {frontmatter.category}
        </span>
        <span className="font-mono text-xs text-[var(--color-text-faint)]">
          FEATURED
        </span>
        <span className="font-mono text-xs text-[var(--color-text-faint)]">
          {formatDate(frontmatter.date)} · {readingTime}
        </span>
      </div>

      {/* Title */}
      <Link
        href={`/blog/${slug}`}
        className="mb-3 block text-2xl font-bold leading-tight text-[var(--color-text-primary)] no-underline hover:text-[var(--color-accent)] hover:no-underline sm:text-3xl"
      >
        {frontmatter.title}
      </Link>

      {/* Excerpt */}
      <p className="mb-5 text-base leading-relaxed text-[var(--color-text-muted)]">
        {excerpt}
      </p>

      <Link
        href={`/blog/${slug}`}
        className="font-mono text-sm text-[var(--color-accent)] no-underline hover:text-[var(--color-accent-muted)] hover:no-underline"
      >
        Read article →
      </Link>
    </article>
  );
}
