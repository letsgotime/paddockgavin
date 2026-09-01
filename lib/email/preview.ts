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

/** For a value going inside a double quoted attribute, nothing else. */
function attr(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

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
  /* Rendered without a recipient. Neither this address nor the one under /api
     asks anyone to sign in, so personalising the preview put a real
     subscriber's first name on a public URL. The letter reads the same without
     it, and the merge can be checked with ?format=json, which reports the
     count and no names. */
  const doc = weeklyDigest({
    event,
    news,
    name: null,
    unsubscribeUrl: `${SITE}/api/unsubscribe?t=00000000-0000-0000-0000-000000000000`,
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
  /* Shared into a chat this is a link like any other, and a letter about a
     car show that previews as a grey rectangle is a letter nobody opens. The
     card is the event's own, off the same row the public page reads. Preview
     only: these never go out with the mail, where they would do nothing. */
  const card = event.brand.og
  const share = [
    '<meta name="robots" content="noindex,nofollow">',
    '<meta property="og:type" content="article">',
    `<meta property="og:site_name" content="${attr(event.name)}">`,
    `<meta property="og:title" content="${attr(doc.subject)}">`,
    `<meta property="og:description" content="${attr(doc.preheader)}">`,
    `<meta property="og:url" content="${SITE}/newsletter">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${attr(doc.subject)}">`,
    `<meta name="twitter:description" content="${attr(doc.preheader)}">`,
    ...(card
      ? [
          `<meta property="og:image" content="${attr(card)}">`,
          '<meta property="og:image:width" content="1200">',
          '<meta property="og:image:height" content="630">',
          `<meta property="og:image:alt" content="${attr(event.brand.ogAlt || event.name)}">`,
          `<meta name="twitter:image" content="${attr(card)}">`,
        ]
      : []),
  ].join("\n")

  const html = renderRanchEmail(doc)
    .replace(/(<body[^>]*>)/i, `$1${banner}`)
    .replace(/<\/head>/i, `${share}\n</head>`)
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } })
}
