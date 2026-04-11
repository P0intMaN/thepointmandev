# thepointman.dev — Claude Instructions

## Project Overview

Developer blog at `C:\Dev\thepointmandev` — built with Next.js 15 App Router, Tailwind CSS v4, and MDX. Dark terminal-style aesthetic. No CMS — content lives in `/content` as `.mdx` files.

The blog at `C:\Dev\blog\` is a separate, earlier iteration. The active project is `thepointmandev`.

## Stack

- **Framework:** Next.js 15 App Router
- **Styling:** Tailwind CSS v4 (CSS-first, no config file) — design tokens in `src/app/globals.css` `@theme` block
- **MDX:** `next-mdx-remote` (RSC build) via custom `src/lib/mdx/` layer
- **Fonts:** Geist Sans + Geist Mono via `next/font/local`. Geist Mono is the default body font (terminal aesthetic)
- **Highlighting:** Shiki + rehype-pretty-code, theme: `github-dark-dimmed`
- **Search:** Fuse.js + pre-built JSON index

## Branches

- `main` — active development
- `feature/8bit-theme` — pixel/retro 8-bit theme experiment (Press Start 2P font, pixel cards, CRT scanlines). Has font-size fixes stashed — run `git stash pop` after switching.

## Content Structure

```
content/
├── blog/[slug]/index.mdx
├── courses/[course]/_meta.mdx + lessons
└── dsa/[category]/[slug].mdx
```

### DSA Write-ups

All content is written and complete. Source of truth for what problems exist: read the `content/dsa/` directory directly.

- Problems sort by `leetcodeNumber` frontmatter field ascending (no number sorts last)
- Add `leetcodeSlug` frontmatter when the filename doesn't match LeetCode's URL slug
- Source sheet: `~/Downloads/Senior_Interview_MasterSheet.xlsx`, sheet "🧩 DSA Patterns"

**Reading the Excel sheet:**
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

**Write-up format:**
1. Frontmatter: `leetcodeNumber`, `difficulty`, `timeComplexity`, `spaceComplexity`, `companies`, `tags`
2. Problem statement + examples in code blocks
3. Multiple approaches: brute force → optimal, each with code + explanation
4. Complexity comparison table
5. Key Insight section (the pattern/mental model)
6. Edge Cases

### Courses

Organised into category sections on the courses page (`SECTION_ORDER` in `src/app/courses/page.tsx`). Each course has its own `accent` hex color and `icon` in frontmatter — independent of the `level` field.

Current courses:
- **System Design:** `system-design-fundamentals`, `rate-limiting`
- **Data Structure Deep Dives:** `trees-in-depth`, `arrays-the-hard-way`

## Pages

- `/uptime` — terminal-style support/donate page. PayPal: `paypal.me/pratheekunni`. Ko-fi card present but in `maintenance` mode (dashed border + "coming soon" badge). No patron tiers — those were removed.
- Tags system removed entirely (`/tags` page and `TagBadge` component deleted).

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

**Animations in globals.css:** `blink`, `terminal-in`, `glow-pulse` — used by uptime page and header nav tab.

## Key Decisions

- **Custom `lib/mdx/` layer** — contentlayer2 is broken on Windows + Next.js 15
- **`output: export`** — static HTML export for GitHub Pages. All API routes need `export const dynamic = "force-static"`. No edge runtime. `sitemap.ts` and `robots.ts` also need `force-static`.
- **URL search params for filtering** — client-side via `useSearchParams()` in `BlogPosts`, `DSAPatterns`, `PatternProblems` wrapped in `<Suspense>`. Server-side `searchParams` incompatible with static export.
- **No `/api/og`** — incompatible with static export. Blog pages use `/og-default.png` fallback.
- **Search** — `/api/search` with `force-static` calls `buildSearchIndex()` at build time. Client fetches via `useSearch()` hook.
- **LeetCode URLs** — `frontmatter.leetcodeSlug ?? slug` in `DSACard.tsx` and `[slug]/page.tsx`.
- **No `@tailwindcss/typography`** — replaced by custom `Prose.tsx`
- **Active sidebar state** — `border-l-2` accent + 7% opacity tint. No solid fills.
- **Card text sizes** — labels: `text-sm`, descriptions: `text-base`. Never below `text-sm` for readable content.
- **Graph scroll** — use native `addEventListener("wheel", handler, { passive: false })` in `useEffect`. React's `onWheel` is passive.
- **Nested buttons** — use `<div role="button" tabIndex={0} onKeyDown={...}>` for outer wrapper.
- **MDX safe text** — `{...}`, `<word`, `<<`, `<digit`, `<-` cause parse errors outside code blocks. Wrap in backticks.
- **JSX comments** — raw `//` text inside JSX triggers `react/jsx-no-comment-textnodes`. Always write `{"// "}`.
- **Course card colors** — decoupled from `level`. Each course sets its own `accent` hex in frontmatter. `icon` field maps to named SVGs in `CourseCard.tsx`.
- **`SupportCard`** — client component (`"use client"`) in `src/app/uptime/`. Accepts `maintenance` prop for the dashed-border "coming soon" state.

## Preferences

- Code examples in Java (primary interview language)
- Write-ups: clear, practical, interview-focused — not academic
- Always start from brute force, progress to optimal
- Always include a `#` separator when encoding arrays as string keys to avoid hash collisions
