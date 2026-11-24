import { unsplash } from "./format";
import type {
  Category,
  CategoryId,
  Product,
  SelectedVariants,
  SortKey,
  VariantGroup,
} from "./types";

export const BRAND = {
  name: "Halden & Vale",
  short: "H&V",
  promise: "Architectural objects for considered living",
} as const;

export const FREE_SHIPPING_THRESHOLD = 250;
export const STANDARD_SHIPPING = 18;
export const PROMO_CODES: Record<string, { rate: number; label: string }> = {
  AURUM10: { rate: 0.1, label: "Aurum North — 10% off" },
};

const BRASS_FINISHES: VariantGroup = {
  id: "finish",
  label: "Finish",
  options: [
    { id: "brushed-brass", label: "Brushed Brass", swatch: "#C6A15B" },
    { id: "blackened-steel", label: "Blackened Steel", swatch: "#2A2927" },
    { id: "patinated-bronze", label: "Patinated Bronze", swatch: "#6B5236", priceDelta: 60 },
  ],
};

export const CATEGORIES: Category[] = [
  {
    id: "lighting",
    name: "Lighting",
    tagline: "Sculpted light, hand-spun metal",
    image: unsplash("1540932239986-30128078f3c5", 900),
  },
  {
    id: "objects",
    name: "Objects",
    tagline: "Vessels, ceramics & ritual pieces",
    image: unsplash("1612196808214-b8e1d6145a8c", 900),
  },
  {
    id: "furniture",
    name: "Furniture",
    tagline: "Joinery built to outlast trends",
    image: unsplash("1598300042247-d088f8ab3a91", 900),
  },
];

