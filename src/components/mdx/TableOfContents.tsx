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
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: 1.0,
      }
    );

    for (const id of headingIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    observers.push(observer);

    return () => {
      for (const obs of observers) obs.disconnect();
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="space-y-1">
      <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-text-faint)]">
        On this page
      </p>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            "block py-0.5 text-sm leading-snug transition-colors no-underline hover:no-underline",
            item.level === 3 && "pl-3",
            activeId === item.id
              ? "text-[var(--color-accent)] font-medium"
              : "text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)]"
          )}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}
