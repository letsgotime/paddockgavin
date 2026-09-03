import { NextResponse } from "next/server"
import crypto from "node:crypto"
import { STRIPE_API, itemFor, isOnSale } from "@/lib/stripe/catalog"
import { priceIdFor } from "@/lib/stripe/prices"
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
 * a reason rather than throwing, so the page can render and say so. The same
 * 503 answers when the key is live and the live prices have not been seeded
 * yet, because "not open yet" is the truth in both cases.
 *
 * Amounts are never taken from the request. The client sends a catalogue key
 * and the price is read from Stripe on the server, because a browser that can
 * name its own price is a browser that will.
 *
 * Only public items. Sponsorship is agreed in conversation and invoiced from
 * the desk (/api/invoice); its figures never leave here, and an unknown key
 * is refused without a list of the known ones.
 */

export const runtime = "nodejs"

interface Body {
  /** A key in the catalogue, or "donation". Not an amount, deliberately. */
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

async function eventFor(slug: string | undefined) {
  const s = (slug || "").trim().toLowerCase()
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

async function donate(req: Request, cents: number, b: Body, ev: { slug: string; name: string; charity: string | null }) {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    return NextResponse.json({ error: "not_configured", detail: "STRIPE_SECRET_KEY is not set on this deployment." }, { status: 503 })
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
      ledger: "other",
      covers: `Donation to ${ev.charity || ev.name}`,
      beneficiary: ev.charity || "",
      note: (b.note || "").slice(0, 400),
    },
    payment_intent_data: {
      metadata: { event: ev.slug, kind: "donation" },
    },
  })

  const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(payload).toString(),
  })
  const json = await res.json()
  if (!res.ok) {
    return NextResponse.json({ error: "stripe", detail: json?.error?.message || "Stripe refused the session." }, { status: 502 })
  }
  return NextResponse.json({ url: json.url })
}

export async function POST(req: Request) {
  try {
    const b: Body = await req.json()

    if (b.item === "donation") {
      const cents = Number(b.amountCents)
      if (!Number.isInteger(cents) || cents < DONATION_MIN || cents > DONATION_MAX) {
        return NextResponse.json(
          { error: "bad_amount", detail: `A donation must be a whole number of cents between ${DONATION_MIN} and ${DONATION_MAX}.` },
          { status: 400 },
        )
      }
      const gev = await eventFor(b.eventSlug)
      if (!gev) return NextResponse.json({ error: "unknown_event", detail: "No such event." }, { status: 400 })
      return donate(req, cents, b, gev)
    }

    const ev = await eventFor(b.eventSlug)
    if (!ev) return NextResponse.json({ error: "unknown_event", detail: "No such event." }, { status: 400 })

    const item = itemFor(ev.slug, typeof b.item === "string" ? b.item : "")
    if (!item) return NextResponse.json({ error: "unknown_item" }, { status: 400 })

    /* Not for the public checkout. Sponsorship is agreed in a conversation and
       invoiced from the desk, and the figure is not printed anywhere public,
       including here. */
    if (item.audience !== "public") {
      return NextResponse.json(
        { error: "desk_only", detail: "This is arranged in conversation and invoiced from the desk. Write to sponsors@pistonpoweredranch.com." },
        { status: 403 },
      )
    }

    /* Known, wired, and not yet priced. Distinct from an unknown key on
       purpose: this is not a mistake by whoever called it, it is a thing we
       have not put on sale, and the page says TBD rather than pretending the
       request was malformed. */
    if (!isOnSale(item)) {
      return NextResponse.json({ error: "price_not_set", item: item.key, detail: `${item.name} does not have a price yet.` }, { status: 409 })
    }

    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      return NextResponse.json({ error: "not_configured", detail: "STRIPE_SECRET_KEY is not set on this deployment." }, { status: 503 })
    }

    const price = await priceIdFor(item, key)
    if ("error" in price) {
      console.error("[stripe/checkout]", price.error)
      return NextResponse.json({ error: "not_open", detail: price.error }, { status: 503 })
    }

    const origin = new URL(req.url).origin
    const booth = item.ledger === "vendor_setup"
    const payload = flatten({
      mode: "payment",
      /* The catalogue price, read from Stripe by name. The client never names
         an amount and could not if it wanted to. */
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: booth
        ? `${origin}/events/${ev.slug}/vendor/paid?s={CHECKOUT_SESSION_ID}`
        : `${origin}/events/${ev.slug}/store/thank-you?s={CHECKOUT_SESSION_ID}`,
      cancel_url: booth ? `${origin}/events/${ev.slug}/vendor/booth` : `${origin}/events/${ev.slug}/store`,
      customer_email: b.email || undefined,
      /* The webhook reads these to book the row against the right event and
         the right ledger line, which is how one Stripe account serves many
         events. event_slug must match public.events.slug exactly. */
      metadata: {
        event: ev.slug,
        event_slug: ev.slug,
        kind: item.key,
        ledger: item.ledger,
        covers: item.covers,
        org: (b.org || "").slice(0, 120),
        note: (b.note || "").slice(0, 400),
      },
      payment_intent_data: {
        metadata: { event: ev.slug, kind: item.key, ledger: item.ledger },
      },
    })

    /* Retrying a network blip must not create a second session and a second
       chance to be charged; two strangers in the same minute must not share
       one. The address is the key when there is one, a fresh nonce when not. */
    const who = (b.email || "").trim().toLowerCase() || crypto.randomUUID()
    const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Idempotency-Key": `ppr-${item.key}-${who}-${Math.floor(Date.now() / 60000)}`,
      },
      body: new URLSearchParams(payload).toString(),
    })

    const json = await res.json()
    if (!res.ok) {
      console.error("[stripe/checkout]", json?.error?.message || res.status)
      /* 422 rather than 502 on purpose. Cloudflare sits in front of this and
         replaces 5xx bodies with its own error page. Stripe refusing a request
         is not a gateway failure anyway: the gateway worked and the answer was
         no. */
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
