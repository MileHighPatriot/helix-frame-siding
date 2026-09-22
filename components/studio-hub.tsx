"use client";

import { Suspense, useState } from "react";
import { DesignParam, DesignStudio } from "@/components/design-studio";
import type { Service } from "@/lib/content";
import type { ServiceSlug } from "@/lib/content-types";
import { defaultDesignId, parseSelection } from "@/lib/scenes";
import { cn } from "cn";

export function StudioHub({ services }: { services: Service[] }) {
  const [service, setService] = useState<ServiceSlug>("siding");
  const [designs, setDesigns] = useState<Partial<Record<ServiceSlug, string>>>({});

  return (
    <div className="grid gap-6">
      <Suspense fallback={null}>
        <DesignParam
          onFound={(id) => {
            const parsed = parseSelection(id);
            if (!parsed) return;
            setService(parsed.service);
            setDesigns((current) => ({ ...current, [parsed.service]: id }));
          }}
        />
      </Suspense>
      <div role="tablist" aria-label="Service" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {services.map((item, index) => {
          const on = item.slug === service;
          return (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setService(item.slug)}
              className={cn(
                "flex shrink-0 items-baseline gap-2.5 rounded-full border px-4 py-2.5 text-sm transition-colors",
                on ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/40",
              )}
            >
              <span className={cn("font-mono text-[0.65rem]", on ? "text-background/60" : "text-muted-foreground")}>0{index + 1}</span>
              {item.name}
            </button>
          );
        })}
      </div>
      <DesignStudio
        key={service}
        service={service}
        value={designs[service] ?? defaultDesignId(service)}
        onChange={(id) => setDesigns((current) => ({ ...current, [service]: id }))}
      />
    </div>
  );
}
