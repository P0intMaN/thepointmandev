import React from "react";
import Link from "next/link";
import type { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
}

// Named watermark icons — assigned per course, falling back to level default
const icons: Record<string, React.ReactNode> = {
  book: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4zm0 14V13.31l2.5 1.5L11 13.31V18H6zm12 0h-5v-5h5v5zm0-7h-5V4h5v7z" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
  ),
  lightning: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 2v11h3v9l7-12h-4l4-8z" />
    </svg>
  ),
  tree: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <line x1="12" y1="3.8"  x2="6"  y2="8.2"  stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="12" y1="3.8"  x2="18" y2="8.2"  stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="6"  y1="11.2" x2="3"  y2="15.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="6"  y1="11.2" x2="9"  y2="15.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="18" y1="11.2" x2="15" y2="15.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="18" y1="11.2" x2="21" y2="15.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"/>
      <circle cx="12" cy="2.5"  r="2"   fill="currentColor"/>
      <circle cx="6"  cy="9.5"  r="1.8" fill="currentColor"/>
      <circle cx="18" cy="9.5"  r="1.8" fill="currentColor"/>
      <circle cx="3"  cy="17"   r="1.4" fill="currentColor"/>
      <circle cx="9"  cy="17"   r="1.4" fill="currentColor"/>
      <circle cx="15" cy="17"   r="1.4" fill="currentColor"/>
      <circle cx="21" cy="17"   r="1.4" fill="currentColor"/>
    </svg>
  ),
  array: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 3h4v4H3zm0 7h4v4H3zm0 7h4v4H3zm7-14h4v4h-4zm0 7h4v4h-4zm0 7h4v4h-4zm7-14h4v4h-4zm0 7h4v4h-4zm0 7h4v4h-4z"/>
    </svg>
  ),
  network: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M15 20a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm-6 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm-6 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0zM12 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0zM3 10a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm16 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"/>
      <path d="M13 4.5l6 5M11 4.5l-6 5M4 11l4.5 8M12 5v14M19.5 11l-4.5 8" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  funnel: (
    // Funnel / filter — filtering excess requests
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 4h18l-7 9v7l-4-2V13L3 4z"/>
    </svg>
  ),
  leaf: (
    // Spring leaf — Java / Spring Boot courses
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 22C8 18 4 14 4 9a8 8 0 0 1 16 0c0 5-4 9-8 13z"/>
      <path d="M12 22V10" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity=".4"/>
    </svg>
  ),
  container: (
    // Stacked container layers — Docker / containers courses
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="2" y="15" width="20" height="5" rx="1.5" fill="currentColor"/>
      <rect x="2" y="9"  width="20" height="5" rx="1.5" fill="currentColor" opacity=".65"/>
      <rect x="2" y="3"  width="20" height="5" rx="1.5" fill="currentColor" opacity=".3"/>
    </svg>
  ),
  chip: (
    // CPU / processor — JVM internals courses
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="7" y="7" width="10" height="10" rx="1.5"/>
      <path d="M9 4v3M12 4v3M15 4v3M9 17v3M12 17v3M15 17v3M4 9h3M4 12h3M4 15h3M17 9h3M17 12h3M17 15h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  threads: (
    // Interleaved threads — concurrency courses
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 6 Q8 6 8 12 Q8 18 13 18 Q18 18 21 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      <path d="M3 18 Q8 18 8 12 Q8 6 13 6 Q18 6 21 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".55"/>
      <circle cx="3"  cy="6"  r="1.5" fill="currentColor"/>
      <circle cx="21" cy="18" r="1.5" fill="currentColor"/>
      <circle cx="3"  cy="18" r="1.5" fill="currentColor" opacity=".55"/>
      <circle cx="21" cy="6"  r="1.5" fill="currentColor" opacity=".55"/>
    </svg>
  ),
  database: (
    // Cylinder — database / data access courses
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <ellipse cx="12" cy="6" rx="8" ry="3"/>
      <path d="M4 6v12c0 1.657 3.582 3 8 3s8-1.343 8-3V6" fill="currentColor" opacity=".35"/>
      <ellipse cx="12" cy="12" rx="8" ry="3" opacity=".6"/>
    </svg>
  ),
  test: (
    // Beaker / test tube — testing courses
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9 3h6v8.5l3.5 6.5A2 2 0 0 1 16.76 21H7.24A2 2 0 0 1 5.5 18L9 11.5V3z" opacity=".3"/>
      <path d="M9 3h6M5.5 18l3.5-6.5h6L18.5 18A2 2 0 0 1 16.76 21H7.24A2 2 0 0 1 5.5 18z"/>
    </svg>
  ),
  wave: (
    // Sine wave — reactive / streaming courses
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M2 12 Q4 4 7 12 Q10 20 13 12 Q16 4 19 12 Q21 17 22 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  ),
};

const levelDefault: Record<string, string> = {
  beginner: "book",
  intermediate: "code",
  advanced: "lightning",
};

const CourseIcon = ({ icon, level }: { icon?: string; level: string }) => {
  const key = icon ?? levelDefault[level] ?? "code";
  return <>{icons[key] ?? icons.code}</>;
};

export function CourseCard({ course }: CourseCardProps) {
  const { frontmatter, slug } = course;
  const accent = frontmatter.accent ?? "#4ade80";

  return (
    <article
      className="group relative flex flex-col gap-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-6 transition-all duration-300 hover:border-[var(--ca)]"
      style={{ "--ca": accent } as React.CSSProperties}
    >
      {/* Top shimmer line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
      />

      {/* Radial corner glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(ellipse at 80% 0%, ${accent}18 0%, transparent 65%)` }}
      />

      {/* Watermark icon — bleeds off top-right */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
        style={{
          width: "11rem",
          height: "11rem",
          color: accent,
          opacity: 0.12,
          filter: `drop-shadow(0 0 24px ${accent})`,
        }}
      >
        <CourseIcon icon={frontmatter.icon} level={frontmatter.level} />
      </div>

      {/* Step badge — top-left */}
      {frontmatter.order != null && (
        <div className="relative flex items-center gap-2">
          <span
            className="font-mono text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded"
            style={{ color: accent, background: `${accent}18` }}
          >
            Step {frontmatter.order}
          </span>
          {(!frontmatter.prerequisites || frontmatter.prerequisites.length === 0) && (
            <span className="font-mono text-[10px] text-[var(--color-accent)] uppercase tracking-widest opacity-70">
              entry point
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <Link
        href={`/courses/${slug}`}
        className="relative mt-auto text-xl font-semibold leading-snug text-[var(--color-text-primary)] no-underline hover:text-[var(--ca)] hover:no-underline"
      >
        {frontmatter.title}
      </Link>

      {/* CTA */}
      <Link
        href={`/courses/${slug}`}
        className="relative font-mono text-sm no-underline hover:opacity-80 hover:no-underline"
        style={{ color: accent }}
      >
        Start course →
      </Link>
    </article>
  );
}
