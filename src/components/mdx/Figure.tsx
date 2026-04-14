import { FigureLightbox } from "./FigureLightbox";

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  label?: string;
}

export function Figure({ src, alt, caption, label }: FigureProps) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const resolvedSrc = `${base}${src}`;
  return (
    <figure className="my-8 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-bg-border)]">
      {/* Terminal chrome bar */}
      <div className="flex items-center justify-between border-b border-[var(--color-bg-border)] bg-[var(--color-bg-muted)] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-bg-border)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-bg-border)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-bg-border)]" />
        </div>
        {label && (
          <span className="font-mono text-xs text-[var(--color-text-faint)]">{label}</span>
        )}
      </div>

      {/* Image — clickable, opens lightbox */}
      <div className="flex items-center justify-center bg-[var(--color-bg-base)] p-6">
        <FigureLightbox src={resolvedSrc} alt={alt} />
      </div>

      {/* Caption */}
      {caption && (
        <figcaption className="border-t border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 font-mono text-xs text-[var(--color-text-faint)]">
          <span className="mr-1 text-[var(--color-accent)]">{"// "}</span>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
