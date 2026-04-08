import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllDSAPatterns } from "@/lib/mdx/getAllContent";
import { PatternCard } from "@/components/dsa/PatternCard";
import { TierFilter } from "@/components/dsa/TierFilter";

export const metadata: Metadata = {
  title: "DSA",
  description: "Data structures and algorithms — organized by pattern. Learn to recognize signals, not memorize solutions.",
};

interface DSAPageProps {
  searchParams: Promise<{ tier?: string }>;
}

export default async function DSAPage({ searchParams }: DSAPageProps) {
  const { tier } = await searchParams;
  const allPatterns = getAllDSAPatterns();

  const filtered = tier
    ? allPatterns.filter((p) => p.frontmatter.tier === Number(tier))
    : allPatterns;

  const totalProblems = allPatterns.reduce((sum, p) => sum + p.problemCount, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <p className="mb-2 font-mono text-xs text-[var(--color-text-faint)]">$ ls patterns/</p>
        <h1 className="mb-3 font-mono text-3xl font-bold text-[var(--color-text-primary)]">
          DSA<span className="text-[var(--color-accent)]">_</span>
        </h1>
        <p className="text-[var(--color-text-muted)]">
          {allPatterns.length} patterns · {totalProblems} problems — learn to recognize signals, not memorize solutions.
        </p>
      </div>

      {/* Tier filter */}
      <div className="mb-8">
        <Suspense>
          <TierFilter current={tier} />
        </Suspense>
      </div>

      {filtered.length === 0 ? (
        <p className="text-[var(--color-text-faint)]">No patterns in this tier yet.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pattern) => (
            <PatternCard key={pattern.slug} pattern={pattern} />
          ))}
        </div>
      )}
    </div>
  );
}
