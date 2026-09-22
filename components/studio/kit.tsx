"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type V3 = [number, number, number];
export type Box = { p: V3; s: V3; r?: V3; tint?: number };
export type Opening = { x: number; y: number; w: number; h: number };
export type Outline = { width: number; height: number; peak?: number };

export function rng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const scratch = new THREE.Object3D();
const scratchColor = new THREE.Color();

type Surface = {
  roughness?: number;
  metalness?: number;
  map?: THREE.Texture | null;
  envMapIntensity?: number;
  transparent?: boolean;
  opacity?: number;
};

export function Boxes({
  items,
  color,
  jitter = 0,
  seed = 7,
  cast = true,
  receive = true,
  roughness = 0.82,
  metalness = 0,
  map = null,
  envMapIntensity = 0.6,
  transparent = false,
  opacity = 1,
}: { items: Box[]; color: string; jitter?: number; seed?: number; cast?: boolean; receive?: boolean } & Surface) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const random = rng(seed);
    const base = new THREE.Color(color);
    items.forEach((item, index) => {
      scratch.position.set(item.p[0], item.p[1], item.p[2]);
      scratch.rotation.set(item.r?.[0] ?? 0, item.r?.[1] ?? 0, item.r?.[2] ?? 0);
      scratch.scale.set(item.s[0], item.s[1], item.s[2]);
      scratch.updateMatrix();
      mesh.setMatrixAt(index, scratch.matrix);
      scratchColor.copy(base);
      const shift = (item.tint ?? 0) + (jitter ? (random() - 0.5) * 2 * jitter : 0);
      if (shift) scratchColor.offsetHSL(0, 0, shift);
      mesh.setColorAt(index, scratchColor);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items, color, jitter, seed]);

  if (items.length === 0) return null;
  return (
    <instancedMesh
      key={items.length}
      ref={ref}
      args={[undefined, undefined, items.length]}
      castShadow={cast}
      receiveShadow={receive}
      frustumCulled={false}
    >
      <boxGeometry />
      <meshStandardMaterial
        color="#ffffff"
        roughness={roughness}
        metalness={metalness}
        map={map}
        envMapIntensity={envMapIntensity}
        transparent={transparent}
        opacity={opacity}
      />
    </instancedMesh>
  );
}

const textureCache = new Map<string, THREE.CanvasTexture>();

function paint(key: string, width: number, height: number, draw: (ctx: CanvasRenderingContext2D, random: () => number) => void) {
  const cached = textureCache.get(key);
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx, rng(key.length * 977 + width));
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  textureCache.set(key, texture);
  return texture;
}

function shade(value: number) {
  const v = Math.max(0, Math.min(255, Math.round(value)));
  return `rgb(${v},${v},${v})`;
}

