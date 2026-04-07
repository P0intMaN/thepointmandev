"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: NavLink[];
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ links, open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      {/* Drawer */}
      <nav className="absolute left-0 right-0 top-14 border-b-2 border-[var(--color-bg-border)] bg-[var(--color-bg-base)] px-4 py-2" style={{ boxShadow: "0 8px 0 0 #2e2e2e" }}>
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 border-b-2 border-[var(--color-bg-border)] py-4 font-pixel text-[10px] no-underline hover:no-underline last:border-0",
                active ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {active && <span className="text-[var(--color-accent)]">▶</span>}
              {link.label.toUpperCase()}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
