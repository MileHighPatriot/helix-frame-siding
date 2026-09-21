import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BeforeAfter } from "@/components/before-after";
import { DesignStudio } from "@/components/design-studio";
import { Photo } from "@/components/photo";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { getService, projectsForService, serviceComparisons, servicePhotos, services } from "@/lib/content";
import { cn } from "cn";

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

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 md:grid-cols-2 md:px-8">
          <Reveal immediate>
            <p className="eyebrow">{service.kicker}</p>
            <h1 className="mt-3 font-heading text-5xl tracking-tight">{service.name}</h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">{service.lede}</p>
            <Link href="/estimates" className={cn(buttonVariants(), "mt-6 h-11 px-5")}>
              Estimate this scope
            </Link>
          </Reveal>
          <Reveal
            clip
            delay={0.08}
            className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border"
          >
            <Photo src={servicePhotos[service.slug]} alt={service.name} priority />
          </Reveal>
        </div>
      </section>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <Reveal>
            <h2 className="font-heading text-3xl">Before and after</h2>
            <div className="frame-clip mt-6 overflow-hidden rounded-xl">
              <BeforeAfter
                before={serviceComparisons[service.slug].before}
                after={serviceComparisons[service.slug].after}
                caption={serviceComparisons[service.slug].caption}
                alt={service.name}
              />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <Reveal>
            <p className="eyebrow">Design options</p>
            <h2 className="mt-3 max-w-2xl font-heading text-4xl tracking-tight">
              Materials, colors, and the way the piece is built.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground leading-7">
              The project stays in the frame. Change the material, the design, or a color, and only that part of the photograph moves.
            </p>
          </Reveal>
          <div className="mt-8">
            <DesignStudio service={service.slug} />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 md:px-8">
        <Reveal>
          <h2 className="font-heading text-3xl">What is in the scope</h2>
          <ul className="mt-5 space-y-3">
            {service.scope.map((item) => (
              <li key={item} className="border-l border-copper pl-4 text-sm leading-6">
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="font-heading text-3xl">Typical sequence</h2>
          <ol className="mt-5 space-y-4">
            {service.sequence.map((item, index) => (
              <li key={item} className="grid grid-cols-[auto_1fr] gap-4">
                <span className="font-heading text-copper">0{index + 1}</span>
                <span className="text-sm leading-6 text-muted-foreground">{item}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>
      {related.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
            <h2 className="font-heading text-3xl">Related work</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {related.slice(0, 3).map((project, index) => (
                <Reveal key={project.slug} delay={index * 0.04}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
