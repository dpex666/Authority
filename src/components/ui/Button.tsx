import * as React from "react";

type Variant = "primary" | "secondary" | "ghost";

export function buttonStyles({
  variant = "primary",
  size = "md",
  className = "",
  disabled,
}: {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] font-medium transition focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20";

  const sizes = {
    sm: "px-3.5 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants: Record<Variant, string> = {
    primary:
      "bg-[color:var(--primary)] text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)] hover:bg-[#111827] active:scale-[0.98]",
    secondary:
      "border border-[color:var(--border)] bg-white text-[color:var(--ink)] shadow-sm hover:bg-[color:var(--bg-1)]",
    ghost: "text-[color:var(--ink)] hover:bg-[color:var(--bg-1)]",
  };

  const disabledStyle =
    "opacity-50 cursor-not-allowed hover:bg-inherit active:scale-100 shadow-none";

  return [
    base,
    sizes[size],
    variants[variant],
    disabled ? disabledStyle : "",
    className,
  ].join(" ");
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  className = "",
  type = "button",
  size = "md",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles({ variant, size, className, disabled })}
    >
      {children}
    </button>
  );
}
