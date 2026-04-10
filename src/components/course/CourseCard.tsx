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
