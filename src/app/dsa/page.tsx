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
      <div className="mb-10">
        <h1 className="mb-2 font-mono text-3xl font-bold text-[var(--color-text-primary)]">
          DSA<span className="text-[var(--color-accent)]">_</span>
        </h1>
        <p className="text-[var(--color-text-muted)]">
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
        <p className="text-[var(--color-text-faint)]">No problems match this filter.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((problem) => (
            <DSACard key={problem.slug} problem={problem} />
          ))}
        </div>
      )}
    </div>
  );
}
