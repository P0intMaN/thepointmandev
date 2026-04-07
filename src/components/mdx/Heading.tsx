import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type HeadingLevel = "h2" | "h3" | "h4";

const styles: Record<HeadingLevel, string> = {
  h2: "mt-10 mb-4 text-2xl font-bold text-[var(--color-text-primary)] border-b border-[var(--color-bg-border)] pb-1",
  h3: "mt-7 mb-3 text-xl font-semibold text-[var(--color-text-primary)]",
  h4: "mt-5 mb-2 text-lg font-semibold text-[var(--color-text-muted)]",
};

function makeHeading(level: HeadingLevel) {
  const Tag = level;
  return function HeadingComponent({
    className,
    children,
    id,
    ...props
  }: HTMLAttributes<HTMLHeadingElement>) {
    return (
      <Tag
        id={id}
        className={cn(
          "group relative scroll-mt-20",
          styles[level],
          className
        )}
        {...props}
      >
        {id && (
          <a
            href={`#${id}`}
            className="absolute -left-5 top-1/2 -translate-y-1/2 pr-1 text-[var(--color-text-faint)] opacity-0 transition-opacity group-hover:opacity-100 no-underline hover:no-underline hover:text-[var(--color-accent)]"
            aria-label="Link to section"
          >
            #
          </a>
        )}
        {children}
      </Tag>
    );
  };
}

export const H2 = makeHeading("h2");
export const H3 = makeHeading("h3");
export const H4 = makeHeading("h4");
