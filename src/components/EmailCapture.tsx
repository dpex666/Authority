"use client";

import * as React from "react";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";

const DISMISSED_KEY = "authority_email_dismissed";

export default function EmailCapture({ source }: { source: string }) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "done" | "dismissed">("idle");

  React.useEffect(() => {
    if (window.sessionStorage.getItem(DISMISSED_KEY) === "1") {
      setStatus("dismissed");
    }
  }, []);

  const dismiss = () => {
    window.sessionStorage.setItem(DISMISSED_KEY, "1");
    setStatus("dismissed");
  };

  const submit = async () => {
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });
    } catch {
      // fail silently
    }
    setStatus("done");
    window.sessionStorage.setItem(DISMISSED_KEY, "1");
  };

  if (status === "dismissed" || status === "done") return null;

  return (
    <Card className="border-dashed bg-white/95">
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[color:var(--muted)]">
          {status === "loading"
            ? "Saving..."
            : "Want a 30-day check-in reminder? One email, nothing else."}
        </div>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="your@email.com"
            className="h-9 flex-1 rounded-[var(--radius)] border border-[color:var(--border)] px-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)] sm:w-48 sm:flex-none"
          />
          <Button size="sm" onClick={submit} disabled={status === "loading"}>
            Send
          </Button>
          <Button size="sm" variant="ghost" onClick={dismiss}>
            No thanks
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
