import type { ServiceSlug } from "@/lib/content-types";

export type { ServiceSlug };

export const company = {
  name: "Helix Frame & Siding",
  short: "Helix",
  phone: "(303) 555-0148",
  phoneHref: "tel:+13035550148",
  email: "estimating@helixframe.example",
  address: "2145 Decatur Street, Suite B",
  city: "Denver, CO 80211",
  hours: "Monday–Friday, 7:00 a.m.–5:00 p.m.",
  area: "Denver metro and the Colorado Front Range",
  founded: 2011,
  registration: "HX-2011-448",
};

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/blueprints", label: "Blueprints" },
  { href: "/story", label: "Story" },
  { href: "/trades", label: "Trades" },
  { href: "/reviews", label: "Reviews" },
] as const;

export const processSteps = [
  {
    n: "01",
    title: "Consult",
    copy: "We walk the site, measure what is actually there, and name the work Helix will self-perform.",
  },
  {
    n: "02",
    title: "Estimate",
    copy: "A written scope for framing, envelope, and any trade we will carry on our schedule.",
  },
  {
    n: "03",
    title: "Permit",
    copy: "We assemble the packet, or pull the permit, for the jurisdiction that owns the address.",
  },
  {
    n: "04",
    title: "Frame",
    copy: "Walls, floors, roofs, beams, and the temporary bracing that keeps the house true.",
  },
  {
    n: "05",
    title: "Dry-in",
    copy: "Sheathing, windows set with the right partners, and a roof that can take weather.",
  },
  {
    n: "06",
    title: "Siding",
    copy: "Rainscreen, flashings, and the finish skin: lap, panel, or board-and-batten.",
  },
  {
    n: "07",
    title: "Punch",
    copy: "A walk with the owner. Open items get a date, not a shrug.",
  },
] as const;

export type Service = {
  slug: ServiceSlug;
  name: string;
  kicker: string;
  summary: string;
  lede: string;
  scope: string[];
  sequence: string[];
  plate: PlateKind;
};

export const services: Service[] = [
  {
    slug: "framing",
    name: "Framing",
    kicker: "Structure",
    summary: "Floors, walls, roofs, and the beams that change how a house lives.",
    lede: "Helix started as a framing crew and still treats the skeleton as the job that everything else has to trust. We frame additions, new homes, garage apartments, and the openings that let a kitchen breathe.",
    scope: [
      "Floor systems, shear walls, and roof framing",
      "Engineered beams, flush beams, and point loads",
      "Stair openings, window packages, and temporary weather protection",
      "Layout that matches the drawings, not a guess at the chalk line",
    ],
    sequence: [
      "Verify the foundation or existing plate before the first stud stands",
      "Stand walls, set beams, and roll the roof",
      "Sheathe and brace so the inspector sees a complete load path",
      "Hand the dried-in shell to the envelope crew",
    ],
    plate: "frame",
  },
  {
    slug: "siding",
    name: "Siding",
    kicker: "Envelope",
    summary: "The rainscreen and finish skin that close the house against Front Range weather.",
    lede: "A straight frame is only half the promise. Helix installs fiber-cement lap, panel, and board-and-batten over a drained cavity, with flashings that are drawn before they are bent.",
    scope: [
      "Weather barrier, furring, and rainscreen cavities",
      "Fiber cement, wood, and engineered lap or panel",
      "Window, door, and roof-to-wall flashing details",
      "Soffit, fascia, and trim that lines up with the frame",
    ],
    sequence: [
      "Read the wall section and mark every penetration",
      "Install the drainage plane and flash the openings",
      "Hang the finish courses to a story pole, not to the eye",
      "Seal, caulk, and walk the elevations with the owner",
    ],
    plate: "siding",
  },
  {
    slug: "decking",
    name: "Decking",
    kicker: "Exterior floors",
    summary: "Framed decks, stairs, and guards built to the same standard as the house.",
    lede: "A deck is a floor that lives outside. We frame ledgers, beams, and joists as structure first, then set the walking surface and the guard so the whole assembly feels like part of the house.",
    scope: [
      "Ledger flashing and structural attachment to the rim",
      "Posts, beams, joists, and stair stringers",
      "Composite, cedar, and hardwood walking surfaces",
      "Guards and handrails that pass the local code check",
    ],
    sequence: [
      "Confirm height, drainage, and the door threshold",
      "Set the frame and have it inspected before the decking hides it",
      "Install the surface, picture-frame borders, and stairs",
      "Finish with guards tied back to the structure",
    ],
    plate: "deck",
  },
  {
    slug: "outdoor-structures",
    name: "Outdoor structures",
    kicker: "Pavilions and covers",
    summary: "Pergolas, pavilions, and covered outdoor rooms tied into the house.",
    lede: "Shade structures fail when they are treated like furniture. Helix frames pergolas, pavilions, and covered patios with real connections, then coordinates roofing or a finish ceiling with the trade that owns that layer.",
    scope: [
      "Freestanding and house-attached covers",
      "Timber and dimensional lumber frames",
      "Roofed pavilions coordinated with our roofing partner",
      "Columns, beams, and footings laid out with the concrete crew",
    ],
    sequence: [
      "Set footings with the concrete partner before any post goes up",
      "Raise the frame and lock the geometry",
      "Hand the roof or finish ceiling to the right trade",
      "Trim and punch so the outdoor room matches the house",
    ],
    plate: "pavilion",
  },
  {
    slug: "remodels",
    name: "Remodels",
    kicker: "Opened plans",
    summary: "Beams, new openings, and rebuilt walls inside houses that stay occupied.",
    lede: "Remodels are framing jobs that have to be polite. We shore, cut, and rebuild while a family is often still in the house, and we keep electricians, plumbers, and HVAC on a sequence that does not trap anyone.",
    scope: [
      "Load-bearing wall removal and beam packages",
      "Kitchen and bath wall rebuilds",
      "Floor repairs and stair revisions",
      "Coordination with mechanical trades already in the walls",
    ],
    sequence: [
      "Shore before we cut, and photograph the existing structure",
      "Set the new beam or wall and call inspection",
      "Bring in the trade that has to land in that opening",
      "Leave the shell ready for drywall, not half-decided",
    ],
    plate: "remodel",
  },
  {
    slug: "additions",
    name: "Additions",
    kicker: "New volume",
    summary: "Rear additions, second stories, and rooms that have to meet the old house cleanly.",
    lede: "An addition is a small building married to an old one. Helix frames the new volume, ties the roofs, and sides the joint so the seam does not announce itself every time it rains.",
    scope: [
      "Single-story and second-story additions",
      "Roof tie-ins and cricket framing",
      "New floor systems over crawl spaces or slabs",
      "Envelope work where new siding meets old",
    ],
    sequence: [
      "Protect the existing house and establish a benchmark",
      "Frame the addition through dry-in",
      "Side and flash the tie-in before interior trades stack up",
      "Punch the exterior before we call the job closed",
    ],
    plate: "addition",
  },
];

