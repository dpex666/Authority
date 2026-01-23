import * as React from "react";

export function SectionTitle({
  title,
  description,
  className = "",
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={["space-y-2", className].join(" ")}>
      <div className="text-xl font-semibold text-[color:var(--text)]">{title}</div>
      {description ? <div className="text-sm text-[color:var(--muted)]">{description}</div> : null}
    </div>
  );
}
