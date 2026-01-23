"use client";

import { useRouter } from "next/navigation";
import ReportView from "@/components/ReportView";
import { generateReport } from "@/lib/authority/report";
import type { AuthorityAnswers } from "@/lib/authority/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageShell } from "@/components/ui/PageShell";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function ExamplePage() {
  const router = useRouter();
  // Example answers (just enough to generate a meaningful report)
  const exampleAnswers: AuthorityAnswers = {
    // We don’t need real question IDs here yet.
    // The generator mostly uses pillar scores/flags derived from your existing scoring.
  };

  const report = generateReport(exampleAnswers);

  return (
    <PageShell
      actions={
        <>
          <Button size="sm" variant="ghost" onClick={() => router.push("/")}>
            Back home
          </Button>
          <Button size="sm" onClick={() => router.push("/quiz")}>
            Start your report
          </Button>
        </>
      }
    >
      <Container className="py-12 sm:py-14">
        <div className="mb-10 space-y-4">
          <div className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-white/90 px-3 py-1 text-xs font-medium text-[color:var(--muted)] shadow-sm">
            Example report layout
          </div>
          <SectionTitle
            title="Example Summary"
            description="Preview how the unlocked report is structured, written, and prioritized."
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => router.push("/quiz")}>
              Start your report
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => router.push("/")}
            >
              Back
            </Button>
          </div>
        </div>

        {/* Example page should look "unlocked" so people see value */}
        <ReportView report={report} unlocked={true} />
      </Container>
    </PageShell>
  );
}
