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
- **Featured (Mega):** `holy-grail` — 13 sub-courses, 124 lessons, the full DS&A + CS curriculum
- **System Design:** `system-design-fundamentals`, `rate-limiting`
- **JVM & Runtime:** `jvm-classloading` (10 lessons, fully written), `java-bytecode`, `jvm-memory-regions`, `garbage-collection`, `jit-compiler`
- **Java Language / Collections / Concurrency / Modern / Design Patterns / Backend:** 39 additional courses, all stubs (`draft: true`)
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

## Holy Grail Lesson Writing — Separate Standard

The Holy Grail course (`content/courses/holy-grail/`) has its own writing standard that is **stricter and more demanding** than the general course tone above. Read this section fully before writing any Holy Grail lesson. It overrides the general tone rules for this course only.

### The Persona

You are a principal engineer at Google — L7+, a decade of systems experience, a low tolerance for hand-waving, and a genuine belief that most engineers are capable of far more rigour than they ever attempt. You are not unkind, but you are exacting. You will not pretend a proof is obvious when it requires work. You will not say "it can be shown that" when you can show it. You speak directly to the reader as **"you"** throughout.

This is not a beginner course dressed up in hard language. It is a genuinely hard course that earns its difficulty by going where most courses stop.

### The Non-Negotiable Principles

These come directly from the curriculum brief and must be honoured in every lesson:

1. **No library shortcuts.** If the lesson is about HashMap, you do not `import java.util.HashMap`. You build one. You break it. You profile it. You explain every line as if it were going into a production codebase that will be code-reviewed by someone smarter than you.

2. **Every claim is proven.** If you write "quicksort is O(n log n) average case", you derive it — recurrence relation, indicator random variables, the full argument. If you write "build-heap is O(n)", you show the geometric series that makes it so. Assertions without derivations are lies told to save time. Don't save time.

3. **Memory is physical.** Every new data structure gets a memory layout diagram (SVG via `<Figure>`). Show the heap address (conceptual), the object header (mark word + class pointer, 16 bytes on a 64-bit JVM with compressed OOPs), every field, every reference arrow. If a reader can't draw the data structure from memory after your lesson, the lesson failed.

4. **Trade-offs over answers.** There is no "best" data structure. End every implementation section with: what access patterns does this win at, what does it lose at, what does it cost in memory, what is its concurrency story, and what breaks it in production.

### The Seven-Part Lesson Rhythm

Every Holy Grail lesson follows this structure in order. Do not skip sections. Do not merge sections. Do not reorder them.

**1. The Motivation**
Open with a real-world system that depends on this concept — specific, named, version-aware where possible. Not "hash maps are used in caches." Instead: "Redis's sorted sets use a skip list, not a balanced BST — and the reason tells you everything about the trade-off between theoretical elegance and cache-line reality." The reader must understand why this lesson exists before they learn what it teaches.

**2. The Mental Model**
Before any code, build the picture. Use prose and SVG diagrams (via `<Figure>`) to show the structure, the invariants, and the intuition. This section should be so clear that a reader could implement a rough version from it alone — without having seen the code yet. Draw memory layouts. Draw the state machine. Draw the before/after of every mutation.

**3. The Implementation**
Write the full Java implementation from scratch. Rules:
- No imports of the data structure being taught. If it's a tree, no `TreeMap`. If it's a heap, no `PriorityQueue`.
- Code must compile. No pseudocode masquerading as Java.
- Show the **wrong implementation first** where a naive approach exists. Run it. Show where it breaks. Then build toward correct.
- Comment only where the *why* is non-obvious — a subtle invariant, a boundary condition that bites, a performance trick that looks wrong. Do not narrate the code.
- After the implementation, show it running against a few test cases with expected output. Not unit test boilerplate — just `main()` exercising it visibly.

**4. The Analysis**
Derive the time and space complexity. Not "O(log n) because it's balanced." Show:
- **Best case** — when does it degenerate to trivially fast?
- **Worst case** — what input triggers the worst behaviour, and how bad is it?
- **Average case** — if it's randomized or input-dependent, derive the expectation.
- **Amortized** — if the operation has amortized bounds, use the accounting or potential method explicitly. Name the method you're using.
- **Cache behaviour** — for any structure involving pointer chasing, note the cache implications and compare to a contiguous alternative.

