"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "cn";

export function Reveal({
  children,
  className,
  delay = 0,
  x = 0,
  immediate = false,
  clip = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
  immediate?: boolean;
  clip?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(immediate);

  useEffect(() => {
    if (immediate) return;
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px 14% 0px", threshold: 0.16 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate]);

  const motionClass = clip ? "motion-clip" : x < 0 ? "motion-left" : x > 0 ? "motion-right" : "motion-rise";

  return (
    <div
      ref={ref}
      data-inview={shown ? "true" : undefined}
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
    <Reveal immediate delay={delay} className={className}>
      {children}
    </Reveal>
  );
}
