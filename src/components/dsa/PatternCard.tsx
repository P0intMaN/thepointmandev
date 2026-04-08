"use client";

import Link from "next/link";
import type { DSAPattern } from "@/types/dsa";

// ── Icons ─────────────────────────────────────────────────────
const icons: Record<string, React.ReactNode> = {
  hash: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <rect x="6" y="6" width="10" height="10" rx="2" fill="currentColor" opacity="0.9"/>
      <rect x="19" y="6" width="10" height="10" rx="2" fill="currentColor" opacity="0.7"/>
      <rect x="32" y="6" width="10" height="10" rx="2" fill="currentColor" opacity="0.5"/>
      <rect x="6" y="19" width="10" height="10" rx="2" fill="currentColor" opacity="0.7"/>
      <rect x="19" y="19" width="10" height="10" rx="2" fill="currentColor" opacity="0.9"/>
      <rect x="32" y="19" width="10" height="10" rx="2" fill="currentColor" opacity="0.7"/>
      <rect x="6" y="32" width="10" height="10" rx="2" fill="currentColor" opacity="0.5"/>
      <rect x="19" y="32" width="10" height="10" rx="2" fill="currentColor" opacity="0.7"/>
      <rect x="32" y="32" width="10" height="10" rx="2" fill="currentColor" opacity="0.9"/>
    </svg>
  ),
  "two-pointers": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <circle cx="10" cy="24" r="5" fill="currentColor" opacity="0.9"/>
      <circle cx="38" cy="24" r="5" fill="currentColor" opacity="0.9"/>
      <path d="M15 24h18" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.5"/>
      <path d="M21 18l-6 6 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M27 18l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "sliding-window": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <rect x="4" y="16" width="40" height="16" rx="3" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <rect x="14" y="16" width="20" height="16" rx="3" fill="currentColor" opacity="0.25"/>
      <rect x="14" y="16" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M8 24h6M34 24h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <path d="M38 20l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "prefix-sum": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <path d="M10 10 L10 38 L38 24 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="currentColor" opacity="0.2"/>
      <path d="M10 10 L10 38 L38 24 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M22 17l4 7-4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
    </svg>
  ),
  stack: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <rect x="8" y="32" width="32" height="8" rx="2" fill="currentColor" opacity="0.9"/>
      <rect x="8" y="22" width="32" height="8" rx="2" fill="currentColor" opacity="0.65"/>
      <rect x="8" y="12" width="32" height="8" rx="2" fill="currentColor" opacity="0.4"/>
      <path d="M24 6v4M21 7l3-3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    </svg>
  ),
  "binary-search": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <line x1="24" y1="10" x2="24" y2="38" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
      <line x1="15" y1="10" x2="15" y2="38" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.3"/>
      <line x1="33" y1="10" x2="33" y2="38" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.3"/>
      <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.9"/>
    </svg>
  ),
  "linked-list": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <rect x="4" y="18" width="12" height="12" rx="3" fill="currentColor" opacity="0.9"/>
      <rect x="18" y="18" width="12" height="12" rx="3" fill="currentColor" opacity="0.65"/>
      <rect x="32" y="18" width="12" height="12" rx="3" fill="currentColor" opacity="0.4"/>
      <path d="M16 24h2M30 24h2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M44 24h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" strokeDasharray="2 2"/>
    </svg>
  ),
  tree: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <circle cx="24" cy="8" r="5" fill="currentColor" opacity="0.9"/>
      <circle cx="12" cy="26" r="5" fill="currentColor" opacity="0.7"/>
      <circle cx="36" cy="26" r="5" fill="currentColor" opacity="0.7"/>
      <circle cx="6" cy="41" r="4" fill="currentColor" opacity="0.5"/>
      <circle cx="18" cy="41" r="4" fill="currentColor" opacity="0.5"/>
      <path d="M24 13L12 21M24 13L36 21M12 31L6 37M12 31L18 37" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  bst: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <circle cx="24" cy="8" r="5" fill="currentColor" opacity="0.9"/>
      <circle cx="12" cy="26" r="5" fill="currentColor" opacity="0.7"/>
      <circle cx="36" cy="26" r="5" fill="currentColor" opacity="0.7"/>
      <path d="M24 13L12 21M24 13L36 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <text x="21" y="12" fontSize="6" fill="currentColor" opacity="0.9" fontFamily="monospace">n</text>
      <text x="9" y="30" fontSize="6" fill="currentColor" opacity="0.7" fontFamily="monospace">&lt;</text>
      <text x="33" y="30" fontSize="6" fill="currentColor" opacity="0.7" fontFamily="monospace">&gt;</text>
    </svg>
  ),
  heap: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <circle cx="24" cy="8" r="6" fill="currentColor" opacity="0.9"/>
      <circle cx="12" cy="24" r="5" fill="currentColor" opacity="0.65"/>
      <circle cx="36" cy="24" r="5" fill="currentColor" opacity="0.65"/>
      <circle cx="6" cy="38" r="4" fill="currentColor" opacity="0.4"/>
      <circle cx="18" cy="38" r="4" fill="currentColor" opacity="0.4"/>
      <circle cx="30" cy="38" r="4" fill="currentColor" opacity="0.4"/>
      <circle cx="42" cy="38" r="4" fill="currentColor" opacity="0.4"/>
      <path d="M24 14L12 19M24 14L36 19M12 29L6 34M12 29L18 34M36 29L30 34M36 29L42 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "graph-bfs": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <circle cx="24" cy="24" r="5" fill="currentColor" opacity="0.9"/>
      <circle cx="8" cy="14" r="4" fill="currentColor" opacity="0.65"/>
      <circle cx="40" cy="14" r="4" fill="currentColor" opacity="0.65"/>
      <circle cx="8" cy="34" r="4" fill="currentColor" opacity="0.65"/>
      <circle cx="40" cy="34" r="4" fill="currentColor" opacity="0.65"/>
      <path d="M19 22L12 17M29 22L36 17M19 26L12 31M29 26L36 31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <circle cx="8" cy="14" r="7" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
      <circle cx="40" cy="14" r="7" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
    </svg>
  ),
  "graph-dfs": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <circle cx="8" cy="8" r="5" fill="currentColor" opacity="0.9"/>
      <circle cx="24" cy="18" r="5" fill="currentColor" opacity="0.7"/>
      <circle cx="40" cy="10" r="5" fill="currentColor" opacity="0.5"/>
      <circle cx="32" cy="34" r="5" fill="currentColor" opacity="0.65"/>
      <circle cx="18" cy="40" r="4" fill="currentColor" opacity="0.4"/>
      <path d="M13 10L19 15M29 16L35 13M27 22L29 30M27 36L22 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <path d="M8 13 Q16 28 24 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" opacity="0.4"/>
    </svg>
  ),
  "topo-sort": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <circle cx="8" cy="24" r="5" fill="currentColor" opacity="0.9"/>
      <circle cx="24" cy="12" r="5" fill="currentColor" opacity="0.7"/>
      <circle cx="24" cy="36" r="5" fill="currentColor" opacity="0.7"/>
      <circle cx="40" cy="24" r="5" fill="currentColor" opacity="0.9"/>
      <path d="M13 24L19 15M13 24L19 33M29 14L35 21M29 34L35 27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M36 22l3 2-3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    </svg>
  ),
  backtracking: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <circle cx="24" cy="6" r="4" fill="currentColor" opacity="0.9"/>
      <circle cx="12" cy="20" r="4" fill="currentColor" opacity="0.7"/>
      <circle cx="36" cy="20" r="4" fill="currentColor" opacity="0.7"/>
      <circle cx="6" cy="34" r="3.5" fill="currentColor" opacity="0.5"/>
      <circle cx="18" cy="34" r="3.5" fill="currentColor" opacity="0.5"/>
      <circle cx="30" cy="34" r="3.5" fill="currentColor" opacity="0.5"/>
      <circle cx="42" cy="34" r="3.5" fill="currentColor" opacity="0.5"/>
      <path d="M24 10L12 16M24 10L36 16M12 24L6 30M12 24L18 30M36 24L30 30M36 24L42 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 34 Q12 42 6 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" opacity="0.5"/>
    </svg>
  ),
  "dp-1d": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <rect x="4" y="32" width="8" height="12" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="14" y="24" width="8" height="20" rx="1" fill="currentColor" opacity="0.55"/>
      <rect x="24" y="16" width="8" height="28" rx="1" fill="currentColor" opacity="0.7"/>
      <rect x="34" y="8" width="8" height="36" rx="1" fill="currentColor" opacity="0.9"/>
      <path d="M8 32L18 24L28 16L38 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
    </svg>
  ),
  "dp-2d": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <rect x="4" y="4" width="40" height="40" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <line x1="4" y1="17" x2="44" y2="17" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="4" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="17" y1="4" x2="17" y2="44" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="30" y1="4" x2="30" y2="44" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <rect x="5" y="5" width="11" height="11" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="18" y="5" width="11" height="11" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="5" y="18" width="11" height="11" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="18" y="18" width="11" height="11" rx="1" fill="currentColor" opacity="0.9"/>
      <rect x="31" y="31" width="11" height="11" rx="1" fill="currentColor" opacity="0.9"/>
      <path d="M10 10 L23 10 L23 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
    </svg>
  ),
  "union-find": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.9"/>
      <circle cx="36" cy="12" r="6" fill="currentColor" opacity="0.9"/>
      <circle cx="24" cy="36" r="6" fill="currentColor" opacity="0.7"/>
      <path d="M18 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 16L21 30M33 16L27 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  trie: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <circle cx="24" cy="6" r="4" fill="currentColor" opacity="0.9"/>
      <circle cx="10" cy="20" r="3.5" fill="currentColor" opacity="0.7"/>
      <circle cx="24" cy="20" r="3.5" fill="currentColor" opacity="0.7"/>
      <circle cx="38" cy="20" r="3.5" fill="currentColor" opacity="0.7"/>
      <circle cx="4" cy="34" r="3" fill="currentColor" opacity="0.5"/>
      <circle cx="16" cy="34" r="3" fill="currentColor" opacity="0.5"/>
      <circle cx="24" cy="34" r="3" fill="currentColor" opacity="0.5"/>
      <circle cx="38" cy="34" r="3" fill="currentColor" opacity="0.5"/>
      <path d="M24 10L10 17M24 10L24 17M24 10L38 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 23L4 31M10 23L16 31M24 23L24 31M38 23L38 31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  greedy: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <path d="M6 38 L14 22 L22 28 L32 14 L40 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
      <path d="M6 38 L14 22 L22 28 L32 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="32" cy="14" r="4" fill="currentColor" opacity="0.9"/>
      <path d="M29 11L32 14L35 11M29 17L32 14L35 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    </svg>
  ),
  dijkstra: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <circle cx="8" cy="24" r="5" fill="currentColor" opacity="0.9"/>
      <circle cx="40" cy="24" r="5" fill="currentColor" opacity="0.7"/>
      <circle cx="24" cy="8" r="5" fill="currentColor" opacity="0.6"/>
      <circle cx="24" cy="40" r="5" fill="currentColor" opacity="0.6"/>
      <path d="M13 24h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <path d="M24 13v22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <path d="M11 21L21 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
      <path d="M13 26l-2 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M13 24l12-2 8 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
    </svg>
  ),
  "segment-tree": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <rect x="18" y="4" width="12" height="8" rx="2" fill="currentColor" opacity="0.9"/>
      <rect x="6" y="18" width="12" height="8" rx="2" fill="currentColor" opacity="0.7"/>
      <rect x="30" y="18" width="12" height="8" rx="2" fill="currentColor" opacity="0.7"/>
      <rect x="2" y="32" width="8" height="8" rx="2" fill="currentColor" opacity="0.5"/>
      <rect x="12" y="32" width="8" height="8" rx="2" fill="currentColor" opacity="0.5"/>
      <rect x="26" y="32" width="8" height="8" rx="2" fill="currentColor" opacity="0.5"/>
      <rect x="38" y="32" width="8" height="8" rx="2" fill="currentColor" opacity="0.5"/>
      <path d="M24 12L12 18M24 12L36 18M12 26L6 32M12 26L16 32M36 26L30 32M36 26L42 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "monotonic-stack": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <rect x="6" y="36" width="7" height="8" rx="1" fill="currentColor" opacity="0.9"/>
      <rect x="15" y="28" width="7" height="16" rx="1" fill="currentColor" opacity="0.75"/>
      <rect x="24" y="20" width="7" height="24" rx="1" fill="currentColor" opacity="0.6"/>
      <rect x="33" y="12" width="7" height="32" rx="1" fill="currentColor" opacity="0.45"/>
      <path d="M9 36L18 28L27 20L36 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
      <path d="M38 10l2 2-2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "bellman-ford": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <circle cx="8" cy="24" r="5" fill="currentColor" opacity="0.9"/>
      <circle cx="40" cy="10" r="5" fill="currentColor" opacity="0.7"/>
      <circle cx="40" cy="38" r="5" fill="currentColor" opacity="0.7"/>
      <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.55"/>
      <path d="M13 24L20 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M28 22L35 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M28 26L35 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 19 Q20 8 35 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" opacity="0.4"/>
      <text x="12" y="18" fontSize="7" fill="currentColor" opacity="0.6" fontFamily="monospace">-1</text>
    </svg>
  ),
  "bit-manipulation": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <text x="4" y="20" fontSize="10" fill="currentColor" opacity="0.9" fontFamily="monospace">1010</text>
      <text x="4" y="34" fontSize="10" fill="currentColor" opacity="0.65" fontFamily="monospace">0110</text>
      <line x1="4" y1="37" x2="44" y2="37" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
      <text x="4" y="47" fontSize="10" fill="currentColor" opacity="0.9" fontFamily="monospace">1100</text>
      <text x="1" y="34" fontSize="8" fill="currentColor" opacity="0.5" fontFamily="monospace">^</text>
    </svg>
  ),
  math: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <text x="4" y="22" fontSize="14" fill="currentColor" opacity="0.9" fontFamily="monospace">∑</text>
      <text x="18" y="22" fontSize="10" fill="currentColor" opacity="0.7" fontFamily="monospace">n</text>
      <text x="26" y="22" fontSize="10" fill="currentColor" opacity="0.5" fontFamily="monospace">!</text>
      <text x="6" y="40" fontSize="10" fill="currentColor" opacity="0.7" fontFamily="monospace">gcd</text>
      <text x="28" y="40" fontSize="10" fill="currentColor" opacity="0.6" fontFamily="monospace">π</text>
      <circle cx="36" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
      <text x="33" y="16" fontSize="8" fill="currentColor" opacity="0.8" fontFamily="monospace">p</text>
    </svg>
  ),
  intervals: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <rect x="4" y="10" width="28" height="7" rx="3.5" fill="currentColor" opacity="0.5"/>
      <rect x="16" y="21" width="28" height="7" rx="3.5" fill="currentColor" opacity="0.75"/>
      <rect x="8" y="32" width="24" height="7" rx="3.5" fill="currentColor" opacity="0.9"/>
      <rect x="16" y="10" width="12" height="7" rx="3.5" fill="currentColor" opacity="0.3"/>
    </svg>
  ),
  mst: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <circle cx="24" cy="8" r="4" fill="currentColor" opacity="0.9"/>
      <circle cx="6" cy="36" r="4" fill="currentColor" opacity="0.7"/>
      <circle cx="42" cy="36" r="4" fill="currentColor" opacity="0.7"/>
      <circle cx="24" cy="36" r="4" fill="currentColor" opacity="0.6"/>
      <path d="M24 12L6 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M24 12L42 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M24 12L24 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" opacity="0.5"/>
      <text x="10" y="26" fontSize="7" fill="currentColor" opacity="0.7" fontFamily="monospace">2</text>
      <text x="34" y="26" fontSize="7" fill="currentColor" opacity="0.7" fontFamily="monospace">3</text>
    </svg>
  ),
  "string-algorithms": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <text x="4" y="16" fontSize="9" fill="currentColor" opacity="0.9" fontFamily="monospace">ABAB</text>
      <text x="4" y="30" fontSize="9" fill="currentColor" opacity="0.6" fontFamily="monospace">AB</text>
      <rect x="4" y="32" width="14" height="3" rx="1" fill="currentColor" opacity="0.3"/>
      <path d="M4 36h40" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
      <path d="M4 38 Q14 32 24 38 Q34 44 44 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <rect x="4" y="18" width="14" height="3" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="18" y="18" width="14" height="3" rx="1" fill="currentColor" opacity="0.3"/>
    </svg>
  ),
  "matrix-grid": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <rect x="4" y="4" width="40" height="40" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <line x1="4" y1="17" x2="44" y2="17" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <line x1="4" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <line x1="17" y1="4" x2="17" y2="44" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <line x1="30" y1="4" x2="30" y2="44" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <path d="M6 6 L15 6 L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
      <path d="M32 6 L42 6 L42 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
      <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.9"/>
      <circle cx="37" cy="37" r="2" fill="currentColor" opacity="0.9"/>
    </svg>
  ),
  sorting: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <rect x="4" y="38" width="8" height="6" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="14" y="30" width="8" height="14" rx="1" fill="currentColor" opacity="0.65"/>
      <rect x="24" y="22" width="8" height="22" rx="1" fill="currentColor" opacity="0.8"/>
      <rect x="34" y="14" width="8" height="30" rx="1" fill="currentColor" opacity="0.9"/>
      <path d="M6 22 L16 16 L26 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" strokeDasharray="3 2"/>
      <path d="M36 10l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
    </svg>
  ),
  "divide-conquer": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <rect x="16" y="4" width="16" height="8" rx="2" fill="currentColor" opacity="0.9"/>
      <rect x="4" y="20" width="16" height="8" rx="2" fill="currentColor" opacity="0.7"/>
      <rect x="28" y="20" width="16" height="8" rx="2" fill="currentColor" opacity="0.7"/>
      <path d="M24 12L12 20M24 12L36 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 36 Q24 30 36 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <path d="M20 28L24 36L28 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    </svg>
  ),
  "advanced-dp": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <rect x="4" y="4" width="18" height="18" rx="2" fill="currentColor" opacity="0.3"/>
      <rect x="26" y="4" width="18" height="18" rx="2" fill="currentColor" opacity="0.5"/>
      <rect x="4" y="26" width="18" height="18" rx="2" fill="currentColor" opacity="0.5"/>
      <rect x="26" y="26" width="18" height="18" rx="2" fill="currentColor" opacity="0.9"/>
      <path d="M22 13L26 13M13 22L13 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <path d="M22 35L26 35M35 22L35 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      <circle cx="35" cy="35" r="4" fill="currentColor" opacity="0.9"/>
    </svg>
  ),
  "advanced-graphs": (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <circle cx="8" cy="24" r="4" fill="currentColor" opacity="0.9"/>
      <circle cx="24" cy="8" r="4" fill="currentColor" opacity="0.7"/>
      <circle cx="40" cy="24" r="4" fill="currentColor" opacity="0.7"/>
      <circle cx="24" cy="40" r="4" fill="currentColor" opacity="0.6"/>
      <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.5"/>
      <path d="M12 24L20 24M28 24L36 24M24 12L24 20M24 28L24 36M11 21L21 11M37 21L27 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <path d="M36 21L37 21" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
    </svg>
  ),
};

