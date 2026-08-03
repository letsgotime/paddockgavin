import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { emailSubscribers } from "@/lib/db/schema"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email   = (body.email   ?? "").trim().toLowerCase()
    const company = (body.company ?? "").trim() // honeypot

    if (company) return NextResponse.json({ ok: true })

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 })
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? null

    await db.insert(emailSubscribers).values({ email, source: "juice-box", ip })

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from:    "PaddockGavin <noreply@paddockgavin.com>",
        to:      "paddock20@gmail.com",
        subject: "New Juice Box subscriber",
        text:    `Email: ${email}\nSource: juice-box\nIP: ${ip ?? "unknown"}\nTime: ${new Date().toISOString()}`,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[juicebox]", err)
    return NextResponse.json({ error: "Server error. Try again." }, { status: 500 })
  }
}
