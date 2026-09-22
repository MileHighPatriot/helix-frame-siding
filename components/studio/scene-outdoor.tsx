"use client";

import { useMemo } from "react";
import { hex, type Selection } from "@/lib/scenes";
import { Block, Boxes, Glass, GableRoof, Ground, Plane, RoofSlab, Shrub, Tree, useTexture, type Box } from "./kit";

const WALL_Z = -3.2;

export function OutdoorScene({ selection }: { selection: Selection }) {
  const stain = hex(selection.stain);
  const roofing = selection.roof === "shingle" ? "shingle" : "metal";
  return (
    <group>
      <Ground />
      <Plane size={[7.4, 6.6]} position={[0, 0.008, 0.1]} rotation={[-Math.PI / 2, 0, 0]} texture="pavers" tile={0.6} />
      <Backdrop />
      {selection.structure === "pergola" ? <Pergola stain={stain} /> : null}
      {selection.structure === "pavilion" ? <Pavilion stain={stain} roofing={roofing} /> : null}
      {selection.structure === "attached" ? <Attached stain={stain} roofing={roofing} /> : null}
      <Shrub position={[-4.3, 0, -2.3]} scale={1.1} seed={2} />
      <Shrub position={[4.4, 0, -2.4]} scale={1.2} seed={3} />
      <Shrub position={[4.2, 0, 3.2]} scale={0.8} seed={4} />
      <Tree position={[-7.5, 0, 2.5]} height={5.5} seed={6} />
    </group>
  );
}

function Backdrop() {
  const trim = "#ece8df";
  const frames = useMemo<Box[]>(() => {
    const items: Box[] = [];
    const openings = [
      { x: -3.6, y: 0.9, w: 1.6, h: 1.4 },
      { x: 3.6, y: 0.9, w: 1.6, h: 1.4 },
      { x: 0.9, y: 0.02, w: 0.95, h: 2.15 },
    ];
    for (const o of openings) {
      items.push({ p: [o.x, o.y + o.h + 0.05, WALL_Z + 0.03], s: [o.w + 0.2, 0.1, 0.06] });
      items.push({ p: [o.x - o.w / 2 - 0.05, o.y + o.h / 2, WALL_Z + 0.03], s: [0.1, o.h, 0.06] });
      items.push({ p: [o.x + o.w / 2 + 0.05, o.y + o.h / 2, WALL_Z + 0.03], s: [0.1, o.h, 0.06] });
    }
    return items;
  }, []);
  return (
    <group>
      <Block size={[16, 3.2, 6]} position={[0, 1.6, WALL_Z - 3]} texture="brick" roughness={0.95} />
      {[-3.6, 3.6].map((x) => (
        <group key={x} position={[x, 0.9, WALL_Z + 0.012]}>
          <Glass w={1.6} h={1.4} />
        </group>
      ))}
      <mesh position={[0.9, 1.095, WALL_Z + 0.01]}>
        <planeGeometry args={[0.95, 2.15]} />
        <meshStandardMaterial color="#e9e5dc" roughness={0.5} />
      </mesh>
      <Boxes items={frames} color={trim} roughness={0.6} />
      <RoofSlab
        length={16.6}
        width={3}
        position={[0, 3.12 + Math.sin(0.45) * 1.5, WALL_Z + 0.45 - Math.cos(0.45) * 1.5]}
        rotation={[0.45, 0, 0]}
        roofing="shingle"
        underside={trim}
        edge={trim}
      />
    </group>
  );
}

function Timber({ items, stain, vertical = false }: { items: Box[]; stain: string; vertical?: boolean }) {
  const grainH = useTexture("grainH");
  const grainV = useTexture("grainV");
  return <Boxes items={items} color={stain} jitter={0.025} map={vertical ? grainV : grainH} roughness={0.78} />;
}

function Pergola({ stain }: { stain: string }) {
  const parts = useMemo(() => {
    const posts: Box[] = [];
    const beams: Box[] = [];
    const rafters: Box[] = [];
    const slats: Box[] = [];
    const px = 1.9;
    const pz = 1.55;
    const top = 2.6;
    for (const x of [-px, px]) for (const z of [-pz, pz]) posts.push({ p: [x, top / 2, z + 0.4], s: [0.15, top, 0.15] });
    for (const z of [-pz, pz]) {
      for (const side of [-1, 1]) beams.push({ p: [0, top - 0.12, z + 0.4 + side * 0.1], s: [5.0, 0.26, 0.05] });
    }
    for (let x = -2.3; x <= 2.31; x += 0.42) rafters.push({ p: [x, top + 0.1, 0.4], s: [0.05, 0.22, 4.3] });
    for (let z = -1.8; z <= 2.61; z += 0.26) slats.push({ p: [0, top + 0.235, z], s: [5.0, 0.05, 0.05] });
    return { posts, beams, rafters, slats };
  }, []);
  return (
    <group>
      <Timber items={parts.posts} stain={stain} vertical />
      <Timber items={parts.beams} stain={stain} />
      <Timber items={parts.rafters} stain={stain} />
      <Timber items={parts.slats} stain={stain} />
      <Bases points={parts.posts} />
    </group>
  );
}

