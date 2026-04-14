"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface FigureLightboxProps {
  src: string;
  alt: string;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 6;
const SCROLL_SENSITIVITY = 0.0012;

export function FigureLightbox({ src, alt }: FigureLightboxProps) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Wheel zoom — must be non-passive to preventDefault
  useEffect(() => {
    if (!open || !containerRef.current) return;
    const el = containerRef.current;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScale(s => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s - e.deltaY * SCROLL_SENSITIVITY * s)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    dragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setAttribute("data-dragging", "true");
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setPos(p => ({ x: p.x + dx / scale, y: p.y + dy / scale }));
  };

  const onMouseUp = (e: React.MouseEvent) => {
    dragging.current = false;
    e.currentTarget.removeAttribute("data-dragging");
  };

  const resetZoom = () => { setScale(1); setPos({ x: 0, y: 0 }); };

  return (
    <>
      {/* Thumbnail wrapper — cursor signals it's clickable */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Open full-size image"
        className="relative cursor-zoom-in"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="block max-w-full" draggable={false} />

        {/* Zoom hint — visible at rest, fades on hover so it doesn't distract while reading */}
        <div className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1.5 rounded border border-[var(--color-bg-border)] bg-[var(--color-bg-muted)] px-2 py-1" style={{ animation: "border-pulse 2s ease-in-out infinite" }}>
          <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-accent)]" aria-hidden>
            <circle cx="6.5" cy="6.5" r="4"/>
            <line x1="10" y1="10" x2="14" y2="14"/>
            <line x1="4.5" y1="6.5" x2="8.5" y2="6.5"/>
            <line x1="6.5" y1="4.5" x2="6.5" y2="8.5"/>
          </svg>
          <span className="font-mono text-[10px] text-[var(--color-text-faint)]">click to zoom</span>
        </div>
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={close}
        >
          {/* Hint bar */}
          <p className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 select-none rounded border border-white/10 bg-black/50 px-3 py-1 font-mono text-[10px] text-white/40 whitespace-nowrap">
            scroll to zoom · drag to pan · click outside or esc to close
          </p>

          {/* Close button */}
          <button
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded border border-white/15 bg-black/60 font-mono text-xs text-white/50 transition-colors hover:border-white/30 hover:text-white/90 cursor-pointer"
            onClick={close}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Zoom reset */}
          {scale !== 1 && (
            <button
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded border border-white/15 bg-black/60 px-3 py-1 font-mono text-[10px] text-white/50 transition-colors hover:text-white/90 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); resetZoom(); }}
            >
              {Math.round(scale * 100)}% — click to reset
            </button>
          )}

          {/* Image container — intercepts wheel + drag */}
          <div
            ref={containerRef}
            className="select-none"
            style={{
              cursor: scale > 1 ? "grab" : "zoom-in",
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              draggable={false}
              className="max-h-[88vh] max-w-[92vw] rounded-[var(--radius-lg)] shadow-2xl"
              style={{
                transform: `scale(${scale}) translate(${pos.x}px, ${pos.y}px)`,
                transition: dragging.current ? "none" : "transform 0.15s ease",
                transformOrigin: "center center",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
