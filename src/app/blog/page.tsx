import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllBlogPosts } from "@/lib/mdx/getAllContent";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { CategoryFilter } from "@/components/blog/CategoryFilter";

export const metadata: Metadata = {
  title: "Blog",
  description: "In-depth articles on software engineering, Java, system design, and more.",
};

interface BlogPageProps {
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category, tag } = await searchParams;
  const allPosts = getAllBlogPosts();

  const filtered = allPosts.filter((post) => {
    if (category && post.frontmatter.category !== category) return false;
    if (tag && !post.frontmatter.tags.includes(tag)) return false;
    return true;
  });

  const categories = [...new Set(allPosts.map((p) => p.frontmatter.category))].sort();
  const popularTags = [...new Set(allPosts.flatMap((p) => p.frontmatter.tags))]
    .slice(0, 12)
    .sort();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10 border-b-2 border-[var(--color-bg-border)] pb-8">
        <p className="mb-3 font-pixel text-[7px] text-[var(--color-accent)]">// BLOG</p>
        <h1 className="mb-3 font-pixel text-lg leading-relaxed text-[var(--color-text-primary)]">
          Articles
          <span
            className="inline-block w-[12px] h-[18px] bg-[var(--color-accent)] ml-[4px] align-middle"
            style={{ animation: "pixel-blink 1s steps(1) infinite" }}
          />
        </h1>
        <p className="font-mono text-sm text-[var(--color-text-muted)]">
          {allPosts.length} articles on software engineering, algorithms, and system design.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <Suspense>
          <CategoryFilter
            categories={categories}
            tags={popularTags}
            currentCategory={category}
            currentTag={tag}
          />
        </Suspense>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="border-2 border-[var(--color-bg-border)] p-8 text-center">
          <p className="font-pixel text-[8px] text-[var(--color-text-faint)]">NO RESULTS FOUND</p>
          <p className="mt-2 font-mono text-xs text-[var(--color-text-faint)]">No articles match this filter.</p>
        </div>
      ) : (
        <>
          <p className="mb-4 font-pixel text-[7px] text-[var(--color-text-faint)]">
            {filtered.length} RESULTS
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
