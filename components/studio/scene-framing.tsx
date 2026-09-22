"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { hex, type Selection } from "@/lib/scenes";
import { Boxes, Ground, ShapeMesh, Tree, outlineShape, useTexture, type Box, type Opening } from "./kit";

const FW = 7;
const FD = 6;
const X0 = -FW / 2;
const X1 = FW / 2;
const Z0 = -FD / 2;
const Z1 = FD / 2;
const STEM = 0.5;
const SILL = 0.038;
const PLY = 0.018;
const WH = 2.44;
const T = 0.038;
const D = 0.089;
const OC = 0.406;

const backWindow = { x0: -1.0, x1: 0.6, sill: 0.9, head: 2.1 };
const sideDoor = { z0: 0.2, z1: 1.1, head: 2.1 };
const open = { x0: 0.8, z0: 0.6 };

export function FramingScene({ selection }: { selection: Selection }) {
  const tone = hex(selection.tone);
  const ijoist = selection.floor === "ijoist";
  const sheathed = selection.sheathing === "sheathed";
  const lvl = selection.beam === "lvl";
  const grainH = useTexture("grainH");
  const grainV = useTexture("grainV");
  const osb = useTexture("osb");
  const joistH = ijoist ? 0.24 : 0.235;
  const floorY = STEM + SILL + joistH + PLY;

  const concrete = useMemo<Box[]>(
    () => [
      { p: [0, STEM / 2, Z0 + 0.1], s: [FW, STEM, 0.2] },
      { p: [0, STEM / 2, Z1 - 0.1], s: [FW, STEM, 0.2] },
      { p: [X0 + 0.1, STEM / 2, 0], s: [0.2, STEM, FD] },
      { p: [X1 - 0.1, STEM / 2, 0], s: [0.2, STEM, FD] },
    ],
    [],
  );

  const floor = useMemo(() => {
    const horizontal: Box[] = [];
    const along: Box[] = [];
    const webs: Box[] = [];
    const y0 = STEM + SILL;
    horizontal.push({ p: [0, STEM + SILL / 2, Z0 + 0.07], s: [FW, SILL, 0.14] });
    horizontal.push({ p: [0, STEM + SILL / 2, Z1 - 0.07], s: [FW, SILL, 0.14] });
    along.push({ p: [X0 + 0.07, STEM + SILL / 2, 0], s: [0.14, SILL, FD] });
    along.push({ p: [X1 - 0.07, STEM + SILL / 2, 0], s: [0.14, SILL, FD] });
    horizontal.push({ p: [0, y0 + joistH / 2, Z0 + T / 2], s: [FW, joistH, T] });
    for (let x = X0 + T / 2; x <= X1 - T / 2 + 0.001; x += OC) {
      const px = Math.min(x, X1 - T / 2);
      if (ijoist) {
        along.push({ p: [px, y0 + 0.019, 0], s: [0.063, 0.038, FD - 0.05] });
        along.push({ p: [px, y0 + joistH - 0.019, 0], s: [0.063, 0.038, FD - 0.05] });
        webs.push({ p: [px, y0 + joistH / 2, 0], s: [0.011, joistH - 0.07, FD - 0.05] });
      } else {
        along.push({ p: [px, y0 + joistH / 2, 0], s: [T, joistH, FD - 0.05] });
      }
    }
    const sheets: Box[] = [];
    const y = y0 + joistH + PLY / 2;
    for (let x = X0; x < X1 - 0.01; x += 2.44) {
      for (let z = Z0; z < Z1 - 0.01; z += 1.22) {
        const x1 = Math.min(x + 2.44, X1);
        const z1 = Math.min(z + 1.22, Z1);
        const cx = (x + x1) / 2;
        const cz = (z + z1) / 2;
        if (cx > open.x0 && cz > open.z0) continue;
        sheets.push({ p: [cx, y, cz], s: [x1 - x - 0.004, PLY, z1 - z - 0.004] });
      }
    }
    return { horizontal, along, webs, sheets };
  }, [ijoist, joistH]);

  const walls = useMemo(() => {
    const studs: Box[] = [];
    const plates: Box[] = [];
    const platesZ: Box[] = [];
    const y = floorY;
    const studH = WH - 3 * T;
    const zb = Z0 + D / 2;
    plates.push({ p: [0, y + T / 2, zb], s: [FW, T, D] });
    plates.push({ p: [0, y + WH - T * 1.5, zb], s: [FW, T, D] });
    plates.push({ p: [0, y + WH - T / 2, zb], s: [FW, T, D] });
    for (let x = X0 + T / 2; x <= X1 - T / 2 + 0.001; x += OC) {
      const px = Math.min(x, X1 - T / 2);
      if (px > backWindow.x0 - T && px < backWindow.x1 + T) {
        const below = backWindow.sill - T;
        studs.push({ p: [px, y + T + below / 2, zb], s: [T, below, D] });
        const aboveStart = backWindow.head + 0.235;
        const aboveH = WH - 2 * T - aboveStart;
        if (aboveH > 0.02) studs.push({ p: [px, y + aboveStart + aboveH / 2, zb], s: [T, aboveH, D] });
        continue;
      }
      studs.push({ p: [px, y + T + studH / 2, zb], s: [T, studH, D] });
    }
    for (const x of [backWindow.x0 - T / 2, backWindow.x1 + T / 2]) {
      studs.push({ p: [x, y + T + (backWindow.head - T) / 2, zb], s: [T, backWindow.head - T, D] });
      studs.push({ p: [x + (x < 0 ? -T : T), y + T + studH / 2, zb], s: [T, studH, D] });
    }
    plates.push({ p: [(backWindow.x0 + backWindow.x1) / 2, y + backWindow.head + 0.1175, zb], s: [backWindow.x1 - backWindow.x0 + 2 * T, 0.235, D] });
    plates.push({ p: [(backWindow.x0 + backWindow.x1) / 2, y + backWindow.sill - T / 2, zb], s: [backWindow.x1 - backWindow.x0, T, D] });

    const xs = X0 + D / 2;
    const zStart = Z0 + D;
    platesZ.push({ p: [xs, y + T / 2, (zStart + sideDoor.z0) / 2], s: [D, T, sideDoor.z0 - zStart] });
    platesZ.push({ p: [xs, y + T / 2, (sideDoor.z1 + Z1) / 2], s: [D, T, Z1 - sideDoor.z1] });
    platesZ.push({ p: [xs, y + WH - T * 1.5, (zStart + Z1) / 2], s: [D, T, Z1 - zStart] });
    platesZ.push({ p: [xs, y + WH - T / 2, (Z0 + Z1) / 2], s: [D, T, FD] });
    for (let z = zStart + T / 2; z <= Z1 - T / 2 + 0.001; z += OC) {
      const pz = Math.min(z, Z1 - T / 2);
      if (pz > sideDoor.z0 - T && pz < sideDoor.z1 + T) {
        const aboveStart = sideDoor.head + 0.235;
        const aboveH = WH - 2 * T - aboveStart;
        if (aboveH > 0.02) studs.push({ p: [xs, y + aboveStart + aboveH / 2, pz], s: [D, aboveH, T] });
        continue;
      }
      studs.push({ p: [xs, y + T + studH / 2, pz], s: [D, studH, T] });
    }
    for (const z of [sideDoor.z0 - T / 2, sideDoor.z1 + T / 2]) {
      studs.push({ p: [xs, y + T + (sideDoor.head - T) / 2, z], s: [D, sideDoor.head - T, T] });
      studs.push({ p: [xs, y + T + studH / 2, z + (z < 0.6 ? -T : T)], s: [D, studH, T] });
    }
    platesZ.push({ p: [xs, y + sideDoor.head + 0.1175, (sideDoor.z0 + sideDoor.z1) / 2], s: [D, 0.235, sideDoor.z1 - sideDoor.z0 + 2 * T] });
    return { studs, plates, platesZ };
  }, [floorY]);

  const structure = useMemo(() => {
    const beamPlies: Box[] = [];
    const posts: Box[] = [];
    const joists: Box[] = [];
    const beamTop = floorY + WH;
    const depth = 0.3;
    const zc = 0.2;
    const length = X1 - (X0 + D) - 0.1;
    const cx = (X0 + D + X1 - 0.1) / 2;
    if (lvl) {
      for (let i = -1; i <= 1; i += 1) beamPlies.push({ p: [cx, beamTop - depth / 2, zc + i * 0.0455], s: [length, depth, 0.044], tint: i * 0.015 + 0.03 });
    } else {
      beamPlies.push({ p: [cx, beamTop - depth / 2, zc], s: [length, depth, 0.14], tint: -0.07 });
    }
    for (const x of [0.2, X1 - 0.17]) posts.push({ p: [x, floorY + (WH - depth) / 2, zc], s: [0.14, WH - depth, 0.14] });
    for (let x = X0 + D + T / 2; x <= X1 - 0.12; x += OC) {
      joists.push({ p: [x, beamTop + 0.092, (Z0 + zc + 0.3) / 2], s: [T, 0.184, zc + 0.3 - Z0] });
    }
    return { beamPlies, posts, joists };
  }, [floorY, lvl]);

  const pile = useMemo<Box[]>(() => {
    const items: Box[] = [];
    for (let row = 0; row < 4; row += 1) {
      for (let i = 0; i < 6 - (row % 2); i += 1) items.push({ p: [5.4 + i * 0.1 + (row % 2) * 0.05, 0.13 + row * 0.042, 2.2], s: [0.089, 0.038, 3.6], tint: 0 });
    }
    items.push({ p: [5.65, 0.05, 1.0], s: [0.7, 0.1, 0.09] });
    items.push({ p: [5.65, 0.05, 3.4], s: [0.7, 0.1, 0.09] });
    return items;
  }, []);

  const backShape = useMemo(
    () =>
      outlineShape({ width: FW, height: WH }, [
        { x: (backWindow.x0 + backWindow.x1) / 2, y: backWindow.sill, w: backWindow.x1 - backWindow.x0, h: backWindow.head - backWindow.sill } satisfies Opening,
      ]),
    [],
  );
  const sideShape = useMemo(
    () =>
      outlineShape({ width: FD, height: WH }, [
        { x: -(sideDoor.z0 + sideDoor.z1) / 2, y: 0, w: sideDoor.z1 - sideDoor.z0, h: sideDoor.head } satisfies Opening,
      ]),
    [],
  );

  const lumber = { color: tone, jitter: 0.035, roughness: 0.82 };
  return (
    <group>
      <Ground kind="dirt" />
      <Boxes items={concrete} color="#bdb8ae" roughness={0.95} />
      <Boxes items={floor.horizontal} {...lumber} map={grainH} />
      <Boxes items={floor.along} {...lumber} map={grainH} seed={11} />
      <Boxes items={floor.webs} color="#ffffff" map={osb} roughness={0.9} />
      <Boxes items={floor.sheets} color="#ffffff" map={osb} roughness={0.9} jitter={0.02} />
      <Boxes items={walls.studs} {...lumber} map={grainV} seed={5} />
      <Boxes items={[...walls.plates, ...walls.platesZ]} {...lumber} map={grainH} seed={6} />
      <Boxes items={structure.beamPlies} {...lumber} jitter={0} map={grainH} roughness={lvl ? 0.7 : 0.8} />
      <Boxes items={structure.posts} {...lumber} map={grainV} />
      <Boxes items={structure.joists} {...lumber} map={grainH} seed={9} />
      <Boxes items={pile} {...lumber} map={grainH} seed={13} />
      {sheathed ? (
        <>
          <group position={[0, floorY, Z0 - 0.006]}>
            <ShapeMesh shape={backShape} color="#ffffff" map={osb} side={THREE.DoubleSide} />
          </group>
          <group position={[X0 - 0.006, floorY, 0]} rotation={[0, Math.PI / 2, 0]}>
            <ShapeMesh shape={sideShape} color="#ffffff" map={osb} side={THREE.DoubleSide} />
          </group>
        </>
      ) : null}
      <Tree position={[-8, 0, -6]} height={6.5} seed={3} />
      <Tree position={[7, 0, -7]} height={5.5} seed={4} />
    </group>
  );
}
