import type { AnswerValue } from "@/lib/authority/types";

export function ChoiceRow({
  value,
  current,
  label,
  onPick,
}: {
  value: AnswerValue;
  current?: AnswerValue;
  label: string;
  onPick: (v: AnswerValue) => void;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onPick(value)}
      className={[
        "w-full rounded-xl border px-4 py-3 text-left text-sm transition",
        active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export function ScaleRow({
  current,
  onPick,
}: {
  current?: AnswerValue;
  onPick: (v: AnswerValue) => void;
}) {
  const opts: { v: AnswerValue; label: string }[] = [
    { v: "low", label: "Low" },
    { v: "medium", label: "Medium" },
    { v: "high", label: "High" },
    { v: "unsure", label: "Not sure" },
    { v: "na", label: "Not applicable" },
  ];
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
      {opts.map((o) => {
        const active = current === o.v;
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => onPick(o.v)}
            className={[
              "rounded-xl border px-3 py-3 text-sm transition text-center",
              active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white hover:bg-zinc-50",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
