"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AnswerValue } from "@/lib/authority/types";

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif";

const TRUST_STATS = [
  "15 questions · 5 minutes · 0 legal jargon",
  "Reveals the gaps most families don't know they have",
  "No account required · Nothing stored on servers",
];

const HOOK_QUESTIONS: { id: string; label: string }[] = [
  {
    id: "q1",
    label: "Is there one person who can make final decisions if you're unreachable?",
  },
  {
    id: "q2",
    label: "Could your key accounts be accessed within 24 hours without you?",
  },
  {
    id: "q3",
    label: "Do your key people broadly agree on what you'd want?",
  },
];

const FAQ = [
  {
    q: "Is this legal advice?",
    a: "No. It's a diagnostic tool. Use it to identify gaps, then speak to a professional if needed.",
  },
  {
    q: "Do you store my answers?",
    a: "Answers are stored only in your browser's local storage. Nothing is sent to our servers during the quiz.",
  },
  {
    q: "What happens after I pay?",
    a: "You're redirected back to your results page, which unlocks immediately. No account needed.",
  },
  {
    q: "Can I share the report?",
    a: "Yes — the summary page has a \"Copy share link\" button that encodes your results in the URL. Anyone with the link can view your score and teaser.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Answer 15 questions",
    desc: "About who decides, who can access key accounts, and what's documented. Takes 5 minutes.",
  },
  {
    n: "2",
    title: "Get your Authority Index",
    desc: "A score from 0–100 across five risk pillars: Decision, Access, Digital, Executor, and Alignment.",
  },
  {
    n: "3",
    title: "Unlock the full report",
    desc: "Your authority map, 7-day action plan, 6 worksheets, and a conversation starter script.",
  },
];

type HookAnswer = "yes" | "no" | "unsure";

function hookMiniScore(answers: Record<string, HookAnswer>): number {
  let score = 0;
  for (const a of Object.values(answers)) {
    if (a === "yes") score += 33;
    else if (a === "unsure") score += 16;
  }
  return Math.min(score, 99);
}

function hookLabel(score: number): string {
  if (score >= 80) return "Stable";
  if (score >= 50) return "Exposed";
  return "Fragile";
}

function hookCopy(score: number, badCount: number): string {
  if (badCount === 0) return "You're starting from a strong base. The full check will confirm.";
  if (badCount === 1)
    return "1 critical gap detected. The full check will pinpoint where and how bad.";
  return `${badCount} critical gaps detected. Your Authority Index is likely in the ${hookLabel(score)} range.`;
}

// Suppress TS error for unused import
const _unusedAnswerValue: AnswerValue = "yes";
void _unusedAnswerValue;

