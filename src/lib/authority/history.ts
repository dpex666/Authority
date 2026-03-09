const HISTORY_KEY = "authority_score_history";
const MAX_ENTRIES = 20;

export type HistoryEntry = {
  score: number;
  label: string;
  ts: number;
};

export function recordScore(score: number, label: string): void {
  if (typeof window === "undefined") return;
  const history = getHistory();
  // Don't duplicate same score recorded within 5 minutes
  const lastEntry = history[history.length - 1];
  if (lastEntry && lastEntry.score === score && Date.now() - lastEntry.ts < 5 * 60 * 1000) {
    return;
  }
  history.push({ score, label, ts: Date.now() });
  const trimmed = history.slice(-MAX_ENTRIES);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(HISTORY_KEY);
}
