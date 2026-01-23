import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { buttonStyles } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-white/80 px-3 py-1 text-xs font-medium text-[color:var(--muted)] shadow-sm">
              3–5 minute authority readiness check
            </div>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-[color:var(--ink)] sm:text-5xl lg:text-6xl">
              Know who has power.
              <span className="block text-[color:var(--ink-soft)]">Keep control.</span>
            </h1>
            <p className="mt-4 text-base text-[color:var(--muted)] sm:text-lg">
              A fast, calm readiness check showing where decision-making, access, and digital
              control actually sit — and where it’s fragile.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/quiz" className={buttonStyles({ variant: "primary", size: "lg" })}>
                Start the check
              </Link>
              <Link href="/example" className={buttonStyles({ variant: "secondary", size: "lg" })}>
                View example summary
              </Link>
            </div>
            <div className="mt-4 text-xs text-[color:var(--muted)]">
              Not legal advice. If you’re unsure, speak to a qualified professional.
            </div>
          </div>

          <Card className="bg-white/80">
            <div className="grid gap-6 p-6">
              <div>
                <div className="text-sm font-semibold text-[color:var(--ink)]">What it does</div>
                <ul className="mt-3 space-y-2 text-sm text-[color:var(--muted)]">
                  <li>• Maps who can decide, who can access, and who can execute.</li>
                  <li>• Flags single points of failure and “grey area” authority.</li>
                  <li>• Generates a report you can share with family or advisors.</li>
                </ul>
              </div>

              <Divider />

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    title: "3–5 mins",
                    desc: "15 questions, one at a time.",
                  },
                  {
                    title: "Local-first",
                    desc: "Nothing sent anywhere by default.",
                  },
                  {
                    title: "Actionable",
                    desc: "Clear flags, not fluff.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[var(--radius)] border border-[color:var(--border)] bg-white px-4 py-4 shadow-sm"
                  >
                    <div className="text-sm font-semibold text-[color:var(--ink)]">{item.title}</div>
                    <div className="mt-1 text-xs text-[color:var(--muted)]">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
