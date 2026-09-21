import type { ServiceSlug } from "@/lib/content-types";

export type { ServiceSlug };

const m = (file: string) => `/media/${file}`;

export const heroPhoto = m("hero-denver-house.png");

export const servicePhotos: Record<ServiceSlug, string> = {
  framing: m("service-framing.png"),
  siding: m("service-siding.png"),
  decking: m("service-decking.png"),
  "outdoor-structures": m("service-outdoor.png"),
  remodels: m("service-remodels.png"),
  additions: m("service-additions.png"),
};

export const projectPhotos: Record<string, string> = {
  "sloans-lake-addition": m("ba-sloans-roof-after.png"),
  "highlands-lap-replacement": m("ba-rainscreen-after.png"),
  "berkeley-deck": m("ba-berkeley-deck-after.png"),
  "wash-park-opening": m("ba-remodel-after.png"),
  "foothills-batten": m("design-siding-batten-graphite.png"),
  "cherry-creek-porch": m("design-outdoor-attached.png"),
  "arvada-adu": m("ba-framing-after.png"),
  "lakewood-accessory": m("design-addition-volume.png"),
};

export type Comparison = {
  before: string;
  after: string;
  caption: string;
};

export const serviceComparisons: Record<ServiceSlug, Comparison> = {
  framing: {
    before: m("ba-framing-before.png"),
    after: m("ba-framing-after.png"),
    caption: "A bare stem wall, then the same addition framed through the roof.",
  },
  siding: {
    before: m("ba-siding-before.png"),
    after: m("ba-siding-after.png"),
    caption: "Weather barrier and open flashing, then graphite lap over the rainscreen.",
  },
  decking: {
    before: m("ba-deck-before.png"),
    after: m("ba-deck-after.png"),
    caption: "A back door onto dirt, then a composite deck with a picture-frame border.",
  },
  "outdoor-structures": {
    before: m("ba-outdoor-before.png"),
    after: m("ba-outdoor-after.png"),
    caption: "An open flagstone patio, then a timber pergola tied to the house.",
  },
  remodels: {
    before: m("ba-remodel-before.png"),
    after: m("ba-remodel-after.png"),
    caption: "A closed kitchen wall, then the opening after the beam is in.",
  },
  additions: {
    before: m("ba-addition-before.png"),
    after: m("ba-addition-after.png"),
    caption: "A plain brick side yard, then the new volume flashed into the old wall.",
  },
};

export const blueprintComparisons: Record<string, Comparison> = {
  "sloans-floor-plate": {
    before: m("ba-sloans-floor-before.png"),
    after: m("ba-sloans-floor-after.png"),
    caption: "The dining wall before it was opened, and the new floor plate landing on the beam.",
  },
  "rainscreen-wall-section": {
    before: m("ba-rainscreen-before.png"),
    after: m("ba-rainscreen-after.png"),
    caption: "Uneven lap on the Highlands house, then the reclad with an even reveal.",
  },
  "berkeley-deck-framing": {
    before: m("ba-berkeley-deck-before.png"),
    after: m("ba-berkeley-deck-after.png"),
    caption: "The sagging ledger deck, then the freestanding frame on new piers.",
  },
  "sloans-addition-section": {
    before: m("ba-sloans-roof-before.png"),
    after: m("ba-sloans-roof-after.png"),
    caption: "The bungalow roof alone, then the valley and cricket at the tie-in.",
  },
};

export { defaultDesignId, getDesign } from "./scenes";
export type { DesignOption } from "./scenes";

