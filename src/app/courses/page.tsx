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
      <div className="mb-10">
        <h1 className="mb-2 font-mono text-3xl font-bold text-[var(--color-text-primary)]">
          Courses<span className="text-[var(--color-accent)]">_</span>
        </h1>
        <p className="text-[var(--color-text-muted)]">
          Structured, multi-part learning paths. Start from scratch or jump to where you need to be.
        </p>
      </div>

      {courses.length === 0 ? (
        <p className="text-[var(--color-text-faint)]">No courses yet — check back soon.</p>
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
