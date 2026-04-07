"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { dsaPatterns, type DSATier } from "@/app/roadmap/roadmapData";
import { dsaExtra, type LCProblem } from "@/app/roadmap/dsaExtended";

// ─── Layout constants ─────────────────────────────────────────────────────────

const NW = 256;
const NH = 80;
const COL_X = [44, 436, 828];
const ROW_STEP = 100;
const CANVAS_W = 1132;
const T1_START_Y = 44;
const T2_START_Y = 44;
const T3_OFFSET_Y = 94;

// ─── Build node positions ─────────────────────────────────────────────────────

interface GraphNode {
  id: string;
  tier: DSATier;
  pattern: string;
  dataStructure: string;
  tags: string[];
  problems: LCProblem[];
  deps: string[];
  x: number;
  y: number;
}

const tierNodes = (tier: DSATier) => dsaPatterns.filter((p) => p.tier === tier);

function buildNodes(): GraphNode[] {
  const nodes: GraphNode[] = [];
  ([1, 2, 3] as DSATier[]).forEach((tier) => {
    const patterns = tierNodes(tier);
    const startY = tier === 3 ? T3_OFFSET_Y + T1_START_Y : T1_START_Y;
    const colX = COL_X[tier - 1];
    patterns.forEach((p, i) => {
      const ex = dsaExtra[p.id] ?? { deps: [], problems: [], description: "" };
      nodes.push({ ...p, problems: ex.problems, deps: ex.deps, x: colX, y: startY + i * ROW_STEP });
    });
  });
  return nodes;
}

const ALL_NODES = buildNodes();
const NODE_MAP = Object.fromEntries(ALL_NODES.map((n) => [n.id, n]));

interface GraphEdge { id: string; sourceId: string; targetId: string; }

function buildEdges(): GraphEdge[] {
  const edges: GraphEdge[] = [];
  ALL_NODES.forEach((node) => {
    node.deps.forEach((depId) => {
      edges.push({ id: `${depId}-${node.id}`, sourceId: depId, targetId: node.id });
    });
  });
  return edges;
}

const ALL_EDGES = buildEdges();

const CANVAS_H = Math.max(
  T1_START_Y + tierNodes(1).length * ROW_STEP + 44,
  T2_START_Y + tierNodes(2).length * ROW_STEP + 44,
  T3_OFFSET_Y + T1_START_Y + tierNodes(3).length * ROW_STEP + 44,
);

// ─── Colours ──────────────────────────────────────────────────────────────────

const tierBg: Record<DSATier, string> = { 1: "#052e16", 2: "#422006", 3: "#3f0f0f" };
const tierBorder: Record<DSATier, string> = { 1: "#166534", 2: "#92400e", 3: "#7f1d1d" };
const tierAccent: Record<DSATier, string> = { 1: "#4ade80", 2: "#fbbf24", 3: "#f87171" };
const tierLabel: Record<DSATier, string> = { 1: "T1", 2: "T2", 3: "T3" };
const diffDot: Record<string, string> = { Easy: "#4ade80", Medium: "#fbbf24", Hard: "#f87171" };
const lcBg: Record<string, string> = {
  Easy: "rgba(74,222,128,0.12)",
  Medium: "rgba(251,191,36,0.12)",
  Hard: "rgba(248,113,113,0.12)",
};

// ─── Bezier edge path ─────────────────────────────────────────────────────────

