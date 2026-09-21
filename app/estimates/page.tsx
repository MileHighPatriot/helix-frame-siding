import type { Metadata } from "next";
import { EstimateForm } from "@/components/forms/estimate-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Estimates",
  description: "Build a framing, siding, deck, remodel, or addition scope with Helix Frame & Siding.",
};

export default function EstimatesPage() {
  return (
    <>
      <PageHero
        kicker="Estimates"
        title="A scope you can read before anyone drives to the house."
        lede="Pick the work, the material, and the size. The sheet that comes back names what Helix self-performs, which partners are carried, and an allowance range. Sofia still walks the site before that range becomes a bid."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[0.7fr_1.3fr] md:px-8">
        <div className="space-y-4 text-sm leading-6 text-muted-foreground">
          <p>Allowances move with the square footage you enter. They are not a contract price.</p>
          <p>You will get a reference number on this page as soon as the request is valid.</p>
          <ol className="space-y-2 border-l border-border pl-4">
            <li>Services</li>
            <li>Design</li>
            <li>Size and site conditions</li>
            <li>Address, timeline, budget</li>
            <li>Contact</li>
            <li>Review and send</li>
          </ol>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 md:p-7">
          <EstimateForm />
        </div>
      </section>
    </>
  );
}