export default function HomePage() {
  const router = useRouter();
  const startTimeRef = useRef<number>(0);
  const hasScrolledRef = useRef(false);
  const [trustIdx, setTrustIdx] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [hookAnswers, setHookAnswers] = useState<Record<string, HookAnswer>>({});
  const hookScore = hookMiniScore(hookAnswers);
  const hookBadCount = Object.values(hookAnswers).filter((a) => a === "no").length;
  const hookDone = Object.keys(hookAnswers).length === HOOK_QUESTIONS.length;

  useEffect(() => {
    startTimeRef.current = Date.now();

    const handleScroll = () => {
      if (hasScrolledRef.current) return;
      if (window.scrollY > window.innerHeight * 0.8) {
        const detail = { event: "scroll_past_fold" };
        window.dispatchEvent(new CustomEvent("analytics", { detail }));
        console.log("[analytics]", detail);
        hasScrolledRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTrustIdx((i) => (i + 1) % TRUST_STATS.length), 3000);
    return () => clearInterval(id);
  }, []);

  const trackCta = (location: string) => {
    const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const detail = { event: "check_started", location, elapsed_seconds: elapsedSeconds };
    window.dispatchEvent(new CustomEvent("analytics", { detail }));
    console.log("[analytics]", detail);
    router.push("/check/start");
  };

  const setHookAnswer = (id: string, answer: HookAnswer) => {
    setHookAnswers((prev) => ({ ...prev, [id]: answer }));
  };

  return (
    <div
      className="min-h-screen bg-[#f6f3ef]"
      style={{ fontFamily: FONT_STACK }}
    >
      <div className="mx-auto max-w-[680px] px-6 pb-24 md:px-12">
        {/* Nav */}
        <nav className="flex items-center justify-between py-8">
          <div className="text-[18px] font-medium text-[#1a1a1a]">authority</div>
          <button
            type="button"
            onClick={() => trackCta("nav")}
            className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#0066FF] px-4 text-[14px] font-medium text-[#0066FF] transition-colors hover:bg-[#0066FF] hover:text-white"
          >
            Start free check →
          </button>
        </nav>

        {/* Hero */}
        <main className="pt-8 md:pt-16">
          <h1 className="max-w-[540px] text-[32px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#0a0a0a] md:text-[48px]">
            Before you sign. Before you hire. Before you delegate.
            <span className="mt-4 block font-normal leading-[1.2] tracking-[-0.02em] text-[#404040]">
              Know where your authority breaks.
            </span>
          </h1>

          <div className="mt-10 flex flex-col items-start">
            <button
              type="button"
              onClick={() => trackCta("hero_cta")}
              aria-label="Start the 5-minute authority readiness check"
              className="inline-flex h-[52px] w-full items-center justify-center rounded-[8px] bg-[#0066FF] px-6 text-[18px] font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-[#005CE6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066FF] md:h-[56px] md:w-auto"
            >
              Start 5-minute check
              <span className="ml-1">→</span>
            </button>

            <div className="mt-3 h-5 overflow-hidden text-[14px] text-[#666666] md:self-center">
              <div
                key={trustIdx}
                style={{ animation: "fadeIn 0.4s ease-in" }}
              >
                {TRUST_STATS[trustIdx]}
              </div>
            </div>
          </div>
        </main>

        {/* Interactive 3-question hook */}
        <section className="mt-20 rounded-[12px] border border-[#e5e7eb] bg-white px-6 py-8 shadow-[0_1px_4px_rgba(0,0,0,0.04)] md:px-10">
          <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0066FF]">
            Quick check
          </div>
          <h2 className="mt-2 text-[20px] font-semibold text-[#0a0a0a]">
            Before you commit to the full 15 questions:
          </h2>

          <div className="mt-6 space-y-6">
            {HOOK_QUESTIONS.map((hq) => {
              const answer = hookAnswers[hq.id];
              return (
                <div key={hq.id}>
                  <div className="mb-3 text-[15px] leading-[1.5] text-[#1a1a1a]">{hq.label}</div>
                  <div className="flex gap-2">
                    {(["yes", "no", "unsure"] as HookAnswer[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setHookAnswer(hq.id, opt)}
                        className={[
                          "flex-1 rounded-[8px] border py-2 text-[14px] font-medium transition-all",
                          answer === opt
                            ? "border-[#0066FF] bg-[#0066FF] text-white"
                            : "border-[#e5e7eb] bg-white text-[#525252] hover:border-[#0066FF]/50",
                        ].join(" ")}
                      >
                        {opt === "unsure" ? "Not sure" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {hookDone && (
            <div className="mt-8 rounded-[8px] border border-[#e5e7eb] bg-[#f6f3ef] px-5 py-4">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <div className="text-[28px] font-semibold text-[#0a0a0a]">
                    ~{hookScore}
                    <span className="text-[16px] font-normal text-[#666666]">/100</span>
                  </div>
                  <div
                    className={[
                      "text-[13px] font-medium",
                      hookScore >= 80
                        ? "text-[#16a34a]"
                        : hookScore >= 50
                        ? "text-[#92400e]"
                        : "text-[#991b1b]",
                    ].join(" ")}
                  >
                    Estimated: {hookLabel(hookScore)}
                  </div>
                </div>
                <div className="flex-1 text-[13px] leading-[1.6] text-[#525252]">
                  {hookCopy(hookScore, hookBadCount)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => trackCta("hook_result")}
                className="mt-4 inline-flex h-[40px] w-full items-center justify-center rounded-[8px] bg-[#0066FF] text-[14px] font-medium text-white hover:bg-[#005CE6]"
              >
                Get my precise Authority Index →
              </button>
            </div>
          )}
        </section>

        {/* How it works */}
        <section className="mt-20">
          <h2 className="text-[20px] font-semibold text-[#1a1a1a]">How it works</h2>
          <div className="mt-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0066FF] text-[13px] font-semibold text-white">
                    {s.n}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="mt-1 w-px flex-1 bg-[#e5e7eb]" style={{ minHeight: "36px" }} />
                  )}
                </div>
                <div className="pb-8 pt-1">
                  <div className="text-[15px] font-semibold text-[#0a0a0a]">{s.title}</div>
                  <div className="mt-1 text-[14px] leading-[1.6] text-[#525252]">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sample report preview */}
        <section className="mt-16">
          <h2 className="text-[20px] font-semibold text-[#1a1a1a]">
            What&apos;s in the full report
          </h2>
          <p className="mt-1 text-[14px] text-[#666666]">
            Everything you need to act — not just understand.
          </p>

          <div className="mt-6 overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
            <div className="border-b border-[#e5e7eb] px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#999999]">
                    Authority Report
                  </div>
                  <div className="mt-1 text-[20px] font-semibold text-[#0a0a0a]">Alex + Sarah</div>
                </div>
                <div className="rounded-[8px] border border-[#e5e7eb] bg-[#f6f3ef] px-4 py-3 text-center">
                  <div className="text-[10px] uppercase tracking-[0.15em] text-[#999999]">Index</div>
                  <div className="text-[24px] font-semibold text-[#0a0a0a]">67/100</div>
                  <div className="text-[11px] font-medium text-amber-600">Exposed</div>
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#999999]">
                What breaks first
              </div>
              <div className="mt-3 space-y-2">
                {[
                  { title: "Decision deadlock during an emergency", sev: "High", tf: "0–48 hours" },
                  { title: "No reliable access to finances within 48 hours", sev: "High", tf: "0–48 hours" },
                  { title: "Password + 2FA recovery is fragile", sev: "Medium", tf: "3–7 days" },
                ].map((r) => (
                  <div
                    key={r.title}
                    className="flex items-center justify-between rounded-[8px] border border-[#e5e7eb] px-4 py-3"
                  >
                    <div className="text-[13px] text-[#1a1a1a]">{r.title}</div>
                    <div className="ml-3 flex shrink-0 gap-2">
                      <span className="rounded-full border border-[#e5e7eb] px-2 py-0.5 text-[11px] text-[#666666]">
                        {r.tf}
                      </span>
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[11px] font-medium",
                          r.sev === "High" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700",
                        ].join(" ")}
                      >
                        {r.sev}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative border-t border-[#e5e7eb] px-6 py-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#999999]">
                7-day action plan
              </div>
              <div className="pointer-events-none mt-3 select-none blur-sm">
                {[
                  "Nominate an emergency decision holder — 10 mins",
                  "Create a 48-hour access pathway for finances — 1 hour",
                  "Set up password manager emergency access — 1 hour",
                ].map((t) => (
                  <div
                    key={t}
                    className="mb-2 flex items-center gap-3 rounded-[8px] border border-[#e5e7eb] px-4 py-3"
                  >
                    <div className="h-4 w-4 rounded border-2 border-[#e5e7eb]" />
                    <div className="text-[13px] text-[#1a1a1a]">{t}</div>
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-center bg-gradient-to-t from-white pb-6 pt-12">
                <button
                  type="button"
                  onClick={() => trackCta("report_preview")}
                  className="inline-flex h-[40px] items-center gap-1.5 rounded-[8px] bg-[#0066FF] px-5 text-[14px] font-medium text-white hover:bg-[#005CE6]"
                >
                  Unlock the full plan →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="mt-20">
          <h2 className="text-[20px] font-semibold text-[#1a1a1a]">Pricing</h2>
          <p className="mt-1 text-[14px] text-[#666666]">One-time payment. No subscription. No account.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                name: "Report",
                price: "$12",
                desc: "Full authority report — everything you need to act.",
                features: [
                  "Authority Index across 5 pillars",
                  "Authority Map visualisation",
                  "Risk breakdown",
                  "7-day action plan",
                  "6 downloadable worksheets",
                  "Conversation starter script",
                ],
                highlight: false,
              },
              {
                name: "Report + PDF",
                price: "$27",
                desc: "Everything in Report, plus a printable PDF export.",
                features: [
                  "Everything in Report",
                  "PDF export of full report",
                  "Print-ready for sharing or filing",
                ],
                highlight: true,
              },
            ].map((t) => (
              <div
                key={t.name}
                className={[
                  "rounded-[12px] border bg-white p-6",
                  t.highlight ? "border-[#0066FF] ring-2 ring-[#0066FF]/20" : "border-[#e5e7eb]",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[15px] font-semibold text-[#0a0a0a]">{t.name}</div>
                  {t.highlight && (
                    <span className="rounded-full bg-[#0066FF] px-2.5 py-0.5 text-[11px] font-medium text-white">
                      Most popular
                    </span>
                  )}
                </div>
                <div className="mt-2 text-[28px] font-semibold text-[#0a0a0a]">{t.price}</div>
                <div className="mt-1 text-[13px] text-[#666666]">{t.desc}</div>
                <ul className="mt-4 space-y-1.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-[#525252]">
                      <span className="text-[#00A86B]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => trackCta("pricing_section")}
                  className={[
                    "mt-5 inline-flex h-[40px] w-full items-center justify-center rounded-[8px] text-[14px] font-medium transition-colors",
                    t.highlight
                      ? "bg-[#0066FF] text-white hover:bg-[#005CE6]"
                      : "border border-[#e5e7eb] text-[#1a1a1a] hover:border-[#0066FF]/50 hover:text-[#0066FF]",
                  ].join(" ")}
                >
                  Start free check →
                </button>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[12px] text-[#999999]">
            You take the check for free. Pay only when you see your score and want the full report.
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-20">
          <h2 className="text-[20px] font-semibold text-[#1a1a1a]">Common questions</h2>
          <div className="mt-6 divide-y divide-[#e5e7eb] overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
            {FAQ.map((item, i) => (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-[15px] font-medium text-[#0a0a0a] transition-colors hover:bg-[#f6f3ef]"
                >
                  {item.q}
                  <span
                    className={[
                      "ml-4 shrink-0 text-[20px] text-[#999999] transition-transform duration-200",
                      faqOpen === i ? "rotate-45" : "",
                    ].join(" ")}
                  >
                    +
                  </span>
                </button>
                {faqOpen === i && (
                  <div className="border-t border-[#e5e7eb] bg-[#f6f3ef] px-6 py-4 text-[14px] leading-[1.7] text-[#525252]">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Email capture */}
        <section className="mt-16">
          <div className="rounded-[12px] border border-dashed border-[#e5e7eb] bg-white px-6 py-6">
            <div className="text-[15px] font-medium text-[#1a1a1a]">Not ready yet?</div>
            <p className="mt-1 text-[13px] text-[#666666]">
              Enter your email and we&apos;ll remind you. One email, nothing else.
            </p>
            <LandingEmailCapture />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-16 rounded-[12px] bg-[#0a0a0a] px-6 py-10 text-center">
          <div className="text-[22px] font-semibold text-white md:text-[26px]">
            Know where your authority breaks.
          </div>
          <p className="mt-2 text-[14px] text-[#aaaaaa]">
            5 minutes. Free to start. Pay only if you want the full picture.
          </p>
          <button
            type="button"
            onClick={() => trackCta("bottom_cta")}
            className="mt-6 inline-flex h-[48px] items-center justify-center rounded-[8px] bg-white px-8 text-[15px] font-semibold text-[#0a0a0a] transition-all hover:scale-[1.02]"
          >
            Start the free check →
          </button>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-[11px] text-[#aaaaaa]">
            This is an informational tool, not legal advice. If you&apos;re unsure, speak to a
            qualified professional.
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function LandingEmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const submit = async () => {
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "landing_footer" }),
      });
    } catch {}
    setStatus("done");
  };

  if (status === "done") {
    return (
      <p className="mt-3 text-[13px] text-[#00A86B]">Got it — we&apos;ll send one reminder.</p>
    );
  }

  return (
    <div className="mt-3 flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="your@email.com"
        className="h-9 flex-1 rounded-[6px] border border-[#e5e7eb] px-3 text-[13px] outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20"
      />
      <button
        type="button"
        onClick={submit}
        disabled={status === "loading"}
        className="inline-flex h-9 items-center rounded-[6px] bg-[#0066FF] px-4 text-[13px] font-medium text-white hover:bg-[#005CE6] disabled:opacity-60"
      >
        Remind me
      </button>
    </div>
  );
}
