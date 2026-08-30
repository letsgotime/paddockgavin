import { NextRequest, NextResponse } from "next/server"
import { renderRanchEmail } from "@/lib/email/ranch"
import { ranchTemplate, CATALOGUE } from "@/lib/email/ranch-templates"
import { render } from "@react-email/render"
import SubscriberWelcome from "@/emails/subscriber-welcome"
import WireframeDigestIssue from "@/emails/wireframe-digest-issue"
import IntakeConfirmation from "@/emails/intake-confirmation"

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "welcome"

  let html = ""

  /* The ranch set, rendered through the same modules that send, so the preview
     is the real markup rather than a lookalike. ?id=ranch lists everything. */
  if (id === "ranch") {
    const rows = CATALOGUE.map(
      (c) =>
        `<tr><td style="padding:9px 14px;border-bottom:1px solid #E4DFD5"><a href="?id=ranch-${c.surface}-${c.stage}" style="color:#B3121A;text-decoration:none;font-weight:600">${c.label}</a></td>
         <td style="padding:9px 14px;border-bottom:1px solid #E4DFD5;font-family:ui-monospace,Menlo,monospace;font-size:12px;color:#6E7A8A">${c.surface} &middot; ${c.stage}</td></tr>`,
    ).join("")
    return new NextResponse(
      `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ranch email set</title></head>
       <body style="margin:0;background:#F7F6F3;font-family:Georgia,serif;color:#14181D">
       <div style="max-width:760px;margin:0 auto;padding:48px 20px">
         <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:#B3121A;margin:0">The Piston Powered Ranch</p>
         <h1 style="font-size:34px;margin:12px 0 6px;letter-spacing:-.02em">The email set</h1>
         <p style="color:#3F4750;margin:0 0 26px">${CATALOGUE.length} messages, every surface and every stage a submission passes through. Each one renders through the same module that sends it.</p>
         <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #E4DFD5;border-radius:10px;overflow:hidden">${rows}</table>
       </div></body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    )
  }

  if (id.startsWith("ranch-")) {
    const rest = id.slice("ranch-".length)
    const hit = CATALOGUE.find((c) => `${c.surface}-${c.stage}` === rest)
    if (!hit) return new NextResponse("Unknown ranch template", { status: 404 })
    /* Sample values only, so the merge fields are visible in context. Anything
       left out shows as [not set] rather than inventing a plausible value. */
    const doc = ranchTemplate(hit.surface, hit.stage, {
      name: "Marisol Reyes",
      org: hit.surface === "entry" ? "1973 Porsche 911 Carrera RS" : hit.surface === "sponsor" ? "111 Motorcars" : "Wood fired pizza, one trailer",
      bay: "Row C, bay 14",
      gate: "7:45am",
      make: "the other Porsches",
      loadIn: "6:30am to 8:15am",
      party: "four",
      assetsDue: "Friday 18 September 2026",
      amount: "$450.00 USD",
      receiptNo: "PPR-2026-0184",
      method: "Visa ending 4242",
      paidOn: "30 August 2026",
      covers: "Vendor stall, 10ft by 20ft, with power",
    })
    if (!doc) return new NextResponse("Unknown ranch template", { status: 404 })
    return new NextResponse(renderRanchEmail(doc), { headers: { "Content-Type": "text/html; charset=utf-8" } })
  }

  if (id === "welcome") {
    html = await render(SubscriberWelcome({ source: "juice-box" }))
  } else if (id === "digest") {
    html = await render(WireframeDigestIssue({
      issueNumber: "012",
      issueDate:   "August 2026",
      title:       "What Agentic Engineering Actually Looks Like on a $25K Build",
      kicker:      "Agentic Engineering · Cluster 1.1",
      slug:        "what-is-agentic-engineering",
      lede:        "Everyone is calling their intern an AI engineer. Here is what the term actually means when real production software is involved.",
      body:        "The term agentic engineering is new. Andrej Karpathy coined it in early 2025 and the internet immediately turned it into a buzzword.\n\nHere is what it actually means in practice on a real build.\n\nIt means the engineer already knows how to do the work: manually, with legacy tools, under pressure. The AI does not replace that knowledge. It accelerates it. The leverage point is not the AI. It is the person who has run the operation and now writes the software.",
      linkedInPost: "Everyone is using AI. Not everyone knows what they are building.\n\nNew post: what agentic engineering actually looks like on a $25K build.\n\n→ paddockgavin.com/blog/what-is-agentic-engineering",
      instagramCaption: "AI doesn't replace the operator. It accelerates one.\n\nNew post in the Wireframe Digest. Link in bio.\n\n#agenticengineering #buildinpublic #paddockgavin",
    }))
  } else if (id === "intake") {
    html = await render(IntakeConfirmation({
      firstName: "Marcus",
      make:      "Porsche",
      model:     "GT3",
      year:      "2024",
      budget:    "$200,000 to $220,000",
      notes:     "PTS preferred, manual only, no PDK.",
      refNumber: "PG-2026-0047",
    }))
  }

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
