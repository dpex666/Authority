export type AuthorityProfile = {
  youName: string;
  partnerName?: string;
};

const KEY = "authority_profile_v1";

export function loadProfile(): AuthorityProfile {
  if (typeof window === "undefined") return { youName: "" };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { youName: "" };
    const parsed = JSON.parse(raw);
    return {
      youName: typeof parsed.youName === "string" ? parsed.youName : "",
      partnerName: typeof parsed.partnerName === "string" ? parsed.partnerName : "",
    };
  } catch {
    return { youName: "" };
  }
}

export function saveProfile(p: AuthorityProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
