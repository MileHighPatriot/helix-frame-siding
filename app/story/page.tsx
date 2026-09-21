import type { Metadata } from "next";
import Link from "next/link";
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
        lede="Helix is not a general contractor that happens to own a nail gun. The company still self-performs the frame and the siding, and it hires the other trades the way a lead carpenter hires a specialist: on purpose, on a schedule."
      />
      <section className="mx-auto max-w-3xl px-5 py-14 md:px-8">
        <ol className="relative space-y-10 border-l border-border pl-8">
          {chapters.map((chapter, index) => (
            <Reveal key={chapter.year} delay={index * 0.05}>
              <li>
                <span className="absolute -left-1.5 mt-1 size-3 rounded-full bg-copper" />
                <p className="font-heading text-copper">{chapter.year}</p>
                <h2 className="mt-2 font-heading text-3xl">{chapter.title}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{chapter.copy}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
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
