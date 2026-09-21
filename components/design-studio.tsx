"use client";

import { useState } from "react";
import { DesignStage } from "@/components/design-stage";
import type { ServiceSlug } from "@/lib/content-types";
import { controlsFor, defaultDesignId, normalizeSelection, parseSelection, resolveDesign, selectionId } from "@/lib/scenes";
import { cn } from "cn";

export function DesignStudio({
  service,
  value,
  onChange,
}: {
  service: ServiceSlug;
  value?: string;
  onChange?: (id: string) => void;
}) {
  const [local, setLocal] = useState(() => value ?? defaultDesignId(service));
  const id = value ?? local;
  const parsed = parseSelection(id);
  const selection = parsed?.service === service ? parsed.selection : normalizeSelection(service, {});
  const design = resolveDesign(service, selection);
  const controls = controlsFor(service, selection);

  function update(key: string, next: string) {
    const encoded = selectionId(service, normalizeSelection(service, { ...selection, [key]: next }));
    onChange?.(encoded);
    if (value === undefined) setLocal(encoded);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <DesignStage design={design} alt={design.name} />
        <p className="mt-3 text-sm text-muted-foreground">
          This is one project. Each control changes only its part of the photograph.
        </p>
      </div>
      <div>
        {controls.map((control) => (
          <fieldset key={control.key} className="mt-4 first:mt-0">
            <legend className="text-xs tracking-[0.16em] text-muted-foreground uppercase">{control.label}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {control.options.map((option) => {
                const on = selection[control.key] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => update(control.key, option.id)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                      on ? "border-copper bg-copper/10" : "border-border",
                    )}
                  >
                    {option.swatch ? (
                      <span
                        className="size-3.5 rounded-full border border-white/30"
                        style={{ backgroundColor: option.swatch }}
                      />
                    ) : null}
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <p className="eyebrow">{design.material}</p>
          <h3 className="mt-2 font-heading text-3xl">{design.name}</h3>
          <dl className="mt-5 space-y-3 text-sm">
            <Spec term="Profile" value={design.profile} />
            <Spec term="Spacing" value={design.spacing} />
            <Spec term="Substrate" value={design.substrate} />
            <Spec term="Helix does" value={design.helix} />
            <Spec term="Partner does" value={design.partner} />
          </dl>
        </div>
      </div>
    </div>
  );
}

function Spec({ term, value }: { term: string; value: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-3">
      <dt className="text-muted-foreground">{term}</dt>
      <dd>{value}</dd>
    </div>
  );
}
