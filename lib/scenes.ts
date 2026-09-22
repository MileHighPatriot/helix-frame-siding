import type { ServiceSlug } from "@/lib/content-types";

export const palette = {
  "warm-white": { label: "Warm white", hex: "#eeeae1" },
  pale: { label: "Linen", hex: "#e2d8c6" },
  sage: { label: "Sage", hex: "#879076" },
  slate: { label: "Slate blue", hex: "#56636f" },
  graphite: { label: "Graphite", hex: "#4d5256" },
  black: { label: "Black", hex: "#242628" },
  cedar: { label: "Cedar", hex: "#b27a45" },
  walnut: { label: "Walnut", hex: "#6b4a33" },
  driftwood: { label: "Driftwood", hex: "#9d958b" },
  sand: { label: "Sand", hex: "#c8b393" },
  mill: { label: "Fresh fir", hex: "#d6b27c" },
  spruce: { label: "Spruce", hex: "#e2cfa6" },
  treated: { label: "Treated", hex: "#a8a27e" },
  oxblood: { label: "Oxblood", hex: "#6c2a25" },
  oak: { label: "White oak", hex: "#c9a97c" },
  ash: { label: "Ash gray", hex: "#b3aca1" },
} as const;

export type ColorId = keyof typeof palette;

export type Selection = Record<string, string>;

export type DesignOption = {
  id: string;
  service: ServiceSlug;
  selection: Selection;
  name: string;
  material: string;
  color: string;
  colorHex: string;
  designType: string;
  profile: string;
  spacing: string;
  substrate: string;
  helix: string;
  partner: string;
};

export type SceneControl = {
  key: string;
  label: string;
  kind: "option" | "color";
  options: { id: string; label: string; swatch?: string }[];
};

const fields: Record<ServiceSlug, string[]> = {
  siding: ["material", "field", "gable", "fieldColor", "gableColor", "trimColor", "doorColor"],
  decking: ["layout", "board", "boardColor", "rail", "railColor", "fasciaColor", "stairs"],
  "outdoor-structures": ["structure", "stain", "roof"],
  remodels: ["beam", "stair", "finish", "color", "floor"],
  additions: ["stories", "design", "color", "trimColor"],
  framing: ["floor", "beam", "sheathing", "tone"],
};

const defaults: Record<ServiceSlug, Selection> = {
  siding: {
    material: "fc",
    field: "lap",
    gable: "match",
    fieldColor: "slate",
    gableColor: "warm-white",
    trimColor: "warm-white",
    doorColor: "oxblood",
  },
  decking: {
    layout: "picture",
    board: "composite",
    boardColor: "cedar",
    rail: "cable",
    railColor: "black",
    fasciaColor: "graphite",
    stairs: "front",
  },
  "outdoor-structures": { structure: "pergola", stain: "cedar", roof: "none" },
  remodels: { beam: "dropped", stair: "wood", finish: "stained", color: "walnut", floor: "oak" },
  additions: { stories: "two", design: "lap", color: "sage", trimColor: "warm-white" },
  framing: { floor: "sawn", beam: "lvl", sheathing: "open", tone: "mill" },
};

const cladding = ["warm-white", "pale", "sage", "slate", "graphite", "black", "cedar"] as const;

const choices: Record<ServiceSlug, Record<string, readonly string[]>> = {
  siding: {
    material: ["fc", "wood"],
    field: ["lap", "panel", "batten"],
    gable: ["match", "distinct"],
    fieldColor: cladding,
    gableColor: cladding,
    trimColor: ["warm-white", "black", "graphite", "cedar", "sage"],
    doorColor: ["oxblood", "black", "sage", "cedar", "warm-white"],
  },
  decking: {
    layout: ["straight", "picture"],
    board: ["cedar", "composite", "hardwood"],
    boardColor: ["cedar", "walnut", "driftwood", "sand", "graphite"],
    rail: ["cable", "wood", "metal", "glass"],
    railColor: ["black", "graphite", "warm-white", "cedar"],
    fasciaColor: ["graphite", "black", "warm-white", "cedar"],
    stairs: ["front", "side"],
  },
  "outdoor-structures": {
    structure: ["pergola", "pavilion", "attached"],
    stain: ["cedar", "walnut", "mill", "graphite", "black"],
    roof: ["none", "metal", "shingle"],
  },
  remodels: {
    beam: ["flush", "dropped"],
    stair: ["wood", "metal"],
    finish: ["painted", "stained"],
    color: ["warm-white", "sage", "graphite", "black", "cedar", "walnut", "mill"],
    floor: ["oak", "walnut", "ash"],
  },
  additions: {
    stories: ["one", "two"],
    design: ["lap", "panel", "batten"],
    color: ["warm-white", "pale", "sage", "slate", "graphite", "black"],
    trimColor: ["warm-white", "black", "graphite", "cedar"],
  },
  framing: {
    floor: ["sawn", "ijoist"],
    beam: ["lvl", "timber"],
    sheathing: ["open", "sheathed"],
    tone: ["mill", "spruce", "cedar", "treated"],
  },
};

