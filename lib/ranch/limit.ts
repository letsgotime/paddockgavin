import { NextResponse } from "next/server"

/**
 * A ceiling per connection per route, held in the memory of the function
 * that is running. Approximate on purpose: Vercel may run several copies,
 * each with its own count, so this stops a flood from one address and does
 * not pretend to be an exact meter. Generous for a person, who sends a form
 * once; closed to a script that sends it every second.
 */
const WINDOW_MS = 10 * 60 * 1000
const seen = new Map<string, number[]>()

function ipOf(req: Request): string {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown"
}

/** Null when the caller is within the limit; a 429 response when not. */
export function tooMany(req: Request, route: string, limit: number): NextResponse | null {
  const now = Date.now()
  const key = `${route}:${ipOf(req)}`
  const stamps = (seen.get(key) || []).filter((t) => now - t < WINDOW_MS)
  if (stamps.length >= limit) {
    console.warn("[limit] refused", { route, ip: ipOf(req), inWindow: stamps.length })
    return NextResponse.json(
      { error: "slow_down", detail: "Too many tries from this connection. Wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": "600" } },
    )
  }
  stamps.push(now)
  seen.set(key, stamps)
  if (seen.size > 5000) {
    for (const [k, v] of seen) if (!v.some((t) => now - t < WINDOW_MS)) seen.delete(k)
  }
  return null
}
