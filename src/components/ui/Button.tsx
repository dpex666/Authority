import * as React from "react";

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20";

  const primary =
    "bg-[color:var(--primary)] text-white shadow-sm shadow-[color:var(--primary)]/10 hover:bg-[#163a35] active:scale-[0.98]";

  const secondary =
    "bg-[color:var(--secondary)] text-[color:var(--primary)] border border-[color:var(--primary)]/20 hover:bg-[#c3dec0]";

  const ghost =
    "bg-transparent text-[color:var(--primary)] hover:bg-[color:var(--bg-1)]";

  const disabledStyle =
    "opacity-40 cursor-not-allowed hover:bg-inherit active:scale-100";

  const styles =
    variant === "primary"
      ? primary
      : variant === "secondary"
      ? secondary
      : ghost;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        base,
        styles,
        disabled ? disabledStyle : "",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