export type PlateKind =
  | "frame"
  | "siding"
  | "deck"
  | "pavilion"
  | "remodel"
  | "addition"
  | "batten"
  | "adu";

export type Project = {
  slug: string;
  title: string;
  neighborhood: string;
  city: string;
  year: string;
  category: ServiceSlug;
  services: ServiceSlug[];
  plate: PlateKind;
  summary: string;
  challenge: string;
  scope: string[];
  trades: string[];
  outcome: string;
  figures: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: "sloans-lake-addition",
    title: "Sloan's Lake rear addition",
    neighborhood: "Sloan's Lake",
    city: "Denver",
    year: "2024",
    category: "additions",
    services: ["additions", "framing", "siding"],
    plate: "addition",
    summary:
      "A two-story rear addition that gave a 1924 bungalow a kitchen and a bedroom without tipping the old roof.",
    challenge:
      "The existing rafters were undersized for a clean tie-in, and the alley grade left almost no room for a crawl access.",
    scope: [
      "640 square feet of new floor across two levels",
      "New ridge and valley framing married to the original roof",
      "Fiber-cement lap that steps into the original reveal",
      "Temporary shoring so the kitchen stayed usable for ten days",
    ],
    trades: ["Platte Form Concrete", "Ridgeline Roofing", "Northline Electric", "Clear Creek Mechanical"],
    outcome:
      "The addition reads as part of the bungalow from the alley, and the kitchen opened the week the siding was punched.",
    figures: [
      { label: "Added area", value: "640 sf" },
      { label: "Frame duration", value: "11 days" },
      { label: "Stories", value: "2" },
    ],
  },
  {
    slug: "highlands-lap-replacement",
    title: "Highlands full lap replacement",
    neighborhood: "Highlands",
    city: "Denver",
    year: "2025",
    category: "siding",
    services: ["siding"],
    plate: "siding",
    summary:
      "A complete fiber-cement replacement on a three-story Victorian, including window flashings the last crew had skipped.",
    challenge:
      "Three stories, a brick party wall, and window openings that were out of square by nearly an inch.",
    scope: [
      "Strip to the sheathing and replace soft boards",
      "New weather barrier and a drained furring grid",
      "Lap siding with a 6-inch reveal and copper corner accents",
      "Rebuilt window pans at fourteen openings",
    ],
    trades: ["Glassline Windows"],
    outcome:
      "The elevations went back to a single reveal, and the spring storm that followed stayed outside.",
    figures: [
      { label: "Elevation", value: "3 stories" },
      { label: "Openings reflashed", value: "14" },
      { label: "Reveal", value: "6 in" },
    ],
  },
  {
    slug: "berkeley-deck",
    title: "Berkeley deck and stair",
    neighborhood: "Berkeley",
    city: "Denver",
    year: "2023",
    category: "decking",
    services: ["decking", "framing"],
    plate: "deck",
    summary:
      "A framed cedar deck and a switchback stair that replaced a rotting platform off a brick foursquare.",
    challenge:
      "The brick rim would not take a conventional ledger, and the yard dropped four feet to the garage.",
    scope: [
      "Freestanding frame with a flashed ledger used only as a lateral tie",
      "Cedar joists, a picture-frame border, and hidden fasteners",
      "Switchback stair with a mid landing",
      "Cable-and-wood guard coordinated to the stair code",
    ],
    trades: ["Platte Form Concrete"],
    outcome:
      "The deck is independent of the brick, and the stair lands at the garage without a makeshift step.",
    figures: [
      { label: "Deck", value: "420 sf" },
      { label: "Drop", value: "4 ft" },
      { label: "Landings", value: "1" },
    ],
  },
  {
    slug: "wash-park-opening",
    title: "Wash Park kitchen opening",
    neighborhood: "Washington Park",
    city: "Denver",
    year: "2024",
    category: "remodels",
    services: ["remodels", "framing"],
    plate: "remodel",
    summary:
      "A bearing wall came out between the kitchen and the dining room, replaced by a flush beam the plaster could hide.",
    challenge:
      "The house stayed occupied, and a cast-iron stack sat two studs away from the cut.",
    scope: [
      "Temporary shore on both floors",
      "Flush LVL package and new king studs",
      "Reframed window seat that shared the same wall",
      "Sequence that let the plumber move the stack before drywall",
    ],
    trades: ["Front Range Pipe", "Interior Plane Drywall", "Northline Electric"],
    outcome:
      "One room now, with the beam invisible and the stack relocated before the plaster crew arrived.",
    figures: [
      { label: "Opening", value: "14 ft" },
      { label: "Occupied", value: "Yes" },
      { label: "Beam", value: "Flush" },
    ],
  },
  {
    slug: "arvada-adu",
    title: "Arvada garage and ADU frame",
    neighborhood: "Olde Town",
    city: "Arvada",
    year: "2025",
    category: "framing",
    services: ["framing", "siding", "additions"],
    plate: "adu",
    summary:
      "A new two-car garage with a studio above, framed and sided as a detached building on a tight lot.",
    challenge:
      "Alley access, a five-foot side yard, and a stair that had to clear the garage door track.",
    scope: [
      "Full wood frame over a slab poured by our concrete partner",
      "Roof trusses set from the alley",
      "Board-and-batten on the alley elevation, lap on the yard side",
      "Stair opening coordinated with the mechanical closet",
    ],
    trades: ["Platte Form Concrete", "Ridgeline Roofing", "Clear Creek Mechanical", "Northline Electric"],
    outcome:
      "The studio dried in before the first snow, and the alley elevation matches the house across the yard.",
    figures: [
      { label: "Garage", value: "2-car" },
      { label: "Studio", value: "480 sf" },
      { label: "Access", value: "Alley" },
    ],
  },
  {
    slug: "foothills-batten",
    title: "Foothills board-and-batten",
    neighborhood: "Coal Creek",
    city: "Boulder County",
    year: "2023",
    category: "siding",
    services: ["siding", "outdoor-structures"],
    plate: "batten",
    summary:
      "A mountain-modern reclad with board-and-batten and a new entry pavilion that shares the same battens.",
    challenge:
      "Wind exposure on a west wall, and an owner who wanted the pavilion to look integral, not bolted on.",
    scope: [
      "Rainscreen on all four elevations",
      "Vertical board-and-batten with a dark cedar stain",
      "Entry pavilion framed and wrapped in the same system",
      "Metal flashing at the stone base, coordinated with the mason",
    ],
    trades: ["Ridgeline Roofing", "Stonework by Field & Course"],
    outcome:
      "The pavilion and the house share one rhythm, and the west wall has a cavity that can actually dry.",
    figures: [
      { label: "Elevations", value: "4" },
      { label: "Pavilion", value: "New" },
      { label: "Exposure", value: "West wind" },
    ],
  },
  {
    slug: "cherry-creek-porch",
    title: "Cherry Creek porch enclosure",
    neighborhood: "Cherry Creek",
    city: "Denver",
    year: "2022",
    category: "outdoor-structures",
    services: ["outdoor-structures", "framing", "siding"],
    plate: "pavilion",
    summary:
      "An open porch became a conditioned-ready sunroom frame, with the original columns saved and sistered.",
    challenge:
      "The 1950s columns were decorative. The new roof load needed a real post inside each one.",
    scope: [
      "Sistered posts hidden inside the existing column wraps",
      "New roof framing and a cricket against the second floor",
      "Window package openings framed for Glassline",
      "Siding returns that die into the original brick",
    ],
    trades: ["Glassline Windows", "Ridgeline Roofing", "Northline Electric"],
    outcome:
      "The porch still looks like the original elevation, and it is ready for glass without a second frame.",
    figures: [
      { label: "Bays", value: "3" },
      { label: "Columns saved", value: "4" },
      { label: "Ready for glass", value: "Yes" },
    ],
  },
  {
    slug: "lakewood-accessory",
    title: "Lakewood studio structure",
    neighborhood: "Applewood",
    city: "Lakewood",
    year: "2024",
    category: "outdoor-structures",
    services: ["outdoor-structures", "framing", "decking"],
    plate: "pavilion",
    summary:
      "A backyard studio framed as a small building, with a cedar deck that ties the door to the main house.",
    challenge:
      "Jefferson County wanted the deck and the studio on one permit set, and the lot drainage ran through the middle.",
    scope: [
      "12 by 16 framed studio on piers",
      "Deck bridge over the drainage swale",
      "Lap siding to match the 1970s house",
      "One permit set covering both structures",
    ],
    trades: ["Platte Form Concrete", "Northline Electric"],
    outcome:
      "Both structures were permitted together and inspected on the same afternoon.",
    figures: [
      { label: "Studio", value: "12×16" },
      { label: "Permit sets", value: "1" },
      { label: "Deck link", value: "Yes" },
    ],
  },
];

