import Link from "next/link";
import { getAllCourses, getAllDSAProblems } from "@/lib/mdx/getAllContent";
import { CourseCard } from "@/components/course/CourseCard";
import { DSACard } from "@/components/dsa/DSACard";

export default function Home() {
  const courses = getAllCourses().slice(0, 3);
  const dsaProblems = getAllDSAProblems().slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <section className="mb-20">
        <div className="mb-3 font-mono text-xs text-[var(--color-text-faint)]">
          $ whoami
        </div>
        <h1 className="mb-4 font-mono text-5xl font-black tracking-tight sm:text-6xl">
          <span className="text-[var(--color-text-primary)]">thepointman</span>
          <span className="text-[var(--color-accent)]">.dev_</span>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)]">
          In-depth courses, structured learning paths, and algorithm breakdowns for software engineers who
          care about fundamentals.
        </p>
      </section>

      {/* Courses */}
      {courses.length > 0 && (
        <section className="mb-16">
          <SectionHeader label="Courses" href="/courses" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* DSA */}
      {dsaProblems.length > 0 && (
        <section className="mb-16">
          <SectionHeader label="Algorithms & Data Structures" href="/dsa" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dsaProblems.map((problem) => (
              <DSACard key={problem.slug} problem={problem} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

function SectionHeader({ label, href }: { label: string; href: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="shrink-0 font-mono text-xs text-[var(--color-accent)]">{"// "}</span>
      <h2 className="shrink-0 font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-text-faint)]">
        {label}
      </h2>
      <div className="h-px flex-1 bg-[var(--color-bg-border)]" />
      <Link
        href={href}
        className="shrink-0 font-mono text-xs text-[var(--color-text-faint)] no-underline hover:text-[var(--color-accent)] hover:no-underline"
      >
        view all →
      </Link>
    </div>
  );
}
