import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BeforeAfter } from "@/components/before-after";
import { BlueprintViewer } from "@/components/blueprint-viewer";
import { Reveal } from "@/components/reveal";
import { blueprintComparisons, blueprints, getBlueprint, getProject } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blueprints.map((sheet) => ({ slug: sheet.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sheet = getBlueprint(slug);
  if (!sheet) return { title: "Blueprint" };
  return { title: sheet.title, description: sheet.summary };
}

export default async function BlueprintPage({ params }: Props) {
  const { slug } = await params;
  const sheet = getBlueprint(slug);
  if (!sheet) notFound();
  const project = getProject(sheet.projectSlug);

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <Reveal immediate>
        <p className="eyebrow">Sheet {sheet.sheet}</p>
        <h1 className="mt-3 font-heading text-4xl tracking-tight md:text-5xl">{sheet.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{sheet.summary}</p>
        {project && (
          <p className="mt-3 text-sm">
            Built on{" "}
            <Link href={`/work/${project.slug}`} className="text-copper">
              {project.title}
            </Link>
          </p>
        )}
      </Reveal>
      <div className="mt-8">
        <BlueprintViewer kind={sheet.kind} title={`${sheet.sheet} ${sheet.title}`} notes={sheet.notes} />
      </div>
      {blueprintComparisons[sheet.slug] && (
        <Reveal className="mt-10">
          <h2 className="font-heading text-3xl">Before and after</h2>
          <div className="frame-clip mt-5 overflow-hidden rounded-xl">
            <BeforeAfter
              before={blueprintComparisons[sheet.slug].before}
              after={blueprintComparisons[sheet.slug].after}
              caption={blueprintComparisons[sheet.slug].caption}
              alt={sheet.title}
            />
          </div>
        </Reveal>
      )}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <Link href="/blueprints" className="text-copper">
          All sheets
        </Link>
        <Link href="/permits" className="text-copper">
          Request permit service
        </Link>
      </div>
    </section>
  );
}
