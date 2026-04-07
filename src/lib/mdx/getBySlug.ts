import fs from "fs";
import path from "path";
import { parseFrontmatter } from "./parseFrontmatter";
import { BlogFrontmatterSchema, type BlogFrontmatter } from "@/types/blog";
import { DSAFrontmatterSchema, type DSAFrontmatter } from "@/types/dsa";
import { LessonFrontmatterSchema, type LessonFrontmatter } from "@/types/course";
import { estimateReadingTime } from "@/lib/readingTime";
import { extractToc, type TocItem } from "@/lib/toc";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export interface BlogSlugResult {
  frontmatter: BlogFrontmatter;
  content: string;
  readingTime: string;
  toc: TocItem[];
}

export function getBlogPostBySlug(slug: string): BlogSlugResult | null {
  const candidates = [
    path.join(CONTENT_ROOT, "blog", slug, "index.mdx"),
    path.join(CONTENT_ROOT, "blog", `${slug}.mdx`),
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      const source = fs.readFileSync(filePath, "utf-8");
      const { data: frontmatter, content } = parseFrontmatter(source, BlogFrontmatterSchema, filePath);
      return {
        frontmatter,
        content,
        readingTime: estimateReadingTime(content),
        toc: extractToc(content),
      };
    }
  }
  return null;
}

export interface DSASlugResult {
  frontmatter: DSAFrontmatter;
  content: string;
  readingTime: string;
  toc: TocItem[];
}

export function getDSAProblemBySlug(slug: string): DSASlugResult | null {
  const dsaDir = path.join(CONTENT_ROOT, "dsa");

  function findFile(dir: string): string | null {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const entryPath = path.join(dir, entry);
      const stat = fs.statSync(entryPath);
      if (stat.isDirectory()) {
        const found = findFile(entryPath);
        if (found) return found;
      } else if (entry === `${slug}.mdx`) {
        return entryPath;
      }
    }
    return null;
  }

  const filePath = findFile(dsaDir);
  if (!filePath) return null;

  const source = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = parseFrontmatter(source, DSAFrontmatterSchema, filePath);
  return {
    frontmatter,
    content,
    readingTime: estimateReadingTime(content),
    toc: extractToc(content),
  };
}

export interface LessonSlugResult {
  frontmatter: LessonFrontmatter;
  content: string;
  readingTime: string;
  toc: TocItem[];
}

export function getLessonBySlug(courseSlug: string, lessonSlug: string): LessonSlugResult | null {
  const filePath = path.join(CONTENT_ROOT, "courses", courseSlug, `${lessonSlug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const source = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = parseFrontmatter(source, LessonFrontmatterSchema, filePath);
  return {
    frontmatter,
    content,
    readingTime: estimateReadingTime(content),
    toc: extractToc(content),
  };
}
