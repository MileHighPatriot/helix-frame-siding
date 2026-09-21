import Link from "next/link";
import { Logo } from "@/components/logo";
import { company, nav } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-graphite">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            Framing and siding for Denver and the Front Range. Helix self-performs
            the structure and the skin, and schedules a bench of trades for the rest.
          </p>
        </div>
        <div>
          <p className="eyebrow">Visit</p>
          <p className="mt-3 text-sm leading-6">
            {company.address}
            <br />
            {company.city}
            <br />
            {company.hours}
          </p>
        </div>
        <div>
          <p className="eyebrow">Talk</p>
          <p className="mt-3 text-sm leading-6">
            <a className="hover:text-copper" href={company.phoneHref}>
              {company.phone}
            </a>
            <br />
            <a className="hover:text-copper" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Registration {company.registration}
          </p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} Helix Frame & Siding</p>
          <div className="flex flex-wrap gap-4">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ))}
            <Link href="/estimates" className="hover:text-foreground">
              Estimates
            </Link>
            <Link href="/permits" className="hover:text-foreground">
              Permits
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
