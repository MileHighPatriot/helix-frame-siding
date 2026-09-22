"use client";

import { CameraControls, CameraControlsImpl, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import type { ServiceSlug } from "@/lib/content-types";
import type { Selection } from "@/lib/scenes";
import { AdditionScene } from "./scene-addition";
import { DeckScene } from "./scene-deck";
import { FramingScene } from "./scene-framing";
import { OutdoorScene } from "./scene-outdoor";
import { RemodelScene } from "./scene-remodel";
import { SidingScene } from "./scene-siding";
import { stageViews, type StageApi } from "./views";

type Look = {
  sky: string;
  fov?: number;
  fog?: [number, number];
  interior?: boolean;
  azimuth: number;
  polar: [number, number];
  distance: [number, number];
};

const looks: Record<ServiceSlug, Look> = {
  siding: { sky: "#dce2e5", fog: [34, 80], azimuth: 1.35, polar: [0.25, 1.52], distance: [6, 30] },
  decking: { sky: "#dce2e5", fog: [30, 75], azimuth: 1.3, polar: [0.25, 1.5], distance: [3.5, 20] },
  "outdoor-structures": { sky: "#dce2e5", fog: [30, 75], azimuth: 1.3, polar: [0.3, 1.52], distance: [3, 20] },
  remodels: { sky: "#e8e4dc", fov: 52, interior: true, azimuth: 0.7, polar: [1.0, 1.72], distance: [1.2, 7.5] },
  additions: { sky: "#dce2e5", fog: [36, 85], azimuth: 1.35, polar: [0.25, 1.52], distance: [7, 32] },
  framing: { sky: "#dde2e4", fog: [30, 75], azimuth: 1.4, polar: [0.2, 1.5], distance: [3, 22] },
};

export default function StageCanvas({
  service,
  selection,
  viewId,
  interactive = true,
  apiRef,
  onReady,
}: {
  service: ServiceSlug;
  selection: Selection;
  viewId: string;
  interactive?: boolean;
  apiRef?: MutableRefObject<StageApi | null>;
  onReady?: () => void;
}) {
  const look = looks[service];
  const first = stageViews[service][0];
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 2]}
      frameloop="demand"
      camera={{ fov: look.fov ?? 34, near: 0.1, far: 220, position: first.position }}
      gl={{ antialias: true, toneMapping: THREE.NeutralToneMapping, toneMappingExposure: look.interior ? 0.92 : 1 }}
      onCreated={() => onReady?.()}
    >
      <color attach="background" args={[look.sky]} />
      {look.fog ? <fog attach="fog" args={[look.sky, look.fog[0], look.fog[1]]} /> : null}
      <Lights interior={look.interior} />
      <Environment resolution={128} frames={1}>
        <color attach="background" args={[look.interior ? "#efece6" : "#cdd8de"]} />
        <Lightformer form="rect" intensity={2.2} position={[0, 8, 4]} rotation={[-Math.PI / 2.4, 0, 0]} scale={[16, 6, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[-10, 3, 2]} rotation={[0, Math.PI / 2, 0]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={0.6} color="#ffe9cf" position={[10, 2, -2]} rotation={[0, -Math.PI / 2, 0]} scale={[10, 3, 1]} />
      </Environment>
      <Scene service={service} selection={selection} />
      <Controls service={service} viewId={viewId} interactive={interactive} apiRef={apiRef} look={look} />
    </Canvas>
  );
}

function Lights({ interior }: { interior?: boolean }) {
  if (interior) {
    return (
      <>
        <hemisphereLight args={["#ffffff", "#b8a58a", 0.95]} />
        <directionalLight
          position={[-7, 8, 6]}
          intensity={1.7}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-normalBias={0.02}
          shadow-camera-left={-9}
          shadow-camera-right={9}
          shadow-camera-top={9}
          shadow-camera-bottom={-9}
          shadow-camera-near={1}
          shadow-camera-far={30}
        />
        <pointLight position={[-0.6, 2.4, -4.4]} intensity={4} distance={6} color="#ffe2bd" />
      </>
    );
  }
  return (
    <>
      <hemisphereLight args={["#eaf0f4", "#7a735f", 0.95]} />
      <directionalLight
        position={[9, 13, 11]}
        intensity={2.4}
        color="#fff6ea"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.025}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-camera-near={1}
        shadow-camera-far={60}
      />
    </>
  );
}

function Scene({ service, selection }: { service: ServiceSlug; selection: Selection }) {
  if (service === "siding") return <SidingScene selection={selection} />;
  if (service === "decking") return <DeckScene selection={selection} />;
  if (service === "outdoor-structures") return <OutdoorScene selection={selection} />;
  if (service === "remodels") return <RemodelScene selection={selection} />;
  if (service === "additions") return <AdditionScene selection={selection} />;
  return <FramingScene selection={selection} />;
}

function Controls({
  service,
  viewId,
  interactive,
  apiRef,
  look,
}: {
  service: ServiceSlug;
  viewId: string;
  interactive: boolean;
  apiRef?: MutableRefObject<StageApi | null>;
  look: Look;
}) {
  const ref = useRef<CameraControlsImpl>(null);
  const invalidate = useThree((state) => state.invalidate);
  const placed = useRef(false);

  useEffect(() => {
    const controls = ref.current;
    if (!controls) return;
    controls.mouseButtons.wheel = CameraControlsImpl.ACTION.NONE;
    controls.mouseButtons.right = CameraControlsImpl.ACTION.NONE;
    controls.mouseButtons.middle = CameraControlsImpl.ACTION.NONE;
    controls.touches.two = CameraControlsImpl.ACTION.TOUCH_DOLLY;
    controls.touches.three = CameraControlsImpl.ACTION.NONE;
  }, []);

  useEffect(() => {
    const controls = ref.current;
    if (!controls) return;
    const view = stageViews[service].find((item) => item.id === viewId) ?? stageViews[service][0];
    const center = stageViews[service][0].target;
    const azimuthCenter = Math.atan2(stageViews[service][0].position[0] - center[0], stageViews[service][0].position[2] - center[2]);
    controls.minAzimuthAngle = azimuthCenter - look.azimuth;
    controls.maxAzimuthAngle = azimuthCenter + look.azimuth;
    controls.minPolarAngle = look.polar[0];
    controls.maxPolarAngle = look.polar[1];
    controls.minDistance = look.distance[0];
    controls.maxDistance = look.distance[1];
    void controls.setLookAt(...view.position, ...view.target, placed.current);
    placed.current = true;
    invalidate();
  }, [service, viewId, look, invalidate]);

  useEffect(() => {
    if (!apiRef) return;
    apiRef.current = {
      zoom: (amount: number) => {
        void ref.current?.dolly(amount, true);
        invalidate();
      },
      reset: () => {
        const view = stageViews[service].find((item) => item.id === viewId) ?? stageViews[service][0];
        void ref.current?.setLookAt(...view.position, ...view.target, true);
        invalidate();
      },
    };
    return () => {
      apiRef.current = null;
    };
  }, [apiRef, service, viewId, invalidate]);

  return (
    <CameraControls
      ref={ref}
      makeDefault
      enabled={interactive}
      truckSpeed={0}
      smoothTime={0.35}
      draggingSmoothTime={0.12}
      azimuthRotateSpeed={0.6}
      polarRotateSpeed={0.5}
    />
  );
}
