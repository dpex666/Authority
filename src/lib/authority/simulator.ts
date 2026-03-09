import type { AuthorityAnswers, AuthorityPillar, AuthorityResult, AnswerValue } from "./types";
import { scoreAuthority } from "./score";

export type SimFix = {
  questionId: string;
  pillar: AuthorityPillar;
  label: string;
  description: string;
  optimalAnswer: AnswerValue;
  scoreDelta: number;
};

const FIX_DEFINITIONS: Omit<SimFix, "scoreDelta">[] = [
  {
    questionId: "dec_1",
    pillar: "decision",
    label: "Nominate a clear decision holder",
    description: "Marks dec_1 as Yes — a single person is clearly nominated",
    optimalAnswer: "yes",
  },
  {
    questionId: "dec_2",
    pillar: "decision",
    label: "Tell the key people who decides",
    description: "Marks dec_2 as Yes — the relevant people know who holds authority",
    optimalAnswer: "yes",
  },
  {
    questionId: "dec_3",
    pillar: "decision",
    label: "Resolve decision conflict risk",
    description: "Marks dec_3 as Low — low likelihood of 'final say' disputes",
    optimalAnswer: "low",
  },
  {
    questionId: "acc_1",
    pillar: "access",
    label: "Ensure 48-hour financial access",
    description: "Marks acc_1 as Yes — accounts can be accessed within 48 hours",
    optimalAnswer: "yes",
  },
  {
    questionId: "acc_2",
    pillar: "access",
    label: "Make documents easy to locate",
    description: "Marks acc_2 as Yes — will, IDs, insurance, deeds are findable",
    optimalAnswer: "yes",
  },
  {
    questionId: "acc_3",
    pillar: "access",
    label: "Reduce single-person dependency",
    description: "Marks acc_3 as Low — life admin knowledge is shared",
    optimalAnswer: "low",
  },
  {
    questionId: "dig_1",
    pillar: "digital",
    label: "Set up password manager + emergency access",
    description: "Marks dig_1 as Yes — password manager with emergency access in place",
    optimalAnswer: "yes",
  },
  {
    questionId: "dig_2",
    pillar: "digital",
    label: "Create a digital accounts plan",
    description: "Marks dig_2 as Yes — plan for email, cloud, socials, phone exists",
    optimalAnswer: "yes",
  },
  {
    questionId: "dig_3",
    pillar: "digital",
    label: "Reduce digital asset exposure",
    description: "Marks dig_3 as Low — digital asset exposure is low",
    optimalAnswer: "low",
  },
  {
    questionId: "exe_1",
    pillar: "executor",
    label: "Choose a capable executor",
    description: "Marks exe_1 as Yes — executor can realistically handle the load",
    optimalAnswer: "yes",
  },
  {
    questionId: "exe_2",
    pillar: "executor",
    label: "Confirm executor consent",
    description: "Marks exe_2 as Yes — executor would say yes if asked today",
    optimalAnswer: "yes",
  },
  {
    questionId: "ali_1",
    pillar: "alignment",
    label: "Align key people on your wishes",
    description: "Marks ali_1 as Yes — key people broadly agree on what you'd want",
    optimalAnswer: "yes",
  },
  {
    questionId: "ali_2",
    pillar: "alignment",
    label: "Resolve known tension points",
    description: "Marks ali_2 as No — known tension points have been addressed",
    optimalAnswer: "no",
  },
  {
    questionId: "ali_3",
    pillar: "alignment",
    label: "Lower dispute likelihood",
    description: "Marks ali_3 as Low — low likelihood of disputes over fairness",
    optimalAnswer: "low",
  },
];

export function computeSimFixes(
  answers: AuthorityAnswers,
  result: AuthorityResult,
  maxFixes = 3
): SimFix[] {
  const baseline = result.overall;

  const fixes: SimFix[] = FIX_DEFINITIONS
    .filter((def) => {
      // Only include if the current answer is not already optimal
      const current = answers[def.questionId];
      return current !== def.optimalAnswer && current !== "na";
    })
    .map((def) => {
      const modified: AuthorityAnswers = { ...answers, [def.questionId]: def.optimalAnswer };
      const newScore = scoreAuthority(modified).overall;
      return {
        ...def,
        scoreDelta: Math.max(0, newScore - baseline),
      };
    })
    .filter((f) => f.scoreDelta > 0)
    .sort((a, b) => b.scoreDelta - a.scoreDelta);

  return fixes.slice(0, maxFixes);
}

export function applyFixes(answers: AuthorityAnswers, fixIds: Set<string>): AuthorityAnswers {
  const modified = { ...answers };
  for (const def of FIX_DEFINITIONS) {
    if (fixIds.has(def.questionId)) {
      modified[def.questionId] = def.optimalAnswer;
    }
  }
  return modified;
}
