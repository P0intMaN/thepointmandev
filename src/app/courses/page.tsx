import type { Metadata } from "next";
import { getAllCourses } from "@/lib/mdx/getAllContent";
import { CourseCard } from "@/components/course/CourseCard";
import type { Course } from "@/types/course";

export const metadata: Metadata = {
  title: "Courses",
  description: "Structured learning paths on system design, algorithms, and software engineering.",
};

// Controls display order. Categories not listed here appear at the end under "Other".
const SECTION_ORDER = [
  "System Design",
  "Data Structures",
  "Algorithms",
  "JVM & Runtime",
  "Java Language",
  "Java Collections",
  "Modern Java",
  "Java Concurrency",
  "Design Patterns",
  "Java",
  "Backend Engineering",
  "Frontend Engineering",
  "DevOps",
  "Other",
];

function SectionHeader({ name, count }: { name: string; count: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 font-mono text-xs text-[var(--color-accent)]">{"// "}</span>
      <span className="shrink-0 font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-text-faint)]">
        {name}
      </span>
      <span className="shrink-0 font-mono text-xs text-[var(--color-text-faint)] opacity-40">
        {count} {count === 1 ? "course" : "courses"}
      </span>
      <div className="h-px flex-1 bg-[var(--color-bg-border)]" />
    </div>
  );
}

export default function CoursesPage() {
  const allCourses = getAllCourses();

  // Group by category, sorted by order within each group
  const grouped = new Map<string, Course[]>();
  for (const course of allCourses) {
    const cat = course.frontmatter.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(course);
  }
  for (const courses of grouped.values()) {
    courses.sort((a, b) => (a.frontmatter.order ?? 999) - (b.frontmatter.order ?? 999));
  }

  // Sort sections by SECTION_ORDER, unknown categories before "Other"
  const knownOrder = SECTION_ORDER.slice(0, -1);
  const sections = [
    ...knownOrder.filter((s) => grouped.has(s)).map((s) => [s, grouped.get(s)!] as const),
    ...[...grouped.entries()].filter(([k]) => !SECTION_ORDER.includes(k)).sort(([a], [b]) => a.localeCompare(b)),
    ...(grouped.has("Other") ? [["Other", grouped.get("Other")!] as const] : []),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Page header */}
      <div className="mb-12">
        <h1 className="mb-2 font-mono text-3xl font-bold text-[var(--color-text-primary)]">
          Courses<span className="text-[var(--color-accent)]">_</span>
        </h1>
        <p className="text-[var(--color-text-muted)]">
          Structured, multi-part learning paths. Start from scratch or jump to where you need to be.
        </p>
      </div>

      {allCourses.length === 0 ? (
        <p className="text-[var(--color-text-faint)]">No courses yet — check back soon.</p>
      ) : (
        <div className="space-y-14">
          {sections.map(([name, entries]) => (
            <section key={name}>
              <SectionHeader name={name} count={entries.length} />
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {entries.map((course) => (
                  <CourseCard key={course.slug} course={course} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
