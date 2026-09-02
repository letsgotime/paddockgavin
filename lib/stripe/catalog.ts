/**
 * The Stripe catalogue, one set of objects per event.
 *
 * Stripe objects belong to the event they were made for. The ranch's carry
 * metadata.event = piston-powered-ranch and its prices are its own, so the next
 * event gets its own products and prices rather than borrowing these. That is
 * a deliberate decision: sharing one price object across events would put two
 * events' money under one product in reporting, and a second event would be
 * charging a figure somebody set for the first.
 *
 * Keyed by events.slug. An event with no entry here has nothing to sell yet,
 * which is the correct state for an event nobody has seeded objects for.
 *
 * These ids are real objects in acct_1UAWrtRJpXHmje77, the PaddockGavin
 * sandbox, seeded 31 August 2026. The earlier set lived in the Paddock20
 * sandbox and does not exist in this account.
 *
 * They are not placeholders and they are not guesses. Every one carries
 * metadata.event = piston-powered-ranch, so when the next event runs under the
 * same account its objects filter apart from these cleanly.
 *
 * Every price here is the STARTING tier. Footprint scaling and negotiated
 * amounts use ad hoc price_data on the Checkout Session with the product id
 * kept, so reporting stays grouped under the same product.
 *
 * When live keys are activated this catalogue is recreated live with one
 * script and the ids move into env. Nothing here is hardcoded into a component.
 */

export const STRIPE_API = "https://api.stripe.com/v1"

export interface CatalogItem {
  key: string
  name: string
  /** Empty until the object is created in Stripe. */
  productId?: string
  /**
   * Empty until somebody sets a price.
   *
   * An item with no priceId is fully wired: it has a card, a checkout route
   * that knows its key, and a button. It simply cannot charge, and it says TBD
   * instead of a number. Filling this in is the whole of putting it on sale.
   */
  priceId?: string
  /** The amount in cents, as the price object holds it. Absent means TBD. */
  cents?: number
}

/** Priced and ready, as opposed to wired and waiting. */
export function isOnSale(i: CatalogItem | undefined): boolean {
  return Boolean(i && i.priceId && typeof i.cents === "number" && i.cents > 0)
}


export const CATALOGS: Record<string, Record<string, CatalogItem>> = {
  pistonpoweredranch: {
  vendorBooth: {
    key: "vendorBooth",
    name: "Vendor Booth Setup",
    productId: "prod_VAskeBHu2wx7Oj",
    priceId: "price_1UAWzGRJpXHmje77uDzxNMAg",
    cents: 25000,
  },
  supporting: {
    key: "supporting",
    name: "Supporting Sponsorship",
    productId: "prod_VAskNMROtPmvuq",
    priceId: "price_1UAWzGRJpXHmje770wv7jUj9",
    cents: 50000,
  },
  secondaryTitle: {
    key: "secondaryTitle",
    name: "Secondary Title Sponsorship",
    productId: "prod_VAskun9aDAKszv",
    priceId: "price_1UAWzHRJpXHmje779GTCTJYp",
    cents: 250000,
  },
  premierTitle: {
    key: "premierTitle",
    name: "Premier Title Sponsorship",
    productId: "prod_VAskygpO23zwTW",
    priceId: "price_1UAWzIRJpXHmje77AkoTNkVM",
    cents: 500000,
  },

  /* Everything below is wired and unpriced.
   *
   * Each has a card in the store, a key the checkout route understands and a
   * button that is inert until there is something to charge. None carries a
   * number, because none has one: the VIP rooms have always been "pricing is a
   * conversation" and no shirt or hat has a price or a payment link anywhere.
   *
   * Putting any of them on sale is two fields, priceId and cents, taken from
   * the objects in Stripe. No component changes and no route changes. */

  vipTerrace: { key: "vipTerrace", name: "The Terrace" },
  vipOwnersTable: { key: "vipOwnersTable", name: "The Owner's Table" },

  teeRanchGate: { key: "teeRanchGate", name: "Ranch Gate Tee" },
  teePprOctober: { key: "teePprOctober", name: "October Tee" },
  capRanch: { key: "capRanch", name: "Ranch Cap" },
  truckerPg: { key: "truckerPg", name: "PG Trucker" },
  mugRanch: { key: "mugRanch", name: "Ranch Mug" },
  backpackRanch: { key: "backpackRanch", name: "Ranch Backpack" },
  },
}

/**
 * Booth footprints.
 *
 * Only the 10x10 has a price, because only the 10x10 has one in Stripe. The
 * larger footprints are real options that are quoted, and a quote is not a
 * number I can invent: a vendor who pays a figure I made up has a receipt for
 * it. So they route to the enquiry form instead of to Checkout, which is what
 * "footprint scaling uses ad hoc price_data" means in practice until somebody
 * sets the scale.
 */
export interface Footprint {
  size: string
  sqft: number
  /** Present only when a real price exists. Absent means quote. */
  cents?: number
  note: string
}

export const FOOTPRINTS: Footprint[] = [
  { size: "10 by 10", sqft: 100, cents: 25000, note: "One table, one canopy, the standard row space." },
  { size: "10 by 20", sqft: 200, note: "Two frontages, or a trailer parked behind the counter." },
  { size: "20 by 20", sqft: 400, note: "A build rather than a stall. Seating, or a working display." },
  { size: "40 by 40", sqft: 1600, note: "An activation. Vehicles inside the footprint, room to gather." },
]

/** Generator power is a separate ask because the ranch has no mains in the row. */
export const POWER_OPTIONS = [
  "None, we run on batteries or nothing",
  "Light draw, under 1kW, lights and a card reader",
  "Cooking or refrigeration, tell us the load",
]

/** One event's objects, or an empty set. Never another event's. */
export function catalogFor(eventSlug: string): Record<string, CatalogItem> {
  return CATALOGS[eventSlug] || {}
}

export function itemFor(eventSlug: string, key: string): CatalogItem | undefined {
  return catalogFor(eventSlug)[key]
}

export function money(cents: number): string {
  return "$" + (cents / 100).toFixed(2).replace(/\.00$/, "")
}

/**
 * Half a price is a price nobody sees.
 *
 * Putting something on sale is two fields, and setting one is the easy mistake:
 * a priceId with no cents, or cents with no priceId, leaves the card reading
 * TBD forever with nothing anywhere saying why. Somebody would swear they had
 * put the hats on sale and the store would quietly disagree. This throws on
 * import instead, so it is a failed build rather than a silent shop.
 */
for (const [slug, set] of Object.entries(CATALOGS))
  for (const i of Object.values(set)) {
  const hasPrice = Boolean(i.priceId)
  const hasCents = typeof i.cents === "number" && i.cents > 0
  if (hasPrice !== hasCents) {
    throw new Error(
      `Stripe catalogue: ${slug}."${i.key}" has ${hasPrice ? "a priceId but no cents" : "cents but no priceId"}. ` +
        "Set both, from the objects in Stripe, or neither.",
    )
  }
}
