#!/usr/bin/env node
/**
 * Creates the ranch's products and prices in whichever Stripe mode the key
 * belongs to, named by lookup key so the checkout route finds them.
 *
 *   STRIPE_SECRET_KEY=sk_live_... node scripts/stripe-seed.mjs
 *
 * Idempotent: a price that already exists under its lookup key is left alone
 * and reported. Nothing here is charged, and nothing is deleted. Amounts
 * mirror lib/stripe/catalog.ts; if one changes there, change it here.
 */
const KEY = process.env.STRIPE_SECRET_KEY
if (!KEY) {
  console.error("Set STRIPE_SECRET_KEY to the key for the mode you are seeding.")
  process.exit(1)
}
if (/PASTE|HERE|xxx/i.test(KEY) || !/^sk_(live|test)_[A-Za-z0-9]{20,}$/.test(KEY)) {
  console.error("That is not a Stripe secret key. Replace the placeholder with the real key:")
  console.error("  Stripe dashboard, Developers, API keys, Secret key, Reveal, copy the value that starts sk_live_")
  console.error("  then run:  STRIPE_SECRET_KEY=sk_live_<the key> node scripts/stripe-seed.mjs")
  process.exit(1)
}
const MODE = KEY.startsWith("sk_live_") ? "live" : "test"
const EVENT = "pistonpoweredranch"

const ITEMS = [
  { lookupKey: "ppr-2026-vendor-booth-10x10", name: "Vendor Booth, 10 by 10", cents: 24999, kind: "vendorBooth" },
  { lookupKey: "ppr-2026-vendor-booth-10x20", name: "Vendor Booth, 10 by 20", cents: 34999, kind: "vendorBooth10x20" },
  { lookupKey: "ppr-2026-vendor-booth-20x20", name: "Vendor Booth, 20 by 20", cents: 49999, kind: "vendorBooth20x20" },
  { lookupKey: "ppr-2026-vendor-booth-40x40", name: "Vendor Booth, 40 by 40", cents: 64999, kind: "vendorBooth40x40" },
  { lookupKey: "ppr-2026-vendor-premium-placement", name: "Premium placement", cents: 14999, kind: "vendorPremiumPlacement" },
  { lookupKey: "ppr-2026-sponsor-bronze", name: "Bronze Sponsor", cents: 49999, kind: "bronze" },
  { lookupKey: "ppr-2026-sponsor-silver", name: "Silver Sponsor", cents: 99999, kind: "silver" },
  { lookupKey: "ppr-2026-sponsor-gold", name: "Gold Sponsor", cents: 249999, kind: "gold" },
  { lookupKey: "ppr-2026-sponsor-platinum", name: "Platinum Sponsor", cents: 499999, kind: "platinum" },
  { lookupKey: "ppr-2026-tee-ranch-gate", name: "The Gate Tee", cents: 1999, kind: "teeRanchGate" },
  { lookupKey: "ppr-2026-tee-october", name: "October Tenth Tee", cents: 1999, kind: "teePprOctober" },
  { lookupKey: "ppr-2026-cap-ranch", name: "The Ranch Cap", cents: 2499, kind: "capRanch" },
  { lookupKey: "ppr-2026-trucker-pg", name: "PaddockGavin Trucker", cents: 1999, kind: "truckerPg" },
  { lookupKey: "ppr-2026-mug-ranch", name: "The Ranch Mug", cents: 2499, kind: "mugRanch" },
  { lookupKey: "ppr-2026-parasol", name: "The Field Parasol", cents: 3499, kind: "parasolRanch" },
  { lookupKey: "ppr-2026-bottle", name: "The Ranch Bottle", cents: 2499, kind: "bottleRanch" },
  { lookupKey: "ppr-2026-backpack-ranch", name: "Field Backpack", cents: 4999, kind: "backpackRanch" },
  { lookupKey: "ppr-2026-hospitality-25", name: "Hospitality Tent, two cocktails and swag", cents: 2499, kind: "hospitality25" },
  { lookupKey: "ppr-2026-hospitality-75", name: "Hospitality Tent, three cocktails and swag", cents: 7499, kind: "hospitality75" },
  { lookupKey: "ppr-2026-hospitality-100", name: "Hospitality Tent, pair", cents: 9999, kind: "hospitality100" },
]

async function stripe(path, body) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${KEY}`, ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}) },
    body: body ? new URLSearchParams(body).toString() : undefined,
  })
  const j = await res.json()
  if (!res.ok) throw new Error(j?.error?.message || `Stripe ${res.status} on ${path}`)
  return j
}

console.log(`Seeding ${MODE} mode for ${EVENT}`)
process.on("uncaughtException", (err) => {
  const msg = err?.message || String(err)
  if (/Invalid API Key|No such|api_key/i.test(msg)) {
    console.error(`Stripe refused the key: ${msg}`)
    console.error("Check it is the live Secret key from the API keys page, copied whole, with no spaces.")
  } else if (/cannot currently make live charges|activate/i.test(msg)) {
    console.error(`Stripe said: ${msg}`)
    console.error("The account is not activated for live payments yet. Finish activation in the Stripe dashboard, then run this again.")
  } else {
    console.error(`Stripe said: ${msg}`)
  }
  process.exit(1)
})
for (const it of ITEMS) {
  const found = await stripe(`/prices?lookup_keys[]=${encodeURIComponent(it.lookupKey)}&active=true&limit=1`)
  if (found.data?.length) {
    const p = found.data[0]
    const ok = p.unit_amount === it.cents
    console.log(`${ok ? "kept " : "WRONG"} ${it.lookupKey} -> ${p.id} (${p.unit_amount} cents${ok ? "" : `, catalogue says ${it.cents}`})`)
    continue
  }
  const product = await stripe("/products", {
    name: it.name,
    "metadata[event]": EVENT,
    "metadata[kind]": it.kind,
  })
  const price = await stripe("/prices", {
    product: product.id,
    currency: "usd",
    unit_amount: String(it.cents),
    lookup_key: it.lookupKey,
    "metadata[event]": EVENT,
    "metadata[kind]": it.kind,
  })
  console.log(`made  ${it.lookupKey} -> ${price.id} on ${product.id} (${it.cents} cents)`)
}
console.log("Done. The checkout route resolves these by lookup key; nothing to paste anywhere.")
