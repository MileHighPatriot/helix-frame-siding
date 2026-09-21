"use client";

import { useMemo, useState } from "react";
import { Photo } from "@/components/photo";
import type { DesignOption } from "@/lib/catalog";
import { cn } from "cn";

export function DesignStudio({ options }: { options: DesignOption[] }) {
  const materials = unique(options.map((option) => option.material));
  const colors = unique(options.map((option) => option.color));
  const types = unique(options.map((option) => option.designType));
  const first = options[0];
  const [material, setMaterial] = useState(first.material);
  const [color, setColor] = useState(first.color);
  const [designType, setDesignType] = useState(first.designType);
  const [id, setId] = useState(first.id);

  const visible = useMemo(() => {
    const exact = options.filter(
      (option) => option.material === material && option.color === color && option.designType === designType,
    );
    if (exact.length > 0) return exact;
    const scored = [...options].sort((a, b) => score(b, material, color, designType) - score(a, material, color, designType));
    const best = score(scored[0], material, color, designType);
    return scored.filter((option) => score(option, material, color, designType) === best);
  }, [options, material, color, designType]);
  const selected = visible.find((option) => option.id === id) ?? visible[0];

  function choose(option: DesignOption) {
    setId(option.id);
    setMaterial(option.material);
    setColor(option.color);
    setDesignType(option.designType);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border">
          <Photo src={selected.image} alt={selected.name} sizes="(min-width: 1024px) 640px, 100vw" />
        </div>
        {visible.length > 1 && (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {visible.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => choose(option)}
                aria-pressed={option.id === selected.id}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-lg border",
                  option.id === selected.id ? "border-copper" : "border-border",
                )}
              >
                <Photo src={option.image} alt="" sizes="160px" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <Filter label="Material" values={materials} current={material} onChange={setMaterial} />
        <Filter label="Color" values={colors} current={color} onChange={setColor} swatches={options} />
        <Filter label="Design" values={types} current={designType} onChange={setDesignType} />
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <p className="eyebrow">{selected.material}</p>
          <h3 className="mt-2 font-heading text-3xl">{selected.name}</h3>
          <dl className="mt-5 space-y-3 text-sm">
            <Spec term="Profile" value={selected.profile} />
            <Spec term="Spacing" value={selected.spacing} />
            <Spec term="Substrate" value={selected.substrate} />
            <Spec term="Helix does" value={selected.helix} />
            <Spec term="Partner does" value={selected.partner} />
          </dl>
        </div>
      </div>
    </div>
  );
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function score(option: DesignOption, material: string, color: string, designType: string) {
  return Number(option.material === material) + Number(option.color === color) + Number(option.designType === designType);
}

function Filter({
  label,
  values,
  current,
  onChange,
  swatches,
}: {
  label: string;
  values: string[];
  current: string;
  onChange: (value: string) => void;
  swatches?: DesignOption[];
}) {
  return (
    <fieldset className="mt-4">
      <legend className="text-xs tracking-[0.16em] text-muted-foreground uppercase">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => {
          const hex = swatches?.find((option) => option.color === value)?.colorHex;
          const active = value === current;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
                active ? "border-copper text-copper" : "border-border text-foreground",
              )}
            >
              {hex ? <span className="size-3 rounded-full border border-white/30" style={{ background: hex }} /> : null}
              {value}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Spec({ term, value }: { term: string; value: string }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3">
      <dt className="text-muted-foreground">{term}</dt>
      <dd>{value}</dd>
    </div>
  );
}
