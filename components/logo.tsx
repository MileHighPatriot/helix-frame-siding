import { cn } from "cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("size-9 shrink-0", className)}
      aria-hidden
    >
      <rect
        x="1.5"
        y="1.5"
        width="45"
        height="45"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity="0.45"
      />
      <path
        d="M10 36.5 22.5 11h3.2L13.4 36.5H10Z"
        fill="currentColor"
      />
      <path
        d="M34.6 36.5 22.2 11h3.3L38 36.5h-3.4Z"
        fill="var(--copper)"
      />
      <path
        d="M16 24.5h16"
        stroke="var(--cedar)"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
      <path
        d="M18.5 29.5h11"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.7"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3 text-foreground", className)}>
      <LogoMark />
      <span className="leading-none">
        <span className="block font-heading text-[0.95rem] tracking-[0.16em] uppercase">
          Helix
        </span>
        <span className="mt-1 block text-[0.68rem] tracking-[0.18em] uppercase text-muted-foreground">
          Frame & Siding
        </span>
      </span>
    </span>
  );
}
