import Link from "next/link";
import * as React from "react";
import { Container } from "./Container";

export function PageShell({
  children,
  actions,
  className = "",
  size = "default",
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  return (
    <div className={["min-h-screen", className].join(" ")}>
      <header className="border-b border-[color:var(--border)] bg-white/70 backdrop-blur">
        <Container size={size} className="flex items-center justify-between gap-4 py-4">
          <Link
            href="/"
            className="text-sm font-semibold tracking-wide text-[color:var(--text)]"
          >
            Authority
          </Link>
          <div className="flex items-center gap-2">{actions}</div>
        </Container>
      </header>
      <main className="pb-16">{children}</main>
    </div>
  );
}
