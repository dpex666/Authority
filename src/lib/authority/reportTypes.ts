import type { AuthorityPillar } from "@/lib/authority/types";

export type RiskSeverity = "High" | "Medium" | "Low";
export type RiskTimeframe = "0–48 hours" | "3–7 days" | "1–4 weeks";

export type ReportRisk = {
  id: string;
  title: string;
  whyItMatters: string;
  whatToDo: string;
  severity: RiskSeverity;
  timeframe: RiskTimeframe;
};

export type ActionOwner = "You" | "Partner" | "Executor" | "Lawyer" | "Accountant";
export type ActionEffort = "10 mins" | "30 mins" | "1 hour" | "Half day" | "1 day";
export type ActionImpact = "High" | "Medium" | "Low";
export type ActionDue = "Today" | "This week" | "Next 2 weeks";

export type ReportAction = {
  id: string;
  title: string;
  owner: ActionOwner;
  effort: ActionEffort;
  impact: ActionImpact;
  due: ActionDue;
  template?: string;
};

export type ReportPackItem = {
  id: string;
  name: string;
  desc: string;
  gated?: boolean; // if true, hide/blur when locked
};

export type ReportPillarSummary = {
  pillar: AuthorityPillar;
  name: string;
  score: number;
  drivers: string[];
};

export type AuthorityReport = {
    insight?: {
    headline: string;
    summary: string;
    tomorrowSnapshot: string[];
  };
    subject: string;
  profile: {
    name: string;
    context: string;
  };
  overall: number;
  status: string;
  confidence: "Low" | "Medium" | "High";
  updatedAtLabel: string;
  pillars: ReportPillarSummary[];
  risks: ReportRisk[];
  actions: ReportAction[];
  pack: ReportPackItem[];
  script: string[];
};
