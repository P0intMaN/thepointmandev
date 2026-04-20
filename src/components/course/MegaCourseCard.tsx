import React from "react";
import Link from "next/link";
import type { Course } from "@/types/course";

export function MegaCourseCard({ course }: { course: Course }) {
  const { frontmatter, slug } = course;
  const subCourses = frontmatter.subCourses ?? [];

  return (
    <Link
      href={`/courses/${slug}`}
      className="group relative block overflow-hidden rounded-[var(--radius-lg)] no-underline hover:no-underline"
    >
      {/* ── Animated gold border ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 rounded-[var(--radius-lg)]"
        style={{
          padding: "1.5px",
          background:
            "linear-gradient(90deg, #78350f, #d97706, #fef3c7, #fbbf24, #fef3c7, #d97706, #78350f)",
          backgroundSize: "300% auto",
          animation: "grail-shimmer 5s linear infinite",
        }}
      >
        <div
          className="h-full w-full rounded-[var(--radius-lg)]"
          style={{ background: "#0c0c0c" }}
        />
      </div>

      {/* ── Diagonal sweep (light reflection across the card) ────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[var(--radius-lg)]">
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: 0,
            width: "38%",
            height: "200%",
            background:
              "linear-gradient(to right, transparent, rgba(251,191,36,0.07), rgba(255,255,255,0.18), rgba(251,191,36,0.07), transparent)",
            animation: "grail-sweep 6s ease-in-out infinite",
          }}
        />
      </div>

      {/* ── Card body ────────────────────────────────────────────────────── */}
      <div className="relative flex flex-col gap-5 px-8 py-7 sm:flex-row sm:items-center sm:gap-10">
        {/* Left: label + title + description */}
        <div className="flex-1 min-w-0">
          <p
            className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "#d97706", opacity: 0.85 }}
          >
            Distinguished Engineer&apos;s Curriculum
          </p>

          {/* Shimmer title */}
          <h2
            className="mb-3 text-2xl font-bold leading-tight tracking-tight"
            style={{
              background:
                "linear-gradient(90deg, #f59e0b, #fef3c7, #fff, #fef3c7, #f59e0b)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "grail-shimmer 6s linear infinite",
            }}
          >
            {frontmatter.title}
          </h2>

          <p
            className="mb-5 text-sm leading-relaxed max-w-2xl"
            style={{ color: "rgba(183,177,177,0.75)" }}
          >
            {frontmatter.description}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex flex-col gap-0.5">
              <span
                className="font-mono text-base font-bold tabular-nums"
                style={{ color: "#fbbf24" }}
              >
                {subCourses.length}
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: "rgba(183,177,177,0.5)" }}
              >
                sub-courses
              </span>
            </div>

            <div
              className="h-8 w-px"
              style={{ background: "rgba(251,191,36,0.2)" }}
            />

            <div className="flex flex-col gap-0.5">
              <span
                className="font-mono text-base font-bold tabular-nums"
                style={{ color: "#fbbf24" }}
              >
                {frontmatter.totalLessons}
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: "rgba(183,177,177,0.5)" }}
              >
                lessons
              </span>
            </div>

            <div
              className="h-8 w-px"
              style={{ background: "rgba(251,191,36,0.2)" }}
            />

            <span
              className="font-mono text-sm font-semibold transition-opacity group-hover:opacity-80"
              style={{ color: "#f59e0b" }}
            >
              Begin the Grail →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
