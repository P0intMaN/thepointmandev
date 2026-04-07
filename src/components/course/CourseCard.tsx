import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { TagBadge } from "@/components/blog/TagBadge";
import type { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  lessonCount?: number;
}

const levelStyles = {
  beginner: { badge: "border-[var(--color-accent)] text-[var(--color-accent)]", cta: "border-[var(--color-accent)] text-[var(--color-accent)]" },
  intermediate: { badge: "border-[var(--color-warning)] text-[var(--color-warning)]", cta: "border-[var(--color-warning)] text-[var(--color-warning)]" },
  advanced: { badge: "border-[var(--color-danger)] text-[var(--color-danger)]", cta: "border-[var(--color-danger)] text-[var(--color-danger)]" },
};

export function CourseCard({ course, lessonCount }: CourseCardProps) {
  const { frontmatter, slug } = course;
  const styles = levelStyles[frontmatter.level];

  return (
    <article className="pixel-card flex flex-col gap-4 bg-[var(--color-bg-elevated)] p-6">
      {/* Level + meta */}
      <div className="flex items-center gap-3">
        <span className={`pixel-badge ${styles.badge}`}>
          {frontmatter.level.toUpperCase()}
        </span>
        <span className="font-mono text-xs text-[var(--color-text-faint)]">
          {lessonCount ?? frontmatter.totalLessons} lessons
        </span>
        <span className="font-mono text-xs text-[var(--color-text-faint)]">
          {formatDate(frontmatter.date)}
        </span>
      </div>

      {/* Title */}
      <Link
        href={`/courses/${slug}`}
        className="font-mono text-base font-semibold leading-snug text-[var(--color-text-primary)] no-underline hover:text-[var(--color-accent)] hover:no-underline"
      >
        {frontmatter.title}
      </Link>

      {/* Description */}
      <p className="font-mono text-sm leading-relaxed text-[var(--color-text-muted)]">
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
        className={`pixel-btn mt-auto px-4 py-2 no-underline hover:no-underline ${styles.cta}`}
      >
        START ▶
      </Link>
    </article>
  );
}
