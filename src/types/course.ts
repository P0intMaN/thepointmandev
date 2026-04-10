import { z } from "zod";

export const CourseFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  date: z.string(),
  tags: z.array(z.string()).default([]),
  level: z.enum(["beginner", "intermediate", "advanced"] as const),
  totalLessons: z.number(),
  category: z.string().default("Other"),
  icon: z.string().optional(),
  accent: z.string().optional(),
  image: z.string().optional(),
  draft: z.boolean().default(false),
});

export const LessonFrontmatterSchema = z.object({
  title: z.string(),
  courseSlug: z.string(),
  lessonNumber: z.number(),
  description: z.string(),
  date: z.string(),
  draft: z.boolean().default(false),
  prerequisites: z.array(z.string()).optional(),
});

export type CourseFrontmatter = z.infer<typeof CourseFrontmatterSchema>;
export type LessonFrontmatter = z.infer<typeof LessonFrontmatterSchema>;

export interface Course {
  slug: string;
  frontmatter: CourseFrontmatter;
}

export interface Lesson {
  slug: string;
  courseSlug: string;
  frontmatter: LessonFrontmatter;
}
