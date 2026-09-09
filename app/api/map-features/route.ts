import { NextResponse, type NextRequest } from "next/server"
import { Pool } from "pg"
import { verifyFull } from "@/lib/db/ssl"
import { tooMany } from "@/lib/ranch/limit"

/**
 * Read and reposition public.map_features, for the review tool at
 * /sitemap-review.
 *
 * Same connection as lib/events/load.ts's loadMapFeatures: CRM_DATABASE_URL,
 * not the ranch's own RANCH_DATABASE_URL, because this table lives on the
 * hub's side. That loader only ever reads kind, name, category and blurb;
 * this route is the first thing that reads and writes geometry, which is
 * why every row's geometry was still the placeholder location nobody had
 * ever corrected against the real ground.
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

const COOKIE = "pg_map"
const GATE = "179179"

function authed(req: NextRequest): boolean {
  return req.cookies.get(COOKIE)?.value === "ok"
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "locked" }, { status: 401 })
  const slug = req.nextUrl.searchParams.get("event") || ""
  const p = db()
  if (!p) return NextResponse.json({ error: "no_database" }, { status: 503 })
  try {
    const { rows } = await p.query(
      `select mf.id, mf.kind, mf.slug, mf.name, mf.category, mf.status, mf.blurb, mf.geometry, mf.detail
         from public.map_features mf
         join public.events e on e.id = mf.event_id
        where e.slug = $1
        order by case mf.kind when 'zone' then 0 when 'poi' then 1 else 2 end, mf.sort`,
      [slug],
    )
    return NextResponse.json({ features: rows })
  } catch (err) {
    console.error("[map-features] read failed", err)
    return NextResponse.json({ error: "read_failed" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const limited = tooMany(req, "map-features-auth", 20)
  if (limited) return limited
  const b = await req.json().catch(() => ({}))
  if (b.password !== GATE) return NextResponse.json({ error: "locked" }, { status: 401 })
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, "ok", { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" })
  return res
}

export async function PATCH(req: NextRequest) {
  const limited = tooMany(req, "map-features-write", 120)
  if (limited) return limited
  if (!authed(req)) return NextResponse.json({ error: "locked" }, { status: 401 })

  const b = await req.json().catch(() => null)
  if (!b || typeof b.id !== "string" || !b.geometry) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
  const p = db()
  if (!p) return NextResponse.json({ error: "no_database" }, { status: 503 })
  try {
    const dbInfo = await p.query(`select current_database() as db, inet_server_addr()::text as host, current_user as who`)
    const result = await p.query(
      `update public.map_features set geometry = $2::jsonb, updated_at = now() where id = $1`,
      [b.id, JSON.stringify(b.geometry)],
    )
    console.log("[map-features] patch", { id: b.id, rowCount: result.rowCount, ...dbInfo.rows[0] })
    return NextResponse.json({ ok: true, rowCount: result.rowCount, debug: dbInfo.rows[0] })
  } catch (err) {
    console.error("[map-features] write failed", err)
    return NextResponse.json({ error: "write_failed" }, { status: 500 })
  }
}
