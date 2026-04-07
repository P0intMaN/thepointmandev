"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import {
  javaTopics,
  javaSections,
  dsaPatterns,
  sdConcepts,
  weeklyPlan,
  type Difficulty,
  type DSATier,
  type SDType,
} from "./roadmapData";
import { dsaExtra } from "./dsaExtended";

// Lazy-load graphs (SSR-off, small initial bundle)
const DSAFlowGraph = dynamic(
  () => import("@/components/roadmap/DSAFlowGraph").then((m) => ({ default: m.DSAFlowGraph })),
  { ssr: false, loading: () => <GraphSkeleton /> }
);
const SDFlowGraph = dynamic(
  () => import("@/components/roadmap/SDFlowGraph").then((m) => ({ default: m.SDFlowGraph })),
  { ssr: false, loading: () => <GraphSkeleton /> }
);

function GraphSkeleton() {
  return (
    <div className="flex h-[680px] w-full items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[#0a0a0a]"
      style={{
        backgroundImage: "radial-gradient(circle, #1e1e1e 1.2px, transparent 1.2px)",
        backgroundSize: "28px 28px",
      }}
    >
      <span className="font-mono text-sm text-[var(--color-text-faint)] animate-pulse">loading graph…</span>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const diffColor: Record<Difficulty, string> = {
  Easy: "text-green-400 border-green-900 bg-green-950/30",
  Medium: "text-amber-400 border-amber-900 bg-amber-950/30",
  Hard: "text-red-400 border-red-900 bg-red-950/30",
};

const diffGlow: Record<Difficulty, string> = {
  Easy: "rgba(74,222,128,0.06)",
  Medium: "rgba(251,191,36,0.06)",
  Hard: "rgba(248,113,113,0.06)",
};

const diffBorder: Record<Difficulty, string> = {
  Easy: "hover:border-green-500/40",
  Medium: "hover:border-amber-500/40",
  Hard: "hover:border-red-500/40",
};

const tierLabel: Record<DSATier, string> = {
  1: "Tier 1 — Fundamentals",
  2: "Tier 2 — Intermediate",
  3: "Tier 3 — Advanced",
};

const tierGlow = {
  1: { shimmer: "via-[#4ade80]/60", glow: "rgba(74,222,128,0.07)", border: "hover:border-green-500/40" },
  2: { shimmer: "via-[#fbbf24]/60", glow: "rgba(251,191,36,0.07)", border: "hover:border-amber-500/40" },
  3: { shimmer: "via-[#f87171]/60", glow: "rgba(248,113,113,0.07)", border: "hover:border-red-500/40" },
};

const sdTypeColor: Record<SDType, string> = {
  Concept: "text-cyan-400 border-cyan-900 bg-cyan-950/30",
  Design: "text-purple-400 border-purple-900 bg-purple-950/30",
  Math: "text-amber-400 border-amber-900 bg-amber-950/30",
};

const monthColors = ["border-green-500/30", "border-amber-500/30", "border-red-500/30"];
const monthText = ["text-green-400", "text-amber-400", "text-red-400"];
const monthGlow = [
  "rgba(74,222,128,0.05)",
  "rgba(251,191,36,0.05)",
  "rgba(248,113,113,0.05)",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function MustBeacon() {
  return (
    <span className="relative inline-flex items-center">
      <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-[#4ade80] opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ade80]" />
    </span>
  );
}

function TagPill({ tag }: { tag: string }) {
  return (
    <span className="rounded bg-[var(--color-bg-muted)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-text-faint)]">
      {tag}
    </span>
  );
}

function CheckButton({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      aria-label={checked ? "Mark incomplete" : "Mark complete"}
      className={cn(
        "flex-shrink-0 h-5 w-5 rounded border transition-all duration-200 flex items-center justify-center cursor-pointer",
        checked
          ? "border-[#4ade80] bg-[#4ade80]/20 text-[#4ade80]"
          : "border-[var(--color-bg-border)] bg-transparent text-transparent hover:border-[#4ade80]/50"
      )}
    >
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ done, total, label }: { done: number; total: number; label: string }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 font-mono text-xs text-[var(--color-text-faint)]">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[var(--color-bg-muted)]">
        <div
          className="h-full rounded-full bg-[#4ade80] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-14 text-right font-mono text-xs text-[var(--color-text-faint)]">
        {done}/{total} <span className="text-[#4ade80]">{pct}%</span>
      </span>
    </div>
  );
}

// ─── Tab: Java ────────────────────────────────────────────────────────────────

function ViewToggle({ view, onChange }: { view: "cards" | "graph"; onChange: (v: "cards" | "graph") => void }) {
  return (
    <div className="flex overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)]">
      {(["cards", "graph"] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs transition-all cursor-pointer",
            view === v
              ? "bg-[#4ade80]/10 text-[#4ade80]"
              : "text-[var(--color-text-faint)] hover:text-[var(--color-text-secondary)]"
          )}
        >
          {v === "cards" ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="0.5" y="0.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="7" y="0.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="0.5" y="7" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="7" y="7" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="2" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="10" cy="2" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="10" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M3.5 5.5L8.5 2.5M3.5 6.5L8.5 9.5" stroke="currentColor" strokeWidth="1.2"/></svg>
          )}
          {v}
        </button>
      ))}
    </div>
  );
}

