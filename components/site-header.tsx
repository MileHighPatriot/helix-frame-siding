"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { company, nav, secondaryNav } from "@/lib/content";
import { cn } from "cn";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overlay = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,color] duration-300",
        overlay
          ? "border-b border-transparent bg-transparent text-white"
          : "border-b border-border bg-background/85 text-foreground backdrop-blur-xl",
      )}
    >
      <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" aria-label="Helix Frame & Siding home" className="shrink-0">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm transition-colors",
                  overlay ? "text-white/80 hover:text-white" : "text-foreground/70 hover:text-foreground",
                  active && (overlay ? "text-white" : "text-foreground"),
                )}
              >
                {item.label}
                {item.href === "/studio" ? (
                  <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 align-[1px] font-mono text-[0.55rem] tracking-[0.12em] text-primary-foreground uppercase">
                    3D
                  </span>
                ) : null}
                {active ? <span className="absolute inset-x-3.5 -bottom-[1.1rem] h-px bg-current" /> : null}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={company.phoneHref}
            className={cn(
              "hidden items-center gap-2 px-2 text-sm tabular-nums transition-colors xl:inline-flex",
              overlay ? "text-white/80 hover:text-white" : "text-foreground/70 hover:text-foreground",
            )}
          >
            <Phone className="size-3.5" aria-hidden />
            {company.phone}
          </a>
          <Link href="/estimates" className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}>
            Get an estimate
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full border lg:hidden",
                overlay ? "border-white/30 text-white" : "border-border",
              )}
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="ink flex flex-col gap-0 border-l-0 p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md [&_[data-slot=sheet-close]]:top-4 [&_[data-slot=sheet-close]]:right-4">
              <div className="flex h-[4.5rem] items-center px-5">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo />
              </div>
              <nav className="flex-1 overflow-y-auto px-5 pt-4" aria-label="Mobile">
                <ol className="border-t border-border">
                  {nav.map((item, index) => (
                    <li key={item.href} className="border-b border-border">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-baseline gap-4 py-4"
                      >
                        <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                        <span className="font-heading text-3xl tracking-tight">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  {secondaryNav.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="hover:text-foreground">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>
              <div className="grid gap-3 border-t border-border p-5">
                <Link href="/estimates" onClick={() => setOpen(false)} className={cn(buttonVariants({ size: "lg" }), "w-full")}>
                  Get an estimate
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
                <a href={company.phoneHref} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}>
                  <Phone className="size-4" aria-hidden />
                  {company.phone}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
