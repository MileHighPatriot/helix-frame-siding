import Link from "next/link";
import { Photo } from "@/components/photo";
import { projectPhotos, serviceName, type Project } from "@/lib/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-copper/50"
    >
      <div className="frame-clip relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]">
          <Photo src={projectPhotos[project.slug]} alt="" sizes="(min-width: 768px) 360px, 100vw" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs tracking-[0.16em] text-cedar uppercase">
          {project.neighborhood} · {project.year}
        </p>
        <h3 className="mt-2 font-heading text-2xl leading-tight">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{project.summary}</p>
        <p className="mt-4 text-xs text-muted-foreground">
          {project.services.map(serviceName).join(" · ")}
        </p>
      </div>
    </Link>
  );
}
