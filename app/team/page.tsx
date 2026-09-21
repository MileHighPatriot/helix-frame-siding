import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { team } from "@/lib/content";

export const metadata: Metadata = {
  title: "Team",
  description: "The Helix principals, framers, envelope lead, coordinator, and estimator.",
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        kicker="Team"
        title="Five people who still answer for the shell."
        lede="Helix is a small crew with named roles. Field framing and siding stay with Marcus and Priya. Lena, Evan, and Sofia keep the number, the calendar, and the trade bench honest."
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-14 md:grid-cols-2 md:px-8">
        {team.map((person, index) => (
          <Reveal key={person.name} delay={index * 0.05} x={index % 2 === 0 ? -24 : 24} y={0}>
            <article className="h-full rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading text-3xl">{person.name}</h2>
                  <p className="mt-1 text-copper">{person.role}</p>
                </div>
                <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Since {person.since}</p>
              </div>
              <p className="mt-4 leading-7 text-muted-foreground">{person.bio}</p>
            </article>
          </Reveal>
        ))}
      </section>
    </>
  );
}
