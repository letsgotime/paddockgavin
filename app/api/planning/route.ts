import { NextResponse } from "next/server"
import { bearerFrom, emailFromToken, canSeeMoney } from "@/lib/ranch/neon"
import { PLANNING_DOCS } from "@/lib/ranch/planning-docs"

/**
 * The internal planning documents, to the people who may see money.
 *
 * The Budget Ledger and the Scope of Work were once markup inside
 * console/planning/index.html, which meant a client side gate hid them on
 * screen while anyone running view source read every figure. They are served
 * from here instead, so withholding them is real.
 *
 * Two checks, and they are different questions. The token is verified
 * cryptographically against the keys our auth server publishes, which is
 * authentication. Then can_see_money() is asked of the database with that same
 * token, which is authorisation, and it reads public.staff_allowlist, so the
 * policy and this route can never disagree about who somebody is.
 */
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const bearer = bearerFrom(req)
  if (!bearer) return NextResponse.json({ error: "Sign in required" }, { status: 401 })

  const email = await emailFromToken(bearer)
  if (!email) return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })

  if (!(await canSeeMoney(bearer))) {
    return NextResponse.json({ error: "Not authorised for cost and margin" }, { status: 403 })
  }

  /* Never let a shared cache hold these. */
  return NextResponse.json(PLANNING_DOCS, { headers: { "Cache-Control": "no-store, private" } })
}
