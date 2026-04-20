import Link from "next/link";
import { getAllCourses, getAllDSAProblems } from "@/lib/mdx/getAllContent";
import { CourseCard } from "@/components/course/CourseCard";
import { DSACard } from "@/components/dsa/DSACard";

export default function Home() {
  const allCourses = getAllCourses();
  const courses = allCourses.filter((c) => !c.frontmatter.isMegaCourse).slice(0, 3);
  const dsaProblems = getAllDSAProblems().slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Hero — full width */}
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

      {/* Main content + sidebar */}
      <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-12">

        {/* ── Left: main content ───────────────────────────────────────── */}
        <div>
          {courses.length > 0 && (
            <section className="mb-16">
              <SectionHeader label="Courses" href="/courses" />
              <div className="grid gap-6 sm:grid-cols-2">
                {courses.map((course) => (
                  <CourseCard key={course.slug} course={course} />
                ))}
              </div>
            </section>
          )}

          {dsaProblems.length > 0 && (
            <section className="mb-16">
              <SectionHeader label="Algorithms & Data Structures" href="/dsa" />
              <div className="grid gap-4 sm:grid-cols-2">
                {dsaProblems.map((problem) => (
                  <DSACard key={problem.slug} problem={problem} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Right: Holy Grail ad ─────────────────────────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <HolyGrailAd />
          </div>
        </aside>

      </div>
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

function HolyGrailAd() {
  return (
    <Link
      href="/courses/holy-grail"
      className="group relative block overflow-hidden rounded-[var(--radius-lg)] no-underline hover:no-underline"
    >
      {/* Animated gold border */}
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
        <div className="h-full w-full rounded-[var(--radius-lg)]" style={{ background: "#0c0c0c" }} />
      </div>

      {/* Diagonal sweep */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[var(--radius-lg)]">
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: 0,
            width: "45%",
            height: "200%",
            background:
              "linear-gradient(to right, transparent, rgba(251,191,36,0.06), rgba(255,255,255,0.14), rgba(251,191,36,0.06), transparent)",
            animation: "grail-sweep 6s ease-in-out infinite",
          }}
        />
      </div>

      {/* HOT badge */}
      <div className="relative px-5 pt-5 pb-0">
        <span
          className="inline-flex items-center gap-1.5 rounded font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5"
          style={{ background: "rgba(251,191,36,0.12)", color: "#f59e0b" }}
        >
          <span style={{ fontSize: "11px" }}>🔥</span> Featured
        </span>
      </div>

      {/* Book illustration */}
      <div className="relative flex justify-center px-5 py-5">
        <BookSVG />
      </div>

      {/* Text */}
      <div className="relative px-5 pb-6">
        <p
          className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "#d97706", opacity: 0.75 }}
        >
          The Engineering Cookbook
        </p>
        <p
          className="mb-3 text-sm font-semibold leading-snug"
          style={{ color: "#fef3c7" }}
        >
          The entire curriculum, written as a course. From transistors to lock-free data structures.
        </p>
        <span
          className="font-mono text-xs font-semibold transition-opacity group-hover:opacity-70"
          style={{ color: "#f59e0b" }}
        >
          Begin the Grail →
        </span>
      </div>
    </Link>
  );
}

function BookSVG() {
  return (
    <svg
      viewBox="0 0 160 180"
      width="140"
      height="158"
      fill="none"
      aria-hidden
      style={{ filter: "drop-shadow(0 0 18px rgba(251,191,36,0.25))" }}
    >
      <defs>
        <linearGradient id="cover-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="spine-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0c0c0c" />
          <stop offset="100%" stopColor="#1a1209" />
        </linearGradient>
      </defs>

      {/* Spine (left) */}
      <rect x="8" y="16" width="18" height="148" rx="3" fill="url(#spine-grad)" stroke="#d97706" strokeWidth="1.2" />
      <line x1="26" y1="20" x2="26" y2="160" stroke="#78350f" strokeWidth="0.5" />

      {/* Cover (front face) */}
      <rect x="26" y="12" width="126" height="156" rx="3" fill="#12100a" stroke="#f59e0b" strokeWidth="1.4" />

      {/* Cover shine overlay */}
      <rect x="26" y="12" width="126" height="60" rx="3" fill="url(#cover-top)" />

      {/* Decorative border inside cover */}
      <rect x="33" y="19" width="112" height="142" rx="2" fill="none" stroke="#d97706" strokeWidth="0.6" opacity="0.4" />

      {/* Top ornament line */}
      <line x1="50" y1="38" x2="136" y2="38" stroke="#f59e0b" strokeWidth="0.8" opacity="0.5" />
      <line x1="50" y1="41" x2="136" y2="41" stroke="#f59e0b" strokeWidth="0.3" opacity="0.3" />

      {/* Crown / crest icon */}
      <path
        d="M89 52 L93 62 L100 57 L96 68 L82 68 L78 57 L85 62 Z"
        fill="#f59e0b"
        opacity="0.85"
      />
      <circle cx="78" cy="56" r="2" fill="#fbbf24" />
      <circle cx="89" cy="51" r="2" fill="#fbbf24" />
      <circle cx="100" cy="56" r="2" fill="#fbbf24" />

      {/* Title */}
      <text x="89" y="88" textAnchor="middle" fill="#fef3c7" fontSize="11" fontFamily="monospace" fontWeight="700" letterSpacing="1">THE</text>
      <text x="89" y="102" textAnchor="middle" fill="#f59e0b" fontSize="13" fontFamily="monospace" fontWeight="700" letterSpacing="2">HOLY</text>
      <text x="89" y="116" textAnchor="middle" fill="#f59e0b" fontSize="13" fontFamily="monospace" fontWeight="700" letterSpacing="2">GRAIL</text>

      {/* Divider */}
      <line x1="55" y1="124" x2="123" y2="124" stroke="#d97706" strokeWidth="0.7" opacity="0.5" />

      {/* Author */}
      <text x="89" y="138" textAnchor="middle" fill="#d97706" fontSize="7.5" fontFamily="monospace" opacity="0.65" letterSpacing="0.5">thepointman.dev</text>

      {/* Bottom ornament */}
      <line x1="50" y1="148" x2="136" y2="148" stroke="#f59e0b" strokeWidth="0.3" opacity="0.3" />
      <line x1="50" y1="150" x2="136" y2="150" stroke="#f59e0b" strokeWidth="0.8" opacity="0.5" />

      {/* Page edges (right side) */}
      <line x1="152" y1="16" x2="152" y2="164" stroke="#2a1f0a" strokeWidth="3" />
      <line x1="150" y1="16" x2="150" y2="164" stroke="#1a1209" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}
