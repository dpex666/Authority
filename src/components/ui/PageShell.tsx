import Link from "next/link";
import * as React from "react";
import { Container } from "./Container";

export function PageShell({
  children,
  actions,
  className = "",
  size = "default",
  mainClassName = "",
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
  mainClassName?: string;
}) {
  return (
    <div className={["min-h-screen", className].join(" ")}>
      <header className="sticky top-0 z-20 border-b border-[color:var(--border)] bg-white/70 backdrop-blur">
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
      <main className="pb-16">
        <Container size={size} className={["py-10 sm:py-12", mainClassName].join(" ")}>
          {children}
        </Container>
      </main>
    </div>
  );
}
