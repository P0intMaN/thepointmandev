import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllDSAPatterns } from "@/lib/mdx/getAllContent";
import { DSAPatterns } from "@/components/dsa/DSAPatterns";

export const metadata: Metadata = {
  title: "DSA",
  description: "Data structures and algorithms — organized by pattern. Learn to recognize signals, not memorize solutions.",
};

export default function DSAPage() {
  const allPatterns = getAllDSAPatterns();
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

      <Suspense>
        <DSAPatterns patterns={allPatterns} />
      </Suspense>
    </div>
  );
}
