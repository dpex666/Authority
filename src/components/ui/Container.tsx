import * as React from "react";

export function Container({
  children,
  className = "",
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  const sizes: Record<typeof size, string> = {
    narrow: "max-w-3xl",
    default: "max-w-5xl",
    wide: "max-w-6xl",
  };

  return (
    <div className={["mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className].join(" ")}>
      {children}
    </div>
  );
}