function JavaTab({ done: doneSet, onToggle }: { done: Set<string>; onToggle: (id: string) => void }) {
  const [filter, setFilter] = useState<Difficulty | "All">("All");
  const visible = javaTopics.filter((t) => filter === "All" || t.difficulty === filter);

  return (
    <div className="space-y-8">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {(["All", "Easy", "Medium", "Hard"] as const).map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={cn(
              "rounded-[var(--radius-sm)] border px-3 py-1 font-mono text-xs transition-all cursor-pointer",
              filter === d
                ? "border-[#4ade80]/60 bg-[#4ade80]/10 text-[#4ade80]"
                : "border-[var(--color-bg-border)] text-[var(--color-text-faint)] hover:border-[var(--color-text-faint)]/30"
            )}
          >
            {d}
          </button>
        ))}
      </div>

      {javaSections.map((section) => {
        const topics = visible.filter((t) => t.section === section);
        if (!topics.length) return null;
        const sectionDone = topics.filter((t) => doneSet.has(t.id)).length;
        return (
          <div key={section}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-mono text-sm font-bold text-[var(--color-text-secondary)]">
                {section}
              </h3>
              <span className="font-mono text-xs text-[var(--color-text-faint)]">
                {sectionDone}/{topics.length}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((t) => {
                const checked = doneSet.has(t.id);
                return (
                  <div
                    key={t.id}
                    className={cn(
                      "group relative flex gap-3 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-4 transition-all duration-300",
                      diffBorder[t.difficulty],
                      checked && "opacity-60"
                    )}
                    style={checked ? {} : undefined}
                  >
                    {/* Shimmer */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#4ade80]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {/* Glow */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `radial-gradient(ellipse at 50% 0%, ${diffGlow[t.difficulty]} 0%, transparent 65%)` }}
                    />

                    <CheckButton checked={checked} onToggle={() => onToggle(t.id)} />

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-start gap-2">
                        {t.priority === "Must" && <MustBeacon />}
                        <span className={cn(
                          "text-sm font-medium leading-snug",
                          checked ? "line-through text-[var(--color-text-faint)]" : "text-[var(--color-text-primary)]"
                        )}>
                          {t.topic}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={cn("rounded border px-1.5 py-0.5 font-mono text-[10px]", diffColor[t.difficulty])}>
                          {t.difficulty}
                        </span>
                        {t.tags.slice(0, 3).map((tag) => <TagPill key={tag} tag={tag} />)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Tab: DSA ─────────────────────────────────────────────────────────────────

function DSATab({ done: doneSet, onToggle }: { done: Set<string>; onToggle: (id: string) => void }) {
  const tiers: DSATier[] = [1, 2, 3];
  const [view, setView] = useState<"cards" | "graph">("cards");

  if (view === "graph") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-[var(--color-text-faint)]">
            Pattern dependency graph — edges show learning order · click node for LeetCode problems
          </p>
          <ViewToggle view={view} onChange={setView} />
        </div>
        <DSAFlowGraph done={doneSet} onToggle={onToggle} />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Tier flow + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="hidden items-center gap-3 sm:flex">
          {tiers.map((tier, i) => (
            <div key={tier} className="flex items-center gap-3">
              <span className={cn(
                "rounded-[var(--radius-sm)] border px-3 py-1 font-mono text-xs font-bold",
                tier === 1 ? "border-green-700 text-green-400 bg-green-950/30"
                  : tier === 2 ? "border-amber-700 text-amber-400 bg-amber-950/30"
                  : "border-red-700 text-red-400 bg-red-950/30"
              )}>
                {tier === 1 ? "Fundamentals" : tier === 2 ? "Intermediate" : "Advanced"}
              </span>
              {i < 2 && (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[var(--color-text-faint)]">
                  <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {tiers.map((tier) => {
        const patterns = dsaPatterns.filter((p) => p.tier === tier);
        const tierDone = patterns.filter((p) => doneSet.has(p.id)).length;
        const g = tierGlow[tier];
        return (
          <div key={tier}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className={cn(
                "font-mono text-sm font-bold",
                tier === 1 ? "text-green-400" : tier === 2 ? "text-amber-400" : "text-red-400"
              )}>
                {tierLabel[tier]}
              </h3>
              <span className="font-mono text-xs text-[var(--color-text-faint)]">
                {tierDone}/{patterns.length}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {patterns.map((p) => {
                const checked = doneSet.has(p.id);
                return (
                  <div
                    key={p.id}
                    className={cn(
                      "group relative flex gap-3 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-4 transition-all duration-300",
                      g.border,
                      checked && "opacity-60"
                    )}
                  >
                    <div className={cn(`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${g.shimmer} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`)} />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `radial-gradient(ellipse at 50% 0%, ${g.glow} 0%, transparent 65%)` }}
                    />
                    <CheckButton checked={checked} onToggle={() => onToggle(p.id)} />
                    <div className="min-w-0 flex-1 space-y-2">
                      <span className={cn(
                        "block text-sm font-medium leading-snug",
                        checked ? "line-through text-[var(--color-text-faint)]" : "text-[var(--color-text-primary)]"
                      )}>
                        {p.pattern}
                      </span>
                      <span className="block font-mono text-xs text-[var(--color-text-faint)]">
                        {p.dataStructure}
                      </span>
                      {/* Witty description */}
                      {dsaExtra[p.id]?.description && (
                        <p className="text-xs italic text-[var(--color-text-faint)] leading-snug">
                          {dsaExtra[p.id].description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {p.tags.slice(0, 3).map((tag) => <TagPill key={tag} tag={tag} />)}
                      </div>
                      {/* LeetCode problems */}
                      {dsaExtra[p.id]?.problems.length > 0 && (
                        <div className="flex flex-col gap-1 pt-1 border-t border-[var(--color-bg-border)]">
                          {dsaExtra[p.id].problems.map((prob) => (
                            <a
                              key={prob.id}
                              href={`https://leetcode.com/problems/${prob.slug}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/lc flex items-center gap-2 no-underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className={cn(
                                "flex-shrink-0 font-mono text-[9px] font-bold",
                                prob.difficulty === "Easy" ? "text-green-400" : prob.difficulty === "Medium" ? "text-amber-400" : "text-red-400"
                              )}>
                                #{prob.id}
                              </span>
                              <span className="truncate text-[10px] text-[var(--color-text-faint)] group-hover/lc:text-[var(--color-text-secondary)] transition-colors">
                                {prob.title}
                              </span>
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="flex-shrink-0 opacity-0 group-hover/lc:opacity-60 transition-opacity">
                                <path d="M1 7l6-6M7 7V1H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                              </svg>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Tab: System Design ───────────────────────────────────────────────────────

function SystemDesignTab({ done: doneSet, onToggle }: { done: Set<string>; onToggle: (id: string) => void }) {
  const [typeFilter, setTypeFilter] = useState<SDType | "All">("All");
  const [view, setView] = useState<"cards" | "graph">("cards");
  const types: Array<SDType | "All"> = ["All", "Concept", "Design", "Math"];

  const visible = sdConcepts.filter((c) => typeFilter === "All" || c.type === typeFilter);

  if (view === "graph") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-[var(--color-text-faint)]">
            Foundation → Services → Design Problems · click a node to highlight connections
          </p>
          <ViewToggle view={view} onChange={setView} />
        </div>
        <SDFlowGraph done={doneSet} onToggle={onToggle} />
      </div>
    );
  }

  const sdTypeGlow: Record<SDType, string> = {
    Concept: "rgba(103,232,249,0.06)",
    Design: "rgba(168,85,247,0.06)",
    Math: "rgba(251,191,36,0.06)",
  };
  const sdShimmer: Record<SDType, string> = {
    Concept: "via-[#67e8f9]/50",
    Design: "via-[#a855f7]/50",
    Math: "via-[#fbbf24]/50",
  };
  const sdBorder: Record<SDType, string> = {
    Concept: "hover:border-cyan-500/40",
    Design: "hover:border-purple-500/40",
    Math: "hover:border-amber-500/40",
  };

  return (
    <div className="space-y-6">
      {/* Type filter + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "rounded-[var(--radius-sm)] border px-3 py-1 font-mono text-xs transition-all cursor-pointer",
                typeFilter === t
                  ? "border-[#4ade80]/60 bg-[#4ade80]/10 text-[#4ade80]"
                  : "border-[var(--color-bg-border)] text-[var(--color-text-faint)] hover:border-[var(--color-text-faint)]/30"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((c) => {
          const checked = doneSet.has(c.id);
          return (
            <div
              key={c.id}
              className={cn(
                "group relative flex gap-3 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-4 transition-all duration-300",
                sdBorder[c.type],
                checked && "opacity-60"
              )}
            >
              <div className={cn(`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${sdShimmer[c.type]} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`)} />
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${sdTypeGlow[c.type]} 0%, transparent 65%)` }}
              />
              <CheckButton checked={checked} onToggle={() => onToggle(c.id)} />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-[10px] text-[var(--color-text-faint)] flex-shrink-0 mt-0.5">
                    #{c.number.toString().padStart(2, "0")}
                  </span>
                  <span className={cn(
                    "text-sm font-medium leading-snug",
                    checked ? "line-through text-[var(--color-text-faint)]" : "text-[var(--color-text-primary)]"
                  )}>
                    {c.concept}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className={cn("rounded border px-1.5 py-0.5 font-mono text-[10px]", sdTypeColor[c.type])}>
                    {c.type}
                  </span>
                  {c.tags.slice(0, 2).map((tag) => <TagPill key={tag} tag={tag} />)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab: 12-Week Plan ────────────────────────────────────────────────────────

function WeeklyPlanTab({ done: doneSet, onToggle }: { done: Set<string>; onToggle: (id: string) => void }) {
  const [openWeek, setOpenWeek] = useState<number | null>(1);
  const months = [1, 2, 3];

  const weekId = (week: number) => `week-${week}`;

  return (
    <div className="space-y-8">
      {months.map((month) => {
        const weeks = weeklyPlan.filter((w) => w.month === month);
        const mi = month - 1;
        return (
          <div key={month}>
            <div className="mb-4 flex items-center gap-3">
              <div className={cn("h-px flex-1 bg-gradient-to-r from-transparent", monthColors[mi])} />
              <span className={cn("font-mono text-xs font-bold uppercase tracking-widest", monthText[mi])}>
                Month {month} — {weeks[0]?.monthLabel}
              </span>
              <div className={cn("h-px flex-1 bg-gradient-to-l from-transparent", monthColors[mi])} />
            </div>

            <div className="space-y-3">
              {weeks.map((w) => {
                const wid = weekId(w.week);
                const checked = doneSet.has(wid);
                const isOpen = openWeek === w.week;
                return (
                  <div
                    key={w.week}
                    className={cn(
                      "group overflow-hidden rounded-[var(--radius-lg)] border transition-all duration-300",
                      isOpen
                        ? monthColors[mi] + " bg-[var(--color-bg-elevated)]"
                        : "border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-bg-muted)]"
                    )}
                  >
                    {/* Week header */}
                    <button
                      className="flex w-full items-center gap-4 p-4 text-left cursor-pointer"
                      onClick={() => setOpenWeek(isOpen ? null : w.week)}
                    >
                      <CheckButton
                        checked={checked}
                        onToggle={() => onToggle(wid)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={cn("font-mono text-xs font-bold", monthText[mi])}>
                            Week {w.week}
                          </span>
                          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                            {w.java.slice(0, 2).join(", ")}
                            {w.java.length > 2 && " …"}
                          </span>
                        </div>
                        <p className="mt-0.5 font-mono text-xs text-[var(--color-text-faint)]">
                          {w.java.length + w.dsa.length + w.systemDesign.length} topics · {w.dsa.length} DSA patterns
                        </p>
                      </div>
                      <svg
                        width="16" height="16" viewBox="0 0 16 16" fill="none"
                        className={cn("flex-shrink-0 text-[var(--color-text-faint)] transition-transform duration-200", isOpen && "rotate-180")}
                      >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {/* Week body */}
                    {isOpen && (
                      <div
                        className="px-4 pb-5 pt-0"
                        style={{ background: `radial-gradient(ellipse at 50% 0%, ${monthGlow[mi]} 0%, transparent 60%)` }}
                      >
                        <div className="grid gap-4 sm:grid-cols-3 border-t border-[var(--color-bg-border)] pt-4">
                          {/* Java */}
                          <div>
                            <p className="mb-2 font-mono text-xs font-bold text-[#4ade80]">☕ Java</p>
                            <ul className="space-y-1.5">
                              {w.java.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-text-muted)]">
                                  <span className="mt-0.5 text-[var(--color-text-faint)]">·</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* DSA */}
                          <div>
                            <p className="mb-2 font-mono text-xs font-bold text-cyan-400">🧩 DSA</p>
                            <ul className="space-y-1.5">
                              {w.dsa.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-text-muted)]">
                                  <span className="mt-0.5 text-[var(--color-text-faint)]">·</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* System Design */}
                          <div>
                            <p className="mb-2 font-mono text-xs font-bold text-purple-400">🏗️ System Design</p>
                            <ul className="space-y-1.5">
                              {w.systemDesign.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-text-muted)]">
                                  <span className="mt-0.5 text-[var(--color-text-faint)]">·</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {/* Mock interview */}
                        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-bg-border)] bg-[var(--color-bg-muted)] p-3">
                          <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-faint)]">
                            Mock Interview Target
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">{w.mockInterview}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = "java" | "dsa" | "systemdesign" | "plan";

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: "java", label: "Java Mastery", emoji: "☕" },
  { id: "dsa", label: "DSA Patterns", emoji: "🧩" },
  { id: "systemdesign", label: "System Design", emoji: "🏗️" },
  { id: "plan", label: "12-Week Plan", emoji: "📅" },
];

const STORAGE_KEY = "roadmap-progress";

export function RoadmapContent() {
  const [activeTab, setActiveTab] = useState<Tab>("java");
  const [done, setDone] = useState<Set<string>>(new Set());

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setDone(new Set(JSON.parse(saved) as string[]));
    } catch {}
  }, []);

  const toggle = useCallback((id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  // Progress totals
  const javaTotal = javaTopics.length;
  const javaDone = javaTopics.filter((t) => done.has(t.id)).length;
  const dsaTotal = dsaPatterns.length;
  const dsaDone = dsaPatterns.filter((p) => done.has(p.id)).length;
  const sdTotal = sdConcepts.length;
  const sdDone = sdConcepts.filter((c) => done.has(c.id)).length;
  const weekTotal = weeklyPlan.length;
  const weekDone = weeklyPlan.filter((w) => done.has(`week-${w.week}`)).length;
  const overall = Math.round(((javaDone + dsaDone + sdDone) / (javaTotal + dsaTotal + sdTotal)) * 100);

  const resetProgress = () => {
    setDone(new Set());
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-3">
          <span className="font-mono text-xs text-[var(--color-accent)]">Senior Engineer</span>
          <span className="font-mono text-xs text-[var(--color-text-faint)]">/</span>
          <span className="font-mono text-xs text-[var(--color-text-faint)]">Interview Roadmap</span>
        </div>
        <h1 className="mb-4 font-mono text-3xl font-black text-[var(--color-text-primary)] sm:text-4xl">
          <span className="text-[var(--color-accent)]">$</span> master_the_stack
        </h1>
        <p className="max-w-xl text-[var(--color-text-muted)]">
          A structured 12-week roadmap covering Java internals, DSA patterns, and system design
          for senior engineering interviews. Track your progress as you go.
        </p>
      </div>

      {/* Overall progress */}
      <div className="mb-8 rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-[var(--color-text-primary)]">Progress</span>
            <span className="font-mono text-lg font-black text-[#4ade80]">{overall}%</span>
          </div>
          <button
            onClick={resetProgress}
            className="font-mono text-xs text-[var(--color-text-faint)] hover:text-[var(--color-danger)] transition-colors cursor-pointer"
          >
            reset
          </button>
        </div>
        {/* Overall bar */}
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#4ade80] to-[#86efac] transition-all duration-700"
            style={{ width: `${overall}%` }}
          />
        </div>
        <div className="space-y-2">
          <ProgressBar done={javaDone} total={javaTotal} label="☕ Java" />
          <ProgressBar done={dsaDone} total={dsaTotal} label="🧩 DSA" />
          <ProgressBar done={sdDone} total={sdTotal} label="🏗️ System Design" />
          <ProgressBar done={weekDone} total={weekTotal} label="📅 Weeks" />
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap items-center gap-4 font-mono text-xs text-[var(--color-text-faint)]">
        <div className="flex items-center gap-1.5">
          <MustBeacon />
          <span>Must-know topic</span>
        </div>
        <span>·</span>
        <span className="text-green-400">Easy</span>
        <span className="text-amber-400">Medium</span>
        <span className="text-red-400">Hard</span>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-[var(--radius-md)] px-4 py-2 font-mono text-xs font-medium transition-all duration-200 cursor-pointer",
              activeTab === tab.id
                ? "bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/30"
                : "text-[var(--color-text-faint)] hover:text-[var(--color-text-secondary)] border border-transparent"
            )}
          >
            <span className="mr-1.5">{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "java" && <JavaTab done={done} onToggle={toggle} />}
        {activeTab === "dsa" && <DSATab done={done} onToggle={toggle} />}
        {activeTab === "systemdesign" && <SystemDesignTab done={done} onToggle={toggle} />}
        {activeTab === "plan" && <WeeklyPlanTab done={done} onToggle={toggle} />}
      </div>
    </div>
  );
}
