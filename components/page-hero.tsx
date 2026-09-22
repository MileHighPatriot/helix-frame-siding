import type { ReactNode } from "react";
import { Photo } from "@/components/photo";
import { Reveal, RiseIn } from "@/components/reveal";

export function PageHero({
  kicker,
  title,
  lede,
  image,
  imageAlt = "",
  actions,
}: {
  kicker: string;
  title: string;
  lede: string;
  image?: string;
  imageAlt?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-fade pointer-events-none absolute inset-0 text-foreground" />
      <div className="shell relative pt-14 pb-12 md:pt-24 md:pb-16">
        <RiseIn>
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-current" aria-hidden />
            {kicker}
          </p>
          <h1 className="display-lg mt-6 max-w-5xl text-balance">{title}</h1>
          <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,40rem)_auto] md:items-end md:justify-between">
            <p className="text-lg leading-8 text-pretty text-muted-foreground">{lede}</p>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        </RiseIn>
      </div>
      {image ? (
        <div className="shell relative pb-4">
          <Reveal clip className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[21/9]">
            <Photo src={image} alt={imageAlt} priority sizes="100vw" />
          </Reveal>
        </div>
      ) : (
        <div className="shell">
          <div className="h-px bg-border" />
        </div>
      )}
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: ReactNode;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <Reveal className="max-w-3xl">
        <p className="eyebrow">{kicker}</p>
        <h2 className="display-md mt-4 text-balance">{title}</h2>
        {lede ? <p className="mt-5 max-w-2xl text-lg leading-8 text-pretty text-muted-foreground">{lede}</p> : null}
      </Reveal>
      {children ? <Reveal delay={0.06} className="shrink-0">{children}</Reveal> : null}
    </div>
  );
}
