import { z } from "zod";

export const BlogFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  updated: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string(),
  series: z.string().optional(),
  seriesPart: z.number().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  author: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>;

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  readingTime: string;
  excerpt: string;
}

export interface BlogPostWithContent extends BlogPost {
  content: string;
}
