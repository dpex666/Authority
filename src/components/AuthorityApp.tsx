"use client";

import * as React from "react";
import { QUESTIONS } from "@/lib/authority/questions";
import type { AuthorityAnswers, AuthorityPillar } from "@/lib/authority/types";
import { scoreAuthority, overallLabel } from "@/lib/authority/score";
import { loadAnswers, saveAnswers, clearAnswers } from "@/lib/authority/storage";
import { isUnlocked, setUnlocked as setUnlockedLS, clearUnlocked } from "@/lib/authority/paywall";
import { exportReportPdf } from "@/lib/authority/exportPdf";
import { generateReport } from "@/lib/authority/report";

import { Card } from "./ui/Card";
import { Progress } from "./ui/Progress";
import { Pill } from "./ui/Pill";
import { Button } from "./ui/Button";
import { ChoiceRow, ScaleRow } from "./ui/Field";

import AuthorityMap from "./AuthorityMap";
import ReportView from "@/components/ReportView";
import { loadProfile, saveProfile, clearProfile, type AuthorityProfile } from "@/lib/authority/profile";


type Screen = "intro" | "quiz" | "summary";

const PILLAR_LABEL: Record<AuthorityPillar, string> = {
  decision: "Decision Authority",
  access: "Access Authority",
  digital: "Digital Authority",
  executor: "Executor Load",
  alignment: "Family Alignment",
};

