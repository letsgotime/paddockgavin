/**
 * The human check, answered by Cloudflare.
 *
 * One function for every public form, so the rules are the same at every
 * door: null when this deployment holds no secret (the check is not on),
 * a refusal when the token is missing or Cloudflare says no, and a pass
 * when the secret itself is wrong or Cloudflare cannot be reached. Turning
 * away every genuine entrant, vendor, sponsor and spectator because a key
 * is misconfigured is worse than letting a bot past the honeypot.
 */
export async function human(
  token: string | undefined,
  ip: string | null,
  action: string,
  tag = "human",
): Promise<{ ok: boolean; why?: string } | null> {
  const secret = process.env.TURNSTILE_SECRET
  if (!secret) return null
  if (!token) return { ok: false, why: "missing" }
  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip) body.set("remoteip", ip)
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })
    const j = (await res.json()) as { success?: boolean; action?: string; "error-codes"?: string[] }
    if (!j.success && (j["error-codes"] || []).includes("invalid-input-secret")) {
      console.error(`[${tag}] TURNSTILE_SECRET is not a key Cloudflare accepts; the check is open until it is fixed`)
      return { ok: true }
    }
    if (!j.success) return { ok: false, why: (j["error-codes"] || []).join(",") || "failed" }
    if (j.action && j.action !== action) return { ok: false, why: "wrong-action" }
    return { ok: true }
  } catch {
    console.warn(`[${tag}] turnstile siteverify unreachable`)
    return { ok: true }
  }
}

/** The caller's address as the edge saw it, for Cloudflare's remoteip. */
export function callerIp(req: Request): string | null {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || null
}
