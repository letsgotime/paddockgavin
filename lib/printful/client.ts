import { variantId } from "./garments"

/**
 * Printful, for dropshipped merchandise.
 *
 * The money is already taken by the time anything here runs, which decides
 * every design choice below. An order that cannot be placed must never be
 * lost quietly: the caller keeps the desk email it already sent, so a failure
 * here degrades to what the shop did before Printful existed, which is Gavin
 * packing it himself. Nothing regresses when this is switched off.
 *
 * The token lives in the environment and nowhere else. Without it this module
 * reports "not configured" rather than throwing, so a deployment that has not
 * had the key added yet still takes orders.
 */

const API = "https://api.printful.com"

export type PlaceResult =
  | { ok: true; orderId: number; status: string; draft: boolean }
  | { ok: false; reason: "not_configured" | "no_variant" | "printful_error" | "no_address"; detail: string }

export interface ShipTo {
  name?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  email?: string
  phone?: string
}

export interface Line {
  /** A key in lib/printful/garments.ts. */
  garment: string
  color: string
  size: string
  quantity: number
  /** A public URL Printful can fetch the artwork from. */
  printFile: string
  /** What the buyer thinks they bought, for the packing slip. */
  name: string
}

/**
 * Draft unless told otherwise.
 *
 * A draft lands in the Printful dashboard and waits. That is the right default
 * for a shop that has never shipped one of these before: the first orders get
 * looked at by a person before a machine prints them. Set PRINTFUL_AUTO_CONFIRM
 * to "true" once the line is proven and they go straight to production.
 */
function autoConfirm(): boolean {
  return (process.env.PRINTFUL_AUTO_CONFIRM || "").toLowerCase() === "true"
}

function addressComplete(s: ShipTo): boolean {
  return Boolean(s.address1 && s.city && s.zip && s.country)
}

/**
 * Places one order for one paid session.
 *
 * `externalId` is the Stripe session, which is what makes this safe to call
 * twice. Stripe retries webhooks on any non-2xx and on its own schedule, and
 * without this a retry would print and post a second shirt at Gavin's cost.
 * Printful rejects a duplicate external id, and that rejection is treated as
 * success because it means the first attempt already worked.
 */
export async function placeOrder(externalId: string, ship: ShipTo, lines: Line[]): Promise<PlaceResult> {
  const key = process.env.PRINTFUL_API_KEY
  if (!key) return { ok: false, reason: "not_configured", detail: "PRINTFUL_API_KEY is not set on this deployment." }
  if (!addressComplete(ship)) {
    return { ok: false, reason: "no_address", detail: "The session carried no usable shipping address." }
  }

  const items: Record<string, unknown>[] = []
  for (const l of lines) {
    const vid = variantId(l.garment, l.color, l.size)
    if (!vid) {
      return { ok: false, reason: "no_variant", detail: `No Printful variant for ${l.garment} / ${l.color} / ${l.size}.` }
    }
    items.push({
      variant_id: vid,
      quantity: Math.max(1, Math.min(l.quantity || 1, 10)),
      name: l.name,
      files: [{ url: l.printFile }],
    })
  }

  const body = {
    external_id: externalId,
    recipient: {
      name: ship.name || "",
      address1: ship.address1,
      address2: ship.address2 || "",
      city: ship.city,
      state_code: ship.state || "",
      country_code: ship.country,
      zip: ship.zip,
      email: ship.email || "",
      phone: ship.phone || "",
    },
    items,
  }

  let res: Response
  try {
    res = await fetch(`${API}/orders?confirm=${autoConfirm() ? "1" : "0"}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })
  } catch (err) {
    return { ok: false, reason: "printful_error", detail: err instanceof Error ? err.message : String(err) }
  }

  const json = (await res.json().catch(() => null)) as
    | { code?: number; result?: { id?: number; status?: string }; error?: { message?: string } }
    | null

  if (!res.ok) {
    const msg = json?.error?.message || `Printful ${res.status}`
    /* Already placed. A webhook retry, not a problem: the first call worked
       and the shirt is already in the queue. */
    if (/external_id/i.test(msg) && /exist|duplicate|taken/i.test(msg)) {
      return { ok: true, orderId: 0, status: "already_placed", draft: !autoConfirm() }
    }
    return { ok: false, reason: "printful_error", detail: msg }
  }

  return {
    ok: true,
    orderId: json?.result?.id ?? 0,
    status: json?.result?.status ?? "unknown",
    draft: !autoConfirm(),
  }
}
