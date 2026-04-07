import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCourses, getCourseLessons } from "@/lib/mdx/getAllContent";
import { getLessonBySlug } from "@/lib/mdx/getBySlug";
import { CourseSidebar } from "@/components/course/CourseSidebar";
import { LessonNav } from "@/components/course/LessonNav";
import { TableOfContents } from "@/components/mdx/TableOfContents";
import { ReadingProgress } from "@/components/mdx/ReadingProgress";
import { MDXContent } from "@/components/mdx/MDXContent";

interface Props {
  params: Promise<{ course: string; lesson: string }>;
}

export async function generateStaticParams() {
  const courses = getAllCourses();
  const params: { course: string; lesson: string }[] = [];
  for (const course of courses) {
    const lessons = getCourseLessons(course.slug);
    for (const lesson of lessons) {
      params.push({ course: course.slug, lesson: lesson.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const result = getLessonBySlug(courseSlug, lessonSlug);
  if (!result) return {};
  return { title: result.frontmatter.title, description: result.frontmatter.description };
}

export default async function LessonPage({ params }: Props) {
  const { course: courseSlug, lesson: lessonSlug } = await params;

  const result = getLessonBySlug(courseSlug, lessonSlug);
  if (!result) notFound();

  const { frontmatter, content, toc } = result;

  const courses = getAllCourses();
  const course = courses.find((c) => c.slug === courseSlug);
  const lessons = getCourseLessons(courseSlug);

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="lg:grid lg:grid-cols-[220px_1fr_200px] lg:gap-10">
          {/* Course sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <CourseSidebar
                lessons={lessons}
                courseSlug={courseSlug}
                courseTitle={course?.frontmatter.title ?? courseSlug}
              />
            </div>
          </aside>

          {/* Lesson content */}
          <article>
            <header className="mb-8 border-b-2 border-[var(--color-bg-border)] pb-6">
              <p className="mb-2 font-pixel text-[7px] text-[var(--color-warning)]">
                LESSON {String(frontmatter.lessonNumber).padStart(2, "0")}
              </p>
              <h1 className="font-mono text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
                {frontmatter.title}
              </h1>
              <p className="mt-2 font-mono text-sm leading-relaxed text-[var(--color-text-muted)]">
                {frontmatter.description}
              </p>
            </header>

            <MDXContent source={content} />

            <LessonNav lessons={lessons} currentSlug={lessonSlug} courseSlug={courseSlug} />
          </article>

          {/* TOC sidebar */}
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <TableOfContents items={toc} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
