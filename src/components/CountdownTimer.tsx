"use client";

import * as React from "react";

const EXPIRY_KEY = "authority_offer_expiry";
const DURATION_MS = 48 * 60 * 60 * 1000; // 48 hours

function getOrSetExpiry(): number {
  const stored = localStorage.getItem(EXPIRY_KEY);
  if (stored) {
    const n = parseInt(stored, 10);
    if (!isNaN(n)) return n;
  }
  const expiry = Date.now() + DURATION_MS;
  localStorage.setItem(EXPIRY_KEY, String(expiry));
  return expiry;
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "";
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function CountdownTimer() {
  const [remaining, setRemaining] = React.useState<string | null>(null);

  React.useEffect(() => {
    const expiry = getOrSetExpiry();

    const tick = () => {
      const ms = expiry - Date.now();
      if (ms <= 0) {
        setRemaining(null);
        return;
      }
      setRemaining(formatRemaining(ms));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!remaining) return null;

  return (
    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Offer closes in {remaining}
    </div>
  );
}
