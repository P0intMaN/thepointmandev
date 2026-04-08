import fs from "fs";
import path from "path";
import { parseFrontmatter } from "./parseFrontmatter";
import { BlogFrontmatterSchema, type BlogFrontmatter } from "@/types/blog";
import { DSAFrontmatterSchema, DSAPatternFrontmatterSchema, type DSAFrontmatter, type DSAPatternFrontmatter } from "@/types/dsa";
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

export interface DSAPatternResult {
  frontmatter: DSAPatternFrontmatter;
  content: string;
}

export function getDSAPatternBySlug(patternSlug: string): DSAPatternResult | null {
  const metaPath = path.join(CONTENT_ROOT, "dsa", patternSlug, "_meta.mdx");
  if (!fs.existsSync(metaPath)) return null;
  const source = fs.readFileSync(metaPath, "utf-8");
  const { data: frontmatter, content } = parseFrontmatter(source, DSAPatternFrontmatterSchema, metaPath);
  return { frontmatter, content };
}

export interface DSASlugResult {
  frontmatter: DSAFrontmatter;
  content: string;
  readingTime: string;
  toc: TocItem[];
}

export function getDSAProblemBySlug(patternSlug: string, slug: string): DSASlugResult | null {
  const filePath = path.join(CONTENT_ROOT, "dsa", patternSlug, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
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
