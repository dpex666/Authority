import type {
  AnswerValue,
  AuthorityAnswers,
  AuthorityPillar,
  AuthorityResult,
  PillarResult,
} from "./types";
import { QUESTIONS } from "./questions";

const PILLAR_WEIGHTS: Record<AuthorityPillar, number> = {
  decision: 0.25,
  access: 0.20,
  digital: 0.20,
  executor: 0.20,
  alignment: 0.15,
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// Map answers to points (0..1). "na" is neutral and excluded.
function valueToUnit(v: AnswerValue, questionId: string): number | null {
  if (v === "na") return null;

  // scale questions: low/medium/high represent risk level (inverse score)
  if (questionId.endsWith("_3")) {
    if (v === "low") return 1;
    if (v === "medium") return 0.5;
    if (v === "high") return 0;
    if (v === "unsure") return 0.25;
    return 0.25;
  }

  // yes/no/unsure
  if (v === "yes") return 1;
  if (v === "no") return 0;
  if (v === "unsure") return 0.25;

  return 0.25;
}

function scaleLabelToValue(unit: number): AnswerValue {
  if (unit >= 0.85) return "low";
  if (unit >= 0.35) return "medium";
  return "high";
}

function buildFlags(pillar: AuthorityPillar, answers: AuthorityAnswers): string[] {
  const flags: string[] = [];

  const get = (id: string) => answers[id];

  // Decision flags
  if (pillar === "decision") {
    if (get("dec_1") === "no" || get("dec_1") === "unsure") {
      flags.push("No single decision holder is clearly nominated.");
    }
    if (get("dec_2") === "no" || get("dec_2") === "unsure") {
      flags.push("Decision authority isn’t communicated to the right people.");
    }
    const v = get("dec_3");
    if (v === "high") flags.push("High chance of decision conflict (overlapping ‘final say’).");
    if (v === "medium") flags.push("Moderate chance of decision conflict.");
  }

  // Access flags
  if (pillar === "access") {
    if (get("acc_1") === "no" || get("acc_1") === "unsure") {
      flags.push("Key financial access within 48 hours is not assured.");
    }
    if (get("acc_2") === "no" || get("acc_2") === "unsure") {
      flags.push("Important documents are not reliably discoverable.");
    }
    const v = get("acc_3");
    if (v === "high") flags.push("Single point of failure: one person holds all operational knowledge.");
    if (v === "medium") flags.push("Operational knowledge is concentrated in too few people.");
  }

  // Digital flags
  if (pillar === "digital") {
    if (get("dig_1") === "no" || get("dig_1") === "unsure") {
      flags.push("No clear emergency pathway for passwords / access.");
    }
    if (get("dig_2") === "no" || get("dig_2") === "unsure") {
      flags.push("No defined plan for key digital accounts (email/social/cloud/devices).");
    }
    const v = get("dig_3");
    if (v === "high") flags.push("Digital asset exposure is high and unmanaged.");
    if (v === "medium") flags.push("Digital asset exposure is moderate and partially unmanaged.");
  }

  // Executor flags
  if (pillar === "executor") {
    if (get("exe_1") === "no" || get("exe_1") === "unsure") {
      flags.push("Executor selection is unclear or unrealistic.");
    }
    if (get("exe_2") === "no" || get("exe_2") === "unsure") {
      flags.push("Executor consent is not confirmed (risk of refusal or resentment).");
    }
    const v = get("exe_3");
    if (v === "high") flags.push("High executor burnout risk.");
    if (v === "medium") flags.push("Moderate executor burnout risk.");
  }

  // Alignment flags
  if (pillar === "alignment") {
    if (get("ali_1") === "no" || get("ali_1") === "unsure") {
      flags.push("Family alignment is low (people may interpret your wishes differently).");
    }
    if (get("ali_2") === "yes") {
      flags.push("Known tension points exist that could escalate under stress.");
    }
    const v = get("ali_3");
    if (v === "high") flags.push("High likelihood of dispute over decisions or fairness.");
    if (v === "medium") flags.push("Moderate likelihood of dispute over decisions or fairness.");
  }

  return flags;
}

export function normaliseAnswers(answers: AuthorityAnswers): AuthorityAnswers {
  // Ensure scale questions have sensible defaults if user never answered.
  const out: AuthorityAnswers = { ...answers };
  for (const q of QUESTIONS) {
    if (!out[q.id]) {
      out[q.id] = q.type === "scale" ? "unsure" : "unsure";
    }
  }
  return out;
}

export function scoreAuthority(rawAnswers: AuthorityAnswers): AuthorityResult {
  const answers = normaliseAnswers(rawAnswers);

  const pillarUnits: Record<AuthorityPillar, number[]> = {
    decision: [],
    access: [],
    digital: [],
    executor: [],
    alignment: [],
  };

  for (const q of QUESTIONS) {
    const v = answers[q.id];
    const unit = valueToUnit(v, q.id);
    if (unit === null) continue;
    pillarUnits[q.pillar].push(unit);
  }

  const pillars = {} as Record<AuthorityPillar, PillarResult>;

  (Object.keys(pillarUnits) as AuthorityPillar[]).forEach((pillar) => {
    const units = pillarUnits[pillar];
    const avg = units.length ? units.reduce((a, b) => a + b, 0) / units.length : 0.5;
    const score = Math.round(clamp(avg * 100, 0, 100));
    const flags = buildFlags(pillar, answers);
    pillars[pillar] = { pillar, score, max: 100, flags };
  });

  const overall = Math.round(
    (Object.keys(PILLAR_WEIGHTS) as AuthorityPillar[]).reduce((sum, p) => {
      return sum + pillars[p].score * PILLAR_WEIGHTS[p];
    }, 0)
  );

  // Top flags: pick most severe first by simple heuristic (contains "High" or "No")
  const allFlags = (Object.keys(pillars) as AuthorityPillar[])
    .flatMap((p) => pillars[p].flags)
    .sort((a, b) => {
      const wa = (a.includes("High") ? 3 : 0) + (a.includes("No ") ? 2 : 0) + (a.includes("not") ? 1 : 0);
      const wb = (b.includes("High") ? 3 : 0) + (b.includes("No ") ? 2 : 0) + (b.includes("not") ? 1 : 0);
      return wb - wa;
    })
    .slice(0, 5);

  return {
    overall: clamp(overall, 0, 100),
    pillars,
    topFlags: allFlags,
    updatedAt: Date.now(),
  };
}

// Convenience: if you want to generate a “risk label” later
export function overallLabel(score: number) {
  if (score >= 85) return "Strong";
  if (score >= 70) return "Stable";
  if (score >= 50) return "Exposed";
  return "Fragile";
}
