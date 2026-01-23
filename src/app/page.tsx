import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-10">
          <div className="text-xs tracking-[0.3em] text-[color:var(--muted)]">AUTHORITY</div>
          <h1 className="mt-2 text-[44px] font-bold leading-[1.05] text-[color:var(--ink)] sm:text-[55px] lg:text-[80px]">
            Know who has power. Keep control.
          </h1>
          <p className="mt-3 max-w-2xl text-base text-[color:var(--muted)]">
            A fast readiness check that shows where decision-making, access, and digital control
            actually sit, and where it’s fragile.
          </p>
        </div>

        <div className="rounded-3xl border border-[color:var(--border)] bg-white px-7 py-7 shadow-sm shadow-[color:var(--primary)]/5">
          <div className="grid gap-5">
            <div>
              <div className="text-sm font-medium text-[color:var(--ink)]">What it does</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:var(--ink-soft)]">
                <li>Maps who can decide, who can access, and who can execute.</li>
                <li>Flags single points of failure and “grey area” authority.</li>
                <li>Generates a report you can share with family or advisors.</li>
              </ul>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-1)] p-4">
                <div className="text-sm font-medium text-[color:var(--ink)]">3–5 mins</div>
                <div className="mt-1 text-xs text-[color:var(--muted)]">15 questions, one at a time.</div>
              </div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-1)] p-4">
                <div className="text-sm font-medium text-[color:var(--ink)]">Local-first</div>
                <div className="mt-1 text-xs text-[color:var(--muted)]">Nothing sent anywhere by default.</div>
              </div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-1)] p-4">
                <div className="text-sm font-medium text-[color:var(--ink)]">Actionable</div>
                <div className="mt-1 text-xs text-[color:var(--muted)]">Clear flags, not fluff.</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium bg-[color:var(--primary)] text-white shadow-sm shadow-[color:var(--primary)]/10 hover:bg-[#163a35] transition"
              >
                Start the check
              </Link>

              <Link
                href="/example"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium bg-[color:var(--secondary)] text-[color:var(--primary)] border border-[color:var(--primary)]/20 hover:bg-[#c3dec0] transition"
              >
                View example summary
              </Link>
            </div>

            <div className="text-xs text-[color:var(--muted)]">
              Not legal advice. If you’re unsure, speak to a qualified professional.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
