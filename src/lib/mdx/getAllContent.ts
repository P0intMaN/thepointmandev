import { cache } from "react";
import fs from "fs";
import path from "path";
import { parseFrontmatter } from "./parseFrontmatter";
import { BlogFrontmatterSchema, type BlogPost } from "@/types/blog";
import { DSAFrontmatterSchema, type DSAProblem } from "@/types/dsa";
import { CourseFrontmatterSchema, LessonFrontmatterSchema, type Course, type Lesson } from "@/types/course";
import { estimateReadingTime, getExcerpt } from "@/lib/readingTime";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function readMdxFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

// ── Blog posts ─────────────────────────────────────────────────
export const getAllBlogPosts = cache((): BlogPost[] => {
  const blogDir = path.join(CONTENT_ROOT, "blog");
  if (!fs.existsSync(blogDir)) return [];

  const slugs = fs.readdirSync(blogDir);
  const posts: BlogPost[] = [];

  for (const slug of slugs) {
    const slugPath = path.join(blogDir, slug);
    const stat = fs.statSync(slugPath);

    if (stat.isDirectory()) {
      const indexPath = path.join(slugPath, "index.mdx");
      if (!fs.existsSync(indexPath)) continue;
      const source = readMdxFile(indexPath);
      const { data: frontmatter, content } = parseFrontmatter(source, BlogFrontmatterSchema, indexPath);
      if (frontmatter.draft) continue;
      posts.push({
        slug,
        frontmatter,
        readingTime: estimateReadingTime(content),
        excerpt: frontmatter.description || getExcerpt(content),
      });
    } else if (slug.endsWith(".mdx")) {
      const source = readMdxFile(slugPath);
      const { data: frontmatter, content } = parseFrontmatter(source, BlogFrontmatterSchema, slugPath);
      if (frontmatter.draft) continue;
      const postSlug = slug.replace(/\.mdx$/, "");
      posts.push({
        slug: postSlug,
        frontmatter,
        readingTime: estimateReadingTime(content),
        excerpt: frontmatter.description || getExcerpt(content),
      });
    }
  }

  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
});

// ── DSA problems ───────────────────────────────────────────────
export const getAllDSAProblems = cache((): DSAProblem[] => {
  const dsaDir = path.join(CONTENT_ROOT, "dsa");
  if (!fs.existsSync(dsaDir)) return [];

  const problems: DSAProblem[] = [];

  function scanDir(dir: string) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const entryPath = path.join(dir, entry);
      const stat = fs.statSync(entryPath);
      if (stat.isDirectory()) {
        scanDir(entryPath);
      } else if (entry.endsWith(".mdx")) {
        const source = readMdxFile(entryPath);
        const { data: frontmatter, content } = parseFrontmatter(source, DSAFrontmatterSchema, entryPath);
        if (frontmatter.draft) continue;
        const slug = entry.replace(/\.mdx$/, "");
        problems.push({
          slug,
          frontmatter,
          readingTime: estimateReadingTime(content),
        });
      }
    }
  }

  scanDir(dsaDir);
  return problems.sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title));
});

// ── Courses ────────────────────────────────────────────────────
export const getAllCourses = cache((): Course[] => {
  const coursesDir = path.join(CONTENT_ROOT, "courses");
  if (!fs.existsSync(coursesDir)) return [];

  const courses: Course[] = [];
  const courseSlugs = fs.readdirSync(coursesDir);

  for (const slug of courseSlugs) {
    const metaPath = path.join(coursesDir, slug, "_meta.mdx");
    if (!fs.existsSync(metaPath)) continue;
    const source = readMdxFile(metaPath);
    const { data: frontmatter } = parseFrontmatter(source, CourseFrontmatterSchema, metaPath);
    if (frontmatter.draft) continue;
    courses.push({ slug, frontmatter });
  }

  return courses.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
});

export const getCourseLessons = cache((courseSlug: string): Lesson[] => {
  const courseDir = path.join(CONTENT_ROOT, "courses", courseSlug);
  if (!fs.existsSync(courseDir)) return [];

  const lessons: Lesson[] = [];
  const files = fs.readdirSync(courseDir).filter((f) => f.endsWith(".mdx") && f !== "_meta.mdx");

  for (const file of files) {
    const filePath = path.join(courseDir, file);
    const source = readMdxFile(filePath);
    const { data: frontmatter } = parseFrontmatter(source, LessonFrontmatterSchema, filePath);
    if (frontmatter.draft) continue;
    lessons.push({
      slug: file.replace(/\.mdx$/, ""),
      courseSlug,
      frontmatter,
    });
  }

  return lessons.sort((a, b) => a.frontmatter.lessonNumber - b.frontmatter.lessonNumber);
});

// ── Tags aggregation ───────────────────────────────────────────
export const getAllTags = cache((): Record<string, number> => {
  const posts = getAllBlogPosts();
  const dsa = getAllDSAProblems();
  const counts: Record<string, number> = {};

  for (const post of [...posts]) {
    for (const tag of post.frontmatter.tags) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  for (const problem of dsa) {
    for (const tag of problem.frontmatter.tags) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  return counts;
});