function isColor(service: ServiceSlug, key: string) {
  return choices[service][key].every((id) => id in palette);
}

const controlLabel: Record<string, string> = {
  material: "Material",
  field: "Profile",
  gable: "Gable",
  fieldColor: "Siding color",
  gableColor: "Gable color",
  trimColor: "Trim color",
  doorColor: "Door color",
  layout: "Board layout",
  board: "Board material",
  boardColor: "Board color",
  rail: "Railing",
  railColor: "Railing color",
  fasciaColor: "Fascia color",
  stairs: "Stairs",
  structure: "Structure",
  stain: "Timber stain",
  roof: "Roof",
  beam: "Beam",
  stair: "Stair rail",
  finish: "Finish",
  color: "Color",
  stories: "Height",
  design: "Cladding",
  sheathing: "Walls",
  floor: "Floor system",
  tone: "Lumber",
};

const optionLabel: Record<string, string> = {
  fc: "Fiber cement",
  wood: "Wood",
  lap: "Lap",
  panel: "Panel",
  batten: "Board and batten",
  match: "Follows the field",
  distinct: "Shake gable",
  straight: "Straight",
  picture: "Picture frame",
  cedar: "Cedar",
  composite: "Composite",
  hardwood: "Hardwood",
  cable: "Cable",
  metal: "Metal",
  glass: "Glass",
  front: "Front",
  side: "Side",
  pergola: "Pergola",
  pavilion: "Pavilion",
  attached: "Attached cover",
  none: "Open",
  shingle: "Shingle",
  flush: "Flush",
  dropped: "Dropped",
  painted: "Painted",
  stained: "Stained",
  one: "One story",
  two: "Two stories",
  sawn: "Solid sawn",
  ijoist: "I-joist",
  lvl: "LVL",
  timber: "Timber",
  open: "Open studs",
  sheathed: "Sheathed",
};

function allowed(service: ServiceSlug, key: string, selection: Selection) {
  if (service === "remodels" && key === "color") {
    return selection.finish === "stained" ? ["cedar", "walnut", "mill"] : ["warm-white", "sage", "graphite", "black"];
  }
  if (service === "outdoor-structures" && key === "roof") {
    return selection.structure === "pergola" ? ["none"] : ["metal", "shingle"];
  }
  return choices[service][key];
}

function hidden(service: ServiceSlug, key: string, selection: Selection) {
  if (service === "outdoor-structures" && key === "roof") return selection.structure === "pergola";
  if (service === "siding" && key === "gableColor") return selection.gable !== "distinct";
  return false;
}

export function normalizeSelection(service: ServiceSlug, raw: Selection) {
  const next: Selection = { ...defaults[service], ...raw };
  if (service === "outdoor-structures") {
    if (next.structure === "pergola") next.roof = "none";
    else if (next.roof === "none") next.roof = "metal";
  }
  for (const key of fields[service]) {
    const options = allowed(service, key, next);
    if (!options.includes(next[key])) next[key] = options[0];
  }
  return next;
}

export function selectionId(service: ServiceSlug, selection: Selection) {
  const normalized = normalizeSelection(service, selection);
  return [service, ...fields[service].map((key) => normalized[key])].join("|");
}

export function defaultDesignId(service: ServiceSlug) {
  return selectionId(service, defaults[service]);
}

export function parseSelection(id: string) {
  const parts = id.split("|");
  const service = parts[0] as ServiceSlug;
  const keys = fields[service];
  if (!keys || parts.length !== keys.length + 1) return undefined;
  const raw: Selection = {};
  keys.forEach((key, index) => {
    raw[key] = parts[index + 1];
  });
  return { service, selection: normalizeSelection(service, raw) };
}

export function controlsFor(service: ServiceSlug, selection: Selection): SceneControl[] {
  const normalized = normalizeSelection(service, selection);
  return fields[service]
    .filter((key) => !hidden(service, key, normalized))
    .map((key) => {
      const color = isColor(service, key);
      return {
        key,
        label: service === "remodels" && key === "floor" ? "Flooring" : controlLabel[key],
        kind: color ? "color" : "option",
        options: allowed(service, key, normalized).map((id) => ({
          id,
          label: color ? palette[id as ColorId].label : optionLabel[id],
          swatch: color ? palette[id as ColorId].hex : undefined,
        })),
      };
    });
}

export function hex(id: string) {
  return palette[id as ColorId]?.hex ?? "#888888";
}

export function colorName(id: string) {
  return palette[id as ColorId]?.label ?? id;
}

