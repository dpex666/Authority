"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const HOOK_QUESTIONS = [
  { id: "q1", label: "Is there one person who can make final decisions if you're unreachable?" },
  { id: "q2", label: "Could your key accounts be accessed within 24 hours without you?" },
  { id: "q3", label: "Do your key people broadly agree on what you'd want?" },
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
    a: 'Yes — the summary page has a "Copy share link" button that encodes your results in the URL. Anyone with the link can view your score and teaser.',
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

function hookColor(score: number): string {
  if (score >= 80) return "#16a34a";
  if (score >= 50) return "#d97706";
  return "#dc2626";
}

function hookBg(score: number): string {
  if (score >= 80) return "#f0fdf4";
  if (score >= 50) return "#fffbeb";
  return "#fef2f2";
}

function hookBorder(score: number): string {
  if (score >= 80) return "#bbf7d0";
  if (score >= 50) return "#fde68a";
  return "#fecaca";
}

export default function HomePage() {
  const router = useRouter();
  const startTimeRef = useRef<number>(0);
  const hasScrolledRef = useRef(false);
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
        hasScrolledRef.current = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const go = (location: string) => {
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    console.log("[analytics]", { event: "check_started", location, elapsed_seconds: elapsed });
    router.push("/check/start");
  };

  const setHookAnswer = (id: string, answer: HookAnswer) =>
    setHookAnswers((prev) => ({ ...prev, [id]: answer }));

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

      {/* ── NAV ── */}
      <nav style={{ background: "#FAFAFA", borderBottom: "1px solid #E8E8E8" }}>
        <div className="mx-auto flex max-w-[640px] items-center justify-between px-5 py-4">
          <span style={{ fontSize: 18, fontWeight: 600, color: "#0a0a0a", letterSpacing: "-0.02em" }}>
            authority
          </span>
          <button
            onClick={() => go("nav")}
            style={{
              height: 36,
              paddingLeft: 16,
              paddingRight: 16,
              borderRadius: 8,
              background: "#0066FF",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Start free check →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: "#FAFAFA", paddingTop: 48, paddingBottom: 56 }}>
        <div className="mx-auto max-w-[640px] px-5">

          {/* Score preview badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E8E8E8", borderRadius: 100, padding: "6px 14px 6px 8px", marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0066FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>67</span>
            </div>
            <span style={{ fontSize: 13, color: "#525252", fontWeight: 500 }}>Exposed — most families score here</span>
          </div>

          <h1 style={{ fontSize: "clamp(32px, 8vw, 52px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.03em", color: "#0a0a0a", margin: 0 }}>
            Before you sign.<br />
            Before you hire.<br />
            <span style={{ color: "#404040", fontWeight: 400 }}>Know where your<br />authority breaks.</span>
          </h1>

          <p style={{ marginTop: 20, fontSize: 17, color: "#525252", lineHeight: 1.6 }}>
            A 5-minute diagnostic that reveals exactly where your household authority is fragile — and what to fix first.
          </p>

          <button
            onClick={() => go("hero_cta")}
            style={{
              marginTop: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: 56,
              borderRadius: 12,
              background: "#0066FF",
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              letterSpacing: "-0.01em",
              boxShadow: "0 4px 16px rgba(0, 102, 255, 0.3)",
            }}
          >
            Start 5-minute check →
          </button>

          <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            {["15 questions", "5 minutes", "Free to start"].map((s) => (
              <span key={s} style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#0066FF" }}>✓</span> {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3-QUESTION HOOK ── */}
      <section style={{ background: "#fff", borderTop: "1px solid #F0F0F0", borderBottom: "1px solid #F0F0F0", paddingTop: 40, paddingBottom: 40 }}>
        <div className="mx-auto max-w-[640px] px-5">
          <div style={{ display: "inline-block", background: "#EBF3FF", borderRadius: 6, padding: "4px 10px", marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0066FF", letterSpacing: "0.08em", textTransform: "uppercase" }}>Quick check</span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0a0a0a", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            Before you commit to the full 15:
          </h2>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 28px" }}>Answer 3 questions to get your estimated risk level.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {HOOK_QUESTIONS.map((hq, qi) => {
              const answer = hookAnswers[hq.id];
              return (
                <div key={hq.id}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "#1a1a1a", marginBottom: 10, lineHeight: 1.5 }}>
                    <span style={{ color: "#0066FF", fontWeight: 700, marginRight: 8 }}>{qi + 1}.</span>
                    {hq.label}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {(["yes", "no", "unsure"] as HookAnswer[]).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setHookAnswer(hq.id, opt)}
                        style={{
                          height: 48,
                          borderRadius: 10,
                          border: answer === opt ? "2px solid #0066FF" : "2px solid #E8E8E8",
                          background: answer === opt ? "#0066FF" : "#fff",
                          color: answer === opt ? "#fff" : "#525252",
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
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
            <div style={{ marginTop: 24, borderRadius: 12, border: `2px solid ${hookBorder(hookScore)}`, background: hookBg(hookScore), padding: "20px 20px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <div style={{ textAlign: "center", minWidth: 72 }}>
                  <div style={{ fontSize: 36, fontWeight: 800, color: hookColor(hookScore), lineHeight: 1 }}>~{hookScore}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>/100</div>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: hookColor(hookScore) }}>
                    Estimated: {hookLabel(hookScore)}
                  </div>
                  <div style={{ fontSize: 13, color: "#525252", marginTop: 4, lineHeight: 1.5 }}>
                    {hookBadCount === 0
                      ? "You're starting from a strong base. The full check will confirm."
                      : hookBadCount === 1
                      ? "1 critical gap detected. The full check will pinpoint where."
                      : `${hookBadCount} critical gaps. Your full index is likely in the ${hookLabel(hookScore)} range.`}
                  </div>
                </div>
              </div>
              <button
                onClick={() => go("hook_result")}
                style={{
                  display: "block",
                  width: "calc(100% + 40px)",
                  marginLeft: -20,
                  marginRight: -20,
                  height: 52,
                  borderRadius: "0 0 10px 10px",
                  background: hookColor(hookScore),
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                }}
              >
                Get my precise Authority Index →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: "#FAFAFA", paddingTop: 48, paddingBottom: 48 }}>
        <div className="mx-auto max-w-[640px] px-5">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0a0a0a", margin: "0 0 32px", letterSpacing: "-0.02em" }}>How it works</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              {
                n: "1", title: "Answer 15 questions",
                desc: "About who decides, who can access key accounts, and what's documented. Takes 5 minutes.",
                icon: "📋",
              },
              {
                n: "2", title: "Get your Authority Index",
                desc: "A score from 0–100 across five risk pillars: Decision, Access, Digital, Executor, and Alignment.",
                icon: "📊",
              },
              {
                n: "3", title: "Unlock the full report",
                desc: "Your authority map, 7-day action plan, 6 worksheets, and a conversation starter script.",
                icon: "🔓",
              },
            ].map((s, i) => (
              <div key={s.n} style={{ display: "flex", gap: 16, paddingBottom: i < 2 ? 24 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", background: "#0066FF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontWeight: 800, color: "#fff", flexShrink: 0,
                  }}>
                    {s.n}
                  </div>
                  {i < 2 && <div style={{ width: 2, flex: 1, background: "#E0E8FF", marginTop: 4, minHeight: 24 }} />}
                </div>
                <div style={{ paddingTop: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#0a0a0a" }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: "#666", marginTop: 4, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAMPLE REPORT PREVIEW ── */}
      <section style={{ background: "#fff", borderTop: "1px solid #F0F0F0", paddingTop: 48, paddingBottom: 48 }}>
        <div className="mx-auto max-w-[640px] px-5">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0a0a0a", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            What&apos;s in the full report
          </h2>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px" }}>
            Everything you need to act — not just understand.
          </p>

          <div style={{ borderRadius: 16, border: "1px solid #E8E8E8", overflow: "hidden", background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            {/* Report header */}
            <div style={{ background: "#0a0a0a", padding: "20px 20px 16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Authority Report</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Alex + Sarah</div>
                </div>
                <div style={{ background: "#1a1a1a", borderRadius: 10, padding: "10px 14px", textAlign: "center", border: "1px solid #333" }}>
                  <div style={{ fontSize: 9, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase" }}>INDEX</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1 }}>67</div>
                  <div style={{ fontSize: 10, color: "#fff", opacity: 0.6 }}>/100</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#f59e0b", marginTop: 2 }}>Exposed</div>
                </div>
              </div>
              {/* Pillar bars */}
              <div style={{ marginTop: 16, display: "flex", gap: 4 }}>
                {[
                  { label: "Decision", score: 45, color: "#ef4444" },
                  { label: "Access", score: 60, color: "#f59e0b" },
                  { label: "Digital", score: 72, color: "#f59e0b" },
                  { label: "Executor", score: 80, color: "#22c55e" },
                  { label: "Alignment", score: 55, color: "#f59e0b" },
                ].map((p) => (
                  <div key={p.label} style={{ flex: 1 }}>
                    <div style={{ background: "#2a2a2a", borderRadius: 4, height: 40, overflow: "hidden", position: "relative" }}>
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${p.score}%`, background: p.color, borderRadius: "4px 4px 0 0", opacity: 0.85 }} />
                    </div>
                    <div style={{ fontSize: 9, color: "#666", marginTop: 4, textAlign: "center" }}>{p.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk items */}
            <div style={{ padding: "16px 20px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>What breaks first</div>
              {[
                { title: "Decision deadlock during an emergency", sev: "High", tf: "0–48 hrs" },
                { title: "No reliable access to finances", sev: "High", tf: "0–48 hrs" },
                { title: "Password + 2FA recovery is fragile", sev: "Medium", tf: "3–7 days" },
              ].map((r) => (
                <div key={r.title} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F5F5F5" }}>
                  <div style={{ fontSize: 13, color: "#1a1a1a", flex: 1, paddingRight: 8 }}>{r.title}</div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <span style={{ background: "#F5F5F5", borderRadius: 6, padding: "2px 8px", fontSize: 11, color: "#777" }}>{r.tf}</span>
                    <span style={{ background: r.sev === "High" ? "#fef2f2" : "#fffbeb", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600, color: r.sev === "High" ? "#dc2626" : "#d97706" }}>{r.sev}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Blurred action plan */}
            <div style={{ padding: "0 20px", position: "relative" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>7-day action plan</div>
              <div style={{ filter: "blur(5px)", pointerEvents: "none", userSelect: "none" }}>
                {["Nominate an emergency decision holder — 10 mins", "Create a 48-hour access pathway for finances — 1 hour", "Set up password manager emergency access — 1 hour"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #F5F5F5" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, border: "2px solid #E8E8E8", flexShrink: 0 }} />
                    <div style={{ fontSize: 13, color: "#1a1a1a" }}>{t}</div>
                  </div>
                ))}
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to top, #fff, transparent)" }} />
            </div>

            <div style={{ padding: "12px 20px 20px" }}>
              <button
                onClick={() => go("report_preview")}
                style={{ display: "block", width: "100%", height: 48, borderRadius: 10, background: "#0066FF", color: "#fff", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,102,255,0.25)" }}
              >
                Unlock the full plan →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ background: "#FAFAFA", borderTop: "1px solid #F0F0F0", paddingTop: 48, paddingBottom: 48 }}>
        <div className="mx-auto max-w-[640px] px-5">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0a0a0a", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Pricing</h2>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px" }}>One-time payment. No subscription. No account.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Basic */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8E8E8", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#525252" }}>Report</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.03em", lineHeight: 1, marginTop: 4 }}>$12</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 6, marginBottom: 20 }}>Full authority report — everything you need to act.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {["Authority Index across 5 pillars", "Authority Map visualisation", "Risk breakdown", "7-day action plan", "6 downloadable worksheets", "Conversation starter script"].map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#333" }}>
                    <span style={{ color: "#0066FF", fontWeight: 700, fontSize: 16 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button
                onClick={() => go("pricing_basic")}
                style={{ display: "block", width: "100%", height: 48, borderRadius: 10, background: "#F5F5F5", color: "#1a1a1a", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer" }}
              >
                Start free check →
              </button>
            </div>

            {/* Pro */}
            <div style={{ background: "#0066FF", borderRadius: 16, border: "2px solid #0055DD", padding: "24px", boxShadow: "0 8px 32px rgba(0,102,255,0.25)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 16, right: 16, background: "#fff", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#0066FF" }}>
                Most popular
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>Report + PDF</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1, marginTop: 4 }}>$27</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 6, marginBottom: 20 }}>Everything in Report, plus a printable PDF export.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {["Everything in Report", "PDF export of full report", "Print-ready for sharing or filing"].map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "rgba(255,255,255,0.9)" }}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button
                onClick={() => go("pricing_pro")}
                style={{ display: "block", width: "100%", height: 52, borderRadius: 10, background: "#fff", color: "#0066FF", fontSize: 16, fontWeight: 800, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
              >
                Start free check →
              </button>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "#999", marginTop: 16 }}>
            You take the check for free. Pay only when you see your score and want the full report.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "#fff", borderTop: "1px solid #F0F0F0", paddingTop: 48, paddingBottom: 48 }}>
        <div className="mx-auto max-w-[640px] px-5">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0a0a0a", margin: "0 0 24px", letterSpacing: "-0.02em" }}>Common questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQ.map((item, i) => (
              <div
                key={item.q}
                style={{ borderRadius: 12, border: "1px solid #E8E8E8", background: faqOpen === i ? "#F8F9FF" : "#fff", overflow: "hidden", transition: "all 0.15s" }}
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  style={{
                    display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between",
                    padding: "18px 20px", background: "none", border: "none", cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#0a0a0a", flex: 1, paddingRight: 16 }}>{item.q}</span>
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%", background: faqOpen === i ? "#0066FF" : "#F0F0F0",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    fontSize: 18, color: faqOpen === i ? "#fff" : "#666",
                    transform: faqOpen === i ? "rotate(45deg)" : "none", transition: "all 0.2s",
                    fontWeight: 300,
                  }}>+</span>
                </button>
                {faqOpen === i && (
                  <div style={{ padding: "0 20px 18px", fontSize: 14, color: "#525252", lineHeight: 1.7 }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMAIL CAPTURE ── */}
      <section style={{ background: "#FAFAFA", borderTop: "1px solid #F0F0F0", paddingTop: 40, paddingBottom: 40 }}>
        <div className="mx-auto max-w-[640px] px-5">
          <div style={{ borderRadius: 16, border: "1px dashed #D0D0D0", background: "#fff", padding: "28px 24px" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0a0a0a", marginBottom: 4 }}>Not ready yet?</div>
            <p style={{ fontSize: 14, color: "#666", margin: "0 0 16px" }}>Enter your email and we&apos;ll remind you. One email, nothing else.</p>
            <LandingEmailCapture />
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ background: "#0a0a0a", paddingTop: 56, paddingBottom: 56 }}>
        <div className="mx-auto max-w-[640px] px-5" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.03em" }}>
            Know where your authority breaks.
          </div>
          <p style={{ fontSize: 15, color: "#888", marginTop: 10, marginBottom: 28 }}>
            5 minutes. Free to start. Pay only if you want the full picture.
          </p>
          <button
            onClick={() => go("bottom_cta")}
            style={{
              height: 56, paddingLeft: 32, paddingRight: 32, borderRadius: 12,
              background: "#fff", color: "#0a0a0a", fontSize: 17, fontWeight: 800,
              border: "none", cursor: "pointer", letterSpacing: "-0.01em",
            }}
          >
            Start the free check →
          </button>
          <div style={{ marginTop: 20, fontSize: 12, color: "#555" }}>
            No account required · Nothing stored on servers · Free to start
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0a0a0a", borderTop: "1px solid #1a1a1a", padding: "16px 20px", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "#555", margin: 0 }}>
          This is an informational tool, not legal advice. Speak to a qualified professional if you&apos;re unsure.
        </p>
      </footer>
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
    return <p style={{ fontSize: 14, color: "#16a34a", marginTop: 0 }}>Got it — we&apos;ll send one reminder.</p>;
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="your@email.com"
        style={{
          flex: 1, height: 44, borderRadius: 10, border: "1px solid #E8E8E8",
          padding: "0 14px", fontSize: 14, outline: "none", background: "#FAFAFA",
          minWidth: 0,
        }}
      />
      <button
        onClick={submit}
        disabled={status === "loading"}
        style={{
          height: 44, paddingLeft: 16, paddingRight: 16, borderRadius: 10,
          background: "#0066FF", color: "#fff", fontSize: 14, fontWeight: 600,
          border: "none", cursor: "pointer", flexShrink: 0,
          opacity: status === "loading" ? 0.6 : 1,
        }}
      >
        Remind me
      </button>
    </div>
  );
}
