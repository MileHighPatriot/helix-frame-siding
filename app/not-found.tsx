import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24 md:px-8">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-heading text-5xl tracking-tight">That page is not on the drawings.</h1>
      <p className="mt-4 text-muted-foreground">
        The sheet number may have changed. Head back to the work, or start an estimate.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className={cn(buttonVariants(), "h-11 px-5")}>
          Home
        </Link>
        <Link href="/work" className={cn(buttonVariants({ variant: "outline" }), "h-11 px-5")}>
          Previous work
        </Link>
      </div>
    </section>
  );
}