export function resolveDesign(service: ServiceSlug, selection: Selection): DesignOption {
  const normalized = normalizeSelection(service, selection);
  return {
    id: selectionId(service, normalized),
    service,
    selection: normalized,
    ...specFor(service, normalized),
  };
}

export function getDesign(id: string) {
  const parsed = parseSelection(id);
  if (!parsed) return undefined;
  return resolveDesign(parsed.service, parsed.selection);
}

type Spec = Omit<DesignOption, "id" | "service" | "selection">;

function specFor(service: ServiceSlug, selection: Selection): Spec {
  if (service === "siding") return sidingSpec(selection);
  if (service === "decking") return deckSpec(selection);
  if (service === "outdoor-structures") return outdoorSpec(selection);
  if (service === "remodels") return remodelSpec(selection);
  if (service === "additions") return additionSpec(selection);
  return framingSpec(selection);
}

function sidingSpec(selection: Selection): Spec {
  const material = selection.material === "fc" ? "Fiber cement" : "Wood";
  const field = optionLabel[selection.field];
  const profiles: Record<string, string> = {
    "fc-lap": "8-1/4 inch lap at a 7 inch exposure",
    "fc-panel": "5/8 inch smooth panel with joints on the studs",
    "fc-batten": "Smooth panel with 2-1/2 inch battens at 16 inches",
    "wood-lap": "1/2 by 6 cedar bevel at a 4-1/2 inch exposure",
    "wood-panel": "Tongue-and-groove boards, 6 inch face",
    "wood-batten": "1 by 10 boards with 1-1/2 inch battens",
  };
  const gable =
    selection.gable === "distinct"
      ? `The gable is staggered shake in ${colorName(selection.gableColor).toLowerCase()}, broken from the field by a trim band.`
      : "The gable carries the field profile to the ridge.";
  return {
    name: selection.gable === "distinct" ? `${material} ${field.toLowerCase()}, shake gable` : `${material} ${field.toLowerCase()}`,
    material,
    color: colorName(selection.fieldColor),
    colorHex: hex(selection.fieldColor),
    designType: selection.gable === "distinct" ? "Shake gable" : "Matched gable",
    profile: `${profiles[`${selection.material}-${selection.field}`]}. ${gable} Trim in ${colorName(selection.trimColor).toLowerCase()}, door in ${colorName(selection.doorColor).toLowerCase()}.`,
    spacing:
      selection.field === "panel"
        ? "Panel joints land on studs at 16 inches on center"
        : selection.field === "batten"
          ? "Battens at 16 inches on center, fastened through to the studs"
          : "Courses stay level to a story pole, and joints stagger off the stud",
    substrate: "Rainscreen furring over the weather barrier, checked flat before the first course",
    helix: "We hang the field, the gable, and the trim, and we flash every opening.",
    partner: "Paint, when the siding is not factory finished, and the window package.",
  };
}

function deckSpec(selection: Selection): Spec {
  const boards: Record<string, string> = {
    cedar: "5/4 cedar, square edge",
    composite: "Grooved-edge composite with hidden fasteners",
    hardwood: "1x hardwood, pre-grooved and gapped for movement",
  };
  const rails: Record<string, string> = {
    cable: "Stainless cable, posts at 6 feet or less, cables 3 inches apart",
    wood: "Square balusters at a 4 inch gap under a graspable cap",
    metal: "Round metal balusters at a 4 inch gap",
    glass: "Tempered glass infill between the posts, under a cap rail",
  };
  const gaps: Record<string, string> = {
    cedar: "1/8 inch between boards",
    composite: "The gap the board maker specifies",
    hardwood: "3/16 inch between boards",
  };
  const layout = selection.layout === "picture" ? "A border board frames the field." : "Boards run parallel to the house.";
  const stairs = selection.stairs === "front" ? "Stairs come off the front edge." : "Stairs come off the side, along the house.";
  return {
    name: `${optionLabel[selection.board]} ${selection.layout === "picture" ? "picture frame" : "straight lay"}`,
    material: optionLabel[selection.board],
    color: colorName(selection.boardColor),
    colorHex: hex(selection.boardColor),
    designType: `${optionLabel[selection.rail]} railing`,
    profile: `${boards[selection.board]} in ${colorName(selection.boardColor).toLowerCase()}. ${layout} ${stairs} ${rails[selection.rail]}, in ${colorName(selection.railColor).toLowerCase()}. Fascia in ${colorName(selection.fasciaColor).toLowerCase()}.`,
    spacing: `${gaps[selection.board]}. Joists 16 inches on center, 12 under a picture-frame border.`,
    substrate: "Joists on a flashed ledger or a freestanding beam, blocked where the border turns",
    helix: "We frame the deck, set the boards, the railing, the stairs, and the fascia.",
    partner: "Footings, when the piers are not already in the ground.",
  };
}

