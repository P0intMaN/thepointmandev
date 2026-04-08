import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBlogPosts } from "@/lib/mdx/getAllContent";
import { getBlogPostBySlug } from "@/lib/mdx/getBySlug";
import { getSeriesPosts } from "@/lib/mdx/getSeriesPosts";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { SeriesNav } from "@/components/mdx/SeriesNav";
import { TableOfContents } from "@/components/mdx/TableOfContents";
import { ReadingProgress } from "@/components/mdx/ReadingProgress";
import { MDXContent } from "@/components/mdx/MDXContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = getBlogPostBySlug(slug);
  if (!result) return {};
  const { frontmatter } = result;
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      type: "article",
      publishedTime: frontmatter.date,
      modifiedTime: frontmatter.updated,
      images: [{ url: "/og-default.png" }],
    },
    alternates: {
      canonical: frontmatter.canonicalUrl,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const result = getBlogPostBySlug(slug);
  if (!result) notFound();

  const { frontmatter, content, readingTime, toc } = result;

  const seriesPosts =
    frontmatter.series ? getSeriesPosts(frontmatter.series) : [];

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
          {/* Main content */}
          <article>
            <ArticleHeader frontmatter={frontmatter} readingTime={readingTime} />

            {seriesPosts.length > 1 && (
              <SeriesNav
                posts={seriesPosts}
                currentSlug={slug}
                seriesName={frontmatter.series!}
              />
            )}

            <MDXContent source={content} />
          </article>

          {/* Sidebar TOC */}
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