const tierLabel: Record<number, string> = {
  1: "Fundamentals",
  2: "Intermediate",
  3: "Advanced",
};

interface PatternCardProps {
  pattern: DSAPattern;
}

export function PatternCard({ pattern }: PatternCardProps) {
  const { frontmatter, slug, problemCount } = pattern;
  const icon = icons[frontmatter.icon] ?? icons["hash"];

  return (
    <Link
      href={`/dsa/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl no-underline hover:no-underline transition-all duration-300"
      style={{
        background: `${frontmatter.color}08`,
        border: `1px solid ${frontmatter.color}20`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = `${frontmatter.color}10`;
        (e.currentTarget as HTMLElement).style.borderColor = `${frontmatter.color}35`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px 0 ${frontmatter.color}12`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = `${frontmatter.color}08`;
        (e.currentTarget as HTMLElement).style.borderColor = `${frontmatter.color}20`;
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Top accent line — thin and subtle */}
      <div
        className="h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, ${frontmatter.color}60, transparent)` }}
      />

      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Icon + tier */}
        <div className="flex items-start justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg p-2.5"
            style={{ background: `${frontmatter.color}10`, color: frontmatter.color }}
          >
            {icon}
          </div>
          <span
            className="rounded-full px-2.5 py-0.5 font-mono text-xs font-medium"
            style={{
              background: `${frontmatter.color}10`,
              color: `${frontmatter.color}cc`,
            }}
          >
            Tier {frontmatter.tier} · {tierLabel[frontmatter.tier]}
          </span>
        </div>

        {/* Title + description */}
        <div>
          <h3
            className="mb-1.5 font-mono text-lg font-bold transition-colors"
            style={{ color: frontmatter.color }}
          >
            {frontmatter.title}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            {frontmatter.description}
          </p>
        </div>

        {/* Signal preview */}
        <p className="font-mono text-xs leading-relaxed text-[var(--color-text-faint)] line-clamp-2">
          Signal: {frontmatter.signal}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t pt-3" style={{ borderColor: `${frontmatter.color}15` }}>
          <span className="font-mono text-xs text-[var(--color-text-faint)]">
            {problemCount} {problemCount === 1 ? "problem" : "problems"}
          </span>
          <span
            className="font-mono text-xs font-medium transition-colors"
            style={{ color: frontmatter.color }}
          >
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}
