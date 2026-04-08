import { z } from "zod";

export const DSAFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  tags: z.array(z.string()).default([]),
  category: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  timeComplexity: z.string(),
  spaceComplexity: z.string(),
  companies: z.array(z.string()).optional(),
  leetcodeNumber: z.number().optional(),
  draft: z.boolean().default(false),
});

export type DSAFrontmatter = z.infer<typeof DSAFrontmatterSchema>;

export interface DSAProblem {
  slug: string;
  patternSlug: string;
  frontmatter: DSAFrontmatter;
  readingTime: string;
}

export interface DSAProblemWithContent extends DSAProblem {
  content: string;
}

// ── Pattern ────────────────────────────────────────────────────
export const DSAPatternFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  signal: z.string(),
  gotchas: z.string(),
  color: z.string(),        // primary accent, e.g. "#4ade80"
  colorDim: z.string(),     // dark background tint, e.g. "#052e16"
  colorBorder: z.string(),  // border color, e.g. "#16a34a"
  icon: z.string(),         // key used to look up SVG in PatternCard
  order: z.number(),        // display order on /dsa
  tier: z.number(),         // 1 | 2 | 3
  draft: z.boolean().default(false),
});

export type DSAPatternFrontmatter = z.infer<typeof DSAPatternFrontmatterSchema>;

export interface DSAPattern {
  slug: string;             // folder name, e.g. "arrays"
  frontmatter: DSAPatternFrontmatter;
  content: string;          // MDX body (signal write-up, gotchas prose)
  problemCount: number;
}
