import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllDSAProblems } from "@/lib/mdx/getAllContent";
import { DSACard } from "@/components/dsa/DSACard";
import { CategoryFilter } from "@/components/blog/CategoryFilter";

export const metadata: Metadata = {
  title: "DSA",
  description: "Data structures and algorithms problems with in-depth explanations and complexity analysis.",
};

interface DSAPageProps {
  searchParams: Promise<{ category?: string; difficulty?: string }>;
}

export default async function DSAPage({ searchParams }: DSAPageProps) {
  const { category, difficulty } = await searchParams;
  const allProblems = getAllDSAProblems();

  const filtered = allProblems.filter((p) => {
    if (category && p.frontmatter.category !== category) return false;
    if (difficulty && p.frontmatter.difficulty !== difficulty) return false;
    return true;
  });

  const categories = [...new Set(allProblems.map((p) => p.frontmatter.category))].sort();
  const difficulties = ["easy", "medium", "hard"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 border-b-2 border-[var(--color-bg-border)] pb-8">
        <p className="mb-3 font-pixel text-[7px] text-[var(--color-info)]">// DSA</p>
        <h1 className="mb-3 font-pixel text-lg leading-relaxed text-[var(--color-text-primary)]">
          Algorithms
          <span
            className="inline-block w-[12px] h-[18px] bg-[var(--color-info)] ml-[4px] align-middle"
            style={{ animation: "pixel-blink 1s steps(1) infinite" }}
          />
        </h1>
        <p className="font-mono text-sm text-[var(--color-text-muted)]">
          {allProblems.length} problems — data structures, algorithms, and complexity analysis.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-3">
        <Suspense>
          <CategoryFilter
            categories={categories}
            tags={difficulties}
            currentCategory={category}
            currentTag={difficulty}
          />
        </Suspense>
      </div>

      {filtered.length === 0 ? (
        <div className="border-2 border-[var(--color-bg-border)] p-8 text-center">
          <p className="font-pixel text-[8px] text-[var(--color-text-faint)]">NO RESULTS FOUND</p>
        </div>
      ) : (
        <>
          <p className="mb-4 font-pixel text-[7px] text-[var(--color-text-faint)]">
            {filtered.length} RESULTS
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((problem) => (
              <DSACard key={problem.slug} problem={problem} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
