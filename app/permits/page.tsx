import type { Metadata } from "next";
import { PermitForm } from "@/components/forms/permit-form";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { jurisdictions, permitSplit } from "@/lib/content";

export const metadata: Metadata = {
  title: "Permits",
  description: "Helix permit services for Denver, Jefferson, Adams, Arapahoe, and Boulder framing and siding projects.",
};

export default function PermitsPage() {
  return (
    <>
      <PageHero
        kicker="Permits"
        title="We assemble the packet. You still sign where the city asks."
        lede="Helix prepares building-permit sets for the frame, the envelope, decks, and additions we build. Mechanical permits stay with the licensed trade. The owner signs what the jurisdiction will not take from a contractor alone."
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-2 md:px-8">
        <Reveal>
        <article className="rounded-xl border border-border p-6">
          <h2 className="font-heading text-3xl">Helix pulls</h2>
          <ul className="mt-4 space-y-3">
            {permitSplit.helix.map((item) => (
              <li key={item} className="border-l border-copper pl-4 text-sm leading-6">
                {item}
              </li>
            ))}
          </ul>
        </article>
        </Reveal>
        <Reveal delay={0.06}>
        <article className="rounded-xl border border-border p-6">
          <h2 className="font-heading text-3xl">You still sign</h2>
          <ul className="mt-4 space-y-3">
            {permitSplit.owner.map((item) => (
              <li key={item} className="border-l border-cedar pl-4 text-sm leading-6">
                {item}
              </li>
            ))}
          </ul>
        </article>
        </Reveal>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-6 md:px-8">
        <h2 className="font-heading text-3xl">Front Range checklist</h2>
        <Accordion className="mt-4">
          {jurisdictions.map((item) => (
            <AccordionItem key={item.name} value={item.name}>
              <AccordionTrigger className="font-heading text-xl">{item.name}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.note}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <section className="mx-auto max-w-3xl px-5 py-14 md:px-8">
        <h2 className="font-heading text-3xl">Request permit service</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          If you are not sure which city owns the address, say so. That is a complete request.
        </p>
        <div className="mt-6 rounded-xl border border-border bg-card p-5 md:p-7">
          <PermitForm />
        </div>
      </section>
    </>
  );
}
