import * as React from "react";

export function Input({
  id,
  label,
  helperText,
  error,
  className = "",
  inputClassName = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  error?: string;
  inputClassName?: string;
}) {
  const message = error ?? helperText;
  const messageColor = error ? "text-[color:var(--error)]" : "text-[color:var(--muted)]";

  return (
    <label className={["flex w-full flex-col gap-2 text-sm", className].join(" ")}>
      {label ? <span className="font-medium text-[color:var(--text)]">{label}</span> : null}
      <input
        id={id}
        {...props}
        className={[
          "w-full rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-base text-[color:var(--text)] shadow-[inset_0_1px_0_rgba(15,23,42,0.04)] outline-none transition",
          "focus:border-[color:var(--primary2)] focus:ring-2 focus:ring-[color:var(--ring)]",
          error ? "border-[color:var(--error)] focus:border-[color:var(--error)] focus:ring-[color:var(--error)]/20" : "",
          inputClassName,
        ].join(" ")}
      />
      {message ? <span className={["text-xs", messageColor].join(" ")}>{message}</span> : null}
    </label>
  );
}