export default function AuthorityApp() {
  const [answers, setAnswers] = React.useState<AuthorityAnswers>({});
  const [step, setStep] = React.useState(0);
  const [screen, setScreen] = React.useState<Screen>("intro");
  const [unlocked, setUnlockedState] = React.useState(false);
  const [profile, setProfile] = React.useState<AuthorityProfile>({ youName: "", partnerName: "" });


  React.useEffect(() => {
    const a = loadAnswers();
    setAnswers(a);
    setProfile(loadProfile());


    // paywall state
    setUnlockedState(isUnlocked());

    // URL params
    const params = new URLSearchParams(window.location.search);

    // Allow deep-link into summary
    if (params.get("view") === "summary") {
      setScreen("summary");
    }

    // Stripe success return
    if (params.get("success") === "1") {
      setUnlockedLS();
      setUnlockedState(true);
      // clean URL so refresh doesn't re-trigger
      window.history.replaceState({}, "", "/quiz");
    }
  }, []);

React.useEffect(() => {
  saveProfile(profile);
}, [profile]);

  React.useEffect(() => {
    saveAnswers(answers);
  }, [answers]);

  const result = React.useMemo(() => scoreAuthority(answers), [answers]);
  const report = React.useMemo(() => generateReport(answers, profile), [answers, profile]);


  const q = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const progress = Math.round(((step + 1) / QUESTIONS.length) * 100);

  function pick(val: any) {
    setAnswers((prev) => ({ ...prev, [q.id]: val }));
  }

  function reset() {
    clearAnswers();
    clearUnlocked();
    setUnlockedState(false);
    setAnswers({});
    setStep(0);
    setScreen("intro");
    clearProfile();
  }

  async function startCheckout() {
    if (unlocked) return;
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  }

  async function downloadPdf() {
    const el = document.getElementById("report-root");
    if (!el) return;
    await exportReportPdf(el);
  }

  const topTeaser = result.topFlags?.[0];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Top bar */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs tracking-widest text-black/50">AUTHORITY</div>
            <div className="mt-1 text-3xl font-semibold text-[color:var(--ink)]">
              Know who has power. Keep control.
            </div>
            <div className="mt-2 text-sm text-[color:var(--muted)]">
              A calm, practical readiness check. One question at a time.
            </div>
          </div>
          <Button variant="ghost" onClick={reset}>
            Reset
          </Button>
        </div>

        {/* INTRO */}
        {screen === "intro" && (
          <Card className="bg-[color:var(--card-strong)]">
            <div className="text-sm text-[color:var(--muted)]">Your current</div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Pill>Index: {result.overall}/100</Pill>
              <Pill>Status: {overallLabel(result.overall)}</Pill>
              <Pill>Report: {unlocked ? "Unlocked" : "Locked"}</Pill>
            </div>

            <div className="mt-6 space-y-3 text-[color:var(--ink-soft)]">
              <div>
                Authority maps where decisions, access, and digital control actually sit — and where it breaks under stress.
              </div>
              <div>
                You’ll answer <b>{QUESTIONS.length}</b> questions. Takes about <b>3–5 minutes</b>.
              </div>
            </div>

<div className="mt-6 grid gap-3 sm:grid-cols-2">
  <div>
    <div className="text-sm font-medium text-[color:var(--ink)]">
      Your name
    </div>
    <input
      value={profile.youName}
      onChange={(e) =>
        setProfile((p) => ({ ...p, youName: e.target.value }))
      }
      placeholder="e.g. Dan"
      className="mt-2 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-black/10"
    />
  </div>

  <div>
    <div className="text-sm font-medium text-[color:var(--ink)]">
      Partner name (optional)
    </div>
    <input
      value={profile.partnerName || ""}
      onChange={(e) =>
        setProfile((p) => ({ ...p, partnerName: e.target.value }))
      }
      placeholder="e.g. Kat"
      className="mt-2 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-black/10"
    />
  </div>
</div>

<div className="mt-2 text-xs text-[color:var(--muted)]">
  Used only to personalise your report. Stored locally.
</div>


            <div className="mt-8 flex flex-wrap gap-3">
              <Button
  onClick={() => setScreen("quiz")}
  disabled={!profile.youName.trim()}
>
  Start
</Button>

              <Button variant="secondary" onClick={() => setScreen("summary")}>
                View summary
              </Button>
            </div>
          </Card>
        )}

        {/* QUIZ */}
        {screen === "quiz" && (
          <div className="space-y-5">
            {/* progress row */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-[color:var(--muted)]">
                {PILLAR_LABEL[q.pillar]} • Question {step + 1} of {QUESTIONS.length}
              </div>
              <Pill>{progress}%</Pill>
            </div>

            <Progress value={progress} />

            <Card className="bg-[color:var(--card-strong)]">
              <div className="text-xl font-semibold text-[color:var(--ink)]">{q.title}</div>
              {q.help ? <div className="mt-2 text-sm text-[color:var(--muted)]">{q.help}</div> : null}

              <div className="mt-5 grid gap-2">
                {q.type === "single" && q.options
                  ? q.options.map((o) => (
                      <ChoiceRow
                        key={o.value}
                        value={o.value}
                        current={answers[q.id]}
                        label={o.label}
                        onPick={pick}
                      />
                    ))
                  : null}

                {q.type === "scale" ? <ScaleRow current={answers[q.id]} onPick={pick} /> : null}
              </div>

              <div className="mt-7 flex items-center justify-between gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                >
                  Back
                </Button>

                {!isLast ? (
                  <Button onClick={() => setStep((s) => Math.min(QUESTIONS.length - 1, s + 1))}>Next</Button>
                ) : (
                  <Button onClick={() => setScreen("summary")}>Finish</Button>
                )}
              </div>
            </Card>

            <div className="text-xs text-[color:var(--muted)]">
              Pro tip: answer like it’s real life, not “best case”.
            </div>
          </div>
        )}

        {/* SUMMARY */}
        {screen === "summary" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-[color:var(--muted)]">Your Authority Index</div>
                <div className="mt-1 text-3xl font-semibold text-[color:var(--ink)]">{result.overall}/100</div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">Status: {overallLabel(result.overall)}</div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => setScreen("quiz")}>
                  Back to questions
                </Button>
                <Button onClick={() => setScreen("intro")}>Home</Button>
              </div>
            </div>

            {/* Paid-worthy report */}
            <ReportView report={report} unlocked={unlocked} />

            {/* Authority Map (kept outside ReportView so it remains a clear “bonus” value) */}
            <Card className="bg-[color:var(--card-strong)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[color:var(--muted)]">Authority Map</div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">
                    Visualises overlaps, gaps, and single points of failure.
                  </div>
                </div>
                <Pill>{unlocked ? "Unlocked" : "Locked"}</Pill>
              </div>

              {unlocked ? (
                <div className="mt-4">
                  <AuthorityMap result={result} />
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-black/10 bg-white/70 px-5 py-4 text-sm text-[color:var(--muted)]">
                  Teaser:{" "}
                  <span className="text-[color:var(--ink-soft)]">
                    {topTeaser ?? "No critical flags detected."}
                  </span>
                  <div className="mt-2">Unlock to view the full map and deeper risk detail.</div>
                </div>
              )}

              {/* Controls */}
              <div className="mt-5 flex flex-wrap gap-3">
                <Button onClick={startCheckout}>{unlocked ? "Report unlocked" : "Unlock full report"}</Button>

                {unlocked ? (
                  <Button variant="ghost" onClick={downloadPdf}>
                    Download PDF
                  </Button>
                ) : null}

                <Button variant="ghost" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  Copy link
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
