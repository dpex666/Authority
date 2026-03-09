"use client";

import type { AuthorityResult, AuthorityPillar } from "@/lib/authority/types";
import type { PartnerScores } from "@/lib/authority/partnerToken";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { SectionTitle } from "./ui/SectionTitle";

const PILLAR_NAMES: Record<AuthorityPillar, string> = {
  decision: "Decision Authority",
  access: "Access Authority",
  digital: "Digital Authority",
  executor: "Executor Load",
  alignment: "Family Alignment",
};

const PILLAR_ORDER: AuthorityPillar[] = [
  "decision",
  "access",
  "digital",
  "executor",
  "alignment",
];

function PillarBar({
  label,
  yourScore,
  partnerScore,
}: {
  label: string;
  yourScore: number;
  partnerScore: number;
}) {
  const gap = Math.abs(yourScore - partnerScore);
  const isGap = gap >= 20;

  return (
    <div className="rounded-[var(--radius)] border border-[color:var(--border)] bg-white px-5 py-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-[color:var(--text)]">{label}</span>
        {isGap && (
          <Badge tone="warning">{gap}-point gap</Badge>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="w-14 text-right text-xs text-[color:var(--muted)]">You</span>
          <div className="flex-1 overflow-hidden rounded-full bg-[color:var(--surface2)] h-2">
            <div
              className="h-full rounded-full bg-[color:var(--primary)] transition-all duration-700"
              style={{ width: `${yourScore}%` }}
            />
          </div>
          <span className="w-8 text-xs font-medium text-[color:var(--text)]">
            {yourScore}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-14 text-right text-xs text-[color:var(--muted)]">Partner</span>
          <div className="flex-1 overflow-hidden rounded-full bg-[color:var(--surface2)] h-2">
            <div
              className="h-full rounded-full bg-[#00A86B] transition-all duration-700"
              style={{ width: `${partnerScore}%` }}
            />
          </div>
          <span className="w-8 text-xs font-medium text-[color:var(--text)]">
            {partnerScore}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PartnerGapReport({
  yourResult,
  partnerScores,
}: {
  yourResult: AuthorityResult;
  partnerScores: PartnerScores;
}) {
  const gaps = PILLAR_ORDER.filter((p) => {
    const yourScore = yourResult.pillars[p].score;
    const partnerScore = partnerScores[p];
    return Math.abs(yourScore - partnerScore) >= 20;
  }).sort((a, b) => {
    const gapA = Math.abs(yourResult.pillars[a].score - partnerScores[a]);
    const gapB = Math.abs(yourResult.pillars[b].score - partnerScores[b]);
    return gapB - gapA;
  });

  return (
    <Card className="bg-white/95 shadow-[var(--shadow-soft)]">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle>Authority Gap Report</CardTitle>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Both partners have taken the check. The mismatches are where the real risk lives.
            </p>
          </div>
          <div className="flex gap-3 text-xs text-[color:var(--muted)]">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-4 rounded-full bg-[color:var(--primary)]" />
              You
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-4 rounded-full bg-[#00A86B]" />
              Partner
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <SectionTitle
          title="Pillar comparison"
          description="Gaps of 20+ points are highlighted — these are your hidden alignment risks."
        />
        <div className="grid gap-3">
          {PILLAR_ORDER.map((p) => (
            <PillarBar
              key={p}
              label={PILLAR_NAMES[p]}
              yourScore={yourResult.pillars[p].score}
              partnerScore={partnerScores[p]}
            />
          ))}
        </div>

        {gaps.length > 0 && (
          <div className="mt-4 space-y-3">
            <SectionTitle
              title="Where you differ"
              description="These are the gaps most likely to cause confusion under pressure."
            />
            {gaps.slice(0, 3).map((p) => {
              const yourScore = yourResult.pillars[p].score;
              const partnerScore = partnerScores[p];
              const gap = Math.abs(yourScore - partnerScore);
              return (
                <div
                  key={p}
                  className="rounded-[var(--radius)] border border-amber-200 bg-amber-50 px-5 py-4"
                >
                  <div className="text-sm font-semibold text-[color:var(--text)]">
                    {PILLAR_NAMES[p]} — {gap}-point gap
                  </div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">
                    Your score is {yourScore}. Your partner&apos;s is {partnerScore}. This{" "}
                    {gap}-point gap means you&apos;re seeing this pillar very differently — which
                    is likely to surface as confusion or conflict under pressure.
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {gaps.length === 0 && (
          <div className="rounded-[var(--radius)] border border-emerald-200 bg-emerald-50 px-5 py-4">
            <div className="text-sm font-semibold text-emerald-700">
              You&apos;re broadly aligned
            </div>
            <div className="mt-1 text-sm text-emerald-600">
              No pillar has a gap larger than 20 points — you and your partner see things
              similarly across the board. That&apos;s a strong foundation.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
