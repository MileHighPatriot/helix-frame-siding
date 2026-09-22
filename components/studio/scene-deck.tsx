"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { hex, type Selection } from "@/lib/scenes";
import { Block, Boxes, Glass, Ground, RoofSlab, Shrub, Tree, useTexture, type Box } from "./kit";

const W = 6.4;
const DEPTH = 4.2;
const H = 0.95;
const STEPS = 5;
const RUN = 0.28;
const SIDE_Z = 1.25;
const STAIR_W = 1.5;

type Run = { a: [number, number]; b: [number, number] };

const boardLook: Record<string, { width: number; gap: number; jitter: number; roughness: number; grain: boolean }> = {
  cedar: { width: 0.14, gap: 0.005, jitter: 0.05, roughness: 0.82, grain: true },
  composite: { width: 0.14, gap: 0.006, jitter: 0.015, roughness: 0.72, grain: true },
  hardwood: { width: 0.09, gap: 0.005, jitter: 0.06, roughness: 0.55, grain: true },
};

export function DeckScene({ selection }: { selection: Selection }) {
  const boardColor = hex(selection.boardColor);
  const railColor = hex(selection.railColor);
  const fascia = hex(selection.fasciaColor);
  const look = boardLook[selection.board] ?? boardLook.composite;
  const grain = useTexture("grainH");
  const picture = selection.layout === "picture";
  const frontStairs = selection.stairs === "front";

  const boards = useMemo(() => {
    const field: Box[] = [];
    const border: Box[] = [];
    const t = 0.026;
    const y = H - t / 2;
    const step = look.width + look.gap;
    if (picture) {
      const b = look.width;
      border.push({ p: [0, y, DEPTH - b / 2 + 0.02], s: [W + 0.04, t, b] });
      border.push({ p: [0, y, b / 2], s: [W, t, b] });
      border.push({ p: [-W / 2 + b / 2 - 0.02, y, DEPTH / 2], s: [b, t, DEPTH - 2 * b - look.gap * 2] });
      border.push({ p: [W / 2 - b / 2 + 0.02, y, DEPTH / 2], s: [b, t, DEPTH - 2 * b - look.gap * 2] });
      const inner = W - 2 * b - look.gap * 2 + 0.04;
      for (let z = b + look.gap; z + look.width <= DEPTH - b - look.gap + 0.001; z += step) {
        field.push({ p: [0, y, z + look.width / 2], s: [inner, t, look.width] });
      }
    } else {
      for (let z = 0.01; z + look.width <= DEPTH + 0.03; z += step) {
        field.push({ p: [0, y, z + look.width / 2], s: [W + 0.04, t, look.width] });
      }
    }
    return { field, border };
  }, [picture, look]);

  const frame = useMemo(() => {
    const items: Box[] = [
      { p: [0, H - 0.16, DEPTH + 0.035], s: [W + 0.07, 0.28, 0.025] },
      { p: [-W / 2 - 0.035, H - 0.16, DEPTH / 2], s: [0.025, 0.28, DEPTH + 0.05] },
      { p: [W / 2 + 0.035, H - 0.16, DEPTH / 2], s: [0.025, 0.28, DEPTH + 0.05] },
    ];
    for (const x of [-2.95, -1.05, 1.05, 2.95]) {
      for (const z of [1.9, DEPTH - 0.25]) {
        items.push({ p: [x, (H - 0.3) / 2, z], s: [0.14, H - 0.3, 0.14] });
      }
    }
    return items;
  }, []);

  const runs = useMemo<Run[]>(() => {
    const inset = 0.05;
    const left: Run = { a: [-W / 2 + inset, 0.12], b: [-W / 2 + inset, DEPTH - inset] };
    const out: Run[] = [left];
    if (frontStairs) {
      out.push({ a: [-W / 2 + inset, DEPTH - inset], b: [-STAIR_W / 2 - 0.05, DEPTH - inset] });
      out.push({ a: [STAIR_W / 2 + 0.05, DEPTH - inset], b: [W / 2 - inset, DEPTH - inset] });
      out.push({ a: [W / 2 - inset, DEPTH - inset], b: [W / 2 - inset, 0.12] });
    } else {
      out.push({ a: [-W / 2 + inset, DEPTH - inset], b: [W / 2 - inset, DEPTH - inset] });
      out.push({ a: [W / 2 - inset, DEPTH - inset], b: [W / 2 - inset, SIDE_Z + STAIR_W / 2 + 0.05] });
      out.push({ a: [W / 2 - inset, SIDE_Z - STAIR_W / 2 - 0.05], b: [W / 2 - inset, 0.12] });
    }
    return out;
  }, [frontStairs]);

  return (
    <group>
      <Ground />
      <House />
      <Boxes
        items={boards.field}
        color={boardColor}
        jitter={look.jitter}
        roughness={look.roughness}
        map={look.grain ? grain : null}
        seed={3}
      />
      <Boxes
        items={boards.border}
        color={boardColor}
        jitter={look.jitter / 2}
        roughness={look.roughness}
        map={look.grain ? grain : null}
        seed={4}
      />
      <Boxes items={frame} color={fascia} roughness={0.7} />
      <mesh position={[0, (H - 0.3) / 2, DEPTH / 2]}>
        <boxGeometry args={[W - 0.1, H - 0.3, DEPTH - 0.1]} />
        <meshStandardMaterial color="#2b2a27" roughness={1} side={THREE.BackSide} />
      </mesh>
      {runs.map((run, index) => (
        <Railing key={index} run={run} kind={selection.rail} color={railColor} />
      ))}
      <group position={frontStairs ? [0, 0, DEPTH + 0.04] : [W / 2 + 0.04, 0, SIDE_Z]} rotation={frontStairs ? [0, 0, 0] : [0, Math.PI / 2, 0]}>
        <Stairs boardColor={boardColor} fascia={fascia} railColor={railColor} look={look} grain={look.grain ? grain : null} />
      </group>
      <Shrub position={[-4.2, 0, 1.2]} scale={1.2} seed={6} />
      <Shrub position={[-4.0, 0, 3.4]} scale={0.9} seed={7} />
      <Shrub position={[4.4, 0, 3.6]} scale={1} seed={8} />
      <Tree position={[-8, 0, -1.5]} height={6} seed={9} />
      <Tree position={[8.2, 0, 1.2]} height={5} seed={10} />
    </group>
  );
}

