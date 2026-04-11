"use client";

import Link from "next/link";

interface SupportCardProps {
  cmd: string;
  label: string;
  desc: string;
  href: string;
  color: string;
  maintenance?: boolean;
}

export function SupportCard({ cmd, label, desc, href, color, maintenance }: SupportCardProps) {
  if (maintenance) {
    return (
      <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-dashed border-yellow-900/50 bg-[var(--color-bg-elevated)] p-5 cursor-not-allowed">
        {/* Status banner */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-[var(--color-text-faint)] opacity-40">{cmd}</span>
          <span className="rounded border border-yellow-800/50 bg-yellow-950/40 px-2 py-0.5 font-mono text-[10px] text-yellow-400 tracking-wide">
            ⚙ coming soon
          </span>
        </div>
        <span className="text-sm font-semibold text-[var(--color-text-primary)] opacity-40">{label}</span>
        <span className="text-xs leading-relaxed text-[var(--color-text-muted)] opacity-40">{desc}</span>
        <span className="mt-auto font-mono text-xs text-[var(--color-text-faint)] opacity-40">
          setting up the coffee machine...
        </span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)] p-5 no-underline transition-all duration-300 hover:no-underline"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px 0 ${color}10`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "";
        (e.currentTarget as HTMLElement).style.boxShadow = "";
      }}
    >
      <span className="font-mono text-xs" style={{ color }}>{cmd}</span>
      <span className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</span>
      <span className="text-xs leading-relaxed text-[var(--color-text-muted)]">{desc}</span>
      <span className="mt-auto font-mono text-xs" style={{ color }}>open ↗</span>
    </Link>
  );
}