const painters = {
  grainH: () =>
    paint("grainH", 512, 128, (ctx, random) => {
      ctx.fillStyle = shade(246);
      ctx.fillRect(0, 0, 512, 128);
      for (let i = 0; i < 46; i += 1) {
        const y = random() * 128;
        ctx.strokeStyle = `rgba(90,70,50,${0.05 + random() * 0.1})`;
        ctx.lineWidth = 0.6 + random() * 1.8;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= 512; x += 32) ctx.lineTo(x, y + Math.sin(x / (40 + random() * 30)) * 2.4);
        ctx.stroke();
      }
    }),
  grainV: () =>
    paint("grainV", 128, 512, (ctx, random) => {
      ctx.fillStyle = shade(246);
      ctx.fillRect(0, 0, 128, 512);
      for (let i = 0; i < 46; i += 1) {
        const x = random() * 128;
        ctx.strokeStyle = `rgba(90,70,50,${0.05 + random() * 0.1})`;
        ctx.lineWidth = 0.6 + random() * 1.8;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        for (let y = 0; y <= 512; y += 32) ctx.lineTo(x + Math.sin(y / (40 + random() * 30)) * 2.4, y);
        ctx.stroke();
      }
    }),
  brick: () =>
    paint("brick", 512, 512, (ctx, random) => {
      ctx.fillStyle = "#b3a896";
      ctx.fillRect(0, 0, 512, 512);
      const rows = 15;
      const h = 512 / rows;
      for (let row = 0; row < rows; row += 1) {
        const offset = row % 2 ? 51 : 0;
        for (let col = -1; col < 6; col += 1) {
          const x = col * 102 + offset;
          const r = 132 + random() * 38;
          const g = 64 + random() * 20;
          const b = 48 + random() * 14;
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x + 3, row * h + 3, 96, h - 5);
          ctx.fillStyle = "rgba(0,0,0,0.08)";
          ctx.fillRect(x + 3, row * h + h - 6, 96, 3);
        }
      }
    }),
  shingle: () =>
    paint("shingle", 512, 512, (ctx, random) => {
      ctx.fillStyle = "#3f4245";
      ctx.fillRect(0, 0, 512, 512);
      const rows = 7;
      const h = 512 / rows;
      for (let row = 0; row < rows; row += 1) {
        let x = -random() * 80;
        while (x < 512) {
          const w = 60 + random() * 90;
          const v = 52 + random() * 26;
          ctx.fillStyle = `rgb(${v},${v + 2},${v + 5})`;
          ctx.fillRect(x + 2, row * h, w - 3, h - 4);
          for (let i = 0; i < 40; i += 1) {
            ctx.fillStyle = `rgba(255,255,255,${random() * 0.06})`;
            ctx.fillRect(x + random() * w, row * h + random() * h, 2, 2);
          }
          x += w;
        }
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(0, row * h + h - 5, 512, 4);
      }
    }),
  osb: () =>
    paint("osb", 512, 512, (ctx, random) => {
      ctx.fillStyle = "#c79f66";
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 900; i += 1) {
        const tone = random();
        ctx.fillStyle = tone > 0.66 ? "rgba(150,105,55,0.55)" : tone > 0.33 ? "rgba(222,186,128,0.6)" : "rgba(176,132,78,0.5)";
        ctx.save();
        ctx.translate(random() * 512, random() * 512);
        ctx.rotate(random() * Math.PI);
        ctx.fillRect(-18, -4, 26 + random() * 30, 5 + random() * 6);
        ctx.restore();
      }
    }),
  planks: () =>
    paint("planks", 512, 512, (ctx, random) => {
      ctx.fillStyle = shade(236);
      ctx.fillRect(0, 0, 512, 512);
      const cols = 5;
      const w = 512 / cols;
      for (let col = 0; col < cols; col += 1) {
        let y = -random() * 300;
        while (y < 512) {
          const len = 260 + random() * 260;
          ctx.fillStyle = shade(222 + random() * 30);
          ctx.fillRect(col * w + 1, y + 1, w - 2, len - 2);
          for (let i = 0; i < 10; i += 1) {
            ctx.strokeStyle = `rgba(80,60,40,${0.04 + random() * 0.06})`;
            ctx.lineWidth = 1;
            const gx = col * w + 6 + random() * (w - 12);
            ctx.beginPath();
            ctx.moveTo(gx, y);
            ctx.lineTo(gx + (random() - 0.5) * 6, y + len);
            ctx.stroke();
          }
          ctx.fillStyle = "rgba(60,45,30,0.35)";
          ctx.fillRect(col * w, y + len - 1, w, 2);
          y += len;
        }
        ctx.fillStyle = "rgba(60,45,30,0.4)";
        ctx.fillRect(col * w, 0, 1.5, 512);
      }
    }),
  pavers: () =>
    paint("pavers", 512, 512, (ctx, random) => {
      ctx.fillStyle = "#8d877d";
      ctx.fillRect(0, 0, 512, 512);
      const size = 128;
      for (let y = 0; y < 4; y += 1) {
        for (let x = 0; x < 4; x += 1) {
          const v = 180 + random() * 30;
          ctx.fillStyle = `rgb(${v},${v - 6},${v - 16})`;
          ctx.fillRect(x * size + 3, y * size + 3, size - 6, size - 6);
          for (let i = 0; i < 120; i += 1) {
            ctx.fillStyle = `rgba(0,0,0,${random() * 0.05})`;
            ctx.fillRect(x * size + random() * size, y * size + random() * size, 3, 3);
          }
        }
      }
    }),
  grass: () =>
    paint("grass", 256, 256, (ctx, random) => {
      ctx.fillStyle = "#7d8c58";
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 5000; i += 1) {
        const g = 110 + random() * 60;
        ctx.fillStyle = `rgba(${g - 30},${g},${g - 60},0.35)`;
        ctx.fillRect(random() * 256, random() * 256, 1.5, 3);
      }
    }),
  dirt: () =>
    paint("dirt", 256, 256, (ctx, random) => {
      ctx.fillStyle = "#8b735a";
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 4000; i += 1) {
        const v = random();
        ctx.fillStyle = v > 0.5 ? "rgba(70,55,40,0.3)" : "rgba(170,150,125,0.3)";
        ctx.fillRect(random() * 256, random() * 256, 2 + random() * 3, 2 + random() * 3);
      }
    }),
  concrete: () =>
    paint("concrete", 256, 256, (ctx, random) => {
      ctx.fillStyle = "#b9b5ad";
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 3000; i += 1) {
        ctx.fillStyle = `rgba(0,0,0,${random() * 0.06})`;
        ctx.fillRect(random() * 256, random() * 256, 2, 2);
      }
    }),
};

