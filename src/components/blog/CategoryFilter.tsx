"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  tags?: string[];
  currentCategory?: string;
  currentTag?: string;
}

export function CategoryFilter({
  categories,
  tags = [],
  currentCategory,
  currentTag,
}: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page"); // reset pagination on filter change
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* All */}
      <button
        onClick={() => {
          const params = new URLSearchParams();
          router.push(pathname + (params.toString() ? `?${params}` : ""));
        }}
        className={cn(
          "rounded border px-3 py-1 font-mono text-xs transition-colors cursor-pointer",
          !currentCategory && !currentTag
            ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-accent)]"
            : "border-[var(--color-bg-border)] text-[var(--color-text-faint)] hover:border-[var(--color-text-faint)] hover:text-[var(--color-text-muted)]"
        )}
      >
        All
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setParam("category", currentCategory === cat ? null : cat)}
          className={cn(
            "rounded border px-3 py-1 font-mono text-xs transition-colors cursor-pointer",
            currentCategory === cat
              ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-accent)]"
              : "border-[var(--color-bg-border)] text-[var(--color-text-faint)] hover:border-[var(--color-text-faint)] hover:text-[var(--color-text-muted)]"
          )}
        >
          {cat}
        </button>
      ))}

      {tags.length > 0 && (
        <>
          <span className="px-1 text-[var(--color-text-faint)]">/</span>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setParam("tag", currentTag === tag ? null : tag)}
              className={cn(
                "rounded border px-3 py-1 font-mono text-xs transition-colors cursor-pointer",
                currentTag === tag
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-accent)]"
                  : "border-[var(--color-bg-border)] text-[var(--color-text-faint)] hover:border-[var(--color-text-faint)] hover:text-[var(--color-text-muted)]"
              )}
            >
              #{tag}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
