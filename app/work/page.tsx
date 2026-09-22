import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { WorkGallery } from "@/components/work-gallery";

export const metadata: Metadata = {
  title: "Previous work",
  description: "Framing, siding, decks, remodels, and additions by Helix Frame & Siding.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        kicker="Previous work"
        title="Shells we have stood and closed."
        lede="Each project is a case, not a thumbnail. Filter by the work Helix self-performed, then open the challenge, the trades, and the outcome."
      />
      <section className="shell py-14">
        <WorkGallery />
      </section>
    </>
  );
}
