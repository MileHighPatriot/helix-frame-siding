import type { ServiceSlug } from "@/lib/content-types";

type V3 = [number, number, number];

export type StageView = { id: string; label: string; position: V3; target: V3 };

export type StageApi = {
  zoom: (amount: number) => void;
  reset: () => void;
};

export const stageViews: Record<ServiceSlug, StageView[]> = {
  siding: [
    { id: "corner", label: "Corner", position: [13.5, 4.3, 15.5], target: [0, 2.5, 0] },
    { id: "front", label: "Front", position: [0, 2.9, 20.5], target: [0, 2.7, 0] },
    { id: "detail", label: "Entry", position: [5.2, 2.1, 10.6], target: [1.2, 1.9, 4.5] },
  ],
  decking: [
    { id: "corner", label: "Corner", position: [7.8, 4.3, 10.8], target: [0, 1.1, 2] },
    { id: "front", label: "Front", position: [0, 3.1, 12.5], target: [0, 1.2, 2] },
    { id: "detail", label: "Railing", position: [5.4, 1.9, 7], target: [2.6, 1.2, 3.4] },
  ],
  "outdoor-structures": [
    { id: "corner", label: "Corner", position: [8.2, 3.7, 10.2], target: [0, 1.6, 0.2] },
    { id: "front", label: "Front", position: [0, 2.7, 12], target: [0, 1.7, 0] },
    { id: "detail", label: "Underneath", position: [2.4, 1.6, 5], target: [-0.6, 2.5, -0.4] },
  ],
  remodels: [
    { id: "room", label: "Room", position: [-2.4, 1.6, 4.9], target: [0.4, 1.35, -2.2] },
    { id: "stair", label: "Stair", position: [-0.6, 1.5, 3.3], target: [3.1, 1.8, -0.8] },
    { id: "beam", label: "Beam", position: [-1.8, 1.35, 1.6], target: [-0.2, 2.45, -2] },
  ],
  additions: [
    { id: "corner", label: "Corner", position: [12.8, 4.4, 13.8], target: [-0.5, 2.6, 0] },
    { id: "front", label: "Front", position: [0.5, 3.2, 19], target: [-1.2, 2.8, 0] },
    { id: "side", label: "Side", position: [16, 3.5, 1.5], target: [2, 2.8, -0.3] },
  ],
  framing: [
    { id: "corner", label: "Corner", position: [8.8, 4.7, 9.4], target: [-0.3, 1.6, -0.6] },
    { id: "front", label: "Front", position: [0, 3.5, 11.5], target: [0, 1.6, -0.8] },
    { id: "detail", label: "Floor", position: [5.4, 2.3, 5.6], target: [1.6, 0.6, 1.6] },
  ],
};
