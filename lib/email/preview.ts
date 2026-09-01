import { type NextRequest, NextResponse } from "next/server"
import { loadEvent } from "@/lib/events/load"
import { gatherNews, recipients } from "@/lib/events/digest"
import { weeklyDigest } from "@/lib/email/ranch-digest"
import { renderRanchEmail } from "@/lib/email/ranch"

/**
 * Reading the weekly letter without sending it.
 *
 * Shared by the human address, /newsletter, and the machine one under /api,
 * so the thing you read and the thing that goes out cannot drift apart.
 */

const SITE = "https://pistonpoweredranch.com"

export async function buildDigest(slug: string) {
  const event = await loadEvent(slug)
  if (!event) return { error: "No such event", status: 404 as const }

  const news = await gatherNews(event)
  if (!news) return { error: "No connection to the CRM database. Set CRM_DATABASE_URL.", status: 503 as const }

  return { event, news }
}

export async function previewResponse(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("event") || "pistonpoweredranch"
  const built = await buildDigest(slug)
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
      note: "Nothing was sent. POST to /api/newsletter with the send key to send.",
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
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } })
}