export type TextureKind = keyof typeof painters;

export function useTexture(kind: TextureKind, repeatX = 1, repeatY = 1) {
  return useMemo(() => {
    const texture = painters[kind]().clone();
    texture.repeat.set(repeatX, repeatY);
    texture.needsUpdate = true;
    return texture;
  }, [kind, repeatX, repeatY]);
}

export function Plane({
  size,
  position,
  rotation,
  color = "#ffffff",
  texture,
  tile = 1,
  roughness = 0.9,
  receive = true,
  cast = false,
}: {
  size: [number, number];
  position: V3;
  rotation?: V3;
  color?: string;
  texture?: TextureKind;
  tile?: number;
  roughness?: number;
  receive?: boolean;
  cast?: boolean;
}) {
  const map = useTexture(texture ?? "concrete", size[0] / tile, size[1] / tile);
  return (
    <mesh position={position} rotation={rotation} receiveShadow={receive} castShadow={cast}>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} map={texture ? map : null} roughness={roughness} />
    </mesh>
  );
}

export function Block({
  size,
  position,
  rotation,
  color = "#ffffff",
  texture,
  tile = 1,
  roughness = 0.85,
  metalness = 0,
}: {
  size: V3;
  position: V3;
  rotation?: V3;
  color?: string;
  texture?: TextureKind;
  tile?: number;
  roughness?: number;
  metalness?: number;
}) {
  const map = useTexture(texture ?? "concrete", size[0] / tile, size[1] / tile);
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} map={texture ? map : null} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

function halfWidthAt(outline: Outline, y: number) {
  const half = outline.width / 2;
  if (!outline.peak || y <= outline.height) return half;
  return Math.max(0, half * (1 - (y - outline.height) / (outline.peak - outline.height)));
}

export function topAt(outline: Outline, x: number) {
  if (!outline.peak) return outline.height;
  const half = outline.width / 2;
  return outline.height + (outline.peak - outline.height) * (1 - Math.min(1, Math.abs(x) / half));
}

function subtract(spans: [number, number][], cut: [number, number]) {
  const out: [number, number][] = [];
  for (const [a, b] of spans) {
    if (cut[1] <= a || cut[0] >= b) {
      out.push([a, b]);
      continue;
    }
    if (cut[0] > a) out.push([a, cut[0]]);
    if (cut[1] < b) out.push([cut[1], b]);
  }
  return out;
}

