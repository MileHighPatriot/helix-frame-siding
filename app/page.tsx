import Link from "next/link";
import { HomeHero } from "@/components/home-hero";
import { ProjectCard } from "@/components/project-card";
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

export default function HomePage() {
  const featured = projects.slice(0, 3);
  const quote = reviews[0];

  return (
    <>
      <HomeHero />

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="border-r border-border px-5 py-8 last:border-r-0 md:px-8">
              <p className="font-heading text-3xl text-copper md:text-4xl">{stat.display}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
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
          <Reveal key={service.slug} x={index % 2 === 0 ? -36 : 36} y={0}>
            <article className="mx-auto grid max-w-7xl items-center gap-8 border-b border-border px-5 py-12 last:border-b-0 md:grid-cols-2 md:px-8">
              <div className={index % 2 === 1 ? "md:order-2" : undefined}>
                <p className="eyebrow">{service.kicker}</p>
                <h2 className="mt-3 font-heading text-4xl">{service.name}</h2>
                <p className="mt-4 max-w-md text-muted-foreground leading-7">{service.summary}</p>
                <Link href={`/services/${service.slug}`} className="mt-5 inline-block text-sm text-copper">
                  See the sequence
                </Link>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border">
                <Photo src={servicePhotos[service.slug]} alt={service.name} />
              </div>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Previous work</p>
            <h2 className="mt-3 font-heading text-4xl tracking-tight">Recent shells.</h2>
          </div>
          <Link href="/work" className="text-sm text-copper">
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

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.2fr_0.8fr] md:px-8 md:py-24">
        <Reveal>
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
        </Reveal>
        <div className="grid gap-4">
          <Link
            href="/estimates"
            className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-copper/60"
          >
            <p className="eyebrow">Estimates</p>
            <h3 className="mt-3 font-heading text-3xl">Tell us the address and the work.</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              A four-step request. You leave with a reference number the same day.
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
          <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }), "h-11")}>
            Contact the shop
          </Link>
        </div>
      </section>
    </>
  );
}
