"use client";

import * as React from "react";
import { QUESTIONS } from "@/lib/authority/questions";
import type { AnswerValue, AuthorityAnswers, AuthorityPillar } from "@/lib/authority/types";
import { scoreAuthority, overallLabel } from "@/lib/authority/score";
import { loadAnswers, saveAnswers, clearAnswers } from "@/lib/authority/storage";
import { isUnlocked, setUnlocked as setUnlockedLS, clearUnlocked } from "@/lib/authority/paywall";
import { exportReportPdf } from "@/lib/authority/exportPdf";
import { generateReport } from "@/lib/authority/report";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/Card";
import { Progress } from "./ui/Progress";
import { Button } from "./ui/Button";
import { ChoiceRow, ScaleRow } from "./ui/Field";
import { Container } from "./ui/Container";
import { Input } from "./ui/Input";
import { Badge } from "./ui/Badge";
import { Divider } from "./ui/Divider";
import { PageShell } from "./ui/PageShell";

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

  function pick(val: AnswerValue) {
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
    <PageShell
      actions={
        <Button variant="ghost" size="sm" onClick={reset}>
          Reset
        </Button>
      }
    >
      <Container className="py-10 sm:py-12">
        {/* Top bar */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-[color:var(--muted)]">Authority check</div>
            <div className="mt-2 text-3xl font-semibold leading-tight text-[color:var(--text)] sm:text-4xl">
              Your current authority readiness
            </div>
            <div className="mt-2 max-w-xl text-sm text-[color:var(--muted)] sm:text-base">
              One question at a time. Calm, structured, and designed for clear next steps.
            </div>
          </div>
        </div>

        {/* INTRO */}
        {screen === "intro" && (
          <Card className="bg-white/95 shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle>Your starting point</CardTitle>
              <CardDescription>Personalise the report and begin the guided check.</CardDescription>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge tone="primary">Index: {result.overall}/100</Badge>
                <Badge>Status: {overallLabel(result.overall)}</Badge>
                <Badge>Report: {unlocked ? "Unlocked" : "Locked"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2 text-sm text-[color:var(--ink-soft)] sm:text-base">
                <div>
                  Authority maps where decisions, access, and digital control actually sit — and
                  where it breaks under stress.
                </div>
                <div>
                  You’ll answer <b>{QUESTIONS.length}</b> questions. Takes about <b>3–5 minutes</b>.
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Your name"
                  value={profile.youName}
                  onChange={(e) => setProfile((p) => ({ ...p, youName: e.target.value }))}
                  placeholder="e.g. Dan"
                />
                <Input
                  label="Partner name (optional)"
                  value={profile.partnerName || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, partnerName: e.target.value }))}
                  placeholder="e.g. Kat"
                />
              </div>
              <div className="text-xs text-[color:var(--muted)]">
                Used only to personalise your report. Stored locally.
              </div>
            </CardContent>
            <Divider />
            <CardFooter>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => setScreen("quiz")}
                  disabled={!profile.youName.trim()}
                >
                  Start
                </Button>
                <Button
                  variant="ghost"
                  className="w-full sm:w-auto"
                  onClick={() => setScreen("summary")}
                >
                  View summary
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}

        {/* QUIZ */}
        {screen === "quiz" && (
          <div className="space-y-5">
            {/* progress row */}
            <Card className="bg-white/90">
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-[color:var(--muted)]">
                    Step {step + 1} of {QUESTIONS.length} • {PILLAR_LABEL[q.pillar]}
                  </div>
                  <Badge tone="primary">{progress}% complete</Badge>
                </div>
                <Progress value={progress} />
              </CardHeader>
            </Card>

            <Card className="bg-white/95 shadow-[var(--shadow-soft)]">
              <CardHeader className="space-y-2">
                <CardTitle>{q.title}</CardTitle>
                {q.help ? <CardDescription>{q.help}</CardDescription> : null}
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
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
              </CardContent>
              <Divider />
              <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  variant="ghost"
                  className="w-full sm:w-auto"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                >
                  Back
                </Button>

                {!isLast ? (
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => setStep((s) => Math.min(QUESTIONS.length - 1, s + 1))}
                  >
                    Next
                  </Button>
                ) : (
                  <Button className="w-full sm:w-auto" onClick={() => setScreen("summary")}>
                    Finish
                  </Button>
                )}
              </CardFooter>
            </Card>

            <div className="text-xs text-[color:var(--muted)]">
              Pro tip: answer like it’s real life, not “best case”.
            </div>
          </div>
        )}

        {/* SUMMARY */}
        {screen === "summary" && (
          <div className="space-y-5">
            <Card className="bg-white/95 shadow-[var(--shadow-soft)]">
              <CardContent className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-[color:var(--muted)]">Your Authority Index</div>
                  <div className="mt-1 text-4xl font-semibold leading-tight text-[color:var(--text)]">
                    {result.overall}/100
                  </div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">
                    Status: {overallLabel(result.overall)}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="ghost" className="w-full sm:w-auto" onClick={() => setScreen("quiz")}>
                    Back to questions
                  </Button>
                  <Button className="w-full sm:w-auto" onClick={() => setScreen("intro")}>
                    Home
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Paid-worthy report */}
            <ReportView report={report} unlocked={unlocked} />

            {/* Authority Map (kept outside ReportView so it remains a clear “bonus” value) */}
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
                  <div className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--surface2)] px-5 py-4 text-sm text-[color:var(--muted)]">
                    Teaser:{" "}
                    <span className="text-[color:var(--ink-soft)]">
                      {topTeaser ?? "No critical flags detected."}
                    </span>
                    <div className="mt-2">Unlock to view the full map and deeper risk detail.</div>
                  </div>
                )}
              </CardContent>
              <Divider />
              <CardFooter className="flex flex-col gap-3 sm:flex-row">
                <Button className="w-full sm:w-auto" onClick={startCheckout}>
                  {unlocked ? "Report unlocked" : "Unlock full report"}
                </Button>

                {unlocked ? (
                  <Button variant="ghost" className="w-full sm:w-auto" onClick={downloadPdf}>
                    Download PDF
                  </Button>
                ) : null}

                <Button
                  variant="ghost"
                  className="w-full sm:w-auto"
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                >
                  Copy link
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </Container>
    </PageShell>
  );
}
