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

  const metaPath = path.join(process.cwd(), "content", "courses", slug, "_meta.mdx");
  const source = fs.readFileSync(metaPath, "utf-8");
  const { content } = parseFrontmatter(source, CourseFrontmatterSchema, metaPath);

  const levelStyles: Record<string, string> = {
    beginner: "border-[var(--color-accent)] text-[var(--color-accent)]",
    intermediate: "border-[var(--color-warning)] text-[var(--color-warning)]",
    advanced: "border-[var(--color-danger)] text-[var(--color-danger)]",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10 border-b-2 border-[var(--color-bg-border)] pb-8">
        <p className="mb-3 font-pixel text-[7px] text-[var(--color-warning)]">// COURSE</p>
        <h1 className="mb-4 font-mono text-2xl font-bold leading-tight text-[var(--color-text-primary)] sm:text-3xl">
          {course.frontmatter.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`pixel-badge ${levelStyles[course.frontmatter.level]}`}>
            {course.frontmatter.level.toUpperCase()}
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
        <p className="mb-4 font-pixel text-[8px] text-[var(--color-warning)]">// LESSONS</p>
        <ol className="space-y-2">
          {lessons.map((lesson) => (
            <li key={lesson.slug}>
              <Link
                href={`/courses/${slug}/${lesson.slug}`}
                className="pixel-card flex items-start gap-4 bg-[var(--color-bg-elevated)] p-4 no-underline hover:no-underline"
              >
                <span className="mt-0.5 shrink-0 font-pixel text-[8px] text-[var(--color-warning)]">
                  {String(lesson.frontmatter.lessonNumber).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-mono text-sm font-medium text-[var(--color-text-primary)]">
                    {lesson.frontmatter.title}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-[var(--color-text-faint)]">
                    {lesson.frontmatter.description}
                  </p>
                </div>
                <span className="ml-auto self-center font-mono text-xs text-[var(--color-text-faint)]">▶</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {lessons.length > 0 && (
        <div className="mt-8">
          <Link
            href={`/courses/${slug}/${lessons[0].slug}`}
            className="pixel-btn inline-flex items-center gap-2 bg-[var(--color-accent)] px-6 py-3 font-pixel text-[9px] text-[var(--color-bg-base)] no-underline hover:no-underline"
          >
            START LEARNING ▶
          </Link>
        </div>
      )}
    </div>
  );
}
