import type { AuthorityReport } from "@/lib/authority/reportTypes";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--bg-1)] px-3 py-1 text-xs text-[color:var(--muted)]">
      {children}
    </span>
  );
}

function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-3">
      <div className="text-sm font-semibold text-[color:var(--ink)]">{title}</div>
      {desc ? <div className="mt-1 text-sm text-[color:var(--muted)]">{desc}</div> : null}
    </div>
  );
}

function SeverityTag({ severity }: { severity: "High" | "Medium" | "Low" }) {
  const base = "rounded-full border px-2.5 py-1 text-xs font-medium";
  const map: Record<"High" | "Medium" | "Low", string> = {
    High: "border-[color:var(--error)]/20 bg-[color:var(--error)] text-white",
    Medium: "border-[color:var(--warning)]/30 bg-[color:var(--warning)] text-[color:var(--ink)]",
    Low: "border-[color:var(--border)] bg-[color:var(--bg-1)] text-[color:var(--muted)]",
  };
  return <span className={`${base} ${map[severity]}`}>{severity}</span>;
}

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="mt-3 h-2 w-full rounded-full bg-[color:var(--bg-1)] overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)]"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

export default function ReportView({
  report,
  unlocked,
}: {
  report: AuthorityReport;
  unlocked: boolean;
}) {
  return (
    <div
      id="report-root"
      className="rounded-3xl border border-[color:var(--border)] bg-white px-7 py-7 shadow-sm shadow-[color:var(--primary)]/5"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-sm text-[color:var(--muted)]">{report.profile.context}</div>
          <div className="mt-1 text-[32px] font-semibold leading-tight text-[color:var(--ink)] sm:text-[48px]">
            {report.profile.name}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge>Status: {report.status}</Badge>
            <Badge>Confidence: {report.confidence}</Badge>
            <Badge>Updated: {report.updatedAtLabel}</Badge>
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-1)] px-5 py-4">
          <div className="text-xs tracking-widest text-[color:var(--muted)]">AUTHORITY INDEX</div>
          <div className="mt-1 text-[48px] font-semibold leading-tight text-[color:var(--ink)]">
            {report.overall}/100
          </div>
          <div className="mt-2 text-sm text-[color:var(--muted)]">
            Indicates how likely decisions + access will hold under pressure.
          </div>
        </div>
      </div>

      {report.insight ? (
        <div className="mt-7 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-1)] px-5 py-4">
          <div className="text-xs tracking-widest text-[color:var(--muted)]">YOUR SNAPSHOT</div>

          <div className="mt-2 text-lg font-semibold text-[color:var(--ink)]">
            {report.insight.headline}
          </div>

          <div className="mt-2 text-sm text-[color:var(--ink-soft)]">
            {report.insight.summary}
          </div>

          <div className="mt-4 rounded-xl border border-[color:var(--border)] bg-white px-4 py-3">
            <div className="text-xs font-medium text-[color:var(--muted)]">If tomorrow happened</div>

            <div className="mt-2 space-y-1 text-sm text-[color:var(--ink-soft)]">
              {report.insight.tomorrowSnapshot.map((line) => (
                <div key={line}>• {line}</div>
              ))}
            </div>
          </div>
        </div>
      ) : null}


      <div className="mt-7">
        <SectionTitle
          title="What breaks first"
          desc="Top failure points, put simply."
        />
        <div className="grid gap-3">
          {report.risks.map((r) => (
            <div key={r.id} className="rounded-2xl border border-[color:var(--border)] bg-white px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-[color:var(--ink)]">{r.title}</div>
                <div className="flex items-center gap-2">
                  <Badge>{r.timeframe}</Badge>
                  <SeverityTag severity={r.severity} />
                </div>
              </div>
              <div className="mt-2 text-sm text-[color:var(--ink-soft)]">
                <span className="font-medium text-[color:var(--ink)]">Why it matters:</span> {r.whyItMatters}
              </div>
              <div className="mt-1 text-sm text-[color:var(--ink-soft)]">
                <span className="font-medium text-[color:var(--ink)]">What to do:</span> {r.whatToDo}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <SectionTitle title="Score breakdown" desc="What moved the needle." />
        <div className="grid gap-3">
          {report.pillars.map((p) => (
            <div key={p.pillar} className="rounded-2xl border border-[color:var(--border)] bg-white px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="font-medium text-[color:var(--ink)]">{p.name}</div>
                <Badge>{p.score}/100</Badge>
              </div>
              <ProgressBar value={p.score} />
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[color:var(--ink-soft)]">
                {p.drivers.map((d, idx) => (
                  <li key={`${p.pillar}_${idx}`}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <SectionTitle title="Next 7 days plan" desc="Clear actions with owners, effort, and timing." />
        <div className="grid gap-3">
          {report.actions.map((a) => (
            <div key={a.id} className="rounded-2xl border border-[color:var(--border)] bg-white px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-[color:var(--ink)]">{a.title}</div>
                <div className="flex flex-wrap gap-2">
                  <Badge>Owner: {a.owner}</Badge>
                  <Badge>Effort: {a.effort}</Badge>
                  <Badge>Impact: {a.impact}</Badge>
                  <Badge>Due: {a.due}</Badge>
                </div>
              </div>

              {a.template ? (
                <div className="mt-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-1)] px-4 py-3">
                  <div className="text-xs font-medium text-[color:var(--muted)]">Message template</div>
                  <div className="mt-1 text-sm text-[color:var(--ink-soft)]">{a.template}</div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <SectionTitle title="Authority Pack" desc="Downloadable sheets designed for real-world use." />
        <div className="grid gap-3 sm:grid-cols-2">
          {report.pack.map((x) => {
            const isLocked = x.gated && !unlocked;
            return (
              <div
                key={x.id}
                className="relative overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white px-5 py-4"
              >
                <div className="text-sm font-semibold text-[color:var(--ink)]">{x.name}</div>
                <div className="mt-1 text-sm text-[color:var(--muted)]">{x.desc}</div>
                <div className="mt-3 flex gap-2">
                  <Badge>PDF</Badge>
                  <Badge>Printable</Badge>
                  <Badge>Shareable</Badge>
                </div>

                {isLocked ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[2px]">
                    <div className="rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-sm text-[color:var(--muted)]">
                      Unlock to download
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <SectionTitle title="Conversation starter" desc="A short script to make the chat easier." />
        {!unlocked ? (
          <div className="rounded-2xl border border-[color:var(--border)] bg-white px-5 py-4 text-sm text-[color:var(--muted)]">
            Unlock to view the conversation script.
          </div>
        ) : (
          <div className="rounded-2xl border border-[color:var(--border)] bg-white px-5 py-4 text-sm text-[color:var(--ink-soft)] space-y-2">
            {report.script.map((line) => (
              <div key={line}>• {line}</div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-[color:var(--muted)]">
        This is a diagnostic tool, not legal advice.
      </div>
    </div>
  );
}
