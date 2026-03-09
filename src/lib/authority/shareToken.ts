import type { AuthorityAnswers } from "./types";

export function encodeAnswers(answers: AuthorityAnswers): string {
  return btoa(JSON.stringify(answers))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export function decodeAnswers(token: string): AuthorityAnswers | null {
  try {
    const padded =
      token.replace(/-/g, "+").replace(/_/g, "/") +
      "===".slice(0, (4 - (token.length % 4)) % 4);
    return JSON.parse(atob(padded)) as AuthorityAnswers;
  } catch {
    return null;
  }
}
