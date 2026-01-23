import * as React from "react";

export function Badge({
  children,
  tone = "muted",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "muted" | "primary" | "success" | "warning";
  className?: string;
}) {
  const styles: Record<typeof tone, string> = {
    muted: "border-[color:var(--border)] bg-[color:var(--bg-1)] text-[color:var(--muted)]",
    primary: "border-[color:var(--primary)]/20 bg-[color:var(--primary)]/10 text-[color:var(--primary)]",
    success: "border-[color:var(--success)]/25 bg-[color:var(--success)]/10 text-[color:var(--success)]",
    warning: "border-[color:var(--warning)]/40 bg-[color:var(--warning)]/20 text-[color:var(--ink)]",
  };

  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
        styles[tone],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
