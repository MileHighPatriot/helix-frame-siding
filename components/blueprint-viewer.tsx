"use client";

import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlueprintKind } from "@/lib/content";
import { cn } from "cn";

const layers = [
  { id: "framing", label: "Framing" },
  { id: "dimensions", label: "Dimensions" },
  { id: "notes", label: "Notes" },
] as const;

type LayerId = (typeof layers)[number]["id"];

export function BlueprintViewer({
  kind,
  title,
  notes,
}: {
  kind: BlueprintKind;
  title: string;
  notes: string[];
}) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState<Record<LayerId, boolean>>({
    framing: true,
    dimensions: true,
    notes: true,
  });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    setOffset({
      x: drag.current.ox + event.clientX - drag.current.x,
      y: drag.current.oy + event.clientY - drag.current.y,
    });
  }

  function onPointerUp() {
    drag.current = null;
  }

  function zoom(delta: number) {
    setScale((current) => Math.min(2.4, Math.max(0.7, Number((current + delta).toFixed(2)))));
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#0d1116]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <p className="text-sm text-muted-foreground">Drag to pan. Toggle layers.</p>
        <div className="flex flex-wrap items-center gap-2">
          {layers.map((layer) => (
            <button
              key={layer.id}
              type="button"
              aria-pressed={active[layer.id]}
              onClick={() => setActive((current) => ({ ...current, [layer.id]: !current[layer.id] }))}
              className={cn(
                "rounded-full border px-3 py-1 text-xs tracking-wide uppercase",
                active[layer.id] ? "border-copper text-copper" : "border-border text-muted-foreground"
              )}
            >
              {layer.label}
            </button>
          ))}
          <Button type="button" variant="outline" size="icon" aria-label="Zoom out" onClick={() => zoom(-0.15)}>
            <Minus />
          </Button>
          <Button type="button" variant="outline" size="icon" aria-label="Zoom in" onClick={() => zoom(0.15)}>
            <Plus />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Reset view"
            onClick={() => {
              setScale(1);
              setOffset({ x: 0, y: 0 });
            }}
          >
            <RotateCcw />
          </Button>
        </div>
      </div>
      <div
        className="relative h-[28rem] cursor-grab touch-none overflow-hidden active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={(event) => {
          event.preventDefault();
          zoom(event.deltaY < 0 ? 0.08 : -0.08);
        }}
      >
        <svg
          viewBox="0 0 800 520"
          className="h-full w-full"
          role="img"
          aria-label={title}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "center",
          }}
        >
          <rect width="800" height="520" fill="#10151b" />
          <rect x="28" y="24" width="744" height="472" fill="none" stroke="#f3efe6" strokeOpacity="0.35" />
          <text x="44" y="48" fill="#c6a36a" fontSize="12" letterSpacing="2">
            HELIX FRAME & SIDING
          </text>
          <text x="560" y="48" fill="#f3efe6" fontSize="12">
            {title}
          </text>
          {kind === "floor" && <FloorDrawing show={active} />}
          {kind === "wall" && <WallDrawing show={active} />}
          {kind === "deck" && <DeckDrawing show={active} />}
          {kind === "section" && <SectionDrawing show={active} />}
          {active.notes && (
            <g>
              {notes.map((note, index) => (
                <text key={note} x="48" y={430 + index * 18} fill="#e08a45" fontSize="11">
                  {index + 1}. {note}
                </text>
              ))}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

function FloorDrawing({ show }: { show: Record<LayerId, boolean> }) {
  return (
    <g>
      <rect x="140" y="110" width="520" height="250" fill="none" stroke="#f3efe6" strokeWidth="2" />
      <line x1="140" y1="230" x2="420" y2="230" stroke="#f3efe6" strokeWidth="1.5" />
      <rect x="430" y="150" width="140" height="90" fill="none" stroke="#f3efe6" strokeDasharray="5 4" />
      {show.framing &&
        Array.from({ length: 12 }, (_, index) => (
          <line
            key={index}
            x1={160 + index * 28}
            y1="120"
            x2={160 + index * 28}
            y2="220"
            stroke="#c6a36a"
            strokeWidth="1.2"
          />
        ))}
      {show.framing && <line x1="150" y1="250" x2="500" y2="250" stroke="#e08a45" strokeWidth="4" />}
      {show.dimensions && (
        <g fill="#9fd0c8" fontSize="12">
          <text x="300" y="100">
            32 ft new plate
          </text>
          <text x="150" y="380">
            Joists east-west at 16 in
          </text>
          <line x1="140" y1="90" x2="660" y2="90" stroke="#9fd0c8" strokeWidth="1" />
        </g>
      )}
    </g>
  );
}

function WallDrawing({ show }: { show: Record<LayerId, boolean> }) {
  return (
    <g>
      <rect x="180" y="80" width="70" height="320" fill="none" stroke="#f3efe6" strokeWidth="2" />
      {show.framing && (
        <g>
          <rect x="190" y="90" width="18" height="300" fill="#c6a36a" opacity="0.85" />
          <rect x="214" y="90" width="10" height="300" fill="#8d7348" />
          <rect x="230" y="90" width="8" height="300" fill="#e08a45" />
        </g>
      )}
      {Array.from({ length: 10 }, (_, index) => (
        <line
          key={index}
          x1="250"
          y1={110 + index * 26}
          x2="430"
          y2={110 + index * 26}
          stroke="#f3efe6"
          strokeWidth="2"
        />
      ))}
      {show.dimensions && (
        <g fill="#9fd0c8" fontSize="12">
          <text x="450" y="160">
            6 in reveal
          </text>
          <text x="450" y="210">
            3/8 in cavity
          </text>
          <text x="450" y="260">
            Studs at 16 in
          </text>
        </g>
      )}
    </g>
  );
}

function DeckDrawing({ show }: { show: Record<LayerId, boolean> }) {
  return (
    <g>
      <rect x="120" y="120" width="500" height="240" fill="none" stroke="#f3efe6" strokeWidth="2" />
      {show.framing &&
        Array.from({ length: 14 }, (_, index) => (
          <line
            key={index}
            x1={145 + index * 32}
            y1="135"
            x2={145 + index * 32}
            y2="345"
            stroke="#c6a36a"
            strokeWidth="1.4"
          />
        ))}
      {show.framing && <line x1="130" y1="250" x2="610" y2="250" stroke="#e08a45" strokeWidth="5" />}
      {show.framing && (
        <g>
          <rect x="180" y="360" width="16" height="36" fill="#e08a45" />
          <rect x="520" y="360" width="16" height="36" fill="#e08a45" />
        </g>
      )}
      {show.dimensions && (
        <g fill="#9fd0c8" fontSize="12">
          <text x="280" y="108">
            18 ft by 12 ft
          </text>
          <text x="140" y="430">
            Ledger is lateral only
          </text>
        </g>
      )}
    </g>
  );
}

function SectionDrawing({ show }: { show: Record<LayerId, boolean> }) {
  return (
    <g>
      <path d="M80 300 H320 V180 H470 V300 H700" fill="none" stroke="#f3efe6" strokeWidth="2" />
      <path d="M80 180 L200 90 L320 180" fill="none" stroke="#c6a36a" strokeWidth="2" />
      <path d="M320 180 L395 110 L470 180" fill="none" stroke="#e08a45" strokeWidth="2.5" />
      {show.framing && (
        <g stroke="#c6a36a" strokeWidth="1.2">
          {Array.from({ length: 7 }, (_, index) => (
            <line key={index} x1={100 + index * 28} y1={170 - index * 8} x2={100 + index * 28} y2="290" />
          ))}
          {Array.from({ length: 5 }, (_, index) => (
            <line key={`n${index}`} x1={340 + index * 22} y1="150" x2={340 + index * 22} y2="290" />
          ))}
        </g>
      )}
      {show.dimensions && (
        <g fill="#9fd0c8" fontSize="12">
          <text x="500" y="160">
            Sister rafters 4 ft
          </text>
          <text x="500" y="190">
            Valley framed, not overframed
          </text>
          <line x1="320" y1="150" x2="470" y2="150" stroke="#9fd0c8" />
        </g>
      )}
    </g>
  );
}
