"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Lesson, SubCourse } from "@/types/course";

interface CourseSidebarProps {
  lessons: Lesson[];
  courseSlug: string;
  courseTitle: string;
  subCourses?: SubCourse[];
}

function LessonLink({ lesson, courseSlug }: { lesson: Lesson; courseSlug: string }) {
  const pathname = usePathname();
  const href = `/courses/${courseSlug}/${lesson.slug}`;
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-start gap-2 rounded-r py-1.5 pr-2 text-sm no-underline transition-all hover:no-underline border-l-2",
        active
          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.07] text-[var(--color-accent)] pl-[6px]"
          : "border-transparent pl-2 text-[var(--color-text-muted)] hover:border-[var(--color-bg-muted)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text-primary)]"
      )}
    >
      <span className="mt-0.5 shrink-0 font-mono text-xs opacity-50">
        {String(lesson.frontmatter.lessonNumber).padStart(2, "0")}
      </span>
      <span className="leading-snug">{lesson.frontmatter.title}</span>
    </Link>
  );
}

function getActiveSubCourse(lessons: Lesson[], courseSlug: string, pathname: string): number | null {
  const active = lessons.find((l) => `/courses/${courseSlug}/${l.slug}` === pathname);
  return active?.frontmatter.subCourse ?? null;
}

export function CourseSidebar({ lessons, courseSlug, courseTitle, subCourses }: CourseSidebarProps) {
  const pathname = usePathname();
  const grouped = Boolean(subCourses && subCourses.length > 0);

  // Seed with the active sub-course open — no flash of collapsed state
  const [openSections, setOpenSections] = useState<Set<number>>(() => {
    const active = getActiveSubCourse(lessons, courseSlug, pathname);
    return active !== null ? new Set([active]) : new Set();
  });

  // When navigating to a lesson in a collapsed section, auto-expand it
  useEffect(() => {
    const active = getActiveSubCourse(lessons, courseSlug, pathname);
    if (active !== null) {
      setOpenSections((prev) => {
        if (prev.has(active)) return prev;
        const next = new Set(prev);
        next.add(active);
        return next;
      });
    }
  }, [pathname, lessons, courseSlug]);

  const toggle = (scNumber: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(scNumber)) {
        next.delete(scNumber);
      } else {
        next.add(scNumber);
      }
      return next;
    });
  };

  return (
    <nav aria-label="Course lessons">
      <Link
        href={`/courses/${courseSlug}`}
        className="mb-4 block font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-text-faint)] no-underline hover:text-[var(--color-text-muted)] hover:no-underline"
      >
        ← {courseTitle}
      </Link>

      {grouped ? (
        <div className="space-y-1">
          {subCourses!.map((sc) => {
            const scLessons = lessons.filter((l) => l.frontmatter.subCourse === sc.number);
            if (scLessons.length === 0) return null;
            const isOpen = openSections.has(sc.number);
            const hasActive = scLessons.some(
              (l) => `/courses/${courseSlug}/${l.slug}` === pathname
            );

            return (
              <div key={sc.number}>
                {/* Section header — clickable toggle */}
                <button
                  onClick={() => toggle(sc.number)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left transition-colors hover:bg-[var(--color-bg-muted)]",
                    hasActive ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-faint)]"
                  )}
                  aria-expanded={isOpen}
                >
                  {/* Chevron */}
                  <svg
                    className={cn("h-3 w-3 shrink-0 transition-transform duration-200", isOpen && "rotate-90")}
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M4 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  {/* Label */}
                  <span className="flex-1 font-mono text-[10px] font-semibold uppercase tracking-widest leading-tight">
                    {String(sc.number).padStart(2, "0")} — {sc.title}
                  </span>

                  {/* Lesson count badge */}
                  <span className="shrink-0 font-mono text-[9px] opacity-40">
                    {scLessons.length}
                  </span>
                </button>

                {/* Lessons — only rendered when open */}
                {isOpen && (
                  <div className="ml-2 mt-0.5 space-y-0.5">
                    {scLessons.map((lesson) => (
                      <LessonLink key={lesson.slug} lesson={lesson} courseSlug={courseSlug} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-0.5">
          {lessons.map((lesson) => (
            <LessonLink key={lesson.slug} lesson={lesson} courseSlug={courseSlug} />
          ))}
        </div>
      )}
    </nav>
  );
}
