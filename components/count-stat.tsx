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
    <div ref={ref} className="border-border py-8 md:border-l md:pl-8 md:first:border-l-0 md:first:pl-0">
      <p className="display-md tabular-nums" aria-label={display}>
        <span className="inline-grid">
          <span className="invisible col-start-1 row-start-1" aria-hidden>
            {display}
          </span>
          <span className="col-start-1 row-start-1">{text}</span>
        </span>
      </p>
      <p className="label-mono mt-3">{label}</p>
    </div>
  );
}
