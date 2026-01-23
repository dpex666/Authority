"use client";

import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Button } from "@/components/ui/Button";
import { PageShell } from "@/components/ui/PageShell";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function HomePage() {
  const router = useRouter();
  return (
    <PageShell
      actions={
        <>
          <Button size="sm" variant="ghost" onClick={() => router.push("/example")}>
            Example summary
          </Button>
          <Button size="sm" onClick={() => router.push("/quiz")}>
            Start the check
          </Button>
        </>
      }
    >
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-6 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.18),_transparent_60%)] blur-2xl" />
        </div>
        <Container className="relative py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="fade-in">
              <div className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-white/90 px-3 py-1 text-xs font-medium text-[color:var(--muted)] shadow-sm">
                3–5 minute authority readiness check
              </div>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-[color:var(--text)] sm:text-5xl lg:text-6xl">
                Know who has power.
                <span className="block text-[color:var(--muted)]">Keep control.</span>
              </h1>
              <p className="mt-4 text-base text-[color:var(--muted)] sm:text-lg">
                A fast, calm readiness check showing where decision-making, access, and digital
                control actually sit — and where it’s fragile.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="w-full sm:w-auto" onClick={() => router.push("/quiz")}>
                  Start the check
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/example")}
                >
                  View example summary
                </Button>
              </div>
              <div className="mt-4 text-xs text-[color:var(--muted)]">
                Not legal advice. If you’re unsure, speak to a qualified professional.
              </div>
            </div>

            <Card className="bg-white/90 shadow-[var(--shadow-soft)]">
              <CardHeader className="space-y-3">
                <CardTitle>What it does</CardTitle>
                <CardDescription>
                  A structured, local-first diagnosis of authority, access, and continuity.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-2 text-sm text-[color:var(--muted)]">
                  <li>• Maps who can decide, who can access, and who can execute.</li>
                  <li>• Flags single points of failure and “grey area” authority.</li>
                  <li>• Generates a report you can share with family or advisors.</li>
                </ul>

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
                      className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--surface2)] px-4 py-4 shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--text)]">
                        <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--primary2)]/70" />
                        {item.title}
                      </div>
                      <div className="mt-1 text-xs text-[color:var(--muted)]">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section className="mt-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <SectionTitle
                title="Designed to feel calm and guided"
                description="Clear steps, elegant surfaces, and clean hierarchy so the check feels trustworthy—not overwhelming."
              />
              <p className="text-sm text-[color:var(--muted)]">
                You’ll see a single question at a time, with structured actions and progress cues so
                you always know where you are.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Progress cues",
                  desc: "Step indicator and gentle progress bar for confidence.",
                },
                {
                  title: "Guided language",
                  desc: "Short prompts + helper text instead of dense forms.",
                },
                {
                  title: "Premium report",
                  desc: "A polished summary you can share or export.",
                },
                {
                  title: "Private by default",
                  desc: "Everything stays local unless you choose otherwise.",
                },
              ].map((item) => (
                <Card key={item.title} className="bg-white/90">
                  <CardContent className="space-y-2">
                    <div className="text-sm font-semibold text-[color:var(--text)]">{item.title}</div>
                    <div className="text-xs text-[color:var(--muted)]">{item.desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <footer className="mt-12 border-t border-[color:var(--border)]">
        <Container className="py-6">
          <div className="text-xs text-[color:var(--muted)]">
            Authority is an informational readiness tool only. It does not replace legal advice.
          </div>
        </Container>
      </footer>
    </PageShell>
  );
}
