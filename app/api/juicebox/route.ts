import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email   = (body.email   ?? "").trim().toLowerCase()
    const company = (body.company ?? "").trim() // honeypot

    // honeypot — bots fill it, humans don't
    if (company) return NextResponse.json({ ok: true }) // silent drop

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 })
    }

    // TODO: wire to your email provider (Resend, Mailchimp, etc.)
    // For now: log and return success so the funnel works immediately.
    console.log("[juicebox] new subscriber:", email)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Server error. Try again." }, { status: 500 })
  }
}
