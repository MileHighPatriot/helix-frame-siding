import type { CSSProperties, ReactNode } from "react";
import { cn } from "cn";

export function Reveal({
  children,
  className,
  delay = 0,
  x = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
}) {
  const motionClass = x < 0 ? "motion-left" : x > 0 ? "motion-right" : "motion-rise";

  return (
    <div
      className={cn(motionClass, className)}
      style={{ "--motion-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function RiseIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={cn("motion-rise", className)}
      style={{ "--motion-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
