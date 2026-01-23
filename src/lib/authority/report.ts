import type { AnswerValue, AuthorityAnswers, AuthorityPillar } from "@/lib/authority/types";
import type {
  AuthorityReport,
  ReportAction,
  ReportRisk,
  ReportPillarSummary,
  ReportPackItem,
  ActionEffort,
  ActionImpact,
  ActionDue,
  RiskSeverity,
  RiskTimeframe,
} from "./reportTypes";
import { scoreAuthority, overallLabel } from "@/lib/authority/score";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type Single = "yes" | "no" | "unsure" | "na";
type Scale = number; // we’ll assume 1–5 (or 0–10). We handle both.

function asSingle(v: unknown): Single | null {
  if (v === "yes" || v === "no" || v === "unsure" || v === "na") return v;
  return null;
}

function asScale(v: unknown): Scale | null {
  if (v === "low") return 1;
  if (v === "medium") return 3;
  if (v === "high") return 5;
  if (v === "unsure" || v === "na") return null;
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isFinite(n)) return n;
  return null;
}

function scaleToFive(n: number): number {
  // If you ever swap to 0–10, we normalise to 1–5.
  if (n <= 5) return clamp(n, 1, 5);
  // assume 0–10 or 1–10
  const normalised = Math.round((clamp(n, 0, 10) / 10) * 5);
  return clamp(normalised, 1, 5);
}

function confidenceFromAnswers(answers: AuthorityAnswers): "Low" | "Medium" | "High" {
  const count = Object.keys(answers || {}).length;
  if (count >= 12) return "High";
  if (count >= 7) return "Medium";
  return "Low";
}

const PILLAR_NAMES: Record<AuthorityPillar, string> = {
  decision: "Decision Authority",
  access: "Access Authority",
  digital: "Digital Authority",
  executor: "Executor Load",
  alignment: "Family Alignment",
};

function topDriversFromFlags(flags: string[], max = 2) {
  return (flags || []).slice(0, max);
}

function mkRisk(partial: Omit<ReportRisk, "id">, i: number): ReportRisk {
  return { id: `risk_${i}`, ...partial };
}

function mkAction(partial: Omit<ReportAction, "id">, i: number): ReportAction {
  return { id: `action_${i}`, ...partial };
}

function priorityScore(sev: RiskSeverity, tf: RiskTimeframe): number {
  const s = sev === "High" ? 3 : sev === "Medium" ? 2 : 1;
  const t = tf === "0–48 hours" ? 3 : tf === "3–7 days" ? 2 : 1;
  return s * 10 + t; // severity matters more than timeframe, but both count
}

function actionScore(impact: ActionImpact, due: ActionDue): number {
  const i = impact === "High" ? 3 : impact === "Medium" ? 2 : 1;
  const d = due === "Today" ? 3 : due === "This week" ? 2 : 1;
  return i * 10 + d;
}

function effortRank(e: ActionEffort): number {
  const map: Record<ActionEffort, number> = {
    "10 mins": 1,
    "30 mins": 2,
    "1 hour": 3,
    "Half day": 4,
    "1 day": 5,
  };
  return map[e];
}

function fmtNowLabel() {
  return new Date().toLocaleString();
}

