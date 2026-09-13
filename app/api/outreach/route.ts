import { NextResponse } from "next/server"
import { crm } from "@/lib/crm/pool"
import { staffFromRequest } from "@/lib/crm/staff"
import { renderRanchEmail, renderRanchText, type Block, type RanchEmail } from "@/lib/email/ranch"

/**
 * The approach, sent and remembered.
 *
 * Targets already held the pipeline: eight domains, fifty four categories, the
 * warmth of each conversation and who owns it. What it could not do was start
 * one. Somebody read a name off the board, wrote an email by hand, sent it from
 * their own address, and the board never learned that it had happened.
 *
 * This sends the approach from the house template and writes it to
 * public.interactions against the candidate, so the next person to open the
 * board can see that Coca-Cola was written to on the seventh and has not
 * replied. A reply is logged the same way, by hand, from the same surface.
 *
 * No prices. Sponsorship is sold on who is in front of you, and a rate card in
 * a first approach turns a conversation into a quote.
 *
 * Staff only, checked by the database's own is_staff() through
 * lib/crm/staff.ts, the same gate the decision letters use.
 */
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const FROM = "The Piston Powered Ranch <sponsors@pistonpoweredranch.com>"
const DESK = "sponsors@pistonpoweredranch.com"
const RANCH = "https://pistonpoweredranch.com"

/** What a first approach is allowed to be. */
const KINDS = ["approach", "reply", "note"] as const
type Kind = (typeof KINDS)[number]

type Row = {
  id: string
  name: string
  detail: string | null
  contact_name: string | null
  contact_email: string | null
  warmth: string | null
  category_name: string | null
  category_need: string | null
  domain: string | null
  event_id: string | null
}

const clean = (v: unknown, max = 4000) => (typeof v === "string" ? v.trim().slice(0, max) : "")

/** The first letter to a brand we want on the day. */
function approach(r: Row, who: string): RanchEmail {
  const to = r.contact_name || r.name
  const what = r.category_name ? r.category_name.toLowerCase() : "a position on the day"

  const blocks: Block[] = [
    { kind: "lead", text: `Dear ${to}, I am writing about The Piston Powered Ranch on Saturday 10 October.` },
    {
      kind: "p",
      text:
        "It is a car show on a working cattle ranch an hour south of Nashville: three hundred collector cars parked by marque on fourteen acres of pasture, free for anyone to walk in. 25% of net profit fills a semi truck with food. Right now it goes to kids.",
    },
    {
      kind: "p",
      text: r.category_need
        ? `We are looking for ${what} for the day. ${r.category_need}`
        : `We are looking for ${what} for the day, and you were the first name on the list.`,
    },
    { kind: "button", label: "See the day", href: `${RANCH}/sponsor` },
    {
      kind: "p",
      text:
        "There is no rate card attached, on purpose. What a position is worth depends on what you want out of it, so the useful next step is a conversation rather than a proposal.",
    },
    { kind: "quiet", text: "Reply to this email and it reaches a person, not a queue." },
  ]

  return {
    preheader: "A car show on a working cattle ranch, an hour south of Nashville.",
    eyebrow: "An invitation",
    heading: "Saturday 10 October",
    blocks,
    signoff: who,
    reason: "You are receiving this because we would like you on the day.",
  }
}

export async function POST(req: Request) {
  const staff = await staffFromRequest(req)
  if (!staff) return NextResponse.json({ error: "staff_only" }, { status: 401 })
  const who = staff.email

  let b: { id?: string; kind?: string; body?: string }
  try {
    b = await req.json()
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 })
  }

  const id = clean(b.id, 64)
  const kind = (clean(b.kind, 20) || "approach") as Kind
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "bad_id" }, { status: 400 })
  if (!KINDS.includes(kind)) return NextResponse.json({ error: "bad_kind" }, { status: 400 })

  const db = crm()
  if (!db) return NextResponse.json({ error: "no_database" }, { status: 503 })

  const { rows } = await db.query<Row>(
    `select c.id, c.name, c.detail, c.contact_name, c.contact_email, c.warmth,
            k.name as category_name, k.need as category_need, k.domain, k.event_id
       from public.account_candidates c
       left join public.categories k on k.id = c.category_id
      where c.id = $1
      limit 1`,
    [id],
  )
  const row = rows[0]
  if (!row) return NextResponse.json({ error: "not_found" }, { status: 404 })

  /* A note or a logged reply needs no mail, only a record. */
  if (kind !== "approach") {
    const text = clean(b.body)
    if (!text) return NextResponse.json({ error: "empty" }, { status: 400 })
    await db.query(
      `insert into public.interactions (account_id, contact_email, event_id, kind, body, by_user)
       values (null, $1, $2, $3, $4, $5)`,
      [row.contact_email, row.event_id, kind, text, who],
    )
    return NextResponse.json({ ok: true, logged: kind })
  }

  if (!row.contact_email) return NextResponse.json({ error: "no_email", detail: "This target has no contact address yet." }, { status: 400 })
  const key = process.env.RESEND_API_KEY
  if (!key) return NextResponse.json({ error: "no_mail" }, { status: 503 })

  const doc = approach(row, who)
  const subject = "The Piston Powered Ranch, 10 October"

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [row.contact_email],
      reply_to: DESK,
      subject,
      html: renderRanchEmail(doc),
      text: renderRanchText(doc),
    }),
  })

  if (!r.ok) {
    const detail = (await r.text()).slice(0, 300)
    console.error("[outreach] approach not sent", { id, to: row.contact_email, detail })
    /* Recorded even in failure, because a send that never happened is the one
       thing a pipeline must not quietly forget. */
    await db.query(
      `insert into public.interactions (account_id, contact_email, event_id, kind, body, by_user)
       values (null, $1, $2, 'send_failed', $3, $4)`,
      [row.contact_email, row.event_id, `Approach to ${row.name} failed: ${detail}`, who],
    )
    return NextResponse.json({ error: "send_failed", detail }, { status: 502 })
  }

  await db.query(
    `insert into public.interactions (account_id, contact_email, event_id, kind, body, by_user)
     values (null, $1, $2, 'approach', $3, $4)`,
    [row.contact_email, row.event_id, `Approach sent to ${row.name}${row.category_name ? ` for ${row.category_name}` : ""}.`, who],
  )

  return NextResponse.json({ ok: true, sent: row.contact_email })
}

/** What has been said to this target, newest first. */
export async function GET(req: Request) {
  const staff = await staffFromRequest(req)
  if (!staff) return NextResponse.json({ error: "staff_only" }, { status: 401 })

  const email = clean(new URL(req.url).searchParams.get("email"), 200)
  if (!email) return NextResponse.json({ error: "bad_email" }, { status: 400 })

  const db = crm()
  if (!db) return NextResponse.json({ error: "no_database" }, { status: 503 })

  const { rows } = await db.query(
    `select kind, body, by_user, created_at
       from public.interactions
      where contact_email = $1
      order by created_at desc
      limit 20`,
    [email],
  )
  return NextResponse.json({ log: rows }, { headers: { "Cache-Control": "no-store, private" } })
}
