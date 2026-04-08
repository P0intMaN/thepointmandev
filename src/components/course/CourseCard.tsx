import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { TagBadge } from "@/components/blog/TagBadge";
import type { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  lessonCount?: number;
}

const levelColors = {
  beginner: "text-green-400 border-green-900 bg-green-950/30",
  intermediate: "text-amber-400 border-amber-900 bg-amber-950/30",
  advanced: "text-red-400 border-red-900 bg-red-950/30",
};

// Glow color per level
const levelGlow = {
  beginner: { shimmer: "via-[#4ade80]/60", glow: "rgba(74,222,128,0.06)", border: "hover:border-[#4ade80]/40" },
  intermediate: { shimmer: "via-[#fbbf24]/60", glow: "rgba(251,191,36,0.06)", border: "hover:border-[#fbbf24]/40" },
  advanced: { shimmer: "via-[#f87171]/60", glow: "rgba(248,113,113,0.06)", border: "hover:border-[#f87171]/40" },
};

export function CourseCard({ course, lessonCount }: CourseCardProps) {
  const { frontmatter, slug } = course;
  const glow = levelGlow[frontmatter.level];

  return (
    <article className={`group relative flex flex-col gap-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-6 transition-all duration-300 ${glow.border}`}>
      {/* Shimmer — color by level */}
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${glow.shimmer} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      {/* Corner glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${glow.glow} 0%, transparent 65%)` }}
      />

      {/* Level + meta */}
      <div className="flex items-center gap-3">
        <span className={`rounded border px-2 py-0.5 font-mono text-sm ${levelColors[frontmatter.level]}`}>
          {frontmatter.level}
        </span>
        <span className="font-mono text-sm text-[var(--color-text-faint)]">
          {lessonCount ?? frontmatter.totalLessons} lessons
        </span>
        <span className="font-mono text-sm text-[var(--color-text-faint)]">
          {formatDate(frontmatter.date)}
        </span>
      </div>

      {/* Title */}
      <Link
        href={`/courses/${slug}`}
        className="text-xl font-semibold leading-snug text-[var(--color-text-primary)] no-underline hover:text-[var(--color-accent)] hover:no-underline"
      >
        {frontmatter.title}
      </Link>

      {/* Description */}
      <p className="text-base leading-relaxed text-[var(--color-text-muted)]">
        {frontmatter.description}
      </p>

      {/* Tags */}
      {frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {frontmatter.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}

      <Link
        href={`/courses/${slug}`}
        className="mt-auto font-mono text-sm text-[var(--color-accent)] no-underline hover:text-[var(--color-accent-muted)] hover:no-underline"
      >
        Start course →
      </Link>
    </article>
  );
}
