import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/photo";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { chapters } from "@/lib/content";

export const metadata: Metadata = {
  title: "Story",
  description: "How Helix Frame & Siding grew from a Globeville framing bay into a structure and envelope company.",
};

export default function StoryPage() {
  return (
    <>
      <PageHero
        kicker="Story"
        title="A framing crew that stayed to close the walls."
        lede="Helix is not a general contractor that happens to own a nail gun. The company still self-performs the frame and the siding, and it hires the other trades the way a lead carpenter hires a specialist: on purpose, on a schedule. The shop, the crew, and the bench all grew from jobs that went wrong when someone else closed the walls."
      />
      <section className="shell max-w-6xl py-16 md:py-24">
        <ol className="space-y-20 md:space-y-28">
          {chapters.map((chapter, index) => (
            <Reveal key={chapter.year} delay={index * 0.04}>
              <li className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                <div className={index % 2 === 1 ? "md:order-2" : undefined}>
                  <div className="frame-clip relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Photo src={chapter.image} alt={chapter.title} />
                  </div>
                </div>
                <div>
                  <p className="display-md text-copper">{chapter.year}</p>
                  <h2 className="display-sm mt-4">{chapter.title}</h2>
                  <p className="mt-5 text-lg leading-8 text-muted-foreground">{chapter.copy}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
        <div className="mt-20 flex flex-col gap-3 border-t border-border pt-10 sm:flex-row">
          <Link href="/team" className={buttonVariants({ variant: "ink", size: "lg" })}>
            Meet the crew
          </Link>
          <Link href="/trades" className={buttonVariants({ variant: "outline", size: "lg" })}>
            See the trade bench
          </Link>
        </div>
      </section>
    </>
  );
}
