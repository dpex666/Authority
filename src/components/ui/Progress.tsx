export function Progress({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full rounded-full bg-black/10 overflow-hidden">
      <div
        className="h-full rounded-full bg-black/70 transition-all"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
