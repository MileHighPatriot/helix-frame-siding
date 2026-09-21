"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { nav } from "@/lib/content";
import { cn } from "cn";

export function SiteHeader() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,height,backdrop-filter] duration-300",
        compact
          ? "border-border bg-background/90 backdrop-blur-md"
          : "border-transparent bg-background/40"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-[padding] duration-300 md:px-8",
          compact ? "py-2.5" : "py-4"
        )}
      >
        <Link href="/" aria-label="Helix Frame & Siding home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/estimates"
            className={cn(buttonVariants({ size: "lg" }), "hidden h-10 px-4 sm:inline-flex")}
          >
            Request an estimate
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,22rem)] bg-background">
              <SheetHeader>
                <SheetTitle>Helix</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-border py-3 text-lg font-heading"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/permits"
                  onClick={() => setOpen(false)}
                  className="border-b border-border py-3 text-lg font-heading"
                >
                  Permits
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="border-b border-border py-3 text-lg font-heading"
                >
                  Contact
                </Link>
                <Link
                  href="/team"
                  onClick={() => setOpen(false)}
                  className="border-b border-border py-3 text-lg font-heading"
                >
                  Team
                </Link>
              </nav>
              <div className="mt-auto p-4">
                <Link
                  href="/estimates"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants(), "h-11 w-full")}
                >
                  Request an estimate
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
