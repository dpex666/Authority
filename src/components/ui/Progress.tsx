export function Progress({
  value,
  label,
}: {
  value: number;
  label?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-2">
      {label ? <div className="text-xs font-medium text-[color:var(--muted)]">{label}</div> : null}
      <div className="h-2.5 w-full rounded-full bg-[color:var(--bg-1)] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)] transition-all"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}
