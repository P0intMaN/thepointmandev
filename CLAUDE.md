# thepointman.dev — Claude Instructions

## Project Overview

Developer blog at `C:\Dev\thepointmandev` — built with Next.js 15 App Router, Tailwind CSS v4, and MDX. Dark terminal-style aesthetic. No CMS — content lives in `/content` as `.mdx` files.

The blog at `C:\Dev\blog\` is a separate, earlier iteration. The active project is `thepointmandev`.

## Stack

- **Framework:** Next.js 15 App Router
- **Styling:** Tailwind CSS v4 (CSS-first, no config file) — design tokens in `src/app/globals.css` `@theme` block
- **MDX:** `next-mdx-remote` (RSC build) via custom `src/lib/mdx/` layer
- **Fonts:** Geist Sans + Geist Mono via `next/font/local`. Geist Mono is currently set as the **default body font** (terminal aesthetic)
- **Highlighting:** Shiki + rehype-pretty-code, theme: `github-dark-dimmed`
- **Search:** Fuse.js + pre-built JSON index

## Branches

- `main` — clean, non-themed baseline UI
- `feature/8bit-theme` — pixel/retro 8-bit theme experiment (Press Start 2P font, pixel cards, CRT scanlines). Has font-size fixes stashed — run `git stash pop` after switching to this branch.

## Content Structure

```
content/
├── blog/[slug]/index.mdx
├── courses/[course]/_meta.mdx + lessons
└── dsa/[category]/[slug].mdx
```

### DSA Write-ups

Located in `content/dsa/arrays/`. Written interactively — one problem at a time, user prompts "next" to continue.

**Arrays & Hashing section** (ordered by LeetCode number):
- ✅ `two-sum.mdx` — #1
- ✅ `contains-duplicate.mdx` — #217
- ✅ `group-anagrams.mdx` — #49
- ✅ `top-k-frequent-elements.mdx` — #347

**Two Pointers section** (ordered by LeetCode number):
- ✅ `valid-palindrome.mdx` — #125
- ✅ `two-sum-ii.mdx` — #167
- ✅ `container-with-most-water.mdx` — #11
- ✅ `3sum.mdx` — #15

**Binary Search section** (ordered by LeetCode number):
- ✅ `binary-search.mdx` — #704
- ✅ `sqrtx.mdx` — #69 (floating-point binary search)
- ✅ `search-a-2d-matrix.mdx` — #74
- ✅ `search-in-rotated-sorted-array.mdx` — #33
- ✅ `find-peak-element.mdx` — #162
- ✅ `koko-eating-bananas.mdx` — #875

**Linked List section** (ordered by LeetCode number):
- ✅ `merge-two-sorted-lists.mdx` — #21
- ✅ `linked-list-cycle.mdx` — #141
- ✅ `lru-cache.mdx` — #146
- ✅ `reverse-linked-list.mdx` — #206

**Trees — DFS & BFS section** (ordered by LeetCode number):
- ✅ `same-tree.mdx` — #100
- ✅ `binary-tree-level-order-traversal.mdx` — #102
- ✅ `maximum-depth-of-binary-tree.mdx` — #104
- ✅ `path-sum.mdx` — #112
- ✅ `invert-binary-tree.mdx` — #226
- ✅ `lowest-common-ancestor-of-a-binary-tree.mdx` — #236

**Binary Search Tree section** (ordered by LeetCode number):
- ✅ `validate-binary-search-tree.mdx` — #98
- ✅ `binary-search-tree-iterator.mdx` — #173
- ✅ `kth-smallest-element-in-a-bst.mdx` — #230
- ✅ `delete-node-in-a-bst.mdx` — #450

**Heap / Priority Queue section** (ordered by LeetCode number):
- ✅ `merge-k-sorted-lists.mdx` — #23
- ✅ `kth-largest-element-in-an-array.mdx` — #215
- ✅ `find-median-from-data-stream.mdx` — #295

**Graphs — BFS section** (ordered by LeetCode number):
- ✅ `number-of-islands.mdx` — #200
- ✅ `word-ladder.mdx` — #127
- ✅ `rotting-oranges.mdx` — #994

**Graphs — DFS section** (ordered by LeetCode number):
- ✅ `clone-graph.mdx` — #133
- ✅ `course-schedule.mdx` — #207
- ✅ `pacific-atlantic-water-flow.mdx` — #417
- ✅ `number-of-provinces.mdx` — #547

**Topological Sort section** (ordered by LeetCode number):
- ✅ `course-schedule-ii.mdx` — #210
- ✅ `minimum-height-trees.mdx` — #310
- ✅ `alien-dictionary.mdx` — #269

**Backtracking section** (ordered by LeetCode number):
- ✅ `combination-sum.mdx` — #39
- ✅ `n-queens.mdx` — #51
- ✅ `permutations.mdx` — #46
- ✅ `subsets.mdx` — #78
- ✅ `word-search.mdx` — #79

**Dynamic Programming — 1D section** (ordered by LeetCode number):
- ✅ `climbing-stairs.mdx` — #70
- ✅ `house-robber.mdx` — #198
- ✅ `coin-change.mdx` — #322
- ✅ `longest-increasing-subsequence.mdx` — #300

**Dynamic Programming — 2D section** (ordered by LeetCode number):
- ✅ `unique-paths.mdx` — #62
- ✅ `edit-distance.mdx` — #72
- ✅ `longest-common-subsequence.mdx` — #1143
- ✅ `01-knapsack.mdx` — (classic, no LeetCode number)

**Backtracking section** (ordered by LeetCode number):
- ✅ `combination-sum.mdx` — #39
- ✅ `n-queens.mdx` — #51
- ✅ `permutations.mdx` — #46 (already listed above, correct)
- ✅ `sudoku-solver.mdx` — #37

**Union-Find section**:
- ✅ `number-of-connected-components.mdx` — #323
- ✅ `redundant-connection.mdx` — #684
- ✅ `accounts-merge.mdx` — #721

**Trie section**:
- ✅ `implement-trie.mdx` — #208
- ✅ `add-and-search-words.mdx` — #211
- ✅ `word-search-ii.mdx` — #212
- ✅ `replace-words.mdx` — #648

**Segment Tree section** (order: 19):
- ✅ `_meta.mdx` — build/update/query/lazy/BIT templates
- ✅ `range-sum-query-mutable.mdx` — #307
- ✅ `count-of-smaller-numbers.mdx` — #315
- ✅ `falling-squares.mdx` — #699

**Monotonic Stack / Deque section** (order: 20):
- ✅ `_meta.mdx` — next greater template, deque sliding window template
- ✅ `trapping-rain-water.mdx` — #42
- ✅ `daily-temperatures.mdx` — #739
- ✅ `largest-rectangle-in-histogram.mdx` — #84
- ✅ `sliding-window-maximum.mdx` — #239

**Greedy section** (ordered by LeetCode number):
- ✅ `jump-game.mdx` — #55
- ✅ `jump-game-ii.mdx` — #45
- ✅ `merge-intervals.mdx` — #56
- ✅ `gas-station.mdx` — #134
- ✅ `candy.mdx` — #135
- ✅ `non-overlapping-intervals.mdx` — #435
- ✅ `meeting-rooms-ii.mdx` — #253

**Dijkstra's Algorithm section** (order: 22):
- ✅ `network-delay-time.mdx` — #743
- ✅ `cheapest-flights-within-k-stops.mdx` — #787
- ✅ `path-with-minimum-effort.mdx` — #1631

**Bellman-Ford / SPFA section** (order: 23):
- ✅ `_meta.mdx` — Bellman-Ford, hop-limited, SPFA, negative cycle detection
- ✅ `network-delay-time-bellman.mdx` — negative cycle detection
- ✅ `arbitrage-detection.mdx` — arbitrage via log-transform + Bellman-Ford

**Minimum Spanning Tree section** (order: 27):
- ✅ `_meta.mdx` — Kruskal's (sort+UF) and Prim's (min heap) templates
- ✅ `min-cost-to-connect-all-points.mdx` — #1584

**Bit Manipulation section** (order: 24):
- ✅ `_meta.mdx` — core bit ops, XOR properties, bitmask subsets, Brian Kernighan
- ✅ `single-number.mdx` — #136 (+ variants #137, #260)
- ✅ `number-of-1-bits.mdx` — #191
- ✅ `counting-bits.mdx` — #338
- ✅ `missing-number.mdx` — #268
- ✅ `reverse-bits.mdx` — #190
- ✅ `sum-of-two-integers.mdx` — #371

**Math & Number Theory section** (order: 25):
- ✅ `_meta.mdx` — GCD, sieve, fast exp, modular arithmetic
- ✅ `count-primes.mdx` — #204
- ✅ `pow-x-n.mdx` — #50
- ✅ `happy-number.mdx` — #202
- ✅ `gcd-of-strings.mdx` — #1071
- ✅ `integer-to-roman.mdx` — #12

**String Algorithms section** (order: 28):
- ✅ `_meta.mdx` — KMP, Rabin-Karp, palindrome expand, anagram detection
- ✅ `find-all-anagrams-in-a-string.mdx` — #438
- ✅ `longest-palindromic-substring.mdx` — #5
- ✅ `repeated-dna-sequences.mdx` — #187
- ✅ `implement-strstr.mdx` — #28

**Intervals section** (order: 26):
- ✅ `_meta.mdx` — merge template, overlap detection, coordinate sweep
- ✅ `insert-interval.mdx` — #57
- ✅ `merge-intervals.mdx` — #56
- ✅ `non-overlapping-intervals.mdx` — #435
- ✅ `meeting-rooms-i.mdx` — #252
- ✅ `meeting-rooms-ii.mdx` (also in greedy) — #253

**Matrix / Grid Problems section** (order: 30):
- ✅ `_meta.mdx` — rotation, spiral, direction arrays, cellular automata
- ✅ `spiral-matrix.mdx` — #54
- ✅ `rotate-image.mdx` — #48
- ✅ `game-of-life.mdx` — #289
- ✅ `set-matrix-zeroes.mdx` — #73

**Advanced DP section** (order: 31):
- ✅ `_meta.mdx` — Interval DP, Tree DP, Bitmask DP templates
- ✅ `palindrome-partitioning-ii.mdx` — #132
- ✅ `house-robber-iii.mdx` — #337 (+ House Robber II #213)
- ✅ `burst-balloons.mdx` — #312

**Sorting Algorithms section** (order: 32):
- ✅ `_meta.mdx` — Merge Sort, Quick Sort, QuickSelect, Dutch National Flag
- ✅ `sort-colors.mdx` — #75

**Divide and Conquer section** (order: 34):
- ✅ `_meta.mdx` — Master Theorem, Count Inversions, template

**Advanced Graph Algorithms section** (order: 35):
- ✅ `_meta.mdx` — Bridges, Articulation Points, SCC, Eulerian Path (Hierholzer's)
- ✅ `critical-connections-in-a-network.mdx` — #1192
- ✅ `reconstruct-itinerary.mdx` — #332

**Additional problems added across sections:**
- ✅ `dp-1d/word-break.mdx` — #139
- ✅ `dp-1d/decode-ways.mdx` — #91
- ✅ `dp-1d/maximum-product-subarray.mdx` — #152
- ✅ `dp-2d/burst-balloons.mdx` — #312
- ✅ `trees/binary-tree-right-side-view.mdx` — #199
- ✅ `trees/construct-binary-tree-from-preorder-and-inorder.mdx` — #105
- ✅ `linked-list/reorder-list.mdx` — #143
- ✅ `greedy/jump-game-ii.mdx` — #45
- ✅ `dijkstra/path-with-minimum-effort.mdx` — #1631

**Stack section** (ordered by LeetCode number):
- ✅ `valid-parentheses.mdx` — #20
- ✅ `min-stack.mdx` — #155
- ✅ `daily-temperatures.mdx` — #739
- ✅ `largest-rectangle-in-histogram.mdx` — #84

**Prefix Sum section** (ordered by LeetCode number):
- ✅ `subarray-sum-equals-k.mdx` — #560
- ✅ `range-sum-query.mdx` — #303
- ✅ `product-of-array-except-self.mdx` — #238

**Sliding Window section** (ordered by LeetCode number):
- ✅ `longest-substring-without-repeating-characters.mdx` — #3
- ✅ `minimum-window-substring.mdx` — #76
- ✅ `sliding-window-maximum.mdx` — #239

**Source of truth:** `~/Downloads/Senior_Interview_MasterSheet.xlsx`, sheet "🧩 DSA Patterns". Problems are ordered by LeetCode number within each pattern section.

**Reading the Excel sheet** (use openpyxl in Python with UTF-8 stdout):
```bash
python -c "
import openpyxl, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
wb = openpyxl.load_workbook('C:/Users/prath/Downloads/Senior_Interview_MasterSheet.xlsx', read_only=True, data_only=True)
ws = [s for s in wb if 'DSA' in s.title][0]
for row in ws.rows:
    vals = [str(c.value) if c.value else '' for c in row]
    if vals[0].strip().isdigit() or vals[1].strip():
        print(f'{vals[0]:4} | {vals[1]:45} | {vals[5]}')
