import { NextRequest, NextResponse } from "next/server"
import { renderRanchEmail } from "@/lib/email/ranch"
import { ranchTemplate, CATALOGUE } from "@/lib/email/ranch-templates"
import { welcomeEmail, TEAM } from "@/lib/email/ranch-welcome"
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
    const groups: { title: string; of: typeof CATALOGUE }[] = [
      { title: "Cars", of: CATALOGUE.filter((c) => c.surface === "entry") },
      { title: "Vendors", of: CATALOGUE.filter((c) => c.surface === "vendor") },
      { title: "Sponsors", of: CATALOGUE.filter((c) => c.surface === "sponsor") },
      { title: "Spectators", of: CATALOGUE.filter((c) => c.surface === "spectator") },
    ]
    const card = (c: (typeof CATALOGUE)[number]) => `
      <figure style="margin:0">
        <div style="position:relative;width:340px;height:430px;overflow:hidden;border:1px solid #DDD8CE;border-radius:10px;background:#EDE9E1;box-shadow:0 2px 10px rgba(0,0,0,.06)">
          <iframe src="?id=ranch-${c.surface}-${c.stage}" scrolling="no" loading="lazy"
            style="position:absolute;top:0;left:0;width:620px;height:790px;border:0;transform:scale(.548);transform-origin:0 0"></iframe>
          <a href="?id=ranch-${c.surface}-${c.stage}" target="_blank"
             style="position:absolute;inset:0;display:block" aria-label="Open ${c.label}"></a>
        </div>
        <figcaption style="padding:9px 2px 0">
          <a href="?id=ranch-${c.surface}-${c.stage}" target="_blank" style="color:#14181D;text-decoration:none;font-weight:600;font-size:14.5px">${c.label}</a>
          <div style="font-family:ui-monospace,Menlo,monospace;font-size:11px;color:#8A93A0;margin-top:2px">${c.surface} &middot; ${c.stage}</div>
        </figcaption>
      </figure>`
    return new NextResponse(
      `<!doctype html><html lang="en"><head><meta charset="utf-8">
       <meta name="viewport" content="width=device-width,initial-scale=1">
       <title>Ranch email set</title>
       <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
       <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Libre+Franklin:wght@400;600;800&display=swap">
       </head>
       <body style="margin:0;background:#F7F6F3;color:#14181D;font-family:'Libre Franklin',-apple-system,Arial,sans-serif">
       <div style="max-width:1240px;margin:0 auto;padding:44px 22px 90px">
         <p style="font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:#B3121A;margin:0;font-weight:600">The Piston Powered Ranch</p>
         <h1 style="font-family:Cinzel,Georgia,serif;font-size:40px;margin:12px 0 8px;letter-spacing:.01em">The email set</h1>
         <p style="color:#4A535E;margin:0 0 8px;max-width:66ch;font-size:16.5px">${CATALOGUE.length} messages. Every one renders through the same module that sends it, so this is the real markup rather than a mock. Click any of them to open it full size.</p>
         <p style="color:#8A93A0;margin:0 0 34px;font-size:13.5px">Cinzel is loaded on this page but will not load in most inboxes, so the display line falls back to Georgia there. That fallback is what the design was drawn for.</p>
         <section style="margin:0 0 42px">
           <h2 style="font-size:13px;letter-spacing:.15em;text-transform:uppercase;color:#8A93A0;font-weight:600;margin:0 0 16px;padding-bottom:9px;border-bottom:1px solid #DDD8CE">The team <span style="color:#C3BDB2">${TEAM.length}</span></h2>
           <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:26px">
           ${TEAM.map((p) => {
             const slug = p.name.toLowerCase().split(" ")[0]
             return `<figure style="margin:0">
               <div style="position:relative;width:340px;height:430px;overflow:hidden;border:1px solid #DDD8CE;border-radius:10px;background:#EDE9E1;box-shadow:0 2px 10px rgba(0,0,0,.06)">
                 <iframe src="?id=welcome-${slug}" scrolling="no" loading="lazy" style="position:absolute;top:0;left:0;width:620px;height:790px;border:0;transform:scale(.548);transform-origin:0 0"></iframe>
                 <a href="?id=welcome-${slug}" target="_blank" style="position:absolute;inset:0;display:block"></a>
               </div>
               <figcaption style="padding:9px 2px 0">
                 <a href="?id=welcome-${slug}" target="_blank" style="color:#14181D;text-decoration:none;font-weight:600;font-size:14.5px">Welcome, ${p.name}</a>
                 <div style="font-family:ui-monospace,Menlo,monospace;font-size:11px;color:#8A93A0;margin-top:2px">${p.seesMoney ? "sees cost" : "cost withheld"}</div>
               </figcaption></figure>`
           }).join("")}
           </div></section>
       ${groups
           .map(
             (g) => `<section style="margin:0 0 42px">
             <h2 style="font-size:13px;letter-spacing:.15em;text-transform:uppercase;color:#8A93A0;font-weight:600;margin:0 0 16px;padding-bottom:9px;border-bottom:1px solid #DDD8CE">${g.title} <span style="color:#C3BDB2">${g.of.length}</span></h2>
             <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:26px">${g.of.map(card).join("")}</div>
           </section>`,
           )
           .join("")}
       </div></body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    )
  }

  /* One per person, because the money line differs and the sign in address is
     not always the one they would guess. */
  if (id.startsWith("welcome-")) {
    const who = id.slice("welcome-".length).toLowerCase()
    const p = TEAM.find((x) => x.name.toLowerCase().split(" ")[0] === who)
    if (!p) return new NextResponse("Unknown person. Try welcome-oscar, welcome-bekah, welcome-gavin, welcome-arnie or welcome-josh.", { status: 404 })
    return new NextResponse(renderRanchEmail(welcomeEmail(p)), { headers: { "Content-Type": "text/html; charset=utf-8" } })
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
