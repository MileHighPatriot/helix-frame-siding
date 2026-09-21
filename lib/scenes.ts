import type { ServiceSlug } from "@/lib/content-types";

export const palette = {
  "warm-white": { label: "Warm white", hex: "#f3efe6" },
  graphite: { label: "Graphite", hex: "#5a5f63" },
  cedar: { label: "Cedar", hex: "#b07d45" },
  black: { label: "Black", hex: "#242628" },
  sage: { label: "Sage", hex: "#8b9276" },
  mill: { label: "Mill gold", hex: "#c6a56c" },
  pale: { label: "Pale", hex: "#efe6d6" },
} as const;

export type ColorId = keyof typeof palette;

export type SceneLayer = { src: string; mask?: string };

export type SceneWash = {
  mask: string;
  hex: string;
  strength: number;
  slot: "base" | "top";
};

export type DesignOption = {
  id: string;
  service: ServiceSlug;
  name: string;
  material: string;
  color: string;
  colorHex: string;
  designType: string;
  image: string;
  profile: string;
  spacing: string;
  substrate: string;
  helix: string;
  partner: string;
  layers: SceneLayer[];
  washes: SceneWash[];
};

export type SceneControl = {
  key: string;
  label: string;
  options: { id: string; label: string; swatch?: string }[];
};

type Bag = Record<string, string>;

const media = (file: string) => `/media/${file}`;
const maskOf = (file: string) => `/media/masks/${file}`;

const fields: Record<ServiceSlug, string[]> = {
  siding: ["material", "field", "gable", "fieldColor", "trimColor"],
  decking: ["layout", "board", "boardColor", "rail", "railColor", "fasciaColor"],
  "outdoor-structures": ["structure", "stain", "roof"],
  remodels: ["beam", "stair", "finish", "color"],
  additions: ["stories", "design", "color"],
  framing: ["floor", "beam", "sheathing", "tone"],
};

const defaults: Record<ServiceSlug, Bag> = {
  siding: { material: "fc", field: "lap", gable: "match", fieldColor: "warm-white", trimColor: "warm-white" },
  decking: { layout: "straight", board: "cedar", boardColor: "cedar", rail: "cable", railColor: "graphite", fasciaColor: "warm-white" },
  "outdoor-structures": { structure: "pergola", stain: "cedar", roof: "none" },
  remodels: { beam: "flush", stair: "wood", finish: "painted", color: "warm-white" },
  additions: { stories: "one", design: "lap", color: "warm-white" },
  framing: { floor: "sawn", beam: "lvl", sheathing: "open", tone: "mill" },
};

const choices: Record<ServiceSlug, Record<string, readonly string[]>> = {
  siding: {
    material: ["fc", "wood"],
    field: ["lap", "panel", "batten"],
    gable: ["match", "distinct"],
    fieldColor: ["warm-white", "graphite", "cedar", "black", "sage"],
    trimColor: ["warm-white", "graphite", "black", "cedar", "sage"],
  },
  decking: {
    layout: ["straight", "picture"],
    board: ["cedar", "composite", "hardwood"],
    boardColor: ["cedar", "graphite", "warm-white", "black", "sage"],
    rail: ["cable", "wood", "metal", "glass"],
    railColor: ["graphite", "black", "warm-white", "cedar"],
    fasciaColor: ["warm-white", "graphite", "black", "cedar"],
  },
  "outdoor-structures": {
    structure: ["pergola", "pavilion", "attached"],
    stain: ["cedar", "mill", "graphite", "black"],
    roof: ["none", "metal", "shingle"],
  },
  remodels: {
    beam: ["flush", "dropped"],
    stair: ["wood", "metal"],
    finish: ["painted", "stained"],
    color: ["warm-white", "sage", "graphite", "black", "cedar", "mill"],
  },
  additions: {
    stories: ["one", "two"],
    design: ["lap", "panel", "batten"],
    color: ["warm-white", "graphite", "cedar", "black", "sage"],
  },
  framing: {
    floor: ["sawn", "ijoist"],
    beam: ["lvl", "timber"],
    sheathing: ["open", "sheathed"],
    tone: ["mill", "cedar", "pale", "graphite"],
  },
};

