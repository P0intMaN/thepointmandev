"use client";

import { useSearchParams } from "next/navigation";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { DSACard } from "./DSACard";
import type { DSAProblem } from "@/types/dsa";

interface PatternProblemsProps {
  problems: DSAProblem[];
}

export function PatternProblems({ problems }: PatternProblemsProps) {
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag") ?? undefined;

  const difficulties = ["easy", "medium", "hard"];
  const filtered = tag ? problems.filter((p) => p.frontmatter.difficulty === tag) : problems;

  return (
    <>
      <div className="mb-6">
        <CategoryFilter categories={[]} tags={difficulties} currentTag={tag} />
      </div>

      {filtered.length === 0 ? (
        <p className="text-[var(--color-text-faint)]">No problems match this filter.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((problem) => (
            <DSACard key={`${problem.patternSlug}-${problem.slug}`} problem={problem} />
          ))}
        </div>
      )}
    </>
  );
}
