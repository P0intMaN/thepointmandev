"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { sdConcepts, type SDType } from "@/app/roadmap/roadmapData";

// ─── Graph layout groups ──────────────────────────────────────────────────────
// Col 0 (Foundation): scalability, load-bal, caching, sharding, sql/nosql, replication, CAP, consistency, ACID/BASE, back-of-envelope, PACELC
// Col 1 (Services):   API, MQ, microservices, service-disc, dist-tx, indexing, rate-limit, circuit-breaker, CDN, search, bloom, consistent-hashing
// Col 2 (Problems):   s19–s35

const FOUNDATION_IDS = ["s01","s02","s03","s04","s05","s06","s07","s08","s38","s36","s37"];
const SERVICES_IDS   = ["s09","s10","s11","s12","s13","s14","s15","s16","s17","s18","s39","s40"];
const PROBLEMS_IDS   = ["s19","s20","s21","s22","s23","s24","s25","s26","s27","s28","s29","s30","s31","s32","s33","s34","s35"];

type ColIndex = 0 | 1 | 2;

function getCol(id: string): ColIndex {
  if (FOUNDATION_IDS.includes(id)) return 0;
  if (SERVICES_IDS.includes(id))   return 1;
  return 2;
}

// ─── Dependency edges ─────────────────────────────────────────────────────────
// Format: [sourceId, targetId]
const EDGES: [string, string][] = [
  // Foundation → Services
  ["s01","s11"], // Scalability → Microservices
  ["s02","s12"], // Load Balancing → Service Discovery
  ["s03","s40"], // Caching → Consistent Hashing
  ["s04","s40"], // Sharding → Consistent Hashing
  ["s05","s13"], // SQL/NoSQL → Distributed Transactions
  ["s07","s08"], // CAP → Consistency Patterns
  ["s07","s13"], // CAP → Distributed TX
  ["s36","s15"], // Back-of-Envelope → Rate Limiting (sizing matters)

  // Foundation → Problems
  ["s36","s19"], // Back-of-Envelope → URL Shortener
  ["s36","s20"], // Back-of-Envelope → Twitter Feed
  ["s03","s22"], // Caching → Distributed Cache
  ["s03","s19"], // Caching → URL Shortener

  // Services → Problems
  ["s09","s19"], // API → URL Shortener
  ["s09","s21"], // API → Rate Limiter
  ["s09","s23"], // API → Notification
  ["s09","s29"], // API → Chat
  ["s10","s20"], // MQ → Twitter Feed
  ["s10","s23"], // MQ → Notification
  ["s10","s27"], // MQ → YouTube
  ["s10","s35"], // MQ → Ad Aggregator
  ["s12","s22"], // Service Discovery → Distributed Cache
  ["s13","s31"], // Distributed TX → Google Docs
  ["s13","s33"], // Distributed TX → Payment
  ["s14","s25"], // Indexing → Autocomplete
  ["s14","s30"], // Indexing → Dropbox
  ["s14","s35"], // Indexing → Ad Aggregator
  ["s15","s21"], // Rate Limiting → Rate Limiter design
  ["s16","s32"], // Circuit Breaker → Stock Exchange
  ["s17","s27"], // CDN → YouTube
  ["s17","s30"], // CDN → Dropbox
  ["s18","s25"], // Search → Autocomplete
  ["s40","s22"], // Consistent Hashing → Distributed Cache
  ["s40","s24"], // Consistent Hashing → KV Store
];

// ─── Layout constants ─────────────────────────────────────────────────────────

const NW = 256;
const NODE_H_FOUND = 68;
const NODE_H_SERV  = 68;
const NODE_H_PROB  = 66;

const COL_X = [40, 384, 728];

const nodeH = (id: string) =>
  FOUNDATION_IDS.includes(id) ? NODE_H_FOUND :
  SERVICES_IDS.includes(id)   ? NODE_H_SERV  : NODE_H_PROB;

// Build positions
interface GraphNode {
  id: string;
  concept: string;
  type: SDType;
  col: ColIndex;
  x: number;
  y: number;
  h: number;
}

function buildSDNodes(): GraphNode[] {
  const allNodes: GraphNode[] = [];
  const colCounts: Record<ColIndex, number> = { 0: 0, 1: 0, 2: 0 };
  const STEP: Record<ColIndex, number> = { 0: 84, 1: 84, 2: 76 };
  const START_Y = 44;

  // Order by their defined group arrays
  const ordered = [
    ...FOUNDATION_IDS.map((id) => sdConcepts.find((c) => c.id === id)!),
    ...SERVICES_IDS.map((id) => sdConcepts.find((c) => c.id === id)!),
    ...PROBLEMS_IDS.map((id) => sdConcepts.find((c) => c.id === id)!),
  ].filter(Boolean);

  ordered.forEach((c) => {
    const col = getCol(c.id);
    const h = nodeH(c.id);
    allNodes.push({
      id: c.id,
      concept: c.concept,
      type: c.type,
      col,
      x: COL_X[col],
      y: START_Y + colCounts[col] * STEP[col],
      h,
    });
    colCounts[col]++;
  });
  return allNodes;
}

