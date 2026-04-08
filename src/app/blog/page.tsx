import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllBlogPosts } from "@/lib/mdx/getAllContent";
import { BlogPosts } from "@/components/blog/BlogPosts";

export const metadata: Metadata = {
  title: "Blog",
  description: "In-depth articles on software engineering, Java, system design, and more.",
};

export default function BlogPage() {
  const allPosts = getAllBlogPosts();
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

      <Suspense>
        <BlogPosts posts={allPosts} categories={categories} popularTags={popularTags} />
      </Suspense>
    </div>
  );
}
