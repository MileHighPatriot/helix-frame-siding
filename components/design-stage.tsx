"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { mediaSrc } from "@/components/photo";
import type { DesignOption, SceneWash } from "@/lib/scenes";
import { cn } from "cn";

export function DesignStage({ design, alt }: { design: DesignOption; alt: string }) {
  const [base, ...overlays] = design.layers;
  const baseWashes = design.washes.filter((item) => item.slot === "base");
  const topWashes = design.washes.filter((item) => item.slot === "top");

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-graphite">
      <FadingImage src={base.src} alt={alt} />
      {baseWashes.map((item) => (
        <Wash key={`${item.mask}-${item.slot}`} wash={item} />
      ))}
      {overlays.map((layer) => (
        <FadingImage key={layer.mask} src={layer.src} alt="" mask={layer.mask} />
      ))}
      {topWashes.map((item) => (
        <Wash key={`${item.mask}-${item.slot}`} wash={item} />
      ))}
    </div>
  );
}

function FadingImage({ src, alt, mask }: { src: string; alt: string; mask?: string }) {
  const [front, setFront] = useState(src);
  const [back, setBack] = useState<string | null>(null);
  if (src !== front) {
    setBack(front);
    setFront(src);
  }

  useEffect(() => {
    if (!back) return;
    const timer = window.setTimeout(() => setBack(null), 480);
    return () => window.clearTimeout(timer);
  }, [back]);

  const style = maskStyle(mask);
  return (
    <>
      {back ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mediaSrc(back)} alt="" className="absolute inset-0 h-full w-full object-cover" style={style} />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mediaSrc(front)}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full object-cover", back && "scene-plate is-swap")}
        style={style}
      />
    </>
  );
}

function Wash({ wash }: { wash: SceneWash }) {
  const url = `url("${mediaSrc(wash.mask)}")`;
  return (
    <div
      className="scene-wash pointer-events-none absolute inset-0"
      style={{
        backgroundColor: wash.hex,
        opacity: wash.strength,
        mixBlendMode: "multiply",
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

function maskStyle(mask?: string): CSSProperties | undefined {
  if (!mask) return undefined;
  const url = `url("${mediaSrc(mask)}")`;
  return {
    WebkitMaskImage: url,
    maskImage: url,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };
}
