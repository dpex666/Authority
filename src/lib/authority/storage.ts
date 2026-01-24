import type { AuthorityAnswers, AuthorityCheckState } from "./types";

const LEGACY_ANSWERS_KEY = "authority_v1_answers";
const CHECK_STATE_KEY = "authority_check_state";

function parseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadCheckState(): AuthorityCheckState | null {
  if (typeof window === "undefined") return null;
  const state = parseJson<AuthorityCheckState>(window.localStorage.getItem(CHECK_STATE_KEY));
  if (state?.answers) {
    return state;
  }
  const legacyAnswers = parseJson<AuthorityAnswers>(window.localStorage.getItem(LEGACY_ANSWERS_KEY));
  if (legacyAnswers) {
    return {
      answers: legacyAnswers,
      currentQuestionNumber: 1,
      updatedAt: Date.now(),
    };
  }
  return null;
}

export function saveCheckState(state: AuthorityCheckState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHECK_STATE_KEY, JSON.stringify(state));
}

export function clearCheckState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CHECK_STATE_KEY);
  window.localStorage.removeItem(LEGACY_ANSWERS_KEY);
}

export function loadLegacyAnswers(): AuthorityAnswers | null {
  if (typeof window === "undefined") return null;
  return parseJson<AuthorityAnswers>(window.localStorage.getItem(LEGACY_ANSWERS_KEY));
}
