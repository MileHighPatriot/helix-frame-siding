"use client";

import { useEffect, useRef, useState } from "react";
import { mediaSrc } from "@/components/photo";
import type { DesignOption } from "@/lib/scenes";
import { cn } from "cn";

const imageCache = new Map<string, Promise<HTMLImageElement>>();

export function DesignStage({ design, alt }: { design: DesignOption; alt: string }) {
  const plateKey = design.layers.map((layer) => layer.src).join("|");
  const signature = `${plateKey}::${design.washes.map((wash) => `${wash.mask}@${wash.hex}@${wash.slot}`).join("|")}`;
  const [front, setFront] = useState<string | null>(null);
  const [back, setBack] = useState<string | null>(null);
  const shown = useRef<string | null>(null);
  const plateShown = useRef(plateKey);
  const designRef = useRef(design);

  useEffect(() => {
    designRef.current = design;
  });

  useEffect(() => {
    let cancel = false;
    const timerIds: number[] = [];
    const nextPlate = plateKey;
    composite(designRef.current)
      .then((url) => {
        if (cancel) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduce && plateShown.current !== nextPlate && shown.current) {
          setBack(shown.current);
          timerIds.push(window.setTimeout(() => setBack(null), 480));
        }
        plateShown.current = nextPlate;
        shown.current = url;
        setFront(url);
      })
      .catch(() => {
        if (!cancel) setFront(null);
      });
    return () => {
      cancel = true;
      timerIds.forEach((id) => window.clearTimeout(id));
    };
  }, [plateKey, signature]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-graphite">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={mediaSrc(design.layers[0].src)} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      {back ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={back} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      {front ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={front}
          alt=""
          className={cn("absolute inset-0 h-full w-full object-cover", back && "scene-plate is-swap")}
        />
      ) : null}
    </div>
  );
}

async function composite(design: DesignOption) {
  const base = await loadImage(mediaSrc(design.layers[0].src));
  const width = base.naturalWidth;
  const height = base.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return mediaSrc(design.layers[0].src);
  context.drawImage(base, 0, 0, width, height);

  let frame = context.getImageData(0, 0, width, height);
  for (const wash of design.washes.filter((item) => item.slot === "base")) {
    const mask = await loadMask(mediaSrc(wash.mask), width, height);
    recolor(frame.data, mask, wash.hex, wash.strength, width, height);
  }
  context.putImageData(frame, 0, 0);

  for (const layer of design.layers.slice(1)) {
    if (!layer.mask) continue;
    const overlay = await loadImage(mediaSrc(layer.src));
    const clipped = document.createElement("canvas");
    clipped.width = width;
    clipped.height = height;
    const overlayContext = clipped.getContext("2d");
    if (!overlayContext) continue;
    overlayContext.drawImage(overlay, 0, 0, width, height);
    overlayContext.globalCompositeOperation = "destination-in";
    overlayContext.drawImage(await loadImage(mediaSrc(layer.mask)), 0, 0, width, height);
    context.drawImage(clipped, 0, 0);
  }

  frame = context.getImageData(0, 0, width, height);
  for (const wash of design.washes.filter((item) => item.slot === "top")) {
    const mask = await loadMask(mediaSrc(wash.mask), width, height);
    recolor(frame.data, mask, wash.hex, wash.strength, width, height);
  }
  context.putImageData(frame, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.9);
}

function recolor(
  data: Uint8ClampedArray,
  mask: Uint8ClampedArray,
  hex: string,
  strength: number,
  width: number,
  height: number,
) {
  const tone = parseHex(hex);
  const pixels = width * height;
  let sum = 0;
  let count = 0;
  for (let index = 0; index < pixels; index += 1) {
    if (mask[index * 4 + 3] < 128) continue;
    const offset = index * 4;
    sum += 0.2126 * data[offset] + 0.7152 * data[offset + 1] + 0.0722 * data[offset + 2];
    count += 1;
  }
  if (!count) return;
  const mean = Math.max(sum / count, 1);
  const keep = clamp(strength, 0, 1);
  const toneLight = 0.2126 * tone[0] + 0.7152 * tone[1] + 0.0722 * tone[2];
  const grain = keep * 0.18;
  for (let index = 0; index < pixels; index += 1) {
    const alpha = mask[index * 4 + 3] / 255;
    if (alpha < 0.04) continue;
    const offset = index * 4;
    const light = 0.2126 * data[offset] + 0.7152 * data[offset + 1] + 0.0722 * data[offset + 2];
    const shade = (light / mean) ** 0.65;
    const flattened = 1 + (shade - 1) * (0.35 + 0.65 * keep);
    const exposure = clamp(flattened, 0.32, 1.55);
    const scale = toneLight / mean;
    const red = tone[0] * exposure * (1 - grain) + data[offset] * scale * grain;
    const green = tone[1] * exposure * (1 - grain) + data[offset + 1] * scale * grain;
    const blue = tone[2] * exposure * (1 - grain) + data[offset + 2] * scale * grain;
    data[offset] = data[offset] * (1 - alpha) + clamp(red, 0, 255) * alpha;
    data[offset + 1] = data[offset + 1] * (1 - alpha) + clamp(green, 0, 255) * alpha;
    data[offset + 2] = data[offset + 2] * (1 - alpha) + clamp(blue, 0, 255) * alpha;
  }
}

function parseHex(hex: string) {
  const value = hex.replace("#", "");
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function loadImage(src: string) {
  const cached = imageCache.get(src);
  if (cached) return cached;
  const pending = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${src}`));
    image.src = src;
  });
  imageCache.set(src, pending);
  return pending;
}

async function loadMask(src: string, width: number, height: number) {
  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return new Uint8ClampedArray(width * height * 4);
  context.drawImage(image, 0, 0, width, height);
  return context.getImageData(0, 0, width, height).data;
}
