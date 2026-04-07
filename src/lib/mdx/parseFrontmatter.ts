import matter from "gray-matter";
import { z, type ZodTypeAny } from "zod";

export function parseFrontmatter<S extends ZodTypeAny>(
  source: string,
  schema: S,
  filePath: string
): { data: z.output<S>; content: string } {
  const { data: raw, content } = matter(source);

  const result = schema.safeParse(raw);
  if (!result.success) {
    const errors = result.error.errors
      .map((e: z.ZodIssue) => `  ${e.path.join(".")}: ${e.message}`)
      .join("\n");
    throw new Error(`Frontmatter validation failed in ${filePath}:\n${errors}`);
  }

  return { data: result.data as z.output<S>, content };
}
