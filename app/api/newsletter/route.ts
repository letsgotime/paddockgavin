import { type NextRequest, NextResponse } from "next/server"
import { loadEvent } from "@/lib/events/load"
import { gatherNews, recipients, markSent } from "@/lib/events/digest"
import { weeklyDigest } from "@/lib/email/ranch-digest"
import { renderRanchEmail, renderRanchText } from "@/lib/email/ranch"

/**
 * The weekly letter: look at it, then send it.
 *
 * GET renders exactly what would go out, to nobody. It reports who would
 * receive it and why the others would not, so the thing can be read before it
 * is sent rather than after.
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

async function build(slug: string) {
  const event = await loadEvent(slug)
  if (!event) return { error: "No such event", status: 404 as const }

  const news = await gatherNews(event)
  if (!news) return { error: "No connection to the CRM database. Set CRM_DATABASE_URL.", status: 503 as const }

  return { event, news }
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("event") || "pistonpoweredranch"
  const built = await build(slug)
  if ("error" in built) return NextResponse.json({ error: built.error }, { status: built.status })

  const { event, news } = built
  const to = await recipients(event.id)

  /* Rendered with a real recipient where there is one, so the preview is the
     letter rather than an approximation of it. */
  const sample = to[0]
  const doc = weeklyDigest({
    event,
    news,
    name: sample?.name ?? null,
    unsubscribeUrl: `${SITE}/api/unsubscribe?t=${sample?.token ?? "00000000-0000-0000-0000-000000000000"}`,
  })

  if (req.nextUrl.searchParams.get("format") === "json") {
    return NextResponse.json({
      event: event.slug,
      subject: doc.subject,
      wouldSendTo: to.length,
      news: {
        daysLeft: news.daysLeft,
        rsvps: news.rsvps,
        heads: news.heads,
        newPartners: news.newPartners,
        runOfShowLines: news.runOfShow.length,
      },
      note: "Nothing was sent. POST with the send key to send.",
    })
  }

  const banner = `<div style="font:600 13px/1.5 ui-monospace,Menlo,monospace;background:#0A1523;color:#EDF1F6;padding:14px 18px">
    PREVIEW ONLY, nothing sent &middot; would go to ${to.length} ${to.length === 1 ? "person" : "people"} &middot; subject: ${doc.subject}
  </div>`
  /* Inside the document, not in front of it. Prepending anything before the
     doctype puts the parser in quirks mode and it foster-parents the head into
     the body, which drops the outer table the sheet floats on. The preview then
     shows something no recipient will ever get. */
  const html = renderRanchEmail(doc).replace(/(<body[^>]*>)/i, `$1${banner}`)
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
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
  const built = await build(slug)
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
