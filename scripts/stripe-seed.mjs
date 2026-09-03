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
const MODE = KEY.startsWith("sk_live_") ? "live" : "test"
const EVENT = "pistonpoweredranch"

const ITEMS = [
  { lookupKey: "ppr-2026-vendor-booth-10x10", name: "Vendor Booth, 10 by 10", cents: 25000, kind: "vendorBooth" },
  { lookupKey: "ppr-2026-vendor-booth-10x20", name: "Vendor Booth, 10 by 20", cents: 35000, kind: "vendorBooth10x20" },
  { lookupKey: "ppr-2026-vendor-booth-20x20", name: "Vendor Booth, 20 by 20", cents: 50000, kind: "vendorBooth20x20" },
  { lookupKey: "ppr-2026-vendor-booth-40x40", name: "Vendor Booth, 40 by 40", cents: 65000, kind: "vendorBooth40x40" },
  { lookupKey: "ppr-2026-vendor-premium-placement", name: "Premium placement", cents: 15000, kind: "vendorPremiumPlacement" },
  { lookupKey: "ppr-2026-sponsor-supporting", name: "Supporting Sponsor", cents: 50000, kind: "supporting" },
  { lookupKey: "ppr-2026-sponsor-secondary-title", name: "Secondary Sponsor", cents: 250000, kind: "secondaryTitle" },
  { lookupKey: "ppr-2026-sponsor-premier-title", name: "Title Sponsor", cents: 500000, kind: "premierTitle" },
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
