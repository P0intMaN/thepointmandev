import Link from "next/link";
import { getAllBlogPosts, getAllCourses, getAllDSAProblems, getAllTags } from "@/lib/mdx/getAllContent";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { CourseCard } from "@/components/course/CourseCard";
import { DSACard } from "@/components/dsa/DSACard";

export default function Home() {
  const allPosts = getAllBlogPosts();
  const featured = allPosts.find((p) => p.frontmatter.featured) ?? allPosts[0];
  const recentPosts = allPosts.filter((p) => p !== featured).slice(0, 6);
  const courses = getAllCourses().slice(0, 3);
  const dsaProblems = getAllDSAProblems().slice(0, 3);
  const tags = Object.entries(getAllTags())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <section className="mb-20">
        <div className="mb-3 font-mono text-xs text-[var(--color-text-faint)]">
          $ whoami
        </div>
        <h1 className="mb-4 font-mono text-5xl font-black tracking-tight sm:text-6xl">
          <span className="text-[var(--color-text-primary)]">thepointman</span>
          <span className="text-[var(--color-accent)]">.dev_</span>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)]">
          In-depth articles, structured courses, and algorithm breakdowns for software engineers who
          care about fundamentals.
        </p>
      </section>

      {/* Featured */}
      {featured && (
        <section className="mb-16">
          <SectionHeader label="Featured" href="/blog" />
          <FeaturedPost post={featured} />
        </section>
      )}

      {/* Recent articles */}
      {recentPosts.length > 0 && (
        <section className="mb-16">
          <SectionHeader label="Recent Articles" href="/blog" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Courses */}
      {courses.length > 0 && (
        <section className="mb-16">
          <SectionHeader label="Courses" href="/courses" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* DSA */}
      {dsaProblems.length > 0 && (
        <section className="mb-16">
          <SectionHeader label="Algorithms & Data Structures" href="/dsa" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dsaProblems.map((problem) => (
              <DSACard key={problem.slug} problem={problem} />
            ))}
          </div>
        </section>
      )}

      {/* Tag cloud */}
      {tags.length > 0 && (
        <section className="mb-16">
          <SectionHeader label="Topics" href="/tags" />
          <div className="flex flex-wrap gap-2">
            {tags.map(([tag, count]) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="flex items-center gap-1.5 rounded border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] px-3 py-1 font-mono text-xs text-[var(--color-text-faint)] no-underline transition-colors hover:border-[var(--color-text-faint)] hover:text-[var(--color-text-muted)] hover:no-underline"
              >
                #{tag}
                <span className="text-[var(--color-bg-border)]">{count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeader({ label, href }: { label: string; href: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="font-mono text-sm font-semibold uppercase tracking-widest text-[var(--color-text-faint)]">
        {label}
      </h2>
      <Link
        href={href}
        className="font-mono text-xs text-[var(--color-text-faint)] no-underline hover:text-[var(--color-accent)] hover:no-underline"
      >
        View all →
      </Link>
    </div>
  );
}
