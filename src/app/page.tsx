"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/* ─── constants ─────────────────────────────────────────────────────────── */

const HOOK_QUESTIONS = [
  { id: "q1", label: "Is there one person who can make final decisions if you're unreachable?" },
  { id: "q2", label: "Could your key accounts be accessed within 24 hours without you?" },
  { id: "q3", label: "Do your key people broadly agree on what you'd want?" },
];

const FAQ_ITEMS = [
  { q: "Is this legal advice?", a: "No. It's a diagnostic tool. Use it to identify gaps, then speak to a professional if needed." },
  { q: "Do you store my answers?", a: "Answers are stored only in your browser's local storage. Nothing is sent to our servers during the quiz." },
  { q: "What happens after I pay?", a: "You're redirected back to your results page, which unlocks immediately. No account needed." },
  { q: "Can I share the report?", a: "Yes — the summary page has a \"Copy share link\" button that encodes your results in the URL. Anyone with the link can view your score." },
];

const PILLARS = [
  { label: "Decision", score: 45, color: "#ef4444" },
  { label: "Access", score: 60, color: "#f59e0b" },
  { label: "Digital", score: 72, color: "#f59e0b" },
  { label: "Executor", score: 80, color: "#10b981" },
  { label: "Alignment", score: 55, color: "#f59e0b" },
];

type HookAnswer = "yes" | "no" | "unsure";

function miniScore(a: Record<string, HookAnswer>) {
  let s = 0;
  for (const v of Object.values(a)) { if (v === "yes") s += 33; else if (v === "unsure") s += 16; }
  return Math.min(s, 99);
}
function riskLabel(s: number) { return s >= 80 ? "Stable" : s >= 50 ? "Exposed" : "Fragile"; }
function riskColor(s: number) { return s >= 80 ? "#10b981" : s >= 50 ? "#f59e0b" : "#ef4444"; }
function riskBg(s: number) { return s >= 80 ? "rgba(16,185,129,0.12)" : s >= 50 ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)"; }

/* ─── component ─────────────────────────────────────────────────────────── */

