import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Photo } from "@/components/photo";
import { Reveal } from "@/components/reveal";
import { team } from "@/lib/content";

export const metadata: Metadata = {
  title: "Team",
  description: "The Helix crew: framing, siding, stairs, the shop, estimating, and permits.",
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        kicker="Team"
        title="Eleven people who still answer for the shell."
        lede="Field framing sits with Marcus, Cole, and Maya. Priya and Naomi own the envelope. Luis cuts the stairs. Ruthie runs the lumber. Lena, Evan, Sofia, and Daniel keep the walk, the calendar, the number, and the permit counter."
      />
      <section className="shell grid gap-x-6 gap-y-14 py-16 sm:grid-cols-2 md:py-24 xl:grid-cols-3">
        {team.map((person, index) => (
          <Reveal key={person.name} delay={index * 0.04}>
            <article className="group h-full">
              <div className="frame-clip relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                <Photo src={person.image} alt={person.name} sizes="(min-width: 1280px) 360px, (min-width: 640px) 50vw, 100vw" />
              </div>
              <div className="pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-2xl">{person.name}</h2>
                    <p className="mt-1 text-sm text-copper">{person.role}</p>
                  </div>
                  <p className="label-mono whitespace-nowrap">Since {person.since}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{person.bio}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </>
  );
}