export function rowSpans(outline: Outline, openings: Opening[], y0: number, y1: number) {
  const half = halfWidthAt(outline, (y0 + y1) / 2);
  let spans: [number, number][] = [[-half, half]];
  for (const o of openings) {
    if (o.y >= y1 || o.y + o.h <= y0) continue;
    spans = subtract(spans, [o.x - o.w / 2, o.x + o.w / 2]);
  }
  return spans.filter(([a, b]) => b - a > 0.02);
}

export function columnSpans(outline: Outline, openings: Opening[], x0: number, x1: number, yMin: number, yMax: number) {
  const top = Math.min(yMax, topAt(outline, (x0 + x1) / 2) - 0.01);
  if (top <= yMin) return [];
  let spans: [number, number][] = [[yMin, top]];
  for (const o of openings) {
    if (o.x + o.w / 2 <= x0 || o.x - o.w / 2 >= x1) continue;
    spans = subtract(spans, [o.y, o.y + o.h]);
  }
  return spans.filter(([a, b]) => b - a > 0.02);
}

export function outlineShape(outline: Outline, openings: Opening[], yMin = 0, yMax = Infinity) {
  const top = Math.min(yMax, outline.peak ?? outline.height);
  const shape = new THREE.Shape();
  shape.moveTo(-halfWidthAt(outline, yMin), yMin);
  shape.lineTo(halfWidthAt(outline, yMin), yMin);
  if (outline.peak && yMin < outline.height && top > outline.height) shape.lineTo(outline.width / 2, outline.height);
  if (outline.peak && top >= outline.peak - 0.001) {
    shape.lineTo(0, outline.peak);
  } else {
    shape.lineTo(halfWidthAt(outline, top), top);
    shape.lineTo(-halfWidthAt(outline, top), top);
  }
  if (outline.peak && yMin < outline.height && top > outline.height) shape.lineTo(-outline.width / 2, outline.height);
  shape.closePath();
  for (const o of openings) {
    if (o.y >= top || o.y + o.h <= yMin) continue;
    const hole = new THREE.Path();
    const y0 = Math.max(o.y, yMin);
    const y1 = Math.min(o.y + o.h, top);
    hole.moveTo(o.x - o.w / 2, y0);
    hole.lineTo(o.x - o.w / 2, y1);
    hole.lineTo(o.x + o.w / 2, y1);
    hole.lineTo(o.x + o.w / 2, y0);
    hole.closePath();
    shape.holes.push(hole);
  }
  return shape;
}

export function ShapeMesh({
  shape,
  color,
  z = 0,
  map = null,
  roughness = 0.88,
  side = THREE.FrontSide,
}: {
  shape: THREE.Shape;
  color: string;
  z?: number;
  map?: THREE.Texture | null;
  roughness?: number;
  side?: THREE.Side;
}) {
  const geometry = useMemo(() => new THREE.ShapeGeometry(shape), [shape]);
  return (
    <mesh geometry={geometry} position={[0, 0, z]} receiveShadow castShadow>
      <meshStandardMaterial color={color} map={map} roughness={roughness} side={side} />
    </mesh>
  );
}

export type Profile = "lap" | "panel" | "batten" | "shake";

