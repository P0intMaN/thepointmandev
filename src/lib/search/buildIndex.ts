/**
 * Run this as a postbuild script:
 *   node -r ts-node/register src/lib/search/buildIndex.ts
 * Or call buildSearchIndex() from next.config.ts instrumentation.
 *
 * For simplicity, we generate the index in a Next.js Route Handler.
 */
import { getAllBlogPosts, getAllDSAProblems } from "@/lib/mdx/getAllContent";

export interface SearchEntry {
  type: "blog" | "dsa";
  slug: string;
  patternSlug?: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
}

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const post of getAllBlogPosts()) {
    entries.push({
      type: "blog",
      slug: post.slug,
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      tags: post.frontmatter.tags,
      category: post.frontmatter.category,
    });
  }

  for (const problem of getAllDSAProblems()) {
    entries.push({
      type: "dsa",
      slug: problem.slug,
      patternSlug: problem.patternSlug,
      title: problem.frontmatter.title,
      description: problem.frontmatter.description,
      tags: problem.frontmatter.tags,
      category: problem.frontmatter.category,
    });
  }

  return entries;
}