export const chapters = [
  {
    year: "2011",
    title: "A bay in Globeville",
    image: m("story-globeville-bay.png"),
    copy: "Lena Hart and two framers rented a bay off Washington Street and took wall packages other crews did not want. The name Helix came from the way a stair opening twists through a floor: a simple shape that has to be exact. They owned a truck, a radial-arm saw, and a habit of measuring the existing plate before they trusted a drawing.",
  },
  {
    year: "2014",
    title: "Whole houses, not just walls",
    image: m("story-wheat-ridge-frame.png"),
    copy: "The first full custom frame was a Wheat Ridge bungalow rebuild. Owners started asking Helix to stay through the roof instead of handing the shell to whoever was free. That job taught the company to sheathe, brace, and call inspection as one act, not three favors.",
  },
  {
    year: "2017",
    title: "The envelope crew",
    image: m("story-envelope-crew.png"),
    copy: "After three jobs where the siding crew missed the flashing we had framed for, Helix hired Priya Shah and started closing the walls we had just stood up. The rule from that year still holds: a window pan is photographed before the lap covers it, and the reveal is story-poled, not eyed.",
  },
  {
    year: "2020",
    title: "A bench of trades",
    image: m("story-trade-bench.png"),
    copy: "Remodels made it obvious that a framer who will not call the plumber is a delay. Helix formalized a trade bench: electricians, plumbers, roofers, concrete, HVAC, insulation, windows, and drywall we schedule, not a list we hand to the owner. They keep their licenses. We keep the calendar.",
  },
  {
    year: "2024",
    title: "Decatur Street",
    image: m("story-decatur-shop.png"),
    copy: "The shop moved to a bay in the Highlands, with Sofia on the estimates and Evan on the schedule. Ruthie runs the lumber. Daniel runs the permit counters. Framing and siding stayed in house. The address is 2145 Decatur Street, Suite B, and the door still opens at seven.",
  },
  {
    year: "Now",
    title: "How a job is run",
    image: m("story-job-walk.png"),
    copy: "Lena or Cole walks the site before a number goes out. Marcus layouts the frame. Priya and Naomi own the skin. Luis cuts the stairs that are too tight to delegate. Maya is on the crew, not beside it. The owner still gets one phone number when the roofer and the inspector are supposed to share a morning.",
  },
];

export const team = [
  {
    name: "Lena Hart",
    role: "Principal",
    since: "2011",
    image: m("portrait-lena-hart.png"),
    bio: "Lena still walks every job before a number goes out. She ran the Globeville crew, wrote the first trade agreements, and keeps the company on framing and siding instead of drifting into a general free-for-all.",
  },
  {
    name: "Marcus Hale",
    role: "Lead framer",
    since: "2013",
    image: m("portrait-marcus-hale.png"),
    bio: "Marcus layouts additions and beam openings. He is the person who decides where the shore goes before a bearing wall comes out, and he still cuts the first plate on every addition.",
  },
  {
    name: "Priya Shah",
    role: "Envelope lead",
    since: "2017",
    image: m("portrait-priya-shah.png"),
    bio: "Priya built the siding standard: story poles, rainscreen gaps, and a photo of every window pan before the lap covers it. She runs the Highlands reclads and the mountain board-and-batten work.",
  },
  {
    name: "Cole Brennan",
    role: "Field superintendent",
    since: "2016",
    image: m("portrait-cole-brennan.png"),
    bio: "Cole is on the job when Lena is at the next walk. He keeps the frame square, the bracing up until inspection, and the site clear enough that a trade can actually work the morning they are promised.",
  },
  {
    name: "Naomi Okonkwo",
    role: "Siding lead",
    since: "2018",
    image: m("portrait-naomi-okonkwo.png"),
    bio: "Naomi hangs the courses Priya lays out. She runs the batten layouts and the color breaks, and she will pull a sheet off the wall before she will hide a bad joint.",
  },
  {
    name: "Luis Ortega",
    role: "Stair carpenter",
    since: "2015",
    image: m("portrait-luis-ortega.png"),
    bio: "Luis cuts the stairs that do not fit a stock stringer. Winding openings, tight bungalow runs, and the finish treads on remodels stay on his list.",
  },
  {
    name: "Ruthie Lang",
    role: "Shop lead",
    since: "2014",
    image: m("portrait-ruthie-lang.png"),
    bio: "Ruthie runs the Decatur bay. Lumber is racked by length, beams are stickered, and a crew does not leave in the morning short a hanger because the order was a guess.",
  },
  {
    name: "Evan Brooks",
    role: "Project coordinator",
    since: "2021",
    image: m("portrait-evan-brooks.png"),
    bio: "Evan keeps the trade bench on a single calendar. If the roofer, the electrician, and the inspector are supposed to share a morning, he is the one who makes that true.",
  },
  {
    name: "Sofia Alvarez",
    role: "Estimator",
    since: "2022",
    image: m("portrait-sofia-alvarez.png"),
    bio: "Sofia turns a walkthrough into a scope an owner can read. She prices framing and siding in house and carries allowances for the partners Helix will schedule.",
  },
  {
    name: "Daniel Cho",
    role: "Permit coordinator",
    since: "2023",
    image: m("portrait-daniel-cho.png"),
    bio: "Daniel sits at the Denver, Jeffco, and south-metro counters. He builds the sheet index, tracks corrections, and tells the crew which inspection is actually on the books.",
  },
  {
    name: "Maya Solis",
    role: "Apprentice framer",
    since: "2024",
    image: m("portrait-maya-solis.png"),
    bio: "Maya is in her second year on the frame. She layouts plates with Marcus, stands walls, and is learning the window pans with Naomi so the envelope is not a mystery when the studs are done.",
  },
];

