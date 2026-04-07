"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { javaTopics, type Difficulty } from "@/app/roadmap/roadmapData";

// ─── Section graph data ───────────────────────────────────────────────────────

interface SectionNode {
  id: string;
  label: string;
  emoji: string;
  color: string;
  borderColor: string;
  textColor: string;
  glow: string;
  x: number;
  y: number;
  w: number;
  deps: string[];
  desc: string;
}

// Layout: 3 columns
// Col 0 (x=40):   Fundamentals
// Col 1 (x=400):  Java 8+, JVM Internals, Concurrency, Design Patterns
// Col 2 (x=760):  Advanced

const SECTION_NODES: SectionNode[] = [
  {
    id: "fundamentals",
    label: "Fundamentals",
    emoji: "🧱",
    color: "#0a1f14",
    borderColor: "#166534",
    textColor: "#4ade80",
    glow: "rgba(74,222,128,0.07)",
    x: 40, y: 190,
    w: 280,
    deps: [],
    desc: "OOP, Collections, Generics, Exceptions, Memory",
  },
  {
    id: "java8",
    label: "Java 8+",
    emoji: "⚡",
    color: "#0d1f36",
    borderColor: "#1e40af",
    textColor: "#60a5fa",
    glow: "rgba(96,165,250,0.07)",
    x: 400, y: 40,
    w: 280,
    deps: ["fundamentals"],
    desc: "Lambdas, Streams, Optional, CompletableFuture, Records",
  },
  {
    id: "jvm",
    label: "JVM Internals",
    emoji: "⚙️",
    color: "#1a1506",
    borderColor: "#713f12",
    textColor: "#fbbf24",
    glow: "rgba(251,191,36,0.07)",
    x: 400, y: 280,
    w: 280,
    deps: ["fundamentals"],
    desc: "ClassLoaders, GC Algorithms, JIT, Heap/Metaspace",
  },
  {
    id: "concurrency",
    label: "Concurrency",
    emoji: "🔀",
    color: "#1a0a24",
    borderColor: "#7e22ce",
    textColor: "#c084fc",
    glow: "rgba(192,132,252,0.07)",
    x: 400, y: 490,
    w: 280,
    deps: ["fundamentals", "java8", "jvm"],
    desc: "Threads, synchronized, j.u.c, Atomic, CompletableFuture",
  },
  {
    id: "patterns",
    label: "Design Patterns",
    emoji: "🏛️",
    color: "#0e1a1a",
    borderColor: "#0e7490",
    textColor: "#22d3ee",
    glow: "rgba(34,211,238,0.07)",
    x: 400, y: 680,
    w: 280,
    deps: ["fundamentals"],
    desc: "Singleton, Factory, Builder, Observer, Strategy, Proxy",
  },
  {
    id: "advanced",
    label: "Advanced / Spring",
    emoji: "🚀",
    color: "#1f0909",
    borderColor: "#991b1b",
    textColor: "#f87171",
    glow: "rgba(248,113,113,0.07)",
    x: 760, y: 340,
    w: 280,
    deps: ["java8", "jvm", "concurrency", "patterns"],
    desc: "Spring, JPA, Microservices, Kafka, Reactive, Docker",
  },
];

const NODE_MAP_J = Object.fromEntries(SECTION_NODES.map((n) => [n.id, n]));

// Heights per section (auto from topic count)
const SECTION_HEIGHTS: Record<string, number> = {
  fundamentals: 320,
  java8: 220,
  jvm: 185,
  concurrency: 180,
  patterns: 175,
  advanced: 310,
};

interface SectionEdge {
  id: string;
  sourceId: string;
  targetId: string;
}

function buildJEdges(): SectionEdge[] {
  const edges: SectionEdge[] = [];
  SECTION_NODES.forEach((n) => {
    n.deps.forEach((depId) => {
      edges.push({ id: `${depId}->${n.id}`, sourceId: depId, targetId: n.id });
    });
  });
  return edges;
}

const J_EDGES = buildJEdges();

const CANVAS_W_J = 1100;
const CANVAS_H_J = 960;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const diffDotColor: Record<Difficulty, string> = {
  Easy: "#4ade80",
  Medium: "#fbbf24",
  Hard: "#f87171",
};

function sectionTopics(sectionId: string) {
  const labelMap: Record<string, string> = {
    fundamentals: "Fundamentals",
    java8: "Java 8+",
    jvm: "JVM Internals",
    concurrency: "Concurrency",
    patterns: "Design Patterns",
    advanced: "Advanced",
  };
  return javaTopics.filter((t) => t.section === labelMap[sectionId]);
}

