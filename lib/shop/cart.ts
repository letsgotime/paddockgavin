import { bySlug, variantOf, buyable, type Product, type Variant } from "./catalogue"
import { money } from "./store"

/**
 * The basket.
 *
 * Three fields are stored and nothing else: what, which size, how many. No
 * price is ever written down here. The amount is looked up from the catalogue
 * when the basket is drawn and charged from the catalogue again on the server,
 * so a price that changes overnight is right in the morning and a basket
 * edited in devtools cannot name its own figure.
 *
 * State lives in localStorage because a basket that empties itself on reload
 * is worse than no basket. Every read is wrapped: private mode and blocked
 * site data both throw on access rather than returning null, and a shop that
 * breaks in a private window is a shop that loses the sale.
 */

const KEY = "ppr_cart_v1"

export interface CartLine {
  slug: string
  variant: string
  qty: number
}

/** A line with everything the UI needs, resolved from the catalogue. */
export interface ResolvedLine extends CartLine {
  product: Product
  variantRow: Variant
  cents: number
  lineTotal: number
}

type Listener = () => void
const listeners = new Set<Listener>()

export function subscribe(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function announce() {
  for (const fn of listeners) fn()
  /* Other tabs get the storage event for free; this is for the tab that made
     the change, which does not. */
  if (typeof window !== "undefined") window.dispatchEvent(new Event("ppr-cart"))
}

export function read(): CartLine[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((l) => l && typeof l.slug === "string" && typeof l.variant === "string")
      .map((l) => ({ slug: String(l.slug), variant: String(l.variant), qty: clampQty(Number(l.qty)) }))
      .slice(0, 20)
  } catch {
    return []
  }
}

function write(lines: CartLine[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines.slice(0, 20)))
  } catch {
    /* Storage refused. The basket still works for this page view. */
  }
  announce()
}

function clampQty(n: number): number {
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.min(Math.floor(n), 10)
}

export function add(slug: string, variant: string, qty = 1) {
  const lines = read()
  const hit = lines.find((l) => l.slug === slug && l.variant === variant)
  if (hit) hit.qty = clampQty(hit.qty + qty)
  else lines.push({ slug, variant, qty: clampQty(qty) })
  write(lines)
}

export function setQty(slug: string, variant: string, qty: number) {
  const lines = read().map((l) => (l.slug === slug && l.variant === variant ? { ...l, qty: clampQty(qty) } : l))
  write(lines)
}

export function remove(slug: string, variant: string) {
  write(read().filter((l) => !(l.slug === slug && l.variant === variant)))
}

export function clear() {
  write([])
}

/**
 * The basket as the UI needs it.
 *
 * A line whose product or size has left the catalogue is dropped rather than
 * drawn broken: the shop changes, and a basket saved a month ago should not
 * be able to put a thing that no longer exists in front of a buyer.
 */
export function resolve(lines: CartLine[] = read()): ResolvedLine[] {
  const out: ResolvedLine[] = []
  for (const l of lines) {
    const product = bySlug(l.slug)
    if (!product) continue
    const variantRow = variantOf(product, l.variant)
    if (!variantRow || !buyable(variantRow)) continue
    const cents = variantRow.cents as number
    out.push({ ...l, product, variantRow, cents, lineTotal: cents * l.qty })
  }
  return out
}

export function count(lines: CartLine[] = read()): number {
  return resolve(lines).reduce((n, l) => n + l.qty, 0)
}

export function subtotal(lines: CartLine[] = read()): number {
  return resolve(lines).reduce((n, l) => n + l.lineTotal, 0)
}

export function subtotalLabel(lines: CartLine[] = read()): string {
  return money(subtotal(lines))
}
