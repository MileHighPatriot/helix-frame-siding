"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { hex, type Selection } from "@/lib/scenes";
import {
  Block,
  Boxes,
  Casing,
  Cladding,
  GableRoof,
  Glass,
  Ground,
  ShapeMesh,
  Shrub,
  Tree,
  WindowUnit,
  outlineShape,
  useTexture,
  type Box,
  type Opening,
  type Outline,
  type Profile,
} from "./kit";

const F = 0.45;
const HOUSE_W = 8.2;
const HOUSE_D = 8;
const HOUSE_H = 3.0;
const HOUSE_RISE = 2.25;
const AW = 4.6;
const AZ0 = -3.6;
const AZ1 = 3.0;
const AD = AZ1 - AZ0;
const HOUSE_WINDOWS: Opening[] = [
  { x: -2.2, y: F + 0.9, w: 1.2, h: 1.5 },
  { x: -6.0, y: F + 0.9, w: 1.2, h: 1.5 },
];

export function AdditionScene({ selection }: { selection: Selection }) {
  const two = selection.stories === "two";
  const color = hex(selection.color);
  const trim = hex(selection.trimColor);
  const profile = selection.design as Profile;
  const H = two ? 5.6 : 2.9;
  const rise = two ? 1.9 : 1.55;

  const frontOutline = useMemo<Outline>(() => ({ width: AW, height: H }), [H]);
  const sideOutline = useMemo<Outline>(() => ({ width: AD, height: H, peak: H + rise }), [H, rise]);
  const frontOpenings = useMemo<Opening[]>(
    () =>
      two
        ? [
            { x: 0, y: 0.85, w: 1.8, h: 1.45 },
            { x: -1, y: 3.65, w: 0.9, h: 1.25 },
            { x: 1, y: 3.65, w: 0.9, h: 1.25 },
          ]
        : [{ x: 0.1, y: 0.85, w: 1.8, h: 1.4 }],
    [two],
  );
  const sideOpenings = useMemo<Opening[]>(
    () =>
      two
        ? [
            { x: -1.5, y: 0.85, w: 1.2, h: 1.4 },
            { x: 1.5, y: 0.85, w: 1.2, h: 1.4 },
            { x: 0, y: 3.65, w: 1.2, h: 1.25 },
          ]
        : [{ x: 0, y: 0.85, w: 1.3, h: 1.4 }],
    [two],
  );

  const trimItems = useMemo<Box[]>(
    () => [
      { p: [AW + 0.015, F + H / 2, AZ1 + 0.015], s: [0.13, H, 0.13] },
      { p: [0.05, F + H / 2, AZ1 + 0.015], s: [0.1, H, 0.12] },
      { p: [AW + 0.015, F + H / 2, AZ0 - 0.015], s: [0.13, H, 0.13] },
      { p: [AW / 2, F + H - 0.11, AZ1 + 0.03], s: [AW, 0.22, 0.03] },
      { p: [AW / 2, F + 0.08, AZ1 + 0.03], s: [AW, 0.16, 0.03] },
      { p: [AW + 0.03, F + 0.08, (AZ0 + AZ1) / 2], s: [0.03, 0.16, AD] },
    ],
    [H],
  );

  return (
    <group>
      <Ground />
      <ExistingHouse />
      <Block size={[AW + 0.06, F, AD + 0.06]} position={[AW / 2, F / 2, (AZ0 + AZ1) / 2]} texture="concrete" tile={2} />
      <group position={[AW / 2, F, AZ1]}>
        <Cladding outline={frontOutline} openings={frontOpenings} profile={profile} color={color} />
        <Casing openings={frontOpenings} color={trim} />
        {frontOpenings.map((opening) => (
          <WindowUnit key={`${opening.x}-${opening.y}`} opening={opening} split={opening.w > 1.4 ? "grid" : "double"} />
        ))}
      </group>
      <group position={[AW, F, (AZ0 + AZ1) / 2]} rotation={[0, Math.PI / 2, 0]}>
        <Cladding outline={sideOutline} openings={sideOpenings} profile={profile} color={color} seed={6} />
        <Casing openings={sideOpenings} color={trim} />
        {sideOpenings.map((opening) => (
          <WindowUnit key={`${opening.x}-${opening.y}`} opening={opening} />
        ))}
      </group>
      <Boxes items={trimItems} color={trim} roughness={0.7} />
      <group position={[AW / 2 - 0.15, 0, (AZ0 + AZ1) / 2]} rotation={[0, Math.PI / 2, 0]}>
        <GableRoof width={AD} depth={AW + 0.3} eave={F + H} peak={F + H + rise} gableOverhang={0.3} trim={trim} />
      </group>
      <Shrub position={[1.2, 0, AZ1 + 0.7]} scale={0.9} seed={3} />
      <Shrub position={[AW + 0.8, 0, 1.8]} scale={1.1} seed={4} />
      <Shrub position={[-2.4, 0, HOUSE_D / 2 + 0.6]} scale={1} seed={5} />
      <Shrub position={[-6.2, 0, HOUSE_D / 2 + 0.7]} scale={1.2} seed={6} />
      <Tree position={[9, 0, -2]} height={6} seed={7} />
      <Tree position={[-11, 0, 5]} height={5.2} seed={8} />
    </group>
  );
}

