export type AuthorityTier = null | "basic" | "pro";

const KEY_V1 = "authority_unlocked_v1"; // read-only for migration
const KEY_V2 = "authority_tier_v2";

export function getTier(): AuthorityTier {
  if (typeof window === "undefined") return null;
  // Migrate v1 boolean unlock → treat as 'basic'
  if (window.localStorage.getItem(KEY_V1) === "true") {
    return "basic";
  }
  const stored = window.localStorage.getItem(KEY_V2);
  if (stored === "basic" || stored === "pro") return stored;
  return null;
}

export function setTier(tier: AuthorityTier) {
  if (typeof window === "undefined") return;
  if (tier === null) {
    window.localStorage.removeItem(KEY_V2);
  } else {
    window.localStorage.setItem(KEY_V2, tier);
  }
}

export function clearTier() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY_V1);
  window.localStorage.removeItem(KEY_V2);
}

export function canAccessReport(): boolean {
  const t = getTier();
  return t === "basic" || t === "pro";
}

export function canExportPdf(): boolean {
  return getTier() === "pro";
}

// Backward-compat shims for existing callers
export function isUnlocked(): boolean {
  return getTier() !== null;
}

export function setUnlocked() {
  setTier("basic");
}

export function clearUnlocked() {
  clearTier();
}
