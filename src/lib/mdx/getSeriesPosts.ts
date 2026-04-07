import { getAllBlogPosts } from "./getAllContent";
import type { BlogPost } from "@/types/blog";

export function getSeriesPosts(series: string): BlogPost[] {
  return getAllBlogPosts()
    .filter((p) => p.frontmatter.series === series)
    .sort((a, b) => (a.frontmatter.seriesPart ?? 0) - (b.frontmatter.seriesPart ?? 0));
}

export function getAllSeries(): Record<string, BlogPost[]> {
  const posts = getAllBlogPosts();
  const series: Record<string, BlogPost[]> = {};

  for (const post of posts) {
    if (post.frontmatter.series) {
      const key = post.frontmatter.series;
      if (!series[key]) series[key] = [];
      series[key].push(post);
    }
  }

  for (const key of Object.keys(series)) {
    series[key].sort(
      (a, b) => (a.frontmatter.seriesPart ?? 0) - (b.frontmatter.seriesPart ?? 0)
    );
  }

  return series;
}
