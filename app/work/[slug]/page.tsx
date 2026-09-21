import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { StructurePlate } from "@/components/structure-plate";
import { getProject, projects, serviceName } from "@/lib/content";

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
          <Reveal>
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
          <div className="overflow-hidden rounded-xl border border-border">
            <StructurePlate kind={project.plate} title={project.title} />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:grid-cols-3 md:px-8">
        {project.figures.map((figure) => (
          <div key={figure.label} className="rounded-xl border border-border p-5">
            <p className="font-heading text-3xl text-copper">{figure.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{figure.label}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 md:grid-cols-2 md:px-8">
        <div>
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
        </div>
        <div>
          <h2 className="font-heading text-3xl">Trades on the job</h2>
          <ul className="mt-4 space-y-2">
            {project.trades.map((trade) => (
              <li key={trade} className="rounded-lg border border-border px-4 py-3 text-sm">
                {trade}
              </li>
            ))}
          </ul>
          <h2 className="mt-10 font-heading text-3xl">Outcome</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{project.outcome}</p>
          <Link href="/work" className="mt-6 inline-block text-sm text-copper">
            Back to all work
          </Link>
        </div>
      </section>
    </>
  );
}
