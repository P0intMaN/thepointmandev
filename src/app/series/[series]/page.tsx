import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSeries, getSeriesPosts } from "@/lib/mdx/getSeriesPosts";
import { ArticleCard } from "@/components/blog/ArticleCard";

interface Props {
  params: Promise<{ series: string }>;
}

export async function generateStaticParams() {
  const allSeries = getAllSeries();
  return Object.keys(allSeries).map((series) => ({ series }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { series } = await params;
  const title = series.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: `Series: ${title}` };
}

export default async function SeriesPage({ params }: Props) {
  const { series } = await params;
  const posts = getSeriesPosts(series);
  if (posts.length === 0) notFound();

  const title = series.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <p className="mb-1 font-mono text-xs text-[var(--color-text-faint)]">SERIES</p>
        <h1 className="font-mono text-3xl font-bold text-[var(--color-text-primary)]">
          {title}<span className="text-[var(--color-accent)]">_</span>
        </h1>
        <p className="mt-2 text-[var(--color-text-muted)]">{posts.length} parts</p>
      </div>

      <div className="flex flex-col gap-3">
        {posts.map((post, i) => (
          <div key={post.slug} className="flex gap-4">
            <span className="mt-4 w-8 shrink-0 font-mono text-xs text-[var(--color-text-faint)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1">
              <ArticleCard post={post} compact />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
