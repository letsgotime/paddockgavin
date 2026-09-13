import { NextResponse } from "next/server"
import { placeOrder } from "@/lib/printful/client"
import { bySlug } from "@/lib/shop/catalogue"
import crypto from "node:crypto"
import { crm } from "@/lib/crm/pool"
import { STRIPE_API, money } from "@/lib/stripe/catalog"
import { renderRanchEmail, renderRanchText, type Block, type RanchEmail } from "@/lib/email/ranch"
import { ranchTemplate } from "@/lib/email/ranch-templates"

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
 *
 * A verified payment is written to public.payments in the CRM, once, keyed on
 * the Stripe object id so a redelivery cannot book it twice. The first booking
 * also sends the receipt to the payer and a note to the desk. HQ reads the
 * ledger; the person on the desk decides what goes on the vendor row.
 */

export const runtime = "nodejs"
/* The raw body must arrive byte for byte or the signature will not match. */
export const dynamic = "force-dynamic"

const TOLERANCE_SECONDS = 300
const RANCH = "https://pistonpoweredranch.com"
const NOREPLY = "The Piston Powered Ranch <noreply@pistonpoweredranch.com>"

type Ledger = "vendor_setup" | "sponsorship" | "revenue_share" | "vip" | "merch" | "event_day" | "other"

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


/**
 * One row per payment, and only one.
 *
 * `stripe_object` is unique, so a redelivered event writes nothing and reports
 * false. Returns whether this call was the one that booked it, which is what
 * gates receipts: a retry must not send a second one.
 */
async function bookPayment(
  db: NonNullable<ReturnType<typeof crm>>,
  eventId: string | null,
  kind: Ledger,
  stripeObject: string,
  amountCents: number,
  currency: string,
  email: string | null,
  livemode: boolean,
): Promise<boolean> {
  const ins = await db.query(
    `insert into public.payments (event_id, kind, stripe_object, amount_cents, currency, status, payer_email, livemode)
     values ($1, $2, $3, $4, $5, 'paid', $6, $7)
     on conflict (stripe_object) do nothing
     returning id`,
    [eventId, kind, stripeObject, amountCents, currency, email, livemode],
  )
  return (ins.rowCount ?? 0) > 0
}

/** The ledger line, from what the session was told when it was made. */
function ledgerOf(meta: Record<string, string>): Ledger {
  const l = meta.ledger
  if (l === "vendor_setup" || l === "sponsorship" || l === "revenue_share" || l === "vip" || l === "merch" || l === "event_day" || l === "other") return l
  const k = meta.kind || ""
  if (k === "vendorBooth") return "vendor_setup"
  if (/bronze|silver|gold|platinum|title|sponsor/i.test(k)) return "sponsorship"
  if (/^vip/.test(k)) return "vip"
  return "other"
}

/* A payment made through a payment link carries the link's metadata on the
   session. If it did not, the link itself still has it. */
async function linkMetadata(linkId: string): Promise<Record<string, string>> {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return {}
  try {
    const r = await fetch(`${STRIPE_API}/payment_links/${linkId}`, { headers: { Authorization: `Bearer ${key}` } })
    const j = (await r.json()) as { metadata?: Record<string, string> }
    return j.metadata || {}
  } catch {
    return {}
  }
}

/**
 * A send that never reached Resend is the one failure nobody can find.
 *
 * public.email_events is fed by Resend's own webhook, so it only ever holds
 * messages Resend accepted. When the handoff itself fails, Resend never sees
 * the message, no webhook fires, and the row never exists. That gap sits
 * immediately after money has moved: the payer is charged and their receipt
 * is gone with nothing anywhere to say so. This writes the failure into the
 * same table the deliveries land in, so one query answers "what did we fail
 * to send" alongside "what bounced".
 */
async function recordSendFailure(tag: string, payload: Record<string, unknown>, reason: string) {
  const to = Array.isArray(payload.to) ? String(payload.to[0] ?? "") : String(payload.to ?? "")
  console.error("[stripe/webhook] message not sent", { tag, to, reason })
  const db = crm()
  if (!db) return
  try {
    await db.query(
      `insert into public.email_events (event_id, email_id, type, recipient, subject, occurred_at, payload)
       values ($1, null, 'send_failed', $2, $3, now(), $4)
       on conflict (event_id) do nothing`,
      [`send_failed:${tag}`, to || null, String(payload.subject ?? ""), JSON.stringify({ tag, reason })],
    )
  } catch (err) {
    /* Nothing left to do but say so. The payment is already booked. */
    console.error("[stripe/webhook] could not record the send failure either", err)
  }
}

