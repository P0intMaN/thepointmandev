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
- **Java:** `spring-boot` (10 lessons — frameworks → EJBs → DI → IoC → ApplicationContext → XML hell → WAR/Tomcat → Spring Boot → Auto-config → Fat JAR)

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

## Injecting Images into Lessons

Use the `<Figure>` MDX component to embed images with a terminal-style frame and lightbox zoom.

**Usage in any `.mdx` file:**
```mdx
<Figure
  src="/diagrams/my-diagram.svg"
  alt="Description for screen readers"
  caption="Shown below the image as a // comment line"
  label="filename-shown-in-chrome-bar.svg"
/>
```

**Props:**
- `src` — path relative to `/public/` (e.g. `/diagrams/di-diagram.svg`)
- `alt` — required for accessibility
- `caption` — optional, rendered as `// caption text` in faint mono below image
- `label` — optional, shown top-right in the terminal chrome bar (use as a filename hint)

**Component files:**
- `src/components/mdx/Figure.tsx` — server component, renders the terminal frame + caption
- `src/components/mdx/FigureLightbox.tsx` — client component, handles click-to-open, scroll-to-zoom, drag-to-pan
- Registered in `src/components/mdx/MDXContent.tsx` as `Figure`

**Lightbox behaviour:**
- Thumbnail shows a `⊕ click to zoom` badge (bottom-right, dimmed at rest, full opacity on hover)
- Click opens a dark frosted overlay with the image centred
- Scroll wheel zooms in/out (0.5× – 6× range)
- Drag to pan when zoomed in
- Bottom pill shows current zoom % with a reset click target
- Escape / click backdrop / ✕ closes and resets zoom

**Diagrams live in `/public/diagrams/`**. Use dark-themed SVGs matching the site palette (`#141414` bg, `#4ade80` accent, `#f87171` for "bad" paths, `#262626` borders, monospace font).

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

## Course Lesson Writing Tone

When writing course lessons (not DSA write-ups), follow this narrative voice:

**Persona:** A patient, senior Google-level architect on a mission to take a complete beginner all the way to deep understanding. No hand-waving. No "just trust me." Every concept earns its place.

**Rules:**
- **Start from first principles.** Never assume the reader knows why something exists. Ask the underlying question before answering it.
- **Lead with the problem, not the solution.** Don't introduce Spring Boot by saying "Spring Boot does X." Introduce the pain that made Spring Boot inevitable.
- **Analogies before abstractions.** Every non-obvious concept gets a real-world analogy first. The Hollywood Principle, the restaurant kitchen, the chef who doesn't source ingredients — these land before the formal definition.
- **Show the wrong way first.** Naïve/incorrect approaches get code examples. Explain *why* they fail before showing the right approach. (e.g. the broken `minDepth` with `Math.min`, the tightly coupled `new UserRepository()` in a constructor.)
- **No stones left unturned.** Cover the concept, the history, the tradeoffs, the edge cases, and the mental model the reader should carry forward.
- **Connect everything.** After explaining a concept, link it to where it shows up elsewhere ("this is why Spring Boot's `@ConditionalOnMissingBean` exists", "this is what makes Docker packaging trivial").
- **Tone:** Conversational but precise. Write like you're pair-programming with someone smart who is new to the domain. No padding, no filler — but no skipping either.
- **End with a Key Takeaway** block that crystallises the entire lesson into 2-3 sentences.
- **Get your hands dirty.** Where a concept can be demonstrated by running something, run it. Don't just describe what `docker run` does — show the command, show the output, walk through what each line means. Theory and practice must arrive together. A concept explained without a working example is half a concept.
- **Build toward something real.** Individual commands and snippets should ladder up to something the reader could actually use. By the end of a practical section, the reader should have run something, seen it work, and understood *why* it worked — not just copied a recipe.
- **Narrate the terminal.** When showing shell commands, don't dump them bare. Explain what you're about to do, show the command, then explain what the output tells you. The reader should feel like they're sitting next to you at a terminal.
- **Expected output is not optional.** Show what success looks like. Show what failure looks like. If a command produces output the reader needs to interpret, include it and explain it line by line where necessary.

The measure of a good lesson: a reader with zero prior knowledge of the topic should finish it with a complete mental model, able to reason about new situations — not just repeat memorised facts. For practical topics, they should also be able to sit down at a terminal and do it themselves.
