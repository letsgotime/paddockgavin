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
 * Test and live. The productId and priceId below are real objects in
 * acct_1UAWrtRJpXHmje77, the PaddockGavin sandbox, seeded 31 August 2026, and
 * they only exist in test mode. Every priced item also carries a lookupKey,
 * which is the price's stable name in any mode: scripts/stripe-seed.mjs creates
 * the same products and prices under the live key with these keys, and the
 * checkout route asks Stripe for the price by lookupKey at request time. So
 * going live is a key swap and one seed run, with no edit here.
 *
 * Every price here is the STARTING tier. Footprint scaling and negotiated
 * amounts are invoiced from the desk with ad hoc prices, see /api/invoice.
 */

export const STRIPE_API = "https://api.stripe.com/v1"

export interface CatalogItem {
  key: string
  name: string
  /** What a receipt says the money covered. */
  covers: string
  /**
   * Who may buy it through the public checkout route.
   * public: the store and the booth page. desk: invoiced by staff after a
   * conversation, never reachable from the public internet with a price.
   */
  audience: "public" | "desk"
  /** payments.kind, which is constrained in the database. */
  ledger: "vendor_setup" | "sponsorship" | "vip" | "other"
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
  /** The price's stable name across Stripe modes. */
  lookupKey?: string
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
    covers: "Vendor booth, 10 by 10, The Piston Powered Ranch, 10 October 2026",
    audience: "public",
    ledger: "vendor_setup",
    productId: "prod_VAskeBHu2wx7Oj",
    priceId: "price_1UAWzGRJpXHmje77uDzxNMAg",
    lookupKey: "ppr-2026-vendor-booth-10x10",
    cents: 25000,
  },
  supporting: {
    key: "supporting",
    name: "Supporting Sponsorship",
    covers: "Supporting sponsorship, The Piston Powered Ranch, 10 October 2026",
    audience: "desk",
    ledger: "sponsorship",
    productId: "prod_VAskNMROtPmvuq",
    priceId: "price_1UAWzGRJpXHmje770wv7jUj9",
    lookupKey: "ppr-2026-sponsor-supporting",
    cents: 50000,
  },
  secondaryTitle: {
    key: "secondaryTitle",
    name: "Secondary Title Sponsorship",
    covers: "Secondary title sponsorship, The Piston Powered Ranch, 10 October 2026",
    audience: "desk",
    ledger: "sponsorship",
    productId: "prod_VAskun9aDAKszv",
    priceId: "price_1UAWzHRJpXHmje779GTCTJYp",
    lookupKey: "ppr-2026-sponsor-secondary-title",
    cents: 250000,
  },
  premierTitle: {
    key: "premierTitle",
    name: "Premier Title Sponsorship",
    covers: "Premier title sponsorship, The Piston Powered Ranch, 10 October 2026",
    audience: "desk",
    ledger: "sponsorship",
    productId: "prod_VAskygpO23zwTW",
    priceId: "price_1UAWzIRJpXHmje77AkoTNkVM",
    lookupKey: "ppr-2026-sponsor-premier-title",
    cents: 500000,
  },

  /* Everything below is wired and unpriced.
   *
   * Each has a card in the store, a key the checkout route understands and a
   * button that is inert until there is something to charge. None carries a
   * number, because none has one: the VIP rooms have always been "pricing is a
   * conversation" and no shirt or hat has a price or a payment link anywhere.
   *
   * Putting any of them on sale is priceId and cents from the objects in
   * Stripe, plus a lookupKey so live mode finds it. No component changes and
   * no route changes. */

  vipTerrace: { key: "vipTerrace", name: "The Terrace", covers: "The Terrace, 10 October 2026", audience: "public", ledger: "vip" },
  vipOwnersTable: { key: "vipOwnersTable", name: "The Owner's Table", covers: "The Owner's Table, 10 October 2026", audience: "public", ledger: "vip" },

  teeRanchGate: { key: "teeRanchGate", name: "Ranch Gate Tee", covers: "Ranch Gate Tee", audience: "public", ledger: "other" },
  teePprOctober: { key: "teePprOctober", name: "October Tee", covers: "October Tee", audience: "public", ledger: "other" },
  capRanch: { key: "capRanch", name: "Ranch Cap", covers: "Ranch Cap", audience: "public", ledger: "other" },
  truckerPg: { key: "truckerPg", name: "PG Trucker", covers: "PG Trucker", audience: "public", ledger: "other" },
  mugRanch: { key: "mugRanch", name: "Ranch Mug", covers: "Ranch Mug", audience: "public", ledger: "other" },
  backpackRanch: { key: "backpackRanch", name: "Ranch Backpack", covers: "Ranch Backpack", audience: "public", ledger: "other" },
  },
}

/**
 * Booth footprints.
 *
 * Only the 10x10 has a price, because only the 10x10 has one in Stripe. The
 * larger footprints are real options that are quoted, and a quote is not a
 * number I can invent: a vendor who pays a figure I made up has a receipt for
 * it. So they route to the enquiry form with the size filled in, and the desk
 * invoices the agreed figure from there.
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
  if (hasPrice && !i.lookupKey) {
    throw new Error(`Stripe catalogue: ${slug}."${i.key}" is priced but has no lookupKey, so it cannot be found in live mode.`)
  }
}
