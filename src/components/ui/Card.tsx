import * as React from "react";

export function Card({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--card)] shadow-[var(--shadow-subtle)]",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={["px-6 pt-6", className].join(" ")}>{children}</div>;
}

export function CardBody({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={["px-6 py-5", className].join(" ")}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={["px-6 pb-6", className].join(" ")}>{children}</div>;
}
