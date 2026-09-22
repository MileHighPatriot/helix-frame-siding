import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Photo } from "@/components/photo";
import { projectPhotos, serviceName, type Project } from "@/lib/content";
import { cn } from "cn";

export function ProjectCard({ project, size = "default" }: { project: Project; size?: "default" | "large" | "compact" }) {
  const compact = size === "compact";
  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn("group flex h-full", compact ? "grid grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] items-start gap-5" : "flex-col")}
    >
      <div
        className={cn(
          "frame-clip relative overflow-hidden rounded-2xl bg-muted",
          size === "large" ? "aspect-[4/3] lg:aspect-[16/11]" : compact ? "aspect-[4/3] rounded-xl" : "aspect-[4/3]",
        )}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
          <Photo
            src={projectPhotos[project.slug]}
            alt=""
            sizes={size === "large" ? "(min-width: 1024px) 60vw, 100vw" : compact ? "(min-width: 1024px) 20vw, 50vw" : "(min-width: 768px) 33vw, 100vw"}
          />
        </div>
        {!compact ? (
          <span className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/90 text-neutral-900 opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <ArrowUpRight className="size-4" aria-hidden />
          </span>
        ) : null}
      </div>
      <div className={cn("flex flex-1 flex-col", compact ? "pt-1" : "pt-5")}>
        <p className="label-mono">
          {project.neighborhood} · {project.year}
        </p>
        <h3
          className={cn(
            "mt-2 leading-tight tracking-tight transition-colors group-hover:text-copper",
            size === "large" ? "display-sm" : compact ? "text-xl" : "text-2xl",
          )}
        >
          {project.title}
        </h3>
        <p className={cn("mt-2 text-sm leading-6 text-muted-foreground", compact ? "line-clamp-3" : "line-clamp-2")}>{project.summary}</p>
        {!compact ? (
          <p className="mt-4 flex flex-wrap gap-1.5">
            {project.services.map((service) => (
              <span key={service} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                {serviceName(service)}
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
