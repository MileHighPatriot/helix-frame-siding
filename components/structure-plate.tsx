import { cn } from "cn";
import type { PlateKind } from "@/lib/content";

export function StructurePlate({
  kind,
  className,
  title,
}: {
  kind: PlateKind;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 640 400"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={title ?? "Structural diagram"}
    >
      <rect width="640" height="400" fill="#10141a" />
      <g opacity="0.35" stroke="#f3efe6" strokeWidth="0.6">
        {Array.from({ length: 10 }, (_, index) => (
          <line key={`v${index}`} x1={40 + index * 64} y1="0" x2={40 + index * 64} y2="400" />
        ))}
        {Array.from({ length: 6 }, (_, index) => (
          <line key={`h${index}`} x1="0" y1={30 + index * 64} x2="640" y2={30 + index * 64} />
        ))}
      </g>
      {kind === "frame" && <FramePlate />}
      {kind === "siding" && <SidingPlate />}
      {kind === "deck" && <DeckPlate />}
      {kind === "pavilion" && <PavilionPlate />}
      {kind === "remodel" && <RemodelPlate />}
      {kind === "addition" && <AdditionPlate />}
      {kind === "batten" && <BattenPlate />}
      {kind === "adu" && <AduPlate />}
    </svg>
  );
}

function FramePlate() {
  const studs = [150, 174, 198, 222, 246, 270, 294, 318, 342, 366, 390];
  return (
    <g>
      <path d="M120 320 V150 H500 V320" fill="none" stroke="#f3efe6" strokeWidth="3" />
      <path d="M120 150 L310 70 L500 150" fill="none" stroke="#e08a45" strokeWidth="3" />
      {studs.map((x) => (
        <line key={x} x1={x} y1="150" x2={x} y2="320" stroke="#c6a36a" strokeWidth="2" />
      ))}
      <line x1="120" y1="230" x2="500" y2="230" stroke="#f3efe6" strokeWidth="2" opacity="0.7" />
      <rect x="250" y="180" width="90" height="70" fill="#10141a" stroke="#e08a45" strokeWidth="2" />
    </g>
  );
}

function SidingPlate() {
  return (
    <g>
      <rect x="130" y="70" width="380" height="260" fill="none" stroke="#f3efe6" strokeWidth="2" />
      {Array.from({ length: 12 }, (_, index) => (
        <line
          key={index}
          x1="146"
          y1={96 + index * 18}
          x2="494"
          y2={96 + index * 18}
          stroke={index % 4 === 0 ? "#e08a45" : "#c6a36a"}
          strokeWidth="2"
        />
      ))}
      <rect x="250" y="150" width="80" height="90" fill="#10141a" stroke="#f3efe6" strokeWidth="2" />
      <path d="M246 150 H334 L318 138 H262 Z" fill="none" stroke="#e08a45" strokeWidth="1.5" />
    </g>
  );
}

function DeckPlate() {
  return (
    <g>
      <rect x="90" y="90" width="420" height="220" fill="none" stroke="#f3efe6" strokeWidth="2" />
      {Array.from({ length: 14 }, (_, index) => (
        <line
          key={index}
          x1={110 + index * 28}
          y1="100"
          x2={110 + index * 28}
          y2="300"
          stroke="#c6a36a"
          strokeWidth="1.4"
        />
      ))}
      <line x1="90" y1="200" x2="510" y2="200" stroke="#e08a45" strokeWidth="4" />
      <rect x="150" y="300" width="16" height="40" fill="#e08a45" />
      <rect x="430" y="300" width="16" height="40" fill="#e08a45" />
      <path d="M520 160 H590 V280 H520" fill="none" stroke="#f3efe6" strokeWidth="2" />
    </g>
  );
}

function PavilionPlate() {
  return (
    <g>
      <path d="M80 250 H560" stroke="#f3efe6" strokeWidth="1" opacity="0.4" />
      {[140, 250, 390, 500].map((x) => (
        <rect key={x} x={x} y="160" width="14" height="120" fill="#c6a36a" />
      ))}
      <path d="M110 160 H540" stroke="#f3efe6" strokeWidth="6" />
      <path d="M120 160 L320 70 L520 160" fill="none" stroke="#e08a45" strokeWidth="3" />
      {Array.from({ length: 8 }, (_, index) => (
        <line
          key={index}
          x1={150 + index * 46}
          y1="150"
          x2={190 + index * 40}
          y2="90"
          stroke="#f3efe6"
          strokeWidth="1.2"
          opacity="0.8"
        />
      ))}
    </g>
  );
}

function RemodelPlate() {
  return (
    <g>
      <rect x="80" y="80" width="480" height="240" fill="none" stroke="#f3efe6" strokeWidth="2" />
      <line x1="80" y1="200" x2="230" y2="200" stroke="#c6a36a" strokeWidth="8" />
      <line x1="410" y1="200" x2="560" y2="200" stroke="#c6a36a" strokeWidth="8" />
      <line x1="210" y1="150" x2="430" y2="150" stroke="#e08a45" strokeWidth="8" />
      <line x1="230" y1="150" x2="230" y2="280" stroke="#f3efe6" strokeWidth="3" />
      <line x1="410" y1="150" x2="410" y2="280" stroke="#f3efe6" strokeWidth="3" />
      <path d="M250 120 V90 H390 V120" fill="none" stroke="#e08a45" strokeWidth="1.5" strokeDasharray="4 3" />
    </g>
  );
}

function AdditionPlate() {
  return (
    <g>
      <path d="M70 250 H300 V140 H430 V250 H580" fill="none" stroke="#f3efe6" strokeWidth="2.5" />
      <path d="M70 140 L185 70 L300 140" fill="none" stroke="#c6a36a" strokeWidth="2.5" />
      <path d="M300 140 L365 80 L430 140" fill="none" stroke="#e08a45" strokeWidth="2.5" />
      {Array.from({ length: 6 }, (_, index) => (
        <line key={index} x1={318 + index * 18} y1="150" x2={318 + index * 18} y2="250" stroke="#c6a36a" strokeWidth="2" />
      ))}
      <line x1="300" y1="140" x2="300" y2="250" stroke="#e08a45" strokeWidth="2" strokeDasharray="3 3" />
    </g>
  );
}

function BattenPlate() {
  return (
    <g>
      <rect x="140" y="60" width="360" height="280" fill="none" stroke="#f3efe6" strokeWidth="2" />
      {Array.from({ length: 11 }, (_, index) => (
        <line
          key={index}
          x1={168 + index * 30}
          y1="78"
          x2={168 + index * 30}
          y2="322"
          stroke={index % 2 === 0 ? "#e08a45" : "#c6a36a"}
          strokeWidth="3"
        />
      ))}
      <path d="M250 200 H390 V300 H250 Z" fill="#10141a" stroke="#f3efe6" strokeWidth="2" />
    </g>
  );
}

function AduPlate() {
  return (
    <g>
      <rect x="150" y="170" width="340" height="140" fill="none" stroke="#f3efe6" strokeWidth="2.5" />
      <path d="M140 170 H500 L470 110 H170 Z" fill="none" stroke="#e08a45" strokeWidth="2.5" />
      <rect x="190" y="210" width="90" height="100" fill="none" stroke="#c6a36a" strokeWidth="2" />
      <rect x="360" y="90" width="110" height="80" fill="none" stroke="#f3efe6" strokeWidth="2" />
      {Array.from({ length: 5 }, (_, index) => (
        <line key={index} x1={372 + index * 18} y1="100" x2={372 + index * 18} y2="160" stroke="#c6a36a" strokeWidth="1.5" />
      ))}
    </g>
  );
}
