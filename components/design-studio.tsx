"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Link2 } from "lucide-react";
import { DesignStage } from "@/components/design-stage";
import type { ServiceSlug } from "@/lib/content-types";
import {
  controlsFor,
  defaultDesignId,
  normalizeSelection,
  parseSelection,
  resolveDesign,
  selectionId,
  type DesignOption,
  type SceneControl,
} from "@/lib/scenes";
import { cn } from "cn";

export function DesignStudio({
  service,
  value,
  onChange,
  compact = false,
}: {
  service: ServiceSlug;
  value?: string;
  onChange?: (id: string) => void;
  compact?: boolean;
}) {
  const [local, setLocal] = useState(() => value ?? defaultDesignId(service));
  const [copied, setCopied] = useState(false);
  const id = value ?? local;
  const parsed = parseSelection(id);
  const selection = parsed?.service === service ? parsed.selection : normalizeSelection(service, {});
  const design = resolveDesign(service, selection);
  const controls = controlsFor(service, selection);

  function choose(next: string) {
    onChange?.(next);
    if (value === undefined) setLocal(next);
  }

  function update(key: string, option: string) {
    choose(selectionId(service, normalizeSelection(service, { ...selection, [key]: option })));
  }

  async function copyLink() {
    const url = `${window.location.origin}${window.location.pathname}?design=${encodeURIComponent(design.id)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <div className="grid gap-4">
      {!compact && value === undefined ? (
        <Suspense fallback={null}>
          <DesignFromUrl service={service} onFound={choose} />
        </Suspense>
      ) : null}
      <div
        className={cn(
          "grid overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_0_rgba(0,0,0,0.02),0_24px_60px_-40px_rgba(20,20,20,0.35)]",
          compact ? "xl:grid-cols-[minmax(0,1fr)_340px]" : "lg:grid-cols-[minmax(0,1fr)_380px]",
        )}
      >
        <DesignStage
          key={service}
          service={service}
          selection={selection}
          className={cn("aspect-[4/3] sm:aspect-[16/10]", compact ? "xl:aspect-auto xl:min-h-[520px]" : "lg:aspect-auto lg:min-h-[640px]")}
        />
        <div
          className={cn(
            "flex min-h-0 flex-col border-t border-border",
            compact ? "xl:max-h-[520px] xl:border-t-0 xl:border-l" : "lg:max-h-[640px] lg:border-t-0 lg:border-l",
          )}
        >
          <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
            <div>
              <p className="label-mono">Configure</p>
              <h3 className="mt-2 font-heading text-2xl leading-tight tracking-tight">{design.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {design.color} · {design.designType}
              </p>
            </div>
            {controls.map((control) => (
              <ControlGroup key={control.key} control={control} value={selection[control.key]} onPick={(option) => update(control.key, option)} />
            ))}
          </div>
          {!compact ? (
            <div className="flex flex-wrap gap-2 border-t border-border p-4 sm:p-5">
              <Link
                href={`/estimates?design=${encodeURIComponent(design.id)}`}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Price this design
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                {copied ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
                {copied ? "Copied" : "Share"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <SpecStrip design={design} compact={compact} />
    </div>
  );
}

function ControlGroup({ control, value, onPick }: { control: SceneControl; value: string; onPick: (id: string) => void }) {
  const current = control.options.find((option) => option.id === value);
  return (
    <fieldset>
      <legend className="flex w-full items-baseline justify-between gap-3 text-sm">
        <span className="font-medium">{control.label}</span>
        <span className="text-xs text-muted-foreground">{current?.label}</span>
      </legend>
      {control.kind === "color" ? (
        <div className="mt-3 flex flex-wrap gap-2.5">
          {control.options.map((option) => {
            const on = option.id === value;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={on}
                aria-label={option.label}
                title={option.label}
                onClick={() => onPick(option.id)}
                className={cn(
                  "relative size-9 rounded-full ring-offset-2 ring-offset-card transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  on ? "ring-2 ring-foreground" : "ring-1 ring-black/10",
                )}
                style={{ backgroundColor: option.swatch }}
              >
                {on ? <Check className="absolute inset-0 m-auto size-4 text-white mix-blend-difference" aria-hidden /> : null}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {control.options.map((option) => {
            const on = option.id === value;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={on}
                onClick={() => onPick(option.id)}
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
      )}
    </fieldset>
  );
}

function SpecStrip({ design, compact }: { design: DesignOption; compact: boolean }) {
  const rows = [
    { term: "Profile", value: design.profile },
    { term: "Spacing", value: design.spacing },
    { term: "Substrate", value: design.substrate },
    { term: "Helix does", value: design.helix },
    { term: "Partner does", value: design.partner },
  ];
  return (
    <dl className={cn("grid gap-px overflow-hidden rounded-2xl border border-border bg-border", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-5")}>
      {rows.map((row, index) => (
        <div key={row.term} className={cn("bg-card p-4 sm:p-5", !compact && index === 0 ? "sm:col-span-2 lg:col-span-1" : undefined)}>
          <dt className="label-mono">{row.term}</dt>
          <dd className="mt-2 text-sm leading-6">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function DesignFromUrl({ service, onFound }: { service: ServiceSlug; onFound: (id: string) => void }) {
  return (
    <DesignParam
      onFound={(id) => {
        const parsed = parseSelection(id);
        if (parsed?.service === service) onFound(selectionId(service, parsed.selection));
      }}
    />
  );
}

export function DesignParam({ onFound }: { onFound: (id: string) => void }) {
  const params = useSearchParams();
  const requested = params.get("design");
  const found = useRef(onFound);
  useEffect(() => {
    found.current = onFound;
  });
  useEffect(() => {
    if (requested && parseSelection(requested)) found.current(requested);
  }, [requested]);
  return null;
}