export function Cladding({
  outline,
  openings = [],
  profile,
  color,
  wood = false,
  yMin = 0,
  yMax = Infinity,
  exposure,
  seed = 3,
}: {
  outline: Outline;
  openings?: Opening[];
  profile: Profile;
  color: string;
  wood?: boolean;
  yMin?: number;
  yMax?: number;
  exposure?: number;
  seed?: number;
}) {
  const grainH = useTexture("grainH");
  const grainV = useTexture("grainV");
  const shape = useMemo(() => outlineShape(outline, openings, yMin, yMax), [outline, openings, yMin, yMax]);
  const top = Math.min(yMax, outline.peak ?? outline.height);

  const lapExposure = exposure ?? (wood ? 0.115 : 0.178);

  const lines = useMemo(() => {
    const items: Box[] = [];
    if (profile !== "lap") return items;
    for (let y = yMin + lapExposure; y < top - 0.02; y += lapExposure) {
      for (const [a, b] of rowSpans(outline, openings, y - 0.02, y)) {
        items.push({ p: [(a + b) / 2, y - 0.014, 0.0195], s: [b - a, 0.011, 0.002] });
      }
    }
    return items;
  }, [profile, outline, openings, yMin, top, lapExposure]);

  const boards = useMemo(() => {
    const items: Box[] = [];
    const random = rng(seed);
    if (profile === "lap") {
      for (let y = yMin; y < top - 0.02; y += lapExposure) {
        for (const [a, b] of rowSpans(outline, openings, y, Math.min(y + lapExposure, top))) {
          items.push({ p: [(a + b) / 2, y + lapExposure / 2, 0.016], s: [b - a, lapExposure + 0.018, 0.013], r: [-0.07, 0, 0] });
        }
      }
    } else if (profile === "shake") {
      const e = exposure ?? 0.14;
      for (let y = yMin; y < top - 0.02; y += e) {
        for (const [a, b] of rowSpans(outline, openings, y, Math.min(y + e, top))) {
          let x = a - random() * 0.12;
          while (x < b) {
            const w = 0.11 + random() * 0.15;
            const x0 = Math.max(a, x);
            const x1 = Math.min(b, x + w);
            if (x1 - x0 > 0.03) {
              items.push({
                p: [(x0 + x1) / 2, y + e / 2 - 0.01, 0.017],
                s: [x1 - x0 - 0.006, e + 0.03, 0.014],
                r: [-0.09, 0, 0],
                tint: (random() - 0.5) * 0.05,
              });
            }
            x += w;
          }
        }
      }
    } else if (profile === "batten") {
      const spacing = wood ? 0.26 : 0.406;
      const half = outline.width / 2;
      for (let x = -half + spacing / 2; x < half; x += spacing) {
        for (const [a, b] of columnSpans(outline, openings, x - 0.03, x + 0.03, yMin, top)) {
          items.push({ p: [x, (a + b) / 2, 0.014], s: [wood ? 0.045 : 0.06, b - a, 0.022] });
        }
      }
    }
    return items;
  }, [profile, outline, openings, yMin, top, wood, exposure, seed, lapExposure]);

  const joints = useMemo(() => {
    if (profile !== "panel") return [];
    const items: Box[] = [];
    const spacing = wood ? 0.15 : 1.22;
    const half = outline.width / 2;
    for (let x = -half + spacing; x < half - 0.05; x += spacing) {
      for (const [a, b] of columnSpans(outline, openings, x - 0.004, x + 0.004, yMin, top)) {
        items.push({ p: [x, (a + b) / 2, 0.003], s: [wood ? 0.006 : 0.01, b - a, 0.004] });
      }
    }
    if (!wood) {
      for (let y = yMin + 2.44; y < top - 0.1; y += 2.44) {
        for (const [a, b] of rowSpans(outline, openings, y - 0.005, y + 0.005)) {
          items.push({ p: [(a + b) / 2, y, 0.003], s: [b - a, 0.01, 0.004] });
        }
      }
    }
    return items;
  }, [profile, outline, openings, yMin, top, wood]);

  const backer = useMemo(() => {
    const base = new THREE.Color(color);
    if (profile === "lap" || profile === "shake") base.offsetHSL(0, 0, -0.12);
    return `#${base.getHexString()}`;
  }, [color, profile]);

  const grained = wood || profile === "shake";
  return (
    <group>
      <ShapeMesh shape={shape} color={backer} map={grained && profile !== "lap" ? grainV : null} />
      <Boxes
        items={boards}
        color={color}
        jitter={grained ? 0.02 : 0.004}
        map={grained ? (profile === "batten" ? grainV : grainH) : null}
        roughness={wood ? 0.78 : 0.86}
      />
      <Boxes items={joints} color={shiftColor(color, -0.14)} cast={false} />
      <Boxes items={lines} color={shiftColor(color, -0.2)} cast={false} receive={false} />
    </group>
  );
}

