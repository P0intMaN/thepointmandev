import type { Metadata } from "next";
import { SearchUI } from "./SearchUI";

export const metadata: Metadata = {
  title: "Search",
  description: "Search all articles, courses, and DSA problems.",
};

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="mb-2 font-mono text-3xl font-bold text-[var(--color-text-primary)]">
          Search<span className="text-[var(--color-accent)]">_</span>
        </h1>
        <p className="text-[var(--color-text-muted)]">Search across all articles, courses, and DSA problems.</p>
      </div>
      <SearchUI />
    </div>
  );
}
