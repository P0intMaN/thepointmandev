"use client";

import { useState, useEffect } from "react";

export function SpotifyPlayer() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("spotify-player-open");
    if (saved === "true") setOpen(true);
  }, []);

  function toggle() {
    setOpen((prev) => {
      const next = !prev;
      localStorage.setItem("spotify-player-open", String(next));
      return next;
    });
  }

  if (!mounted) return null;

  return (
    <>
      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes spotify-ring {
          0%   { transform: scale(1);   opacity: 0.55; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes spotify-ring2 {
          0%   { transform: scale(1);   opacity: 0.35; }
          100% { transform: scale(2.0); opacity: 0; }
        }
        .spotify-pill-glow {
          box-shadow:
            0 0 0 1px rgba(74,222,128,0.30),
            0 0 18px rgba(74,222,128,0.18),
            0 6px 24px rgba(0,0,0,0.6);
        }
        .spotify-pill-open {
          box-shadow:
            0 0 0 1px rgba(74,222,128,0.40),
            0 0 24px rgba(74,222,128,0.22),
            0 6px 24px rgba(0,0,0,0.6);
        }
      `}</style>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">

        {/* ── Expanded panel ───────────────────────────────────── */}
        <div
          style={{
            transition: "opacity 220ms ease, transform 220ms ease",
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0) scale(1)" : "translateY(10px) scale(0.96)",
            pointerEvents: open ? "auto" : "none",
            width: "min(340px, calc(100vw - 3rem))",
          }}
        >
          <div
            className="overflow-hidden rounded-xl border"
            style={{
              background: "rgba(18, 18, 18, 0.97)",
              borderColor: "rgba(74,222,128,0.18)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(74,222,128,0.06)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-3 py-2 border-b"
              style={{ borderColor: "rgba(74,222,128,0.10)" }}
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  />
                </span>
                <span className="font-mono text-xs" style={{ color: "var(--color-text-faint)" }}>
                  $ play --shuffle --bg
                </span>
              </div>
              <button
                onClick={toggle}
                className="flex h-5 w-5 items-center justify-center rounded text-xs transition-opacity hover:opacity-100 opacity-50"
                style={{ color: "var(--color-text-muted)" }}
                aria-label="Close player"
              >
                ✕
              </button>
            </div>

            {/* YouTube embed — responsive 16:9 */}
            <div className="p-2">
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "8px", overflow: "hidden" }}>
                <iframe
                  src="https://www.youtube.com/embed/videoseries?si=8AJQ6KK4aHudCwnl&list=PLrkzbaHCPxSTjf7yytLq_hO0VVSgjbNv3"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Toggle pill with attention-grabbing pulse ─────────── */}
        <div className="relative">
          {/* Concentric pulse rings — only when closed */}
          {!open && (
            <>
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  animation: "spotify-ring 2s ease-out infinite",
                  border: "1.5px solid rgba(74,222,128,0.5)",
                  animationDelay: "0s",
                }}
              />
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  animation: "spotify-ring2 2s ease-out infinite",
                  border: "1.5px solid rgba(74,222,128,0.3)",
                  animationDelay: "0.6s",
                }}
              />
            </>
          )}

          <button
            onClick={toggle}
            className={`relative flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs transition-all duration-200 ${open ? "spotify-pill-open" : "spotify-pill-glow"}`}
            style={{
              background: open
                ? "rgba(74,222,128,0.10)"
                : "rgba(14, 14, 14, 0.94)",
              borderColor: open
                ? "rgba(74,222,128,0.45)"
                : "rgba(74,222,128,0.28)",
              color: open
                ? "var(--color-accent)"
                : "var(--color-accent-muted)",
              backdropFilter: "blur(16px)",
            }}
            aria-label={open ? "Close Spotify player" : "Open Spotify player"}
          >
            {/* Music note icon */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>

            <span>
              {open ? "close player" : "Pure Trance. Hit play"}
            </span>

            {/* Chevron */}
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              style={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 220ms ease",
                opacity: 0.7,
              }}
            >
              <path
                d="M2 3.5L5 6.5L8 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
