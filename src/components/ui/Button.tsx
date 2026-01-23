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
    "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-black/20";

  const primary =
    "bg-[#141414] text-white shadow-sm hover:bg-[#000000] active:scale-[0.98]";

  const secondary =
    "bg-white text-[#141414] border border-black/15 hover:bg-black/5";

  const ghost =
    "bg-transparent text-[#141414] hover:bg-black/5";

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
