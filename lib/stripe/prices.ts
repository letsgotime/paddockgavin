import { STRIPE_API, type CatalogItem } from "./catalog"

/**
 * The price to charge, in whichever Stripe mode the key belongs to.
 *
 * Asked of Stripe by lookupKey, so the same catalogue works under the sandbox
 * key and the live key once scripts/stripe-seed.mjs has run under each. The
 * amount Stripe holds is checked against the amount the page printed, because
 * a page that says $250 and a session that charges something else is the one
 * mistake a vendor keeps the receipt for.
 *
 * The sandbox ids in the catalogue are the fallback under a test key only:
 * they do not exist in live mode, and trying them there is what produced a
 * refusal that read as a broken site.
 */
const cache = new Map<string, { id: string; at: number }>()
const TTL = 10 * 60 * 1000

export type Resolved = { id: string } | { error: string }

export async function priceIdFor(item: CatalogItem, secret: string): Promise<Resolved> {
  if (item.lookupKey) {
    const hit = cache.get(item.lookupKey)
    if (hit && Date.now() - hit.at < TTL) return { id: hit.id }
    try {
      const r = await fetch(
        `${STRIPE_API}/prices?lookup_keys[]=${encodeURIComponent(item.lookupKey)}&active=true&limit=1`,
        { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" },
      )
      const j = (await r.json()) as { data?: { id: string; unit_amount: number | null }[] }
      const p = j?.data?.[0]
      if (p) {
        if (typeof item.cents === "number" && p.unit_amount !== item.cents) {
          return { error: `Stripe holds ${p.unit_amount} cents for ${item.lookupKey}; the catalogue says ${item.cents}.` }
        }
        cache.set(item.lookupKey, { id: p.id, at: Date.now() })
        return { id: p.id }
      }
    } catch {
      /* fall through to the sandbox id, or to the error below */
    }
  }
  if (item.priceId && secret.startsWith("sk_test_")) return { id: item.priceId }
  return { error: `No price named ${item.lookupKey || item.key} in this Stripe mode. Run scripts/stripe-seed.mjs with the same key.` }
}
