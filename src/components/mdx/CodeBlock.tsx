"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface PreProps extends HTMLAttributes<HTMLPreElement> {
  "data-language"?: string;
  "data-filename"?: string;
}

export function Pre({ children, className, ...props }: PreProps) {
  const [copied, setCopied] = useState(false);
  const language = props["data-language"];
  const filename = props["data-filename"];

  // Get raw text for copy by walking the pre element
  function copyCode(e: React.MouseEvent<HTMLButtonElement>) {
    const preEl = (e.currentTarget as HTMLElement).closest("[data-code-block]") as HTMLElement;
    const codeEl = preEl?.querySelector("code");
    const text = codeEl?.innerText ?? "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      data-code-block
      className="group relative my-6 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-code-border)]"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[var(--color-code-border)] bg-[#1c2128] px-4 py-2">
        <div className="flex items-center gap-2">
          {filename ? (
            <span className="font-mono text-xs text-[var(--color-text-faint)]">{filename}</span>
          ) : language ? (
            <span className="font-mono text-xs text-[var(--color-text-faint)]">{language}</span>
          ) : null}
        </div>
        <button
          onClick={copyCode}
          aria-label="Copy code"
          className={cn(
            "flex items-center gap-1.5 rounded px-2 py-1 font-mono text-xs transition-all duration-150 cursor-pointer",
            copied
              ? "text-[var(--color-accent)] opacity-100"
              : "text-[var(--color-text-faint)] opacity-0 group-hover:opacity-100 hover:text-[var(--color-text-muted)]"
          )}
        >
          {copied ? (
            <>
              <Check size={12} />
              <span>copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre
        className={cn(
          "overflow-x-auto bg-[var(--color-code-bg)] p-4 text-sm leading-relaxed",
          className
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

// Inline code (inside prose)
interface CodeProps extends HTMLAttributes<HTMLElement> {
  "data-language"?: string;
}

export function Code({ children, className, ...props }: CodeProps) {
  return (
    <code className={cn(className)} {...props}>
      {children}
    </code>
  );
}