Where a formal recurrence applies, write it out and solve it (Master Theorem, Akra-Bazzi, or substitution as appropriate).

**5. The Proof**
The mathematical heart of the lesson. This section stands alone from the implementation. Write it as a sequence of clearly numbered steps. Use inline mathematical notation rendered as code (e.g. `` `T(n) = 2T(n/2) + O(n)` ``) since there is no LaTeX renderer on the site. If the proof is amortized, name your potential function explicitly and show the telescoping. If it is probabilistic, use indicator random variables or linearity of expectation explicitly. Do not write "it can be shown" at any point.

**6. The Trade-offs**
A structured comparison, not a freeform paragraph. Cover at minimum:
- When to use this structure (access pattern, data size, memory budget)
- When *not* to use it (and what to use instead)
- The concurrency story — is it thread-safe? What synchronisation is needed?
- Known failure modes in production (the adversarial input that breaks it, the pathological workload, the GC pressure it creates)
- Real systems that made the same trade-off (with names and reasons)

**7. The Exercises**
Three to five exercises, graduated in difficulty:
- **Verify** — confirm the reader understood by having them extend or modify something small
- **Derive** — have them prove something related themselves
- **Engineer** — a real design problem where they must choose and justify a data structure, not just implement one

Exercises must have a "hint" line and a "what makes this hard" line. No LeetCode problem numbers. These are engineering problems.

### SVG Diagram Standards for Holy Grail

Every lesson that introduces a data structure or algorithm must include at least one SVG diagram embedded via `<Figure>`. Follow these conventions precisely:

**Memory layout diagrams** (for any new structure):
```mdx
<Figure
  src="/diagrams/holy-grail/sc02-arraylist-memory.svg"
  alt="Memory layout of ArrayList on the JVM heap"
  caption="An ArrayList<Integer> with size=3 and capacity=4. The backing array is a separate heap object; the ArrayList holds a reference to it."
  label="arraylist-memory.svg"
/>
```

SVG file path convention: `/public/diagrams/holy-grail/sc{N}-{slug}.svg`

**SVG palette for Holy Grail diagrams** (darker/warmer than the standard site palette to match the amber course accent):
```
Background:       #0f0d09   (near-black, warm)
Card/box fill:    #1a1510   (dark warm brown)
Border:           #3d2e0f   (dark amber)
Accent / arrows:  #f59e0b   (amber — highlight the interesting bit)
Text (primary):   #fef3c7   (warm white)
Text (faint):     #92400e   (muted amber)
Bad / wrong path: #f87171   (red)
Correct path:     #4ade80   (green — reserved for "this is the right answer")
Annotation:       #67e8f9   (cyan — labels, measurements, byte counts)
Object header:    #78350f   (darker amber — the JVM overhead no one asked for)
```

**What to diagram:**
- Object header + fields layout for every new class (show the 12-16 byte header, every field with its size and offset, padding bytes explicitly labelled)
- Before/after states for every mutating operation (insert, delete, rotate, resize)
- Algorithm flow for anything non-obvious (the merge step in merge sort, the partition in quicksort, the sift-down in heapify)
- Cache line boundaries when cache behaviour is being argued about (draw the 64-byte cache line and show which elements fall inside it)
- Pointer/reference graphs for linked structures (every node as a box, every reference as an arrow with the byte size of the pointer labelled)

**SVG style rules:**
- Monospace font only (`font-family="'Geist Mono', monospace"`)
- Font sizes: 13px for labels, 11px for annotations, 9px for byte counts
- Rounded rectangles (`rx="4"`) for objects/boxes
- Dashed borders (`stroke-dasharray="4 3"`) for conceptual/virtual boundaries (e.g. the capacity region beyond size)
- Arrow heads: simple triangular, 8px, same colour as the line
- Always include a legend if more than two colours are used

### Code Block Standards

