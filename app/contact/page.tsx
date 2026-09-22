import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, email, or visit Helix Frame & Siding in Denver.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="The shop is on Decatur Street."
        lede="Call for a schedule question. Use the form if you want a person to read a note before they ring you back. Estimates and permits have their own requests."
      />
      <section className="shell grid gap-10 py-14 md:grid-cols-2">
        <Reveal immediate className="space-y-6">
          <div>
            <p className="eyebrow">Phone</p>
            <a className="mt-2 block font-heading text-3xl" href={company.phoneHref}>
              {company.phone}
            </a>
          </div>
          <div>
            <p className="eyebrow">Email</p>
            <a className="mt-2 block text-lg" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </div>
          <div>
            <p className="eyebrow">Shop</p>
            <p className="mt-2 leading-7">
              {company.address}
              <br />
              {company.city}
              <br />
              {company.hours}
            </p>
          </div>
          <div>
            <p className="eyebrow">Area</p>
            <p className="mt-2 text-muted-foreground">{company.area}</p>
          </div>
        </Reveal>
        <Reveal immediate delay={0.08} className="rounded-xl border border-border bg-card p-5 md:p-7">
          <ContactForm />
        </Reveal>
      </section>
    </>
  );
}
