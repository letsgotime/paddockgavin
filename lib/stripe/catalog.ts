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

/** Priced and ready, as opposed to wired and waiting. A lookupKey with cents
    is priced too: the object may not exist in this Stripe mode yet, and the
    checkout route says so when it does not. */
export function isOnSale(i: CatalogItem | undefined): boolean {
  return Boolean(i && (i.priceId || i.lookupKey) && typeof i.cents === "number" && i.cents > 0)
}

export const CATALOGS: Record<string, Record<string, CatalogItem>> = {
  pistonpoweredranch: {
  /* The booth ladder, set 3 September 2026: $250 for the 10 by 10, $350 for
     the 10 by 20, $500 for the 20 by 20, $650 past that, and premium
     placement at $150 on top. Only the 10 by 10 exists in the sandbox; the
     rest are made by scripts/stripe-seed.mjs under whichever key runs it. */
  vendorBooth: {
    key: "vendorBooth",
    name: "Vendor Booth, 10 by 10",
    covers: "Vendor booth, 10 by 10, The Piston Powered Ranch, 10 October 2026",
    audience: "public",
    ledger: "vendor_setup",
    productId: "prod_VCuDwUkVg2oEWt",
    priceId: "price_1UEz6jEz1mDAE4gUICu94jJp",
    lookupKey: "ppr-2026-vendor-booth-10x10",
    cents: 24999,
  },
  vendorBooth10x20: {
    key: "vendorBooth10x20",
    name: "Vendor Booth, 10 by 20",
    covers: "Vendor booth, 10 by 20, The Piston Powered Ranch, 10 October 2026",
    audience: "public",
    ledger: "vendor_setup",
    productId: "prod_VCuDSat1uExPNY",
    priceId: "price_1UEz6rEz1mDAE4gUskIRdpTr",
    lookupKey: "ppr-2026-vendor-booth-10x20",
    cents: 34999,
  },
  vendorBooth20x20: {
    key: "vendorBooth20x20",
    name: "Vendor Booth, 20 by 20",
    covers: "Vendor booth, 20 by 20, The Piston Powered Ranch, 10 October 2026",
    audience: "public",
    ledger: "vendor_setup",
    productId: "prod_VCuDpnDUxHNXY2",
    priceId: "price_1UEz6zEz1mDAE4gUuGZcTHnc",
    lookupKey: "ppr-2026-vendor-booth-20x20",
    cents: 49999,
  },
  vendorBooth40x40: {
    key: "vendorBooth40x40",
    name: "Vendor Booth, 40 by 40",
    covers: "Vendor booth, 40 by 40, The Piston Powered Ranch, 10 October 2026",
    audience: "public",
    ledger: "vendor_setup",
    productId: "prod_VCuDUAxRn6DtOY",
    priceId: "price_1UEz7WEz1mDAE4gU9napuTm5",
    lookupKey: "ppr-2026-vendor-booth-40x40",
    cents: 64999,
  },
  vendorPremiumPlacement: {
    key: "vendorPremiumPlacement",
    name: "Premium placement",
    covers: "Premium placement on vendor row",
    audience: "public",
    ledger: "vendor_setup",
    productId: "prod_VCuDoLmmord57m",
    priceId: "price_1UEz7eEz1mDAE4gUOzH2j5o4",
    lookupKey: "ppr-2026-vendor-premium-placement",
    cents: 14999,
  },
  supporting: {
    key: "supporting",
    name: "Supporting Sponsor",
    covers: "Supporting Sponsor, The Piston Powered Ranch, 10 October 2026",
    audience: "desk",
    ledger: "sponsorship",
    productId: "prod_VAskNMROtPmvuq",
    priceId: "price_1UAWzGRJpXHmje770wv7jUj9",
    lookupKey: "ppr-2026-sponsor-supporting",
    cents: 49999,
  },
  secondaryTitle: {
    key: "secondaryTitle",
    name: "Secondary Sponsor",
    covers: "Secondary Sponsor, The Piston Powered Ranch, 10 October 2026",
    audience: "desk",
    ledger: "sponsorship",
    productId: "prod_VAskun9aDAKszv",
    priceId: "price_1UAWzHRJpXHmje779GTCTJYp",
    lookupKey: "ppr-2026-sponsor-secondary-title",
    cents: 249999,
  },
  premierTitle: {
    key: "premierTitle",
    name: "Title Sponsor",
    covers: "Title Sponsor, The Piston Powered Ranch, 10 October 2026",
    audience: "desk",
    ledger: "sponsorship",
    productId: "prod_VAskygpO23zwTW",
    priceId: "price_1UAWzIRJpXHmje77AkoTNkVM",
    lookupKey: "ppr-2026-sponsor-premier-title",
    cents: 499999,
  },

  /* The VIP rooms stay wired and unpriced here.
   *
   * Both have a card in the store, a key the checkout route understands and a
   * button that is inert until there is something to charge. Their real prices
   * exist in Stripe and sit on a commit held back pending Oscar's approval, so
   * they are deliberately absent from this file rather than missing. */

  vipTerrace: { key: "vipTerrace", name: "The Terrace", covers: "The Terrace, 10 October 2026", audience: "public", ledger: "vip" },
  vipOwnersTable: { key: "vipOwnersTable", name: "The Owner's Table", covers: "The Owner's Table, 10 October 2026", audience: "public", ledger: "vip" },

  /* Merchandise, priced 12 September against the live objects in Stripe. The
     amounts mirror lib/shop/catalogue.ts, which is what the shop pages read;
     these are what the server charges. Fulfilment is print on demand, so a
     size that costs the same carries one price rather than six. */

  teeRanchGate: {
    key: "teeRanchGate", name: "The Gate Tee", covers: "The Gate Tee", audience: "public", ledger: "other",
    productId: "prod_VFSLMRh1Q5wtgL", priceId: "price_1UExQyEz1mDAE4gUHIj5pIB9", lookupKey: "ppr-2026-tee-ranch-gate", cents: 1999,
  },
  teePprOctober: {
    key: "teePprOctober", name: "October Tenth Tee", covers: "October Tenth Tee", audience: "public", ledger: "other",
    productId: "prod_VFSLkxSwxvDHT4", priceId: "price_1UExRDEz1mDAE4gUf202P99I", lookupKey: "ppr-2026-tee-october", cents: 1999,
  },
  capRanch: {
    key: "capRanch", name: "The Ranch Cap", covers: "The Ranch Cap", audience: "public", ledger: "other",
    productId: "prod_VFSMHmKk6AS8ci", priceId: "price_1UExROEz1mDAE4gUsXuFoVBt", lookupKey: "ppr-2026-cap-ranch", cents: 2499,
  },
  /* Priced, but still the only PaddockGavin-branded product sitting in a
     Rancho Jaramillo store. That is a placement question, not a pricing one. */
  truckerPg: {
    key: "truckerPg", name: "PaddockGavin Trucker", covers: "PaddockGavin Trucker", audience: "public", ledger: "other",
    productId: "prod_VFU6eaRIBx4FjM", priceId: "price_1UEz8FEz1mDAE4gUTejjVcxd", lookupKey: "ppr-2026-trucker-pg", cents: 1999,
  },
  mugRanch: {
    key: "mugRanch", name: "The Ranch Mug", covers: "The Ranch Mug", audience: "public", ledger: "other",
    productId: "prod_VFSNbvQNdgol8y", priceId: "price_1UExSmEz1mDAE4gUFFeDcn3U", lookupKey: "ppr-2026-mug-ranch", cents: 2499,
  },
  parasolRanch: {
    key: "parasolRanch", name: "The Field Parasol", covers: "The Field Parasol", audience: "public", ledger: "other",
    productId: "prod_VFSNp2wBUz3CK6", priceId: "price_1UExSzEz1mDAE4gULcR77W9X", lookupKey: "ppr-2026-parasol", cents: 3499,
  },
  bottleRanch: {
    key: "bottleRanch", name: "The Ranch Bottle", covers: "The Ranch Bottle", audience: "public", ledger: "other",
    productId: "prod_VFSOII9nTkAHwm", priceId: "price_1UExTbEz1mDAE4gUdWHRwvO2", lookupKey: "ppr-2026-bottle", cents: 2499,
  },
  backpackRanch: {
    key: "backpackRanch", name: "Field Backpack", covers: "Field Backpack", audience: "public", ledger: "other",
    productId: "prod_VFSPnRUIo3cVKz", priceId: "price_1UExUVEz1mDAE4gU6lNHYJfU", lookupKey: "ppr-2026-backpack-ranch", cents: 4999,
  },

  /* The hospitality tent's three packages. Product names in Stripe stay
     neutral and carry no partner name, so naming the tent never touches the
     catalogue. The $100 tier covers two people; the other two are per ticket. */

  hospitality25: {
    key: "hospitality25", name: "Hospitality Tent, two cocktails and swag", covers: "Hospitality Tent, 10 October 2026", audience: "public", ledger: "other",
    productId: "prod_VFSRXeY55lBocE", priceId: "price_1UEz7pEz1mDAE4gUtl4gIS1t", lookupKey: "ppr-2026-hospitality-25", cents: 2499,
  },
  hospitality75: {
    key: "hospitality75", name: "Hospitality Tent, three cocktails and swag", covers: "Hospitality Tent, 10 October 2026", audience: "public", ledger: "other",
    productId: "prod_VFSQiqptpOTcYM", priceId: "price_1UEz7vEz1mDAE4gUET8FLKPQ", lookupKey: "ppr-2026-hospitality-75", cents: 7499,
  },
  hospitality100: {
    key: "hospitality100", name: "Hospitality Tent, pair", covers: "Hospitality Tent, 10 October 2026", audience: "public", ledger: "other",
    productId: "prod_VFU672nJ09w7LB", priceId: "price_1UEz85Ez1mDAE4gUs3FDVZr0", lookupKey: "ppr-2026-hospitality-100", cents: 9999,
  },
  },
}

