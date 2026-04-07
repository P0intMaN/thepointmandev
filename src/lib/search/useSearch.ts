"use client";

import { useState, useCallback } from "react";
import Fuse from "fuse.js";
import type { SearchEntry } from "./buildIndex";

let cachedFuse: Fuse<SearchEntry> | null = null;

async function getFuse(): Promise<Fuse<SearchEntry>> {
  if (cachedFuse) return cachedFuse;

  const res = await fetch("/api/search");
  const entries: SearchEntry[] = await res.json();

  cachedFuse = new Fuse(entries, {
    keys: [
      { name: "title", weight: 3 },
      { name: "description", weight: 2 },
      { name: "tags", weight: 1.5 },
      { name: "category", weight: 1 },
    ],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 2,
  });

  return cachedFuse;
}

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const fuse = await getFuse();
      const matches = fuse.search(q, { limit: 10 });
      setResults(matches.map((m) => m.item));
    } finally {
      setLoading(false);
    }
  }, []);

  return { query, results, loading, search };
}
