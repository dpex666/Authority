"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QUESTIONS } from "@/lib/authority/questions";
import type { AuthorityAnswers } from "@/lib/authority/types";
import { scoreAuthority, overallLabel } from "@/lib/authority/score";
import { loadCheckState, clearCheckState } from "@/lib/authority/storage";
import { exportReportPdf } from "@/lib/authority/exportPdf";
import { generateReport } from "@/lib/authority/report";
import { generateWorksheet } from "@/lib/authority/generateWorksheet";
import {
  getTier,
  setTier,
  clearTier,
  canAccessReport,
  canExportPdf,
  type AuthorityTier,
} from "@/lib/authority/paywall";
import { loadProfile, saveProfile, clearProfile, type AuthorityProfile } from "@/lib/authority/profile";
import { encodeAnswers, decodeAnswers } from "@/lib/authority/shareToken";
import { encodePartnerScores, decodePartnerScores, type PartnerScores } from "@/lib/authority/partnerToken";
import { recordScore, getHistory, clearHistory, type HistoryEntry } from "@/lib/authority/history";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { PageShell } from "@/components/ui/PageShell";
import AuthorityMap from "@/components/AuthorityMap";
import ReportView from "@/components/ReportView";
import PricingCards from "@/components/PricingCards";
import EmailCapture from "@/components/EmailCapture";
import AnimatedScore from "@/components/AnimatedScore";
import Confetti from "@/components/Confetti";
import CountdownTimer from "@/components/CountdownTimer";
import AuthoritySimulator from "@/components/AuthoritySimulator";
import PartnerGapReport from "@/components/PartnerGapReport";

const TOTAL_QUESTIONS = QUESTIONS.length;
const CHECKED_KEY = "authority_checked_actions";
const PARTNER_REF_KEY = "authority_partner_ref";

function findFirstUnanswered(answers: AuthorityAnswers) {
  const index = QUESTIONS.findIndex((question) => !answers[question.id]);
  return index === -1 ? null : index + 1;
}

function percentileAbove(score: number): number {
  // Approximate CDF of N(52, 18)
  const mean = 52;
  const sigma = 18;
  const z = (score - mean) / (sigma * Math.SQRT2);
  const t = 1 / (1 + 0.3275911 * Math.abs(z));
  const poly =
    0.254829592 * t -
    0.284496736 * t * t +
    1.421413741 * t * t * t -
    1.453152027 * t * t * t * t +
    1.061405429 * t * t * t * t * t;
  const erf = 1 - poly * Math.exp(-z * z);
  const cdf = 0.5 * (1 + (z >= 0 ? erf : -erf));
  return Math.round(Math.min(99, Math.max(1, cdf * 100)));
}

