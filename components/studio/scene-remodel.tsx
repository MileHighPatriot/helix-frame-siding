"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { hex, type Selection } from "@/lib/scenes";
import { Boxes, Plane, useTexture, type Box } from "./kit";

const CEIL = 2.75;
const WALL_Z = -2;
const OPEN_L = -2.5;
const OPEN_R = 1.9;
const STAIR_X0 = 2.65;
const STAIR_X1 = 3.85;
const RISERS = 14;
const TREAD = 0.25;
const STAIR_TOP_Z = WALL_Z;

const wall = "#e9e5dd";

export function RemodelScene({ selection }: { selection: Selection }) {
  const finish = hex(selection.color);
  const floor = hex(selection.floor);
  const stained = selection.finish === "stained";
  const dropped = selection.beam === "dropped";
  const woodRail = selection.stair === "wood";
  const grainH = useTexture("grainH");
  const grainV = useTexture("grainV");
  const planks = useTexture("planks", 10 / 1.8, 14 / 1.8);

  const shell = useMemo(() => {
    const items: Box[] = [];
    items.push({ p: [-4, CEIL / 2, -1.5], s: [0.12, CEIL, 10] });
    items.push({ p: [4, CEIL / 2, -1.5], s: [0.12, CEIL, 10] });
    items.push({ p: [0, CEIL / 2, -6.5], s: [8, CEIL, 0.12] });
    items.push({ p: [(-4 + OPEN_L) / 2, CEIL / 2, WALL_Z], s: [OPEN_L + 4, CEIL, 0.14] });
    items.push({ p: [(OPEN_R + 4) / 2, CEIL / 2, WALL_Z], s: [4 - OPEN_R, CEIL, 0.14] });
    if (dropped) items.push({ p: [(OPEN_L + OPEN_R) / 2, CEIL - 0.02, WALL_Z], s: [OPEN_R - OPEN_L, 0.04, 0.14] });
    items.push({ p: [-0.35, CEIL + 0.06, -4.3], s: [7.3, 0.12, 4.4] });
    items.push({ p: [-0.65, CEIL + 0.06, 1.4], s: [6.7, 0.12, 6.8] });
    items.push({ p: [3.35, CEIL + 0.06, 3.3], s: [1.3, 0.12, 3.8] });
    items.push({ p: [-3.25, 0.05, -1.5], s: [0.04, 0.1, 9.8] });
    return items;
  }, [dropped]);

  const beam = useMemo<Box[]>(() => {
    if (dropped) return [{ p: [(OPEN_L + OPEN_R) / 2 + 0.0, CEIL - 0.19, WALL_Z], s: [OPEN_R - OPEN_L + 0.02, 0.34, 0.3] }];
    return [{ p: [0, CEIL - 0.006, WALL_Z], s: [8, 0.014, 0.34] }];
  }, [dropped]);

  const stair = useMemo(() => {
    const rise = CEIL / RISERS;
    const treads: Box[] = [];
    const risers: Box[] = [];
    const rail: Box[] = [];
    const balusters: Box[] = [];
    const width = STAIR_X1 - STAIR_X0;
    const cx = (STAIR_X0 + STAIR_X1) / 2;
    const bottomZ = STAIR_TOP_Z + (RISERS - 1) * TREAD;
    const run = (RISERS - 1) * TREAD;
    const slope = Math.atan2(CEIL - rise, run);
    const length = Math.hypot(CEIL - rise, run);
    const handH = 0.9;
    const railY = (z: number) => rise + ((bottomZ - z) * (CEIL - rise)) / run + handH;
    for (let i = 0; i < RISERS - 1; i += 1) {
      const y = rise * (i + 1);
      const z = bottomZ - i * TREAD;
      treads.push({ p: [cx, y - 0.018, z - TREAD / 2 + 0.01], s: [width, 0.036, TREAD + 0.03] });
      risers.push({ p: [cx, y - rise / 2 - 0.018, z + 0.005], s: [width - 0.01, rise, 0.02] });
    }
    risers.push({
      p: [STAIR_X0 - 0.02, (rise + CEIL) / 2 - 0.25, (bottomZ + STAIR_TOP_Z) / 2],
      s: [0.04, 0.3, length + 0.3],
      r: [slope, 0, 0],
    });
    const railX = STAIR_X0 + 0.05;
    rail.push({ p: [railX, (rise + handH + 0.1) / 2, bottomZ + 0.04], s: [0.09, rise + handH + 0.1, 0.09] });
    rail.push({
      p: [railX, (rise + CEIL) / 2 + handH, (bottomZ + STAIR_TOP_Z) / 2],
      s: [woodRail ? 0.065 : 0.05, woodRail ? 0.06 : 0.035, length],
      r: [slope, 0, 0],
    });
    for (let i = 0; i < RISERS - 1; i += 1) {
      const y = rise * (i + 1);
      const z = bottomZ - i * TREAD;
      for (const k of [0.3, 0.75]) {
        const bz = z - TREAD * k;
        const top = railY(bz) - 0.03;
        balusters.push({
          p: [railX, (y + top) / 2, bz],
          s: [woodRail ? 0.035 : 0.014, top - y, woodRail ? 0.035 : 0.014],
        });
      }
    }
    return { treads, risers, rail, balusters };
  }, [woodRail]);

  const kitchen = useMemo(() => {
    const cabinets: Box[] = [
      { p: [-0.8, 0.45, -6.15], s: [4.2, 0.9, 0.6] },
      { p: [-0.8, 2.05, -6.25], s: [1.2, 0.7, 0.36] },
    ];
    const counter: Box[] = [{ p: [-0.8, 0.92, -6.13], s: [4.26, 0.04, 0.64] }];
    const pantry: Box[] = [{ p: [2.3, 1.15, -6.15], s: [1.3, 2.3, 0.62] }];
    const island: Box[] = [
      { p: [-0.6, 0.45, -4.4], s: [2.4, 0.9, 0.95] },
    ];
    const islandTop: Box[] = [{ p: [-0.6, 0.92, -4.4], s: [2.5, 0.04, 1.02] }];
    return { cabinets, counter, pantry, island, islandTop };
  }, []);

  const railColor = woodRail ? finish : "#1d1e20";
  return (
    <group>
      <mesh position={[0, 0, -1.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 14]} />
        <meshStandardMaterial color={floor} map={planks} roughness={0.55} />
      </mesh>
      <Boxes items={shell} color={wall} roughness={0.95} cast={false} />
      <mesh position={[3.35, CEIL + 1.3, -0.3]}>
        <boxGeometry args={[1.3, 2.6, 3.4]} />
        <meshStandardMaterial color={wall} roughness={0.95} side={THREE.BackSide} />
      </mesh>
      <Boxes items={beam} color={finish} map={stained ? grainH : null} roughness={stained ? 0.7 : 0.85} />
      <Boxes items={stair.treads} color={floor} map={grainH} roughness={0.55} jitter={0.02} />
      <Boxes items={stair.risers} color={wall} roughness={0.9} />
      <Boxes
        items={stair.rail}
        color={railColor}
        map={woodRail && stained ? grainH : null}
        roughness={woodRail ? 0.6 : 0.4}
        metalness={woodRail ? 0 : 0.5}
      />
      <Boxes
        items={stair.balusters}
        color={railColor}
        map={woodRail && stained ? grainV : null}
        roughness={woodRail ? 0.6 : 0.4}
        metalness={woodRail ? 0 : 0.5}
      />
      <Boxes items={kitchen.cabinets} color="#ece9e2" roughness={0.6} />
      <Boxes items={kitchen.island} color="#39413f" roughness={0.6} />
      <Boxes items={[...kitchen.counter, ...kitchen.islandTop]} color="#e6e1d8" roughness={0.25} />
      <Boxes items={kitchen.pantry} color="#c6a377" map={grainV} roughness={0.6} />
      <Daylight position={[-0.8, 1.7, -6.42]} size={[1.6, 1.0]} />
      <Daylight position={[-3.93, 1.45, 0.4]} size={[1.8, 1.6]} rotation={[0, Math.PI / 2, 0]} />
      <Pendant position={[-1.1, 2.1, -4.4]} />
      <Pendant position={[-0.1, 2.1, -4.4]} />
      <Plane size={[0.9, 0.012]} position={[-0.8, 1.12, -6.4]} color="#d9d3c8" />
    </group>
  );
}

function Daylight({ position, size, rotation }: { position: [number, number, number]; size: [number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial color="#f3f6f7" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[size[0] + 0.12, size[1] + 0.12, 0.02]} />
        <meshStandardMaterial color="#f7f5f0" roughness={0.6} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function Pendant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.66]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh castShadow>
        <coneGeometry args={[0.13, 0.16, 24, 1, true]} />
        <meshStandardMaterial color="#1b1b1b" roughness={0.4} metalness={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
