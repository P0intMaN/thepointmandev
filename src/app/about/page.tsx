import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About Pratheek Unni — software engineer, writer, and the person behind thepointman.dev.",
};

const recommendedReading = [
  {
    category: "Start with DSA",
    description: "Build your algorithmic foundation from scratch.",
    href: "/dsa",
    label: "Browse problems →",
  },
  {
    category: "System Design",
    description: "Learn how to design scalable distributed systems.",
    href: "/courses/system-design-fundamentals",
    label: "Take the course →",
  },
  {
    category: "Java & Spring Boot",
    description: "Spring Boot from first principles — dependency injection, auto-configuration, and the full production stack.",
    href: "/courses/spring-boot",
    label: "Take the course →",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Header */}
      <header className="mb-12 border-b border-[var(--color-bg-border)] pb-10">
        <p className="mb-2 font-mono text-xs text-[var(--color-text-faint)]">$ whoami</p>
        <h1 className="mb-1 font-mono text-4xl font-black">
          <span className="text-[var(--color-text-primary)]">thepointman</span>
          <span className="text-[var(--color-accent)]">.dev_</span>
        </h1>
        <p className="mb-5 font-mono text-sm text-[var(--color-text-faint)]">Pratheek Unni</p>
        <p className="mb-5 text-lg leading-relaxed text-[var(--color-text-muted)]">
          Senior software engineer. I write the kind of technical content I wish existed when I was
          learning — no hand-waving, no incomplete examples, no marketing fluff.
        </p>
        {/* Social links */}
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/P0intMaN"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 font-mono text-xs text-[var(--color-text-faint)] no-underline transition-colors hover:border-[var(--color-text-faint)] hover:text-[var(--color-text-secondary)] hover:no-underline"
          >
            <span>⌥</span> github/P0intMaN
          </a>
          <a
            href="https://www.linkedin.com/in/pratheek-unni/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 font-mono text-xs text-[var(--color-text-faint)] no-underline transition-colors hover:border-[var(--color-text-faint)] hover:text-[#0a66c2] hover:no-underline"
          >
            <span>in</span> pratheek-unni
          </a>
        </div>
      </header>

      {/* What you'll find */}
      <section className="mb-12">
        <h2 className="mb-6 font-mono text-sm font-semibold uppercase tracking-widest text-[var(--color-text-faint)]">
          What you&apos;ll find here
        </h2>
        <div className="space-y-4">
          {[
            ["Courses", "Structured, multi-part learning paths you can follow end-to-end.", "/courses"],
            ["DSA", "Data structures and algorithms, explained with working code and complexity analysis.", "/dsa"],
            ["Roadmap", "A curated learning path from fundamentals to senior-level interviews.", "/roadmap"],
          ].map(([title, desc, href]) => (
            <Link
              key={href}
              href={href}
              className="flex gap-4 rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-5 no-underline transition-colors hover:border-[var(--color-text-faint)] hover:no-underline"
            >
              <div>
                <p className="mb-1 font-mono text-base font-semibold text-[var(--color-accent)]">
                  {title}
                </p>
                <p className="text-base text-[var(--color-text-muted)]">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Where to start */}
      <section className="mb-12">
        <h2 className="mb-6 font-mono text-sm font-semibold uppercase tracking-widest text-[var(--color-text-faint)]">
          Where to start
        </h2>
        <div className="space-y-4">
          {recommendedReading.map((item) => (
            <div
              key={item.href}
              className="rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-5"
            >
              <p className="mb-1 font-mono text-sm text-[var(--color-text-faint)]">{item.category}</p>
              <p className="mb-3 text-base text-[var(--color-text-muted)]">{item.description}</p>
              <Link
                href={item.href}
                className="font-mono text-sm text-[var(--color-accent)] no-underline hover:text-[var(--color-accent-muted)] hover:no-underline"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-[var(--color-text-faint)]">
          Philosophy
        </h2>
        <div className="space-y-4 text-[var(--color-text-muted)]">
          <p>
            Good engineering writing is rare. Most content either stops at &ldquo;hello world&rdquo; or
            drowns you in abstraction without showing the code. This site tries to live in between:
            complete, working examples with real explanations of why they work.
          </p>
          <p>
            Every course and write-up shows the full implementation, discusses complexity, and explains
            the tradeoffs. When I say &ldquo;O(n log n)&rdquo;, I mean it — and I&apos;ll show you why.
          </p>
        </div>
      </section>
    </div>
  );
}