function Pavilion({ stain, roofing }: { stain: string; roofing: "metal" | "shingle" }) {
  const parts = useMemo(() => {
    const posts: Box[] = [];
    const beams: Box[] = [];
    const px = 1.95;
    const pz = 1.5;
    const top = 2.45;
    for (const x of [-px, px]) for (const z of [-pz, pz]) posts.push({ p: [x, top / 2, z + 0.5], s: [0.17, top, 0.17] });
    for (const z of [-pz, pz]) beams.push({ p: [0, top + 0.13, z + 0.5], s: [4.3, 0.26, 0.17] });
    for (const x of [-px, px]) beams.push({ p: [x, top + 0.13, 0.5], s: [0.17, 0.26, 3.3] });
    return { posts, beams };
  }, []);
  return (
    <group>
      <Timber items={parts.posts} stain={stain} vertical />
      <Timber items={parts.beams} stain={stain} />
      <Bases points={parts.posts} />
      <group position={[0, 0, 0.5]} rotation={[0, Math.PI / 2, 0]}>
        <GableRoof
          width={3.3}
          depth={4.3}
          eave={2.71}
          peak={3.85}
          overhang={0.45}
          gableOverhang={0.35}
          roofing={roofing}
          trim={stain}
          underside={stain}
        />
        <Rafters width={3.3} depth={4.3} eave={2.71} peak={3.85} stain={stain} />
      </group>
    </group>
  );
}

function Rafters({ width, depth, eave, peak, stain }: { width: number; depth: number; eave: number; peak: number; stain: string }) {
  const items = useMemo(() => {
    const out: Box[] = [];
    const half = width / 2;
    const theta = Math.atan2(peak - eave, half);
    const length = half / Math.cos(theta);
    for (let z = -depth / 2; z <= depth / 2 + 0.01; z += depth / 6) {
      for (const sx of [-1, 1]) {
        out.push({
          p: [(sx * half) / 2, (eave + peak) / 2 - 0.1, z],
          s: [length, 0.18, 0.06],
          r: [0, 0, -sx * theta],
        });
      }
    }
    out.push({ p: [0, peak - 0.14, 0], s: [0.07, 0.22, depth + 0.2] });
    return out;
  }, [width, depth, eave, peak]);
  return <Timber items={items} stain={stain} />;
}

function Attached({ stain, roofing }: { stain: string; roofing: "metal" | "shingle" }) {
  const high = 2.95;
  const low = 2.45;
  const zFront = 1.9;
  const parts = useMemo(() => {
    const posts: Box[] = [];
    const beams: Box[] = [];
    const rafters: Box[] = [];
    for (const x of [-2.1, 2.1]) posts.push({ p: [x, low / 2, zFront], s: [0.17, low, 0.17] });
    beams.push({ p: [0, low + 0.13, zFront], s: [5.0, 0.26, 0.17] });
    beams.push({ p: [0, high - 0.13, WALL_Z + 0.09], s: [5.0, 0.26, 0.1] });
    const run = zFront - WALL_Z;
    const slope = Math.atan2(high - low, run);
    const length = Math.hypot(run, high - low) + 0.4;
    for (let x = -2.4; x <= 2.41; x += 0.6) {
      rafters.push({ p: [x, (high + low) / 2 + 0.12, (zFront + WALL_Z) / 2 + 0.15], s: [0.06, 0.18, length], r: [slope, 0, 0] });
    }
    return { posts, beams, rafters, slope, length };
  }, []);
  const slabLength = parts.length + 0.1;
  return (
    <group>
      <Timber items={parts.posts} stain={stain} vertical />
      <Timber items={parts.beams} stain={stain} />
      <Timber items={parts.rafters} stain={stain} />
      <Bases points={parts.posts} />
      <group rotation={[0, Math.PI / 2, 0]}>
        <RoofSlab
          length={slabLength}
          width={5.3}
          position={[-(WALL_Z + zFront + 0.3) / 2, (high + low) / 2 + 0.3, 0]}
          rotation={[0, 0, parts.slope]}
          roofing={roofing}
          underside={stain}
          edge={stain}
          ribs={roofing === "metal"}
        />
      </group>
    </group>
  );
}

function Bases({ points }: { points: Box[] }) {
  const items = useMemo(() => points.map((post) => ({ p: [post.p[0], 0.06, post.p[2]], s: [post.s[0] + 0.06, 0.12, post.s[2] + 0.06] }) as Box), [points]);
  return <Boxes items={items} color="#2a2b2d" roughness={0.4} metalness={0.6} />;
}
