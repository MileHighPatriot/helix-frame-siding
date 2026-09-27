// Pre-builds resized WebP copies of every photo in /public/media, because static hosting
// (GitHub Pages) has no image resizer. lib/image-loader.ts then serves the smallest
// copy that covers the width the browser asks for.
//
//   public/media/foo.png  ->  public/_img/media/foo-384.webp, foo-750.webp, ...
//   lib/image-manifest.json lists the widths made for each image.
//
// Runs before `dev`, `build`, and `pages`. Images whose copies are already newer
// than the original are skipped, so it's fast after the first run.
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "public");
const mediaDir = path.join(publicDir, "media");
const outDir = path.join(publicDir, "_img");
const manifestPath = path.join(root, "lib", "image-manifest.json");

// The originals are 1280px wide, so a few steps below that cover phones through desktops.
const WIDTHS = [384, 640, 828, 1080];
const QUALITY = 76;

const mtime = (file) =>
  stat(file).then(
    (s) => s.mtimeMs,
    () => 0,
  );

const manifest = {};
let made = 0;

for (const name of (await readdir(mediaDir)).sort()) {
  if (!/\.(jpe?g|png)$/i.test(name)) continue;
  const file = path.join(mediaDir, name);
  const rel = `/media/${name}`;
  const { width: original } = await sharp(file).metadata();
  const widths = [...WIDTHS.filter((w) => w < original), original];
  manifest[rel] = widths;

  const base = path.join(outDir, rel.replace(/\.[^.]+$/, ""));
  await mkdir(path.dirname(base), { recursive: true });
  const sourceTime = await mtime(file);
  for (const width of widths) {
    const target = `${base}-${width}.webp`;
    if ((await mtime(target)) > sourceTime) continue;
    await sharp(file).resize({ width }).webp({ quality: QUALITY }).toFile(target);
    made++;
  }
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`images: ${Object.keys(manifest).length} photos, ${made} copies written`);
