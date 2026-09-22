import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Box } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Photo } from "@/components/photo";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { servicePhotos, services } from "@/lib/content";
import { defaultDesignId } from "@/lib/scenes";
import { cn } from "cn";

export const metadata: Metadata = {
  title: "Services",
  description: "Framing, siding, decking, outdoor structures, remodels, and additions from Helix Frame & Siding.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        kicker="Services"
        title="Structure first. Skin second. The rest on our calendar."
        lede="Helix self-performs framing and the exterior envelope. Decks, outdoor structures, remodels, and additions stay in that same crew, with partner trades scheduled when the work leaves our tools."
        actions={
          <Link href="/studio" className={buttonVariants({ variant: "outline" })}>
            <Box className="size-4" aria-hidden />
            Design any of them in 3D
          </Link>
        }
      />
      <section className="shell py-16 md:py-24">
        <ol className="grid gap-20 md:gap-28">
          {services.map((service, index) => (
            <li key={service.slug} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <Reveal clip className={cn("relative aspect-[4/3] overflow-hidden rounded-2xl", index % 2 === 1 && "lg:order-2")}>
                <Link href={`/services/${service.slug}`} className="group absolute inset-0 block" aria-label={service.name}>
                  <span className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                    <Photo src={servicePhotos[service.slug]} alt="" sizes="(min-width: 1024px) 50vw, 100vw" />
                  </span>
                </Link>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="flex items-center gap-3">
                  <span className="font-mono text-xs text-copper">0{index + 1}</span>
                  <span className="label-mono">{service.kicker}</span>
                </p>
                <h2 className="display-md mt-4">{service.name}</h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">{service.lede}</p>
                <ul className="mt-8 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
                  {service.scope.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-copper" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={`/services/${service.slug}`} className={buttonVariants({ variant: "ink" })}>
                    Open the scope
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                  <Link href={`/studio?design=${encodeURIComponent(defaultDesignId(service.slug))}`} className={buttonVariants({ variant: "outline" })}>
                    <Box className="size-4" aria-hidden />
                    Design in 3D
                  </Link>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
