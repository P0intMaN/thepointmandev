import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCourses, getCourseLessons } from "@/lib/mdx/getAllContent";
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

  const lessons = getCourseLessons(slug);

  // Read course intro content from _meta.mdx
  const metaPath = path.join(process.cwd(), "content", "courses", slug, "_meta.mdx");
  const source = fs.readFileSync(metaPath, "utf-8");
  const { content } = parseFrontmatter(source, CourseFrontmatterSchema, metaPath);

  const levelColors = {
    beginner: "text-green-400 border-green-900 bg-green-950/30",
    intermediate: "text-amber-400 border-amber-900 bg-amber-950/30",
    advanced: "text-red-400 border-red-900 bg-red-950/30",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10 border-b border-[var(--color-bg-border)] pb-8">
        <p className="mb-2 font-mono text-xs text-[var(--color-text-faint)]">COURSE</p>
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
        </div>
      </div>

      {/* Intro content */}
      {content.trim() && <MDXContent source={content} />}

      {/* Lessons list */}
      <div className="mt-10">
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-[var(--color-text-faint)]">
          Lessons
        </h2>
        <ol className="space-y-2">
          {lessons.map((lesson) => (
            <li key={lesson.slug}>
              <Link
                href={`/courses/${slug}/${lesson.slug}`}
                className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-4 no-underline transition-colors hover:border-[var(--color-text-faint)] hover:no-underline"
              >
                <span className="mt-0.5 shrink-0 font-mono text-sm text-[var(--color-text-faint)]">
                  {String(lesson.frontmatter.lessonNumber).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-base font-medium text-[var(--color-text-primary)]">
                    {lesson.frontmatter.title}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    {lesson.frontmatter.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {lessons.length > 0 && (
        <div className="mt-8">
          <Link
            href={`/courses/${slug}/${lessons[0].slug}`}
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-5 py-2.5 font-mono text-sm font-semibold text-[var(--color-bg-base)] no-underline transition-colors hover:bg-[var(--color-accent-muted)] hover:no-underline"
          >
            Start Learning →
          </Link>
        </div>
      )}
    </div>
  );
}
