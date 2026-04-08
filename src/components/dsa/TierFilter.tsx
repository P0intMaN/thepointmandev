"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tiers = [
  { value: null, label: "All Tiers" },
  { value: 1, label: "Tier 1 · Fundamentals" },
  { value: 2, label: "Tier 2 · Intermediate" },
  { value: 3, label: "Tier 3 · Advanced" },
];

export function TierFilter({ current }: { current?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setTier(value: number | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("tier", String(value));
    else params.delete("tier");
    router.push(`${pathname}${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tiers.map(({ value, label }) => {
        const active = value === null ? !current : current === String(value);
        return (
          <button
            key={label}
            onClick={() => setTier(value)}
            className={cn(
              "rounded border px-3 py-1 font-mono text-xs transition-colors cursor-pointer",
              active
                ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-accent)]"
                : "border-[var(--color-bg-border)] text-[var(--color-text-faint)] hover:border-[var(--color-text-faint)] hover:text-[var(--color-text-muted)]"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
