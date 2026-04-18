import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCourses, getCourseLessonsAll } from "@/lib/mdx/getAllContent";
import { parseFrontmatter } from "@/lib/mdx/parseFrontmatter";
import { CourseFrontmatterSchema } from "@/types/course";
import { MDXContent } from "@/components/mdx/MDXContent";
import fs from "fs";
import path from "path";

interface Props {
  params: Promise<{ course: string }>;
}

export async function generateStaticParams() {
  return getAllCourses().map((c) => ({ course: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: slug } = await params;
  const found = getAllCourses().find((c) => c.slug === slug);
  if (!found) return {};
  return { title: found.frontmatter.title, description: found.frontmatter.description };
}

export default async function CourseOverviewPage({ params }: Props) {
  const { course: slug } = await params;
  const courses = getAllCourses();
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  const lessons = getCourseLessonsAll(slug);
  const publishedCount = lessons.filter((l) => !l.draft).length;

  const metaPath = path.join(process.cwd(), "content", "courses", slug, "_meta.mdx");
  const source = fs.readFileSync(metaPath, "utf-8");
  const { content } = parseFrontmatter(source, CourseFrontmatterSchema, metaPath);

  const accent = course.frontmatter.accent ?? "#4ade80";

  const levelColors = {
    beginner: "text-green-400 border-green-900 bg-green-950/30",
    intermediate: "text-amber-400 border-amber-900 bg-amber-950/30",
    advanced: "text-red-400 border-red-900 bg-red-950/30",
  };

  const firstPublished = lessons.find((l) => !l.draft);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10 border-b border-[var(--color-bg-border)] pb-8">
        <p className="mb-2 font-mono text-xs text-[var(--color-text-faint)]">
          <Link href="/courses" className="hover:text-[var(--color-text-muted)] no-underline">
            Courses
          </Link>
          {" / "}
          <span style={{ color: accent }}>{course.frontmatter.category}</span>
        </p>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-[var(--color-text-primary)]">
          {course.frontmatter.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded border px-2 py-0.5 font-mono text-xs ${levelColors[course.frontmatter.level]}`}>
            {course.frontmatter.level}
          </span>
          <span className="font-mono text-xs text-[var(--color-text-faint)]">
            {lessons.length} lessons
          </span>
          {publishedCount > 0 && (
            <span className="font-mono text-xs" style={{ color: accent }}>
              {publishedCount} available
            </span>
          )}
        </div>
      </div>

      {/* Intro content */}
      {content.trim() && (
        <div className="mb-10">
          <MDXContent source={content} />
        </div>
      )}

      {/* Lessons */}
      <div>
        <h2 className="mb-5 font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-text-faint)]">
          {"// "} Lessons
        </h2>
        <ol className="space-y-3">
          {lessons.map((lesson) => {
            const isDraft = lesson.draft;
            return (
              <li key={lesson.slug}>
                {isDraft ? (
                  <div
                    className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-4 opacity-50"
                  >
                    <span className="shrink-0 font-mono text-sm text-[var(--color-text-faint)] pt-0.5">
                      {String(lesson.frontmatter.lessonNumber).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-[var(--color-text-primary)] leading-snug">
                        {lesson.frontmatter.title}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] self-center">
                      soon
                    </span>
                  </div>
                ) : (
                  <Link
                    href={`/courses/${slug}/${lesson.slug}`}
                    className="group flex items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-4 no-underline transition-all duration-200 hover:border-[var(--ca)] hover:no-underline"
                    style={{ "--ca": accent } as React.CSSProperties}
                  >
                    <span
                      className="shrink-0 font-mono text-sm pt-0.5 transition-colors"
                      style={{ color: accent }}
                    >
                      {String(lesson.frontmatter.lessonNumber).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-[var(--color-text-primary)] leading-snug group-hover:text-[var(--ca)] transition-colors">
                        {lesson.frontmatter.title}
                      </p>
                    </div>
                    <span
                      className="shrink-0 font-mono text-xs self-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: accent }}
                    >
                      →
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* CTA */}
      {firstPublished && (
        <div className="mt-10">
          <Link
            href={`/courses/${slug}/${firstPublished.slug}`}
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] px-5 py-2.5 font-mono text-sm font-semibold text-[var(--color-bg-base)] no-underline transition-opacity hover:opacity-80 hover:no-underline"
            style={{ background: accent }}
          >
            Start Learning →
          </Link>
        </div>
      )}
    </div>
  );
}
