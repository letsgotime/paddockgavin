import { NextRequest, NextResponse } from "next/server"
import { renderRanchEmail } from "@/lib/email/ranch"
import { render } from "@react-email/render"
import SubscriberWelcome from "@/emails/subscriber-welcome"
import WireframeDigestIssue from "@/emails/wireframe-digest-issue"
import IntakeConfirmation from "@/emails/intake-confirmation"

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "welcome"

  let html = ""

  /* The ranch set, rendered through lib/email/ranch so the preview is the same
     markup that goes out rather than a lookalike. */
  if (id.startsWith("ranch-")) {
    const FACTS = {
      kind: "facts" as const,
      rows: [
        { label: "When", value: "Saturday 10 October 2026" },
        { label: "Hours", value: "9am to 3pm" },
        { label: "Where", value: "Rancho Jaramillo, Unionville, Tennessee" },
        { label: "Entry", value: "Free, to show and to watch" },
      ],
    }
    if (id === "ranch-entry") {
      html = renderRanchEmail({
        preheader: "We read every entry ourselves. Here is what happens next.",
        eyebrow: "Entry received",
        heading: "Your car is in the queue",
        blocks: [
          { kind: "lead", text: "Thank you for entering the 1973 Porsche 911 Carrera RS." },
          { kind: "p", text: "The Piston Powered Ranch takes 300 cars and every one of them is chosen. A person reads your entry rather than a form deciding on a first come basis. That takes us a little time, and it is the reason the field looks the way it does." },
          { kind: "p", text: "You will hear either way. If your car is in, that email carries your gate time, your bay and the make you are grouped with." },
          FACTS,
          { kind: "quiet", text: "Nothing is owed and nothing is due." },
        ],
        signoff: "Reply to this email if anything about the car changes, including if you need to pull out. Knowing early costs us nothing. Knowing on the day costs a space somebody else wanted.",
      })
    } else if (id === "ranch-rsvp") {
      html = renderRanchEmail({
        preheader: "No ticket, nothing to print, nothing to pay.",
        eyebrow: "Free to attend",
        heading: "You are counted",
        blocks: [
          { kind: "lead", text: "Thank you, Marisol. Your party of four is on the list." },
          { kind: "p", text: "There is no ticket and no charge. The count is what tells us how much food to cook and how many restrooms to hire, so saying you are coming genuinely helps." },
          FACTS,
          { kind: "button", label: "Add to your calendar", href: "https://paddockgavin.com/events/pistonpoweredranch" },
          { kind: "quiet", text: "We will send parking and timings the week before. Nothing else will land in your inbox from us." },
        ],
        signoff: "Bring people. It is free for them too.",
        unsubscribe: "mailto:gavin@paddockgavin.com?subject=Unsubscribe",
      })
    } else {
      html = renderRanchEmail({
        preheader: "Payment received, and what it covers.",
        eyebrow: "Receipt",
        heading: "Thank you, that is settled",
        blocks: [
          { kind: "lead", text: "We have your vendor deposit for the Piston Powered Ranch." },
          { kind: "facts", rows: [
            { label: "Receipt", value: "PPR-2026-0184" },
            { label: "Paid", value: "$450.00 USD" },
            { label: "Method", value: "Visa ending 4242" },
            { label: "Date", value: "30 August 2026" },
            { label: "Covers", value: "Vendor stall, 10ft by 20ft, power" },
          ] },
          { kind: "p", text: "Your stall is held. We will send the site plan and your load in window in the last week of September, once the field is set." },
          { kind: "button", label: "Download receipt", href: "https://paddockgavin.com/events/pistonpoweredranch" },
        ],
        signoff: "Questions about the stall go to Bekah Stallard, who replies to this address.",
      })
    }
    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } })
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
