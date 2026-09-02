import { NextResponse } from "next/server"
import { CATALOG, STRIPE_API, itemFor, isOnSale } from "@/lib/stripe/catalog"
import { DONATION_MIN, DONATION_MAX } from "@/lib/shop/store"
import { loadEvent } from "@/lib/events/load"

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
  /** A key in CATALOG, or "donation". Not an amount, deliberately. */
  item: string
  email?: string
  org?: string
  /** Free text, carried into metadata so the desk sees it with the payment. */
  note?: string
  /**
   * Cents, and only ever read for a donation.
   *
   * This is the one thing a buyer is entitled to name, because the amount of a
   * gift is the giver's to decide. It is still not trusted: it must be a whole
   * number of cents inside the published limits, and anything else is refused
   * rather than clamped quietly, so nobody is charged a figure they did not
   * type. Every other item ignores this field completely.
   */
  amountCents?: number
  /**
   * Which event the money is for.
   *
   * Checked against the events table rather than trusted, because it is
   * written into Stripe metadata and the webhook books the payment against
   * whatever it says. A slug that matches no row is refused here rather than
   * producing a payment that is real in Stripe and absent from the ledger.
   */
  eventSlug?: string
}

/** The event, or null. Never a slug we have not seen. */
async function eventFor(slug: string | undefined) {
  const s = (slug || "pistonpoweredranch").trim().toLowerCase()
  if (!/^[a-z0-9-]{2,64}$/.test(s)) return null
  return loadEvent(s)
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

/**
 * A Checkout Session for a gift, built from an amount rather than a price id.
 *
 * There is no donation object in the account, and inventing one is not mine to
 * do, so the session carries price_data with the amount the giver typed and a
 * product named for where the money goes. When somebody creates a real
 * Donation product, its id drops into product_data's place and nothing else
 * here changes.
 *
 * The beneficiary is named on the line item on purpose. It is what the whole
 * day is for, and it is the last thing somebody reads before they pay.
 */
async function donate(req: Request, cents: number, b: Body, ev: { slug: string; name: string; charity: string | null }) {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    return NextResponse.json(
      { error: "not_configured", detail: "STRIPE_SECRET_KEY is not set on this deployment." },
      { status: 503 },
    )
  }

  const origin = new URL(req.url).origin
  const payload = flatten({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: cents,
          product_data: { name: `Donation to ${ev.charity || ev.name}` },
        },
      },
    ],
    success_url: `${origin}/events/${ev.slug}/store/thank-you?s={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/events/${ev.slug}/store`,
    customer_email: b.email || undefined,
    submit_type: "donate",
    metadata: {
      event: ev.slug,
      event_slug: ev.slug,
      kind: "donation",
      beneficiary: ev.charity || "",
      note: (b.note || "").slice(0, 400),
    },
    payment_intent_data: {
      metadata: { event: ev.slug, kind: "donation" },
    },
  })

  const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(payload).toString(),
  })

  const json = await res.json()
  if (!res.ok) {
    return NextResponse.json(
      { error: "stripe", detail: json?.error?.message || "Stripe refused the session." },
      { status: 502 },
    )
  }
  return NextResponse.json({ url: json.url })
}

export async function POST(req: Request) {
  try {
    const b: Body = await req.json()

    /* Giving, where the giver sets the figure. Handled before the catalogue
       lookup because there is no catalogue object for it: a donation is not a
       product with a price, it is whatever somebody decided to give. */
    if (b.item === "donation") {
      const cents = Number(b.amountCents)
      if (!Number.isInteger(cents) || cents < DONATION_MIN || cents > DONATION_MAX) {
        return NextResponse.json(
          {
            error: "bad_amount",
            detail: `A donation must be a whole number of cents between ${DONATION_MIN} and ${DONATION_MAX}.`,
          },
          { status: 400 },
        )
      }
      const ev = await eventFor(b.eventSlug)
      if (!ev) {
        return NextResponse.json({ error: "unknown_event", detail: "No such event." }, { status: 400 })
      }
      return donate(req, cents, b, ev)
    }

    const item = itemFor(b.item)

    /* Known, wired, and not yet priced. Distinct from an unknown key on
       purpose: this is not a mistake by whoever called it, it is a thing we
       have not put on sale, and the page says TBD rather than pretending the
       request was malformed. */
    if (item && !isOnSale(item)) {
      return NextResponse.json(
        { error: "price_not_set", item: item.key, detail: `${item.name} does not have a price yet.` },
        { status: 409 },
      )
    }
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
        /* The ranch webhook looks the events row up by slug from this field.
           It must match public.events.slug exactly, which is
           "pistonpoweredranch" with no hyphens. The webhook's own fallback
           spelled it with hyphens, which matches nothing, and the write is an
           INSERT ... SELECT: no matching row means zero rows inserted and a
           200 returned. Every payment would have looked booked and been
           absent from the ledger. */
        event_slug: "pistonpoweredranch",
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
      /* 422 rather than 502 on purpose. Cloudflare sits in front of this and
         replaces 5xx bodies with its own error page, which swallowed a plain
         "Invalid API Key" and turned a one line misconfiguration into a hunt
         through the logs. Stripe refusing a request is not a gateway failure
         anyway: the gateway worked and the answer was no. */
      return NextResponse.json(
        { error: "stripe_error", detail: json?.error?.message || `Stripe returned ${res.status}` },
        { status: 422 },
      )
    }

    return NextResponse.json({ url: json.url, id: json.id })
  } catch (err) {
    console.error("[stripe/checkout]", err)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
