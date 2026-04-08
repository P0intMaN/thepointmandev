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
              "flex items-start gap-2 rounded-r py-2 pr-2 text-sm no-underline transition-all hover:no-underline border-l-2",
              active
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.07] text-[var(--color-accent)] pl-[6px]"
                : "border-transparent pl-2 text-[var(--color-text-muted)] hover:border-[var(--color-bg-muted)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text-primary)]"
            )}
          >
            <span className="mt-0.5 shrink-0 font-mono text-xs opacity-60">
              {String(lesson.frontmatter.lessonNumber).padStart(2, "0")}
            </span>
            <span className="leading-snug">{lesson.frontmatter.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
