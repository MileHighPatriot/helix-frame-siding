"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projects, services, type ServiceSlug } from "@/lib/content";

const filters = [{ slug: "all", name: "All" }, ...services.map((service) => ({ slug: service.slug, name: service.name }))];

export function WorkGallery() {
  const [filter, setFilter] = useState<string>("all");
  const visible = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((project) => project.services.includes(filter as ServiceSlug)),
    [filter]
  );

  return (
    <div>
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
          {filters.map((item) => (
            <TabsTrigger key={item.slug} value={item.slug} className="h-9 flex-none border border-border px-3">
              {item.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {visible.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
          <p className="font-heading text-2xl">Nothing in this filter yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose another service, or view the full gallery.
          </p>
          <button
            type="button"
            className="mt-4 text-sm text-copper"
            onClick={() => setFilter("all")}
          >
            Show all work
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
