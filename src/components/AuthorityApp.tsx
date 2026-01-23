"use client";

import * as React from "react";
import { QUESTIONS } from "@/lib/authority/questions";
import type { AnswerValue, AuthorityAnswers, AuthorityPillar } from "@/lib/authority/types";
import { scoreAuthority, overallLabel } from "@/lib/authority/score";
import { loadAnswers, saveAnswers, clearAnswers } from "@/lib/authority/storage";
import { isUnlocked, setUnlocked as setUnlockedLS, clearUnlocked } from "@/lib/authority/paywall";
import { exportReportPdf } from "@/lib/authority/exportPdf";
import { generateReport } from "@/lib/authority/report";

import { Card, CardBody, CardFooter, CardHeader } from "./ui/Card";
import { Progress } from "./ui/Progress";
import { Button } from "./ui/Button";
import { ChoiceRow, ScaleRow } from "./ui/Field";
import { Container } from "./ui/Container";
import { Input } from "./ui/Input";
import { Badge } from "./ui/Badge";
import { Divider } from "./ui/Divider";

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
    <div className="min-h-screen">
      <Container className="py-10 sm:py-12">
        {/* Top bar */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-[color:var(--muted)]">Authority check</div>
            <div className="mt-2 text-3xl font-semibold leading-tight text-[color:var(--ink)] sm:text-4xl">
              Your current authority readiness
            </div>
            <div className="mt-2 max-w-xl text-sm text-[color:var(--muted)] sm:text-base">
              One question at a time. Calm, structured, and designed for clear next steps.
            </div>
          </div>
          <Button variant="ghost" onClick={reset}>
            Reset
          </Button>
        </div>

        {/* INTRO */}
        {screen === "intro" && (
          <Card className="bg-white/90">
            <CardHeader>
              <div className="text-sm text-[color:var(--muted)]">Your current</div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge tone="primary">Index: {result.overall}/100</Badge>
                <Badge>Status: {overallLabel(result.overall)}</Badge>
                <Badge>Report: {unlocked ? "Unlocked" : "Locked"}</Badge>
              </div>
            </CardHeader>
            <CardBody className="space-y-5">
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
            </CardBody>
            <Divider />
            <CardFooter>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setScreen("quiz")} disabled={!profile.youName.trim()}>
                  Start
                </Button>
                <Button variant="secondary" onClick={() => setScreen("summary")}>
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
                    {PILLAR_LABEL[q.pillar]} • Question {step + 1} of {QUESTIONS.length}
                  </div>
                  <Badge tone="primary">{progress}% complete</Badge>
                </div>
                <Progress value={progress} />
              </CardHeader>
              <CardBody>
                <div className="text-2xl font-semibold text-[color:var(--ink)] sm:text-3xl">
                  {q.title}
                </div>
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

              </CardBody>
              <Divider />
              <CardFooter className="flex items-center justify-between gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                >
                  Back
                </Button>

                {!isLast ? (
                  <Button onClick={() => setStep((s) => Math.min(QUESTIONS.length - 1, s + 1))}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={() => setScreen("summary")}>Finish</Button>
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
            <Card className="bg-white/90">
              <CardBody className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-[color:var(--muted)]">Your Authority Index</div>
                  <div className="mt-1 text-4xl font-semibold leading-tight text-[color:var(--ink)]">
                    {result.overall}/100
                  </div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">
                    Status: {overallLabel(result.overall)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => setScreen("quiz")}>
                    Back to questions
                  </Button>
                  <Button onClick={() => setScreen("intro")}>Home</Button>
                </div>
              </CardBody>
            </Card>

            {/* Paid-worthy report */}
            <ReportView report={report} unlocked={unlocked} />

            {/* Authority Map (kept outside ReportView so it remains a clear “bonus” value) */}
            <Card className="bg-white/90">
              <CardHeader className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-[color:var(--muted)]">Authority Map</div>
                  <div className="mt-1 text-sm text-[color:var(--muted)]">
                    Visualises overlaps, gaps, and single points of failure.
                  </div>
                </div>
                <Badge>{unlocked ? "Unlocked" : "Locked"}</Badge>
              </CardHeader>
              <CardBody>
                {unlocked ? (
                  <AuthorityMap result={result} />
                ) : (
                  <div className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--bg-1)] px-5 py-4 text-sm text-[color:var(--muted)]">
                    Teaser:{" "}
                    <span className="text-[color:var(--ink-soft)]">
                      {topTeaser ?? "No critical flags detected."}
                    </span>
                    <div className="mt-2">Unlock to view the full map and deeper risk detail.</div>
                  </div>
                )}
              </CardBody>
              <Divider />
              <CardFooter className="flex flex-wrap gap-3">
                <Button onClick={startCheckout}>
                  {unlocked ? "Report unlocked" : "Unlock full report"}
                </Button>

                {unlocked ? (
                  <Button variant="ghost" onClick={downloadPdf}>
                    Download PDF
                  </Button>
                ) : null}

                <Button variant="ghost" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  Copy link
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </Container>
    </div>
  );
}
