import Image from "next/image";
import { cn } from "cn";

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
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
    />
  );
}
