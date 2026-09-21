import type { CSSProperties } from "react";
import Link from "next/link";
import { Photo } from "@/components/photo";
import { buttonVariants } from "@/components/ui/button";
import { company, heroPhoto } from "@/lib/content";

const lines = ["Frame the", "structure.", "Finish the", "skin."];

const facts = [
  `Framing since ${company.founded}`,
  "Decatur Street shop, Denver",
  `Registration ${company.registration}`,
];

export function HomeHero() {
  return (
    <section className="relative -mt-[4.5rem] min-h-svh overflow-hidden">
      <div className="absolute inset-0">
        <div className="ken-burns absolute inset-0">
          <Photo
            src={heroPhoto}
            alt="A Denver bungalow with a new fiber-cement addition and a tied-in roof"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/88 to-graphite/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-black/45" />
        <div className="grid-fade pointer-events-none absolute inset-0 opacity-60" />
      </div>
      <div className="relative mx-auto flex min-h-svh max-w-7xl flex-col justify-end px-5 pt-32 pb-14 md:px-8 md:pb-20">
        <p className="motion-rise eyebrow" data-inview="true">
          Denver · Front Range
        </p>
        <h1 className="mt-4 max-w-4xl font-heading text-5xl leading-[0.92] tracking-tight md:text-7xl lg:text-8xl">
          {lines.map((line, index) => (
            <span
              key={line}
              className="motion-rise block"
              data-inview="true"
              style={
                {
                  "--motion-delay": `${0.08 + index * 0.08}s`,
                  "--motion-distance": "28px",
                } as CSSProperties
              }
            >
              {line}
            </span>
          ))}
        </h1>
        <svg viewBox="0 0 520 16" className="mt-6 h-4 w-full max-w-md" aria-hidden>
          <path
            className="motion-draw"
            data-inview="true"
            d="M2 10 H180 L210 4 H360 L390 12 H518"
            fill="none"
            stroke="var(--copper)"
            strokeWidth="1.5"
          />
        </svg>
        <p
          className="motion-rise mt-6 max-w-xl text-lg leading-8 text-foreground/85"
          data-inview="true"
          style={{ "--motion-delay": "0.46s", "--motion-distance": "18px" } as CSSProperties}
        >
          Helix Frame & Siding builds the skeleton and the exterior envelope, then
          keeps electricians, plumbers, roofers, and the rest of the bench on one
          schedule.
        </p>
        <div
          className="motion-rise mt-8 flex flex-col gap-3 sm:flex-row"
          data-inview="true"
          style={{ "--motion-delay": "0.58s" } as CSSProperties}
        >
          <Link href="/estimates" className={buttonVariants({ size: "lg" })}>
            Request an estimate
          </Link>
          <Link href="/permits" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Permit services
          </Link>
        </div>
        <ul
          className="motion-rise mt-10 flex max-w-3xl flex-col gap-2 text-[0.68rem] tracking-[0.16em] text-foreground/75 uppercase sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2"
          data-inview="true"
          style={{ "--motion-delay": "0.7s" } as CSSProperties}
        >
          {facts.map((fact, index) => (
            <li key={fact} className="flex items-center gap-3">
              {index > 0 && <span className="hidden text-copper sm:inline">/</span>}
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
