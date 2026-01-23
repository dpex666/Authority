const KEY = "authority_unlocked_v1";

export function isUnlocked() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "true";
}

export function setUnlocked() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, "true");
}

export function clearUnlocked() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
