import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";
import type { PluggableList } from "unified";

export const remarkPlugins: PluggableList = [remarkGfm];

export const rehypePlugins: PluggableList = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: "wrap",
      properties: {
        className: ["anchor-link"],
        ariaLabel: "Link to section",
      },
    },
  ],
  [
    rehypePrettyCode,
    {
      theme: "github-dark-dimmed",
      keepBackground: true,
      defaultLang: "plaintext",
      onVisitLine(node: { children: { type: string }[] }) {
        // Prevent empty lines from collapsing
        if (node.children.length === 0) {
          node.children = [{ type: "text" }];
        }
      },
    },
  ],
  [
    rehypeExternalLinks,
    {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    },
  ],
];
