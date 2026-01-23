import Link from "next/link";
import ReportView from "@/components/ReportView";
import { generateReport } from "@/lib/authority/report";

export default function ExamplePage() {
  // Example answers (just enough to generate a meaningful report)
  const exampleAnswers: any = {
    // We don’t need real question IDs here yet.
    // The generator mostly uses pillar scores/flags derived from your existing scoring.
  };

  const report = generateReport(exampleAnswers);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8">
          <div className="text-xs tracking-widest text-black/50">AUTHORITY</div>
          <h1 className="mt-2 text-4xl font-semibold text-black">Authority Report</h1>
          <p className="mt-3 text-base text-black/60">
            Example report layout and structure.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-medium bg-[#141414] text-white hover:bg-black transition"
            >
              Start your report
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-medium bg-white text-[#141414] border border-black/15 hover:bg-black/5 transition"
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
