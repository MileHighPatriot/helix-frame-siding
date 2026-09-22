"use client";

import dynamic from "next/dynamic";
import { Component, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Minus, Move3d, Plus, RotateCcw } from "lucide-react";
import { stageViews, type StageApi } from "@/components/studio/views";
import type { ServiceSlug } from "@/lib/content-types";
import type { Selection } from "@/lib/scenes";
import { cn } from "cn";

const StageCanvas = dynamic(() => import("@/components/studio/stage-canvas"), { ssr: false });

let webglSupport: boolean | undefined;
function detectWebGL() {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noop = () => () => {};

class StageBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function DesignStage({
  service,
  selection,
  interactive = true,
  controls = true,
  className,
}: {
  service: ServiceSlug;
  selection: Selection;
  interactive?: boolean;
  controls?: boolean;
  className?: string;
}) {
  const webgl = useSyncExternalStore(noop, detectWebGL, () => undefined);
  const views = stageViews[service];
  const [viewId, setViewId] = useState(views[0].id);
  const [ready, setReady] = useState(false);
  const apiRef = useRef<StageApi | null>(null);
  const fallback = <StageFallback />;

  return (
    <div className={cn("relative isolate overflow-hidden bg-[#dce2e5] [&_canvas]:touch-pan-y!", className)}>
      {webgl === false ? (
        fallback
      ) : webgl ? (
        <StageBoundary fallback={fallback}>
          <div className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
            <StageCanvas
              service={service}
              selection={selection}
              viewId={viewId}
              interactive={interactive}
              apiRef={apiRef}
              onReady={() => setReady(true)}
            />
          </div>
        </StageBoundary>
      ) : null}

      {webgl !== false && !ready ? (
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-neutral-700 uppercase backdrop-blur">
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            Building the model
          </div>
        </div>
      ) : null}

      {controls && webgl !== false ? (
        <>
          {interactive ? (
            <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 font-mono text-[10.5px] tracking-[0.12em] text-neutral-700 uppercase shadow-sm backdrop-blur">
              <Move3d className="size-3.5" aria-hidden />
              Drag to turn
            </div>
          ) : null}
          <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
            <div role="group" aria-label="Camera view" className="flex rounded-full bg-white/85 p-1 shadow-sm backdrop-blur">
              {views.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  aria-pressed={viewId === view.id}
                  onClick={() => {
                    if (viewId === view.id) apiRef.current?.reset();
                    setViewId(view.id);
                  }}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors",
                    viewId === view.id ? "bg-neutral-900 text-white" : "hover:bg-black/5",
                  )}
                >
                  {view.label}
                </button>
              ))}
            </div>
            {interactive ? (
              <div className="flex rounded-full bg-white/85 p-1 shadow-sm backdrop-blur">
                <StageButton label="Zoom in" onClick={() => apiRef.current?.zoom(1.6)}>
                  <Plus className="size-4" />
                </StageButton>
                <StageButton label="Zoom out" onClick={() => apiRef.current?.zoom(-1.6)}>
                  <Minus className="size-4" />
                </StageButton>
                <StageButton label="Reset view" onClick={() => apiRef.current?.reset()}>
                  <RotateCcw className="size-3.5" />
                </StageButton>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}

function StageButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-full text-neutral-700 transition-colors hover:bg-black/5"
    >
      {children}
    </button>
  );
}

function StageFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center p-6 text-center">
      <div className="max-w-sm">
        <p className="font-mono text-[11px] tracking-[0.14em] text-neutral-600 uppercase">3D preview unavailable</p>
        <p className="mt-2 text-sm text-neutral-700">
          This browser could not start the 3D model. Every option and the written spec still work, and they go into the estimate the same way.
        </p>
      </div>
    </div>
  );
}
