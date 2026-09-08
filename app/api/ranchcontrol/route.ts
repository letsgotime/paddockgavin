import { NextResponse, type NextRequest } from "next/server"
import { getFullState, writeDial, writeSheetField, writeSponsor } from "@/lib/ranchcontrol/store"

/**
 * Ranch control's data endpoint: the whole workspace in one GET, one of
 * three small writes on POST. No claude.use("db") here, because that API
 * only exists inside a claude.ai artifact iframe; this is the fetch-based
 * replacement, reading and writing the ranch's own Neon project instead.
 */
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const COOKIE = "pg_rc"
const COOKIE_VALUE = "ok"

function locked() {
  return NextResponse.json({ error: "locked" }, { status: 401 })
}

function authed(req: NextRequest): boolean {
  return req.cookies.get(COOKIE)?.value === COOKIE_VALUE
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return locked()
  try {
    const state = await getFullState()
    return NextResponse.json(state)
  } catch (err) {
    console.error("[ranchcontrol] could not load state", err)
    return NextResponse.json({ error: "no_database" }, { status: 503 })
  }
}

interface DialBody {
  type: "dial"
  k: unknown
  v: unknown
  who: unknown
}
interface SheetBody {
  type: "sheet"
  k: unknown
  f: unknown
  v: unknown
  who: unknown
}
interface SponsorBody {
  type: "sponsor"
  id: unknown
  body: unknown
  who: unknown
}
type PostBody = DialBody | SheetBody | SponsorBody

export async function POST(req: NextRequest) {
  if (!authed(req)) return locked()

  let body: PostBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 })
  }

  const who = typeof body.who === "string" ? body.who.trim().slice(0, 60) : ""
  if (!who) return NextResponse.json({ error: "no_name" }, { status: 400 })

  try {
    if (body.type === "dial") {
      const k = typeof body.k === "string" ? body.k : ""
      const v = Number(body.v)
      if (!k || !Number.isFinite(v)) return NextResponse.json({ error: "bad_body" }, { status: 400 })
      await writeDial(k, v, who)
    } else if (body.type === "sheet") {
      const k = typeof body.k === "string" ? body.k : ""
      const f = body.f === "rate" || body.f === "qty" ? body.f : null
      if (!k || !f) return NextResponse.json({ error: "bad_body" }, { status: 400 })
      const v = body.v === null ? null : Number(body.v)
      if (v !== null && !Number.isFinite(v)) return NextResponse.json({ error: "bad_body" }, { status: 400 })
      await writeSheetField(k, f, v, who)
    } else if (body.type === "sponsor") {
      const id = typeof body.id === "string" ? body.id : ""
      if (!id || typeof body.body !== "object" || body.body === null) return NextResponse.json({ error: "bad_body" }, { status: 400 })
      await writeSponsor(id, body.body as Record<string, unknown>, who)
    } else {
      return NextResponse.json({ error: "bad_type" }, { status: 400 })
    }
  } catch (err) {
    if (err instanceof Error && err.message === "bad_key") {
      return NextResponse.json({ error: "bad_key" }, { status: 400 })
    }
    console.error("[ranchcontrol] write failed", err)
    return NextResponse.json({ error: "write_failed" }, { status: 500 })
  }

  try {
    const state = await getFullState()
    return NextResponse.json(state)
  } catch (err) {
    console.error("[ranchcontrol] could not reload state after write", err)
    return NextResponse.json({ error: "no_database" }, { status: 503 })
  }
}
