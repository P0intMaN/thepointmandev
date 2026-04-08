import type { MetadataRoute } from "next";
import { getAllBlogPosts, getAllCourses, getCourseLessons, getAllDSAProblems, getAllTags } from "@/lib/mdx/getAllContent";
import { getAllSeries } from "@/lib/mdx/getSeriesPosts";

export const dynamic = "force-static";

const BASE_URL = "https://thepointman.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/courses`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/dsa`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/tags`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.frontmatter.updated ?? post.frontmatter.date,
    changeFrequency: "monthly",
    priority: post.frontmatter.featured ? 0.9 : 0.7,
  }));

  const courseRoutes: MetadataRoute.Sitemap = getAllCourses().flatMap((course) => {
    const overview = {
      url: `${BASE_URL}/courses/${course.slug}`,
      lastModified: course.frontmatter.date,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
    const lessons = getCourseLessons(course.slug).map((lesson) => ({
      url: `${BASE_URL}/courses/${course.slug}/${lesson.slug}`,
      lastModified: lesson.frontmatter.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
    return [overview, ...lessons];
  });

  const dsaRoutes: MetadataRoute.Sitemap = getAllDSAProblems().map((p) => ({
    url: `${BASE_URL}/dsa/${p.slug}`,
    lastModified: p.frontmatter.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const tagRoutes: MetadataRoute.Sitemap = Object.keys(getAllTags()).map((tag) => ({
    url: `${BASE_URL}/tags/${encodeURIComponent(tag)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const seriesRoutes: MetadataRoute.Sitemap = Object.keys(getAllSeries()).map((series) => ({
    url: `${BASE_URL}/series/${series}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...courseRoutes,
    ...dsaRoutes,
    ...tagRoutes,
    ...seriesRoutes,
  ];
}
