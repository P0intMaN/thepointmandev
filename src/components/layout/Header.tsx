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
      <header className="sticky top-0 z-50 border-b-2 border-[var(--color-bg-border)] bg-[var(--color-bg-base)]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="font-pixel text-[9px] no-underline hover:no-underline leading-none"
          >
            <span className="text-[var(--color-text-primary)]">thepointman</span>
            <span className="text-[var(--color-accent)]">.dev</span>
            <span
              className="inline-block w-[7px] h-[11px] bg-[var(--color-accent)] ml-[2px] align-middle"
              style={{ animation: "pixel-blink 1s steps(1) infinite" }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-5 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-pixel text-[10px] tracking-wide no-underline hover:no-underline transition-colors",
                    active
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                  )}
                >
                  {active && <span className="mr-1">▶</span>}
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
              className="flex h-8 w-8 items-center justify-center border-2 border-transparent text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] no-underline transition-colors"
            >
              <Search size={14} />
            </Link>
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center border-2 border-transparent text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:hidden cursor-pointer transition-colors"
            >
              {mobileOpen ? <X size={14} /> : <Menu size={14} />}
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