const colorKeys = new Set(["fieldColor", "trimColor", "boardColor", "railColor", "fasciaColor", "stain", "color", "tone"]);

const controlLabel: Record<string, string> = {
  material: "Material",
  field: "Field",
  gable: "Gable",
  fieldColor: "Field color",
  trimColor: "Trim color",
  layout: "Board layout",
  board: "Board material",
  boardColor: "Board color",
  rail: "Handrail",
  railColor: "Handrail color",
  fasciaColor: "Fascia color",
  structure: "Structure",
  stain: "Timber stain",
  roof: "Roof",
  beam: "Beam",
  stair: "Stair rail",
  finish: "Finish",
  color: "Color",
  stories: "Height",
  design: "Cladding",
  floor: "Floor",
  sheathing: "Studs",
  tone: "Lumber tone",
};

const optionLabel: Record<string, string> = {
  fc: "Fiber cement",
  wood: "Wood",
  lap: "Lap",
  panel: "Panel",
  batten: "Board and batten",
  match: "Follows the field",
  distinct: "Distinct gable",
  straight: "Straight",
  picture: "Picture frame",
  cedar: "Cedar",
  composite: "Composite",
  hardwood: "Hardwood",
  cable: "Cable",
  metal: "Metal",
  glass: "Glass",
  pergola: "Pergola",
  pavilion: "Pavilion",
  attached: "Attached cover",
  none: "None",
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
  open: "Open",
  sheathed: "Sheathed",
};

function allowed(service: ServiceSlug, key: string, selection: Bag) {
  if (service === "remodels" && key === "color") {
    return selection.finish === "stained"
      ? ["cedar", "mill", "graphite"]
      : ["warm-white", "sage", "graphite", "black"];
  }
  if (service === "outdoor-structures" && key === "roof") {
    return selection.structure === "pergola" ? ["none"] : ["metal", "shingle"];
  }
  return choices[service][key];
}

