"use client";

import React, { useState } from "react";

interface QuizProps {
  question: string;
  children: React.ReactNode;
}

export function Quiz({ question, children }: QuizProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="my-6 overflow-hidden rounded-[var(--radius-lg)] border"
      style={{
        borderColor: open ? "rgba(245,158,11,0.4)" : "rgba(245,158,11,0.15)",
        background: "#0f0d09",
        transition: "border-color 0.25s ease",
      }}
    >
      {/* Question */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start gap-3">
          {/* Badge */}
          <span
            className="mt-0.5 shrink-0 font-mono text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
            style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}
          >
            Q
          </span>
          {/* Question text */}
          <p className="text-sm leading-relaxed" style={{ color: "#fef3c7" }}>
            {question}
          </p>
        </div>
      </div>

      {/* Reveal button */}
      <div className="px-5 pb-4">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 font-mono text-xs font-semibold cursor-pointer border-none bg-transparent p-0 transition-opacity hover:opacity-70"
          style={{ color: "#f59e0b" }}
        >
          <span
            style={{
              display: "inline-block",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          >
            ›
          </span>
          {open ? "Hide answer" : "Reveal answer"}
        </button>
      </div>

      {/* Answer — grid trick for smooth height animation */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.3s ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div
            className="px-5 pb-5"
            style={{
              borderTop: "1px solid rgba(245,158,11,0.15)",
              paddingTop: "1rem",
            }}
          >
            {/* Amber left bar */}
            <div className="flex gap-3">
              <div
                className="w-0.5 shrink-0 rounded-full self-stretch"
                style={{ background: "rgba(245,158,11,0.4)" }}
              />
              <div
                className="text-sm leading-relaxed prose-answer"
                style={{ color: "#d4c4a0" }}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
