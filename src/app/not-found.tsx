import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-1 font-pixel text-[10px] text-[var(--color-text-faint)]">ERROR CODE</p>
      <p className="mb-4 font-pixel text-5xl text-[var(--color-danger)]">404</p>
      <p className="mb-2 font-pixel text-[10px] text-[var(--color-text-primary)]">
        PAGE NOT FOUND
      </p>
      <p className="mb-8 font-mono text-sm text-[var(--color-text-faint)]">
        This path doesn&apos;t exist. Maybe you took a wrong branch.
      </p>
      <div className="border-2 border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-4 font-mono text-sm text-[var(--color-text-faint)]" style={{ boxShadow: "4px 4px 0 0 #2e2e2e" }}>
        <span className="text-[var(--color-accent)]">$ </span>
        <span>cd </span>
        <Link href="/" className="text-[var(--color-accent)] no-underline hover:underline">
          ~/thepointman.dev
        </Link>
      </div>
      <Link
        href="/"
        className="pixel-btn mt-6 border-[var(--color-accent)] px-5 py-2 text-[var(--color-accent)] no-underline hover:no-underline"
      >
        ← GO HOME
      </Link>
    </div>
  );
}