export type BlueprintKind = "floor" | "wall" | "deck" | "section";

export type Blueprint = {
  slug: string;
  title: string;
  sheet: string;
  projectSlug: string;
  kind: BlueprintKind;
  summary: string;
  notes: string[];
};

export const blueprints: Blueprint[] = [
  {
    slug: "sloans-floor-plate",
    title: "Sloan's Lake floor plate",
    sheet: "A2.1",
    projectSlug: "sloans-lake-addition",
    kind: "floor",
    summary:
      "First-floor plate for the rear addition. Joists run east-west and land on a new beam at the existing dining wall.",
    notes: [
      "Hold the new plate 1/2 inch off the existing siding until the flashing leg is in",
      "Joist hangers at the existing rim, not toenails",
      "Stair opening shown dashed until the second-floor trimmers are set",
    ],
  },
  {
    slug: "rainscreen-wall-section",
    title: "Rainscreen wall section",
    sheet: "A5.3",
    projectSlug: "highlands-lap-replacement",
    kind: "wall",
    summary:
      "Typical fiber-cement wall at the Highlands reclad. A drained cavity sits between the weather barrier and the lap.",
    notes: [
      "Furring is 3/8 inch, broken at each window head for drainage",
      "Lap reveal is 6 inches, story-poled from the water table",
      "Kick-out flashing required where the side wall meets a lower roof",
    ],
  },
  {
    slug: "berkeley-deck-framing",
    title: "Berkeley deck framing",
    sheet: "S1.2",
    projectSlug: "berkeley-deck",
    kind: "deck",
    summary:
      "Freestanding deck frame. The ledger is a lateral tie only. Beams carry the gravity load to new footings.",
    notes: [
      "Double rim on the yard edge where the stair header lands",
      "Joists 12 inches on center under the cedar picture frame",
      "Post bases set before any beam is rolled",
    ],
  },
  {
    slug: "sloans-addition-section",
    title: "Addition roof tie-in",
    sheet: "A6.0",
    projectSlug: "sloans-lake-addition",
    kind: "section",
    summary:
      "Building section through the new ridge and the existing bungalow roof. The valley is framed, not overframed onto the old rafters.",
    notes: [
      "Existing rafters sistered for four feet back from the tie-in",
      "Cricket framed before shingles, coordinated with Ridgeline",
      "New wall sheathing laps the existing weather barrier by 6 inches",
    ],
  },
];

