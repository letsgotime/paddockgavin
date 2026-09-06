import { NextResponse } from "next/server"

/**
 * Where the browser tells us what the content security policy would have
 * blocked. Report-only today, so every line here is a line to allow or a
 * line to ignore before the policy ever enforces. Read them in the runtime
 * log under [csp].
 */
export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const text = (await req.text()).slice(0, 4000)
    const j = JSON.parse(text) as { "csp-report"?: Record<string, unknown> } | Record<string, unknown>
    const r = ("csp-report" in j ? j["csp-report"] : j) as Record<string, unknown>
    console.warn("[csp]", {
      document: r["document-uri"],
      violated: r["violated-directive"] || r["effective-directive"],
      blocked: r["blocked-uri"],
      line: r["line-number"],
    })
  } catch {
    /* a malformed report is not worth a log line */
  }
  return new NextResponse(null, { status: 204 })
}
