import type { CSSProperties } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Photo } from "@/components/photo";
import { heroPhoto } from "@/lib/content";
import { cn } from "cn";

const lines = ["Frame the", "structure.", "Finish the", "skin."];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="grid-fade pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <p className="motion-rise eyebrow">Denver · Front Range</p>
          <h1 className="mt-4 max-w-3xl font-heading text-5xl leading-[0.95] tracking-tight md:text-7xl">
            {lines.map((line, index) => (
              <span
                key={line}
                className="motion-rise block"
                style={{ "--motion-delay": `${0.08 * index}s` } as CSSProperties}
              >
                {line}
              </span>
            ))}
          </h1>
          <svg viewBox="0 0 520 16" className="mt-6 h-4 w-full max-w-md" aria-hidden>
            <path
              className="motion-draw"
              d="M2 10 H180 L210 4 H360 L390 12 H518"
              fill="none"
              stroke="var(--copper)"
              strokeWidth="1.5"
            />
          </svg>
          <p className="motion-rise mt-6 max-w-xl text-lg leading-8 text-muted-foreground" style={{ "--motion-delay": "0.2s" } as CSSProperties}>
            Helix Frame & Siding builds the skeleton and the exterior envelope, then
            keeps electricians, plumbers, roofers, and the rest of the bench on one
            schedule.
          </p>
          <div className="motion-rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ "--motion-delay": "0.28s" } as CSSProperties}>
            <Link href="/estimates" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}>
              Request an estimate
            </Link>
            <Link
              href="/permits"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5")}
            >
              Permit services
            </Link>
          </div>
        </div>
        <figure className="motion-right overflow-hidden rounded-xl border border-border" style={{ "--motion-delay": "0.12s" } as CSSProperties}>
          <div className="relative aspect-[16/10]">
            <Photo
              src={heroPhoto}
              alt="A Denver bungalow with a new fiber-cement addition and a tied-in roof"
              priority
              sizes="(min-width: 1024px) 640px, 100vw"
            />
          </div>
          <figcaption className="flex items-end justify-between gap-3 p-4">
            <div>
              <p className="eyebrow">Highlands</p>
              <p className="mt-2 font-heading text-xl">The frame and the skin, on one house.</p>
            </div>
            <Link href="/work" className="text-sm text-copper">
              See the work
            </Link>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
