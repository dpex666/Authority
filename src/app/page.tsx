import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-10">
          <div className="text-xs tracking-widest text-black/50">AUTHORITY</div>
          <h1 className="mt-2 text-4xl font-semibold text-black">
            Know who has power. Keep control.
          </h1>
          <p className="mt-3 text-base text-black/60">
            A fast readiness check that shows where decision-making, access, and digital control
            actually sit, and where it’s fragile.
          </p>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white/70 px-7 py-7">
          <div className="grid gap-5">
            <div>
              <div className="text-sm font-medium text-black">What it does</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-black/70 space-y-1">
                <li>Maps who can decide, who can access, and who can execute.</li>
                <li>Flags single points of failure and “grey area” authority.</li>
                <li>Generates a report you can share with family or advisors.</li>
              </ul>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                <div className="text-sm font-medium text-black">3–5 mins</div>
                <div className="mt-1 text-xs text-black/60">15 questions, one at a time.</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                <div className="text-sm font-medium text-black">Local-first</div>
                <div className="mt-1 text-xs text-black/60">Nothing sent anywhere by default.</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                <div className="text-sm font-medium text-black">Actionable</div>
                <div className="mt-1 text-xs text-black/60">Clear flags, not fluff.</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-medium bg-[#141414] text-white hover:bg-black transition"
              >
                Start the check
              </Link>

              <Link
                href="/example"
                className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-medium bg-white text-[#141414] border border-black/15 hover:bg-black/5 transition"
              >
                View example summary
              </Link>
            </div>

            <div className="text-xs text-black/50">
              Not legal advice. If you’re unsure, speak to a qualified professional.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
