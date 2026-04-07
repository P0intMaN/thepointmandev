import type { Metadata } from "next";
import { getAllCourses, getCourseLessons } from "@/lib/mdx/getAllContent";
import { CourseCard } from "@/components/course/CourseCard";

export const metadata: Metadata = {
  title: "Courses",
  description: "Structured learning paths on system design, algorithms, and software engineering.",
};

export default function CoursesPage() {
  const courses = getAllCourses();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 border-b-2 border-[var(--color-bg-border)] pb-8">
        <p className="mb-3 font-pixel text-[7px] text-[var(--color-warning)]">// COURSES</p>
        <h1 className="mb-3 font-pixel text-lg leading-relaxed text-[var(--color-text-primary)]">
          Learning Paths
          <span
            className="inline-block w-[12px] h-[18px] bg-[var(--color-warning)] ml-[4px] align-middle"
            style={{ animation: "pixel-blink 1s steps(1) infinite" }}
          />
        </h1>
        <p className="font-mono text-sm text-[var(--color-text-muted)]">
          Structured, multi-part courses. Start from scratch or jump to where you need to be.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="border-2 border-[var(--color-bg-border)] p-8 text-center">
          <p className="font-pixel text-[8px] text-[var(--color-text-faint)]">COMING SOON</p>
          <p className="mt-2 font-mono text-xs text-[var(--color-text-faint)]">No courses yet — check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const lessons = getCourseLessons(course.slug);
            return (
              <CourseCard key={course.slug} course={course} lessonCount={lessons.length} />
            );
          })}
        </div>
      )}
    </div>
  );
}
