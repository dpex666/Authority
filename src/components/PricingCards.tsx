"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

const TIERS = [
  {
    id: "basic" as const,
    name: "Report",
    price: "$12",
    description: "Full authority report — everything you need to act.",
    features: [
      "Authority Index score across 5 pillars",
      "Authority Map visualisation",
      "Risk breakdown — what breaks first, and when",
      "7-day action plan with effort estimates",
      "6 downloadable worksheets",
      "Conversation starter script",
    ],
    cta: "Get full report — $12",
    highlight: false,
  },
  {
    id: "pro" as const,
    name: "Report + PDF",
    price: "$27",
    description: "Everything in Report, plus a printable PDF export.",
    features: [
      "Everything in Report",
      "PDF export of the full report",
      "Print-ready for sharing or filing",
      "Share with your solicitor or accountant",
    ],
    cta: "Get report + PDF — $27",
    highlight: true,
  },
] as const;

function urgencyLine(score: number): string {
  if (score < 50)
    return "Your authority is critically fragile — here's exactly where and what to do.";
  if (score < 70)
    return "You have real gaps. The full report shows which ones matter most and how to fix them.";
  return "You're in decent shape — the plan shows you how to get to bulletproof.";
}

export default function PricingCards({
  onSelect,
  score,
}: {
  onSelect: (tier: "basic" | "pro") => void;
  score?: number;
}) {
  return (
    <div className="mt-2">
      {score !== undefined && (
        <p className="mb-4 text-sm font-medium text-[color:var(--text)]">
          {urgencyLine(score)}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {TIERS.map((t) => (
          <Card
            key={t.id}
            className={[
              "bg-white/95",
              t.highlight ? "ring-2 ring-[color:var(--primary)]" : "",
            ].join(" ")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.name}</CardTitle>
                {t.highlight && <Badge tone="primary">Most popular</Badge>}
              </div>
              <div className="mt-2 text-3xl font-semibold text-[color:var(--text)]">
                {t.price}
              </div>
              <div className="text-sm text-[color:var(--muted)]">{t.description}</div>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-[color:var(--muted)]">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-[#00A86B]">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => onSelect(t.id)}>
                {t.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
