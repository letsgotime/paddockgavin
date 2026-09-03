import { NextResponse } from "next/server"
import crypto from "node:crypto"
import { STRIPE_API, money } from "@/lib/stripe/catalog"
import { staffFromRequest } from "@/lib/crm/staff"
import { crm } from "@/lib/crm/pool"
import { renderRanchEmail, renderRanchText } from "@/lib/email/ranch"
import { ranchTemplate } from "@/lib/email/ranch-templates"

/**
 * An invoice, from the desk.
 *
 * Sponsorship and the larger booth footprints are agreed in conversation, so
 * the figure arrives here from a person rather than from a catalogue. This
 * makes a Stripe payment link for that figure, which does not expire the way
 * a checkout session does, and sends the invoice email with the link in it.
 * When it is paid the webhook books it like any other payment and sends the
 * receipt.
 *
 * Staff only, through the same check as /api/notify. The amount is bounded,
 * the currency is dollars, and every link carries the event and the ledger
 * line so the money lands where it should.
 */

export const runtime = "nodejs"

const RANCH = "https://pistonpoweredranch.com"
const MIN = 100 // one dollar
const MAX = 5_000_000 // fifty thousand

interface Body {
  email?: string
  name?: string
  org?: string
  amountCents?: number
  covers?: string
  dueBy?: string
  kind?: "sponsorship" | "vendor_setup" | "other"
  eventSlug?: string
  submissionId?: number
}

const clean = (s: unknown, max: number) => (typeof s === "string" ? s.trim().slice(0, max) : "")

async function stripe(key: string, path: string, body: Record<string, string>, idem?: string) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...(idem ? { "Idempotency-Key": idem } : {}),
    },
    body: new URLSearchParams(body).toString(),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message || `Stripe ${res.status}`)
  return json as Record<string, unknown>
}

export async function POST(req: Request) {
  const who = await staffFromRequest(req)
  if (!who) return NextResponse.json({ error: "staff_only" }, { status: 401 })

  let b: Body
  try {
    b = await req.json()
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 })
  }

  const email = clean(b.email, 200).toLowerCase()
  const name = clean(b.name, 120)
  const org = clean(b.org, 120)
  const covers = clean(b.covers, 200)
  const dueBy = clean(b.dueBy, 60)
  const kind = b.kind === "vendor_setup" || b.kind === "other" ? b.kind : "sponsorship"
  const cents = Number(b.amountCents)
  const slug = clean(b.eventSlug, 64).toLowerCase() || "pistonpoweredranch"

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "bad_email" }, { status: 400 })
  if (!covers) return NextResponse.json({ error: "no_covers", detail: "Say what the invoice is for." }, { status: 400 })
  if (!Number.isInteger(cents) || cents < MIN || cents > MAX) {
    return NextResponse.json({ error: "bad_amount", detail: `Whole cents between ${MIN} and ${MAX}.` }, { status: 400 })
  }

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return NextResponse.json({ error: "not_configured", detail: "STRIPE_SECRET_KEY is not set." }, { status: 503 })
  const mailKey = process.env.RESEND_API_KEY
  if (!mailKey) return NextResponse.json({ error: "no_mail", detail: "RESEND_API_KEY is not set." }, { status: 503 })

  /* The event must exist, because the webhook books against it by slug. */
  const db = crm()
  if (db) {
    const ev = await db.query(`select 1 from public.events where slug = $1 limit 1`, [slug])
    if (!ev.rowCount) return NextResponse.json({ error: "unknown_event" }, { status: 400 })
  }

  const surface = kind === "vendor_setup" ? "vendor" : "sponsor"
  const receiptNo = `PPR-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`
  const paidPage = `${RANCH}/${surface}/paid`

  try {
    const price = await stripe(key, "/prices", {
      currency: "usd",
      unit_amount: String(cents),
      "product_data[name]": covers,
      "metadata[event_slug]": slug,
      "metadata[kind]": kind,
      "metadata[invoice]": receiptNo,
    })
    const link = await stripe(
      key,
      "/payment_links",
      {
        "line_items[0][price]": String(price.id),
        "line_items[0][quantity]": "1",
        "metadata[event]": slug,
        "metadata[event_slug]": slug,
        "metadata[kind]": kind,
        "metadata[ledger]": kind,
        "metadata[covers]": covers,
        "metadata[org]": org,
        "metadata[invoice]": receiptNo,
        ...(b.submissionId ? { "metadata[submission_id]": String(b.submissionId) } : {}),
        "payment_intent_data[metadata][event]": slug,
        "payment_intent_data[metadata][kind]": kind,
        "payment_intent_data[metadata][invoice]": receiptNo,
        "after_completion[type]": "redirect",
        "after_completion[redirect][url]": paidPage,
      },
      `ppr-invoice-${receiptNo}`,
    )
    const url = String(link.url)

    const t = ranchTemplate(surface, "invoice", { name, org, receiptNo, covers, amount: money(cents), dueBy: dueBy || undefined, payUrl: url })
    if (!t) return NextResponse.json({ error: "no_template" }, { status: 500 })
    const desk = surface === "vendor" ? "vendors@pistonpoweredranch.com" : "sponsors@pistonpoweredranch.com"
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${mailKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: t.from, to: [email], reply_to: desk, subject: t.subject, html: renderRanchEmail(t), text: renderRanchText(t) }),
    })
    if (!sent.ok) {
      console.error("[invoice] resend refused", sent.status)
      return NextResponse.json({ ok: false, url, receiptNo, error: "mail_failed", detail: "The link was made but the email did not send. Copy the link and send it by hand." }, { status: 502 })
    }

    /* The row remembers, when there is one to remember on. */
    if (db && b.submissionId) {
      await db
        .query(
          `update public.submissions
              set details = coalesce(details, '{}'::jsonb)
                            || jsonb_build_object('invoices', coalesce(details->'invoices', '[]'::jsonb) || $2::jsonb),
                  updated_at = now()
            where id = $1`,
          [Number(b.submissionId), JSON.stringify([{ receiptNo, cents, covers, url, at: new Date().toISOString(), by: who.email }])],
        )
        .catch((err: unknown) => console.error("[invoice] could not note the row", err))
    }

    return NextResponse.json({ ok: true, url, receiptNo, amount: money(cents), to: email })
  } catch (err) {
    console.error("[invoice]", err)
    return NextResponse.json({ error: "stripe_error", detail: err instanceof Error ? err.message : "Stripe refused." }, { status: 422 })
  }
}