export const trades = [
  {
    slug: "northline-electric",
    name: "Northline Electric",
    craft: "Electrical",
    phone: "(303) 555-0172",
    phoneHref: "tel:+13035550172",
    email: "desk@northline-electric.example",
    website: "https://northline-electric.example",
    websiteLabel: "northline-electric.example",
    address: "1820 S Broadway",
    city: "Denver, CO 80210",
    area: "Baker, south of downtown",
    hours: "Monday–Friday, 7:00 a.m.–4:00 p.m.",
    license: "Sample license NL-EC-4412",
    owns: "Service upgrades, new circuits in additions, and temporary power for the frame.",
    history:
      "Northline started as a two-van shop on South Broadway and still answers from that street. Helix calls them when an addition outgrows the existing panel or a remodel opens a wall full of unmarked circuits.",
    onHelix:
      "They set temporary power before we stand walls, pull the new home runs while the frame is open, and come back for devices after drywall. Evan puts them on the same morning as the rough inspection when the panel is part of the scope.",
  },
  {
    slug: "front-range-pipe",
    name: "Front Range Pipe",
    craft: "Plumbing",
    phone: "(720) 555-0144",
    phoneHref: "tel:+17205550144",
    email: "office@front-range-pipe.example",
    website: "https://front-range-pipe.example",
    websiteLabel: "front-range-pipe.example",
    address: "3490 S Federal Blvd",
    city: "Englewood, CO 80110",
    area: "Englewood",
    hours: "Monday–Friday, 6:30 a.m.–3:30 p.m.",
    license: "Sample license FR-PB-2281",
    owns: "Relocated stacks, new baths in additions, and the underslab work before we frame.",
    history:
      "Front Range Pipe works south Denver and Englewood from a yard on South Federal. They are the crew under the slab before Helix sets a sill.",
    onHelix:
      "They move stacks in occupied remodels, set the new bath rough in an addition, and leave the framing bays clear. We do not bury their vents in a joist bay we failed to coordinate.",
  },
  {
    slug: "ridgeline-roofing",
    name: "Ridgeline Roofing",
    craft: "Roofing",
    phone: "(303) 555-0194",
    phoneHref: "tel:+13035550194",
    email: "jobs@ridgeline-roofing.example",
    website: "https://ridgeline-roofing.example",
    websiteLabel: "ridgeline-roofing.example",
    address: "4101 S Santa Fe Dr",
    city: "Englewood, CO 80110",
    area: "Englewood",
    hours: "Monday–Friday, 7:00 a.m.–4:00 p.m.",
    license: "Sample license RR-RF-7730",
    owns: "Dry-in on additions, valley tie-ins, and the metal roofs on pavilions.",
    history:
      "Ridgeline runs steep-slope and low-slope work from Santa Fe Drive. Helix has used them since the first whole-house frames, because a valley framed cleanly still needs a roofer who will not bury the cricket.",
    onHelix:
      "They dry in additions, flash the tie-in to the old roof, and set metal on pavilions. The sheathing is ours. The shingles and the warranty on them are theirs.",
  },
  {
    slug: "platte-form-concrete",
    name: "Platte Form Concrete",
    craft: "Concrete",
    phone: "(303) 555-0160",
    phoneHref: "tel:+13035550160",
    email: "dispatch@platte-form.example",
    website: "https://platte-form.example",
    websiteLabel: "platte-form.example",
    address: "2895 W Evans Ave",
    city: "Denver, CO 80219",
    area: "Athmar Park",
    hours: "Monday–Friday, 6:00 a.m.–3:00 p.m.",
    license: "Sample license PF-CC-1904",
    owns: "Footings, slabs for garages and studios, and the piers under freestanding decks.",
    history:
      "Platte Form pours from a yard on West Evans. They are in the ground before Helix is in the air, which is the only order that works.",
    onHelix:
      "Footings for additions, piers for decks and pergolas, and slabs for studios. We lay out the bolts. They do not guess the benchmark.",
  },
  {
    slug: "clear-creek-mechanical",
    name: "Clear Creek Mechanical",
    craft: "HVAC",
    phone: "(720) 555-0188",
    phoneHref: "tel:+17205550188",
    email: "service@clear-creek-mechanical.example",
    website: "https://clear-creek-mechanical.example",
    websiteLabel: "clear-creek-mechanical.example",
    address: "5501 S Prince St",
    city: "Littleton, CO 80120",
    area: "Littleton",
    hours: "Monday–Friday, 7:30 a.m.–4:30 p.m.",
    license: "Sample license CC-HV-5520",
    owns: "Duct extensions, mini-splits in studios, and the equipment that has to land before drywall.",
    history:
      "Clear Creek Mechanical works Littleton and the south metro from Prince Street. Helix brings them in when a new volume needs air and the old furnace cannot reach it.",
    onHelix:
      "They run ducts through the joist bays we leave open, set mini-splits in studios, and land equipment before Interior Plane closes the ceiling.",
  },
  {
    slug: "thermal-bay",
    name: "Thermal Bay",
    craft: "Insulation",
    phone: "(303) 555-0133",
    phoneHref: "tel:+13035550133",
    email: "crew@thermal-bay.example",
    website: "https://thermal-bay.example",
    websiteLabel: "thermal-bay.example",
    address: "2205 S Sheridan Blvd",
    city: "Denver, CO 80227",
    area: "Southwest Denver",
    hours: "Monday–Friday, 7:00 a.m.–3:30 p.m.",
    license: "Sample license TB-IN-3088",
    owns: "Cavity and continuous insulation once the envelope is inspected.",
    history:
      "Thermal Bay insulates from a shop on South Sheridan. They do not show up until the envelope inspection is actually passed, which keeps them from packing a wall we still have to open.",
    onHelix:
      "Cavity insulation in additions and remodels, and continuous insulation when the wall section calls for it. Priya’s rainscreen is already on the outside by then.",
  },
  {
    slug: "glassline-windows",
    name: "Glassline Windows",
    craft: "Windows and glazing",
    phone: "(720) 555-0119",
    phoneHref: "tel:+17205550119",
    email: "orders@glassline-windows.example",
    website: "https://glassline-windows.example",
    websiteLabel: "glassline-windows.example",
    address: "1680 W Oxford Ave",
    city: "Sheridan, CO 80110",
    area: "Sheridan",
    hours: "Monday–Friday, 8:00 a.m.–5:00 p.m.",
    license: "Sample license GL-WD-6641",
    owns: "Window packages we frame for, set on the pans Priya’s crew builds.",
    history:
      "Glassline supplies and sets windows from Oxford Avenue in Sheridan. Helix frames the opening. Glassline does not invent a new rough opening on install day.",
    onHelix:
      "They set units on the pans we have already photographed, and they come back for the stops after the lap is on. The flashing is ours.",
  },
  {
    slug: "interior-plane",
    name: "Interior Plane",
    craft: "Drywall",
    phone: "(303) 555-0157",
    phoneHref: "tel:+13035550157",
    email: "schedule@interior-plane.example",
    website: "https://interior-plane.example",
    websiteLabel: "interior-plane.example",
    address: "980 S Broadway",
    city: "Denver, CO 80209",
    area: "South Broadway",
    hours: "Monday–Friday, 7:00 a.m.–4:00 p.m.",
    license: "Sample license IP-DW-1190",
    owns: "The close-in after our punch on the frame, especially flush beam openings.",
    history:
      "Interior Plane hangs and finishes from a shop on South Broadway. They are the reason a flush beam can disappear into a ceiling without a wave.",
    onHelix:
      "They close additions and remodel openings after the frame inspection and after the mechanical rough. We leave the backing. They leave a ceiling an owner can paint.",
  },
];

