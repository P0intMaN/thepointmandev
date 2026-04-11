import type { Metadata } from "next";
import { SupportCard } from "./SupportCard";

export const metadata: Metadata = {
  title: "uptime",
  description: "This site runs ad-free, tracking-free, and paywall-free. Keep it that way.",
};

function TerminalLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      className="opacity-0"
      style={{ animation: `terminal-in 0.4s ease forwards`, animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function UptimePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">

      {/* ── Terminal status window ─────────────────────────────────── */}
      <div className="mb-14 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-bg-border)] bg-[var(--color-bg-elevated)]">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-[var(--color-bg-border)] bg-[var(--color-bg-muted)] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-green-500/70" />
          <span className="ml-2 font-mono text-xs text-[var(--color-text-faint)]">bash — thepointman.dev</span>
        </div>

        {/* Terminal body */}
        <div className="space-y-1.5 p-6 font-mono text-sm">
          <TerminalLine delay={0}>
            <span className="text-[var(--color-accent)]">❯</span>
            <span className="ml-2 text-[var(--color-text-faint)]">systemctl status thepointman.dev</span>
          </TerminalLine>

          <TerminalLine delay={200}>
            <div className="mt-2 flex items-center gap-2">
              <span className="animate-pulse text-[var(--color-accent)]">●</span>
              <span className="font-semibold text-[var(--color-text-primary)]">thepointman.dev</span>
              <span className="text-[var(--color-text-faint)]">— deep dives for engineers</span>
            </div>
          </TerminalLine>

          <TerminalLine delay={350}>
            <div className="ml-5 space-y-1 text-xs text-[var(--color-text-faint)]">
              <div><span className="w-20 inline-block">Loaded:</span><span className="text-[var(--color-accent)]">enabled</span><span className="ml-2 opacity-50">(no ads, no tracking, no paywalls)</span></div>
              <div><span className="w-20 inline-block">Active:</span><span className="text-green-400">running</span><span className="ml-2 opacity-50">since boot</span></div>
              <div><span className="w-20 inline-block">Memory:</span><span className="text-[var(--color-warning)]">caffeine</span><span className="opacity-50 ml-2">+ community support</span></div>
              <div><span className="w-20 inline-block">CPU:</span><span className="text-[var(--color-info)]">curiosity</span><span className="opacity-50 ml-2">util: 100%</span></div>
            </div>
          </TerminalLine>

          <TerminalLine delay={600}>
            <div className="mt-3 flex items-center gap-1 text-xs text-[var(--color-text-faint)]">
              <span className="text-[var(--color-accent)]">❯</span>
              <span className="ml-1 opacity-60">_</span>
              <span
                className="inline-block h-3.5 w-[7px] translate-y-[1px] bg-[var(--color-accent)]"
                style={{ animation: "blink 1.1s step-end infinite" }}
              />
            </div>
          </TerminalLine>
        </div>
      </div>

      {/* ── The deal ──────────────────────────────────────────────── */}
      <div className="mb-14">
        <div className="mb-5 flex items-center gap-3">
          <span className="shrink-0 font-mono text-xs text-[var(--color-accent)]">{"// "}</span>
          <h2 className="shrink-0 font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-text-faint)]">The Deal</h2>
          <div className="h-px flex-1 bg-[var(--color-bg-border)]" />
        </div>
        <div className="space-y-3 font-mono text-sm leading-relaxed text-[var(--color-text-muted)]">
          <p><span className="text-[var(--color-text-faint)]">#</span> This site has no ads. No sponsored content. No cookie banners.</p>
          <p><span className="text-[var(--color-text-faint)]">#</span> Every write-up, course, and DSA breakdown is free to read, forever.</p>
          <p><span className="text-[var(--color-text-faint)]">#</span> Hosting, the domain, the late nights — covered out of pocket.</p>
          <p><span className="text-[var(--color-text-faint)]">#</span> If this site has helped you land a job or crack a system design round,</p>
          <p className="pl-4 text-[var(--color-text-primary)]">consider throwing a few dollars at the server bill.</p>
        </div>
      </div>

      {/* ── Support options ───────────────────────────────────────── */}
      <div className="mb-14">
        <div className="mb-5 flex items-center gap-3">
          <span className="shrink-0 font-mono text-xs text-[var(--color-accent)]">{"// "}</span>
          <h2 className="shrink-0 font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-text-faint)]">How to Help</h2>
          <div className="h-px flex-1 bg-[var(--color-bg-border)]" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
          <SupportCard
            cmd="$ paypal.sh --send"
            label="Send via PayPal"
            color="#009cde"
            href="https://paypal.me/pratheekunni"
            desc="No account needed if you have a card. Send what feels right. Even $3 keeps the DNS alive."
          />
          <SupportCard
            cmd="$ curl ko-fi"
            label="Buy me a coffee"
            color="#ff5e5b"
            href="https://ko-fi.com"
            desc="One-time or recurring. No account needed. Every cup counts."
            maintenance
          />
        </div>
      </div>

      {/* Final prompt */}
      <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-text-faint)]">
        <span className="text-[var(--color-accent)]">❯</span>
        <span className="opacity-50">your support keeps this running</span>
        <span
          className="inline-block h-3 w-[6px] translate-y-[1px] bg-[var(--color-accent)] opacity-70"
          style={{ animation: "blink 1.1s step-end infinite" }}
        />
      </div>

    </div>
  );
}
