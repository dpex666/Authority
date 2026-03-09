"use client";

import * as React from "react";
import type { AuthorityAnswers, AuthorityResult } from "@/lib/authority/types";
import { scoreAuthority, overallLabel } from "@/lib/authority/score";
import { computeSimFixes, applyFixes, type SimFix } from "@/lib/authority/simulator";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Divider } from "./ui/Divider";

function DeltaBadge({ delta }: { delta: number }) {
  if (delta <= 0) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
      +{delta} pts
    </span>
  );
}

function ScoreDisplay({
  score,
  label,
  isSimulated,
}: {
  score: number;
  label: string;
  isSimulated: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={[
          "text-4xl font-semibold leading-tight transition-all duration-500",
          isSimulated ? "text-[#0066FF]" : "text-[color:var(--text)]",
        ].join(" ")}
      >
        {score}/100
      </div>
      <div className="text-sm text-[color:var(--muted)]">{label}</div>
      {isSimulated && (
        <span className="text-xs font-medium text-[#0066FF]">simulated</span>
      )}
    </div>
  );
}

export default function AuthoritySimulator({
  answers,
  result,
  onUnlock,
}: {
  answers: AuthorityAnswers;
  result: AuthorityResult;
  onUnlock: () => void;
}) {
  const [appliedFixes, setAppliedFixes] = React.useState<Set<string>>(new Set());
  const fixes = React.useMemo(() => computeSimFixes(answers, result), [answers, result]);

  const simulatedResult = React.useMemo(() => {
    if (appliedFixes.size === 0) return result;
    return scoreAuthority(applyFixes(answers, appliedFixes));
  }, [answers, result, appliedFixes]);

  const totalDelta = simulatedResult.overall - result.overall;
  const isSimulating = appliedFixes.size > 0;

  const toggle = (qId: string) => {
    setAppliedFixes((prev) => {
      const next = new Set(prev);
      next.has(qId) ? next.delete(qId) : next.add(qId);
      return next;
    });
  };

  if (fixes.length === 0) return null;

  return (
    <Card className="bg-white/95 shadow-[var(--shadow-soft)]">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>See what&apos;s possible</CardTitle>
          <Badge>Free preview</Badge>
        </div>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Toggle the fixes below to see how your Authority Index would change. The full
          report shows you exactly how to action each one.
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Score comparison */}
        <div className="mb-6 flex items-center justify-center gap-8 rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--surface2)] px-6 py-5">
          <ScoreDisplay
            score={result.overall}
            label={`Current · ${overallLabel(result.overall)}`}
            isSimulated={false}
          />
          <div className="flex flex-col items-center gap-1">
            <div className="text-2xl text-[color:var(--muted)]">→</div>
            {isSimulating && totalDelta > 0 && (
              <span className="text-sm font-semibold text-emerald-600">+{totalDelta}</span>
            )}
          </div>
          <ScoreDisplay
            score={simulatedResult.overall}
            label={`With fixes · ${overallLabel(simulatedResult.overall)}`}
            isSimulated={isSimulating}
          />
        </div>

        {/* Fix toggles */}
        <div className="space-y-3">
          {fixes.map((fix: SimFix) => {
            const active = appliedFixes.has(fix.questionId);
            return (
              <button
                key={fix.questionId}
                type="button"
                onClick={() => toggle(fix.questionId)}
                className={[
                  "w-full rounded-[var(--radius)] border px-5 py-4 text-left transition-all",
                  active
                    ? "border-[#0066FF] bg-blue-50"
                    : "border-[color:var(--border)] bg-white hover:border-[color:var(--primary)]/40",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                        active
                          ? "border-[#0066FF] bg-[#0066FF] text-white"
                          : "border-[color:var(--border)]",
                      ].join(" ")}
                    >
                      {active && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[color:var(--text)]">
                        {fix.label}
                      </div>
                      <div className="text-xs text-[color:var(--muted)]">
                        {fix.description}
                      </div>
                    </div>
                  </div>
                  <DeltaBadge delta={fix.scoreDelta} />
                </div>
              </button>
            );
          })}
        </div>

        {isSimulating && (
          <div className="mt-4 rounded-[var(--radius)] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            With {appliedFixes.size} fix{appliedFixes.size === 1 ? "" : "es"} applied,
            you&apos;d go from{" "}
            <strong>
              {overallLabel(result.overall)} → {overallLabel(simulatedResult.overall)}
            </strong>
            {totalDelta > 0 && <> (+{totalDelta} points)</>}.
          </div>
        )}
      </CardContent>

      <Divider />

      <div className="px-6 pb-6">
        <p className="mb-3 text-sm text-[color:var(--muted)]">
          Unlock the full report to see exactly how to action each of these.
        </p>
        <Button onClick={onUnlock} className="w-full sm:w-auto">
          Unlock the plan to make this real
        </Button>
      </div>
    </Card>
  );
}
