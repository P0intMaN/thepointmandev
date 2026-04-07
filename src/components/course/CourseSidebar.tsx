"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types/course";

interface CourseSidebarProps {
  lessons: Lesson[];
  courseSlug: string;
  courseTitle: string;
}

export function CourseSidebar({ lessons, courseSlug, courseTitle }: CourseSidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Course lessons" className="space-y-1">
      <Link
        href={`/courses/${courseSlug}`}
        className="mb-3 block font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-text-faint)] no-underline hover:text-[var(--color-text-muted)] hover:no-underline"
      >
        ← {courseTitle}
      </Link>
      {lessons.map((lesson) => {
        const href = `/courses/${courseSlug}/${lesson.slug}`;
        const active = pathname === href;
        return (
          <Link
            key={lesson.slug}
            href={href}
            className={cn(
              "flex items-start gap-2 rounded px-2 py-2 text-sm no-underline transition-colors hover:no-underline",
              active
                ? "bg-[var(--color-accent-dim)] text-[var(--color-accent)]"
                : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text-primary)]"
            )}
          >
            <span className="mt-0.5 shrink-0 font-mono text-xs text-[var(--color-text-faint)]">
              {String(lesson.frontmatter.lessonNumber).padStart(2, "0")}
            </span>
            <span className="leading-snug">{lesson.frontmatter.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
