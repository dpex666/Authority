"use client";

import * as React from "react";
import ReactFlow, { Background, Controls, MiniMap, type Node, type Edge } from "reactflow";
import "reactflow/dist/style.css";
import type { AuthorityResult, AuthorityPillar } from "@/lib/authority/types";

const PILLAR_LABEL: Record<AuthorityPillar, string> = {
  decision: "Decision",
  access: "Access",
  digital: "Digital",
  executor: "Executor",
  alignment: "Alignment",
};

function scoreColour(score: number) {
  // Keep Gaia-ish: calm neutrals, not loud colours
  if (score >= 85) return "border-zinc-800";
  if (score >= 70) return "border-zinc-600";
  if (score >= 50) return "border-zinc-500";
  return "border-zinc-400";
}

export default function AuthorityMap({ result }: { result: AuthorityResult }) {
  const { nodes, edges } = React.useMemo(() => {
    const n: Node[] = [];
    const e: Edge[] = [];

    // Centre node
    n.push({
      id: "you",
      position: { x: 0, y: 0 },
      data: { label: "You" },
      style: {
        borderRadius: 16,
        border: "1px solid rgba(28,28,28,0.18)",
        padding: 12,
        background: "rgba(255,255,255,0.9)",
        fontWeight: 600,
      },
    });

    const pillarOrder: AuthorityPillar[] = ["decision", "access", "digital", "executor", "alignment"];
    const radius = 260;

    pillarOrder.forEach((p, i) => {
      const angle = (Math.PI * 2 * i) / pillarOrder.length;
      const x = Math.round(Math.cos(angle) * radius);
      const y = Math.round(Math.sin(angle) * radius);

      const score = result.pillars[p].score;
      const flags = result.pillars[p].flags;

      n.push({
        id: p,
        position: { x, y },
        data: { label: `${PILLAR_LABEL[p]} • ${score}/100` },
        style: {
          borderRadius: 16,
          border: "1px solid rgba(28,28,28,0.16)",
          padding: 12,
          background: "rgba(255,255,255,0.85)",
        },
        className: `border ${scoreColour(score)}`,
      });

      e.push({
        id: `e-you-${p}`,
        source: "you",
        target: p,
        animated: false,
        style: { stroke: "rgba(20,20,20,0.25)" },
      });

      // Add up to 2 flag nodes per pillar (keeps map clean)
      flags.slice(0, 2).forEach((flag, idx) => {
        const fid = `${p}-flag-${idx}`;
        n.push({
          id: fid,
          position: { x: x + (idx === 0 ? 220 : -220), y: y + 120 },
          data: { label: flag },
          style: {
            borderRadius: 14,
            border: "1px solid rgba(28,28,28,0.12)",
            padding: 10,
            width: 260,
            background: "rgba(246,243,239,0.95)",
            fontSize: 12,
            lineHeight: 1.25,
          },
        });

        e.push({
          id: `e-${p}-${fid}`,
          source: p,
          target: fid,
          animated: false,
          style: { stroke: "rgba(20,20,20,0.18)" },
        });
      });
    });

    return { nodes: n, edges: e };
  }, [result]);

  return (
    <div className="h-[520px] w-full overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white/60">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
