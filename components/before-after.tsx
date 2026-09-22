"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { Photo } from "@/components/photo";

export function BeforeAfter({
  before,
  after,
  caption,
  alt,
}: {
  before: string;
  after: string;
  caption: string;
  alt: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(58);
  const [reduced, setReduced] = useState(false);
  const [showAfter, setShowAfter] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  function move(clientX: number) {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(94, Math.max(6, next)));
  }

  if (reduced) {
    const src = showAfter ? after : before;
    return (
      <figure>
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
          <Photo src={src} alt={showAfter ? `After: ${alt}` : `Before: ${alt}`} />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className={showAfter ? "rounded-full border border-border px-3 py-1 text-sm" : "rounded-full border border-copper px-3 py-1 text-sm text-copper"}
            aria-pressed={!showAfter}
            onClick={() => setShowAfter(false)}
          >
            Before
          </button>
          <button
            type="button"
            className={showAfter ? "rounded-full border border-copper px-3 py-1 text-sm text-copper" : "rounded-full border border-border px-3 py-1 text-sm"}
            aria-pressed={showAfter}
            onClick={() => setShowAfter(true)}
          >
            After
          </button>
        </div>
        <figcaption className="mt-4 text-sm leading-6 text-muted-foreground">{caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure>
      <div
        ref={frame}
        className="relative aspect-[4/3] cursor-ew-resize touch-pan-y overflow-hidden rounded-2xl select-none sm:aspect-[16/9]"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          move(event.clientX);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) move(event.clientX);
        }}
      >
        <Photo src={after} alt={`After: ${alt}`} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Photo src={before} alt="" />
        </div>
        <span className="absolute top-4 left-4 rounded-full bg-black/55 px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.14em] text-white uppercase backdrop-blur">
          Before
        </span>
        <span className="absolute top-4 right-4 rounded-full bg-black/55 px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.14em] text-white uppercase backdrop-blur">
          After
        </span>
        <button
          type="button"
          role="slider"
          aria-label="Drag to compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          className="absolute inset-y-0 w-8 -translate-x-1/2 cursor-ew-resize"
          style={{ left: `${position}%` }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") setPosition((value) => Math.max(6, value - 4));
            if (event.key === "ArrowRight") setPosition((value) => Math.min(94, value + 4));
          }}
        >
          <span className="mx-auto block h-full w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)]" />
          <span className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-neutral-900 shadow-lg">
            <ChevronsLeftRight className="size-4" aria-hidden />
          </span>
        </button>
      </div>
      <figcaption className="mt-4 text-sm leading-6 text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}
