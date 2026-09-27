import Image from "next/image";
import { cn } from "cn";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function mediaSrc(src: string) {
  if (!src.startsWith("/") || (basePath && src.startsWith(`${basePath}/`))) return src;
  return `${basePath}${src}`;
}

export function Photo({
  src,
  alt,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 720px, 100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={mediaSrc(src)}
      alt={alt}
      fill
      // Next 16 deprecated `priority`; eager + high fetch priority is the documented replacement.
      loading={priority ? "eager" : undefined}
      fetchPriority={priority ? "high" : undefined}
      sizes={sizes}
      className={cn("object-cover", className)}
    />
  );
}
