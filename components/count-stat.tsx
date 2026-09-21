"use client";

import { useEffect, useRef, useState } from "react";

export function CountStat({
  value,
  display,
  label,
}: {
  value: number;
  display: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(display);
  const suffix = display.startsWith(String(value)) ? display.slice(String(value).length) : "";

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1200;
        setText(`0${suffix}`);
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - t) ** 3;
          setText(`${Math.round(value * eased)}${suffix}`);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [suffix, value]);

  return (
    <div ref={ref} className="border-r border-border px-5 py-8 last:border-r-0 md:px-8">
      <p className="font-heading text-3xl text-copper tabular-nums md:text-4xl" aria-label={display}>
        <span className="inline-grid">
          <span className="invisible col-start-1 row-start-1" aria-hidden>
            {display}
          </span>
          <span className="col-start-1 row-start-1">{text}</span>
        </span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
