import { NextResponse } from "next/server"
import { tooMany } from "@/lib/ranch/limit"

/**
 * A one-time admin action, not a public route.
 *
 * Creates the two real Stripe objects VIP has never had: a Product and a
 * Price for The Terrace and for The Owner's Table, in whichever mode
 * STRIPE_SECRET_KEY belongs to. Idempotent by lookup key, same as
 * scripts/stripe-seed.mjs, which this mirrors so a local run with the same
 * key would report these as already existing rather than duplicating them.
 *
 * Creating these objects has no public effect by itself. Nothing in
 * lib/stripe/catalog.ts references their lookup keys yet, so the store page
 * keeps reading vipTerrace and vipOwnersTable as unpriced until that file is
 * edited separately. That edit is the actual go-live step, held back on
 * purpose until the price is approved.
 *
 * Delete this route once it has been called once. It exists to move money
 * server-side without a secret ever leaving the server, not to stay.
 */

const GATE = "179179"

const ITEMS = [
  { lookupKey: "ppr-2026-vip-terrace", name: "VIP: The Terrace", cents: 24900 },
  { lookupKey: "ppr-2026-vip-owners-table", name: "VIP: The Owner's Table", cents: 39900 },
]

async function stripeCall(key: string, path: string, body?: Record<string, string>) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${key}`, ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}) },
    body: body ? new URLSearchParams(body).toString() : undefined,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message || `Stripe ${res.status} on ${path}`)
  return json
}

export async function POST(req: Request) {
  const limited = tooMany(req, "seed-vip", 5)
  if (limited) return limited

  const b = await req.json().catch(() => ({}))
  if (b.password !== GATE) return NextResponse.json({ error: "locked" }, { status: 401 })

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return NextResponse.json({ error: "not_configured" }, { status: 503 })
  const mode = key.startsWith("sk_live_") ? "live" : "test"

  const results: Record<string, unknown>[] = []
  for (const item of ITEMS) {
    try {
      const existing = await stripeCall(key, `/prices?lookup_keys[]=${encodeURIComponent(item.lookupKey)}&limit=1`)
      if (existing.data?.[0]) {
        results.push({ lookupKey: item.lookupKey, status: "already existed", priceId: existing.data[0].id, productId: existing.data[0].product })
        continue
      }
      const product = await stripeCall(key, "/products", {
        name: item.name,
        "metadata[event]": "pistonpoweredranch",
        "metadata[ledger]": "vip",
      })
      const price = await stripeCall(key, "/prices", {
        product: product.id,
        currency: "usd",
        unit_amount: String(item.cents),
        lookup_key: item.lookupKey,
        "metadata[event]": "pistonpoweredranch",
      })
      results.push({ lookupKey: item.lookupKey, status: "created", priceId: price.id, productId: product.id, cents: item.cents })
    } catch (err) {
      results.push({ lookupKey: item.lookupKey, status: "error", detail: err instanceof Error ? err.message : String(err) })
    }
  }

  return NextResponse.json({ mode, results })
}