function edgePath(src: GraphNode, tgt: GraphNode): string {
  const sx = src.x + NW, sy = src.y + NH / 2;
  const tx = tgt.x,      ty = tgt.y + NH / 2;
  const cp = Math.max(Math.abs(tx - sx) * 0.45, 60);
  return `M${sx},${sy} C${sx + cp},${sy} ${tx - cp},${ty} ${tx},${ty}`;
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props { done: Set<string>; onToggle: (id: string) => void; }

export function DSAFlowGraph({ done, onToggle }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.72);
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [showIncomplete, setShowIncomplete] = useState(false);

  const visibleIds = showIncomplete
    ? new Set(ALL_NODES.filter((n) => !done.has(n.id)).map((n) => n.id))
    : new Set(ALL_NODES.map((n) => n.id));

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-node]")) return;
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
    const s = Math.min((width - 32) / CANVAS_W, (height - 32) / CANVAS_H, 1);
    setZoom(s);
    setPan({ x: (width - CANVAS_W * s) / 2, y: (height - CANVAS_H * s) / 2 });
  }, []);
  useEffect(() => { fitView(); }, [fitView]);

  // Non-passive wheel handler so preventDefault actually stops page scroll
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
      <div className="absolute inset-0 z-0" style={{ backgroundColor: "#0a0a0a", backgroundImage: "radial-gradient(circle, #282828 1.2px, transparent 1.2px)", backgroundSize: "28px 28px" }} />

      {/* Canvas */}
      <div ref={containerRef} className="absolute inset-0 z-10 select-none" style={{ cursor: dragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      >
        <div style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`, transformOrigin: "0 0", width: CANVAS_W, height: CANVAS_H, position: "relative" }}>

          {/* Edges */}
          <svg style={{ position: "absolute", inset: 0, width: CANVAS_W, height: CANVAS_H, overflow: "visible", pointerEvents: "none" }}>
            <defs>
              {([1, 2, 3] as DSATier[]).map((t) => (
                <marker key={t} id={`arrow-t${t}`} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M0,0 L0,6 L8,3 z" fill={tierAccent[t]} opacity="0.6" />
                </marker>
              ))}
              {ALL_EDGES.map((e) => {
                const src = NODE_MAP[e.sourceId], tgt = NODE_MAP[e.targetId];
                if (!src || !tgt) return null;
                return (
                  <linearGradient key={e.id} id={`grad-${e.id}`} gradientUnits="userSpaceOnUse"
                    x1={src.x + NW} y1={src.y + NH / 2} x2={tgt.x} y2={tgt.y + NH / 2}
                  >
                    <stop offset="0%"   stopColor={tierAccent[src.tier]} stopOpacity="0.7" />
                    <stop offset="100%" stopColor={tierAccent[tgt.tier]} stopOpacity="0.7" />
                  </linearGradient>
                );
              })}
            </defs>
            {ALL_EDGES.map((e) => {
              const src = NODE_MAP[e.sourceId], tgt = NODE_MAP[e.targetId];
              if (!src || !tgt) return null;
              const hidden = !visibleIds.has(src.id) || !visibleIds.has(tgt.id);
              const hi = selected && (selected.id === src.id || selected.id === tgt.id || selected.deps.includes(src.id));
              return (
                <path key={e.id} d={edgePath(src, tgt)} fill="none"
                  stroke={`url(#grad-${e.id})`}
                  strokeWidth={hi ? 2.5 : 1.4}
                  strokeOpacity={hidden ? 0.08 : hi ? 1 : 0.35}
                  markerEnd={`url(#arrow-t${tgt.tier})`}
                  style={{ transition: "stroke-opacity 0.2s, stroke-width 0.2s" }}
                />
              );
            })}
          </svg>

          {/* Column headers */}
          {([1, 2, 3] as DSATier[]).map((t) => (
            <div key={t} style={{ position: "absolute", left: COL_X[t - 1], top: 8, width: NW, textAlign: "center" }}>
              <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: tierAccent[t], textTransform: "uppercase" }}>
                {t === 1 ? "Tier 1 — Fundamentals" : t === 2 ? "Tier 2 — Intermediate" : "Tier 3 — Advanced"}
              </span>
            </div>
          ))}

          {/* Nodes */}
          {ALL_NODES.map((node) => {
            const isDone = done.has(node.id);
            const isSelected = selected?.id === node.id;
            const isHidden = !visibleIds.has(node.id);
            const isRelated = selected
              ? selected.id === node.id || selected.deps.includes(node.id) || ALL_NODES.some((n) => n.id === selected.id && n.deps.includes(node.id))
              : false;
            return (
              <div key={node.id} data-node="1" onClick={() => setSelected(isSelected ? null : node)} style={{
                position: "absolute", left: node.x, top: node.y, width: NW, height: NH,
                opacity: isHidden ? 0.15 : isRelated || !selected ? 1 : 0.25,
                transition: "opacity 0.2s, transform 0.15s, box-shadow 0.15s",
                transform: isSelected ? "scale(1.04)" : "scale(1)",
                cursor: "pointer", borderRadius: 10,
                border: `1px solid ${isSelected ? tierAccent[node.tier] : tierBorder[node.tier]}`,
                backgroundColor: isSelected ? tierBg[node.tier] : "#131313",
                boxShadow: isSelected ? `0 0 0 1px ${tierAccent[node.tier]}40, 0 0 20px ${tierAccent[node.tier]}25` : "none",
                display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", userSelect: "none",
              }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, backgroundColor: tierAccent[node.tier], borderRadius: "10px 0 0 10px", opacity: isDone ? 0.4 : 1 }} />
                <div style={{ paddingLeft: 14, paddingRight: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: tierAccent[node.tier], opacity: 0.85, border: `1px solid ${tierAccent[node.tier]}50`, borderRadius: 4, padding: "1px 5px", backgroundColor: `${tierAccent[node.tier]}12` }}>
                      {tierLabel[node.tier]}
                    </span>
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.dataStructure}</span>
                    <span style={{ marginLeft: "auto", flexShrink: 0 }}>
                      {isDone ? <span style={{ color: "#4ade80", fontSize: 11 }}>✓</span> : <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", border: "1px solid #333" }} />}
                    </span>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: isDone ? "#555" : "#e8e3e3", textDecoration: isDone ? "line-through" : "none", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                    {node.pattern}
                  </div>
                  <div style={{ marginTop: 5 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: "#4a4a4a" }}>{node.problems.length} LC problems · click for details</span>
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

      {/* Filter toggle */}
      <div className="absolute bottom-4 right-4 z-20">
        <button onClick={() => setShowIncomplete((v) => !v)}
          className={cn("rounded-[var(--radius-md)] border px-3 py-1.5 font-mono text-xs transition-all cursor-pointer",
            showIncomplete ? "border-[#4ade80]/50 bg-[#4ade80]/10 text-[#4ade80]" : "border-[var(--color-bg-border)] bg-[#111] text-[var(--color-text-faint)] hover:text-[var(--color-text-secondary)]"
          )}>
          {showIncomplete ? "showing incomplete" : "show all"}
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-bg-border)] bg-[#111]/90 p-2.5 backdrop-blur-sm">
        {([1, 2, 3] as DSATier[]).map((t) => (
          <div key={t} className="flex items-center gap-2">
            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: tierAccent[t] }} />
            <span style={{ fontFamily: "monospace", fontSize: 10, color: "#777" }}>{t === 1 ? "Fundamentals" : t === 2 ? "Intermediate" : "Advanced"}</span>
          </div>
        ))}
        <div className="mt-1 border-t border-[var(--color-bg-border)] pt-1 font-mono text-[9px] text-[var(--color-text-faint)]">scroll · drag · click node</div>
      </div>

      {/* Selected node panel */}
      {selected && (
        <div className="absolute right-0 top-0 bottom-0 z-30 flex flex-col overflow-y-auto border-l border-[var(--color-bg-border)] bg-[#0e0e0e]/95 backdrop-blur-md" style={{ width: 300 }} onMouseDown={(e) => e.stopPropagation()}>
          <div style={{ backgroundColor: `${tierBg[selected.tier]}cc`, padding: "14px 16px 12px" }}>
            <div className="mb-2 flex items-center justify-between">
              <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: tierAccent[selected.tier], letterSpacing: "0.08em" }}>
                {selected.tier === 1 ? "TIER 1 — FUNDAMENTALS" : selected.tier === 2 ? "TIER 2 — INTERMEDIATE" : "TIER 3 — ADVANCED"}
              </span>
              <button onClick={() => setSelected(null)} className="text-[var(--color-text-faint)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer text-lg leading-none">×</button>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#f0ebe9", lineHeight: 1.3, marginBottom: 4 }}>{selected.pattern}</p>
            <p style={{ fontFamily: "monospace", fontSize: 10, color: "#666", marginBottom: 4 }}>{selected.dataStructure}</p>
            {dsaExtra[selected.id]?.description && (
              <p style={{ fontSize: 11, color: "#888", fontStyle: "italic", lineHeight: 1.4 }}>{dsaExtra[selected.id].description}</p>
            )}
          </div>

          <div className="border-b border-[var(--color-bg-border)] px-4 py-3">
            <button onClick={() => onToggle(selected.id)}
              className={cn("flex w-full items-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 font-mono text-xs transition-all cursor-pointer",
                done.has(selected.id) ? "border-[#4ade80]/50 bg-[#4ade80]/10 text-[#4ade80]" : "border-[var(--color-bg-border)] text-[var(--color-text-faint)] hover:border-[#4ade80]/30"
              )}>
              {done.has(selected.id) ? "✓ Completed" : "○ Mark as done"}
            </button>
          </div>

          <div className="border-b border-[var(--color-bg-border)] px-4 py-3">
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-faint)]">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {selected.tags.map((tag) => (
                <span key={tag} className="rounded bg-[var(--color-bg-muted)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-text-faint)]">{tag}</span>
              ))}
            </div>
          </div>

          {selected.deps.length > 0 && (
            <div className="border-b border-[var(--color-bg-border)] px-4 py-3">
              <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-faint)]">Prerequisites</p>
              <div className="space-y-1.5">
                {selected.deps.map((depId) => {
                  const dep = NODE_MAP[depId];
                  if (!dep) return null;
                  return (
                    <button key={depId} onClick={() => setSelected(dep)}
                      className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-left hover:bg-[var(--color-bg-muted)] transition-colors cursor-pointer group">
                      <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: tierAccent[dep.tier], flexShrink: 0 }} />
                      <span className="text-xs text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors">{dep.pattern}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex-1 px-4 py-3">
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-faint)]">Practice Problems</p>
            <div className="space-y-2">
              {selected.problems.map((prob) => (
                <a key={prob.id} href={`https://leetcode.com/problems/${prob.slug}/`} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-2.5 rounded-[var(--radius-md)] border border-[var(--color-bg-border)] p-2.5 no-underline transition-all hover:border-[var(--color-bg-muted)] group"
                  style={{ backgroundColor: lcBg[prob.difficulty] }}>
                  <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: diffDot[prob.difficulty], flexShrink: 0, marginTop: 2 }}>#{prob.id}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium leading-snug text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">{prob.title}</p>
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: diffDot[prob.difficulty] }}>{prob.difficulty}</span>
                  </div>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="mt-0.5 flex-shrink-0 opacity-40 group-hover:opacity-80 transition-opacity">
                    <path d="M1.5 8.5l7-7M8.5 8.5V1.5H1.5" stroke={diffDot[prob.difficulty]} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
