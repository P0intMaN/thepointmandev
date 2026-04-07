"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/courses", label: "Courses" },
  { href: "/dsa", label: "DSA" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-bg-border)] bg-[var(--color-bg-base)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="font-mono text-base font-bold no-underline hover:no-underline"
          >
            <span className="text-[var(--color-text-secondary)]">thepointman</span>
            <span className="text-[var(--color-accent)]">.dev</span>
            <span className="text-[var(--color-accent)] animate-pulse">_</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors no-underline hover:no-underline",
                    active
                      ? "text-[var(--color-text-primary)] font-medium"
                      : "text-[var(--color-text-faint)] hover:text-[var(--color-text-secondary)]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-faint)] transition-colors hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text-secondary)] no-underline"
            >
              <Search size={16} />
            </Link>
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-faint)] transition-colors hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text-secondary)] md:hidden cursor-pointer"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        links={navLinks}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
