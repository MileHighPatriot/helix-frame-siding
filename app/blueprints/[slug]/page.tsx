import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlueprintViewer } from "@/components/blueprint-viewer";
import { blueprints, getBlueprint, getProject } from "@/lib/content";

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
      <div className="mt-8">
        <BlueprintViewer kind={sheet.kind} title={`${sheet.sheet} ${sheet.title}`} notes={sheet.notes} />
      </div>
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