export const PRODUCTS: Product[] = [
  {
    slug: "orbis-pendant",
    name: "Orbis Pendant",
    category: "lighting",
    price: 640,
    tagline: "Hand-spun dome pendant",
    description:
      "Spun by hand from a single sheet of metal in our Porto workshop, the Orbis casts a warm, downward pool of light with a softly glowing rim. Designed to be hung alone above a reading chair or in a measured cluster over the dining table.",
    images: [
      unsplash("1540932239986-30128078f3c5"),
      unsplash("1556228453-efd6c1ff04f6"),
    ],
    variants: [
      BRASS_FINISHES,
      {
        id: "size",
        label: "Diameter",
        options: [
          { id: "30cm", label: "30 cm" },
          { id: "45cm", label: "45 cm", priceDelta: 180 },
        ],
      },
    ],
    details: {
      materials: "Spun brass or steel shade, braided linen cord, solid brass ceiling canopy. E26 / E27 socket, dimmable.",
      dimensions: "Ø 30 cm × H 24 cm, or Ø 45 cm × H 34 cm. Cord adjustable to 240 cm.",
      care: "Dust with a dry microfibre cloth. Brushed brass is unlacquered and will develop a soft patina over time.",
    },
    leadTime: "Ships in 3–5 business days",
    badge: "Bestseller",
    featured: 10,
    addedAt: "2026-03-14",
  },
  {
    slug: "atelier-task-lamp",
    name: "Atelier Task Lamp",
    category: "lighting",
    price: 420,
    tagline: "Articulated arm, weighted base",
    description:
      "A draughtsman's lamp reconsidered. Friction hinges hold any angle without springs, while a cast-iron base keeps the silhouette slender. The shade rotates a full 350° for precise, glare-free task light.",
    images: [
      unsplash("1507473885765-e6ed057f782c"),
      unsplash("1524758631624-e2822e304c36"),
    ],
    variants: [BRASS_FINISHES],
    details: {
      materials: "Powder-coated steel arm, cast-iron base, brass friction joints. Integrated 2700K LED, 800 lm.",
      dimensions: "Reach 62 cm, max height 74 cm, base Ø 18 cm.",
      care: "Wipe with a damp cloth. Do not use abrasive cleaners on the joints.",
    },
    leadTime: "Ships in 2–4 business days",
    featured: 7,
    addedAt: "2026-01-22",
  },
  {
    slug: "nocturne-bedside-lamp",
    name: "Nocturne Bedside Lamp",
    category: "lighting",
    price: 285,
    tagline: "Exposed filament, solid oak",
    description:
      "A quiet companion for the bedside. The Nocturne pairs a turned oak stem with a hand-blown glass globe and a warm filament that dims to candlelight with a touch of the brass collar.",
    images: [
      unsplash("1522771739844-6a9f6d5f14af"),
      unsplash("1505693416388-ac5ce068fe85"),
    ],
    variants: [
      {
        id: "finish",
        label: "Wood",
        options: [
          { id: "natural-oak", label: "Natural Oak", swatch: "#C9A77C" },
          { id: "smoked-oak", label: "Smoked Oak", swatch: "#5A4433" },
        ],
      },
    ],
    details: {
      materials: "FSC-certified turned oak, mouth-blown clear glass, brass touch-dimmer collar.",
      dimensions: "H 38 cm, base Ø 12 cm.",
      care: "Oil the oak once a year with a natural wood oil. Clean glass with a soft lint-free cloth.",
    },
    leadTime: "Ships in 3–5 business days",
    badge: "New",
    featured: 6,
    addedAt: "2026-10-02",
  },
  {
    slug: "monolith-vessel",
    name: "Monolith Vessel",
    category: "objects",
    price: 190,
    tagline: "Wheel-thrown stoneware urn",
    description:
      "Thrown in a single session and finished with a dry, chalk-white glaze, the Monolith carries the faint rings of the potter's hand. Sculptural on its own; generous enough for a branch of olive or dried pampas.",
    images: [
      unsplash("1612196808214-b8e1d6145a8c"),
      unsplash("1631679706909-1844bbd07221"),
    ],
    variants: [
      {
        id: "size",
        label: "Size",
        options: [
          { id: "medium", label: "Medium" },
          { id: "grand", label: "Grand", priceDelta: 110 },
        ],
      },
    ],
    details: {
      materials: "High-fired stoneware with a matte mineral glaze. Watertight interior.",
      dimensions: "Medium: H 32 × Ø 24 cm. Grand: H 48 × Ø 34 cm.",
      care: "Hand wash only. Each piece is unique — expect subtle variation in glaze and form.",
    },
    leadTime: "Made to order · ships in 2 weeks",
    badge: "Limited",
    featured: 9,
    addedAt: "2026-08-19",
  },
  {
    slug: "strata-vessel-trio",
    name: "Strata Vessel Trio",
    category: "objects",
    price: 245,
    tagline: "Set of three graphite bottles",
    description:
      "Three tall-necked bottles in graduated heights, cast from a graphite-tinted concrete composite and sealed to a soft, stone-like sheen. Composed to be arranged — and rearranged — across a mantel or console.",
    images: [
      unsplash("1565193566173-7a0ee3dbe261"),
      unsplash("1583847268964-b28dc8f51f92"),
    ],
    variants: [
      {
        id: "finish",
        label: "Tone",
        options: [
          { id: "graphite", label: "Graphite", swatch: "#6E6E6C" },
          { id: "limestone", label: "Limestone", swatch: "#D9D3C6" },
        ],
      },
    ],
    details: {
      materials: "Hand-cast mineral composite, food-safe internal sealant.",
      dimensions: "H 34 / 28 / 22 cm, each Ø 9 cm.",
      care: "Wipe with a dry cloth. Suitable for dried stems; use a glass liner for fresh flowers.",
    },
    leadTime: "Ships in 3–5 business days",
    featured: 5,
    addedAt: "2026-05-11",
  },
  {
    slug: "ember-candle",
    name: "Ember Candle",
    category: "objects",
    price: 78,
    tagline: "Smoked oud & cedar, 60-hour burn",
    description:
      "Hand-poured in small batches from a coconut and rapeseed wax blend, in a reusable smoked-glass vessel. Notes of smoked oud, Atlas cedar and a dry amber base that settles into the room without overwhelming it.",
    images: [
      unsplash("1603006905003-be475563bc59"),
      unsplash("1578500494198-246f612d3b3d"),
    ],
    variants: [
      {
        id: "size",
        label: "Size",
        options: [
          { id: "classic", label: "Classic · 300 g" },
          { id: "grand", label: "Grand · 600 g", priceDelta: 52 },
        ],
      },
    ],
    details: {
      materials: "Coconut-rapeseed wax, cotton wick, phthalate-free fragrance, smoked glass vessel.",
      dimensions: "Classic: H 10 × Ø 9 cm (60 hr). Grand: H 12 × Ø 12 cm (110 hr).",
      care: "Trim wick to 5 mm before each burn. Burn for no more than 3 hours at a time.",
    },
    leadTime: "Ships in 1–2 business days",
    badge: "Bestseller",
    featured: 8,
    addedAt: "2026-02-05",
  },
  {
    slug: "ritual-ceramic-set",
    name: "Ritual Ceramic Set",
    category: "objects",
    price: 165,
    tagline: "Four speckled tea bowls",
    description:
      "A set of four hand-thrown cups in speckled clay, each left raw at the foot to reveal the warm body beneath the glaze. Made for slow mornings, matcha, or a measure of something stronger.",
    images: [
      unsplash("1610701596007-11502861dcfa"),
      unsplash("1617806118233-18e1de247200"),
    ],
    variants: [
      {
        id: "finish",
        label: "Glaze",
        options: [
          { id: "oat", label: "Oat", swatch: "#E6DCC8" },
          { id: "ash", label: "Ash", swatch: "#B9B4AA" },
        ],
      },
    ],
    details: {
      materials: "Speckled stoneware, lead-free satin glaze. Raw clay foot.",
      dimensions: "Each H 8 × Ø 8.5 cm, 220 ml.",
      care: "Dishwasher safe on a gentle cycle. Not suitable for microwave.",
    },
    leadTime: "Ships in 2–4 business days",
    featured: 4,
    addedAt: "2026-06-28",
  },
  {
    slug: "vale-lounge-chair",
    name: "Vale Lounge Chair",
    category: "furniture",
    price: 1890,
    tagline: "Winged bouclé on solid ash",
    description:
      "A softly winged lounge chair upholstered in Italian bouclé over a frame of solid steam-bent ash. Hand-tied springs and a feather-wrapped seat cushion give it the ease of a club chair in a far more slender profile.",
    images: [
      unsplash("1598300042247-d088f8ab3a91"),
      unsplash("1586023492125-27b2c045efd7"),
    ],
    variants: [
      {
        id: "finish",
        label: "Upholstery",
        options: [
          { id: "dove-boucle", label: "Dove Bouclé", swatch: "#A9A7A2" },
          { id: "ivory-boucle", label: "Ivory Bouclé", swatch: "#EEE9DE" },
          { id: "cognac-leather", label: "Cognac Leather", swatch: "#8B5A2B", priceDelta: 420 },
        ],
      },
    ],
    details: {
      materials: "Solid ash frame, hand-tied steel springs, feather & foam cushion, Italian wool-blend bouclé.",
      dimensions: "W 74 × D 82 × H 98 cm. Seat height 44 cm.",
      care: "Vacuum gently with an upholstery brush. Blot spills immediately; professional cleaning recommended.",
    },
    leadTime: "Made to order · white-glove delivery in 6–8 weeks",
    badge: "New",
    featured: 9,
    addedAt: "2026-09-15",
  },
  {
    slug: "halden-sofa",
    name: "Halden Three-Seat Sofa",
    category: "furniture",
    price: 4200,
    tagline: "Low-slung velvet, kiln-dried frame",
    description:
      "Our signature sofa: long, low and deeply comfortable, with a tight back and slim track arms that keep its architecture crisp. Built on a kiln-dried hardwood frame guaranteed for twenty-five years.",
    images: [
      unsplash("1555041469-a586c61ea9bc"),
      unsplash("1618220179428-22790b461013"),
    ],
    variants: [
      {
        id: "finish",
        label: "Velvet",
        options: [
          { id: "forest", label: "Forest", swatch: "#1F4A3D" },
          { id: "oyster", label: "Oyster", swatch: "#D8D0C1" },
          { id: "midnight", label: "Midnight", swatch: "#1C2233" },
        ],
      },
      {
        id: "size",
        label: "Length",
        options: [
          { id: "210cm", label: "210 cm" },
          { id: "240cm", label: "240 cm", priceDelta: 450 },
        ],
      },
    ],
    details: {
      materials: "Kiln-dried beech frame, webbed & sprung seat, high-resilience foam with down wrap, performance cotton velvet.",
      dimensions: "W 210 / 240 × D 92 × H 72 cm. Seat height 42 cm.",
      care: "Performance velvet resists stains and fading — clean with mild soap and water. Rotate cushions monthly.",
    },
    leadTime: "Made to order · white-glove delivery in 8–10 weeks",
    featured: 8,
    addedAt: "2025-11-30",
  },
  {
    slug: "plinth-oak-stool",
    name: "Plinth Oak Stool",
    category: "furniture",
    price: 360,
    tagline: "Mortise-and-tenon counter stool",
    description:
      "Four splayed legs, a single saddled seat and not a screw in sight. The Plinth is joined entirely by hand using traditional mortise-and-tenon joinery, then finished with a hard-wax oil that deepens with use.",
    images: [
      unsplash("1503602642458-232111445657"),
      unsplash("1519710164239-da123dc03ef4"),
    ],
    variants: [
      {
        id: "finish",
        label: "Wood",
        options: [
          { id: "white-oak", label: "White Oak", swatch: "#D6C3A1" },
          { id: "smoked-oak", label: "Smoked Oak", swatch: "#5A4433" },
        ],
      },
      {
        id: "size",
        label: "Height",
        options: [
          { id: "counter", label: "Counter · 65 cm" },
          { id: "bar", label: "Bar · 75 cm", priceDelta: 40 },
        ],
      },
    ],
    details: {
      materials: "Solid FSC-certified oak, hard-wax oil finish. Hand-cut mortise-and-tenon joints.",
      dimensions: "Seat 36 × 30 cm. Height 65 or 75 cm.",
      care: "Wipe clean with a damp cloth. Re-oil every 12–18 months to maintain the finish.",
    },
    leadTime: "Ships in 1–2 weeks",
    featured: 5,
    addedAt: "2026-07-07",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCategory(id: CategoryId): Category {
  const category = CATEGORIES.find((c) => c.id === id);
  if (!category) throw new Error(`Unknown category: ${id}`);
  return category;
}

export function defaultVariants(product: Product): SelectedVariants {
  const selected: SelectedVariants = {};
  for (const group of product.variants) selected[group.id] = group.options[0]?.id;
  return selected;
}

export function unitPrice(product: Product, variants: SelectedVariants): number {
  return product.variants.reduce((total, group) => {
    const option = group.options.find((o) => o.id === variants[group.id]);
    return total + (option?.priceDelta ?? 0);
  }, product.price);
}

export function variantLabel(product: Product, variants: SelectedVariants): string {
  return product.variants
    .map((group) => group.options.find((o) => o.id === variants[group.id])?.label)
    .filter(Boolean)
    .join(" · ");
}

export function lineKey(slug: string, variants: SelectedVariants): string {
  const parts = Object.entries(variants)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`);
  return [slug, ...parts].join("|");
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "newest":
      return list.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    default:
      return list.sort((a, b) => b.featured - a.featured);
  }
}
