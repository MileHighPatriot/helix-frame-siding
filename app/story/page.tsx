import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/photo";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { chapters } from "@/lib/content";
import { cn } from "cn";

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
      <section className="mx-auto max-w-5xl px-5 py-14 md:px-8">
        <ol className="space-y-16">
          {chapters.map((chapter, index) => (
            <Reveal key={chapter.year} delay={index * 0.04}>
              <li className="grid items-center gap-6 md:grid-cols-2">
                <div className={index % 2 === 1 ? "md:order-2" : undefined}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border">
                    <Photo src={chapter.image} alt={chapter.title} />
                  </div>
                </div>
                <div>
                  <p className="font-heading text-copper">{chapter.year}</p>
                  <h2 className="mt-2 font-heading text-3xl">{chapter.title}</h2>
                  <p className="mt-4 leading-7 text-muted-foreground">{chapter.copy}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
        <div className="mt-16 flex flex-col gap-3 sm:flex-row">
          <Link href="/team" className={cn(buttonVariants(), "h-11 px-5")}>
            Meet the crew
          </Link>
          <Link href="/trades" className={cn(buttonVariants({ variant: "outline" }), "h-11 px-5")}>
            See the trade bench
          </Link>
        </div>
      </section>
    </>
  );
}