export default function CheckSummaryClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [answers, setAnswers] = React.useState<AuthorityAnswers>({});
  const [profile, setProfile] = React.useState<AuthorityProfile>({ youName: "", partnerName: "" });
  const [tier, setTierState] = React.useState<AuthorityTier>(null);
  const [resumeQuestion, setResumeQuestion] = React.useState(1);
  const [shareMode, setShareMode] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [checkedActions, setCheckedActions] = React.useState<Set<string>>(new Set());
  const [partnerScores, setPartnerScores] = React.useState<PartnerScores | null>(null);
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  const [scoreVisible, setScoreVisible] = React.useState(false);

  React.useEffect(() => {
    const shareToken = searchParams.get("share");
    if (shareToken) {
      const decoded = decodeAnswers(shareToken);
      if (decoded) {
        setAnswers(decoded);
        setShareMode(true);
      }
    } else {
      const saved = loadCheckState();
      setAnswers(saved?.answers ?? {});
      setResumeQuestion(saved?.currentQuestionNumber ?? 1);
    }

    setProfile(loadProfile());
    setTierState(getTier());

    try {
      const raw = localStorage.getItem(CHECKED_KEY);
      if (raw) setCheckedActions(new Set(JSON.parse(raw) as string[]));
    } catch {}

    const partnerRef = sessionStorage.getItem(PARTNER_REF_KEY);
    if (partnerRef) {
      const decoded = decodePartnerScores(partnerRef);
      if (decoded) setPartnerScores(decoded);
    }

    setHistory(getHistory());
    setTimeout(() => setScoreVisible(true), 100);
  }, [searchParams]);

  React.useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  React.useEffect(() => {
    if (searchParams.get("success") === "1") {
      const tierParam = searchParams.get("tier");
      const resolvedTier: AuthorityTier = tierParam === "pro" ? "pro" : "basic";
      setTier(resolvedTier);
      setTierState(resolvedTier);
      setShowConfetti(true);
      router.replace("/check/summary");
    }
  }, [searchParams, router]);

  const result = React.useMemo(() => scoreAuthority(answers), [answers]);
  const report = React.useMemo(() => generateReport(answers, profile), [answers, profile]);

  React.useEffect(() => {
    if (Object.keys(answers).length >= 10) {
      recordScore(result.overall, overallLabel(result.overall));
      setHistory(getHistory());
    }
  }, [answers, result.overall]);

  const firstUnanswered = findFirstUnanswered(answers);
  const backTarget = firstUnanswered ?? Math.min(resumeQuestion, TOTAL_QUESTIONS);
  const topTeaser = result.topFlags?.[0];
  const unlocked = canAccessReport();
  const pdfUnlocked = canExportPdf();
  const percentile = percentileAbove(result.overall);
  const prevEntry = history.length > 1 ? history[history.length - 2] : null;
  const prevDelta = prevEntry ? result.overall - prevEntry.score : null;

  const reset = () => {
    clearCheckState();
    clearProfile();
    clearTier();
    clearHistory();
    setAnswers({});
    setProfile({ youName: "", partnerName: "" });
    setTierState(null);
    setCheckedActions(new Set());
    setHistory([]);
    router.push("/check/start");
  };

  const startCheckout = async (chosenTier: "basic" | "pro") => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: chosenTier }),
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  };

  const downloadPdf = async () => {
    if (!pdfUnlocked) return;
    const el = document.getElementById("report-root");
    if (!el) return;
    await exportReportPdf(el);
  };

  const copyShareLink = () => {
    const token = encodeAnswers(answers);
    const url = `${window.location.origin}/check/summary?share=${token}`;
    navigator.clipboard.writeText(url);
  };

  const copyPartnerLink = () => {
    const token = encodePartnerScores(result);
    const url = `${window.location.origin}/check/start?ref=${token}`;
    navigator.clipboard.writeText(url);
  };

  const toggleAction = (id: string) => {
    setCheckedActions((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try {
        localStorage.setItem(CHECKED_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  return (
    <PageShell
      actions={
        <>
          <Button size="sm" variant="ghost" onClick={() => router.push("/check/start")}>
            Edit names
          </Button>
          <Button size="sm" variant="ghost" onClick={reset}>
            Reset
          </Button>
        </>
      }
    >
      {showConfetti && <Confetti />}

      <div className="space-y-5">
        {shareMode && (
          <div className="rounded-[var(--radius)] border border-blue-200 bg-blue-50 px-5 py-3 text-sm text-blue-700">
            You&apos;re viewing a shared summary.{" "}
            <button
              onClick={() => router.push("/check/start")}
              className="font-medium underline"
            >
              Take your own check →
            </button>
          </div>
        )}

        <Card className="bg-white/95 shadow-[var(--shadow-soft)]">
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm text-[color:var(--muted)]">Your Authority Index</div>
              <div className="mt-1 text-4xl font-semibold leading-tight text-[color:var(--text)]">
                {scoreVisible ? <AnimatedScore target={result.overall} /> : 0}/100
              </div>
              <div className="mt-1 text-sm text-[color:var(--muted)]">
                Status: {overallLabel(result.overall)}
              </div>
              <div className="mt-1 text-xs text-[color:var(--muted)]">
                Higher than {percentile}% of families who&apos;ve taken this check
              </div>
              {prevEntry && prevDelta !== null && (
                <div className="mt-1 text-xs text-[color:var(--muted)]">
                  Previously: {prevEntry.score}/100
                  {prevDelta > 0 ? (
                    <span className="ml-1 text-emerald-600">↑ +{prevDelta}</span>
                  ) : prevDelta < 0 ? (
                    <span className="ml-1 text-red-600">↓ {prevDelta}</span>
                  ) : (
                    <span className="ml-1">(unchanged)</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="ghost"
                className="w-full sm:w-auto"
                onClick={() => router.push(`/check?q=${backTarget}`)}
              >
                Back to questions
              </Button>
              <Button className="w-full sm:w-auto" onClick={() => router.push("/check/start")}>
                Home
              </Button>
            </div>
          </CardContent>
        </Card>

        {tier === null && !shareMode && Object.keys(answers).length > 5 && (
          <AuthoritySimulator
            answers={answers}
            result={result}
            onUnlock={() => startCheckout("basic")}
          />
        )}

        <ReportView
          report={report}
          unlocked={unlocked}
          onDownload={(id) => generateWorksheet(id, report)}
          checkedActions={checkedActions}
          onToggleAction={toggleAction}
        />

        <Card className="bg-white/95 shadow-[var(--shadow-soft)]">
          <CardHeader className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm text-[color:var(--muted)]">Authority Map</div>
              <div className="mt-1 text-sm text-[color:var(--muted)]">
                Visualises overlaps, gaps, and single points of failure.
              </div>
            </div>
            <Badge>{unlocked ? "Unlocked" : "Locked"}</Badge>
          </CardHeader>
          <CardContent>
            {unlocked ? (
              <AuthorityMap result={result} />
            ) : (
              <div>
                <div className="relative overflow-hidden rounded-[var(--radius)] border border-[color:var(--border)]">
                  <div className="pointer-events-none select-none px-5 py-4 blur-sm">
                    {Object.values(result.pillars).map((p) => (
                      <div key={p.pillar} className="flex items-center gap-3 py-1.5">
                        <div className="w-20 text-sm capitalize text-[color:var(--muted)]">
                          {p.pillar}
                        </div>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--surface2)]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--primary2)]"
                            style={{ width: `${p.score}%` }}
                          />
                        </div>
                        <div className="w-8 text-right text-sm text-[color:var(--text)]">
                          {p.score}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[2px]">
                    <div className="rounded-[var(--radius)] border border-[color:var(--border)] bg-white px-5 py-3 text-sm font-medium text-[color:var(--text)] shadow-sm">
                      Unlock to reveal your full authority map
                    </div>
                  </div>
                </div>
                <div className="mt-3 rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--surface2)] px-5 py-4 text-sm text-[color:var(--muted)]">
                  Teaser:{" "}
                  <span className="text-[color:var(--ink-soft)]">
                    {topTeaser ?? "No critical flags detected."}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
          <Divider />

          {tier === null && !shareMode ? (
            <div className="px-6 pb-6">
              <CountdownTimer />
              <PricingCards onSelect={startCheckout} score={result.overall} />
            </div>
          ) : (
            <CardFooter className="flex flex-wrap gap-3">
              <Button variant="ghost" className="w-full sm:w-auto" disabled>
                Report unlocked ({tier})
              </Button>
              {pdfUnlocked && (
                <Button className="w-full sm:w-auto" onClick={downloadPdf}>
                  Download PDF
                </Button>
              )}
              {tier === "basic" && (
                <Button className="w-full sm:w-auto" onClick={() => startCheckout("pro")}>
                  Upgrade — PDF export $27
                </Button>
              )}
              <Button variant="ghost" className="w-full sm:w-auto" onClick={copyShareLink}>
                Copy share link
              </Button>
              <Button variant="ghost" className="w-full sm:w-auto" onClick={copyPartnerLink}>
                Compare with partner
              </Button>
            </CardFooter>
          )}
        </Card>

        {partnerScores && (
          <PartnerGapReport yourResult={result} partnerScores={partnerScores} />
        )}

        {tier !== null && <EmailCapture source="post_unlock" />}

        {Object.keys(answers).length === 0 ? (
          <Card className="bg-white/95 shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle>Start the check to see your full results</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[color:var(--muted)]">
              We couldn&apos;t find saved answers yet. Complete the 15 questions to generate your
              report and unlock personalised insights.
            </CardContent>
            <Divider />
            <CardFooter>
              <Button onClick={() => router.push("/check?q=1")}>Start the check</Button>
            </CardFooter>
          </Card>
        ) : null}
      </div>
    </PageShell>
  );
}
