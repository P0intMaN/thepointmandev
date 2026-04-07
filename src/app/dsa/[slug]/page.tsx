import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllDSAProblems } from "@/lib/mdx/getAllContent";
import { getDSAProblemBySlug } from "@/lib/mdx/getBySlug";
import { DifficultyBadge } from "@/components/dsa/DifficultyBadge";
import { TagBadge } from "@/components/blog/TagBadge";
import { TableOfContents } from "@/components/mdx/TableOfContents";
import { ReadingProgress } from "@/components/mdx/ReadingProgress";
import { MDXContent } from "@/components/mdx/MDXContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllDSAProblems().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = getDSAProblemBySlug(slug);
  if (!result) return {};
  return {
    title: result.frontmatter.title,
    description: result.frontmatter.description,
  };
}

export default async function DSAProblemPage({ params }: Props) {
  const { slug } = await params;
  const result = getDSAProblemBySlug(slug);
  if (!result) notFound();

  const { frontmatter, content, readingTime, toc } = result;

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
          <article>
            {/* Header */}
            <header className="mb-8 border-b border-[var(--color-bg-border)] pb-8">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <DifficultyBadge difficulty={frontmatter.difficulty} />
                <span className="font-mono text-xs text-[var(--color-text-faint)]">
                  {frontmatter.category}
                </span>
                {frontmatter.leetcodeNumber && (
                  <span className="font-mono text-xs text-[var(--color-text-faint)]">
                    LeetCode #{frontmatter.leetcodeNumber}
                  </span>
                )}
                <span className="ml-auto font-mono text-xs text-[var(--color-text-faint)]">
                  {readingTime}
                </span>
              </div>

              <h1 className="mb-3 text-3xl font-bold text-[var(--color-text-primary)]">
                {frontmatter.title}
              </h1>
              <p className="mb-5 text-[var(--color-text-muted)]">{frontmatter.description}</p>

              {/* Complexity */}
              <div className="mb-4 flex flex-wrap gap-4 font-mono text-sm">
                <span className="flex items-center gap-2 rounded border border-green-900 bg-green-950/30 px-3 py-1">
                  <span className="text-[var(--color-text-faint)] text-xs">time</span>
                  <span className="text-green-400">{frontmatter.timeComplexity}</span>
                </span>
                <span className="flex items-center gap-2 rounded border border-cyan-900 bg-cyan-950/30 px-3 py-1">
                  <span className="text-[var(--color-text-faint)] text-xs">space</span>
                  <span className="text-cyan-400">{frontmatter.spaceComplexity}</span>
                </span>
              </div>

              {/* Companies */}
              {frontmatter.companies && frontmatter.companies.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {frontmatter.companies.map((c) => (
                    <span
                      key={c}
                      className="rounded border border-[var(--color-bg-border)] bg-[var(--color-bg-muted)] px-2 py-0.5 font-mono text-xs text-[var(--color-text-faint)]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}

              {/* Tags */}
              {frontmatter.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {frontmatter.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}
            </header>

            <MDXContent source={content} />
          </article>

          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <TableOfContents items={toc} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