/**
 * Booth footprints. Each one is a catalogue item, so each one is paid for
 * on the booth page. A footprint with no price in the current Stripe mode
 * is "not open yet" there, and the enquiry form takes it instead.
 */
export interface Footprint {
  size: string
  sqft: number
  /** The catalogue key that carries the price. */
  item: string
  /** Present only when a real price exists. Absent means quote. */
  cents?: number
  note: string
}

export const FOOTPRINTS: Footprint[] = [
  { size: "10 by 10", sqft: 100, item: "vendorBooth", cents: 24999, note: "One table, one canopy, the standard row space." },
  { size: "10 by 20", sqft: 200, item: "vendorBooth10x20", cents: 34999, note: "Two frontages, or a trailer parked behind the counter." },
  { size: "20 by 20", sqft: 400, item: "vendorBooth20x20", cents: 49999, note: "A build rather than a stall. Seating, or a working display." },
  { size: "40 by 40", sqft: 1600, item: "vendorBooth40x40", cents: 64999, note: "An activation. Vehicles inside the footprint, room to gather." },
]

/** The add-on, on top of any footprint. */
export const PREMIUM_PLACEMENT = { item: "vendorPremiumPlacement", cents: 14999, label: "Premium placement" }

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
  const hasPrice = Boolean(i.priceId || i.lookupKey)
  const hasCents = typeof i.cents === "number" && i.cents > 0
  if (hasPrice !== hasCents) {
    throw new Error(
      `Stripe catalogue: ${slug}."${i.key}" has ${hasPrice ? "a price but no cents" : "cents but no priceId or lookupKey"}. ` +
        "Set both, or neither.",
    )
  }
  if (i.priceId && !i.lookupKey) {
    throw new Error(`Stripe catalogue: ${slug}."${i.key}" has a sandbox priceId but no lookupKey, so it cannot be found in live mode.`)
  }
}