function ExistingHouse() {
  const brick = useTexture("brick");
  const gable = useMemo(() => outlineShape({ width: HOUSE_D, height: 0, peak: HOUSE_RISE }, []), []);
  const trim = "#ece8df";
  const frames = useMemo<Box[]>(() => {
    const items: Box[] = [];
    for (const o of HOUSE_WINDOWS) {
      items.push({ p: [o.x, o.y + o.h + 0.05, HOUSE_D / 2 + 0.03], s: [o.w + 0.2, 0.1, 0.06] });
      items.push({ p: [o.x - o.w / 2 - 0.05, o.y + o.h / 2, HOUSE_D / 2 + 0.03], s: [0.1, o.h, 0.06] });
      items.push({ p: [o.x + o.w / 2 + 0.05, o.y + o.h / 2, HOUSE_D / 2 + 0.03], s: [0.1, o.h, 0.06] });
      items.push({ p: [o.x, o.y - 0.04, HOUSE_D / 2 + 0.05], s: [o.w + 0.3, 0.07, 0.1] });
      items.push({ p: [o.x, o.y + o.h / 2, HOUSE_D / 2 + 0.02], s: [0.04, o.h, 0.03] });
    }
    return items;
  }, []);
  return (
    <group>
      <Block size={[HOUSE_W, F + HOUSE_H, HOUSE_D]} position={[-HOUSE_W / 2, (F + HOUSE_H) / 2, 0]} texture="brick" roughness={0.95} />
      {[0, -HOUSE_W].map((x) => (
        <group key={x} position={[x, F + HOUSE_H, 0]} rotation={[0, x === 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <ShapeMesh shape={gable} color="#ffffff" map={brick} roughness={0.95} side={THREE.DoubleSide} />
        </group>
      ))}
      {HOUSE_WINDOWS.map((o) => (
        <group key={o.x} position={[o.x, o.y, HOUSE_D / 2 + 0.012]}>
          <Glass w={o.w} h={o.h} />
        </group>
      ))}
      <Boxes items={frames} color={trim} roughness={0.6} />
      <group position={[-HOUSE_W / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <GableRoof width={HOUSE_D} depth={HOUSE_W} eave={F + HOUSE_H} peak={F + HOUSE_H + HOUSE_RISE} trim={trim} />
      </group>
      <Block size={[0.75, 2.4, 0.75]} position={[-6.3, F + HOUSE_H + HOUSE_RISE, -1.4]} texture="brick" roughness={0.95} />
    </group>
  );
}
