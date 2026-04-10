import Link from "next/link";
import type { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  lessonCount?: number;
}

const levelColors = {
  beginner:     "text-green-400 border-green-900 bg-green-950/30",
  intermediate: "text-amber-400 border-amber-900 bg-amber-950/30",
  advanced:     "text-red-400   border-red-900   bg-red-950/30",
};

const levelGlow = {
  beginner:     { shimmer: "via-[#4ade80]/60", glow: "rgba(74,222,128,0.07)",  border: "hover:border-[#4ade80]/40",  icon: "#4ade80" },
  intermediate: { shimmer: "via-[#fbbf24]/60", glow: "rgba(251,191,36,0.07)",  border: "hover:border-[#fbbf24]/40", icon: "#fbbf24" },
  advanced:     { shimmer: "via-[#f87171]/60", glow: "rgba(248,113,113,0.07)", border: "hover:border-[#f87171]/40", icon: "#f87171" },
};

// Large watermark icons — each one is meaningful for the level
const LevelIcon = ({ level }: { level: "beginner" | "intermediate" | "advanced" }) => {
  if (level === "beginner") return (
    // Open book — learning from scratch
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4zm0 14V13.31l2.5 1.5L11 13.31V18H6zm12 0h-5v-5h5v5zm0-7h-5V4h5v7z" />
    </svg>
  );

  if (level === "intermediate") return (
    // Code angle-brackets — hands-on coding
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
  );

  // advanced — lightning bolt: speed + mastery
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 2v11h3v9l7-12h-4l4-8z" />
    </svg>
  );
};

export function CourseCard({ course, lessonCount }: CourseCardProps) {
  const { frontmatter, slug } = course;
  const glow = levelGlow[frontmatter.level];

  return (
    <article
      className={`group relative flex flex-col gap-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-6 transition-all duration-300 ${glow.border}`}
    >
      {/* Top shimmer line */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${glow.shimmer} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      {/* Radial corner glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(ellipse at 80% 0%, ${glow.glow} 0%, transparent 65%)` }}
      />

      {/* ── Watermark icon — top-right, partially cropped ── */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
        style={{
          width: "11rem",
          height: "11rem",
          color: glow.icon,
          opacity: 0.10,
          filter: `drop-shadow(0 0 24px ${glow.icon})`,
        }}
      >
        <LevelIcon level={frontmatter.level} />
      </div>

      {/* Level + meta — sits on top of the watermark */}
      <div className="relative flex flex-wrap items-center gap-2">
        <span className={`rounded border px-2 py-0.5 font-mono text-xs ${levelColors[frontmatter.level]}`}>
          {frontmatter.level}
        </span>
        <span className="font-mono text-xs text-[var(--color-text-faint)]">
          {lessonCount ?? frontmatter.totalLessons} lessons
        </span>
      </div>

      {/* Title */}
      <Link
        href={`/courses/${slug}`}
        className="relative text-xl font-semibold leading-snug text-[var(--color-text-primary)] no-underline hover:text-[var(--color-accent)] hover:no-underline"
      >
        {frontmatter.title}
      </Link>

      {/* Description */}
      <p className="relative text-base leading-relaxed text-[var(--color-text-muted)]">
        {frontmatter.description}
      </p>

      <Link
        href={`/courses/${slug}`}
        className="relative mt-auto font-mono text-sm text-[var(--color-accent)] no-underline hover:text-[var(--color-accent-muted)] hover:no-underline"
      >
        Start course →
      </Link>
    </article>
  );
}
