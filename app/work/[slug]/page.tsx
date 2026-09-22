import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Photo } from "@/components/photo";
import { Reveal } from "@/components/reveal";
import { getProject, getTradeByName, projectPhotos, projects, serviceName } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project" };
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <PageHero
        kicker={`${project.neighborhood}, ${project.city} · ${project.year}`}
        title={project.title}
        lede={project.summary}
        image={projectPhotos[project.slug]}
        imageAlt={project.title}
        actions={project.services.map((service) => (
          <Link
            key={service}
            href={`/services/${service}`}
            className="rounded-full border border-border px-3.5 py-1.5 text-sm transition-colors hover:border-foreground/40"
          >
            {serviceName(service)}
          </Link>
        ))}
      />

      <section className="shell">
        <dl className="grid grid-cols-1 border-b border-border sm:grid-cols-3">
          {project.figures.map((figure, figureIndex) => (
            <Reveal key={figure.label} delay={figureIndex * 0.05} className="border-border py-8 sm:border-l sm:pl-8 sm:first:border-l-0 sm:first:pl-0">
              <dt className="label-mono">{figure.label}</dt>
              <dd className="display-md mt-3">{figure.value}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <section className="shell grid gap-14 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="eyebrow">The constraint</p>
            <p className="display-sm mt-5 text-balance">{project.challenge}</p>
          </Reveal>
          <Reveal delay={0.06} className="mt-14">
            <p className="eyebrow">Outcome</p>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">{project.outcome}</p>
          </Reveal>
        </div>
        <div>
          <Reveal>
            <p className="eyebrow">Scope</p>
            <ol className="mt-6 border-t border-border">
              {project.scope.map((item, itemIndex) => (
                <li key={item} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-border py-5">
                  <span className="font-mono text-xs text-muted-foreground">0{itemIndex + 1}</span>
                  <span className="text-lg leading-7">{item}</span>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={0.06} className="mt-14">
            <p className="eyebrow">Trades on the job</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {project.trades.map((trade) => {
                const partner = getTradeByName(trade);
                const body = (
                  <>
                    <span className="label-mono">{partner?.craft ?? "Partner"}</span>
                    <span className="mt-2 block font-heading text-xl">{trade}</span>
                  </>
                );
                return (
                  <li key={trade}>
                    {partner ? (
                      <Link href={`/trades/${partner.slug}`} className="block h-full rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30">
                        {body}
                      </Link>
                    ) : (
                      <div className="h-full rounded-2xl border border-border bg-card p-5">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border">
        <Link href={`/work/${next.slug}`} className="group shell grid items-center gap-8 py-16 md:grid-cols-[minmax(0,1fr)_20rem] md:py-20">
          <div>
            <p className="label-mono">Next project</p>
            <p className="display-md mt-4 transition-colors group-hover:text-copper">
              {next.title}
              <ArrowUpRight className="ml-3 inline size-8 align-baseline transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Photo src={projectPhotos[next.slug]} alt="" sizes="20rem" />
          </div>
        </Link>
      </section>
    </>
  );
}