async function mail(payload: Record<string, unknown>, tag: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    await recordSendFailure(tag, payload, "RESEND_API_KEY is not set")
    return false
  }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!r.ok) {
      await recordSendFailure(tag, payload, `resend ${r.status}: ${(await r.text()).slice(0, 300)}`)
      return false
    }
    return true
  } catch (err) {
    await recordSendFailure(tag, payload, String(err))
    return false
  }
}

/**
 * Every signing secret this deployment will accept.
 *
 * One endpoint, one secret, and the account has more than one endpoint: the
 * ranch domain and the PaddockGavin domain are separate registrations in
 * Stripe even though the same function answers both, and each has its own
 * secret. Verifying against a single one means every delivery to the other
 * fails, which Stripe then retries for days.
 *
 * So STRIPE_WEBHOOK_SECRET takes a comma separated list. One value behaves
 * exactly as before.
 */
function secrets(): string[] {
  return (process.env.STRIPE_WEBHOOK_SECRET || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

export async function POST(req: Request) {
  const all = secrets()
  const raw = await req.text()

  if (!all.length) {
    /* Never book anything unverified. Answering 503 tells Stripe to retry,
       which means events are not lost while the secret is being set. */
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set; refusing to process")
    return NextResponse.json({ error: "not_configured" }, { status: 503 })
  }

  const sig = req.headers.get("stripe-signature")
  if (!all.some((secret) => verify(raw, sig, secret))) {
    console.error("[stripe/webhook] bad signature against all %d configured secrets", all.length)
    return NextResponse.json({ error: "bad_signature" }, { status: 400 })
  }

  let evt: { type?: string; data?: { object?: Record<string, unknown> } }
  try {
    evt = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 })
  }

  const obj = evt.data?.object ?? {}
  let meta = (obj.metadata as Record<string, string>) || {}

  switch (evt.type) {
    /* Sold in person, on the day, off a Stripe reader.
     *
     * A reader makes a PaymentIntent; it never makes a Checkout Session, so
     * without this case every sale at the gate on 10 October would sit in
     * Stripe and never reach the ledger. The card_present test is what keeps
     * that honest in the other direction too: an online sale raises this same
     * event moments after its checkout.session.completed, and booking both
     * would count every web order twice. Online is "card", a reader is
     * "card_present", so only the reader gets through here.
     */
    case "payment_intent.succeeded": {
      const types = (obj.payment_method_types as string[] | undefined) || []
      const charges = ((obj.charges as { data?: { payment_method_details?: { type?: string } }[] } | undefined)?.data) || []
      const inPerson = types.includes("card_present") || charges.some((c) => c.payment_method_details?.type === "card_present")
      if (!inPerson) return NextResponse.json({ ok: true, skipped: "not_in_person" })

      const id = String(obj.id || "")
      const amount = Number(obj.amount_received ?? obj.amount ?? 0)
      const currency = String(obj.currency || "usd").toLowerCase()
      const email = (typeof obj.receipt_email === "string" && obj.receipt_email) || null
      const livemode = obj.livemode === true
      const db = crm()
      if (!db) {
        console.error("[stripe/webhook] CRM_DATABASE_URL is not set; asking Stripe to retry", { id })
        return NextResponse.json({ error: "not_configured" }, { status: 503 })
      }
      if (!id) {
        console.error("[stripe/webhook] in-person payment carried no id; nothing booked", { amount })
        return NextResponse.json({ ok: true })
      }
      try {
        const slug = meta.event_slug || meta.event || "pistonpoweredranch"
        const ev = await db.query<{ id: string }>(`select id from public.events where slug = $1 limit 1`, [slug])
        const booked = await bookPayment(db, ev.rows[0]?.id ?? null, "event_day", id, amount, currency, email, livemode)
        console.log("[stripe/webhook] in person", { id, amount, currency, booked, livemode })
      } catch (err) {
        console.error("[stripe/webhook] could not book an in-person payment, asking Stripe to retry", err)
        return NextResponse.json({ error: "ledger_write_failed" }, { status: 500 })
      }
      return NextResponse.json({ ok: true })
    }

    case "checkout.session.completed":
    case "invoice.paid": {
      if (!meta.kind && typeof obj.payment_link === "string") meta = { ...(await linkMetadata(obj.payment_link)), ...meta }

      const id = String(obj.id || "")
      const amount = Number(obj.amount_total ?? obj.amount_paid ?? 0)
      const currency = String(obj.currency || "usd").toLowerCase()
      const details = (obj.customer_details as { email?: string; name?: string; phone?: string } | undefined) || {}
      const email = (typeof obj.customer_email === "string" && obj.customer_email) || details.email || null
      const payer = details.name || null
      const livemode = obj.livemode === true
      const ledger = ledgerOf(meta)
      const slug = meta.event_slug || meta.event || ""

      /* Merchandise. Gavin packs and posts these himself, so the only thing
         that has to happen is that the order and the address reach him. It is
         handled before the event branch below, because a tee has no event and
         everything after this point assumes one. */
      if (meta.kind === "shop") {
        const ship = (obj.shipping_details || (obj.collected_information as Record<string, unknown> | undefined)?.shipping_details) as
          | { name?: string; address?: Record<string, string> }
          | undefined
        const a = ship?.address || {}
        const lines = [
          `${meta.covers || meta.slug || "Item"} x${meta.quantity || "1"}`,
          `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}${livemode ? "" : "  (TEST MODE, no money moved)"}`,
          "",
          ship?.name || payer || "No name given",
          [a.line1, a.line2].filter(Boolean).join(", "),
          [a.city, a.state, a.postal_code].filter(Boolean).join(" "),
          a.country || "",
          "",
          email || "No email",
          String(details.phone || "No phone"),
        ].filter((l) => l !== undefined)

        /* Hand it to Printful when the product names a blank and has real
           artwork to print. Everything else, and every failure, falls through
           to the desk email below, which is exactly what the shop did before
           Printful existed. The money is already taken by this point, so an
           order that cannot be placed has to reach a person, not a log. */
        let fulfilment = "Gavin packs and posts this one."
        const product = bySlug(String(meta.slug || ""))
        const pf = product?.printful
        if (pf?.printFile) {
          const placed = await placeOrder(
            id,
            {
              name: ship?.name || payer || undefined,
              address1: a.line1,
              address2: a.line2,
              city: a.city,
              state: a.state,
              zip: a.postal_code,
              country: a.country,
              email: email || undefined,
              phone: typeof details.phone === "string" ? details.phone : undefined,
            },
            [
              {
                garment: pf.garment,
                color: pf.color,
                size: String(meta.variant || ""),
                quantity: Number(meta.quantity || 1),
                printFile: pf.printFile,
                name: meta.covers || product?.name || "Item",
              },
            ],
          )
          fulfilment = placed.ok
            ? placed.status === "already_placed"
              ? "Printful already had this one. A webhook retry, nothing to do."
              : `Printful order ${placed.orderId} created${placed.draft ? " as a DRAFT: confirm it in Printful before it prints." : " and confirmed."}`
            : `PRINTFUL DID NOT TAKE THIS ORDER (${placed.reason}): ${placed.detail}\nThe customer has paid. Fulfil it by hand.`
        }

        /* Book it as merch. The shop used to return here without writing a
           row, so not one shirt ever appeared in the ledger: the money was in
           Stripe and the books said the shop had sold nothing. */
        const shopDb = crm()
        if (shopDb && id) {
          try {
            const ev = await shopDb.query<{ id: string }>(`select id from public.events where slug = $1 limit 1`, ["pistonpoweredranch"])
            await bookPayment(shopDb, ev.rows[0]?.id ?? null, "merch", id, amount, currency, email, livemode)
          } catch (err) {
            console.error("[stripe/webhook] could not book a shop order, asking Stripe to retry", err)
            return NextResponse.json({ error: "ledger_write_failed" }, { status: 500 })
          }
        }

        await mail(
          {
            from: NOREPLY,
            to: ["gavin@paddockgavin.com"],
            reply_to: email || undefined,
            subject: `${livemode ? "Order" : "Test order"}: ${meta.covers || meta.slug}`,
            text: [...lines, "", fulfilment].join("\n"),
          },
          `shop:${id}`,
        )
        return NextResponse.json({ ok: true })
      }

      console.log("[stripe/webhook] paid", { type: evt.type, id, amount, currency, email, event: slug, kind: meta.kind, ledger, org: meta.org, livemode })

      /* Book it, once. */
      let booked = false
      const db = crm()
      if (db && id) {
        try {
          const ev = slug ? await db.query<{ id: string }>(`select id from public.events where slug = $1 limit 1`, [slug]) : { rows: [] }
          const eventId = ev.rows[0]?.id ?? null
          booked = await bookPayment(db, eventId, ledger, id, amount, currency, email, livemode)
          if (!eventId) console.error("[stripe/webhook] no events row for slug, booked without event_id", { slug, id })
        } catch (err) {
          /* Money has moved and the ledger did not take it. Answering 200 here
             told Stripe the event was handled and it never came back, so the
             payment existed only in Stripe: no row, no receipt, nothing at the
             desk. 500 makes Stripe retry, and the unique index on
             stripe_object makes that retry harmless. */
          console.error("[stripe/webhook] could not book the payment, asking Stripe to retry", err)
          return NextResponse.json({ error: "ledger_write_failed" }, { status: 500 })
        }
      } else if (!db) {
        console.error("[stripe/webhook] CRM_DATABASE_URL is not set; asking Stripe to retry", { id })
        return NextResponse.json({ error: "not_configured" }, { status: 503 })
      }
      else if (!id) {
        /* Nothing to key the ledger on and nothing to dedupe a retry against,
           so a retry could double book. Say so loudly and take the event. */
        console.error("[stripe/webhook] paid event carried no id; nothing booked", { type: evt.type, amount, email })
      }

      /* The receipt, and a line to the desk. Only on the first booking, so a
         redelivered event does not send a second receipt. */
      if (booked && (ledger === "vendor_setup" || ledger === "sponsorship")) {
        const surface = ledger === "vendor_setup" ? "vendor" : "sponsor"
        const desk = surface === "vendor" ? "vendors@pistonpoweredranch.com" : "sponsors@pistonpoweredranch.com"
        const covers = meta.covers || meta.note || (surface === "vendor" ? "Vendor booth" : "Sponsorship")
        const paidOn = new Date().toLocaleDateString("en-US", { timeZone: "America/Chicago", day: "numeric", month: "long", year: "numeric" })
        const amountText = money(amount) + (currency !== "usd" ? ` ${currency.toUpperCase()}` : "")
        const receiptNo = id.replace(/^cs_(test|live)_/, "").slice(-10).toUpperCase()

        if (email) {
          const t = ranchTemplate(surface, "receipt", { name: payer || undefined, org: meta.org || undefined, receiptNo, amount: amountText, method: "Card, via Stripe", paidOn, covers })
          if (t) {
            const blocks: Block[] = livemode ? t.blocks : [{ kind: "quiet", text: "Test mode: no money moved. This receipt is a rehearsal." }, ...t.blocks]
            const doc: RanchEmail = { ...t, blocks }
            await mail({ from: t.from, to: [email], reply_to: desk, subject: t.subject, html: renderRanchEmail(doc), text: renderRanchText(doc) }, `receipt:${id}`)
          }
        }

        const note: RanchEmail = {
          preheader: `${amountText} from ${meta.org || payer || email || "a payer"}`,
          eyebrow: livemode ? "Payment received" : "Test payment",
          heading: `${amountText} paid`,
          blocks: [
            {
              kind: "facts",
              rows: [
                { label: "From", value: meta.org || payer || email || "unknown" },
                ...(email ? [{ label: "Email", value: email }] : []),
                { label: "For", value: covers },
                { label: "Amount", value: amountText },
                { label: "Stripe", value: id },
                ...(meta.note ? [{ label: "Note", value: meta.note }] : []),
              ],
            },
            { kind: "button", label: "Open in HQ", href: `${RANCH}/console/#/ops` },
            { kind: "quiet", text: surface === "vendor" ? "Booked in the ledger. Add them to the vendor row from HQ when the pitch is placed." : "Booked in the ledger. Artwork and placement run from HQ." },
          ],
        }
        await mail({ from: NOREPLY, to: [desk], subject: `${livemode ? "Paid" : "Test payment"}: ${meta.org || payer || email || id}, ${amountText}`, html: renderRanchEmail(note), text: renderRanchText(note) }, `desk:${id}`)
      }
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