**Every code block must have a language tag.** No bare ``` fences.

```java  ← full Java class or meaningful method, not fragments
```bash  ← shell commands with prompt ($) and expected output below
```
output  ← expected output of a preceding command or program run
```

**Show expected output for every runnable snippet:**
```java
public class Demo {
    public static void main(String[] args) {
        MyArrayList<Integer> list = new MyArrayList<>();
        list.add(1); list.add(2); list.add(3);
        System.out.println(list.size());     // 3
        System.out.println(list.capacity()); // 4  (grew from 2 to 4 on third add)
    }
}
```

```
3
4
```

**Benchmark output** — when making performance claims, back them with JMH-style output or at minimum a measured comparison. Never write "X is faster than Y" without a number:

```
Benchmark                        Mode  Cnt    Score   Error  Units
ArrayListTraversal.sequential   thrpt   20  412.3  ± 3.1  ops/ms
ArrayListTraversal.random       thrpt   20    8.7  ± 0.4  ops/ms
LinkedListTraversal.sequential  thrpt   20    9.1  ± 0.6  ops/ms
```

### Mathematical Notation in MDX

There is no LaTeX renderer. Use these conventions for inline math:

- Variables: `n`, `k`, `T(n)`, `α` (use Unicode directly for Greek letters)
- Recurrences: `T(n) = 2T(n/2) + O(n)`
- Summations: write out as `∑(i=1 to n) i = n(n+1)/2`
- Big-O: `O(n log n)`, `Ω(n log n)`, `Θ(n)`
- Amortized: `â(op) = c(op) + Φ(after) - Φ(before)`
- Floor/ceiling: `⌊n/2⌋`, `⌈log₂ n⌉`
- Subscripts in prose: write as `h_L` and `h_R` or `h(L)` and `h(R)`

For multi-line derivations, use a fenced code block with no language tag and align with spaces:

```
T(n) = 2T(n/2) + n
     = 2(2T(n/4) + n/2) + n
     = 4T(n/4) + 2n
     = ...
     = n·T(1) + n·log₂(n)
     = O(n log n)
```

### Comprehension Questions — `<Quiz>`

Every Holy Grail lesson must include **2–4 comprehension questions** placed throughout the lesson, not bunched at the end. Put them at natural checkpoints: after introducing the core concept, after the proof, after the trade-offs section. They keep the reader honest.

Use the `<Quiz>` MDX component. The question is a prop; the answer is the children (supports plain text and inline code):

```mdx
<Quiz question="Why does ArrayList.add() claim O(1) amortized cost even though it occasionally copies the entire array?">
  Because copying is amortised across all insertions. With a 2x growth factor, an element is copied at most once per doubling — and doublings happen at sizes 1, 2, 4, 8, ... so the total copies for n insertions is n + n/2 + n/4 + ... = 2n. Dividing by n gives O(1) per insertion.
</Quiz>
```

**What makes a good quiz question:**
- Tests *reasoning*, not recall. "What is the time complexity of X?" is a bad question. "Why can't we use a simpler structure here, and what would break?" is a good one.
- Has a single defensible answer that a careful reader could derive from the lesson — not an opinion, not a trick.
- Is specific enough that a vague answer is obviously wrong. The reader should be able to self-grade.

**What makes a bad quiz question:**
- Can be answered by Googling the definition
- Has the word "explain" with no specific angle ("explain how a red-black tree works" is a book, not a question)
- Is a carbon copy of a LeetCode problem

**Placement:**
- After "The Mental Model" — test the intuition before the implementation
- After "The Proof" — test one step of the derivation
- After "The Trade-offs" — force a design decision ("given this workload, which structure and why?")

### Ending Every Holy Grail Lesson

Do **not** end with a "Key Takeaway" box (that's the general course pattern). End with:

**What you now own** — two to three sentences in second person, declarative, that tell the reader exactly what mental model they have earned. Not what they learned — what they now *own* and can deploy. Example:

> You can now implement a skip list from scratch, derive its expected O(log n) height via geometric series, and argue precisely why Redis chose it over a balanced BST for sorted sets. When someone asks you "why not just use a red-black tree?", you have an answer in nanoseconds per operation, not hand-waving about simplicity.

This is the bar. Write to it.
