export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--bg-1)] px-3 py-1 text-xs text-[color:var(--muted)]">
      {children}
    </span>
  );
}
