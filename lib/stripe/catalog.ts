/**
 * The Stripe catalogue, as it exists in the sandbox account.
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
  productId: string
  priceId: string
  /** The starting amount in cents, as the price object holds it. */
  cents: number
}

export const CATALOG: Record<string, CatalogItem> = {
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

export function itemFor(key: string): CatalogItem | undefined {
  return CATALOG[key]
}

export function money(cents: number): string {
  return "$" + (cents / 100).toFixed(2).replace(/\.00$/, "")
}
