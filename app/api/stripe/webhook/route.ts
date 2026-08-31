import { NextResponse } from "next/server"
import crypto from "node:crypto"

/**
 * Stripe webhook.
 *
 * Three events matter: checkout.session.completed books a payment,
 * invoice.paid books a sponsor or a revenue share invoice, and
 * payment_intent.payment_failed is worth seeing rather than discovering later.
 *
 * Signature verification is done here rather than by the stripe package. It is
 * an HMAC over the raw body with the endpoint secret, and doing it by hand
 * means the raw body is never parsed before it is verified, which is the part
 * people get wrong. Next gives the raw text through req.text(), so nothing has
 * to be configured to stop the body being consumed.
 *
 * Unverified requests are refused. An endpoint that books payments on anyone's
 * say so is worse than no endpoint, and this URL is guessable.
 */

export const runtime = "nodejs"
/* The raw body must arrive byte for byte or the signature will not match. */
export const dynamic = "force-dynamic"

const TOLERANCE_SECONDS = 300

function verify(raw: string, header: string | null, secret: string): boolean {
  if (!header) return false
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const [k, ...rest] = p.split("=")
      return [k.trim(), rest.join("=")]
    }),
  )
  const t = parts.t
  const v1 = parts.v1
  if (!t || !v1) return false

  /* Replay guard. A signature stays valid forever without this. */
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(t))
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false

  const expected = crypto.createHmac("sha256", secret).update(`${t}.${raw}`, "utf8").digest("hex")
  const a = Buffer.from(expected, "utf8")
  const b = Buffer.from(v1, "utf8")
  if (a.length !== b.length) return false
  /* Constant time, so the comparison cannot be used to guess the signature. */
  return crypto.timingSafeEqual(a, b)
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const raw = await req.text()

  if (!secret) {
    /* Never book anything unverified. Answering 503 tells Stripe to retry,
       which means events are not lost while the secret is being set. */
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set; refusing to process")
    return NextResponse.json({ error: "not_configured" }, { status: 503 })
  }

  if (!verify(raw, req.headers.get("stripe-signature"), secret)) {
    console.error("[stripe/webhook] bad signature")
    return NextResponse.json({ error: "bad_signature" }, { status: 400 })
  }

  let evt: { type?: string; data?: { object?: Record<string, unknown> } }
  try {
    evt = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 })
  }

  const obj = evt.data?.object ?? {}
  const meta = (obj.metadata as Record<string, string>) || {}

  switch (evt.type) {
    case "checkout.session.completed":
    case "invoice.paid": {
      /* Logged rather than written, deliberately. The payments table lives in
         the CRM database, which this deployment does not hold a connection to:
         DATABASE_URL here points at morning-silence, and the CRM is
         wispy-wave. Writing it needs that connection string, which is a
         decision rather than something to guess at. Until then this is a
         durable record in the Vercel logs with everything needed to reconcile,
         and Stripe keeps its own. */
      console.log("[stripe/webhook] paid", {
        type: evt.type,
        id: obj.id,
        amount: obj.amount_total ?? obj.amount_paid,
        currency: obj.currency,
        email: obj.customer_email ?? obj.customer_details,
        event: meta.event,
        kind: meta.kind,
        org: meta.org,
        livemode: obj.livemode,
      })
      break
    }
    case "payment_intent.payment_failed": {
      console.error("[stripe/webhook] payment failed", {
        id: obj.id,
        reason: (obj.last_payment_error as Record<string, unknown>)?.message,
        event: meta.event,
        kind: meta.kind,
      })
      break
    }
    default:
      /* Acknowledged and ignored. Stripe retries anything not answered 2xx,
         so an unhandled type must still return 200 or it retries forever. */
      break
  }

  return NextResponse.json({ received: true })
}
