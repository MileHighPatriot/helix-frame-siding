import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { blueprints, getProject } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blueprints",
  description: "Original plan sheets from Helix framing, siding, deck, and addition work.",
};

export default function BlueprintsPage() {
  return (
    <>
      <PageHero
        kicker="Blueprints"
        title="Sheets we actually build from."
        lede="These are original Helix plates: a floor, a rainscreen section, a deck frame, and a roof tie-in. Open one to pan the sheet, then drag the before-and-after of the job it belongs to."
      />
      <section className="shell grid gap-5 py-14 md:grid-cols-2">
        {blueprints.map((sheet, index) => {
          const project = getProject(sheet.projectSlug);
          return (
            <Reveal key={sheet.slug} delay={index * 0.06}>
              <Link
                href={`/blueprints/${sheet.slug}`}
                className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-copper/50"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow">{sheet.sheet}</p>
                  <p className="text-xs text-muted-foreground">{project?.neighborhood}</p>
                </div>
                <h2 className="mt-4 font-heading text-3xl">{sheet.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{sheet.summary}</p>
                <p className="mt-4 text-sm text-copper">Open the sheet</p>
              </Link>
            </Reveal>
          );
        })}
      </section>
    </>
  );
}
