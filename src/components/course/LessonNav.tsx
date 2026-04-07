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
    <div className="mt-12 flex gap-4 border-t-2 border-[var(--color-bg-border)] pt-8">
      {prev && (
        <Link
          href={`/courses/${courseSlug}/${prev.slug}`}
          className="pixel-card flex flex-col gap-1 bg-[var(--color-bg-elevated)] p-4 no-underline hover:no-underline"
        >
          <span className="font-pixel text-[7px] text-[var(--color-text-faint)]">◀ PREVIOUS</span>
          <span className="font-mono text-sm font-medium text-[var(--color-text-primary)]">
            {prev.frontmatter.title}
          </span>
        </Link>
      )}
      {next && (
        <Link
          href={`/courses/${courseSlug}/${next.slug}`}
          className="pixel-card ml-auto flex flex-col items-end gap-1 bg-[var(--color-bg-elevated)] p-4 text-right no-underline hover:no-underline"
        >
          <span className="font-pixel text-[7px] text-[var(--color-text-faint)]">NEXT ▶</span>
          <span className="font-mono text-sm font-medium text-[var(--color-text-primary)]">
            {next.frontmatter.title}
          </span>
        </Link>
      )}
    </div>
  );
}
