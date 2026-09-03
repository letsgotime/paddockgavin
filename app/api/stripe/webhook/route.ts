import { NextResponse } from "next/server"
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

type Ledger = "vendor_setup" | "sponsorship" | "revenue_share" | "vip" | "other"

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

/** The ledger line, from what the session was told when it was made. */
function ledgerOf(meta: Record<string, string>): Ledger {
  const l = meta.ledger
  if (l === "vendor_setup" || l === "sponsorship" || l === "revenue_share" || l === "vip" || l === "other") return l
  const k = meta.kind || ""
  if (k === "vendorBooth") return "vendor_setup"
  if (/supporting|Title|sponsor/i.test(k)) return "sponsorship"
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

async function mail(payload: Record<string, unknown>): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    return r.ok
  } catch {
    return false
  }
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
  let meta = (obj.metadata as Record<string, string>) || {}

  switch (evt.type) {
    case "checkout.session.completed":
    case "invoice.paid": {
      if (!meta.kind && typeof obj.payment_link === "string") meta = { ...(await linkMetadata(obj.payment_link)), ...meta }

      const id = String(obj.id || "")
      const amount = Number(obj.amount_total ?? obj.amount_paid ?? 0)
      const currency = String(obj.currency || "usd").toLowerCase()
      const details = (obj.customer_details as { email?: string; name?: string } | undefined) || {}
      const email = (typeof obj.customer_email === "string" && obj.customer_email) || details.email || null
      const payer = details.name || null
      const livemode = obj.livemode === true
      const ledger = ledgerOf(meta)
      const slug = meta.event_slug || meta.event || ""

      console.log("[stripe/webhook] paid", { type: evt.type, id, amount, currency, email, event: slug, kind: meta.kind, ledger, org: meta.org, livemode })

      /* Book it, once. */
      let booked = false
      const db = crm()
      if (db && id) {
        try {
          const ev = slug ? await db.query<{ id: string }>(`select id from public.events where slug = $1 limit 1`, [slug]) : { rows: [] }
          const eventId = ev.rows[0]?.id ?? null
          const ins = await db.query(
            `insert into public.payments (event_id, kind, stripe_object, amount_cents, currency, status, payer_email, livemode)
             values ($1, $2, $3, $4, $5, 'paid', $6, $7)
             on conflict (stripe_object) do nothing
             returning id`,
            [eventId, ledger, id, amount, currency, email, livemode],
          )
          booked = (ins.rowCount ?? 0) > 0
          if (!eventId) console.error("[stripe/webhook] no events row for slug, booked without event_id", { slug, id })
        } catch (err) {
          console.error("[stripe/webhook] could not book the payment", err)
        }
      } else if (!db) {
        console.error("[stripe/webhook] CRM_DATABASE_URL is not set; payment logged only", { id })
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
            await mail({ from: t.from, to: [email], reply_to: desk, subject: t.subject, html: renderRanchEmail(doc), text: renderRanchText(doc) })
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
        await mail({ from: NOREPLY, to: [desk], subject: `${livemode ? "Paid" : "Test payment"}: ${meta.org || payer || email || id}, ${amountText}`, html: renderRanchEmail(note), text: renderRanchText(note) })
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
