import type { AuthorityAnswers } from "./types";

const KEY = "authority_v1_answers";

export function loadAnswers(): AuthorityAnswers {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthorityAnswers) : {};
  } catch {
    return {};
  }
}

export function saveAnswers(answers: AuthorityAnswers) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(answers));
}

export function clearAnswers() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
