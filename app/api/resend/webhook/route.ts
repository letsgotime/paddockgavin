import { NextResponse } from "next/server"
import crypto from "node:crypto"
import { ranchDb } from "@/lib/ranch/ranch-db"

/**
 * What actually happened to the mail we send.
 *
 * Until this existed, nothing about delivery reached our own tables. We could
 * see that Resend accepted a message and nothing after that: not delivered,
 * not bounced, not marked as spam. When an entrant said they never got their
 * status link there was no way to answer them except to shrug and resend.
 *
 * Resend signs with Svix. The signature covers "<id>.<timestamp>.<body>" and
 * the secret arrives base64 after a "whsec_" prefix. Verified before anything
 * is written, and the timestamp is checked so an old capture cannot be
 * replayed. Unverified events are refused, never stored.
 *
 * Set RESEND_WEBHOOK_SECRET and point a Resend webhook at /api/resend/webhook.
 */
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const TOLERANCE_S = 5 * 60

function verify(raw: string, h: Headers, secret: string): boolean {
  const id = h.get("svix-id")
  const ts = h.get("svix-timestamp")
  const sigs = h.get("svix-signature")
  if (!id || !ts || !sigs) return false

  const age = Math.abs(Date.now() / 1000 - Number(ts))
  if (!Number.isFinite(age) || age > TOLERANCE_S) return false

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64")
  const expected = crypto.createHmac("sha256", key).update(`${id}.${ts}.${raw}`).digest("base64")
  const expBuf = Buffer.from(expected)

  /* The header carries a space separated list of "v1,<sig>" so a secret can be
     rotated without dropping events mid flight. Any one match is enough. */
  return sigs.split(" ").some((part) => {
    const got = part.split(",")[1]
    if (!got) return false
    const gotBuf = Buffer.from(got)
    return gotBuf.length === expBuf.length && crypto.timingSafeEqual(gotBuf, expBuf)
  })
}

export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  const raw = await req.text()

  if (!secret) {
    console.error("[resend/webhook] RESEND_WEBHOOK_SECRET is not set; refusing")
    return NextResponse.json({ error: "not_configured" }, { status: 503 })
  }
  if (!verify(raw, req.headers, secret)) {
    console.error("[resend/webhook] bad signature")
    return NextResponse.json({ error: "bad_signature" }, { status: 400 })
  }

  let evt: { type?: string; created_at?: string; data?: Record<string, unknown> }
  try {
    evt = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 })
  }

  const d = evt.data ?? {}
  const emailId = typeof d.email_id === "string" ? d.email_id : null
  const to = Array.isArray(d.to) ? d.to.filter((x) => typeof x === "string").join(", ") : typeof d.to === "string" ? d.to : null
  const subject = typeof d.subject === "string" ? d.subject : null
  const type = evt.type || "unknown"

  const db = ranchDb()
  if (!db) {
    /* Retry rather than lose it, the same bargain the Stripe webhook makes. */
    console.error("[resend/webhook] no database; asking for a retry", { type, emailId })
    return NextResponse.json({ error: "not_configured" }, { status: 503 })
  }

  try {
    await db.query(
      `insert into public.email_events (event_id, email_id, type, recipient, subject, occurred_at, payload)
       values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (event_id) do nothing`,
      [
        req.headers.get("svix-id"),
        emailId,
        type,
        to,
        subject,
        evt.created_at ? new Date(evt.created_at) : new Date(),
        JSON.stringify(evt),
      ],
    )
  } catch (err) {
    console.error("[resend/webhook] could not record the event, asking for a retry", err)
    return NextResponse.json({ error: "write_failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
