import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { SESSION_TTL_MS, signSession, sessionSecret, gateEnforced } from "@/lib/ranch/upload-session"

/**
 * Exchanges one Turnstile token for a short-lived, signed upload session.
 *
 * Turnstile tokens are single use at siteverify, but one vehicle submission
 * can be fifty photographs plus video, voice and documents, each its own call
 * to /api/upload. Verifying per file would fail on the second one with
 * "timeout-or-duplicate". So the human is checked once here, and the result is
 * a signed session that authorises that submitter's uploads for a short
 * window.
 *
 * With TURNSTILE_SECRET unset this reports enforced:false and issues no
 * session, and /api/upload stays open exactly as it is today. Setting the
 * secret turns enforcement on with no code change.
 */
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const SUBMISSION_TYPES = new Set(["vehicle", "vendor", "sponsor"])

export async function POST(req: Request) {
  const secret = process.env.TURNSTILE_SECRET || ""
  if (!gateEnforced()) {
    /* Not configured: uploads remain open. Loud on the server, explicit to
       the client. */
    console.warn("[turnstile] TURNSTILE_SECRET unset, upload gate NOT enforced")
    return NextResponse.json({ enforced: false, session: null })
  }

  let body: { token?: unknown; draftId?: unknown; submissionType?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Verification required" }, { status: 403 })
  }

  const token = body.token
  const draftId = String(body.draftId || "").replace(/[^a-zA-Z0-9_-]/g, "")
  const submissionType =
    typeof body.submissionType === "string" && SUBMISSION_TYPES.has(body.submissionType)
      ? body.submissionType
      : "vehicle"

  if (typeof token !== "string" || !token || token.length > 2048 || draftId.length < 8) {
    return NextResponse.json({ error: "Verification required" }, { status: 403 })
  }

  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean),
  )
  if (expectedHostnames.size === 0) {
    console.error("[turnstile] TURNSTILE_HOSTNAMES unset, refusing to verify")
    return NextResponse.json({ error: "Verification misconfigured" }, { status: 403 })
  }

  const clientIp = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim()

  let result: { success?: boolean; action?: string; hostname?: string; "error-codes"?: string[] }
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({
        secret,
        response: token,
        ...(clientIp ? { remoteip: clientIp } : {}),
      }),
    })
    if (!r.ok) throw new Error(`siteverify ${r.status}`)
    result = await r.json()
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 403 })
  }

  /* A secret Cloudflare rejects is our fault, not the visitor's, and refusing
     everybody is the worse failure: Turnstile filters bots, it does not
     authorise anyone. Say so loudly in the log and let the person past. Every
     other failure is a real one and is refused. */
  if (!result.success && (result["error-codes"] || []).includes("invalid-input-secret")) {
    console.error("[turnstile] TURNSTILE_SECRET is not a key Cloudflare accepts; the gate is open until it is fixed")
    return NextResponse.json({ enforced: false, session: null })
  }

  if (!result.success || result.action !== "submit-media" || !expectedHostnames.has(String(result.hostname))) {
    return NextResponse.json({ error: "Verification failed" }, { status: 403 })
  }

  const session = signSession(
    { d: draftId, t: submissionType, e: Date.now() + SESSION_TTL_MS, j: randomUUID() },
    sessionSecret(),
  )
  return NextResponse.json({ enforced: true, session, expiresIn: SESSION_TTL_MS })
}