export function shiftColor(color: string, amount: number) {
  const c = new THREE.Color(color);
  c.offsetHSL(0, 0, amount);
  return `#${c.getHexString()}`;
}

export const glassMaterial = {
  color: "#5d6f7a",
  roughness: 0.06,
  metalness: 0.2,
  envMapIntensity: 1.6,
};

export function Glass({ w, h, z = 0, tint = glassMaterial.color }: { w: number; h: number; z?: number; tint?: string }) {
  return (
    <mesh position={[0, h / 2, z]}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial
        color={tint}
        roughness={glassMaterial.roughness}
        metalness={glassMaterial.metalness}
        envMapIntensity={glassMaterial.envMapIntensity}
      />
    </mesh>
  );
}

export function Casing({ openings, color, width = 0.1, depth = 0.028, sill = true }: { openings: Opening[]; color: string; width?: number; depth?: number; sill?: boolean }) {
  const items = useMemo(() => {
    const out: Box[] = [];
    for (const o of openings) {
      const z = 0.03;
      out.push({ p: [o.x, o.y + o.h + width / 2, z], s: [o.w + width * 2 + 0.04, width, depth] });
      out.push({ p: [o.x - o.w / 2 - width / 2, o.y + o.h / 2, z], s: [width, o.h, depth] });
      out.push({ p: [o.x + o.w / 2 + width / 2, o.y + o.h / 2, z], s: [width, o.h, depth] });
      if (sill && o.y > 0.05) out.push({ p: [o.x, o.y - 0.03, z + 0.02], s: [o.w + width * 2 + 0.08, 0.05, depth + 0.05] });
    }
    return out;
  }, [openings, width, depth, sill]);
  return <Boxes items={items} color={color} roughness={0.7} />;
}

export function WindowUnit({ opening, frame = "#2a2c2e", split = "double" }: { opening: Opening; frame?: string; split?: "double" | "grid" | "single" }) {
  const { x, y, w, h } = opening;
  const bars = useMemo(() => {
    const t = 0.055;
    const items: Box[] = [
      { p: [0, h - t / 2, 0], s: [w, t, 0.06] },
      { p: [0, t / 2, 0], s: [w, t, 0.06] },
      { p: [-w / 2 + t / 2, h / 2, 0], s: [t, h, 0.06] },
      { p: [w / 2 - t / 2, h / 2, 0], s: [t, h, 0.06] },
    ];
    if (split !== "single") items.push({ p: [0, h / 2, 0.01], s: [w, t * 0.8, 0.05] });
    if (split === "grid") items.push({ p: [0, h / 2, 0.012], s: [0.025, h, 0.03] });
    return items;
  }, [w, h, split]);
  return (
    <group position={[x, y, -0.04]}>
      <mesh position={[0, h / 2, -0.12]}>
        <boxGeometry args={[w, h, 0.2]} />
        <meshStandardMaterial color="#20262b" roughness={1} side={THREE.BackSide} />
      </mesh>
      <Glass w={w} h={h} z={-0.005} />
      <Boxes items={bars} color={frame} roughness={0.5} />
    </group>
  );
}

