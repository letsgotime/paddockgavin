import { PRODUCTS, type Product } from "./catalogue"

/**
 * The public store: tickets, giving, and merchandise, in one list.
 *
 * Three states, and which one a thing is in depends entirely on whether a real
 * number exists for it. Nothing here invents one.
 *
 *   buy    a real Stripe price, or an amount the buyer names themselves
 *   ask    a real thing with a real conversation behind it and no set figure
 *   soon   a real thing with nothing settled yet
 *
 * Sponsorship is deliberately absent. Those tiers carry figures and they are
 * sponsor-facing, and sponsor-facing material does not print prices.
 */

export type Availability = "buy" | "ask" | "soon"

export interface StoreItem {
  slug: string
  name: string
  group: "Tickets" | "Giving" | "Merchandise"
  blurb: string
  availability: Availability
  /** Cents, only when a real price exists. */
  cents?: number
  /** The buyer names the amount, within limits the server enforces. */
  openAmount?: boolean
  /** Where an "ask" goes. */
  askHref?: string
  askLabel?: string
  /** The catalogue key the checkout route understands. */
  checkoutKey?: string
  image?: string
}

/** What a donation may be, in cents. The server enforces both ends. */
export const DONATION_MIN = 500
export const DONATION_MAX = 1_000_000
export const DONATION_SUGGESTED = [2500, 5000, 10000, 25000]

const TICKETS: StoreItem[] = [
  {
    slug: "spectate",
    name: "Spectator admission",
    group: "Tickets",
    blurb:
      "Free, for everybody. Gates at nine, field clear by three. Tell us you are coming so we know how much shade to put up.",
    availability: "ask",
    askHref: "/spectate",
    askLabel: "Tell us you are coming",
  },
  {
    slug: "vip-terrace",
    name: "The Terrace",
    group: "Tickets",
    blurb:
      "The hosted room, on the rail above the show field. Shaded tent, table service, ranch raised Angus, and the corral and photo areas.",
    availability: "ask",
    askHref: "/sponsor",
    askLabel: "Ask about the twenty seats",
  },
  {
    slug: "vip-owners-table",
    name: "The Owner's Table",
    group: "Tickets",
    blurb:
      "Everything on The Terrace, and the part of the ranch the crowd never reaches. Twenty seats across both rooms.",
    availability: "ask",
    askHref: "/sponsor",
    askLabel: "Ask about the twenty seats",
  },
]

const GIVING: StoreItem[] = [
  {
    slug: "donation",
    name: "Give to Community Elementary School",
    group: "Giving",
    blurb:
      "The day exists for the school. Give what you like, whether or not you come, and it goes to them.",
    availability: "buy",
    openAmount: true,
    checkoutKey: "donation",
  },
]

/** Merchandise comes from the product catalogue, which holds no prices yet. */
function merch(): StoreItem[] {
  return PRODUCTS.map((p: Product) => {
    const priced = p.variants.find((v) => typeof v.cents === "number" && v.cents! > 0 && v.buyUrl)
    return {
      slug: p.slug,
      name: p.name,
      group: "Merchandise" as const,
      blurb: p.blurb,
      availability: priced ? ("buy" as const) : ("soon" as const),
      cents: priced?.cents ?? undefined,
      image: p.image,
    }
  })
}

export function storeItems(): StoreItem[] {
  return [...TICKETS, ...GIVING, ...merch()]
}

export function money(cents: number): string {
  return "$" + (cents / 100).toFixed(2).replace(/\.00$/, "")
}