const ALL_NODES = buildSDNodes();
const NODE_MAP  = Object.fromEntries(ALL_NODES.map((n) => [n.id, n]));

const CANVAS_W = COL_X[2] + NW + 44;
const CANVAS_H = Math.max(
  44 + FOUNDATION_IDS.length * 84 + 40,
  44 + SERVICES_IDS.length   * 84 + 40,
  44 + PROBLEMS_IDS.length   * 76 + 40,
);

// ─── Colour helpers ───────────────────────────────────────────────────────────

const colAccent: Record<ColIndex, string> = {
  0: "#4ade80",  // green — foundation
  1: "#67e8f9",  // cyan — services
  2: "#c084fc",  // purple — problems
};
const colBorder: Record<ColIndex, string> = {
  0: "#166534",
  1: "#155e75",
  2: "#6b21a8",
};
const colBg: Record<ColIndex, string> = {
  0: "#091a0e",
  1: "#071820",
  2: "#130c1f",
};
const typeLabel: Record<SDType, string> = {
  Concept: "Concept",
  Design:  "Design",
  Math:    "Math",
};
const typeBadge: Record<SDType, string> = {
  Concept: "text-cyan-400 border-cyan-900 bg-cyan-950/30",
  Design:  "text-purple-400 border-purple-900 bg-purple-950/30",
  Math:    "text-amber-400 border-amber-900 bg-amber-950/30",
};

// ─── Bezier edge ──────────────────────────────────────────────────────────────