function House() {
  const trim = "#efebe3";
  const frames = useMemo<Box[]>(() => {
    const items: Box[] = [];
    const door = { x: 0, y: H, w: 2.4, h: 2.15 };
    const windows = [
      { x: -4.3, y: H + 0.85, w: 1.3, h: 1.35 },
      { x: 4.3, y: H + 0.85, w: 1.3, h: 1.35 },
    ];
    for (const o of [door, ...windows]) {
      items.push({ p: [o.x, o.y + o.h + 0.05, 0.03], s: [o.w + 0.2, 0.1, 0.06] });
      items.push({ p: [o.x - o.w / 2 - 0.05, o.y + o.h / 2, 0.03], s: [0.1, o.h, 0.06] });
      items.push({ p: [o.x + o.w / 2 + 0.05, o.y + o.h / 2, 0.03], s: [0.1, o.h, 0.06] });
      items.push({ p: [o.x, o.y - 0.03, 0.05], s: [o.w + 0.24, 0.06, 0.1] });
    }
    items.push({ p: [0, H + 1.075, 0.025], s: [0.05, 2.15, 0.05] });
    for (const x of [-4.3, 4.3]) items.push({ p: [x, H + 0.85 + 0.675, 0.025], s: [1.3, 0.05, 0.04] });
    return items;
  }, []);
  const a = 0.42;
  return (
    <group>
      <Block size={[13, 3.7, 7]} position={[0, 1.85, -3.5]} texture="brick" tile={1} roughness={0.95} />
      <group position={[0, H, 0.012]}>
        {[-0.6, 0.6].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <Glass w={1.15} h={2.1} />
          </group>
        ))}
      </group>
      {[-4.3, 4.3].map((x) => (
        <group key={x} position={[x, H + 0.85, 0.012]}>
          <Glass w={1.28} h={1.33} />
        </group>
      ))}
      <Boxes items={frames} color={trim} roughness={0.6} />
      <RoofSlab
        length={13.8}
        width={3.2}
        position={[0, 3.62 + Math.sin(a) * 1.6, 0.5 - Math.cos(a) * 1.6]}
        rotation={[a, 0, 0]}
        roofing="shingle"
        underside={trim}
        edge={trim}
      />
      <mesh position={[0, 3.58, 0.52]} castShadow>
        <boxGeometry args={[13.8, 0.2, 0.05]} />
        <meshStandardMaterial color={trim} roughness={0.6} />
      </mesh>
    </group>
  );
}

