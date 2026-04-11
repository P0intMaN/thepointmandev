# thepointman.dev

```bash
❯ systemctl status thepointman.dev
● thepointman.dev — deep dives for engineers
   Loaded: enabled (no ads, no tracking, no paywalls)
   Active: running since boot
   Memory: caffeine + community support
      CPU: curiosity  util: 100%
```

A personal engineering blog covering system design, DSA patterns, and the things senior engineers actually think about. Every article, course, and write-up is free — forever.

**Live at:** [thepointman.dev](https://thepointman.dev)

---

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 — CSS-first, no config file |
| Content | MDX via `next-mdx-remote` (RSC build) |
| Syntax highlighting | Shiki + rehype-pretty-code (`github-dark-dimmed`) |
| Search | Fuse.js + build-time JSON index |
| Fonts | Geist Sans + Geist Mono |
| Deployment | GitHub Pages (`output: export`) |

No CMS. No database. No external build dependencies. Content lives in `/content` as plain `.mdx` files.

---

## Project Structure

```
thepointmandev/
├── content/
│   ├── blog/[slug]/index.mdx
│   ├── courses/[course]/_meta.mdx + lessons
│   └── dsa/[category]/[slug].mdx
│
└── src/
    ├── app/                    # Next.js App Router pages
    │   ├── blog/
    │   ├── courses/
    │   ├── dsa/
    │   ├── search/
    │   ├── about/
    │   └── uptime/             # support page
    ├── components/
    │   ├── layout/             # Header, Footer, MobileNav
    │   ├── mdx/                # MDXContent, CodeBlock, Callout, TOC
    │   ├── blog/               # ArticleCard, ArticleHeader
    │   ├── course/             # CourseCard, LessonNav
    │   └── dsa/                # DSACard, DSAPatterns
    └── lib/
        ├── mdx/                # custom content layer (getAllContent, compile, etc.)
        └── search/             # Fuse.js index builder + hook
```

---

## Content Sections

### Blog
Long-form tutorials and engineering deep-dives. Each post lives in `content/blog/[slug]/index.mdx` with frontmatter for title, date, tags, and optional series grouping.

### Courses
Structured multi-lesson learning paths, organised into categories:
- **System Design** — System Design Fundamentals, Rate Limiting
- **Data Structure Deep Dives** — Trees in Depth, Arrays the Hard Way

Each course has its own accent color and icon defined in frontmatter — independent of difficulty level.

### DSA
Problem write-ups organised by pattern (Two Pointers, Sliding Window, Binary Search, Trees, Graphs, DP, and more). Each write-up covers multiple approaches from brute force to optimal, with complexity analysis and a Key Insight section. Code examples in Java.

Problems sort by `leetcodeNumber` ascending within each pattern.

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000

# Build (static export)
npm run build

# Lint
npm run lint
```

Requires **Node.js 18+**.

---

## Adding Content

### New blog post

Create `content/blog/your-slug/index.mdx`:

```yaml
---
title: "Your Post Title"
description: "One or two sentence summary."
date: "2026-04-12"
tags: ["system-design", "databases"]
category: "System Design"
draft: false
---
```

### New DSA write-up

Create `content/dsa/[category]/problem-name.mdx`:

```yaml
---
title: "Two Sum"
description: "..."
date: "2026-04-12"
tags: ["array", "hash-map"]
category: "Arrays & Hashing"
difficulty: "easy"
timeComplexity: "O(n)"
spaceComplexity: "O(n)"
leetcodeNumber: 1
draft: false
---
```

### New course

1. Create `content/courses/your-course/_meta.mdx` with a course manifest
2. Add lesson files: `01-lesson-name.mdx`, `02-lesson-name.mdx`, ...
3. Add an entry to `SECTION_ORDER` in `src/app/courses/page.tsx`

---

## Design System

Dark terminal aesthetic. All tokens live in the `@theme` block in `src/app/globals.css`.

```
--color-bg-base:      #0d0d0d   page background
--color-bg-elevated:  #141414   cards
--color-bg-border:    #262626   borders
--color-text-primary: #f1ecec
--color-accent:       #4ade80   terminal green — links, active states
--color-info:         #67e8f9   cyan — DSA section
--color-warning:      #fbbf24   amber — courses section
```

Default body font is **Geist Mono** — intentional, reinforces the terminal feel.

---

## Deployment

The site builds as a fully static export (`output: export` in `next.config.ts`) and is hosted on GitHub Pages. No server required — every page is pre-rendered at build time.

```bash
npm run build
# → /out directory is the deployable artifact
```

---

## License

Content (articles, write-ups, course material) is © Pratheek Unni — all rights reserved.

Code (components, configuration, tooling) is MIT licensed.

---

```bash
❯ _
```
