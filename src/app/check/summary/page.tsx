"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QUESTIONS } from "@/lib/authority/questions";
import type { AuthorityAnswers } from "@/lib/authority/types";
import { scoreAuthority, overallLabel } from "@/lib/authority/score";
import { loadCheckState, clearCheckState } from "@/lib/authority/storage";
import { exportReportPdf } from "@/lib/authority/exportPdf";
import { generateReport } from "@/lib/authority/report";
import { isUnlocked, setUnlocked as setUnlockedLS, clearUnlocked } from "@/lib/authority/paywall";
import { loadProfile, saveProfile, clearProfile, type AuthorityProfile } from "@/lib/authority/profile";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { PageShell } from "@/components/ui/PageShell";
import AuthorityMap from "@/components/AuthorityMap";
import ReportView from "@/components/ReportView";

const TOTAL_QUESTIONS = QUESTIONS.length;

function findFirstUnanswered(answers: AuthorityAnswers) {
  const index = QUESTIONS.findIndex((question) => !answers[question.id]);
  return index === -1 ? null : index + 1;
}

export default function CheckSummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [answers, setAnswers] = React.useState<AuthorityAnswers>({});
  const [profile, setProfile] = React.useState<AuthorityProfile>({ youName: "", partnerName: "" });
  const [unlocked, setUnlockedState] = React.useState(false);
  const [resumeQuestion, setResumeQuestion] = React.useState(1);

  React.useEffect(() => {
    const saved = loadCheckState();
    setAnswers(saved?.answers ?? {});
    setResumeQuestion(saved?.currentQuestionNumber ?? 1);
    setProfile(loadProfile());
    setUnlockedState(isUnlocked());
  }, []);

  React.useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  React.useEffect(() => {
    if (searchParams.get("success") === "1") {
      setUnlockedLS();
      setUnlockedState(true);
      router.replace("/check/summary");
    }
  }, [searchParams, router]);

  const result = React.useMemo(() => scoreAuthority(answers), [answers]);
  const report = React.useMemo(() => generateReport(answers, profile), [answers, profile]);
  const firstUnanswered = findFirstUnanswered(answers);
  const backTarget = firstUnanswered ?? Math.min(resumeQuestion, TOTAL_QUESTIONS);
  const topTeaser = result.topFlags?.[0];

  const reset = () => {
    clearCheckState();
    clearProfile();
    clearUnlocked();
    setAnswers({});
    setProfile({ youName: "", partnerName: "" });
    setUnlockedState(false);
    router.push("/check/start");
  };

  const startCheckout = async () => {
    if (unlocked) return;
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  };

  const downloadPdf = async () => {
    const el = document.getElementById("report-root");
    if (!el) return;
    await exportReportPdf(el);
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

        <ReportView report={report} unlocked={unlocked} />

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

        {Object.keys(answers).length === 0 ? (
          <Card className="bg-white/95 shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle>Start the check to see your full results</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[color:var(--muted)]">
              We couldn’t find saved answers yet. Complete the 15 questions to generate your
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
