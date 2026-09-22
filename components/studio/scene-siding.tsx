"use client";

import { useMemo } from "react";
import { hex, type Selection } from "@/lib/scenes";
import {
  Block,
  Boxes,
  Casing,
  Cladding,
  DoorUnit,
  GableRoof,
  Ground,
  Plane,
  Shrub,
  Tree,
  WindowUnit,
  type Box,
  type Opening,
  type Outline,
  type Profile,
} from "./kit";

const W = 8.4;
const D = 9;
const F = 0.45;
const H = 2.9;
const RISE = 2.35;

const front: Outline = { width: W, height: H, peak: H + RISE };
const side: Outline = { width: D, height: H };

const frontOpenings: Opening[] = [
  { x: -2.2, y: 0.85, w: 1.8, h: 1.45 },
  { x: 1.5, y: 0, w: 1.0, h: 2.15 },
  { x: 3.05, y: 0.85, w: 0.7, h: 1.45 },
  { x: 0, y: 3.35, w: 0.95, h: 0.95 },
];
const sideOpenings: Opening[] = [
  { x: -2.2, y: 0.85, w: 1.3, h: 1.4 },
  { x: 2.2, y: 0.85, w: 1.3, h: 1.4 },
];

export function SidingScene({ selection }: { selection: Selection }) {
  const field = hex(selection.fieldColor);
  const gable = hex(selection.gableColor);
  const trim = hex(selection.trimColor);
  const door = hex(selection.doorColor);
  const wood = selection.material === "wood";
  const profile = selection.field as Profile;
  const distinct = selection.gable === "distinct";
  const windows = frontOpenings.filter((_, index) => index !== 1);
  const doorOpening = frontOpenings[1];

  const trimItems = useMemo<Box[]>(() => {
    const items: Box[] = [];
    const corner = 0.13;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        items.push({ p: [sx * (W / 2 + 0.015), F + H / 2, sz * (D / 2 + 0.015)], s: [corner, H, corner] });
      }
      items.push({ p: [sx * (W / 2 + 0.03), F + H - 0.11, 0], s: [0.03, 0.22, D] });
      items.push({ p: [sx * (W / 2 + 0.03), F + 0.08, 0], s: [0.03, 0.16, D] });
    }
    if (distinct) items.push({ p: [0, F + H + 0.06, D / 2 + 0.035], s: [W, 0.14, 0.035] });
    return items;
  }, [distinct]);

  return (
    <group>
      <Ground />
      <Plane size={[1.2, 9]} position={[1.5, 0.006, D / 2 + 5.4]} rotation={[-Math.PI / 2, 0, 0]} texture="concrete" tile={2} />
      <Block size={[W + 0.06, F, D + 0.06]} position={[0, F / 2, 0]} texture="concrete" tile={2} />
      <Block size={[1.7, F - 0.02, 1.0]} position={[1.5, (F - 0.02) / 2, D / 2 + 0.52]} texture="concrete" tile={2} />

      <group position={[0, F, D / 2]}>
        <Cladding
          outline={front}
          openings={frontOpenings}
          profile={profile}
          color={field}
          wood={wood}
          yMax={distinct ? H : Infinity}
        />
        {distinct ? (
          <Cladding outline={front} openings={frontOpenings} profile="shake" color={gable} yMin={H + 0.13} seed={11} />
        ) : null}
        <Casing openings={frontOpenings} color={trim} />
        {windows.map((opening) => (
          <WindowUnit key={`${opening.x}-${opening.y}`} opening={opening} split={opening.w > 1.2 ? "grid" : "double"} />
        ))}
        <DoorUnit opening={doorOpening} color={door} />
      </group>

      {[1, -1].map((sx) => (
        <group key={sx} position={[sx * (W / 2), F, 0]} rotation={[0, (sx * Math.PI) / 2, 0]}>
          <Cladding outline={side} openings={sideOpenings} profile={profile} color={field} wood={wood} seed={5} />
          <Casing openings={sideOpenings} color={trim} />
          {sideOpenings.map((opening) => (
            <WindowUnit key={opening.x} opening={opening} />
          ))}
        </group>
      ))}

      <group position={[0, F, -D / 2]} rotation={[0, Math.PI, 0]}>
        <Cladding outline={front} profile={profile} color={field} wood={wood} seed={9} />
      </group>

      <Boxes items={trimItems} color={trim} roughness={0.7} />
      <GableRoof width={W} depth={D} eave={F + H} peak={F + H + RISE} trim={trim} />

      <Shrub position={[-3.4, 0, D / 2 + 0.75]} scale={1.1} seed={1} />
      <Shrub position={[-1.1, 0, D / 2 + 0.7]} scale={0.9} seed={2} />
      <Shrub position={[3.7, 0, D / 2 + 0.7]} scale={1} seed={3} />
      <Tree position={[-7.2, 0, 6.5]} height={5.2} seed={4} />
      <Tree position={[8.5, 0, -3]} height={6} seed={5} />
    </group>
  );
}
