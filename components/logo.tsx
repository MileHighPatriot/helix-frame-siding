import { cn } from "cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9 shrink-0", className)} aria-hidden>
      <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="10" fill="currentColor" opacity="0.08" />
      <path d="M9 30 19.2 9.5h1.6L11.3 30H9Z" fill="currentColor" />
      <path d="M31 30 20.8 9.5h-1.6L28.7 30H31Z" fill="var(--copper)" />
      <path d="M14.2 21.5h11.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M16.2 25.5h7.6" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="leading-none">
        <span className="block font-heading text-[1.35rem] tracking-[-0.02em]">Helix</span>
        <span className="mt-0.5 block font-mono text-[0.6rem] tracking-[0.18em] uppercase opacity-60">Frame & Siding</span>
      </span>
    </span>
  );
}
