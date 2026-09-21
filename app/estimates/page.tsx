import type { Metadata } from "next";
import { EstimateForm } from "@/components/forms/estimate-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Estimates",
  description: "Request a framing, siding, deck, remodel, or addition estimate from Helix Frame & Siding.",
};

export default function EstimatesPage() {
  return (
    <>
      <PageHero
        kicker="Estimates"
        title="A number starts with a walk, not a guess."
        lede="Tell us the project type, the address, a timeline, and a budget range. Sofia turns that into a scope for the work Helix self-performs and the trades we will carry."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <div className="space-y-4 text-sm leading-6 text-muted-foreground">
          <p>Estimates cover framing and siding in detail. Partner trades are listed as allowances until their own walk.</p>
          <p>You will get a reference number on this page. Email delivery is optional and only runs when a webhook is configured for the shop.</p>
          <ol className="space-y-2 border-l border-border pl-4">
            <li>Project type</li>
            <li>Address, timeline, budget</li>
            <li>Scope notes</li>
            <li>How to reach you</li>
          </ol>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 md:p-7">
          <EstimateForm />
        </div>
      </section>
    </>
  );
}
