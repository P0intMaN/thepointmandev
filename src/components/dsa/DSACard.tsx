import Link from "next/link";
import { DifficultyBadge } from "./DifficultyBadge";
import { TagBadge } from "@/components/blog/TagBadge";
import type { DSAProblem } from "@/types/dsa";

interface DSACardProps {
  problem: DSAProblem;
}

export function DSACard({ problem }: DSACardProps) {
  const { frontmatter, slug } = problem;

  return (
    <article className="pixel-card flex flex-col gap-3 bg-[var(--color-bg-elevated)] p-5">
      {/* Difficulty + category */}
      <div className="flex items-center gap-3">
        <DifficultyBadge difficulty={frontmatter.difficulty} />
        <span className="font-pixel text-[7px] text-[var(--color-info)]">
          {frontmatter.category}
        </span>
        {frontmatter.leetcodeNumber && (
          <span className="ml-auto font-mono text-xs text-[var(--color-text-faint)]">
            #{frontmatter.leetcodeNumber}
          </span>
        )}
      </div>

      {/* Title */}
      <Link
        href={`/dsa/${slug}`}
        className="font-mono text-base font-semibold text-[var(--color-text-primary)] no-underline hover:text-[var(--color-info)] hover:no-underline"
      >
        {frontmatter.title}
      </Link>

      {/* Description */}
      <p className="font-mono text-sm text-[var(--color-text-muted)]">{frontmatter.description}</p>

      {/* Complexity */}
      <div className="flex gap-4 font-mono text-xs">
        <span className="text-[var(--color-text-faint)]">
          T: <span className="text-[var(--color-accent)]">{frontmatter.timeComplexity}</span>
        </span>
        <span className="text-[var(--color-text-faint)]">
          S: <span className="text-[var(--color-info)]">{frontmatter.spaceComplexity}</span>
        </span>
      </div>

      {/* Tags */}
      {frontmatter.tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {frontmatter.tags.slice(0, 4).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  );
}
