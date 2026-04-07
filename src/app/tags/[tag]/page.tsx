import type { Metadata } from "next";
import { getAllBlogPosts, getAllTags } from "@/lib/mdx/getAllContent";
import { ArticleCard } from "@/components/blog/ArticleCard";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return Object.keys(tags).map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return { title: `#${decoded}`, description: `Articles tagged with #${decoded}` };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getAllBlogPosts().filter((p) => p.frontmatter.tags.includes(decoded));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="mb-2 font-mono text-3xl font-bold text-[var(--color-text-primary)]">
          <span className="text-[var(--color-accent)]">#</span>{decoded}
        </h1>
        <p className="text-[var(--color-text-muted)]">{posts.length} articles</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
