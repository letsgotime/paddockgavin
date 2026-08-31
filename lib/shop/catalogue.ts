/**
 * The shop.
 *
 * Everything about a product lives in this file, so adding one is an object
 * rather than a page. That is the whole design goal: the store grows by
 * appending here, and the grid, the product page and the sitemap all follow.
 *
 * Two rules held deliberately.
 *
 * No invented prices. Nothing here carries a number until somebody sets one.
 * A product with no price and no payment link renders as "coming soon" with the
 * button disabled, which is true, rather than a figure I guessed that somebody
 * would then have to honour.
 *
 * No fake photography. There are no product shots yet, so a product shows a
 * brand field with its mark and its name set properly. That reads as designed
 * rather than as a broken image, and swapping in a photograph later is one
 * field.
 *
 * Fulfilment is print on demand, so there is no stock to track. A size that
 * cannot be made is simply not listed.
 */

export type Brand = "ranch" | "pg"

export interface Variant {
  /** What the buyer picks. Size, colour, or both. */
  label: string
  /** Stripe payment link. Empty until it exists, which disables the buy. */
  buyUrl?: string
  /** Cents. Null until somebody sets a real one. */
  cents?: number | null
}

export interface Product {
  slug: string
  name: string
  kind: "Tee" | "Hat" | "Mug" | "Backpack" | "Other"
  brand: Brand
  /** One line on the card. */
  blurb: string
  /** The longer read on the product page. */
  body: string[]
  /** Photography when it exists. Until then the brand field carries it. */
  image?: string
  /** A ranch frame used as a textural ground behind the mark. */
  backdrop?: string
  variants: Variant[]
  /** Shown on the product page, because print on demand has real lead times. */
  madeToOrder?: boolean
}

export const BRANDS: Record<Brand, { name: string; ink: string; paper: string; accent: string }> = {
  ranch: { name: "Rancho Jaramillo", ink: "#0A1523", paper: "#FAF8F4", accent: "#E5141A" },
  pg: { name: "PaddockGavin", ink: "#0A1523", paper: "#0E1A2A", accent: "#F2C94C" },
}

export const PRODUCTS: Product[] = [
  {
    slug: "ranch-gate-tee",
    name: "The Gate Tee",
    kind: "Tee",
    brand: "ranch",
    blurb: "The Rancho Jaramillo gate, printed the size it deserves.",
    body: [
      "The gate is the first thing anyone sees of this place: two cedar posts, a hanging sign, and a track running off toward the field. It is on the back, full width, in one colour.",
      "Heavyweight cotton, cut straight rather than fitted, because a car show in October is not the day to be wearing something clingy.",
    ],
    backdrop: "/images/ranch/ppr-gate.jpg",
    madeToOrder: true,
    variants: [
      { label: "S" }, { label: "M" }, { label: "L" }, { label: "XL" }, { label: "2XL" }, { label: "3XL" },
    ],
  },
  {
    slug: "ppr-october-tee",
    name: "October Tenth Tee",
    kind: "Tee",
    brand: "ranch",
    blurb: "The date, the place, and nothing else.",
    body: [
      "Saturday 10 October 2026, Rancho Jaramillo, Unionville Tennessee. Set in the ranch's own type, small on the chest, nothing on the back.",
      "The kind of shirt that means something to the people who were there and nothing to anybody else, which is the point.",
    ],
    backdrop: "/images/ranch/ppr-light.jpg",
    madeToOrder: true,
    variants: [
      { label: "S" }, { label: "M" }, { label: "L" }, { label: "XL" }, { label: "2XL" }, { label: "3XL" },
    ],
  },
  {
    slug: "ranch-cap",
    name: "The Ranch Cap",
    kind: "Hat",
    brand: "ranch",
    blurb: "Six panel, curved brim, the mark stitched small.",
    body: [
      "Unstructured six panel with a curved brim and a brass slider, so it packs flat and does not sit on your head like a billboard.",
      "The Rancho Jaramillo mark is embroidered small on the front, in one colour. Nothing on the side, nothing on the back.",
    ],
    backdrop: "/images/ranch/g-barn.webp",
    madeToOrder: true,
    variants: [{ label: "One size" }],
  },
  {
    slug: "pg-trucker",
    name: "PaddockGavin Trucker",
    kind: "Hat",
    brand: "pg",
    blurb: "Mesh back, foam front, the PG monogram.",
    body: [
      "A proper trucker: foam front, mesh back, snap closure. Made for a field in the sun rather than for a shelf.",
      "PG monogram on the front panel in amber on navy.",
    ],
    backdrop: "/images/ranch/g-drive.webp",
    madeToOrder: true,
    variants: [{ label: "One size" }],
  },
  {
    slug: "ranch-mug",
    name: "The Ranch Mug",
    kind: "Mug",
    brand: "ranch",
    blurb: "Fifteen ounces, because twelve is not a cup of coffee.",
    body: [
      "Ceramic, fifteen ounces, dishwasher and microwave safe. The mark on one side and the date on the other.",
      "Sized for the morning of a build day rather than for a desk.",
    ],
    backdrop: "/images/ranch/g-coop.webp",
    madeToOrder: true,
    variants: [{ label: "15oz" }],
  },
  {
    slug: "ranch-backpack",
    name: "Field Backpack",
    kind: "Backpack",
    brand: "ranch",
    blurb: "For a camera, a jacket, and whatever the field hands you.",
    body: [
      "Roll top, padded laptop sleeve, water resistant base for setting down on grass. The mark is on the front panel, small.",
      "Built for a day where you are carrying a camera in the morning and a coat by the afternoon.",
    ],
    backdrop: "/images/ranch/g-bales.webp",
    madeToOrder: true,
    variants: [{ label: "One size" }],
  },
]

export function bySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

/** A product is buyable only when a real price and a real link both exist. */
export function buyable(v: Variant): boolean {
  return !!v.buyUrl && typeof v.cents === "number" && v.cents > 0
}

export function anyBuyable(p: Product): boolean {
  return p.variants.some(buyable)
}

export function priceRange(p: Product): string | null {
  const cents = p.variants.map((v) => v.cents).filter((c): c is number => typeof c === "number" && c > 0)
  if (!cents.length) return null
  const lo = Math.min(...cents)
  const hi = Math.max(...cents)
  const fmt = (c: number) => "$" + (c / 100).toFixed(2).replace(/\.00$/, "")
  return lo === hi ? fmt(lo) : fmt(lo) + " to " + fmt(hi)
}
