import * as React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-3xl border shadow-sm",
        "border-[color:var(--border)]",
        "bg-[color:var(--card)] backdrop-blur",
        "px-6 py-6",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
