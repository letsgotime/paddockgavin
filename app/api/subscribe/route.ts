import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { emailSubscribers } from "@/lib/db/schema"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, source = "site", honeypot } = body

    // Honeypot — bots fill this field
    if (honeypot) return NextResponse.json({ ok: true })

    // Basic validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 })
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? null

    // Save to Neon
    await db.insert(emailSubscribers).values({ email, source, ip })

    // Notify paddock20@gmail.com via Resend
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from:    "PaddockGavin <noreply@paddockgavin.com>",
        to:      "paddock20@gmail.com",
        subject: `New subscriber — ${source}`,
        text:    `New email subscriber.\n\nEmail: ${email}\nSource: ${source}\nIP: ${ip ?? "unknown"}\nTime: ${new Date().toISOString()}`,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[subscribe]", err)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
