import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, Box } from "lucide-react";
import { Photo } from "@/components/photo";
import { buttonVariants } from "@/components/ui/button";
import { company, heroPhoto } from "@/lib/content";
import { cn } from "cn";

const facts = [
  { label: "Framing since", value: String(company.founded) },
  { label: "Self-performed", value: "Frame and skin" },
  { label: "Shop", value: "Decatur Street, Denver" },
];

function rise(delay: number, distance = 24) {
  return { "--motion-delay": `${delay}s`, "--motion-distance": `${distance}px` } as CSSProperties;
}

export function HomeHero() {
  return (
    <section className="ink relative -mt-[4.5rem] flex min-h-[100svh] flex-col overflow-hidden">
      <div className="absolute inset-0">
        <div className="ken-burns absolute inset-0">
          <Photo src={heroPhoto} alt="A Denver bungalow with a new fiber-cement addition and a tied-in roof" priority sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1012] via-[#0e1012]/35 to-[#0e1012]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1012]/80 via-[#0e1012]/25 to-transparent" />
      </div>

      <div className="shell relative flex flex-1 flex-col justify-end pt-32 pb-8 md:pb-10">
        <p className="motion-rise eyebrow flex items-center gap-3 text-white/80" data-inview="true" style={rise(0.05, 12)}>
          <span className="size-1.5 rounded-full bg-copper" aria-hidden />
          Denver · Front Range
        </p>
        <h1 className="display-xl mt-6 max-w-6xl text-white">
          <span className="motion-rise block" data-inview="true" style={rise(0.12)}>
            Frame the structure.
          </span>
          <span className="motion-rise block" data-inview="true" style={rise(0.22)}>
            Finish the <em className="font-heading text-[#f1b48c] italic">skin.</em>
          </span>
        </h1>

        <div className="motion-rise mt-10 grid gap-8 lg:grid-cols-[minmax(0,36rem)_auto] lg:items-end lg:justify-between" data-inview="true" style={rise(0.4, 16)}>
          <p className="text-lg leading-8 text-pretty text-white/80">
            Helix builds the skeleton and the exterior envelope of Denver homes, then keeps the electrician, the plumber, and the roofer on one schedule. One crew answers for the whole shell.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/estimates" className={buttonVariants({ size: "lg" })}>
              Get an estimate
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
            <Link href="/studio" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white/35 text-white hover:border-white/70 hover:bg-white/10")}>
              <Box className="size-4" aria-hidden />
              Design it in 3D
            </Link>
          </div>
        </div>

        <dl className="motion-rise mt-14 grid grid-cols-2 gap-6 border-t border-white/15 pt-6 sm:grid-cols-3" data-inview="true" style={rise(0.55, 10)}>
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-mono text-[0.66rem] tracking-[0.14em] text-white/55 uppercase">{fact.label}</dt>
              <dd className="mt-1.5 text-sm text-white/90 sm:text-base">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