" 2>&1
```

**Write-up format** (follow this structure for every problem):
1. Frontmatter with `leetcodeNumber` (controls sort order), `difficulty`, `timeComplexity`, `spaceComplexity`, `companies`, `tags`
2. Problem statement + examples in code blocks
3. Multiple approaches: brute force → optimal, each with code + explanation
4. Complexity comparison table
5. Key Insight section (the pattern/mental model to carry forward)
6. Edge Cases

**Sort order:** DSA cards sort by `leetcodeNumber` ascending (problems without one sort last). Do not change this.

## Design Tokens (globals.css)

```
--color-bg-base:      #0d0d0d
--color-bg-elevated:  #141414
--color-bg-border:    #262626
--color-text-primary: #f1ecec
--color-text-muted:   #b7b1b1
--color-accent:       #4ade80   ← terminal green
--color-info:         #67e8f9   ← cyan (DSA)
--color-warning:      #fbbf24   ← amber (courses)
```

## Key Decisions

- **Custom `lib/mdx/` layer** — contentlayer2 is broken on Windows + Next.js 15
- **URL search params for filtering** — server-rendered, bookmarkable, SEO-friendly
- **No `@tailwindcss/typography`** — replaced by custom `Prose.tsx`
- **Active sidebar state** — left border accent (`border-l-2`) + subtle 7% opacity tint. No solid background fills. This pattern applies to all nav/sidebar active states.
- **Card text sizes** — metadata/labels: `text-sm`, descriptions/excerpts: `text-base`, tags: `text-sm`. Do not go below `text-sm` for any user-readable card content.
- **Graph scroll** — wheel events on pan/zoom graphs use native `addEventListener("wheel", handler, { passive: false })` in `useEffect`. React's `onWheel` prop is passive and cannot call `preventDefault()`.
- **Nested buttons** — avoid `<button>` inside `<button>`. Use `<div role="button" tabIndex={0} onKeyDown={...}>` for the outer wrapper when a clickable `<button>` must live inside.

## Preferences

- Code examples in Java (the user's primary interview language)
- Write-ups are clear, practical, interview-focused — not academic
- Multiple approaches per problem: always start from brute force, progress to optimal
- Always include a `#` separator when encoding arrays as string keys to avoid hash collisions
