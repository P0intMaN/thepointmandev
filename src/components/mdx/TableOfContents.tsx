"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/toc";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const headingIds = items.map((item) => item.id);
    const observers: IntersectionObserver[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 1.0 }
    );

    for (const id of headingIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    observers.push(observer);

    return () => { for (const obs of observers) obs.disconnect(); };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="mb-3 border-b-2 border-[var(--color-bg-border)] pb-2 font-pixel text-[7px] text-[var(--color-accent)]">
        // ON_THIS_PAGE
      </p>
      <div className="space-y-0.5">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "block py-1 font-mono text-xs leading-snug transition-colors no-underline hover:no-underline",
              item.level === 3 && "pl-3",
              activeId === item.id
                ? "text-[var(--color-accent)]"
                : "text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)]"
            )}
          >
            {activeId === item.id && <span className="mr-1">▶</span>}
            {item.text}
          </a>
        ))}
      </div>
    </nav>
  );
}