function outdoorSpec(selection: Selection): Spec {
  const structures: Record<string, string> = {
    pergola: "Open rafters and slats on four posts.",
    pavilion: "A freestanding gable roof on four posts.",
    attached: "A ledger at the house and posts at the outer edge, under a shed roof.",
  };
  const roofs: Record<string, string> = {
    none: "The rafters stay open to the sky.",
    metal: "Standing-seam metal over solid sheathing.",
    shingle: "Architectural shingles over solid sheathing.",
  };
  return {
    name: optionLabel[selection.structure],
    material: "Timber",
    color: colorName(selection.stain),
    colorHex: hex(selection.stain),
    designType: selection.roof === "none" ? "Open roof" : `${optionLabel[selection.roof]} roof`,
    profile: `${structures[selection.structure]} ${roofs[selection.roof]} Timber stained ${colorName(selection.stain).toLowerCase()}.`,
    spacing: "Posts set to the beam span on the plan, rafters at 24 inches",
    substrate: "Post bases on the patio or on new piers, checked plumb before the beams go on",
    helix: "We cut and raise the timber, and we frame the roof when the structure has one.",
    partner:
      selection.roof === "metal"
        ? "The metal roof panels."
        : selection.roof === "shingle"
          ? "Shingles and underlayment."
          : "The patio, when the slab is new.",
  };
}

function remodelSpec(selection: Selection): Spec {
  const beam =
    selection.beam === "flush"
      ? "The beam sits in the ceiling plane, so the opening runs to the ceiling."
      : "The beam drops below the ceiling and is wrapped as a header.";
  const stair =
    selection.stair === "wood"
      ? "The stair rail is wood, finished to match the beam."
      : "The stair rail is black steel, so the finish color stays on the beam.";
  return {
    name: `${optionLabel[selection.beam]} beam opening`,
    material: optionLabel[selection.finish],
    color: colorName(selection.color),
    colorHex: hex(selection.color),
    designType: `${optionLabel[selection.stair]} stair rail`,
    profile: `${beam} ${stair} ${optionLabel[selection.finish]} ${colorName(selection.color).toLowerCase()}, over ${colorName(selection.floor).toLowerCase()} floors.`,
    spacing: "The opening is framed to the joist layout already in the floor",
    substrate: "Existing joists sistered where the opening cuts them",
    helix: "We shore, frame the opening, set the beam, and build the stair rail.",
    partner: "Drywall, paint, and the kitchen that lands in the opening.",
  };
}

function additionSpec(selection: Selection): Spec {
  const height = selection.stories === "one" ? "One story off the side of the house." : "Two stories, with the roof tied into the existing house.";
  const profiles: Record<string, string> = {
    lap: "Lap siding at a 7 inch exposure",
    panel: "Smooth panels with joints on the studs",
    batten: "Board and batten, battens at 16 inches",
  };
  return {
    name: `${optionLabel[selection.stories]} addition, ${optionLabel[selection.design].toLowerCase()}`,
    material: "Fiber cement",
    color: colorName(selection.color),
    colorHex: hex(selection.color),
    designType: optionLabel[selection.design],
    profile: `${height} ${profiles[selection.design]} in ${colorName(selection.color).toLowerCase()}, trim in ${colorName(selection.trimColor).toLowerCase()}.`,
    spacing: selection.design === "panel" ? "Panel joints on studs at 16 inches on center" : "Courses level, joints off the stud",
    substrate: "New wall on a new foundation, benchmarked to the old floor",
    helix: "We frame the addition, tie the roofs, and hang the cladding.",
    partner: "Foundation, roofing, and the shingles at the tie-in.",
  };
}

function framingSpec(selection: Selection): Spec {
  const floors: Record<string, string> = {
    sawn: "2x10 solid sawn joists",
    ijoist: "I-joists at the depth on the plan",
  };
  const beams: Record<string, string> = {
    lvl: "A three-ply LVL beam on posts",
    timber: "A solid timber beam on posts",
  };
  const walls: Record<string, string> = {
    open: "Stud bays stay open for the mechanical walk.",
    sheathed: "OSB sheathing is on, with the openings cut.",
  };
  return {
    name: `${optionLabel[selection.floor]} floor, ${optionLabel[selection.beam]} beam`,
    material: optionLabel[selection.beam],
    color: colorName(selection.tone),
    colorHex: hex(selection.tone),
    designType: optionLabel[selection.sheathing],
    profile: `${floors[selection.floor]}. ${beams[selection.beam]}. ${walls[selection.sheathing]} ${colorName(selection.tone)} lumber.`,
    spacing: "Studs and joists at 16 inches on center",
    substrate: "The sill is checked against the foundation before the first stud",
    helix: "We lay out the floor, set the beam, stand the studs, and sheathe the walls when the plan calls for it.",
    partner: "The engineer of record, and concrete when the stem wall is new.",
  };
}
