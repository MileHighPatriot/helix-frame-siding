import type { Metadata } from "next";
import Link from "next/link";
import { Box, Phone } from "lucide-react";
import { EstimateForm } from "@/components/forms/estimate-form";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Estimates",
  description: "Build a framing, siding, deck, remodel, or addition scope with Helix Frame & Siding.",
};

const steps = ["Services", "Design", "Size and site", "Address, timeline, budget", "Contact", "Review and send"];

export default function EstimatesPage() {
  return (
    <>
      <PageHero
        kicker="Estimates"
        title="A scope you can read before anyone drives to the house."
        lede="Pick the work, design it, and give us the size. The sheet that comes back names what Helix self-performs, which partners are carried, and an allowance range. Sofia still walks the site before that range becomes a bid."
      />
      <section className="shell grid gap-10 py-12 md:py-16 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14">
        <Reveal immediate className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          <ol className="space-y-3">
            {steps.map((step, index) => (
              <li key={step} className="flex items-baseline gap-3 text-sm">
                <span className="font-mono text-xs text-copper">0{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="space-y-3 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">
            <p>Allowances move with the size you enter. They are not a contract price.</p>
            <p>You get a reference number on this page as soon as the request is valid.</p>
          </div>
          <div className="grid gap-2 border-t border-border pt-6 text-sm">
            <Link href="/studio" className="inline-flex items-center gap-2 font-medium transition-colors hover:text-copper">
              <Box className="size-4" aria-hidden />
              Design first in the studio
            </Link>
            <a href={company.phoneHref} className="inline-flex items-center gap-2 font-medium transition-colors hover:text-copper">
              <Phone className="size-4" aria-hidden />
              {company.phone}
            </a>
          </div>
        </Reveal>
        <div className="min-w-0 rounded-3xl border border-border bg-card p-5 shadow-[0_24px_60px_-44px_rgba(20,20,20,0.4)] sm:p-8 md:p-10">
          <EstimateForm />
        </div>
      </section>
    </>
  );
}
