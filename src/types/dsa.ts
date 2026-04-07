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
  frontmatter: DSAFrontmatter;
  readingTime: string;
}

export interface DSAProblemWithContent extends DSAProblem {
  content: string;
}