export default function HomePage() {
  const router = useRouter();
  const t0 = useRef(0);
  const [faq, setFaq] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, HookAnswer>>({});

  const score = miniScore(answers);
  const done = Object.keys(answers).length === HOOK_QUESTIONS.length;

  useEffect(() => { t0.current = Date.now(); }, []);

  const go = (loc: string) => {
    console.log("[analytics]", { event: "check_started", location: loc, elapsed: Math.round((Date.now() - t0.current) / 1000) });
    router.push("/check/start");
  };

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background: "#fff", overflowX: "hidden" }}>

      {/* ══════════════════════ HERO (dark) ══════════════════════ */}
      <div style={{ background: "linear-gradient(160deg, #09090F 0%, #0D0D1A 100%)", minHeight: "100svh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>

        {/* subtle grid texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

        {/* blue glow top-right */}
        <div style={{ position: "absolute", top: -120, right: -80, width: 400, height: 400, background: "radial-gradient(circle, rgba(0,102,255,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* nav */}
        <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px" }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>authority</span>
          <button onClick={() => go("nav")} style={{ height: 36, padding: "0 16px", borderRadius: 100, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(8px)", letterSpacing: "-0.01em" }}>
            Start free check →
          </button>
        </nav>

        {/* hero content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "24px 24px 0", position: "relative", zIndex: 10 }}>

          {/* eyebrow */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>5-minute diagnostic</span>
          </div>

          <h1 style={{ fontSize: "clamp(34px, 9vw, 56px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.04em", margin: 0 }}>
            Know exactly<br />
            where your<br />
            <span style={{ background: "linear-gradient(135deg, #4D94FF 0%, #0066FF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>authority<br />breaks.</span>
          </h1>

          <p style={{ marginTop: 20, fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, maxWidth: 340 }}>
            15 questions reveal the hidden gaps in who decides, who can access, and who knows what — before a crisis forces the answer.
          </p>

          <button
            onClick={() => go("hero_cta")}
            style={{ marginTop: 28, alignSelf: "stretch", height: 58, borderRadius: 14, background: "#0066FF", color: "#fff", fontSize: 18, fontWeight: 800, border: "none", cursor: "pointer", letterSpacing: "-0.02em", boxShadow: "0 8px 32px rgba(0,102,255,0.45), 0 2px 8px rgba(0,102,255,0.3)", position: "relative", overflow: "hidden" }}
          >
            <span style={{ position: "relative", zIndex: 1 }}>Start the free check →</span>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)" }} />
          </button>

          <p style={{ marginTop: 12, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "0.02em" }}>
            Free · No account · Results in 5 min
          </p>
        </div>

        {/* floating score card */}
        <div style={{ position: "relative", zIndex: 10, padding: "32px 24px 40px" }}>
          <div style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)", padding: "20px 20px 16px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Authority Index</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 48, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-0.04em" }}>67</span>
                  <span style={{ fontSize: 18, color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>/100</span>
                </div>
              </div>
              <div style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: "8px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#f59e0b", letterSpacing: "-0.01em" }}>Exposed</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>risk tier</div>
              </div>
            </div>

            {/* pillar bars */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
              {PILLARS.map((p) => (
                <div key={p.label}>
                  <div style={{ height: 48, borderRadius: 6, background: "rgba(255,255,255,0.05)", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
                    <div style={{ width: "100%", height: `${p.score}%`, background: p.color, borderRadius: "4px 4px 0 0", opacity: 0.9 }} />
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 4, fontWeight: 500 }}>{p.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(239,68,68,0.12)", borderRadius: 10, border: "1px solid rgba(239,68,68,0.2)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", marginBottom: 2 }}>Highest risk · Decision pillar</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>No nominated decision holder if you're unreachable</div>
            </div>

            <div style={{ marginTop: 10, fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
              Sample result — your score will differ
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════ STATS STRIP ══════════════════════ */}
      <div style={{ background: "#F9F9FB", borderTop: "1px solid #EBEBEF", borderBottom: "1px solid #EBEBEF", padding: "20px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, maxWidth: 640, margin: "0 auto" }}>
          {[
            { n: "15", sub: "questions" },
            { n: "5 min", sub: "to complete" },
            { n: "$0", sub: "to start" },
          ].map((s) => (
            <div key={s.n} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 3, fontWeight: 500 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════ 3-QUESTION HOOK ══════════════════════ */}
      <div style={{ background: "#fff", padding: "52px 0" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px" }}>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#EBF2FF", borderRadius: 100, padding: "6px 14px", marginBottom: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0066FF" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0066FF", letterSpacing: "0.04em", textTransform: "uppercase" }}>Quick preview</span>
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.03em", lineHeight: 1.2, margin: "0 0 8px" }}>
            3 questions.<br />Get your estimated risk.
          </h2>
          <p style={{ fontSize: 15, color: "#666", margin: "0 0 36px", lineHeight: 1.6 }}>
            Answer honestly. This isn&apos;t scored to make you feel good.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {HOOK_QUESTIONS.map((hq, qi) => {
              const ans = answers[hq.id];
              return (
                <div key={hq.id} style={{ borderRadius: 16, border: `2px solid ${ans ? "#0066FF" : "#EBEBEF"}`, background: ans ? "#F5F8FF" : "#FAFAFA", padding: "18px 18px 16px", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: ans ? "#0066FF" : "#E8E8E8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: ans ? "#fff" : "#999" }}>{qi + 1}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#0a0a0a", lineHeight: 1.5 }}>{hq.label}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {(["yes", "no", "unsure"] as HookAnswer[]).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAnswers((p) => ({ ...p, [hq.id]: opt }))}
                        style={{
                          height: 44, borderRadius: 10, border: "none",
                          background: ans === opt
                            ? opt === "yes" ? "#10b981" : opt === "no" ? "#ef4444" : "#6366f1"
                            : "#fff",
                          color: ans === opt ? "#fff" : "#525252",
                          fontSize: 14, fontWeight: 700, cursor: "pointer",
                          boxShadow: ans === opt ? "none" : "0 1px 4px rgba(0,0,0,0.08)",
                          outline: ans === opt ? "none" : "1px solid #E8E8E8",
                          transition: "all 0.15s",
                          letterSpacing: "-0.01em",
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

          {done && (
            <div style={{ marginTop: 24, borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
              <div style={{ background: riskBg(score), borderTop: `4px solid ${riskColor(score)}`, padding: "24px 20px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 52, fontWeight: 900, color: riskColor(score), lineHeight: 1, letterSpacing: "-0.04em" }}>{score}</div>
                    <div style={{ fontSize: 11, color: "#999", marginTop: 2, fontWeight: 600 }}>EST. SCORE</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: riskColor(score), letterSpacing: "-0.02em" }}>{riskLabel(score)}</div>
                    <div style={{ fontSize: 14, color: "#444", marginTop: 4, lineHeight: 1.5 }}>
                      {Object.values(answers).filter(a => a === "no").length === 0
                        ? "Strong baseline. Full check will confirm."
                        : `${Object.values(answers).filter(a => a === "no").length} critical gap${Object.values(answers).filter(a => a === "no").length > 1 ? "s" : ""} detected. Get the full picture.`}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => go("hook_result")}
                style={{ display: "block", width: "100%", height: 56, background: riskColor(score), color: "#fff", fontSize: 16, fontWeight: 800, border: "none", cursor: "pointer", letterSpacing: "-0.02em" }}
              >
                Get my precise Authority Index →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <div style={{ background: "#F9F9FB", borderTop: "1px solid #EBEBEF", padding: "52px 0" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.03em", margin: "0 0 36px" }}>Three steps.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { n: "01", title: "Answer 15 questions", desc: "Who decides, who can access accounts, what's documented. No fluff." },
              { n: "02", title: "Get your Authority Index", desc: "0–100 score across five pillars. Benchmarked against real data." },
              { n: "03", title: "See exactly what to fix", desc: "A prioritised action plan. Which gaps matter most, in which order." },
            ].map((s, i) => (
              <div key={s.n} style={{ display: "flex", gap: 0, position: "relative" }}>
                {i < 2 && <div style={{ position: "absolute", left: 19, top: 48, bottom: -4, width: 2, background: "#E0E0E8", zIndex: 0 }} />}
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 12, background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 16, zIndex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: "0.02em" }}>{s.n}</span>
                </div>
                <div style={{ paddingTop: 8, paddingBottom: i < 2 ? 32 : 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.02em" }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: "#666", marginTop: 4, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════ REPORT PREVIEW ══════════════════════ */}
      <div style={{ background: "#fff", borderTop: "1px solid #EBEBEF", padding: "52px 0" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.03em", margin: "0 0 8px" }}>
            What you&apos;ll get
          </h2>
          <p style={{ fontSize: 15, color: "#666", margin: "0 0 28px", lineHeight: 1.6 }}>
            A full picture of your household authority. Not just a score — a plan.
          </p>

          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06)" }}>
            {/* dark header */}
            <div style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)", padding: "24px 20px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Authority Report</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Alex + Sarah</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 40, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-0.04em" }}>67</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>/100</div>
                  <div style={{ marginTop: 4, display: "inline-block", background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700, color: "#f59e0b" }}>Exposed</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
                {PILLARS.map((p) => (
                  <div key={p.label}>
                    <div style={{ marginBottom: 4, textAlign: "right", fontSize: 11, fontWeight: 700, color: p.color }}>{p.score}</div>
                    <div style={{ height: 6, borderRadius: 100, background: "rgba(255,255,255,0.1)" }}>
                      <div style={{ height: "100%", width: `${p.score}%`, borderRadius: 100, background: p.color }} />
                    </div>
                    <div style={{ marginTop: 4, fontSize: 9, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{p.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* risk items */}
            <div style={{ background: "#fff", padding: "20px 20px 0" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>What breaks first</div>
              {[
                { t: "Decision deadlock during an emergency", s: "High", c: "#ef4444", bg: "#fef2f2" },
                { t: "No reliable access to finances within 48 hours", s: "High", c: "#ef4444", bg: "#fef2f2" },
                { t: "Password + 2FA recovery is fragile", s: "Medium", c: "#f59e0b", bg: "#fffbeb" },
              ].map((r) => (
                <div key={r.t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderBottom: "1px solid #F5F5F5" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.c, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 13, color: "#1a1a1a", fontWeight: 500, lineHeight: 1.4 }}>{r.t}</div>
                  <div style={{ flexShrink: 0, background: r.bg, borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700, color: r.c }}>{r.s}</div>
                </div>
              ))}
            </div>

            {/* blurred action plan */}
            <div style={{ background: "#fff", padding: "20px 20px 0", position: "relative" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>7-day action plan</div>
              <div style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none" }}>
                {["Nominate an emergency decision holder — 10 mins", "Create a 48-hour access pathway for finances — 1 hour", "Set up password manager emergency access — 1 hour"].map((t, i) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: i === 0 ? "#F0F5FF" : "#FAFAFA", marginBottom: 8, border: "1px solid", borderColor: i === 0 ? "#D0E2FF" : "#EBEBEF" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${i === 0 ? "#0066FF" : "#D0D0D0"}`, flexShrink: 0 }} />
                    <div style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 500 }}>{t}</div>
                  </div>
                ))}
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: "linear-gradient(to top, #fff 40%, transparent)" }} />
            </div>

            <div style={{ background: "#fff", padding: "12px 20px 20px" }}>
              <button
                onClick={() => go("report_preview")}
                style={{ display: "block", width: "100%", height: 52, borderRadius: 12, background: "#0066FF", color: "#fff", fontSize: 16, fontWeight: 800, border: "none", cursor: "pointer", letterSpacing: "-0.02em", boxShadow: "0 4px 20px rgba(0,102,255,0.3)" }}
              >
                Start for free — unlock when ready →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════ PRICING ══════════════════════ */}
      <div style={{ background: "#F9F9FB", borderTop: "1px solid #EBEBEF", padding: "52px 0" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.03em", margin: "0 0 4px" }}>Simple pricing.</h2>
          <p style={{ fontSize: 15, color: "#666", margin: "0 0 28px" }}>One-time. No subscription. No account required.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Basic */}
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E8E8E8", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#888", letterSpacing: "0.02em", textTransform: "uppercase" }}>Report</span>
              </div>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#0a0a0a", letterSpacing: "-0.04em", lineHeight: 1 }}>$12</div>
              <div style={{ fontSize: 14, color: "#888", marginTop: 4, marginBottom: 20 }}>Full authority report — everything you need to act.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                {["Authority Index across 5 pillars", "Risk breakdown by pillar", "7-day prioritised action plan", "6 downloadable worksheets", "Conversation starter script"].map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: "#F0F5FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: "#0066FF", fontWeight: 900 }}>✓</span>
                    </div>
                    <span style={{ fontSize: 14, color: "#333" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => go("pricing_basic")} style={{ display: "block", width: "100%", height: 48, borderRadius: 12, background: "#F0F0F0", color: "#0a0a0a", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: "-0.01em" }}>
                Start free check →
              </button>
            </div>

            {/* Pro */}
            <div style={{ background: "linear-gradient(145deg, #0055EE 0%, #0066FF 50%, #0088FF 100%)", borderRadius: 20, padding: "24px", boxShadow: "0 12px 48px rgba(0,102,255,0.35), 0 4px 12px rgba(0,102,255,0.2)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
              <div style={{ position: "absolute", bottom: -20, left: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.02em", textTransform: "uppercase" }}>Report + PDF</span>
                  <div style={{ background: "#fff", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 800, color: "#0066FF" }}>Most popular</div>
                </div>
                <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>$27</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginTop: 4, marginBottom: 20 }}>Everything in Report, plus a printable PDF export.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                  {["Everything in Report", "PDF export of full report", "Print-ready for sharing or filing"].map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 11, color: "#fff", fontWeight: 900 }}>✓</span>
                      </div>
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.9)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => go("pricing_pro")} style={{ display: "block", width: "100%", height: 52, borderRadius: 12, background: "#fff", color: "#0066FF", fontSize: 16, fontWeight: 900, border: "none", cursor: "pointer", letterSpacing: "-0.02em", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                  Start free check →
                </button>
              </div>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "#aaa", marginTop: 16, lineHeight: 1.6 }}>
            Take the check for free. Pay only if you want the full report.
          </p>
        </div>
      </div>

      {/* ══════════════════════ FAQ ══════════════════════ */}
      <div style={{ background: "#fff", borderTop: "1px solid #EBEBEF", padding: "52px 0" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.03em", margin: "0 0 24px" }}>Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={item.q} style={{ borderRadius: 14, border: "1.5px solid", borderColor: faq === i ? "#D0E2FF" : "#EBEBEF", overflow: "hidden", transition: "border-color 0.2s" }}>
                <button
                  onClick={() => setFaq(faq === i ? null : i)}
                  style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", padding: "18px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#0a0a0a", flex: 1, paddingRight: 16, letterSpacing: "-0.01em" }}>{item.q}</span>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: faq === i ? "#0066FF" : "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                    <span style={{ fontSize: 18, lineHeight: 1, color: faq === i ? "#fff" : "#888", transform: faq === i ? "rotate(45deg)" : "none", display: "inline-block", transition: "transform 0.2s", fontWeight: 300, marginTop: -1 }}>+</span>
                  </div>
                </button>
                {faq === i && (
                  <div style={{ padding: "0 18px 18px", fontSize: 14, color: "#555", lineHeight: 1.7 }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════ EMAIL CAPTURE ══════════════════════ */}
      <div style={{ background: "#F9F9FB", borderTop: "1px solid #EBEBEF", padding: "40px 0" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ borderRadius: 16, border: "1.5px dashed #D8D8E0", background: "#fff", padding: "28px 24px" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0a0a0a", marginBottom: 4, letterSpacing: "-0.02em" }}>Not ready yet?</div>
            <p style={{ fontSize: 14, color: "#777", margin: "0 0 16px", lineHeight: 1.6 }}>Enter your email. One reminder, nothing else.</p>
            <LandingEmailCapture />
          </div>
        </div>
      </div>

      {/* ══════════════════════ BOTTOM CTA ══════════════════════ */}
      <div style={{ background: "linear-gradient(160deg, #09090F 0%, #0D0D1A 100%)", padding: "64px 24px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 400, height: 400, background: "radial-gradient(circle, rgba(0,102,255,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto" }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.04em", marginBottom: 12 }}>
            Know where your<br />authority breaks.
          </div>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 28, lineHeight: 1.6 }}>
            5 minutes. Free to start. Pay only if you want the full picture.
          </p>
          <button
            onClick={() => go("bottom_cta")}
            style={{ display: "block", width: "100%", height: 58, borderRadius: 14, background: "#0066FF", color: "#fff", fontSize: 18, fontWeight: 800, border: "none", cursor: "pointer", letterSpacing: "-0.02em", boxShadow: "0 8px 32px rgba(0,102,255,0.4)" }}
          >
            Start the free check →
          </button>
          <p style={{ marginTop: 14, fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            No account · No spam · Results in 5 minutes
          </p>
        </div>
      </div>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <div style={{ background: "#09090F", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "16px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0, lineHeight: 1.6 }}>
          This is an informational tool, not legal advice. Speak to a qualified professional if you&apos;re unsure.
        </p>
      </div>

    </div>
  );
}

function LandingEmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const submit = async () => {
    if (!email.trim()) return;
    setStatus("loading");
    try { await fetch("/api/email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), source: "landing" }) }); } catch {}
    setStatus("done");
  };

  if (status === "done") return <p style={{ fontSize: 14, color: "#10b981", margin: 0 }}>Got it — one reminder, that&apos;s all.</p>;

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="your@email.com"
        style={{ flex: 1, height: 46, borderRadius: 12, border: "1.5px solid #E8E8E8", padding: "0 14px", fontSize: 14, outline: "none", background: "#FAFAFA", minWidth: 0, fontFamily: "inherit" }}
      />
      <button
        onClick={submit} disabled={status === "loading"}
        style={{ height: 46, padding: "0 18px", borderRadius: 12, background: "#0066FF", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", flexShrink: 0, opacity: status === "loading" ? 0.6 : 1, fontFamily: "inherit" }}
      >
        Remind me
      </button>
    </div>
  );
}
