import { NextResponse } from "next/server"
import { CATALOG, STRIPE_API, itemFor } from "@/lib/stripe/catalog"

/**
 * Creates a Stripe Checkout Session against the real catalogue objects.
 *
 * Called over REST with fetch rather than through the stripe package. The
 * codebase already talks to Resend this way, the surface used here is four
 * fields wide, and it is one fewer dependency to keep patched. Stripe's REST
 * API takes form encoding, including for nested keys, which is what the
 * flatten helper below is for.
 *
 * Safe without keys. If STRIPE_SECRET_KEY is absent the route answers 503 with
 * a reason rather than throwing, so the portal can render and say so. That
 * matters while the site is not public: nothing here should be able to take
 * money by accident, and nothing should crash a page because a key is not set
 * yet.
 *
 * Amounts are never taken from the request. The client sends a catalogue key
 * and the price is read from the catalogue on the server, because a browser
 * that can name its own price is a browser that will.
 */

export const runtime = "nodejs"

interface Body {
  /** A key in CATALOG. Not an amount, deliberately. */
  item: string
  email?: string
  org?: string
  /** Free text, carried into metadata so the desk sees it with the payment. */
  note?: string
}

/** Stripe takes application/x-www-form-urlencoded, nested keys included. */
function flatten(obj: Record<string, unknown>, prefix = ""): [string, string][] {
  const out: [string, string][] = []
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === "") continue
    const key = prefix ? `${prefix}[${k}]` : k
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (typeof item === "object" && item) out.push(...flatten(item as Record<string, unknown>, `${key}[${i}]`))
        else out.push([`${key}[${i}]`, String(item)])
      })
    } else if (typeof v === "object") {
      out.push(...flatten(v as Record<string, unknown>, key))
    } else {
      out.push([key, String(v)])
    }
  }
  return out
}

export async function POST(req: Request) {
  try {
    const b: Body = await req.json()
    const item = itemFor(b.item)
    if (!item) {
      return NextResponse.json(
        { error: "Unknown item", allowed: Object.keys(CATALOG) },
        { status: 400 },
      )
    }

    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      /* Not an error the visitor caused, and not something to hide behind a
         generic 500. The portal renders this as "not open yet" rather than as
         a failure, which is the truth. */
      return NextResponse.json(
        { error: "not_configured", detail: "STRIPE_SECRET_KEY is not set on this deployment." },
        { status: 503 },
      )
    }

    const origin = new URL(req.url).origin
    const payload = flatten({
      mode: "payment",
      /* The catalogue price, read on the server. The client never names an
         amount and could not if it wanted to. */
      line_items: [{ price: item.priceId, quantity: 1 }],
      success_url: `${origin}/events/pistonpoweredranch/vendor/paid?s={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/events/pistonpoweredranch/vendor`,
      customer_email: b.email || undefined,
      /* The webhook reads these to book the row against the right event and
         the right kind, which is how one Stripe account serves many events. */
      metadata: {
        event: "piston-powered-ranch",
        kind: item.key,
        product: item.productId,
        org: (b.org || "").slice(0, 120),
        note: (b.note || "").slice(0, 400),
      },
      payment_intent_data: {
        metadata: { event: "piston-powered-ranch", kind: item.key },
      },
    })

    const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
        /* Retrying a network blip must not create a second session and a
           second chance to be charged. */
        "Idempotency-Key": `ppr-${item.key}-${(b.email || "anon").toLowerCase()}-${Math.floor(Date.now() / 60000)}`,
      },
      body: new URLSearchParams(payload).toString(),
    })

    const json = await res.json()
    if (!res.ok) {
      console.error("[stripe/checkout]", json?.error?.message || res.status)
      return NextResponse.json({ error: "stripe_error", detail: json?.error?.message }, { status: 502 })
    }

    return NextResponse.json({ url: json.url, id: json.id })
  } catch (err) {
    console.error("[stripe/checkout]", err)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