export {
  chapters,
  team,
  trades,
  heroPhoto,
  servicePhotos,
  projectPhotos,
  serviceComparisons,
  blueprintComparisons,
  defaultDesignId,
  getDesign,
  getTrade,
  getTradeByName,
  allowanceRates,
  serviceTrades,
} from "./catalog";
export type { Comparison, DesignOption } from "./catalog";

export const reviews = [
  {
    name: "Claire Nguyen",
    neighborhood: "Sloan's Lake",
    project: "Rear addition",
    quote:
      "Helix framed the addition and sided the tie-in, and they were the ones who called the roofer and the electrician. I did not have to run a second project.",
  },
  {
    name: "Andre Williams",
    neighborhood: "Highlands",
    project: "Siding replacement",
    quote:
      "They stripped the old lap, showed me the soft sheathing, and did not cover a window until I had seen the pan. The reveal is finally even on all three floors.",
  },
  {
    name: "Ruth Keller",
    neighborhood: "Berkeley",
    project: "Deck",
    quote:
      "The old deck was nailed into brick that could not hold it. The new one stands on its own footings and the stair actually meets the yard.",
  },
  {
    name: "Diego Morales",
    neighborhood: "Washington Park",
    project: "Kitchen opening",
    quote:
      "We stayed in the house. They shored the floor, set a flush beam, and had the plumber in the same week. The opening looks like it was always there.",
  },
  {
    name: "Helen Park",
    neighborhood: "Arvada",
    project: "Garage and studio",
    quote:
      "Alley lot, tight setbacks, one crew for the frame and the siding. The county inspections were scheduled before we asked.",
  },
  {
    name: "Samir Adeyemi",
    neighborhood: "Boulder County",
    project: "Board-and-batten",
    quote:
      "The pavilion and the house share the same battens. You can tell one person was in charge of both, which has not been our experience with mountain contractors.",
  },
  {
    name: "June Ellison",
    neighborhood: "Cherry Creek",
    project: "Porch enclosure",
    quote:
      "They kept the old columns and hid new posts inside them. The porch still looks like 1958, and it is finally ready for glass.",
  },
  {
    name: "Owen Blake",
    neighborhood: "Lakewood",
    project: "Backyard studio",
    quote:
      "Jefferson County wanted the deck and the studio on one drawing set. Helix already had that sheet. Both inspections happened the same day.",
  },
];

