import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About Pratheek Unni — software engineer, writer, and the person behind thepointman.dev.",
};

const sections = [
  {
    label: "Blog",
    color: "var(--color-accent)",
    desc: "Long-form technical articles. Deep dives, tutorials, and architectural discussions.",
    href: "/blog",
    cta: "BROWSE ARTICLES ▶",
  },
  {
    label: "Courses",
    color: "var(--color-warning)",
    desc: "Structured, multi-part learning paths you can follow end-to-end.",
    href: "/courses",
    cta: "VIEW COURSES ▶",
  },
  {
    label: "DSA",
    color: "var(--color-info)",
    desc: "Data structures and algorithms, explained with working code and complexity analysis.",
    href: "/dsa",
    cta: "SOLVE PROBLEMS ▶",
  },
];

const recommended = [
  { step: "01", label: "Start with DSA", desc: "Build your algorithmic foundation from scratch.", href: "/dsa", color: "var(--color-info)" },
  { step: "02", label: "System Design", desc: "Learn how to design scalable distributed systems.", href: "/courses/system-design-fundamentals", color: "var(--color-warning)" },
  { step: "03", label: "Java & Spring Boot", desc: "In-depth production-ready Java engineering articles.", href: "/blog?category=Java", color: "var(--color-accent)" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Header */}
      <header className="mb-12 border-b-2 border-[var(--color-bg-border)] pb-10">
        <p className="mb-3 font-pixel text-[7px] text-[var(--color-text-faint)]">$ whoami</p>
        <h1 className="mb-1 font-pixel text-base leading-relaxed">
          <span className="text-[var(--color-text-primary)]">thepointman</span>
          <span className="text-[var(--color-accent)]">.dev</span>
          <span
            className="inline-block w-[10px] h-[14px] bg-[var(--color-accent)] ml-[3px] align-middle"
            style={{ animation: "pixel-blink 1s steps(1) infinite" }}
          />
        </h1>
        <p className="mb-5 font-pixel text-[8px] text-[var(--color-text-faint)]">Pratheek Unni</p>
        <p className="mb-6 font-mono text-sm leading-relaxed text-[var(--color-text-muted)]">
          Senior software engineer. I write the kind of technical content I wish existed when I was
          learning — no hand-waving, no incomplete examples, no marketing fluff.
        </p>
        {/* Social links */}
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/P0intMaN"
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-btn border-[var(--color-bg-border)] px-3 py-1.5 font-mono text-xs text-[var(--color-text-faint)] no-underline hover:border-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:no-underline"
          >
            ⌥ github/P0intMaN
          </a>
          <a
            href="https://www.linkedin.com/in/pratheek-unni/"
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-btn border-[var(--color-bg-border)] px-3 py-1.5 font-mono text-xs text-[var(--color-text-faint)] no-underline hover:border-[var(--color-info)] hover:text-[var(--color-info)] hover:no-underline"
          >
            in pratheek-unni
          </a>
        </div>
      </header>

      {/* What you'll find */}
      <section className="mb-12">
        <p className="mb-6 font-pixel text-[8px] text-[var(--color-accent)]">// WHAT_YOU_FIND</p>
        <div className="space-y-3">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="pixel-card flex items-start gap-4 bg-[var(--color-bg-elevated)] p-5 no-underline hover:no-underline"
            >
              <span className="font-pixel text-[8px] shrink-0 mt-1" style={{ color: s.color }}>{s.label}</span>
              <div className="flex-1">
                <p className="font-mono text-sm text-[var(--color-text-muted)]">{s.desc}</p>
              </div>
              <span className="font-pixel text-[7px] self-center shrink-0" style={{ color: s.color }}>▶</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended path — jules.google style numbered steps */}
      <section className="mb-12">
        <p className="mb-6 font-pixel text-[8px] text-[var(--color-warning)]">// WHERE_TO_START</p>
        <div className="space-y-3">
          {recommended.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="pixel-card flex items-start gap-4 bg-[var(--color-bg-elevated)] p-5 no-underline hover:no-underline"
            >
              <span className="font-pixel text-[14px] shrink-0" style={{ color: item.color }}>
                {item.step}
              </span>
              <div>
                <p className="mb-1 font-pixel text-[8px]" style={{ color: item.color }}>{item.label}</p>
                <p className="font-mono text-sm text-[var(--color-text-muted)]">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section>
        <p className="mb-4 font-pixel text-[8px] text-[var(--color-text-faint)]">// PHILOSOPHY</p>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-[var(--color-text-muted)]">
          <p>
            Good engineering writing is rare. Most content either stops at &ldquo;hello world&rdquo; or
            drowns you in abstraction without showing the code. This blog tries to live in between:
            complete, working examples with real explanations of why they work.
          </p>
          <p>
            Every article shows the full implementation, discusses complexity, and explains the
            tradeoffs. When I say &ldquo;O(n log n)&rdquo;, I mean it — and I&apos;ll show you why.
          </p>
        </div>
      </section>
    </div>
  );
}
