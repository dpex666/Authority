import Link from "next/link";
import ReportView from "@/components/ReportView";
import { generateReport } from "@/lib/authority/report";
import type { AuthorityAnswers } from "@/lib/authority/types";
import { Container } from "@/components/ui/Container";
import { buttonStyles } from "@/components/ui/Button";

export default function ExamplePage() {
  // Example answers (just enough to generate a meaningful report)
  const exampleAnswers: AuthorityAnswers = {
    // We don’t need real question IDs here yet.
    // The generator mostly uses pillar scores/flags derived from your existing scoring.
  };

  const report = generateReport(exampleAnswers);

  return (
    <div className="min-h-screen">
      <Container className="py-12 sm:py-14">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-white/80 px-3 py-1 text-xs font-medium text-[color:var(--muted)]">
            Example report layout
          </div>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-[color:var(--ink)] sm:text-5xl lg:text-6xl">
            Authority Report
          </h1>
          <p className="mt-3 text-base text-[color:var(--muted)]">
            Preview how the unlocked report is structured, written, and prioritized.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/quiz" className={buttonStyles({ variant: "primary", size: "lg" })}>
              Start your report
            </Link>
            <Link href="/" className={buttonStyles({ variant: "secondary", size: "lg" })}>
              Back
            </Link>
          </div>
        </div>

        {/* Example page should look "unlocked" so people see value */}
        <ReportView report={report} unlocked={true} />
      </Container>
    </div>
  );
}
