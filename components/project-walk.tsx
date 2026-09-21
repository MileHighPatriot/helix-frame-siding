"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Photo } from "@/components/photo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export type WalkFrame = {
  src: string;
  alt: string;
  label: string;
  caption: string;
};

export function ProjectWalk({
  frames,
  title,
  href,
}: {
  frames: WalkFrame[];
  title: string;
  href: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = sectionRef.current;
    if (!node) return;
    setLive(true);

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const next = scrollable <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / scrollable));
        setProgress(next);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const position = progress * Math.max(frames.length - 1, 1);
  const active = frames[Math.round(position)] ?? frames[0];

  return (
    <section ref={sectionRef} className={cn("project-walk border-y border-border", live && "is-live")}>
      <div className="project-walk-pin mx-auto w-full max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="eyebrow">A house, turned</p>
            <h2 className="mt-3 font-heading text-4xl tracking-tight md:text-5xl">{title}</h2>
            <p className="mt-4 max-w-md text-muted-foreground leading-7">{active.caption}</p>
            <p className="mt-4 text-xs tracking-[0.18em] text-copper uppercase">{active.label}</p>
            <ol className="mt-6 flex gap-2" aria-hidden>
              {frames.map((frame, index) => (
                <li
                  key={frame.label}
                  className={cn(
                    "h-px flex-1 bg-border transition-colors duration-300",
                    live && index <= Math.round(position) && "bg-copper"
                  )}
                />
              ))}
            </ol>
            <Link href={href} className={cn(buttonVariants({ variant: "outline" }), "mt-8")}>
              Read the project
            </Link>
          </div>
          <div className="walk-stage grid gap-4">
            {frames.map((frame, index) => {
              const distance = Math.abs(position - index);
              const opacity = live ? Math.max(0, 1 - distance) : 1;
              const shift = live ? (index - position) * 22 : 0;
              return (
                <figure
                  key={frame.src}
                  className="walk-frame overflow-hidden rounded-xl border border-border"
                  aria-hidden={live && opacity < 0.35 ? true : undefined}
                  style={live ? { opacity, transform: `translate3d(${shift}px, 0, 0) scale(${1.04 - Math.min(distance, 1) * 0.04})` } : undefined}
                >
                  <div className={live ? "relative h-full" : "relative aspect-[16/10]"}>
                    <Photo src={frame.src} alt={frame.alt} sizes="(min-width: 1024px) 720px, 100vw" />
                  </div>
                  {!live && (
                    <figcaption className="px-4 py-3 text-sm text-muted-foreground">{frame.caption}</figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
