import { NextResponse } from "next/server"
import { ranchDb } from "@/lib/ranch/ranch-db"

/**
 * Appends finished uploads to an existing submission, keyed by the status
 * token in the entrant's own link.
 *
 * The browser lost its database role when the anonymous token went away, so
 * the append runs here, through add_submission_media in Postgres. That
 * function validates every record against the private store's path rules,
 * drops junk and duplicates, caps the buckets at fifty photographs and three
 * clips, and appends. It cannot remove or replace anything, and nothing else
 * on the row moves, so an entry can only ever gain media here.
 */
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const TOKEN = /^[A-Za-z0-9._-]{32,128}$/
const KINDS = new Set(["photo", "video", "voice", "doc"])

interface Item {
  kind?: unknown
  url?: unknown
  pathname?: unknown
  name?: unknown
  size?: unknown
  type?: unknown
  seconds?: unknown
}

export async function POST(req: Request) {
  let body: { token?: unknown; items?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 })
  }
  const token = typeof body.token === "string" ? body.token : ""
  const items = Array.isArray(body.items) ? (body.items as Item[]) : []
  if (!TOKEN.test(token) || items.length < 1 || items.length > 20) {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 })
  }

  const clean = items
    .filter(
      (i) =>
        i &&
        typeof i === "object" &&
        KINDS.has(String(i.kind)) &&
        typeof i.pathname === "string" &&
        typeof i.url === "string",
    )
    .map((i) => ({
      kind: String(i.kind),
      url: String(i.url).slice(0, 600),
      pathname: String(i.pathname).slice(0, 300),
      name: String(i.name || "file").slice(0, 200),
      size: Math.max(0, Math.round(Number(i.size) || 0)),
      type: String(i.type || "").slice(0, 100),
      ...(i.seconds !== undefined ? { seconds: Math.max(0, Math.round(Number(i.seconds) || 0)) } : {}),
    }))
  if (!clean.length) return NextResponse.json({ error: "Nothing usable to add" }, { status: 400 })

  const p = ranchDb()
  if (!p) return NextResponse.json({ error: "Not available just now" }, { status: 503 })

  try {
    const { rows } = await p.query("select * from public.add_submission_media($1, $2::jsonb)", [
      token,
      JSON.stringify(clean),
    ])
    const r = rows[0]
    if (!r) return NextResponse.json({ error: "No entry matches that link" }, { status: 404 })
    return NextResponse.json({ photoCt: r.photo_ct, videoCt: r.video_ct, added: r.added, dropped: r.dropped })
  } catch (err) {
    console.error("[entry-media]", err)
    return NextResponse.json({ error: "Could not save that just now" }, { status: 500 })
  }
}