export function getTrade(slug: string) {
  return trades.find((trade) => trade.slug === slug);
}

export function getTradeByName(name: string) {
  return trades.find((trade) => trade.name === name || name.startsWith(trade.name));
}

export const allowanceRates: Record<ServiceSlug, { low: number; high: number; unit: string }> = {
  framing: { low: 22, high: 38, unit: "framed square foot" },
  siding: { low: 14, high: 28, unit: "finished wall square foot" },
  decking: { low: 55, high: 95, unit: "deck square foot" },
  "outdoor-structures": { low: 85, high: 170, unit: "square foot of cover" },
  remodels: { low: 40, high: 80, unit: "square foot of opened area" },
  additions: { low: 75, high: 150, unit: "square foot of new area" },
};

export const serviceTrades: Record<ServiceSlug, string[]> = {
  framing: ["Platte Form Concrete"],
  siding: ["Glassline Windows", "Ridgeline Roofing"],
  decking: ["Platte Form Concrete"],
  "outdoor-structures": ["Platte Form Concrete", "Ridgeline Roofing"],
  remodels: ["Northline Electric", "Front Range Pipe", "Interior Plane"],
  additions: ["Platte Form Concrete", "Ridgeline Roofing", "Northline Electric", "Clear Creek Mechanical"],
};
