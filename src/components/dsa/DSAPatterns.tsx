"use client";

import { useSearchParams } from "next/navigation";
import { PatternCard } from "./PatternCard";
import { TierFilter } from "./TierFilter";
import type { DSAPattern } from "@/types/dsa";

interface DSAPatternsProps {
  patterns: DSAPattern[];
}

export function DSAPatterns({ patterns }: DSAPatternsProps) {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier") ?? undefined;

  const filtered = tier
    ? patterns.filter((p) => p.frontmatter.tier === Number(tier))
    : patterns;

  return (
    <>
      <div className="mb-8">
        <TierFilter current={tier} />
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
    </>
  );
}