export function DoorUnit({ opening, color, lite = true }: { opening: Opening; color: string; lite?: boolean }) {
  const { x, y, w, h } = opening;
  const panels = useMemo(() => {
    const items: Box[] = [
      { p: [0, h * 0.27, 0.012], s: [w * 0.62, h * 0.34, 0.012], tint: 0.03 },
    ];
    if (!lite) items.push({ p: [0, h * 0.7, 0.012], s: [w * 0.62, h * 0.36, 0.012], tint: 0.03 });
    return items;
  }, [w, h, lite]);
  return (
    <group position={[x, y, -0.03]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, 0.045]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
      <Boxes items={panels} color={color} roughness={0.45} />
      {lite ? (
        <group position={[0, h * 0.52, 0.026]}>
          <Glass w={w * 0.56} h={h * 0.36} />
        </group>
      ) : null}
      <mesh position={[w / 2 - 0.1, h * 0.47, 0.05]} castShadow>
        <boxGeometry args={[0.025, 0.2, 0.03]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  );
}

export function RoofSlab({
  length,
  width,
  position,
  rotation,
  roofing,
  underside,
  edge,
  ribs,
  ribColor,
}: {
  length: number;
  width: number;
  position: V3;
  rotation: V3;
  roofing: "shingle" | "metal";
  underside: string;
  edge: string;
  ribs?: boolean;
  ribColor?: string;
}) {
  const shingles = useTexture("shingle", length / 1.1, width / 1.1);
  const thickness = 0.14;
  const metal = roofing === "metal";
  const ribItems = useMemo(() => {
    if (!ribs) return [];
    const items: Box[] = [];
    for (let z = -width / 2 + 0.2; z < width / 2; z += 0.45) items.push({ p: [0, thickness / 2 + 0.02, z], s: [length, 0.035, 0.022] });
    return items;
  }, [ribs, length, width]);
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[length, thickness, width]} />
        <meshStandardMaterial attach="material-0" color={edge} roughness={0.7} />
        <meshStandardMaterial attach="material-1" color={edge} roughness={0.7} />
        <meshStandardMaterial
          attach="material-2"
          color={metal ? (ribColor ?? "#3a3e42") : "#ffffff"}
          map={metal ? null : shingles}
          roughness={metal ? 0.42 : 0.95}
          metalness={metal ? 0.55 : 0}
        />
        <meshStandardMaterial attach="material-3" color={underside} roughness={0.8} />
        <meshStandardMaterial attach="material-4" color={edge} roughness={0.7} />
        <meshStandardMaterial attach="material-5" color={edge} roughness={0.7} />
      </mesh>
      <Boxes items={ribItems} color={ribColor ?? "#3a3e42"} roughness={0.4} metalness={0.55} />
    </group>
  );
}

