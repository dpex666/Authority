import Link from "next/link";
import { Container } from "./ui/Container";
import { buttonStyles } from "./ui/Button";

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--border)] bg-white/70 backdrop-blur">
      <Container className="flex flex-wrap items-center justify-between gap-3 py-4">
        <Link href="/" className="text-xs font-semibold tracking-[0.35em] text-[color:var(--ink)]">
          AUTHORITY
        </Link>
        <nav className="flex flex-wrap items-center gap-3">
          <Link
            href="/example"
            className={buttonStyles({ variant: "secondary", size: "sm" })}
          >
            View example summary
          </Link>
          <Link
            href="/quiz"
            className={buttonStyles({ variant: "primary", size: "sm" })}
          >
            Start the check
          </Link>
        </nav>
      </Container>
    </header>
  );
}
