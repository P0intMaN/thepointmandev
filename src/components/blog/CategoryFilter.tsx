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
    params.delete("page");
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
        onClick={() => router.push(pathname)}
        className={cn(
          "pixel-badge cursor-pointer transition-colors",
          !currentCategory && !currentTag
            ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-accent)]"
            : "border-[var(--color-bg-border)] text-[var(--color-text-faint)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-text-muted)]"
        )}
      >
        ALL
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setParam("category", currentCategory === cat ? null : cat)}
          className={cn(
            "pixel-badge cursor-pointer transition-colors",
            currentCategory === cat
              ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-accent)]"
              : "border-[var(--color-bg-border)] text-[var(--color-text-faint)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-text-muted)]"
          )}
        >
          {cat.toUpperCase()}
        </button>
      ))}

      {tags.length > 0 && (
        <>
          <span className="px-1 font-pixel text-[7px] text-[var(--color-text-faint)] self-center">|</span>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setParam("tag", currentTag === tag ? null : tag)}
              className={cn(
                "pixel-badge cursor-pointer transition-colors",
                currentTag === tag
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-accent)]"
                  : "border-[var(--color-bg-border)] text-[var(--color-text-faint)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-text-muted)]"
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
