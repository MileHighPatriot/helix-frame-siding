import manifest from "@/lib/image-manifest.json";

type LoaderProps = { src: string; width: number; quality?: number };

const sizes = manifest as Record<string, number[]>;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Static hosting has no resizer, so scripts/optimize-images.mjs pre-builds WebP
 * copies at set widths. Serve the smallest one that covers the requested width
 * (or the largest there is). Images not in the manifest are served as-is.
 */
export default function imageLoader({ src, width }: LoaderProps) {
  const path = basePath && src.startsWith(`${basePath}/`) ? src.slice(basePath.length) : src;
  const widths = sizes[path];
  if (!widths) return src;
  const pick = widths.find((w) => w >= width) ?? widths[widths.length - 1];
  return `${basePath}/_img${path.replace(/\.[^.]+$/, "")}-${pick}.webp`;
}
