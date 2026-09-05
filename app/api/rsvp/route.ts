import { NextResponse } from "next/server"
import { ranchDb, consentFrom } from "@/lib/ranch/ranch-db"
import { EVENT_ID } from "@/lib/ranch/neon"
import { renderRanchEmail, renderRanchText } from "@/lib/email/ranch"
import { ranchTemplate } from "@/lib/email/ranch-templates"

/**
 * The RSVP, recorded on the server.
 *
 * The spectate page used to insert the row itself through the Data API on an
 * anonymous token from Neon's hosted auth. That endpoint answers 404 now, so
 * every RSVP since the auth move was refused with "could not save" while the
 * landing page kept sending people to the form. This takes the same fields,
 * writes them with the connection the old functions used, keeps the three
 * consents with the row, and sends the "you are counted" email that the
 * digest has always promised.
 *
 * One row per address: a second RSVP from the same person updates their party
 * and their consents rather than counting them twice.
 */
export const runtime = "nodejs"

const RANCH = "https://pistonpoweredranch.com"
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Body {
  name?: string
  email?: string
  party?: number
  source?: string | null
  consent?: unknown
  /** The honeypot. Anything in it and a script filled the form. */
  fax?: string
}

export async function POST(req: Request) {
  let b: Body
  try {
    b = await req.json()
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 })
  }
  if ((b.fax ?? "").trim()) return NextResponse.json({ ok: true })

  const name = String(b.name ?? "").trim().slice(0, 120)
  const email = String(b.email ?? "").trim().toLowerCase().slice(0, 200)
  const party = Math.min(20, Math.max(1, Number.isFinite(Number(b.party)) ? Math.round(Number(b.party)) : 1))
  const source = typeof b.source === "string" ? b.source.trim().slice(0, 80) || null : null
  if (!name) return NextResponse.json({ error: "no_name", detail: "Add your name so we know who to expect." }, { status: 400 })
  if (!EMAIL.test(email)) return NextResponse.json({ error: "bad_email", detail: "That email does not look complete." }, { status: 400 })
  const consent = consentFrom(b.consent)

  const db = ranchDb()
  if (!db) {
    console.error("[rsvp] RANCH_DATABASE_URL is not set")
    return NextResponse.json({ error: "no_database", detail: "Could not reach the RSVP list. Try again in a minute." }, { status: 503 })
  }

  let created = true
  let unsub = ""
  try {
    const have = await db.query<{ id: string; unsub_token: string }>(
      `select id::text, unsub_token::text from public.spectators where event_id = $1 and lower(email) = $2 limit 1`,
      [EVENT_ID, email],
    )
    if (have.rows[0]) {
      created = false
      unsub = have.rows[0].unsub_token
      await db.query(
        `update public.spectators set name = $2, party_size = $3, consent = $4::jsonb, unsubscribed_at = null where id = $1`,
        [have.rows[0].id, name, party, JSON.stringify(consent)],
      )
    } else {
      const ins = await db.query<{ unsub_token: string }>(
        `insert into public.spectators (event_id, name, email, party_size, source, consent) values ($1, $2, $3, $4, $5, $6::jsonb) returning unsub_token::text`,
        [EVENT_ID, name, email, party, source, JSON.stringify(consent)],
      )
      unsub = ins.rows[0]?.unsub_token || ""
    }
  } catch (err) {
    console.error("[rsvp] could not record", err)
    return NextResponse.json({ error: "not_recorded", detail: "Could not save your RSVP. Try again in a minute." }, { status: 500 })
  }

  /* Counted. The one email everyone gets, with the count they gave. */
  const key = process.env.RESEND_API_KEY
  if (key && created) {
    const t = ranchTemplate("spectator", "received", { name, party: String(party) })
    if (t) {
      const doc = { ...t, unsubscribe: unsub ? `${RANCH}/unsubscribe?u=${unsub}` : t.unsubscribe }
      /* Awaited. A send started and not waited for is a send the function
         may be frozen under before it completes, and the first RSVP through
         here was counted in the database and never emailed. */
      try {
        const sent = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: t.from, to: [email], reply_to: "hello@pistonpoweredranch.com", subject: t.subject, html: renderRanchEmail(doc), text: renderRanchText(doc) }),
        })
        if (!sent.ok) console.error("[rsvp] resend refused", sent.status)
      } catch (err) {
        console.error("[rsvp] mail failed", err)
      }
    }
  }

  return NextResponse.json({ ok: true, created })
}
