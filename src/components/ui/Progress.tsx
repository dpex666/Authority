export function Progress({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full rounded-full bg-[color:var(--bg-1)] overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)] transition-all"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
