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

// force-dynamic keeps Next.js from statically prerendering this at build
// time, but Vercel's edge still cached real responses anyway (confirmed in
// runtime logs: cache=HIT and cache=STALE on this exact route) since
// nothing here told it not to — a client's own {cache:'no-store'} on
// fetch() only governs the browser's cache, never the CDN sitting in
// between. This is what made a freshly-saved footer note keep reading
// back empty. Every response needs its own explicit no-store.
function noStore(body: unknown, init?: ResponseInit) {
  const res = NextResponse.json(body, init)
  res.headers.set("Cache-Control", "no-store, must-revalidate")
  return res
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return noStore({ error: "locked" }, { status: 401 })
  const slug = req.nextUrl.searchParams.get("event") || ""
  const p = db()
  if (!p) return noStore({ error: "no_database" }, { status: 503 })
  try {
    const [{ rows }, meta] = await Promise.all([
      p.query(
        `select mf.id, mf.kind, mf.slug, mf.name, mf.category, mf.status, mf.blurb, mf.geometry, mf.detail
           from public.map_features mf
           join public.events e on e.id = mf.event_id
          where e.slug = $1
          order by case mf.kind when 'zone' then 0 when 'poi' then 1 else 2 end, mf.sort`,
        [slug],
      ),
      // event_meta has no event_id column yet (see loadRunOfShow's own
      // comment on the same gap) — one singleton row for the one event this
      // site is about, same assumption every other reader of this table
      // already makes.
      p.query(`select site_plan_footer_note from public.event_meta where id = 1`),
    ])
    return noStore({ features: rows, footerNote: meta.rows[0]?.site_plan_footer_note ?? "" })
  } catch (err) {
    console.error("[map-features] read failed", err)
    return noStore({ error: "read_failed" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const limited = tooMany(req, "map-features-auth", 20)
  if (limited) return limited
  const b = await req.json().catch(() => ({}))
  if (b.password !== GATE) return noStore({ error: "locked" }, { status: 401 })
  // A cached "ok" carrying one visitor's auth cookie served back to the
  // next one would be a real login bypass, not just stale data — the same
  // fix as GET's, more load-bearing here.
  const res = noStore({ ok: true })
  res.cookies.set(COOKIE, "ok", { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" })
  return res
}

export async function PATCH(req: NextRequest) {
  const limited = tooMany(req, "map-features-write", 120)
  if (limited) return limited
  if (!authed(req)) return noStore({ error: "locked" }, { status: 401 })

  const b = await req.json().catch(() => null)
  const p = db()
  if (!p) return noStore({ error: "no_database" }, { status: 503 })

  // Two different things PATCH here: a zone/point/route's geometry, or the
  // print sheet's footer note. Same tool, same autosave-on-drop philosophy
  // either way — the note just isn't tied to any one feature row.
  if (b && typeof b.footerNote === "string") {
    try {
      const result = await p.query(
        `update public.event_meta set site_plan_footer_note = $1, updated_at = now() where id = 1`,
        [b.footerNote],
      )
      if (result.rowCount === 0) {
        console.error("[map-features] footer note patch matched no row")
        return noStore({ error: "not_found" }, { status: 404 })
      }
      return noStore({ ok: true })
    } catch (err) {
      console.error("[map-features] footer note write failed", err)
      return noStore({ error: "write_failed" }, { status: 500 })
    }
  }

  if (!b || typeof b.id !== "string" || !b.geometry) {
    return noStore({ error: "bad_request" }, { status: 400 })
  }
  try {
    const result = await p.query(
      `update public.map_features set geometry = $2::jsonb, updated_at = now() where id = $1`,
      [b.id, JSON.stringify(b.geometry)],
    )
    if (result.rowCount === 0) {
      console.error("[map-features] patch matched no row", { id: b.id })
      return noStore({ error: "not_found" }, { status: 404 })
    }
    return noStore({ ok: true })
  } catch (err) {
    console.error("[map-features] write failed", err)
    return noStore({ error: "write_failed" }, { status: 500 })
  }
}
