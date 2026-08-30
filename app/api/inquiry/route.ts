import { NextResponse } from "next/server"

// Email destination is held server-side, never rendered client-side
const TO = "paddock20auto@gmail.com"

type InquiryKind = "ask-me" | "book-the-floor" | "creator-day-rsvp" | "intake" | "work"

interface InquiryBody {
  kind: InquiryKind
  name?: string
  reach?: string
  date?: string
  message: string
  page: string
  // intake-specific
  year?: string
  make?: string
  model?: string
  vin?: string
  mileage?: string
  color?: string
  price?: string
}

const SUBJECTS: Record<InquiryKind, string> = {
  "ask-me": "PaddockGavin · Ask Me",
  "book-the-floor": "PaddockGavin · Book the Floor",
  "creator-day-rsvp": "PaddockGavin · Creator Day RSVP",
  intake: "PaddockGavin · Car Intake",
  work: "PaddockGavin · Work With Us",
}

function buildHtml(body: InquiryBody): string {
  const rows = Object.entries(body)
    .filter(([, v]) => v && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px;color:#91918F;font-size:12px;text-transform:uppercase;letter-spacing:.1em;border-right:2px solid #27384F;white-space:nowrap">${k}</td><td style="padding:6px 14px;color:#EDF1F6;font-size:14px">${String(v).replace(/</g, "&lt;")}</td></tr>`
    )
    .join("")
  return `<!DOCTYPE html><html><body style="background:#0E1A2A;color:#EDF1F6;font-family:Arial,sans-serif;padding:32px">
<div style="max-width:600px;margin:0 auto">
  <div style="display:flex;height:5px;margin-bottom:24px">
    <div style="flex:1;background:#F2C94C"></div>
    <div style="flex:1;background:#00D2BE"></div>
    <div style="flex:1;background:#005185"></div>
    <div style="flex:1;background:#848482"></div>
  </div>
  <h1 style="font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:-.02em;color:#FFFFFF;margin:0 0 6px">PaddockGavin</h1>
  <p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#91918F;margin:0 0 24px">New inquiry · ${body.kind} · ${body.page}</p>
  <table style="width:100%;border-collapse:collapse;background:#152538;border:1px solid #27384F">
    ${rows}
  </table>
  <p style="margin:24px 0 0;font-size:12px;color:#848482">Sent from paddockgavin.com · ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} Nashville CT</p>
</div></body></html>`
}

export async function POST(req: Request) {
  try {
    const body: InquiryBody = await req.json()

    if (!body.kind || !body.message || !body.page) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const subject = SUBJECTS[body.kind] ?? "PaddockGavin · Inquiry"

    // Replying to the alert should reach the person who wrote in. Only set it when
    // reach is actually an address: Resend rejects the whole send on a bad reply_to.
    const replyTo =
      body.reach && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.reach.trim())
        ? body.reach.trim()
        : undefined

    // Use Resend if the API key is present; fall back to a logged no-op in dev
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "PaddockGavin <noreply@paddockgavin.com>",
          to: [TO],
          ...(replyTo ? { reply_to: replyTo } : {}),
          subject,
          html: buildHtml(body),
        }),
      })
      if (!res.ok) {
        const err = await res.text()
        console.error("[inquiry] Resend error:", err)
        return NextResponse.json({ error: "Email failed" }, { status: 502 })
      }
    } else {
      // Dev: log and succeed silently
      console.log("[inquiry] No RESEND_API_KEY, would send:", { to: TO, subject, body })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[inquiry] Unexpected error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
