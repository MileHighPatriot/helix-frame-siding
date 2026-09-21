import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[0.9fr_1.1fr] md:px-8">
          <Reveal immediate>
            <p className="eyebrow">
              {project.neighborhood}, {project.city} · {project.year}
            </p>
            <h1 className="mt-3 font-heading text-4xl tracking-tight md:text-5xl">{project.title}</h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">{project.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.services.map((service) => (
                <Link
                  key={service}
                  href={`/services/${service}`}
                  className="rounded-full border border-border px-3 py-1 text-xs tracking-wide uppercase"
                >
                  {serviceName(service)}
                </Link>
              ))}
            </div>
          </Reveal>
          <Reveal clip className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border">
            <Photo src={projectPhotos[project.slug]} alt={project.title} priority />
          </Reveal>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:grid-cols-3 md:px-8">
        {project.figures.map((figure, index) => (
          <Reveal key={figure.label} delay={index * 0.04}>
            <div className="rounded-xl border border-border p-5">
              <p className="font-heading text-3xl text-copper">{figure.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{figure.label}</p>
            </div>
          </Reveal>
        ))}
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 md:grid-cols-2 md:px-8">
        <Reveal>
          <h2 className="font-heading text-3xl">The constraint</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{project.challenge}</p>
          <h2 className="mt-10 font-heading text-3xl">Scope</h2>
          <ul className="mt-4 space-y-3">
            {project.scope.map((item) => (
              <li key={item} className="border-l border-cedar pl-4 text-sm leading-6">
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-heading text-3xl">Trades on the job</h2>
          <ul className="mt-4 space-y-2">
            {project.trades.map((trade) => {
              const partner = getTradeByName(trade);
              return (
                <li key={trade} className="rounded-lg border border-border px-4 py-3 text-sm">
                  {partner ? (
                    <Link href={`/trades/${partner.slug}`} className="text-copper">
                      {trade}
                    </Link>
                  ) : (
                    trade
                  )}
                </li>
              );
            })}
          </ul>
          <h2 className="mt-10 font-heading text-3xl">Outcome</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{project.outcome}</p>
          <Link href="/work" className="mt-6 inline-block text-sm text-copper">
            Back to all work
          </Link>
        </Reveal>
      </section>
    </>
  );
}
