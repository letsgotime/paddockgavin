import { NextResponse, type NextRequest } from "next/server"
import { Pool } from "pg"
import { verifyFull } from "@/lib/db/ssl"
import { tooMany } from "@/lib/ranch/limit"

/**
 * Read and save public.meeting_updates, for the live document at
 * /meetingupdates.
 *
 * One row per document (id 'pistonpoweredranch' today), one jsonb column
 * holding the whole { c: {...}, t: {...} } shape the page already renders
 * from client side. Same connection as map-features: CRM_DATABASE_URL,
 * not RANCH_DATABASE_URL, because this table lives on the hub's side too.
 */

let pool: Pool | null = null
function db(): Pool | null {
  const url = process.env.CRM_DATABASE_URL
  if (!url) return null
  if (!pool) pool = new Pool({ connectionString: verifyFull(url), max: 3 })
  return pool
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const DOC_ID = "pistonpoweredranch"
const COOKIE = "pg_meeting"
const GATE = "179179"

function authed(req: NextRequest): boolean {
  return req.cookies.get(COOKIE)?.value === "ok"
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "locked" }, { status: 401 })
  const p = db()
  if (!p) return NextResponse.json({ error: "no_database" }, { status: 503 })
  try {
    const { rows } = await p.query(`select data from public.meeting_updates where id = $1`, [DOC_ID])
    return NextResponse.json({ data: rows[0]?.data ?? { c: {}, t: {} } })
  } catch (err) {
    console.error("[meeting-updates] read failed", err)
    return NextResponse.json({ error: "read_failed" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const limited = tooMany(req, "meeting-updates-auth", 20)
  if (limited) return limited
  const b = await req.json().catch(() => ({}))
  if (b.password !== GATE) return NextResponse.json({ error: "locked" }, { status: 401 })
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, "ok", { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" })
  return res
}

export async function PATCH(req: NextRequest) {
  const limited = tooMany(req, "meeting-updates-write", 120)
  if (limited) return limited
  if (!authed(req)) return NextResponse.json({ error: "locked" }, { status: 401 })

  const b = await req.json().catch(() => null)

  // Who's actually opening this: fired once when a browser picks or
  // re-confirms a name, not on every autosave. There's no real per-person
  // login behind the shared password, so a name plus a timestamp is the
  // whole signal available, and it's the same name already shown in the
  // "Signing as" pill.
  if (b && b.logAccess === true && typeof b.name === "string" && b.name.trim()) {
    const p = db()
    if (!p) return NextResponse.json({ error: "no_database" }, { status: 503 })
    try {
      await p.query(`insert into public.meeting_updates_access_log (name) values ($1)`, [b.name.trim().slice(0, 60)])
      return NextResponse.json({ ok: true })
    } catch (err) {
      console.error("[meeting-updates] access log write failed", err)
      return NextResponse.json({ error: "write_failed" }, { status: 500 })
    }
  }

  if (!b || typeof b.data !== "object" || b.data === null) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
  const p = db()
  if (!p) return NextResponse.json({ error: "no_database" }, { status: 503 })
  try {
    const result = await p.query(
      `update public.meeting_updates set data = $2::jsonb, updated_at = now() where id = $1`,
      [DOC_ID, JSON.stringify(b.data)],
    )
    if (result.rowCount === 0) {
      console.error("[meeting-updates] patch matched no row", { id: DOC_ID })
      return NextResponse.json({ error: "not_found" }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[meeting-updates] write failed", err)
    return NextResponse.json({ error: "write_failed" }, { status: 500 })
  }
}