export const jurisdictions = [
  {
    name: "Denver",
    note: "Building permits run through Community Planning and Development. Opening the sidewalk or alley for a sewer or a crane is a separate right-of-way permit.",
  },
  {
    name: "Jefferson",
    note: "Unincorporated Jeffco, Lakewood, Arvada, and Wheat Ridge each issue their own building permits. The address decides the counter, not the ZIP code alone.",
  },
  {
    name: "Adams",
    note: "Unincorporated Adams County differs from Westminster, Thornton, and Commerce City. We confirm the authority before we draw a sheet index.",
  },
  {
    name: "Arapahoe",
    note: "Aurora, Centennial, and unincorporated Arapahoe do not share one checklist. Additions near a floodplain need an extra look before framing.",
  },
  {
    name: "Boulder",
    note: "The city has overlay rules on some older blocks. Mountain properties in the county add wildfire and access notes to the same structural set.",
  },
];

export const permitSplit = {
  helix: [
    "Building permit application and the sheet index",
    "Structural drawings for the frame, deck, or addition we are building",
    "Scheduling the rough-frame and envelope inspections",
    "Calling the trade whose license has to sit on a mechanical permit",
  ],
  owner: [
    "Owner signature where the jurisdiction requires it",
    "HOA or design-review approval before we submit",
    "Utility account changes and alley access letters",
    "Decisions that change the use of the property, such as a new dwelling unit",
  ],
};

export const stats = [
  { value: 2011, label: "Framing since", display: "2011" },
  { value: 180, label: "Shells closed", display: "180+" },
  { value: 8, label: "Trades on the bench", display: "8" },
  { value: 5, label: "Front Range counties", display: "5" },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getBlueprint(slug: string) {
  return blueprints.find((sheet) => sheet.slug === slug);
}

export function projectsForService(slug: ServiceSlug) {
  return projects.filter((project) => project.services.includes(slug));
}

export function serviceName(slug: ServiceSlug) {
  return services.find((service) => service.slug === slug)?.name ?? slug;
}
