import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { trades } from "@/lib/content";
import { cn } from "cn";

export const metadata: Metadata = {
  title: "Trade network",
  description: "The electricians, plumbers, roofers, and other trades Helix schedules on framing and siding jobs.",
};

export default function TradesPage() {
  return (
    <>
      <PageHero
        kicker="Trade network"
        title="We contract the trades. You still call Helix."
        lede="Helix does not hand you a list and leave. Electrical, plumbing, roofing, concrete, HVAC, insulation, windows, and drywall are companies we already schedule. They work Denver and south of Denver. They own their license and their work. We own the sequence."
      />
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {trades.map((trade, index) => (
            <Reveal key={trade.slug} delay={index * 0.04}>
              <Link
                href={`/trades/${trade.slug}`}
                className="block h-full rounded-xl border border-border bg-card p-5 transition-colors hover:border-copper/50"
              >
                <p className="eyebrow">{trade.craft}</p>
                <h2 className="mt-3 font-heading text-2xl">{trade.name}</h2>
                <p className="mt-2 text-sm text-copper">{trade.area}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{trade.owns}</p>
                <p className="mt-4 text-sm text-copper">Open the company</p>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 rounded-xl border border-border p-6 md:flex md:items-center md:justify-between">
          <div>
            <h2 className="font-heading text-3xl">One schedule, one point of contact.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              If a partner has to be on site the morning of inspection, Evan puts them there. The estimate names which trades Helix will carry.
            </p>
          </div>
          <Link href="/estimates" className={cn(buttonVariants(), "mt-5 h-11 px-5 md:mt-0")}>
            Start an estimate
          </Link>
        </div>
      </section>
    </>
  );
}
