"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useSearch } from "@/lib/search/useSearch";
import type { SearchEntry } from "@/lib/search/buildIndex";

export function SearchUI() {
  const { query, results, loading, search } = useSearch();

  function getHref(entry: SearchEntry) {
    return entry.type === "blog" ? `/blog/${entry.slug}` : `/dsa/${entry.slug}`;
  }

  return (
    <div>
      {/* Input */}
      <div className="relative mb-8">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)]"
        />
        <input
          type="search"
          placeholder="Search articles, problems..."
          autoFocus
          value={query}
          onChange={(e) => search(e.target.value)}
          className="w-full rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] py-3 pl-11 pr-4 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)] focus:outline-none"
        />
      </div>

      {/* Results */}
      {loading && (
        <p className="font-mono text-sm text-[var(--color-text-faint)]">Searching...</p>
      )}

      {!loading && query && results.length === 0 && (
        <p className="font-mono text-sm text-[var(--color-text-faint)]">
          No results for &ldquo;{query}&rdquo;
        </p>
      )}

      {results.length > 0 && (
        <ul className="space-y-3">
          {results.map((entry) => (
            <li key={`${entry.type}-${entry.slug}`}>
              <Link
                href={getHref(entry)}
                className="flex flex-col gap-1.5 rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-4 no-underline transition-colors hover:border-[var(--color-text-faint)] hover:no-underline"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[var(--color-accent)]">
                    {entry.type === "blog" ? "article" : "dsa"}
                  </span>
                  <span className="font-mono text-xs text-[var(--color-text-faint)]">
                    {entry.category}
                  </span>
                </div>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {entry.title}
                </span>
                <span className="text-sm text-[var(--color-text-muted)]">
                  {entry.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!query && (
        <p className="font-mono text-sm text-[var(--color-text-faint)]">
          Start typing to search...
        </p>
      )}
    </div>
  );
}
