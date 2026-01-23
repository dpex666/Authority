import Link from "next/link";
import ReportView from "@/components/ReportView";
import { generateReport } from "@/lib/authority/report";
import type { AuthorityAnswers } from "@/lib/authority/types";

export default function ExamplePage() {
  // Example answers (just enough to generate a meaningful report)
  const exampleAnswers: AuthorityAnswers = {
    // We don’t need real question IDs here yet.
    // The generator mostly uses pillar scores/flags derived from your existing scoring.
  };

  const report = generateReport(exampleAnswers);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <div className="text-xs tracking-[0.3em] text-[color:var(--muted)]">AUTHORITY</div>
          <h1 className="mt-2 text-[44px] font-bold leading-[1.05] text-[color:var(--ink)] sm:text-[55px] lg:text-[80px]">
            Authority Report
          </h1>
          <p className="mt-3 text-base text-[color:var(--muted)]">
            Example report layout and structure.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium bg-[color:var(--primary)] text-white shadow-sm shadow-[color:var(--primary)]/10 hover:bg-[#163a35] transition"
            >
              Start your report
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium bg-[color:var(--secondary)] text-[color:var(--primary)] border border-[color:var(--primary)]/20 hover:bg-[#c3dec0] transition"
            >
              Back
            </Link>
          </div>
        </div>

        {/* Example page should look "unlocked" so people see value */}
        <ReportView report={report} unlocked={true} />
      </div>
    </div>
  );
}
