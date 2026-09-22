import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { company, nav, secondaryNav, services } from "@/lib/content";
import { cn } from "cn";

export function SiteFooter() {
  return (
    <footer className="ink">
      <div className="shell py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="eyebrow">Start with the address</p>
            <p className="display-lg mt-5 max-w-4xl">
              Tell us the house and the work. <span className="text-muted-foreground">We will tell you who touches it.</span>
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href="/estimates" className={buttonVariants({ size: "lg" })}>
              Get an estimate
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
            <Link href="/studio" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Open the design studio
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-border pt-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">
              Framing and siding for Denver and the Front Range. Helix self-performs the structure and the skin, and schedules a bench of trades for the rest.
            </p>
          </div>
          <FooterColumn title="Services" links={services.map((service) => ({ href: `/services/${service.slug}`, label: service.name }))} />
          <FooterColumn title="Company" links={[...nav.filter((item) => item.href !== "/services"), ...secondaryNav.slice(0, 2)]} />
          <FooterColumn title="Requests" links={secondaryNav.slice(2)} />
          <div>
            <p className="label-mono">Shop</p>
            <address className="mt-4 text-sm leading-6 not-italic">
              {company.address}
              <br />
              {company.city}
              <br />
              <span className="text-muted-foreground">{company.hours}</span>
            </address>
            <p className="mt-4 text-sm leading-6">
              <a className="transition-colors hover:text-copper" href={company.phoneHref}>
                {company.phone}
              </a>
              <br />
              <a className="transition-colors hover:text-copper" href={`mailto:${company.email}`}>
                {company.email}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="shell flex flex-col gap-2 py-6 font-mono text-[0.68rem] tracking-[0.12em] text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Helix Frame & Siding</p>
          <p>Registration {company.registration} · {company.area}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div>
      <p className="label-mono">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={cn("text-foreground/85 transition-colors hover:text-copper")}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
