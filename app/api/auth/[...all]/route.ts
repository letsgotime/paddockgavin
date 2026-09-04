import { NextResponse } from "next/server"
import { authConfigured, getAuth } from "@/lib/ranch/auth"

/**
 * The sign in server.
 *
 * Every Better Auth endpoint lives under this one catch-all:
 * /api/auth/sign-in/email, /sign-up/email, /token, /jwks, /get-session,
 * /magic-link/*, /email-otp/* and the rest. Routing only the first segment is
 * exactly the fault that once answered /api/auth/ok while 404ing every
 * endpoint that mattered.
 *
 * It ran on the tools deployment until 3 September 2026, proxied here. The
 * configuration is unchanged, including the canonical origin it issues tokens
 * from, so sessions and the published signing key carry across. Two secrets
 * have to carry across with it: RANCH_DATABASE_URL, and BETTER_AUTH_SECRET,
 * which must be the SAME value, because the signing key in neon_auth.jwks is
 * encrypted with it. A different secret means every session breaks and the
 * key cannot be decrypted, which is the exact failure this estate spent a day
 * on. Until both exist here, next.config.ts keeps sending /api/auth to the
 * deployment that has them, so this route answers nothing in the meantime.
 */

export const runtime = "nodejs"
/* Cookies and signatures. Nothing here may be prerendered or cached. */
export const dynamic = "force-dynamic"

function handle(req: Request) {
  if (!authConfigured()) {
    return NextResponse.json(
      { error: "not_configured", detail: "The sign in server is not configured on this deployment." },
      { status: 503 },
    )
  }
  return getAuth().handler(req)
}

export const GET = handle
export const POST = handle
