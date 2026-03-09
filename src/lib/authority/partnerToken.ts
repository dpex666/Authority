import type { AuthorityResult } from "./types";

export type PartnerScores = {
  decision: number;
  access: number;
  digital: number;
  executor: number;
  alignment: number;
  overall: number;
};

export function encodePartnerScores(result: AuthorityResult): string {
  const scores: PartnerScores = {
    decision: result.pillars.decision.score,
    access: result.pillars.access.score,
    digital: result.pillars.digital.score,
    executor: result.pillars.executor.score,
    alignment: result.pillars.alignment.score,
    overall: result.overall,
  };
  return btoa(JSON.stringify(scores))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export function decodePartnerScores(token: string): PartnerScores | null {
  try {
    const padded =
      token.replace(/-/g, "+").replace(/_/g, "/") +
      "===".slice(0, (4 - (token.length % 4)) % 4);
    return JSON.parse(atob(padded)) as PartnerScores;
  } catch {
    return null;
  }
}
