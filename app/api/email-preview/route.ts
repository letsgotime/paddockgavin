import { NextRequest, NextResponse } from "next/server"
import { render } from "@react-email/render"
import SubscriberWelcome from "@/emails/subscriber-welcome"
import WireframeDigestIssue from "@/emails/wireframe-digest-issue"
import IntakeConfirmation from "@/emails/intake-confirmation"

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "welcome"

  let html = ""

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
