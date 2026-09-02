import { PRODUCTS, type Product } from "./catalogue"
import { catalogFor, isOnSale } from "@/lib/stripe/catalog"
import type { EventRow } from "@/lib/events/types"

/**
 * The public store: tickets, giving, and merchandise, in one list.
 *
 * Three states, and which one a thing is in depends entirely on whether a real
 * number exists for it. Nothing here invents one.
 *
 *   buy    a real Stripe price, or an amount the buyer names themselves
 *   ask    a real thing whose answer is a conversation, not a number
 *   tbd    wired to checkout, waiting on a price
 *
 * Everything marked tbd already has a key the checkout route understands and a
 * button on its card. Setting priceId and cents in lib/stripe/catalog.ts, from
 * the objects in Stripe, is the whole of putting it on sale. No component and
 * no route changes.
 *
 * Sponsorship is deliberately absent. Those tiers carry figures and they are
 * sponsor-facing, and sponsor-facing material does not print prices.
 */

export type Availability = "buy" | "ask" | "tbd"

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

/**
 * Tickets and giving, built from the event row.
 *
 * Nothing here is the ranch by name. The beneficiary comes from the charity
 * column, the VIP rooms come from the vip act in content, and an event with
 * neither simply shows neither. That is what makes the next event a row.
 */
function tickets(e: EventRow): StoreItem[] {
  const out: StoreItem[] = [
    {
      slug: "spectate",
      name: "Spectator admission",
      group: "Tickets",
      blurb:
        e.content?.admission?.free
          ? "Free, for everybody. Tell us you are coming so we know how much to put on."
          : "Tell us you are coming.",
      availability: "ask",
      askHref: e.content?.admission?.url || "/spectate",
      askLabel: "Tell us you are coming",
    },
  ]

  /* The VIP rooms, as the event already describes them. Their names and lines
     are the ones on the public page, so the store cannot drift from it. */
  const vip = (e.content?.acts || []).find((a) => a.id === "vip")
  for (const tier of vip?.tiers || []) {
    out.push({
      slug: `vip-${tier.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      name: tier.name,
      group: "Tickets",
      blurb: tier.line,
      /* A room with no catalogue key has nothing to sell and nothing to sell
         it with, so it asks rather than showing a button that cannot work.
         That happens when a tier is renamed, which is a copy change nobody
         would think to check against Stripe. */
      availability: VIP_KEYS[tier.name] ? "tbd" : "ask",
      checkoutKey: VIP_KEYS[tier.name],
      askHref: `/events/${e.slug}/sponsor`,
      askLabel: "Ask about the seats",
    })
  }
  return out
}

/** Which catalogue entry a room maps to, until they carry their own ids. */
const VIP_KEYS: Record<string, string> = {
  "The Terrace": "vipTerrace",
  "The Owner's Table": "vipOwnersTable",
}

function giving(e: EventRow): StoreItem[] {
  if (!e.charity) return []
  return [
    {
      slug: "donation",
      name: `Give to ${e.charity}`,
      group: "Giving",
      blurb: `The day exists for ${e.charity}. Give what you like, whether or not you come, and it goes to them.`,
      availability: "buy",
      openAmount: true,
      checkoutKey: "donation",
    },
  ]
}

const MERCH_KEYS: Record<string, string> = {
  "ranch-gate-tee": "teeRanchGate",
  "ppr-october-tee": "teePprOctober",
  "ranch-cap": "capRanch",
  "pg-trucker": "truckerPg",
  "ranch-mug": "mugRanch",
  "ranch-backpack": "backpackRanch",
}

/**
 * Merchandise, with its state read from the Stripe catalogue rather than
 * written down here. A price appearing in Stripe turns the card on by itself.
 */
function merch(e: EventRow): StoreItem[] {
  const set = catalogFor(e.slug)
  return PRODUCTS.map((p: Product) => {
    const key = MERCH_KEYS[p.slug]
    const entry = key ? set[key] : undefined
    const onSale = isOnSale(entry)
    return {
      slug: p.slug,
      name: p.name,
      group: "Merchandise" as const,
      blurb: p.blurb,
      availability: onSale ? ("buy" as const) : ("tbd" as const),
      cents: onSale ? entry!.cents : undefined,
      checkoutKey: key,
      image: p.image,
    }
  })
}

export function storeItems(e: EventRow): StoreItem[] {
  return [...giving(e), ...tickets(e), ...merch(e)]
}

export function money(cents: number): string {
  return "$" + (cents / 100).toFixed(2).replace(/\.00$/, "")
}