function edgePathJ(src: SectionNode, tgt: SectionNode): string {
  const sh = SECTION_HEIGHTS[src.id] ?? 200;
  const th = SECTION_HEIGHTS[tgt.id] ?? 200;

  // Source exits from right edge, vertically centred
  const sx = src.x + src.w;
  const sy = src.y + sh / 2;

  // Target enters from left edge, vertically centred — unless source is same column
  const tx = tgt.x;
  const ty = tgt.y + th / 2;

  const dx = Math.abs(tx - sx);
  const cp = Math.max(dx * 0.5, 80);

  return `M${sx},${sy} C${sx + cp},${sy} ${tx - cp},${ty} ${tx},${ty}`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props {
  done: Set<string>;
  onToggle: (id: string) => void;
}

export function JavaFlowGraph({ done, onToggle }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.72);
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const [selected, setSelected] = useState<SectionNode | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-jnode]")) return;
    setDragging(true);
    dragOrigin.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
  }, [pan]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: dragOrigin.current.px + e.clientX - dragOrigin.current.mx, y: dragOrigin.current.py + e.clientY - dragOrigin.current.my });
  }, [dragging]);

  const onMouseUp = useCallback(() => setDragging(false), []);

  const fitView = useCallback(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const s = Math.min((width - 32) / CANVAS_W_J, (height - 32) / CANVAS_H_J, 1);
    setZoom(s);
    setPan({ x: (width - CANVAS_W_J * s) / 2, y: (height - CANVAS_H_J * s) / 2 });
  }, []);

  useEffect(() => { fitView(); }, [fitView]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => Math.min(2, Math.max(0.25, z * (e.deltaY > 0 ? 0.92 : 1.09))));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  return (
    <div className="relative flex h-[680px] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-bg-border)]">

      {/* Dot grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: "#0a0a0a",
          backgroundImage: "radial-gradient(circle, #282828 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Canvas */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-10 select-none"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0", width: CANVAS_W_J, height: CANVAS_H_J, position: "relative" }}>

          {/* SVG edges */}
          <svg style={{ position: "absolute", inset: 0, width: CANVAS_W_J, height: CANVAS_H_J, overflow: "visible", pointerEvents: "none" }}>
            <defs>
              {SECTION_NODES.map((n) => (
                <marker key={n.id} id={`jarrow-${n.id}`} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M0,0 L0,6 L8,3 z" fill={n.textColor} opacity="0.55" />
                </marker>
              ))}
              {J_EDGES.map((e) => {
                const src = NODE_MAP_J[e.sourceId];
                const tgt = NODE_MAP_J[e.targetId];
                const sh = SECTION_HEIGHTS[src.id] ?? 200;
                const th = SECTION_HEIGHTS[tgt.id] ?? 200;
                return (
                  <linearGradient key={e.id} id={`jgrad-${e.id}`} gradientUnits="userSpaceOnUse"
                    x1={src.x + src.w} y1={src.y + sh / 2}
                    x2={tgt.x} y2={tgt.y + th / 2}
                  >
                    <stop offset="0%" stopColor={src.textColor} stopOpacity="0.65" />
                    <stop offset="100%" stopColor={tgt.textColor} stopOpacity="0.65" />
                  </linearGradient>
                );
              })}
            </defs>

            {J_EDGES.map((e) => {
              const src = NODE_MAP_J[e.sourceId];
              const tgt = NODE_MAP_J[e.targetId];
              const isHighlighted = selected && (selected.id === src.id || selected.id === tgt.id);
              return (
                <path
                  key={e.id}
                  d={edgePathJ(src, tgt)}
                  fill="none"
                  stroke={`url(#jgrad-${e.id})`}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  strokeOpacity={isHighlighted ? 1 : 0.35}
                  markerEnd={`url(#jarrow-${tgt.id})`}
                  style={{ transition: "stroke-opacity 0.2s, stroke-width 0.2s" }}
                />
              );
            })}
          </svg>

          {/* Section nodes */}
          {SECTION_NODES.map((node) => {
            const topics = sectionTopics(node.id);
            const doneCount = topics.filter((t) => done.has(t.id)).length;
            const nodeH = SECTION_HEIGHTS[node.id] ?? 200;
            const isSelected = selected?.id === node.id;
            const isRelated = selected
              ? selected.id === node.id || selected.deps.includes(node.id) || node.deps.includes(selected.id)
              : false;

            return (
              <div
                key={node.id}
                data-jnode="1"
                onClick={() => setSelected(isSelected ? null : node)}
                style={{
                  position: "absolute",
                  left: node.x,
                  top: node.y,
                  width: node.w,
                  height: nodeH,
                  borderRadius: 12,
                  border: `1.5px solid ${isSelected ? node.textColor : node.borderColor}`,
                  backgroundColor: node.color,
                  boxShadow: isSelected ? `0 0 0 1px ${node.textColor}30, 0 0 28px ${node.textColor}20` : "none",
                  opacity: !selected || isRelated ? 1 : 0.2,
                  transform: isSelected ? "scale(1.025)" : "scale(1)",
                  transition: "opacity 0.2s, transform 0.15s, box-shadow 0.15s",
                  cursor: "pointer",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  userSelect: "none",
                }}
              >
                {/* Colored top bar */}
                <div style={{ height: 3, backgroundColor: node.textColor, opacity: 0.8, flexShrink: 0 }} />

                {/* Header */}
                <div style={{ padding: "12px 14px 8px", borderBottom: `1px solid ${node.borderColor}50`, flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: node.textColor }}>
                      {node.emoji} {node.label}
                    </span>
                    <span style={{ fontFamily: "monospace", fontSize: 10, color: node.textColor, opacity: 0.7 }}>
                      {doneCount}/{topics.length}
                    </span>
                  </div>
                  <p style={{ fontSize: 10, color: "#666", marginTop: 3, fontFamily: "monospace" }}>{node.desc}</p>
                  {/* Mini progress bar */}
                  <div style={{ marginTop: 6, height: 2, borderRadius: 999, backgroundColor: "#222" }}>
                    <div style={{
                      height: "100%", borderRadius: 999,
                      backgroundColor: node.textColor,
                      width: `${topics.length ? (doneCount / topics.length) * 100 : 0}%`,
                      transition: "width 0.4s",
                    }} />
                  </div>
                </div>

                {/* Topics list */}
                <div style={{ flex: 1, overflowY: "hidden", padding: "8px 14px 10px" }}>
                  {topics.slice(0, 7).map((t) => {
                    const isDone = done.has(t.id);
                    return (
                      <div
                        key={t.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          padding: "2.5px 0",
                        }}
                      >
                        {/* Difficulty dot */}
                        <div style={{
                          width: 5, height: 5,
                          borderRadius: "50%",
                          backgroundColor: diffDotColor[t.difficulty],
                          flexShrink: 0,
                          opacity: isDone ? 0.3 : 0.85,
                        }} />
                        <span style={{
                          fontSize: 11,
                          color: isDone ? "#444" : "#aaa",
                          textDecoration: isDone ? "line-through" : "none",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}>
                          {t.topic}
                        </span>
                        {t.priority === "Must" && (
                          <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#4ade80", flexShrink: 0, opacity: 0.8 }} />
                        )}
                      </div>
                    );
                  })}
                  {topics.length > 7 && (
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: "#444", marginTop: 4 }}>
                      +{topics.length - 7} more topics
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2">
        <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-bg-border)] bg-[#111]">
          {[
            { label: "+", action: () => setZoom((z) => Math.min(2, z * 1.2)) },
            { label: "−", action: () => setZoom((z) => Math.max(0.25, z / 1.2)) },
          ].map(({ label, action }) => (
            <button key={label} onClick={action}
              className="w-8 h-8 font-mono text-sm text-[var(--color-text-faint)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-muted)] transition-colors cursor-pointer"
            >{label}</button>
          ))}
        </div>
        <button onClick={fitView} title="Fit view"
          className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-bg-border)] bg-[#111] text-[var(--color-text-faint)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-muted)] transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 4V1h3M10 1h3v3M13 10v3h-3M4 13H1v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-bg-border)] bg-[#111]">
          <span className="font-mono text-[9px] text-[var(--color-text-faint)]">{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-bg-border)] bg-[#111]/90 p-2.5 backdrop-blur-sm">
        {SECTION_NODES.map((n) => (
          <div key={n.id} className="flex items-center gap-2">
            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: n.textColor }} />
            <span style={{ fontFamily: "monospace", fontSize: 10, color: "#777" }}>{n.label}</span>
          </div>
        ))}
        <div className="mt-1 border-t border-[var(--color-bg-border)] pt-1 flex items-center gap-3 font-mono text-[9px] text-[var(--color-text-faint)]">
          <span style={{ color: "#4ade80" }}>● Easy</span>
          <span style={{ color: "#fbbf24" }}>● Med</span>
          <span style={{ color: "#f87171" }}>● Hard</span>
        </div>
        <div className="font-mono text-[9px] text-[var(--color-text-faint)]">
          click section · scroll to zoom
        </div>
      </div>
    </div>
  );
}
