import Link from "next/link";
import { CountStat } from "@/components/count-stat";
import { HomeHero } from "@/components/home-hero";
import { ProjectCard } from "@/components/project-card";
import { ProjectWalk } from "@/components/project-walk";
import { Reveal } from "@/components/reveal";
import { Photo } from "@/components/photo";
import { buttonVariants } from "@/components/ui/button";
import {
  processSteps,
  projects,
  reviews,
  servicePhotos,
  services,
  stats,
  trades,
} from "@/lib/content";
import { cn } from "cn";

const walkFrames = [
  {
    src: "/media/ba-addition-after.png",
    alt: "The finished Sloan's Lake addition from the side yard",
    label: "Side yard",
    caption: "The new volume, flashed into the old wall, from the side yard.",
  },
  {
    src: "/media/ba-sloans-floor-after.png",
    alt: "The opened floor plate at the Sloan's Lake addition",
    label: "Floor plate",
    caption: "The opening where the new floor lands on the beam.",
  },
  {
    src: "/media/ba-sloans-roof-after.png",
    alt: "The roof tie-in on the Sloan's Lake bungalow",
    label: "Roof tie-in",
    caption: "The ridge married back into the 1924 bungalow.",
  },
];

export default function HomePage() {
  const featured = projects.slice(0, 3);
  const quote = reviews[0];

  return (
    <>
      <HomeHero />

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {stats.map((stat) => (
            <CountStat key={stat.label} value={stat.value} display={stat.display} label={stat.label} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <p className="eyebrow">How a job moves</p>
          <h2 className="mt-3 max-w-xl font-heading text-4xl tracking-tight">
            Seven marks from the first walk to the punch.
          </h2>
        </Reveal>
        <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {processSteps.map((step, index) => (
            <Reveal key={step.n} delay={index * 0.05}>
              <li className="h-full rounded-xl border border-border bg-card p-5">
                <p className="font-heading text-copper">{step.n}</p>
                <h3 className="mt-3 font-heading text-2xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.copy}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="border-y border-border">
        {services.map((service, index) => (
          <article
            key={service.slug}
            className="mx-auto grid max-w-7xl items-center gap-8 border-b border-border px-5 py-12 last:border-b-0 md:grid-cols-2 md:px-8"
          >
            <Reveal className={index % 2 === 1 ? "md:order-2" : undefined}>
              <p className="eyebrow">{service.kicker}</p>
              <h2 className="mt-3 font-heading text-4xl">{service.name}</h2>
              <p className="mt-4 max-w-md text-muted-foreground leading-7">{service.summary}</p>
              <Link
                href={`/services/${service.slug}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-6")}
              >
                See the sequence
              </Link>
            </Reveal>
            <Reveal
              clip
              delay={0.08}
              className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border"
            >
              <Photo src={servicePhotos[service.slug]} alt={service.name} />
            </Reveal>
          </article>
        ))}
      </section>

      <ProjectWalk
        frames={walkFrames}
        title="Sloan's Lake, from the yard to the ridge."
        href="/work/sloans-lake-addition"
      />

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <p className="eyebrow">Previous work</p>
            <h2 className="mt-3 font-heading text-4xl tracking-tight">Recent shells.</h2>
          </Reveal>
          <Link href="/work" className={buttonVariants({ variant: "outline", size: "sm" })}>
            All projects
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featured.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="overflow-hidden border-y border-border py-6">
        <p className="px-5 text-center eyebrow md:px-8">Trade bench</p>
        <div className="mt-4 flex overflow-hidden">
          <div className="marquee-track flex min-w-max gap-10 pr-10">
            {[...trades, ...trades].map((trade, index) => (
              <span key={`${trade.name}-${index}`} className="font-heading text-2xl whitespace-nowrap text-foreground/80">
                {trade.craft}
                <span className="mx-3 text-copper">/</span>
                {trade.name}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-4 text-center text-sm">
          <Link href="/trades" className="text-copper">
            How the bench is scheduled
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="eyebrow">{quote.neighborhood}</p>
              <blockquote className="mt-4 font-heading text-3xl leading-snug md:text-4xl">
                “{quote.quote}”
              </blockquote>
              <p className="mt-6 text-sm text-muted-foreground">
                {quote.name} · {quote.project}
              </p>
              <Link href="/reviews" className="mt-4 inline-block text-sm text-copper">
                More reviews
              </Link>
            </div>
            <div className="grid gap-4">
              <Link
                href="/estimates"
                className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-copper/60"
              >
                <p className="eyebrow">Estimates</p>
                <h3 className="mt-3 font-heading text-3xl">Tell us the address and the work.</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  A six-step scope. You leave with a reference number the same day.
                </p>
              </Link>
              <Link
                href="/permits"
                className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-copper/60"
              >
                <p className="eyebrow">Permits</p>
                <h3 className="mt-3 font-heading text-3xl">Ask Helix to pull the packet.</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Denver, Jefferson, Adams, Arapahoe, and Boulder, with a clear split of who signs.
                </p>
              </Link>
              <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
                Contact the shop
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
