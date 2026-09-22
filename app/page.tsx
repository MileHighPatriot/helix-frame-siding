import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CountStat } from "@/components/count-stat";
import { HomeHero } from "@/components/home-hero";
import { SectionHeading } from "@/components/page-hero";
import { ProjectCard } from "@/components/project-card";
import { ProjectWalk } from "@/components/project-walk";
import { Reveal } from "@/components/reveal";
import { ServiceIndex } from "@/components/service-index";
import { StudioTeaser } from "@/components/studio-teaser";
import { buttonVariants } from "@/components/ui/button";
import { processSteps, projects, reviews, servicePhotos, services, stats, trades } from "@/lib/content";

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
  const [lead, ...rest] = projects.slice(0, 3);
  const [quote, ...more] = reviews;

  return (
    <>
      <HomeHero />

      <section className="shell">
        <div className="grid grid-cols-2 gap-x-6 border-b border-border md:grid-cols-4">
          {stats.map((stat) => (
            <CountStat key={stat.label} value={stat.value} display={stat.display} label={stat.label} />
          ))}
        </div>
      </section>

      <section className="shell py-24 md:py-32">
        <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <p className="eyebrow">What Helix does</p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="display-md text-balance">
              We frame the structure and close the envelope, the two layers every other trade has to trust.{" "}
              <span className="text-muted-foreground">Then we put the rest of the bench on one calendar.</span>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="shell pb-24 md:pb-32">
        <SectionHeading kicker="Services" title="Six kinds of work, one crew in charge.">
          <Link href="/services" className={buttonVariants({ variant: "outline" })}>
            All services
          </Link>
        </SectionHeading>
        <div className="mt-12">
          <ServiceIndex services={services} photos={servicePhotos} />
        </div>
      </section>

      <section id="studio" className="ink py-24 md:py-32">
        <div className="shell">
          <StudioTeaser />
        </div>
      </section>

      <section className="shell py-24 md:py-32">
        <SectionHeading kicker="How a job moves" title="Seven marks from the first walk to the punch." />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {processSteps.map((step, index) => (
            <Reveal key={step.n} delay={index * 0.04} className="bg-background">
              <li className="flex h-full flex-col p-6">
                <span className="font-mono text-xs text-copper">{step.n}</span>
                <h3 className="mt-10 text-2xl tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.copy}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <ProjectWalk frames={walkFrames} title="Sloan's Lake, from the yard to the ridge." href="/work/sloans-lake-addition" />

      <section className="shell py-24 md:py-32">
        <SectionHeading kicker="Recent work" title="Shells we have stood and closed.">
          <Link href="/work" className={buttonVariants({ variant: "outline" })}>
            All projects
          </Link>
        </SectionHeading>
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-8">
          <Reveal>
            <ProjectCard project={lead} size="large" />
          </Reveal>
          <div className="grid content-start gap-8 border-border lg:border-l lg:pl-8">
            {[...rest, ...projects.slice(3, 4)].map((project, index) => (
              <Reveal key={project.slug} delay={0.06 + index * 0.06} className="border-b border-border pb-8 last:border-b-0 last:pb-0">
                <ProjectCard project={project} size="compact" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="shell grid gap-12 py-24 md:py-32 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <p className="eyebrow">{quote.neighborhood} · {quote.project}</p>
            <blockquote className="display-md mt-6 text-balance">“{quote.quote}”</blockquote>
            <p className="mt-8 text-sm">
              <span className="font-medium">{quote.name}</span>
            </p>
          </Reveal>
          <div className="grid content-start gap-8">
            {more.slice(0, 2).map((review, index) => (
              <Reveal key={review.name} delay={0.06 + index * 0.06} className="border-t border-border pt-6">
                <p className="text-lg leading-8">“{review.quote}”</p>
                <p className="label-mono mt-4">
                  {review.name} · {review.neighborhood}
                </p>
              </Reveal>
            ))}
            <Link href="/reviews" className="inline-flex items-center gap-2 text-sm font-medium text-copper">
              Read every review
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="overflow-hidden py-14">
        <div className="shell mb-8 flex items-center justify-between gap-4">
          <p className="eyebrow">The trade bench</p>
          <Link href="/trades" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How the bench is scheduled
          </Link>
        </div>
        <div className="flex overflow-hidden">
          <div className="marquee-track flex min-w-max gap-12 pr-12">
            {[...trades, ...trades].map((trade, index) => (
              <span key={`${trade.name}-${index}`} className="flex items-baseline gap-4 whitespace-nowrap">
                <span className="font-heading text-4xl tracking-tight md:text-5xl">{trade.name}</span>
                <span className="label-mono">{trade.craft}</span>
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
