import Link from "next/link";
import type { Lesson } from "@/types/course";

interface LessonNavProps {
  lessons: Lesson[];
  currentSlug: string;
  courseSlug: string;
}

export function LessonNav({ lessons, currentSlug, courseSlug }: LessonNavProps) {
  const idx = lessons.findIndex((l) => l.slug === currentSlug);
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];

  if (!prev && !next) return null;

  return (
    <div className="mt-12 flex gap-4 border-t border-[var(--color-bg-border)] pt-8">
      {prev && (
        <Link
          href={`/courses/${courseSlug}/${prev.slug}`}
          className="flex flex-col gap-1 rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] p-4 transition-colors hover:border-[var(--color-text-faint)] no-underline hover:no-underline"
        >
          <span className="font-mono text-xs text-[var(--color-text-faint)]">← Previous</span>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {prev.frontmatter.title}
          </span>
        </Link>
      )}
      {next && (
        <Link
          href={`/courses/${courseSlug}/${next.slug}`}
          className="ml-auto flex flex-col items-end gap-1 rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] p-4 text-right transition-colors hover:border-[var(--color-text-faint)] no-underline hover:no-underline"
        >
          <span className="font-mono text-xs text-[var(--color-text-faint)]">Next →</span>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {next.frontmatter.title}
          </span>
        </Link>
      )}
    </div>
  );
}
