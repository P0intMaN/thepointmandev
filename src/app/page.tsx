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
        <div
          className="border-2 border-[var(--color-bg-border)] p-6 sm:p-10"
          style={{ boxShadow: "6px 6px 0 0 #2e2e2e" }}
        >
          {/* Status bar */}
          <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-1 font-pixel text-[7px]">
            <span className="text-[var(--color-accent)]">▶ PLAYER_1</span>
            <span className="text-[var(--color-info)]">LVL 99</span>
            <span className="text-[var(--color-warning)]">XP ████████ MAX</span>
            <span className="text-[var(--color-tip)]">SCORE 999999</span>
          </div>

          {/* Title */}
          <h1 className="mb-2 font-pixel leading-relaxed">
            <span className="block text-lg text-[var(--color-text-primary)] sm:text-xl">
              thepointman
            </span>
            <span className="block text-lg text-[var(--color-accent)] sm:text-xl">
              .dev
              <span
                className="inline-block w-[14px] h-[22px] bg-[var(--color-accent)] ml-[4px] align-middle"
                style={{ animation: "pixel-blink 1s steps(1) infinite" }}
              />
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-6 max-w-xl font-mono text-sm leading-relaxed text-[var(--color-text-muted)]">
            In-depth articles, structured courses, and algorithm breakdowns for
            software engineers who care about fundamentals.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/blog"
              className="pixel-btn bg-[var(--color-accent)] px-5 py-2 text-[var(--color-bg-base)] no-underline hover:no-underline"
            >
              START READING
            </Link>
            <Link
              href="/roadmap"
              className="pixel-btn border-[var(--color-text-muted)] px-5 py-2 text-[var(--color-text-muted)] no-underline hover:no-underline"
            >
              VIEW ROADMAP
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap gap-8 border-t-2 border-[var(--color-bg-border)] pt-6">
            <Stat label="ARTICLES" value={allPosts.length} color="var(--color-accent)" />
            <Stat label="COURSES" value={courses.length} color="var(--color-warning)" />
            <Stat label="DSA" value={dsaProblems.length} color="var(--color-info)" />
            <Stat label="TOPICS" value={tags.length} color="var(--color-tip)" />
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="mb-16">
          <SectionHeader label="// FEATURED" href="/blog" accent="var(--color-accent)" />
          <FeaturedPost post={featured} />
        </section>
      )}

      {/* Recent articles */}
      {recentPosts.length > 0 && (
        <section className="mb-16">
          <SectionHeader label="// RECENT_ARTICLES" href="/blog" accent="var(--color-accent)" />
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
          <SectionHeader label="// COURSES" href="/courses" accent="var(--color-warning)" />
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
          <SectionHeader label="// ALGORITHMS" href="/dsa" accent="var(--color-info)" />
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
          <SectionHeader label="// TOPICS" href="/tags" accent="var(--color-tip)" />
          <div className="flex flex-wrap gap-2">
            {tags.map(([tag, count]) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="pixel-badge flex items-center gap-1.5 border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] px-3 py-1 text-[var(--color-text-muted)] no-underline hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:no-underline"
              >
                #{tag}
                <span className="text-[var(--color-text-faint)]">{count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="font-pixel">
      <div className="text-[14px]" style={{ color }}>{value.toString().padStart(3, "0")}</div>
      <div className="mt-1 text-[7px] text-[var(--color-text-faint)]">{label}</div>
    </div>
  );
}

function SectionHeader({ label, href, accent }: { label: string; href: string; accent: string }) {
  return (
    <div className="mb-6 flex items-center justify-between border-b-2 border-[var(--color-bg-border)] pb-3">
      <h2 className="font-pixel text-[9px]" style={{ color: accent }}>
        {label}
      </h2>
      <Link
        href={href}
        className="font-pixel text-[7px] text-[var(--color-text-faint)] no-underline hover:no-underline"
        style={{ "--hover-color": accent } as React.CSSProperties}
      >
        VIEW ALL ▶
      </Link>
    </div>
  );
}
