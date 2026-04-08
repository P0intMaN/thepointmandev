# thepointman.dev — Gemini Instructions

## Project Overview
Developer blog at `C:\Dev\thepointmandev`. Built with a dark terminal-style aesthetic. Content lives locally in `/content` as `.mdx` files (no CMS).

## Tech Stack
- **Framework:** Next.js 15 App Router
- **Styling:** Tailwind CSS v4 (CSS-first, no config file). Design tokens are in `src/app/globals.css` `@theme` block. No `@tailwindcss/typography` (use custom `Prose.tsx`).
- **MDX:** `next-mdx-remote` (RSC build) via custom `src/lib/mdx/` layer (contentlayer2 is broken on Windows + Next.js 15).
- **Fonts:** Geist Sans + Geist Mono via `next/font/local`. **Geist Mono** is the default body font.
- **Highlighting:** Shiki + rehype-pretty-code (`github-dark-dimmed` theme).
- **Search:** Fuse.js + pre-built JSON index. URL search params are used for filtering (server-rendered, SEO-friendly).

## Content Guidelines (DSA Write-ups)
- **Source of Truth:** The Excel sheet located at `~/Downloads/Senior_Interview_MasterSheet.xlsx` (specifically the "🧩 DSA Patterns" sheet) is the definitive source for problem ordering and patterns.
- Located in `content/dsa/[category]/[slug].mdx`. 
- **Language:** Code examples should be in **Java** (interview-focused, clear, practical).
- **Structure for every problem:**
  1. Frontmatter: `leetcodeNumber` (controls sort order), `difficulty`, `timeComplexity`, `spaceComplexity`, `companies`, `tags`.
  2. Problem statement + examples in code blocks.
  3. Approaches: Always start from brute force, progress to optimal. Each with code + explanation.
  4. Complexity comparison table.
  5. Key Insight section (pattern/mental model).
  6. Edge Cases.
- **Sorting:** DSA cards sort by `leetcodeNumber` ascending.

## Design & UI Tokens
- **Colors:** Base `#0d0d0d`, Elevated `#141414`, Border `#262626`, Text `#f1ecec`, Muted `#b7b1b1`, Accent (Terminal Green) `#4ade80`, Info (Cyan) `#67e8f9`, Warning (Amber) `#fbbf24`.
- **Typography:** Minimum readable size is `text-sm` (metadata/labels/tags). Descriptions/excerpts should be `text-base`.
- **Active States:** Nav/sidebar active states use left border accent (`border-l-2`) + subtle 7% opacity tint. No solid background fills.

## Technical Rules & Gotchas
- **Event Listeners:** Wheel events on pan/zoom graphs must use native `addEventListener("wheel", handler, { passive: false })` in `useEffect`. React's `onWheel` prop is passive and cannot call `preventDefault()`.
- **Accessibility:** Avoid nested `<button>` elements. Use `<div role="button" tabIndex={0} onKeyDown={...}>` for an outer wrapper if a clickable button must live inside.
- **Hashing/Keys:** Always include a `#` separator when encoding arrays as string keys to avoid hash collisions.
- **Branches:** `main` is the baseline UI. `feature/8bit-theme` is a retro experiment (run `git stash pop` after switching).
