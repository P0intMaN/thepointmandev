"use client";

import { useSearchParams } from "next/navigation";
import { ArticleCard } from "./ArticleCard";
import { CategoryFilter } from "./CategoryFilter";
import type { BlogPost } from "@/types/blog";

interface BlogPostsProps {
  posts: BlogPost[];
  categories: string[];
  popularTags: string[];
}

export function BlogPosts({ posts, categories, popularTags }: BlogPostsProps) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;

  const filtered = posts.filter((post) => {
    if (category && post.frontmatter.category !== category) return false;
    if (tag && !post.frontmatter.tags.includes(tag)) return false;
    return true;
  });

  return (
    <>
      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          tags={popularTags}
          currentCategory={category}
          currentTag={tag}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-[var(--color-text-faint)]">No articles match this filter.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