export function normalizeSelection(service: ServiceSlug, raw: Bag) {
  const next: Bag = { ...defaults[service], ...raw };
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

export function selectionId(service: ServiceSlug, selection: Bag) {
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
  const raw: Bag = {};
  keys.forEach((key, index) => {
    raw[key] = parts[index + 1];
  });
  return { service, selection: normalizeSelection(service, raw) };
}

export function controlsFor(service: ServiceSlug, selection: Bag): SceneControl[] {
  const normalized = normalizeSelection(service, selection);
  return fields[service]
    .filter((key) => !(service === "outdoor-structures" && key === "roof" && normalized.structure === "pergola"))
    .map((key) => ({
      key,
      label: controlLabel[key],
      options: allowed(service, key, normalized).map((id) => ({
        id,
        label: colorKeys.has(key) ? palette[id as ColorId].label : optionLabel[id],
        swatch: colorKeys.has(key) ? palette[id as ColorId].hex : undefined,
      })),
    }));
}

function wash(file: string, color: string, slot: "base" | "top", strength: number): SceneWash {
  const tone = palette[color as ColorId];
  return { mask: maskOf(file), hex: tone.hex, strength, slot };
}

function sidingStem(selection: Bag) {
  const gable = selection.gable === "distinct" ? "-gable" : "";
  return `siding-${selection.material}-${selection.field}${gable}`;
}

export function resolveDesign(service: ServiceSlug, selection: Bag): DesignOption {
  const normalized = normalizeSelection(service, selection);
  const spec = specFor(service, normalized);
  const visual = visualFor(service, normalized);
  return {
    id: selectionId(service, normalized),
    service,
    ...spec,
    image: visual.layers[0].src,
    layers: visual.layers,
    washes: visual.washes,
  };
}

export function getDesign(id: string) {
  const parsed = parseSelection(id);
  if (!parsed) return undefined;
  return resolveDesign(parsed.service, parsed.selection);
}

function visualFor(service: ServiceSlug, selection: Bag) {
  if (service === "siding") {
    const stem = sidingStem(selection);
    const fieldKeep = selection.material === "wood" ? 0.72 : 0.32;
    return {
      layers: [{ src: media(`scene-${stem}.png`) }],
      washes: [
        wash(`${stem}-field.png`, selection.fieldColor, "base", fieldKeep),
        wash(`${stem}-trim.png`, selection.trimColor, "base", 0.28),
      ],
    };
  }
  if (service === "decking") {
    const stem = `deck-${selection.layout}-${selection.board}`;
    const railFile = selection.rail === "cable" ? `${stem}-cable.png` : `deck-rail-${selection.rail}.png`;
    const layers: SceneLayer[] = [{ src: media(`scene-${stem}.png`) }];
    if (selection.rail !== "cable") {
      layers.push({
        src: media(`scene-deck-rail-${selection.rail}.png`),
        mask: maskOf(`deck-rail-${selection.rail}-zone.png`),
      });
    }
    const boardKeep = selection.board === "composite" ? 0.4 : 0.78;
    const railKeep = selection.rail === "wood" ? 0.7 : selection.rail === "cable" ? 0.55 : 0.3;
    return {
      layers,
      washes: [
        wash(`${stem}-boards.png`, selection.boardColor, "base", boardKeep),
        wash(`${stem}-fascia.png`, selection.fasciaColor, "base", 0.32),
        wash(railFile, selection.railColor, "top", railKeep),
      ],
    };
  }
  if (service === "outdoor-structures") {
    const file = selection.structure === "pergola"
      ? "scene-outdoor-pergola.png"
      : `scene-outdoor-${selection.structure}-${selection.roof}.png`;
    const stem = selection.structure === "pergola"
      ? "outdoor-pergola"
      : `outdoor-${selection.structure}-${selection.roof}`;
    return {
      layers: [{ src: media(file) }],
      washes: [wash(`${stem}-timber.png`, selection.stain, "base", 0.82)],
    };
  }
  if (service === "remodels") {
    const stem = `remodel-${selection.beam}-${selection.stair}`;
    return {
      layers: [{ src: media(`scene-${stem}.png`) }],
      washes: [wash(`${stem}-finish.png`, selection.color, "base", selection.finish === "stained" ? 0.75 : 0.28)],
    };
  }
  if (service === "additions") {
    const stem = `addition-${selection.stories}-${selection.design}`;
    return {
      layers: [{ src: media(`scene-${stem}.png`) }],
      washes: [wash(`${stem}-field.png`, selection.color, "base", 0.32)],
    };
  }
  const stem = `framing-${selection.floor}-${selection.beam}-${selection.sheathing}`;
  return {
    layers: [{ src: media(`scene-${stem}.png`) }],
    washes: [wash(`${stem}-lumber.png`, selection.tone, "base", 0.88)],
  };
}

function specFor(service: ServiceSlug, selection: Bag): Omit<DesignOption, "id" | "service" | "image" | "layers" | "washes"> {
  if (service === "siding") return sidingSpec(selection);
  if (service === "decking") return deckSpec(selection);
  if (service === "outdoor-structures") return outdoorSpec(selection);
  if (service === "remodels") return remodelSpec(selection);
  if (service === "additions") return additionSpec(selection);
  return framingSpec(selection);
}

function sidingSpec(selection: Bag) {
  const material = selection.material === "fc" ? "Fiber cement" : "Wood";
  const field = optionLabel[selection.field];
  const profiles: Record<string, string> = {
    "fc-lap": "8-1/4 inch lap, 7 inch exposure",
    "fc-panel": "5/8 inch smooth panel, joints on the studs",
    "fc-batten": "10 inch boards with 1-1/2 inch battens",
    "wood-lap": "1/2 by 6 bevel, 4-1/2 inch exposure",
    "wood-panel": "Tongue-and-groove boards, 6 inch face",
    "wood-batten": "1 by 10 boards with 1-1/2 inch battens",
  };
  const gable = selection.gable === "distinct"
    ? "The gable is a separate treatment, flashed where it meets the field."
    : "The gable uses the same profile as the field.";
  return {
    name: selection.gable === "distinct" ? `${material} ${field.toLowerCase()}, distinct gable` : `${material} ${field.toLowerCase()}`,
    material,
    color: palette[selection.fieldColor as ColorId].label,
    colorHex: palette[selection.fieldColor as ColorId].hex,
    designType: selection.gable === "distinct" ? "Distinct gable" : "Matched gable",
    profile: `${profiles[`${selection.material}-${selection.field}`]}. ${gable}`,
    spacing: selection.field === "panel" ? "Joints land on studs at 16 inches on center" : "Courses stay level, and joints stagger off the stud",
    substrate: "Rainscreen furring over the weather barrier, checked flat before the first course",
    helix: "We hang the field, the gable, and the trim, and we flash every opening.",
    partner: "Paint, and the window package when those are part of the job.",
  };
}

function deckSpec(selection: Bag) {
  const boards: Record<string, string> = {
    cedar: "5/4 cedar, square edge",
    composite: "Grooved-edge composite with hidden fasteners",
    hardwood: "1x hardwood, gapped for movement",
  };
  const rails: Record<string, string> = {
    cable: "Stainless cable, posts at 6 feet, cables 3 inches apart",
    wood: "Wood balusters at a 4 inch gap, with a graspable handrail",
    metal: "Metal balusters at a 4 inch gap",
    glass: "Tempered glass between the posts, with a cap rail",
  };
  const gaps: Record<string, string> = {
    cedar: "1/8 inch between boards",
    composite: "The gap the board maker specifies",
    hardwood: "3/16 inch between boards",
  };
  const layout = selection.layout === "picture"
    ? "A border board frames the field, with miters at the corners."
    : "Boards run square off the house.";
  return {
    name: `${optionLabel[selection.board]} ${selection.layout === "picture" ? "picture frame" : "straight lay"}`,
    material: optionLabel[selection.board],
    color: palette[selection.boardColor as ColorId].label,
    colorHex: palette[selection.boardColor as ColorId].hex,
    designType: `${optionLabel[selection.rail]} rail`,
    profile: `${boards[selection.board]}. ${layout} ${rails[selection.rail]}. Fascia is colored apart from the walking surface.`,
    spacing: `${gaps[selection.board]}. Joists 16 inches on center.`,
    substrate: "Joists on the existing or new frame, picture-frame edges blocked where the border turns",
    helix: "We set the boards, the handrail, and the fascia.",
    partner: "New footings, when the piers are not already in the ground.",
  };
}

function outdoorSpec(selection: Bag) {
  const structures: Record<string, string> = {
    pergola: "Open rafters on posts. There is no roof.",
    pavilion: "A freestanding roof on four posts.",
    attached: "A ledger at the house and posts at the outer edge.",
  };
  const roofs: Record<string, string> = {
    none: "The rafters stay open.",
    metal: "Purlins are ready for a metal roof.",
    shingle: "The roof is sheathed for shingles.",
  };
  const partner = selection.roof === "metal"
    ? "The metal roof panels."
    : selection.roof === "shingle"
      ? "Shingles and underlayment."
      : "The patio, when the slab is new.";
  return {
    name: optionLabel[selection.structure],
    material: "Timber",
    color: palette[selection.stain as ColorId].label,
    colorHex: palette[selection.stain as ColorId].hex,
    designType: selection.roof === "none" ? "Open roof" : `${optionLabel[selection.roof]} roof`,
    profile: `${structures[selection.structure]} ${roofs[selection.roof]}`,
    spacing: "Posts set to the beam span on the plan",
    substrate: "Post bases on the patio or on new piers, checked plumb before the beams go on",
    helix: "We cut and raise the timber, and we frame the roof when the structure has one.",
    partner,
  };
}

function remodelSpec(selection: Bag) {
  const beam = selection.beam === "flush"
    ? "The beam sits in the ceiling plane and is wrapped flush."
    : "The beam drops below the ceiling and is wrapped.";
  const stair = selection.stair === "wood"
    ? "The stair rail is wood."
    : "The stair rail is metal, so the finish color stays on the beam.";
  const finish = selection.finish === "painted" ? "Painted finish." : "Stained finish.";
  return {
    name: `${optionLabel[selection.beam]} beam`,
    material: optionLabel[selection.finish],
    color: palette[selection.color as ColorId].label,
    colorHex: palette[selection.color as ColorId].hex,
    designType: `${optionLabel[selection.stair]} stair rail`,
    profile: `${beam} ${stair} ${finish}`,
    spacing: "The opening is framed to the joist layout already in the floor",
    substrate: "Existing joists sistered where the opening cuts them",
    helix: "We frame the opening, set the beam, and build the stair rail.",
    partner: "Drywall, paint, and the kitchen that lands in the opening.",
  };
}

function additionSpec(selection: Bag) {
  const height = selection.stories === "one"
    ? "One story in the side yard."
    : "Two stories, with the roof tied into the bungalow.";
  const profiles: Record<string, string> = {
    lap: "Lap siding, 7 inch exposure",
    panel: "Smooth panels with joints on the studs",
    batten: "Board and batten, 10 inch boards and 1-1/2 inch battens",
  };
  return {
    name: `${optionLabel[selection.stories].toLowerCase()} ${optionLabel[selection.design].toLowerCase()}`,
    material: "Fiber cement",
    color: palette[selection.color as ColorId].label,
    colorHex: palette[selection.color as ColorId].hex,
    designType: optionLabel[selection.design],
    profile: `${height} ${profiles[selection.design]}.`,
    spacing: selection.design === "panel" ? "Panel joints on studs at 16 inches on center" : "Courses level, joints off the stud",
    substrate: "New wall on a new foundation, benchmark tied to the old floor",
    helix: "We frame the addition and hang the cladding.",
    partner: "Foundation, roofing, and the shingles at the tie-in.",
  };
}

function framingSpec(selection: Bag) {
  const floors: Record<string, string> = {
    sawn: "2x10 solid sawn joists",
    ijoist: "I-joists at the depth on the plan",
  };
  const beams: Record<string, string> = {
    lvl: "An LVL beam, plies per the engineer",
    timber: "A solid timber beam",
  };
  const walls: Record<string, string> = {
    open: "Stud bays stay open for the mechanical walk.",
    sheathed: "Wall sheathing is on. The center opening, the beam, and the joists stay readable.",
  };
  return {
    name: `${optionLabel[selection.floor]} floor, ${optionLabel[selection.beam]}`,
    material: optionLabel[selection.beam],
    color: palette[selection.tone as ColorId].label,
    colorHex: palette[selection.tone as ColorId].hex,
    designType: selection.sheathing === "open" ? "Open studs" : "Sheathed walls",
    profile: `${floors[selection.floor]}. ${beams[selection.beam]}. ${walls[selection.sheathing]}`,
    spacing: "Studs and joists at 16 inches on center",
    substrate: "The plate is checked against the existing house before the first stud",
    helix: "We lay out the floor, set the beam, stand the studs, and sheath the walls when the plan calls for it.",
    partner: "The engineer of record, and concrete when the stem wall is new.",
  };
}
