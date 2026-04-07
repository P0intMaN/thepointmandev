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
      <div className="mb-10">
        <h1 className="mb-2 font-mono text-3xl font-bold text-[var(--color-text-primary)]">
          Blog<span className="text-[var(--color-accent)]">_</span>
        </h1>
        <p className="text-[var(--color-text-muted)]">
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
        <p className="text-[var(--color-text-faint)]">No articles match this filter.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
