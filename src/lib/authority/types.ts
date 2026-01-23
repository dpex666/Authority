export type AuthorityPillar =
  | "decision"
  | "access"
  | "digital"
  | "executor"
  | "alignment";

export type AnswerValue =
  | "yes"
  | "no"
  | "unsure"
  | "na"
  | "low"
  | "medium"
  | "high";

export type QuestionType = "single" | "scale";

export type Question = {
  id: string;
  pillar: AuthorityPillar;
  title: string;
  help?: string;
  type: QuestionType;
  options?: { value: AnswerValue; label: string }[];
  // For "scale" questions, value is low/medium/high/unsure/na
};

export type AuthorityAnswers = Record<string, AnswerValue>;

export type AuthorityCheckState = {
  answers: AuthorityAnswers;
  currentQuestionNumber: number;
  updatedAt: number;
};

export type PillarResult = {
  pillar: AuthorityPillar;
  score: number; // 0-100
  max: number; // always 100 for display
  flags: string[];
};

export type AuthorityResult = {
  overall: number; // 0-100
  pillars: Record<AuthorityPillar, PillarResult>;
  topFlags: string[];
  updatedAt: number;
};
