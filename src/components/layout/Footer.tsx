import Link from "next/link";
import { GitFork, Rss } from "lucide-react";

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t-2 border-[var(--color-bg-border)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Pixel divider art */}
        <div className="mb-6 font-pixel text-[7px] text-[var(--color-text-faint)] overflow-hidden whitespace-nowrap">
          ════════════════════════════════════════════════════════════════════════
        </div>

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="font-pixel text-[8px] text-[var(--color-accent)]">THEPOINTMAN.DEV</p>
            <p className="mt-1 font-mono text-xs text-[var(--color-text-faint)]">
              © {year} — built with Next.js + ♥
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/rss.xml"
              aria-label="RSS Feed"
              className="text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-accent)] no-underline"
            >
              <Rss size={16} />
            </Link>
            <a
              href="https://www.linkedin.com/in/pratheek-unni/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-info)] no-underline"
            >
              <LinkedInIcon size={15} />
            </a>
            <a
              href="https://github.com/P0intMaN"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-text-secondary)] no-underline"
            >
              <GitFork size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