export function generateReport(answers: AuthorityAnswers, profile?: { youName?: string; partnerName?: string }): AuthorityReport {

  const scored = scoreAuthority(answers);
  const overall = clamp(scored.overall, 0, 100);

  // Build pillar summaries with “drivers” derived from flags (from your scoring)
  const pillars: ReportPillarSummary[] = (Object.keys(scored.pillars) as AuthorityPillar[]).map((p) => {
    const pr = scored.pillars[p];
    return {
      pillar: p,
      name: PILLAR_NAMES[p],
      score: pr.score,
      drivers: pr.flags?.length ? topDriversFromFlags(pr.flags, 2) : ["No major flags detected in this pillar."],
    };
  });

  const pDecision = pillars.find((p) => p.pillar === "decision")?.score ?? 100;
  const pAccess = pillars.find((p) => p.pillar === "access")?.score ?? 100;
  const pDigital = pillars.find((p) => p.pillar === "digital")?.score ?? 100;
  const pExecutor = pillars.find((p) => p.pillar === "executor")?.score ?? 100;
  const pAlignment = pillars.find((p) => p.pillar === "alignment")?.score ?? 100;

  // --- Read actual question answers ---
  const get = (id: string): AnswerValue | undefined => answers[id];
  const dec_1 = asSingle(get("dec_1"));
  const dec_2 = asSingle(get("dec_2"));
  const dec_3 = asScale(get("dec_3")); // conflict likelihood

  const acc_1 = asSingle(get("acc_1"));
  const acc_2 = asSingle(get("acc_2"));
  const acc_3 = asScale(get("acc_3")); // single-person dependency

  const dig_1 = asSingle(get("dig_1")); // password manager + emergency access
  const dig_2 = asSingle(get("dig_2")); // plan for accounts
  const dig_3 = asScale(get("dig_3")); // digital exposure

  const exe_1 = asSingle(get("exe_1")); // chosen executor can handle load
  const exe_2 = asSingle(get("exe_2")); // would say yes today
  const exe_3 = asScale(get("exe_3")); // burnout risk

  const ali_1 = asSingle(get("ali_1")); // agree on what you'd want
  const ali_2 = asSingle(get("ali_2")); // known tension points
  const ali_3 = asScale(get("ali_3")); // dispute likelihood

  const conflictLikely = dec_3 ? scaleToFive(dec_3) >= 4 : pDecision < 55;
  const adminSinglePoint = acc_3 ? scaleToFive(acc_3) >= 4 : pAccess < 55;
  const digitalHighExposure = dig_3 ? scaleToFive(dig_3) >= 4 : pDigital < 55;
  const executorBurnoutLikely = exe_3 ? scaleToFive(exe_3) >= 4 : pExecutor < 55;
  const disputeLikely = ali_3 ? scaleToFive(ali_3) >= 4 : pAlignment < 55;

  // --- Risks (answer-aware) ---
  const risks: ReportRisk[] = [];

  // Decision risks
  if (dec_1 === "no" || dec_1 === "unsure") {
    risks.push(
      mkRisk(
        {
          title: "Decision deadlock during an emergency",
          whyItMatters:
            "When nobody is clearly nominated, people default to assumptions. Under stress, assumptions become conflict and delays.",
          whatToDo:
            "Nominate an emergency decision holder and define the boundary (emergency-only, time-boxed decisions).",
          severity: "High",
          timeframe: "0–48 hours",
        },
        risks.length
      )
    );
  } else if (dec_1 === "yes" && (dec_2 === "no" || dec_2 === "unsure")) {
    risks.push(
      mkRisk(
        {
          title: "You have a decision holder, but others don’t know",
          whyItMatters:
            "A decision structure only works if the relevant people actually know it exists. Otherwise they improvise.",
          whatToDo:
            "Send a short message to the key people naming the decision holder and what that role covers.",
          severity: "Medium",
          timeframe: "0–48 hours",
        },
        risks.length
      )
    );
  }

  if (conflictLikely) {
    risks.push(
      mkRisk(
        {
          title: "High chance of ‘final say’ disputes",
          whyItMatters:
            "If two people think they have the right to decide, the system breaks exactly when time matters most.",
          whatToDo:
            "Write down a simple escalation rule: who decides, who advises, and when a neutral tie-breaker is used.",
          severity: pDecision < 50 ? "High" : "Medium",
          timeframe: "0–48 hours",
        },
        risks.length
      )
    );
  }

  // Access risks
  if (acc_1 === "no" || acc_1 === "unsure") {
    risks.push(
      mkRisk(
        {
          title: "No reliable access to finances within 48 hours",
          whyItMatters:
            "If funds are inaccessible, everything slows down: admin, services, and immediate obligations.",
          whatToDo:
            "Create a 48-hour access pathway: who can access what, and what proof is needed.",
          severity: "High",
          timeframe: "0–48 hours",
        },
        risks.length
      )
    );
  }

  if (acc_2 === "no" || acc_2 === "unsure") {
    risks.push(
      mkRisk(
        {
          title: "Documents aren’t easy to locate",
          whyItMatters:
            "Even if documents exist (IDs, insurance, deeds), delays happen when nobody can find them quickly.",
          whatToDo:
            "Build a one-page Document Locator: what exists + where it is (physical + digital).",
          severity: pAccess < 55 ? "High" : "Medium",
          timeframe: "3–7 days",
        },
        risks.length
      )
    );
  }

  if (adminSinglePoint) {
    risks.push(
      mkRisk(
        {
          title: "Single point of failure for life admin",
          whyItMatters:
            "If one person ‘knows everything’, others can’t act quickly. That turns grief into admin chaos.",
          whatToDo:
            "Create a shared ‘Admin Map’: key accounts, contacts, recurring payments, and where the docs live.",
          severity: pAccess < 50 ? "High" : "Medium",
          timeframe: "3–7 days",
        },
        risks.length
      )
    );
  }

  // Digital risks
  if (dig_1 === "no" || dig_1 === "unsure") {
    risks.push(
      mkRisk(
        {
          title: "Password + 2FA recovery is fragile",
          whyItMatters:
            "Without emergency access, account recovery can stall and block everything else (banking, claims, admin).",
          whatToDo:
            "Set up a password manager (or equivalent), enable emergency access, and store 2FA recovery codes securely.",
          severity: "High",
          timeframe: "0–48 hours",
        },
        risks.length
      )
    );
  } else if (dig_1 === "yes" && (dig_2 === "no" || dig_2 === "unsure")) {
    risks.push(
      mkRisk(
        {
          title: "You have a password manager, but no account plan",
          whyItMatters:
            "Tools help, but without a plan your partner still doesn’t know what matters, what to prioritise, or where the gaps are.",
          whatToDo:
            "Create a ‘Key Accounts Plan’: email, cloud, phone, banking, socials, subscriptions, plus recovery steps.",
          severity: "Medium",
          timeframe: "3–7 days",
        },
        risks.length
      )
    );
  } else if (dig_2 === "no" || dig_2 === "unsure") {
    risks.push(
      mkRisk(
        {
          title: "No plan for key digital accounts",
          whyItMatters:
            "Email and phone are the keys to everything. Without a plan, recovery loops can drag for weeks.",
          whatToDo:
            "Write down the top accounts and their recovery steps; add a ‘first 48 hours’ order.",
          severity: pDigital < 55 ? "High" : "Medium",
          timeframe: "3–7 days",
        },
        risks.length
      )
    );
  }

  if (digitalHighExposure) {
    risks.push(
      mkRisk(
        {
          title: "High exposure in digital assets",
          whyItMatters:
            "Crypto, subscriptions, creator revenue, devices, and 2FA create hidden financial and access risk.",
          whatToDo:
            "Create a Digital Assets inventory: what exists, where it’s stored, and who can recover it.",
          severity: pDigital < 50 ? "High" : "Medium",
          timeframe: "1–4 weeks",
        },
        risks.length
      )
    );
  }

  // Executor risks
  if (exe_1 === "no" || exe_1 === "unsure") {
    risks.push(
      mkRisk(
        {
          title: "No confirmed executor who can handle the load",
          whyItMatters:
            "Executor load is real work. If the wrong person is chosen (or nobody is chosen), things drag and stress compounds.",
          whatToDo:
            "Nominate a primary executor and backup. Choose for bandwidth and temperament, not guilt.",
          severity: "High",
          timeframe: "1–4 weeks",
        },
        risks.length
      )
    );
  }

  if (exe_2 === "no" || exe_2 === "unsure") {
    risks.push(
      mkRisk(
        {
          title: "Executor consent is not confirmed",
          whyItMatters:
            "If the executor says no later, you’ve lost time and created confusion when clarity matters.",
          whatToDo:
            "Have the consent conversation now, and share a one-page briefing so it’s not overwhelming.",
          severity: pExecutor < 55 ? "High" : "Medium",
          timeframe: "1–4 weeks",
        },
        risks.length
      )
    );
  }

  if (executorBurnoutLikely) {
    risks.push(
      mkRisk(
        {
          title: "Executor burnout risk is high",
          whyItMatters:
            "Even good people burn out. When they do, nothing moves and everyone else gets frustrated.",
          whatToDo:
            "Reduce load with a checklist, support roles, and a ‘who to call for what’ contact sheet.",
          severity: "Medium",
          timeframe: "1–4 weeks",
        },
        risks.length
      )
    );
  }

  // Alignment risks
  if (ali_1 === "no" || ali_1 === "unsure") {
    risks.push(
      mkRisk(
        {
          title: "Key people may not agree on what you’d want",
          whyItMatters:
            "Misalignment creates arguments, delays, and guilt. The fix is clarity, not control.",
          whatToDo:
            "Capture your ‘baseline wishes’ in one place and share it with the relevant people.",
          severity: pAlignment < 55 ? "High" : "Medium",
          timeframe: "1–4 weeks",
        },
        risks.length
      )
    );
  }

  if (ali_2 === "yes") {
    risks.push(
      mkRisk(
        {
          title: "Known tension points could flare up",
          whyItMatters:
            "When tension exists, people interpret decisions through emotion. You need structure to reduce heat.",
          whatToDo:
            "Define roles and boundaries now (who decides, who is informed, who is not involved).",
          severity: "High",
          timeframe: "0–48 hours",
        },
        risks.length
      )
    );
  }

  if (disputeLikely) {
    risks.push(
      mkRisk(
        {
          title: "High likelihood of disputes over fairness",
          whyItMatters:
            "Disputes don’t start with big things. They start with silence, assumptions, and mixed messages.",
          whatToDo:
            "Add a neutral decision pathway (executor authority + written wishes + one spokesperson).",
          severity: "High",
          timeframe: "1–4 weeks",
        },
        risks.length
      )
    );
  }

  // Fallback: if not enough risks, add a low-level general one
  while (risks.length < 5) {
    risks.push(
      mkRisk(
        {
          title: "Hidden single point of failure",
          whyItMatters:
            "If only one person knows how things work, you have fragility even if day-to-day feels fine.",
          whatToDo:
            "Identify the top 5 things only one person can do, then create a backup pathway.",
          severity: "Low",
          timeframe: "1–4 weeks",
        },
        risks.length
      )
    );
  }

  // Sort risks by priority and take top 3 for “What breaks first”
  const topRisks = [...risks]
    .sort((a, b) => priorityScore(b.severity, b.timeframe) - priorityScore(a.severity, a.timeframe))
    .slice(0, 3);

  // --- Actions (answer-aware, mapped tightly) ---
  const actions: ReportAction[] = [];

  // Decision actions
  if (dec_1 === "no" || dec_1 === "unsure") {
    actions.push(
      mkAction(
        {
          title: "Nominate an emergency decision holder",
          owner: "You",
          effort: "10 mins",
          impact: "High",
          due: "Today",
          template:
            "If we can’t agree in an emergency, I want one person with final say so we don’t deadlock. Let’s nominate that person and define the boundary: emergency-only.",
        },
        actions.length
      )
    );
  }
  if (dec_1 === "yes" && (dec_2 === "no" || dec_2 === "unsure")) {
    actions.push(
      mkAction(
        {
          title: "Tell the relevant people who the decision holder is",
          owner: "You",
          effort: "10 mins",
          impact: "High",
          due: "Today",
          template:
            "Quick one: if something happens and we need fast decisions, [Name] has final say for emergency-only decisions. Everyone else advises/supports. This avoids delays and stress.",
        },
        actions.length
      )
    );
  }
  if (conflictLikely) {
    actions.push(
      mkAction(
        {
          title: "Write a simple escalation rule (who decides, who advises)",
          owner: "You",
          effort: "30 mins",
          impact: "High",
          due: "This week",
        },
        actions.length
      )
    );
  }

  // Access actions
  if (acc_1 === "no" || acc_1 === "unsure") {
    actions.push(
      mkAction(
        {
          title: "Create a 48-hour access pathway for finances",
          owner: "You",
          effort: "1 hour",
          impact: "High",
          due: "This week",
        },
        actions.length
      )
    );
  }
  if (acc_2 === "no" || acc_2 === "unsure") {
    actions.push(
      mkAction(
        {
          title: "Build a one-page Document Locator",
          owner: "You",
          effort: "30 mins",
          impact: "High",
          due: "This week",
        },
        actions.length
      )
    );
  }
  if (adminSinglePoint) {
    actions.push(
      mkAction(
        {
          title: "Create a shared ‘Admin Map’ (accounts, contacts, recurring payments)",
          owner: "You",
          effort: "1 hour",
          impact: "Medium",
          due: "This week",
        },
        actions.length
      )
    );
  }

  // Digital actions
  if (dig_1 === "no" || dig_1 === "unsure") {
    actions.push(
      mkAction(
        {
          title: "Set up password manager emergency access + store 2FA recovery codes",
          owner: "You",
          effort: "1 hour",
          impact: "High",
          due: "This week",
        },
        actions.length
      )
    );
  }
  if (dig_2 === "no" || dig_2 === "unsure") {
    actions.push(
      mkAction(
        {
          title: "Write a ‘Key Accounts Plan’ (email, cloud, phone, socials)",
          owner: "You",
          effort: "30 mins",
          impact: "High",
          due: "This week",
        },
        actions.length
      )
    );
  }
  if (digitalHighExposure) {
    actions.push(
      mkAction(
        {
          title: "Create a Digital Assets inventory (crypto, subscriptions, devices)",
          owner: "You",
          effort: "Half day",
          impact: "Medium",
          due: "Next 2 weeks",
        },
        actions.length
      )
    );
  }

  // Executor actions
  if (exe_1 === "no" || exe_1 === "unsure") {
    actions.push(
      mkAction(
        {
          title: "Nominate a primary executor + backup",
          owner: "You",
          effort: "30 mins",
          impact: "High",
          due: "Next 2 weeks",
        },
        actions.length
      )
    );
  }

  // Always include consent action (it’s huge value + makes report feel complete)
  if (exe_2 === "no" || exe_2 === "unsure" || exe_1 === "no" || exe_1 === "unsure") {
    actions.push(
      mkAction(
        {
          title: "Confirm executor consent + share a short briefing",
          owner: "Executor",
          effort: "30 mins",
          impact: "High",
          due: "Next 2 weeks",
          template:
            "Hey — I’m nominating you as executor. Are you comfortable with that? If yes, I’ll share a short briefing so it’s not overwhelming later.",
        },
        actions.length
      )
    );
  } else {
    actions.push(
      mkAction(
        {
          title: "Confirm executor consent (quick check-in)",
          owner: "Executor",
          effort: "10 mins",
          impact: "Medium",
          due: "Next 2 weeks",
          template:
            "Hey — quick check-in: you’re still comfortable being executor if needed? I’ll keep it simple and share a 1-pager so it’s manageable.",
        },
        actions.length
      )
    );
  }

  if (executorBurnoutLikely) {
    actions.push(
      mkAction(
        {
          title: "Reduce executor load with support roles + contact sheet",
          owner: "You",
          effort: "1 hour",
          impact: "Medium",
          due: "Next 2 weeks",
        },
        actions.length
      )
    );
  }

  // Alignment actions
  if (ali_1 === "no" || ali_1 === "unsure") {
    actions.push(
      mkAction(
        {
          title: "Capture baseline wishes in one place",
          owner: "You",
          effort: "30 mins",
          impact: "High",
          due: "This week",
        },
        actions.length
      )
    );
  }
  if (ali_2 === "yes" || disputeLikely) {
    actions.push(
      mkAction(
        {
          title: "Define boundaries (who decides, who is informed, one spokesperson)",
          owner: "You",
          effort: "30 mins",
          impact: "High",
          due: "This week",
        },
        actions.length
      )
    );
  }

  // De-dupe actions by title (can happen if multiple triggers overlap)
  const dedupedActions = Array.from(
    new Map(actions.map((a) => [a.title.toLowerCase(), a])).values()
  );

  // Sort actions by impact/due, then prefer lower effort (so it feels doable)
  const sortedActions = dedupedActions.sort((a, b) => {
    const s = actionScore(b.impact, b.due) - actionScore(a.impact, a.due);
    if (s !== 0) return s;
    return effortRank(a.effort) - effortRank(b.effort);
  });

  // --- Authority Pack (gated, richer) ---
  const pack: ReportPackItem[] = [
    { id: "pack_48hr", name: "48-Hour Access Checklist", desc: "First two days: what someone needs, in order.", gated: true },
    { id: "pack_locator", name: "Document Locator", desc: "One page: what exists + where it is (physical + digital).", gated: true },
    { id: "pack_accounts", name: "Key Accounts Plan", desc: "Email/phone/cloud/socials: recovery steps and priority order.", gated: true },
    { id: "pack_digital", name: "Digital Recovery Plan", desc: "Password manager, 2FA recovery codes, devices, backups.", gated: true },
    { id: "pack_executor", name: "Executor Briefing Sheet", desc: "What to do, in what order, with key contacts.", gated: true },
    { id: "pack_contacts", name: "Critical Contacts Sheet", desc: "Who to call for what: bank, insurer, super, solicitor, etc.", gated: true },
  ];

  // --- Conversation script (answer-aware + tone changes) ---
  const script: string[] = [];

  // opener depends on tension risk
  if (ali_2 === "yes" || disputeLikely) {
    script.push(
      "“I want to do this while things are calm, so nobody has to guess later. This isn’t about control, it’s about preventing conflict.”"
    );
  } else {
    script.push(
      "“I want us protected if anything goes wrong. This is about reducing stress, not being dramatic.”"
    );
  }

  if (dec_1 === "no" || dec_1 === "unsure" || conflictLikely) {
    script.push(
      "“If we can’t agree in an emergency, I want one person with final say so we don’t deadlock. Emergency-only, and we can review later.”"
    );
  } else {
    script.push(
      "“We’ve got a decision holder in mind. Let’s make sure everyone who needs to know actually knows, so there’s no confusion.”"
    );
  }

  if (dig_1 === "no" || dig_2 === "no" || dig_2 === "unsure" || digitalHighExposure) {
    script.push(
      "“Digital access is the key to everything now. I want a simple plan so we can recover accounts without chaos.”"
    );
  }

  if (acc_2 === "no" || acc_2 === "unsure" || adminSinglePoint) {
    script.push(
      "“Let’s put the essentials in one place: documents, key accounts, and who to contact. 20 minutes now saves weeks later.”"
    );
  } else {
    script.push(
      "“Let’s sanity-check that we could find the important stuff quickly. If it takes longer than 5 minutes, we tighten it.”"
    );
  }

  // --- Profile context for report header (based on the strongest signals) ---
  const keyWeak: string[] = [];
  if (pDecision < 65 || dec_1 === "no" || conflictLikely) keyWeak.push("Decision Authority");
  if (pAccess < 65 || acc_1 === "no" || acc_2 === "no" || adminSinglePoint) keyWeak.push("Access Authority");
  if (pDigital < 65 || dig_1 === "no" || dig_2 === "no" || digitalHighExposure) keyWeak.push("Digital Authority");
  if (pExecutor < 65 || exe_1 === "no" || exe_2 === "no" || executorBurnoutLikely) keyWeak.push("Executor Load");
  if (pAlignment < 65 || ali_1 === "no" || ali_2 === "yes" || disputeLikely) keyWeak.push("Family Alignment");

  const context =
    keyWeak.length > 0 ? `Key focus areas: ${Array.from(new Set(keyWeak)).slice(0, 3).join(" • ")}` : "Readiness check";

  // --- Personalised insight block (the “this is about me” moment) ---
  const primaryRisk = topRisks[0];

  const headline =
    primaryRisk?.severity === "High"
      ? "Your biggest risk is a fast breakdown under stress."
      : "Your biggest risk is slow drift into confusion.";

  const summaryParts: string[] = [];

  if (primaryRisk) {
    summaryParts.push(
      `Based on your answers, the first point of failure is likely: ${primaryRisk.title.toLowerCase()}.`
    );
  }

  if (dec_1 === "no" || dec_1 === "unsure" || conflictLikely) {
    summaryParts.push("Decision authority isn’t clean enough yet — that’s where disputes usually start.");
  } else {
    summaryParts.push("Decision authority exists — the main risk is whether others actually follow it.");
  }

  if (acc_1 === "no" || acc_2 === "no" || adminSinglePoint) {
    summaryParts.push("Access is the next bottleneck: people can’t act if they can’t access money and documents.");
  } else if (dig_1 === "no" || dig_2 === "no" || digitalHighExposure) {
    summaryParts.push("Digital recovery is the next bottleneck: email/phone recovery loops block everything else.");
  } else {
    summaryParts.push("You’re not in a dangerous place — but you’ve got a few weak links worth tightening.");
  }

  const summary = summaryParts.slice(0, 3).join(" ");

  const tomorrowSnapshot: string[] = [];

  // Bullet 1: what breaks first (top risk)
  if (primaryRisk) {
    tomorrowSnapshot.push(`First break: ${primaryRisk.title}.`);
  }

  // Bullet 2: what gets delayed (access/digital)
  if (acc_1 === "no" || acc_1 === "unsure" || acc_2 === "no" || acc_2 === "unsure") {
    tomorrowSnapshot.push("Immediate drag: money + documents won’t be available fast enough.");
  } else if (dig_1 === "no" || dig_2 === "no" || dig_2 === "unsure") {
    tomorrowSnapshot.push("Immediate drag: account recovery (email/phone/2FA) will slow everything down.");
  } else {
    tomorrowSnapshot.push("Immediate drag: the ‘who does what’ part will be fuzzy unless it’s written down.");
  }

  // Bullet 3: the fastest win
  if (dec_1 === "no" || dec_1 === "unsure") {
    tomorrowSnapshot.push("Fastest win: nominate a decision holder today (10 mins).");
  } else if (acc_2 === "no" || acc_2 === "unsure") {
    tomorrowSnapshot.push("Fastest win: create a one-page Document Locator (30 mins).");
  } else if (dig_1 === "no" || dig_1 === "unsure") {
    tomorrowSnapshot.push("Fastest win: set up emergency access + 2FA recovery codes (1 hour).");
  } else {
    tomorrowSnapshot.push("Fastest win: write the 48-hour plan (who, what, where) so nobody guesses.");
  }

  // Final report
  const you = (profile?.youName || "").trim();
  const partner = (profile?.partnerName || "").trim();

  const displayName = you && partner ? `${you} + ${partner}` : you ? you : "Your household";

  return {
    subject: "Authority Report",
    profile: {
      name: displayName,
      context,
    },

    overall,
    status: overallLabel(overall),
    confidence: confidenceFromAnswers(answers),
    updatedAtLabel: scored?.updatedAt ? new Date(scored.updatedAt).toLocaleString() : fmtNowLabel(),
    pillars,
    risks: topRisks,
    actions: sortedActions.slice(0, 7),
    pack,
    script,
    insight: {
      headline,
      summary,
      tomorrowSnapshot,
    },
  };
}
