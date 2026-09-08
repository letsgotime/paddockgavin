import { NextResponse, type NextRequest } from "next/server"
import { tooMany } from "@/lib/ranch/limit"

/**
 * The one shared password for ranch control.
 *
 * Not a login: nobody has an account, there is one password for the whole
 * team, and it sets one cookie that says "in" rather than who. That is a
 * deliberate step down from the staff sign in the CrmShell tools require,
 * because this needed to be sendable to Josh, Arnie and Oscar tonight, on
 * the ranch's own domain, with no account for any of them to create.
 */
export const runtime = "nodejs"

const COOKIE = "pg_rc"
const COOKIE_VALUE = "ok"
const THIRTY_DAYS = 60 * 60 * 24 * 30

export async function POST(req: NextRequest) {
  const limited = tooMany(req, "ranchcontrol-auth", 20)
  if (limited) return limited

  let body: { password?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 })
  }

  const expected = process.env.RANCH_CONTROL_PASSWORD || "179179"
  const given = typeof body.password === "string" ? body.password : ""

  if (given !== expected) {
    /* No other detail: not which part was wrong, not how many tries are
       left. Just locked or not. */
    return new NextResponse(null, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, COOKIE_VALUE, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  })
  return res
}
