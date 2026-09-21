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
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
    />
  );
}
