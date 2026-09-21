import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrade, trades } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return trades.map((trade) => ({ slug: trade.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trade = getTrade(slug);
  if (!trade) return { title: "Trade" };
  return { title: trade.name, description: trade.owns };
}

export default async function TradePage({ params }: Props) {
  const { slug } = await params;
  const trade = getTrade(slug);
  if (!trade) notFound();

  return (
    <section className="mx-auto max-w-3xl px-5 py-14 md:px-8">
      <p className="eyebrow">{trade.craft}</p>
      <h1 className="mt-3 font-heading text-5xl tracking-tight">{trade.name}</h1>
      <p className="mt-3 text-copper">{trade.area}</p>
      <p className="mt-6 text-lg leading-8 text-muted-foreground">{trade.history}</p>
      <dl className="mt-8 divide-y divide-border rounded-xl border border-border">
        <Row term="Phone" value={trade.phone} href={trade.phoneHref} />
        <Row term="Email" value={trade.email} href={`mailto:${trade.email}`} />
        <Row term="Website" value={trade.websiteLabel} href={trade.website} />
        <Row term="Address" value={`${trade.address}, ${trade.city}`} />
        <Row term="Hours" value={trade.hours} />
        <Row term="License" value={trade.license} />
      </dl>
      <h2 className="mt-12 font-heading text-3xl">On a Helix job</h2>
      <p className="mt-4 leading-7 text-muted-foreground">{trade.onHelix}</p>
      <p className="mt-4 leading-7 text-muted-foreground">{trade.owns}</p>
      <p className="mt-8 text-sm text-muted-foreground">
        Sample company details for this site. Phone, email, and website are not live contacts.
      </p>
      <Link href="/trades" className="mt-6 inline-block text-sm text-copper">
        All trades
      </Link>
    </section>
  );
}

function Row({ term, value, href }: { term: string; value: string; href?: string }) {
  return (
    <div className="grid gap-1 px-4 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
      <dt className="text-sm text-muted-foreground">{term}</dt>
      <dd>
        {href ? (
          <a href={href} className="text-copper">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
