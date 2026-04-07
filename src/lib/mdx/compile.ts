import { compileMDX } from "next-mdx-remote/rsc";
import { remarkPlugins, rehypePlugins } from "./plugins";
import type { ComponentType } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentMap = Record<string, ComponentType<any>>;

export async function compileMdxContent(
  source: string,
  components: ComponentMap = {}
) {
  const { content, frontmatter } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins,
        rehypePlugins,
        format: "mdx",
      },
    },
    components,
  });

  return { content, frontmatter };
}
