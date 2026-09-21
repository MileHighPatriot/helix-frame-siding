import { Photo } from "@/components/photo";
import {
  allowanceRates,
  getDesign,
  serviceName,
  serviceTrades,
  services,
  type ServiceSlug,
} from "@/lib/content";
import type { EstimateInput } from "@/lib/leads";

const assumptions = [
  "This sheet is a pre-visit allowance, not a contract price.",
  "The existing structure is sound enough to tie into unless the walk says otherwise.",
  "Helix self-performs framing and siding. Partner work stays an allowance until that company walks the job.",
];

const exclusions = [
  "Permit fees and engineering stamps",
  "Paint, flooring, cabinets, and countertops",
  "Work outside the services selected here",
  "Hazardous materials and hidden rot, priced after they are seen",
];

export function ScopeSheet({
  values,
  reference,
}: {
  values: EstimateInput;
  reference?: string;
}) {
  const area = parseArea(values.area);
  const tradeNames = unique(
    values.services.flatMap((slug) => serviceTrades[slug as ServiceSlug] ?? []),
  );

  return (
    <article className="rounded-xl border border-border bg-background p-5">
      <p className="eyebrow">Scope sheet</p>
      <h3 className="mt-2 font-heading text-2xl">
        {values.address ? `${values.address}, ${values.city}` : "Job not addressed yet"}
      </h3>
      {reference ? <p className="mt-2 font-heading text-3xl text-copper">{reference}</p> : null}
      <p className="mt-3 text-sm text-muted-foreground">
        {values.area || "Size not set"} · {values.stories || "Stories not set"} · {values.timeline || "Timeline open"} · {values.budget || "Budget open"}
      </p>
      <ul className="mt-6 space-y-4">
        {values.services.map((slug) => {
          const service = services.find((item) => item.slug === slug);
          const design = getDesign(values.designs[slug] ?? "");
          const rate = allowanceRates[slug as ServiceSlug];
          return (
            <li key={slug} className="grid gap-3 border-t border-border pt-4 sm:grid-cols-[7rem_1fr]">
              {design ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
                  <Photo src={design.image} alt="" sizes="120px" />
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-lg border border-dashed border-border" />
              )}
              <div>
                <p className="font-heading text-xl">{service?.name ?? serviceName(slug as ServiceSlug)}</p>
                {design ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {design.name} · {design.material} · {design.color} · {design.designType}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">Design not chosen yet</p>
                )}
                <p className="mt-2 text-sm">
                  Allowance: {band(area, rate)}
                  {rate ? <span className="text-muted-foreground"> per {rate.unit}, before the walk</span> : null}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
        <div>
          <h4 className="font-heading text-lg">Site</h4>
          <p className="mt-2 text-muted-foreground">Occupied: {values.occupied || "—"}</p>
          <p className="text-muted-foreground">Access: {values.access || "—"}</p>
          <p className="text-muted-foreground">HOA or design review: {values.hoa || "—"}</p>
          {values.notes ? <p className="mt-2 text-muted-foreground">{values.notes}</p> : null}
        </div>
        <div>
          <h4 className="font-heading text-lg">Trades carried</h4>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            {tradeNames.length > 0 ? tradeNames.map((name) => <li key={name}>{name}</li>) : <li>None until a service is chosen</li>}
          </ul>
        </div>
      </div>
      <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
        <div>
          <h4 className="font-heading text-lg">Assumptions</h4>
          <ul className="mt-2 space-y-2 text-muted-foreground">
            {assumptions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-lg">Not in this number</h4>
          <ul className="mt-2 space-y-2 text-muted-foreground">
            {exclusions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function parseArea(value: string) {
  const match = value.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  if (!match) return null;
  const number = Number(match[1]);
  return number > 0 ? number : null;
}

function band(area: number | null, rate?: { low: number; high: number }) {
  if (!area || !rate) return "Set after the walk";
  return `${money(area * rate.low)}–${money(area * rate.high)}`;
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function unique(values: string[]) {
  return [...new Set(values)];
}
