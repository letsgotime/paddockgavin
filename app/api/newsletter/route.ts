import { type NextRequest, NextResponse } from "next/server"
import { recipients, markSent } from "@/lib/events/digest"
import { weeklyDigest } from "@/lib/email/ranch-digest"
import { renderRanchEmail, renderRanchText } from "@/lib/email/ranch"
import { buildDigest, previewResponse } from "@/lib/email/preview"

/**
 * The weekly letter: look at it, then send it.
 *
 * GET renders exactly what would go out, to nobody, and is the same document
 * served at /newsletter, which is the address to give a person.
 *
 * POST sends, and only with NEWSLETTER_SEND_KEY set in the environment and
 * matched in the request. Without that variable the route refuses, which means
 * a deploy cannot start posting to fifteen people because somebody found the
 * URL. Setting it is the deliberate act.
 *
 * Every message carries List-Unsubscribe and List-Unsubscribe-Post beside the
 * visible link. Gmail and Yahoo both require that of bulk senders, and the
 * mail audit caught us shipping a bulk message without it once already.
 */

export const dynamic = "force-dynamic"
export const maxDuration = 60

const SITE = "https://pistonpoweredranch.com"

export async function GET(req: NextRequest) {
  return previewResponse(req)
}

export async function POST(req: NextRequest) {
  const key = process.env.NEWSLETTER_SEND_KEY
  if (!key) {
    return NextResponse.json(
      { error: "Sending is switched off. Set NEWSLETTER_SEND_KEY to turn it on." },
      { status: 503 },
    )
  }
  const given = req.headers.get("x-send-key") || ""
  if (given !== key) return NextResponse.json({ error: "Not authorised" }, { status: 401 })

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return NextResponse.json({ error: "No RESEND_API_KEY" }, { status: 503 })

  const slug = req.nextUrl.searchParams.get("event") || "pistonpoweredranch"
  const built = await buildDigest(slug)
  if ("error" in built) return NextResponse.json({ error: built.error }, { status: built.status })

  const { event, news } = built
  const to = await recipients(event.id)
  if (to.length === 0) return NextResponse.json({ sent: 0, note: "Nobody is due a letter this week." })

  const sent: string[] = []
  const failed: { email: string; why: string }[] = []

  for (const r of to) {
    const unsubscribeUrl = `${SITE}/api/unsubscribe?t=${r.token}`
    const doc = weeklyDigest({ event, news, name: r.name, unsubscribeUrl })
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: doc.from,
          to: [r.email],
          subject: doc.subject,
          html: renderRanchEmail(doc),
          text: renderRanchText(doc),
          headers: {
            "List-Unsubscribe": `<${unsubscribeUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        }),
      })
      if (res.ok) sent.push(r.id)
      else failed.push({ email: r.email, why: `resend ${res.status}` })
    } catch (e) {
      failed.push({ email: r.email, why: e instanceof Error ? e.message : "threw" })
    }
  }

  /* Stamped only for the ones that actually went, so a partial run resumes
     rather than skipping the people it failed on. */
  await markSent(sent)

  return NextResponse.json({ sent: sent.length, failed, subject: weeklyDigest({ event, news, unsubscribeUrl: SITE }).subject })
}
