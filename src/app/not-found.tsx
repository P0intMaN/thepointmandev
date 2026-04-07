import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 font-mono text-6xl font-black text-[var(--color-accent)]">404</p>
      <p className="mb-2 font-mono text-xl font-bold text-[var(--color-text-primary)]">
        page not found
      </p>
      <p className="mb-8 text-[var(--color-text-faint)]">
        This path doesn&apos;t exist. Maybe you took a wrong branch.
      </p>
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-4 font-mono text-sm text-[var(--color-text-faint)]">
        <span className="text-[var(--color-accent)]">$ </span>
        <span>cd </span>
        <Link href="/" className="text-[var(--color-accent)] no-underline hover:underline">
          ~/thepointman.dev
        </Link>
      </div>
    </div>
  );
}
