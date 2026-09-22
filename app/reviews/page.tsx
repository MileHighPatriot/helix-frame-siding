import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { reviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Notes from Helix framing, siding, deck, and addition clients across the Front Range.",
};

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        kicker="Reviews"
        title="What owners say after the punch."
        lede="Notes from owners across Denver and the Front Range, each tied to a neighborhood and the kind of work Helix actually did."
      />
      <section className="shell grid gap-5 py-14 md:grid-cols-2">
        {reviews.map((review, index) => (
          <Reveal key={review.name} delay={(index % 4) * 0.05}>
            <figure className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
              <blockquote className="flex-1 font-heading text-2xl leading-snug">“{review.quote}”</blockquote>
              <figcaption className="mt-6 text-sm text-muted-foreground">
                <span className="text-foreground">{review.name}</span>
                <span> · {review.neighborhood}</span>
                <span className="mt-1 block text-cedar">{review.project}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </section>
    </>
  );
}
