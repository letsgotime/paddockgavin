import { NextResponse } from "next/server"
import { crm } from "@/lib/crm/pool"
import { staffFromRequest } from "@/lib/crm/staff"
import { renderRanchEmail, renderRanchText, type Block } from "@/lib/email/ranch"
import { ranchTemplate, type Stage, type Surface, type Vars } from "@/lib/email/ranch-templates"

/**
 * The decision, delivered.
 *
 * HQ moves a submission to approved, waitlisted or declined, then calls this
 * with the row's id and the stage. The email for that stage, from
 * lib/email/ranch-templates, goes to the applicant with their status link, and
 * the row remembers that it was sent. Until this existed the templates were
 * only ever previewed, and the Approve button copied a paragraph to the
 * clipboard for somebody to paste into iMessage by hand.
 *
 * Staff only. The token from the console is checked by the database's own
 * is_staff(), see lib/crm/staff.ts. The stage has to match what the row says,
 * so a stale button cannot send an acceptance to somebody who was declined a
 * minute ago. "received" is the one exception: it resends the confirmation,
 * which is how a lost status link gets found.
 */

export const runtime = "nodejs"

const RANCH = "https://pistonpoweredranch.com"
const DESK: Record<Surface, string> = {
  entry: "entries@pistonpoweredranch.com",
  vendor: "vendors@pistonpoweredranch.com",
  sponsor: "sponsors@pistonpoweredranch.com",
  spectator: "hello@pistonpoweredranch.com",
}
const SURFACE: Record<string, Surface> = { vehicle: "entry", vendor: "vendor", sponsor: "sponsor" }
const STAGES: Stage[] = ["approved", "waitlisted", "declined", "received"]

interface Body {
  id?: number | string
  stage?: string
  /** Bay, gate, make, loadIn, assetsDue: the per applicant facts the desk knows. */
  vars?: Partial<Pick<Vars, "bay" | "gate" | "make" | "loadIn" | "assetsDue">>
}

interface Row {
  id: string
  type: string
  applicant_name: string
  email: string
  status: string
  status_token: string | null
  details: Record<string, string> | null
}

const clean = (s: unknown, max = 120) => (typeof s === "string" ? s.trim().slice(0, max) : "")

export async function POST(req: Request) {
  const who = await staffFromRequest(req)
  if (!who) return NextResponse.json({ error: "staff_only" }, { status: 401 })

  let b: Body
  try {
    b = await req.json()
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 })
  }
  const id = Number(b.id)
  const stage = String(b.stage || "") as Stage
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "bad_id" }, { status: 400 })
  if (!STAGES.includes(stage)) return NextResponse.json({ error: "bad_stage" }, { status: 400 })

  const db = crm()
  if (!db) return NextResponse.json({ error: "no_database", detail: "CRM_DATABASE_URL is not set." }, { status: 503 })
  const key = process.env.RESEND_API_KEY
  if (!key) return NextResponse.json({ error: "no_mail", detail: "RESEND_API_KEY is not set." }, { status: 503 })

  const { rows } = await db.query<Row>(
    `select id::text, type, applicant_name, email, status, status_token, details
       from public.submissions where id = $1 limit 1`,
    [id],
  )
  const row = rows[0]
  if (!row) return NextResponse.json({ error: "not_found" }, { status: 404 })
  const surface = SURFACE[row.type]
  if (!surface) return NextResponse.json({ error: "bad_type" }, { status: 400 })
  if (stage !== "received" && row.status !== stage) {
    return NextResponse.json(
      { error: "stage_mismatch", detail: `The row says ${row.status}. Reload and decide it again.` },
      { status: 409 },
    )
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email || "")) {
    return NextResponse.json({ error: "no_address", detail: "This submission has no email address to write to." }, { status: 422 })
  }

  const d = row.details || {}
  const vars: Vars = {
    name: row.applicant_name,
    org: clean(d.vehicle) || clean(d.business) || clean(d.company) || clean(d.org) || undefined,
    bay: clean(b.vars?.bay, 40) || undefined,
    gate: clean(b.vars?.gate, 40) || undefined,
    make: clean(b.vars?.make, 60) || undefined,
    loadIn: clean(b.vars?.loadIn, 80) || undefined,
    assetsDue: clean(b.vars?.assetsDue, 60) || undefined,
  }

  const t = ranchTemplate(surface, stage, vars)
  if (!t) return NextResponse.json({ error: "no_template" }, { status: 400 })

  /* The status link rides on every stage, so the person can always see where
     they stand without an account. */
  const blocks: Block[] = row.status_token
    ? [...t.blocks, { kind: "button", label: "Your status page", href: `${RANCH}/status/?t=${row.status_token}` }]
    : t.blocks
  const doc = { ...t, blocks }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: t.from,
      to: [row.email],
      reply_to: DESK[surface],
      subject: t.subject,
      html: renderRanchEmail(doc),
      text: renderRanchText(doc),
    }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    console.error("[notify] resend refused", res.status, detail.slice(0, 300))
    return NextResponse.json({ error: "mail_failed", detail: `Resend answered ${res.status}.` }, { status: 502 })
  }

  /* The row remembers. details is the one column this role may write, and a
     decision log inside it is better than a column nobody can add today. */
  const note = { stage, at: new Date().toISOString(), by: who.email, subject: t.subject }
  await db.query(
    `update public.submissions
        set details = coalesce(details, '{}'::jsonb)
                      || jsonb_build_object('notified', coalesce(details->'notified', '[]'::jsonb) || $2::jsonb),
            updated_at = now()
      where id = $1`,
    [id, JSON.stringify([note])],
  )

  return NextResponse.json({ ok: true, to: row.email, subject: t.subject })
}
