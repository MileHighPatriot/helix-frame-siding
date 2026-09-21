import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Photo } from "@/components/photo";
import { servicePhotos, services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Framing, siding, decking, outdoor structures, remodels, and additions from Helix Frame & Siding.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        kicker="Services"
        title="Structure first. Skin second. The rest on our calendar."
        lede="Helix self-performs framing and the exterior envelope. Decks, outdoor structures, remodels, and additions stay in that same crew, with partner trades scheduled when the work leaves our tools."
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-14 md:grid-cols-2 md:px-8">
        {services.map((service, index) => (
          <Reveal key={service.slug} delay={index * 0.05}>
            <Link
              href={`/services/${service.slug}`}
              className="group grid overflow-hidden rounded-xl border border-border bg-card md:grid-cols-[1fr_0.8fr]"
            >
              <div className="p-5">
                <p className="eyebrow">{service.kicker}</p>
                <h2 className="mt-3 font-heading text-3xl">{service.name}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{service.summary}</p>
                <p className="mt-4 text-sm text-copper">Open the scope</p>
              </div>
              <div className="relative min-h-48 border-t border-border md:border-t-0 md:border-l">
                <Photo src={servicePhotos[service.slug]} alt="" />
              </div>
            </Link>
          </Reveal>
        ))}
      </section>
    </>
  );
}