function Railing({ run, kind, color }: { run: Run; kind: string; color: string }) {
  const dx = run.b[0] - run.a[0];
  const dz = run.b[1] - run.a[1];
  const length = Math.hypot(dx, dz);
  const angle = Math.atan2(-dz, dx);
  const parts = useMemo(() => buildRail(length, kind), [length, kind]);
  return (
    <group position={[run.a[0], H, run.a[1]]} rotation={[0, angle, 0]}>
      <Boxes items={parts.frame} color={color} roughness={kind === "wood" ? 0.75 : 0.45} metalness={kind === "wood" ? 0 : 0.35} />
      <Boxes items={parts.cables} color="#c7cbcf" roughness={0.28} metalness={0.9} cast={false} />
      <Boxes items={parts.glass} color="#cfe1dd" roughness={0.05} transparent opacity={0.32} cast={false} envMapIntensity={1.4} />
    </group>
  );
}

function buildRail(length: number, kind: string) {
  const frame: Box[] = [];
  const cables: Box[] = [];
  const glass: Box[] = [];
  const post = kind === "wood" ? 0.09 : 0.065;
  const height = 0.92;
  const bays = Math.max(1, Math.ceil(length / 1.8));
  const bay = length / bays;
  for (let i = 0; i <= bays; i += 1) frame.push({ p: [i * bay, height / 2, 0], s: [post, height, post] });
  frame.push({ p: [length / 2, height + 0.02, 0], s: [length + post, 0.04, kind === "wood" ? 0.14 : 0.09] });
  for (let i = 0; i < bays; i += 1) {
    const x0 = i * bay + post / 2;
    const x1 = (i + 1) * bay - post / 2;
    const span = x1 - x0;
    const mid = (x0 + x1) / 2;
    if (kind === "cable") {
      for (let y = 0.1; y < height - 0.05; y += 0.078) cables.push({ p: [mid, y, 0], s: [span, 0.006, 0.006] });
    } else if (kind === "glass") {
      glass.push({ p: [mid, 0.47, 0], s: [span - 0.04, 0.74, 0.012] });
    } else {
      const baluster = kind === "wood" ? 0.038 : 0.016;
      const gap = kind === "wood" ? 0.13 : 0.11;
      frame.push({ p: [mid, 0.08, 0], s: [span, kind === "wood" ? 0.06 : 0.03, kind === "wood" ? 0.07 : 0.03] });
      frame.push({ p: [mid, height - 0.06, 0], s: [span, 0.04, kind === "wood" ? 0.06 : 0.03] });
      const count = Math.max(1, Math.floor(span / gap));
      const pitch = span / count;
      for (let j = 0; j < count; j += 1) {
        frame.push({ p: [x0 + pitch * (j + 0.5), (height - 0.02) / 2 + 0.04, 0], s: [baluster, height - 0.18, baluster] });
      }
    }
  }
  return { frame, cables, glass };
}

function Stairs({
  boardColor,
  fascia,
  railColor,
  look,
  grain,
}: {
  boardColor: string;
  fascia: string;
  railColor: string;
  look: { jitter: number; roughness: number };
  grain: THREE.Texture | null;
}) {
  const rise = H / STEPS;
  const parts = useMemo(() => {
    const treads: Box[] = [];
    const frame: Box[] = [];
    const rails: Box[] = [];
    for (let i = 1; i < STEPS; i += 1) {
      const y = H - i * rise;
      treads.push({ p: [0, y - 0.015, (i - 0.5) * RUN], s: [STAIR_W, 0.03, RUN + 0.02] });
    }
    for (let i = 1; i <= STEPS; i += 1) {
      const top = H - (i - 1) * rise - 0.03;
      const bottom = H - i * rise;
      frame.push({ p: [0, (top + bottom) / 2, (i - 1) * RUN + 0.01], s: [STAIR_W, top - bottom, 0.02] });
    }
    const runLength = STEPS * RUN;
    const slope = Math.atan2(H, runLength);
    const long = Math.hypot(H, runLength);
    for (const sx of [-1, 1]) {
      frame.push({ p: [sx * (STAIR_W / 2 + 0.02), H / 2 - 0.12, runLength / 2], s: [0.04, 0.28, long], r: [slope, 0, 0] });
      rails.push({ p: [sx * (STAIR_W / 2 + 0.03), 0.46, runLength - 0.1], s: [0.065, 0.92, 0.065] });
      rails.push({ p: [sx * (STAIR_W / 2 + 0.03), H / 2 + 0.92, (runLength - 0.1) / 2], s: [0.06, 0.04, Math.hypot(H, runLength - 0.1)], r: [slope, 0, 0] });
    }
    return { treads, frame, rails };
  }, [rise]);
  return (
    <group>
      <Boxes items={parts.treads} color={boardColor} jitter={look.jitter} roughness={look.roughness} map={grain} />
      <Boxes items={parts.frame} color={fascia} roughness={0.7} />
      <Boxes items={parts.rails} color={railColor} roughness={0.5} metalness={0.3} />
    </group>
  );
}
