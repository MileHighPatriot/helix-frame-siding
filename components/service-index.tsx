"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Photo } from "@/components/photo";
import type { Service } from "@/lib/content";
import { cn } from "cn";

export function ServiceIndex({ services, photos }: { services: Service[]; photos: Record<string, string> }) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
      <ol className="border-t border-border">
        {services.map((service, index) => (
          <li key={service.slug} className="border-b border-border">
            <Link
              href={`/services/${service.slug}`}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 py-6 md:py-7"
            >
              <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
              <span>
                <span className="flex items-baseline gap-3">
                  <span
                    className={cn(
                      "font-heading text-3xl tracking-tight transition-colors md:text-[2.6rem]",
                      active === index ? "text-foreground" : "text-foreground/55 lg:text-foreground/45",
                    )}
                  >
                    {service.name}
                  </span>
                  <span className="label-mono hidden sm:inline">{service.kicker}</span>
                </span>
                <span
                  className={cn(
                    "mt-2 block max-w-lg text-sm leading-6 text-muted-foreground transition-opacity lg:max-h-0 lg:overflow-hidden lg:opacity-0",
                    active === index && "lg:max-h-20 lg:opacity-100",
                  )}
                >
                  {service.summary}
                </span>
                <span className="relative mt-4 block aspect-[16/10] overflow-hidden rounded-xl lg:hidden">
                  <Photo src={photos[service.slug]} alt="" sizes="100vw" />
                </span>
              </span>
              <span
                className={cn(
                  "grid size-11 place-items-center rounded-full border border-border transition-all duration-300 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background",
                  active === index && "lg:border-foreground lg:bg-foreground lg:text-background",
                )}
              >
                <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="relative hidden lg:block">
        <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
          {services.map((service, index) => (
            <div
              key={service.slug}
              className={cn(
                "absolute inset-0 transition-[opacity,transform] duration-700 ease-out",
                active === index ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
              )}
            >
              <Photo src={photos[service.slug]} alt={active === index ? service.name : ""} sizes="45vw" />
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
            <p className="font-mono text-[0.68rem] tracking-[0.14em] uppercase opacity-80">{services[active].kicker}</p>
            <p className="mt-1 font-heading text-2xl">{services[active].name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
