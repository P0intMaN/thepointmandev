import GithubSlugger from "github-slugger";

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  const slugger = new GithubSlugger();
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2]
      .replace(/\*\*([^*]*)\*\*/g, "$1")
      .replace(/`([^`]*)`/g, "$1")
      .trim();
    const id = slugger.slug(text);

    items.push({ id, text, level });
  }

  return items;
}
