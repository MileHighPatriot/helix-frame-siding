import { RiseIn } from "@/components/reveal";

export function PageHero({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="grid-fade pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <RiseIn>
          <p className="eyebrow">{kicker}</p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-tight tracking-tight md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{lede}</p>
        </RiseIn>
      </div>
    </section>
  );
}
