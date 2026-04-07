import { compileMDX } from "next-mdx-remote/rsc";
import { remarkPlugins, rehypePlugins } from "@/lib/mdx/plugins";
import { Prose } from "@/components/ui/Prose";
import { Pre, Code } from "./CodeBlock";
import { Callout } from "./Callout";
import { H2, H3, H4 } from "./Heading";
import { Complexity } from "./ComplexityBadge";

const components = {
  // Override HTML elements
  pre: Pre,
  code: Code,
  h2: H2,
  h3: H3,
  h4: H4,
  // Custom MDX components (used as JSX in .mdx files)
  Callout,
  Complexity,
};

interface MDXContentProps {
  source: string;
}

export async function MDXContent({ source }: MDXContentProps) {
  const { content } = await compileMDX({
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

  return <Prose className="mx-auto">{content}</Prose>;
}
