import Link from "next/link";
import { DifficultyBadge } from "./DifficultyBadge";
import { TagBadge } from "@/components/blog/TagBadge";
import type { DSAProblem } from "@/types/dsa";

interface DSACardProps {
  problem: DSAProblem;
}

export function DSACard({ problem }: DSACardProps) {
  const { frontmatter, slug, patternSlug } = problem;

  return (
    <article className="group relative flex flex-col gap-3 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-5 transition-all duration-300 hover:border-[#67e8f9]/40">
      {/* Shimmer — cyan for DSA */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#67e8f9]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* Corner glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(103,232,249,0.06) 0%, transparent 65%)" }}
      />

      {/* Difficulty + category */}
      <div className="flex items-center gap-3">
        <DifficultyBadge difficulty={frontmatter.difficulty} />
        <span className="font-mono text-sm text-[var(--color-text-faint)]">
          {frontmatter.category}
        </span>
        {frontmatter.leetcodeNumber && (
          <a
            href={`https://leetcode.com/problems/${frontmatter.leetcodeSlug ?? slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 font-mono text-xs text-[var(--color-text-faint)] no-underline transition-colors hover:text-[#67e8f9] hover:no-underline"
          >
            LeetCode #{frontmatter.leetcodeNumber}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-50">
              <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}
      </div>

      {/* Title */}
      <Link
        href={`/dsa/${patternSlug}/${slug}`}
        className="text-lg font-semibold text-[var(--color-text-primary)] no-underline hover:text-[#67e8f9] hover:no-underline"
      >
        {frontmatter.title}
      </Link>

      {/* Description */}
      <p className="text-base text-[var(--color-text-muted)]">{frontmatter.description}</p>

      {/* Complexity */}
      <div className="flex gap-3 font-mono text-xs">
        <span className="text-[var(--color-text-faint)]">
          time: <span className="text-green-400">{frontmatter.timeComplexity}</span>
        </span>
        <span className="text-[var(--color-text-faint)]">
          space: <span className="text-cyan-400">{frontmatter.spaceComplexity}</span>
        </span>
      </div>

      {/* Tags */}
      {frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {frontmatter.tags.slice(0, 4).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  );
}
