import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { getAllDSAPatterns, getAllDSAProblems } from "@/lib/mdx/getAllContent";
import { getDSAPatternBySlug } from "@/lib/mdx/getBySlug";
import { MDXContent } from "@/components/mdx/MDXContent";
import { PatternProblems } from "@/components/dsa/PatternProblems";

interface Props {
  params: Promise<{ pattern: string }>;
}

export async function generateStaticParams() {
  return getAllDSAPatterns().map((p) => ({ pattern: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pattern } = await params;
  const result = getDSAPatternBySlug(pattern);
  if (!result) return {};
  return {
    title: result.frontmatter.title,
    description: result.frontmatter.description,
  };
}

export default async function PatternPage({ params }: Props) {
  const { pattern } = await params;

  const result = getDSAPatternBySlug(pattern);
  if (!result) notFound();

  const { frontmatter, content } = result;

  const allProblems = getAllDSAProblems().filter((p) => p.patternSlug === pattern);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Back link */}
      <Link
        href="/dsa"
        className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-text-faint)] no-underline hover:text-[var(--color-text-muted)] hover:no-underline"
      >
        ← All Patterns
      </Link>

      {/* Pattern header */}
      <div
        className="mb-10 rounded-xl border p-6"
        style={{
          background: `${frontmatter.color}08`,
          borderColor: `${frontmatter.color}25`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="mb-1 flex items-center gap-3">
          <span
            className="rounded-full px-2.5 py-0.5 font-mono text-xs font-medium"
            style={{ background: `${frontmatter.color}15`, color: frontmatter.color }}
          >
            Tier {frontmatter.tier}
          </span>
          <span className="font-mono text-xs text-[var(--color-text-faint)]">
            {allProblems.length} {allProblems.length === 1 ? "problem" : "problems"}
          </span>
        </div>
        <h1
          className="mb-2 font-mono text-3xl font-bold"
          style={{ color: frontmatter.color }}
        >
          {frontmatter.title}
        </h1>
        <p className="mb-4 text-[var(--color-text-muted)]">{frontmatter.description}</p>

        {/* Skip to problems beacon */}
        <a
          href="#problems"
          className="inline-flex items-center gap-2 no-underline hover:no-underline group"
        >
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ backgroundColor: frontmatter.color }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: frontmatter.color }}
            />
          </span>
          <span
            className="font-mono text-xs transition-opacity group-hover:opacity-100 opacity-70"
            style={{ color: frontmatter.color }}
          >
            Skip to problems ↓
          </span>
        </a>
      </div>

      {/* Pattern write-up */}
      <div className="mb-12 max-w-3xl">
        <MDXContent source={content} />
      </div>

      {/* Problems */}
      <div id="problems" className="scroll-mt-20">
        <div className="mb-6 flex items-center justify-between border-b border-[var(--color-bg-border)] pb-3">
          <h2 className="font-mono text-sm font-semibold uppercase tracking-widest text-[var(--color-text-faint)]">
            Problems
          </h2>
        </div>

        <Suspense>
          <PatternProblems problems={allProblems} />
        </Suspense>
      </div>
    </div>
  );
}
