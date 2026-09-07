import { STRIPE_API, type CatalogItem } from "./catalog"

/**
 * The price to charge, in whichever Stripe mode the key belongs to.
 *
 * Asked of Stripe by lookupKey, so the same catalogue works under the sandbox
 * key and the live key. When Stripe has no price under that name yet, the
 * product and price are created here, from the catalogue, under the key the
 * server already holds. That is the whole of going live for a priced item:
 * nobody runs a script, and no key is ever typed anywhere.
 *
 * The amount Stripe holds is checked against the amount the page printed,
 * because a page that says $250 and a session that charges something else is
 * the one mistake a vendor keeps the receipt for.
 *
 * The sandbox ids in the catalogue are the fallback under a test key only:
 * they do not exist in live mode, and trying them there is what produced a
 * refusal that read as a broken site.
 */
const cache = new Map<string, { id: string; at: number }>()
/* A price id is stable once created, and the amount is checked against the
   catalogue on every resolve below, so a stale id cannot quietly charge the
   wrong figure. Ten minutes meant a warm instance still asked Stripe six
   times an hour per line item for an answer that had not changed. */
const TTL = 6 * 60 * 60 * 1000

export type Resolved = { id: string } | { error: string }

type Price = { id: string; unit_amount: number | null }

async function findByLookup(lookupKey: string, secret: string): Promise<Price | null> {
  const r = await fetch(`${STRIPE_API}/prices?lookup_keys[]=${encodeURIComponent(lookupKey)}&active=true&limit=1`, {
    headers: { Authorization: `Bearer ${secret}` },
    cache: "no-store",
  })
  const j = (await r.json()) as { data?: Price[]; error?: { message?: string } }
  if (!r.ok) throw new Error(j?.error?.message || `Stripe ${r.status} looking up ${lookupKey}`)
  return j?.data?.[0] ?? null
}

async function post(path: string, secret: string, body: Record<string, string>, idempotencyKey: string) {
  const r = await fetch(`${STRIPE_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
      /* The same request twice, from two functions racing on the first sale,
         yields one object. Stripe keeps the key for a day. */
      "Idempotency-Key": idempotencyKey,
    },
    body: new URLSearchParams(body).toString(),
  })
  const j = (await r.json()) as { id: string; unit_amount: number | null; error?: { message?: string } }
  if (!r.ok) throw new Error(j?.error?.message || `Stripe ${r.status} on ${path}`)
  return j
}

/**
 * Makes the product and price the catalogue describes, mirroring what
 * scripts/stripe-seed.mjs makes by hand: the same names, the same metadata,
 * the same lookup key. If another request made it first, that one wins.
 */
async function create(item: CatalogItem, secret: string, event: string): Promise<Price> {
  const lookupKey = item.lookupKey as string
  const product = await post(
    "/products",
    secret,
    { name: item.name, "metadata[event]": event, "metadata[kind]": item.key },
    `ppr-product-${event}-${lookupKey}`,
  )
  try {
    return await post(
      "/prices",
      secret,
      {
        product: product.id,
        currency: "usd",
        unit_amount: String(item.cents),
        lookup_key: lookupKey,
        "metadata[event]": event,
        "metadata[kind]": item.key,
      },
      `ppr-price-${event}-${lookupKey}-${item.cents}`,
    )
  } catch (err) {
    const theirs = await findByLookup(lookupKey, secret)
    if (theirs) return theirs
    throw err
  }
}

export async function priceIdFor(item: CatalogItem, secret: string, event = "pistonpoweredranch"): Promise<Resolved> {
  let refusal = ""
  if (item.lookupKey) {
    const hit = cache.get(item.lookupKey)
    if (hit && Date.now() - hit.at < TTL) return { id: hit.id }
    try {
      let p = await findByLookup(item.lookupKey, secret)
      if (!p && typeof item.cents === "number" && item.cents > 0) {
        console.log("[stripe/prices] creating", { lookupKey: item.lookupKey, cents: item.cents, live: secret.startsWith("sk_live_") })
        p = await create(item, secret, event)
      }
      if (p) {
        if (typeof item.cents === "number" && p.unit_amount !== item.cents) {
          return { error: `Stripe holds ${p.unit_amount} cents for ${item.lookupKey}; the catalogue says ${item.cents}.` }
        }
        cache.set(item.lookupKey, { id: p.id, at: Date.now() })
        return { id: p.id }
      }
    } catch (err) {
      refusal = err instanceof Error ? err.message : String(err)
      console.error("[stripe/prices]", item.lookupKey, refusal)
    }
  }
  if (item.priceId && secret.startsWith("sk_test_")) return { id: item.priceId }
  return {
    error: refusal
      ? `Stripe would not open ${item.lookupKey || item.key}: ${refusal}`
      : `No price named ${item.lookupKey || item.key} in this Stripe mode, and no amount in the catalogue to make one.`,
  }
}
