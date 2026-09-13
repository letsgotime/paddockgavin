import { NextRequest, NextResponse } from "next/server"
import { bearerFrom, emailFromToken, isStaff } from "@/lib/ranch/neon"
import { GARMENTS } from "@/lib/printful/garments"
import { PRODUCTS } from "@/lib/shop/catalogue"

/**
 * Is Printful actually talking to us?
 *
 * The token lives in Vercel and nowhere a developer can reach, which is
 * right, and which also means nobody can test the connection from a laptop.
 * The first proof that fulfilment works should not be a customer's order
 * failing, so this asks Printful the questions that matter and reports what
 * it hears back.
 *
 * It never returns the token, or any part of it. The only thing said about
 * the key is whether one is present and whether Printful accepted it.
 *
 * Staff only, same three checks as the other internal routes: a bearer
 * exists, the token verifies against our auth server's published keys, and
 * the database is asked who that is.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const API = "https://api.printful.com"

async function denyUnlessStaff(req: Request) {
  const bearer = bearerFrom(req)
  if (!bearer) return NextResponse.json({ error: "Sign in required" }, { status: 401 })
  const email = await emailFromToken(bearer)
  if (!email) return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
  if (!(await isStaff(bearer))) return NextResponse.json({ error: "Not authorised" }, { status: 403 })
  return null
}

async function ask(path: string, key: string) {
  try {
    const r = await fetch(`${API}${path}`, {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    })
    const j = (await r.json().catch(() => null)) as { result?: unknown; error?: { message?: string } } | null
    return { status: r.status, ok: r.ok, body: j }
  } catch (err) {
    return { status: 0, ok: false, body: { error: { message: err instanceof Error ? err.message : String(err) } } }
  }
}

export async function GET(req: NextRequest) {
  const denied = await denyUnlessStaff(req)
  if (denied) return denied

  const key = process.env.PRINTFUL_API_KEY || ""
  const notes: string[] = []

  /* What the site knows without asking anybody. */
  const garments = Object.entries(GARMENTS).map(([k, g]) => ({
    key: k,
    blank: g.blank,
    colors: Object.keys(g.colors).length,
    variants: Object.values(g.colors).reduce((n, sizes) => n + Object.keys(sizes).length, 0),
  }))
  const mapped = PRODUCTS.filter((p) => p.printful)
  const withArtwork = mapped.filter((p) => p.printful?.printFile)

  if (!key) {
    return NextResponse.json({
      verdict: "NOT CONFIGURED",
      detail: "PRINTFUL_API_KEY is not set on this deployment. Add it in Vercel, then redeploy: a new variable does not reach running code until the next build.",
      catalogue: { garments, productsMappedToABlank: mapped.length, productsWithArtwork: withArtwork.length },
    })
  }

  const stores = await ask("/stores", key)
  const orders = await ask("/orders?limit=1", key)

  const authOk = stores.ok
  const storeList = authOk
    ? (((stores.body?.result as { id?: number; name?: string; type?: string }[]) || []).map((s) => ({
        id: s.id,
        name: s.name,
        type: s.type,
      })))
    : []

  if (!authOk) {
    notes.push(
      stores.status === 401
        ? "Printful refused the token. It may be expired, revoked, or copied incompletely. Check its expiry under developers.printful.com, Tokens."
        : `Printful answered ${stores.status} when asked for stores.`,
    )
  }
  if (authOk && storeList.length === 0) {
    notes.push("The token authenticated but no store is visible to it. If it was scoped to a single store, that store may have been deleted.")
  }
  if (authOk && storeList.length > 1) {
    notes.push("This token can see more than one store, so it is account level. Orders will need a store id, which the client does not send. Reissue it scoped to a single store.")
  }
  if (!orders.ok) {
    notes.push(
      orders.status === 403
        ? "Orders are out of scope for this token. Without order scope nothing can ever be placed. Reissue the token with orders read and write."
        : `Reading orders answered ${orders.status}.`,
    )
  }
  if (withArtwork.length === 0) {
    notes.push("No product carries a print file yet, so every sale still falls back to the desk email and gets packed by hand. This is expected until real artwork exists; a mockup image is not artwork.")
  }

  const ready = authOk && orders.ok && storeList.length === 1
  return NextResponse.json({
    verdict: ready
      ? withArtwork.length
        ? "READY. Printful is connected and at least one product can be dropshipped."
        : "CONNECTED, waiting on artwork. Printful accepts this token; no product has a print file yet."
      : "NOT READY. See notes.",
    key: { present: true, acceptedByPrintful: authOk },
    stores: storeList,
    ordersReadable: orders.ok,
    autoConfirm: (process.env.PRINTFUL_AUTO_CONFIRM || "").toLowerCase() === "true",
    autoConfirmMeaning:
      (process.env.PRINTFUL_AUTO_CONFIRM || "").toLowerCase() === "true"
        ? "Orders go straight to production."
        : "Orders arrive as drafts and wait for you to confirm them in Printful.",
    catalogue: { garments, productsMappedToABlank: mapped.length, productsWithArtwork: withArtwork.length },
    notes,
  })
}