function bezier(src: GraphNode, tgt: GraphNode): string {
  const sx = src.x + NW;
  const sy = src.y + src.h / 2;
  const tx = tgt.x;
  const ty = tgt.y + tgt.h / 2;
  const dx = Math.abs(tx - sx);
  const cp = Math.max(dx * 0.45, 60);
  return `M${sx},${sy} C${sx + cp},${sy} ${tx - cp},${ty} ${tx},${ty}`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props {
  done: Set<string>;
  onToggle: (id: string) => void;
}

export function SDFlowGraph({ done, onToggle }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan,      setPan]      = useState({ x: 0, y: 0 });
  const [zoom,     setZoom]     = useState(0.72);
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const [selected, setSelected] = useState<GraphNode | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-sdnode]")) return;
    setDragging(true);
    dragOrigin.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
  }, [pan]);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: dragOrigin.current.px + e.clientX - dragOrigin.current.mx, y: dragOrigin.current.py + e.clientY - dragOrigin.current.my });
  }, [dragging]);
  const onMouseUp = useCallback(() => setDragging(false), []);
  const onWheel   = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(2, Math.max(0.25, z * (e.deltaY > 0 ? 0.92 : 1.09))));
  }, []);

  const fitView = useCallback(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const s = Math.min((width - 32) / CANVAS_W, (height - 32) / CANVAS_H, 1);
    setZoom(s);
    setPan({ x: (width - CANVAS_W * s) / 2, y: (height - CANVAS_H * s) / 2 });
  }, []);

  useEffect(() => { fitView(); }, [fitView]);

  const isRelated = (node: GraphNode) => {
    if (!selected) return true;
    if (selected.id === node.id) return true;
    if (EDGES.some(([s, t]) => (s === selected.id && t === node.id) || (t === selected.id && s === node.id))) return true;
    return false;
  };

  return (
    <div className="relative flex h-[720px] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-bg-border)]">

      {/* Dot grid */}
      <div className="absolute inset-0 z-0" style={{
        backgroundColor: "#0a0a0a",
        backgroundImage: "radial-gradient(circle, #282828 1.2px, transparent 1.2px)",
        backgroundSize: "28px 28px",
      }} />

      {/* Canvas */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-10 select-none"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
      >
        <div style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`, transformOrigin: "0 0", width: CANVAS_W, height: CANVAS_H, position: "relative" }}>

          {/* SVG edges */}
          <svg style={{ position: "absolute", inset: 0, width: CANVAS_W, height: CANVAS_H, overflow: "visible", pointerEvents: "none" }}>
            <defs>
              {([0,1,2] as ColIndex[]).map((col) => (
                <marker key={col} id={`sdarrow-${col}`} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M0,0 L0,6 L8,3 z" fill={colAccent[col]} opacity="0.5" />
                </marker>
              ))}
              {EDGES.map(([sid, tid]) => {
                const src = NODE_MAP[sid];
                const tgt = NODE_MAP[tid];
                if (!src || !tgt) return null;
                return (
                  <linearGradient key={`${sid}-${tid}`} id={`sdgrad-${sid}-${tid}`} gradientUnits="userSpaceOnUse"
                    x1={src.x + NW} y1={src.y + src.h / 2}
                    x2={tgt.x} y2={tgt.y + tgt.h / 2}
                  >
                    <stop offset="0%"   stopColor={colAccent[src.col]} stopOpacity="0.7" />
                    <stop offset="100%" stopColor={colAccent[tgt.col]} stopOpacity="0.7" />
                  </linearGradient>
                );
              })}
            </defs>

            {EDGES.map(([sid, tid]) => {
              const src = NODE_MAP[sid];
              const tgt = NODE_MAP[tid];
              if (!src || !tgt) return null;
              const highlighted = selected && (selected.id === sid || selected.id === tid);
              const faded = selected && !highlighted;
              return (
                <path
                  key={`${sid}-${tid}`}
                  d={bezier(src, tgt)}
                  fill="none"
                  stroke={`url(#sdgrad-${sid}-${tid})`}
                  strokeWidth={highlighted ? 2.5 : 1.3}
                  strokeOpacity={faded ? 0.07 : highlighted ? 1 : 0.3}
                  markerEnd={`url(#sdarrow-${tgt.col})`}
                  style={{ transition: "stroke-opacity 0.2s, stroke-width 0.2s" }}
                />
              );
            })}
          </svg>

          {/* Column headers */}
          {([
            { col: 0 as ColIndex, label: "Foundation" },
            { col: 1 as ColIndex, label: "Services" },
            { col: 2 as ColIndex, label: "Design Problems" },
          ] as const).map(({ col, label }) => (
            <div key={col} style={{ position: "absolute", left: COL_X[col], top: 10, width: NW, textAlign: "center" }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: colAccent[col], textTransform: "uppercase" }}>
                {label}
              </span>
            </div>
          ))}

          {/* Nodes */}
          {ALL_NODES.map((node) => {
            const isDone     = done.has(node.id);
            const isSelected = selected?.id === node.id;
            const related    = isRelated(node);
            const accent     = colAccent[node.col];

            return (
              <div
                key={node.id}
                data-sdnode="1"
                onClick={() => setSelected(isSelected ? null : node)}
                style={{
                  position: "absolute",
                  left: node.x, top: node.y,
                  width: NW, height: node.h,
                  borderRadius: 9,
                  border: `1px solid ${isSelected ? accent : colBorder[node.col]}`,
                  backgroundColor: isSelected ? colBg[node.col] : "#111",
                  boxShadow: isSelected ? `0 0 0 1px ${accent}30, 0 0 20px ${accent}18` : "none",
                  opacity: !selected || related ? 1 : 0.18,
                  transform: isSelected ? "scale(1.03)" : "scale(1)",
                  transition: "opacity 0.2s, transform 0.15s, box-shadow 0.15s",
                  cursor: "pointer",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  userSelect: "none",
                }}
              >
                {/* Left bar */}
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, backgroundColor: accent, borderRadius: "9px 0 0 9px", opacity: isDone ? 0.3 : 1 }} />

                <div style={{ paddingLeft: 14, paddingRight: 10, width: "100%" }}>
                  {/* Type badge row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span className={cn("rounded border px-1 py-px font-mono", typeBadge[node.type])} style={{ fontSize: 9 }}>
                      {typeLabel[node.type]}
                    </span>
                    <span style={{ marginLeft: "auto", flexShrink: 0 }}>
                      {isDone
                        ? <span style={{ color: "#4ade80", fontSize: 11 }}>✓</span>
                        : <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", border: "1px solid #333" }} />
                      }
                    </span>
                  </div>
                  {/* Concept name */}
                  <div style={{
                    fontSize: 11.5, fontWeight: 600,
                    color: isDone ? "#444" : "#ddd",
                    textDecoration: isDone ? "line-through" : "none",
                    lineHeight: 1.3,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }}>
                    {node.concept}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2">
        <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-bg-border)] bg-[#111]">
          {[{ label: "+", fn: () => setZoom((z) => Math.min(2, z * 1.2)) }, { label: "−", fn: () => setZoom((z) => Math.max(0.25, z / 1.2)) }].map(({ label, fn }) => (
            <button key={label} onClick={fn} className="w-8 h-8 font-mono text-sm text-[var(--color-text-faint)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-muted)] transition-colors cursor-pointer">{label}</button>
          ))}
        </div>
        <button onClick={fitView} className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-bg-border)] bg-[#111] text-[var(--color-text-faint)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-muted)] transition-colors cursor-pointer">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 4V1h3M10 1h3v3M13 10v3h-3M4 13H1v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-bg-border)] bg-[#111]">
          <span className="font-mono text-[9px] text-[var(--color-text-faint)]">{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-bg-border)] bg-[#111]/90 p-2.5 backdrop-blur-sm">
        {([
          { col: 0 as ColIndex, label: "Foundation" },
          { col: 1 as ColIndex, label: "Services" },
          { col: 2 as ColIndex, label: "Design Problems" },
        ] as const).map(({ col, label }) => (
          <div key={col} className="flex items-center gap-2">
            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: colAccent[col] }} />
            <span style={{ fontFamily: "monospace", fontSize: 10, color: "#777" }}>{label}</span>
          </div>
        ))}
        <div className="mt-1 border-t border-[var(--color-bg-border)] pt-1 font-mono text-[9px] text-[var(--color-text-faint)]">
          click to highlight · scroll to zoom<br />drag to pan
        </div>
      </div>
    </div>
  );
}
