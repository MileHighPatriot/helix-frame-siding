"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { DesignStage } from "@/components/design-stage";
import { buttonVariants } from "@/components/ui/button";
import { controlsFor, normalizeSelection, selectionId } from "@/lib/scenes";
import { cn } from "cn";

const featured = ["field", "fieldColor", "trimColor"];

export function StudioTeaser() {
  const [selection, setSelection] = useState(() => normalizeSelection("siding", {}));
  const [near, setNear] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const controls = controlsFor("siding", selection).filter((control) => featured.includes(control.key));

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-14">
      <div>
        <p className="eyebrow">Design studio</p>
        <h2 className="display-md mt-4 text-balance">Change the siding. Only the siding changes.</h2>
        <p className="mt-5 max-w-lg text-lg leading-8 text-muted-foreground">
          Every service has a live 3D model. Pick a profile, a color, the trim, the railing, or the beam, and the part you name is the part that moves.
        </p>
        <div className="mt-8 space-y-6">
          {controls.map((control) => (
            <fieldset key={control.key}>
              <legend className="label-mono">{control.label}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {control.options.map((option) => {
                  const on = selection[control.key] === option.id;
                  return control.kind === "color" ? (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={on}
                      aria-label={option.label}
                      title={option.label}
                      onClick={() => setSelection(normalizeSelection("siding", { ...selection, [control.key]: option.id }))}
                      className={cn(
                        "relative size-9 rounded-full ring-offset-2 ring-offset-background transition-transform hover:scale-105",
                        on ? "ring-2 ring-foreground" : "ring-1 ring-white/20",
                      )}
                      style={{ backgroundColor: option.swatch }}
                    >
                      {on ? <Check className="absolute inset-0 m-auto size-4 text-white mix-blend-difference" aria-hidden /> : null}
                    </button>
                  ) : (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setSelection(normalizeSelection("siding", { ...selection, [control.key]: option.id }))}
                      className={cn(
                        "rounded-full border px-3.5 py-2 text-sm transition-colors",
                        on ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/40",
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href={`/studio?design=${encodeURIComponent(selectionId("siding", selection))}`} className={buttonVariants({ size: "lg" })}>
            Open the full studio
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
          <Link href={`/estimates?design=${encodeURIComponent(selectionId("siding", selection))}`} className={buttonVariants({ variant: "outline", size: "lg" })}>
            Price this house
          </Link>
        </div>
      </div>
      <div ref={stageRef} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#dce2e5] lg:aspect-[5/4]">
        {near ? <DesignStage service="siding" selection={selection} className="absolute inset-0" /> : null}
      </div>
    </div>
  );
}
