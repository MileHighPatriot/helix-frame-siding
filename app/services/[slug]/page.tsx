import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { BeforeAfter } from "@/components/before-after";
import { DesignStudio } from "@/components/design-studio";
import { PageHero, SectionHeading } from "@/components/page-hero";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import {
  getService,
  getTradeByName,
  projectsForService,
  serviceComparisons,
  servicePhotos,
  serviceTrades,
  services,
} from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service" };
  return { title: service.name, description: service.summary };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const related = projectsForService(service.slug);
  const comparison = serviceComparisons[service.slug];
  const partners = serviceTrades[service.slug].map((name) => getTradeByName(name)).filter((trade) => trade !== undefined);

  return (
    <>
      <PageHero
        kicker={`Services · ${service.kicker}`}
        title={service.name}
        lede={service.lede}
        image={servicePhotos[service.slug]}
        imageAlt={service.name}
        actions={
          <>
            <a href="#studio" className={buttonVariants({ variant: "ink" })}>
              Design it in 3D
              <ArrowDown className="size-4" aria-hidden />
            </a>
            <Link href="/estimates" className={buttonVariants({ variant: "outline" })}>
              Get an estimate
            </Link>
          </>
        }
      />

      <section id="studio" className="shell scroll-mt-24 py-20 md:py-28">
        <SectionHeading
          kicker="Design studio"
          title={`One ${service.name.toLowerCase()} project. Change any part of it.`}
          lede="Drag to turn the model. Each control changes only the part it names, and the spec underneath updates with it."
        />
        <div className="mt-10">
          <DesignStudio service={service.slug} />
        </div>
      </section>

      <section className="ink py-20 md:py-28">
        <div className="shell">
          <SectionHeading kicker="Before and after" title="Drag across the job." />
          <Reveal className="frame-clip mt-10 overflow-hidden rounded-2xl">
            <BeforeAfter before={comparison.before} after={comparison.after} caption={comparison.caption} alt={service.name} />
          </Reveal>
        </div>
      </section>

      <section className="shell grid gap-14 py-20 md:py-28 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="eyebrow">What is in the scope</p>
          <ul className="mt-8 border-t border-border">
            {service.scope.map((item, index) => (
              <li key={item} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-border py-5">
                <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                <span className="text-lg leading-7">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="eyebrow">Typical sequence</p>
          <ol className="relative mt-8 space-y-8 before:absolute before:top-2 before:bottom-2 before:left-[0.6875rem] before:w-px before:bg-border">
            {service.sequence.map((item, index) => (
              <li key={item} className="relative grid grid-cols-[1.5rem_1fr] gap-5">
                <span className="relative mt-1.5 grid size-[1.375rem] place-items-center rounded-full border border-border bg-background font-mono text-[0.6rem]">
                  {index + 1}
                </span>
                <span className="text-lg leading-7 text-muted-foreground">{item}</span>
              </li>
            ))}
          </ol>
          {partners.length > 0 ? (
            <div className="mt-12 rounded-2xl border border-border bg-card p-6">
              <p className="label-mono">Partners Helix schedules</p>
              <ul className="mt-4 grid gap-2">
                {partners.map((trade) => (
                  <li key={trade.slug}>
                    <Link href={`/trades/${trade.slug}`} className="group flex items-baseline justify-between gap-4 py-1">
                      <span className="font-heading text-xl transition-colors group-hover:text-copper">{trade.name}</span>
                      <span className="label-mono">{trade.craft}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Reveal>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-border">
          <div className="shell py-20 md:py-28">
            <SectionHeading kicker="Related work" title={`${service.name} we have built.`}>
              <Link href="/work" className={buttonVariants({ variant: "outline" })}>
                All projects
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </SectionHeading>
            <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              {related.slice(0, 3).map((project, index) => (
                <Reveal key={project.slug} delay={index * 0.05}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
