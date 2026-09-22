import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { StudioHub } from "@/components/studio-hub";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Design studio",
  description:
    "Configure siding, decks, outdoor structures, remodels, additions, and framing in live 3D, then send the design to Helix as an estimate.",
};

const steps = [
  {
    title: "Pick the work",
    copy: "Six models, one per service. Each one is a single project that stays in the frame while you change it.",
  },
  {
    title: "Change one part at a time",
    copy: "A color control repaints only the part it names. A profile, railing, or roof control rebuilds only that piece.",
  },
  {
    title: "Send it as a scope",
    copy: "Price this design carries the exact selection into the estimate, with the written spec Sofia will read.",
  },
];

export default function StudioPage() {
  return (
    <>
      <PageHero
        kicker="Design studio"
        title="Build it here before we build it there."
        lede="Turn the model, change the siding, the gable, the deck boards, the railing, the beam, or the lumber, and read the spec that goes with it. Every choice carries into the estimate."
      />
      <section className="shell py-10 md:py-14">
        <StudioHub services={services} />
      </section>
      <section className="shell pb-24 md:pb-32">
        <ol className="grid gap-8 border-t border-border pt-12 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.05}>
              <li>
                <span className="font-mono text-xs text-copper">0{index + 1}</span>
                <h2 className="mt-4 text-2xl tracking-tight">{step.title}</h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{step.copy}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>
    </>
  );
}