export function GableRoof({
  width,
  depth,
  eave,
  peak,
  overhang = 0.4,
  gableOverhang = 0.3,
  roofing = "shingle",
  trim,
  underside,
  ribColor,
}: {
  width: number;
  depth: number;
  eave: number;
  peak: number;
  overhang?: number;
  gableOverhang?: number;
  roofing?: "shingle" | "metal";
  trim: string;
  underside?: string;
  ribColor?: string;
}) {
  const half = width / 2;
  const rise = peak - eave;
  const theta = Math.atan2(rise, half);
  const run = half + overhang;
  const length = run / Math.cos(theta);
  const thickness = 0.14;
  const span = depth + gableOverhang * 2;
  const cx = run / 2;
  const cy = peak - (run / 2) * Math.tan(theta);
  const nx = Math.sin(theta) * (thickness / 2);
  const ny = Math.cos(theta) * (thickness / 2);
  const low = eave - overhang * Math.tan(theta);
  const trimItems = useMemo<Box[]>(
    () => [
      { p: [run + 0.02, low + 0.03, 0], s: [0.04, 0.22, span + 0.04] },
      { p: [-run - 0.02, low + 0.03, 0], s: [0.04, 0.22, span + 0.04] },
      { p: [half + overhang / 2, low - 0.07, 0], s: [overhang, 0.02, depth + gableOverhang * 2] },
      { p: [-half - overhang / 2, low - 0.07, 0], s: [overhang, 0.02, depth + gableOverhang * 2] },
      { p: [cx - nx * 0.3, cy + ny * 0.2, span / 2 + 0.02], s: [length, 0.24, 0.04], r: [0, 0, -theta] },
      { p: [-cx + nx * 0.3, cy + ny * 0.2, span / 2 + 0.02], s: [length, 0.24, 0.04], r: [0, 0, theta] },
      { p: [cx - nx * 0.3, cy + ny * 0.2, -span / 2 - 0.02], s: [length, 0.24, 0.04], r: [0, 0, -theta] },
      { p: [-cx + nx * 0.3, cy + ny * 0.2, -span / 2 - 0.02], s: [length, 0.24, 0.04], r: [0, 0, theta] },
    ],
    [run, low, span, half, overhang, depth, gableOverhang, cx, cy, nx, ny, length, theta],
  );
  const cap = roofing === "metal" ? (ribColor ?? "#3a3e42") : "#3c3f42";
  return (
    <group>
      <RoofSlab
        length={length}
        width={span}
        position={[cx + nx, cy + ny, 0]}
        rotation={[0, 0, -theta]}
        roofing={roofing}
        underside={underside ?? trim}
        edge={trim}
        ribs={roofing === "metal"}
        ribColor={ribColor}
      />
      <RoofSlab
        length={length}
        width={span}
        position={[-cx - nx, cy + ny, 0]}
        rotation={[0, 0, theta]}
        roofing={roofing}
        underside={underside ?? trim}
        edge={trim}
        ribs={roofing === "metal"}
        ribColor={ribColor}
      />
      <mesh position={[0, peak + thickness / Math.cos(theta) - 0.02, 0]} castShadow>
        <boxGeometry args={[0.26, 0.07, span + 0.02]} />
        <meshStandardMaterial color={cap} roughness={0.8} metalness={roofing === "metal" ? 0.5 : 0} />
      </mesh>
      <Boxes items={trimItems} color={trim} roughness={0.7} />
    </group>
  );
}

export function Shrub({ position, scale = 1, seed = 1 }: { position: V3; scale?: number; seed?: number }) {
  const blobs = useMemo(() => {
    const random = rng(seed * 131);
    return Array.from({ length: 5 }, () => ({
      p: [(random() - 0.5) * 0.5 * scale, (0.28 + random() * 0.22) * scale, (random() - 0.5) * 0.4 * scale] as V3,
      r: (0.26 + random() * 0.14) * scale,
      c: random() > 0.5 ? "#5b6b45" : "#66764d",
    }));
  }, [scale, seed]);
  return (
    <group position={position}>
      {blobs.map((blob, index) => (
        <mesh key={index} position={blob.p} castShadow receiveShadow>
          <icosahedronGeometry args={[blob.r, 2]} />
          <meshStandardMaterial color={blob.c} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function Tree({ position, height = 4.2, seed = 2 }: { position: V3; height?: number; seed?: number }) {
  const blobs = useMemo(() => {
    const random = rng(seed * 71);
    return Array.from({ length: 7 }, () => ({
      p: [(random() - 0.5) * 1.6, height * (0.62 + random() * 0.3), (random() - 0.5) * 1.4] as V3,
      r: 0.7 + random() * 0.45,
      c: random() > 0.5 ? "#6a7a4c" : "#5a6b40",
    }));
  }, [height, seed]);
  return (
    <group position={position}>
      <mesh position={[0, height * 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.14, height * 0.7, 8]} />
        <meshStandardMaterial color="#5a4636" roughness={1} />
      </mesh>
      {blobs.map((blob, index) => (
        <mesh key={index} position={blob.p} castShadow receiveShadow>
          <icosahedronGeometry args={[blob.r, 2]} />
          <meshStandardMaterial color={blob.c} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function Ground({ kind = "grass", size = 80 }: { kind?: "grass" | "dirt" | "concrete"; size?: number }) {
  return <Plane size={[size, size]} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} texture={kind} tile={3} />;
}
