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
     is the real markup rather than a lookalike. ?id=ranch lists everything.

     Every tile is a live iframe of the real template at 620 wide, scaled down.
     That is heavier than a screenshot and worth it: a screenshot goes stale the
     moment a template changes and nobody notices for a month. loading="lazy"
     keeps the ones below the fold from rendering until they are wanted. */
  if (id === "ranch") {
    const SURFACES = [
      { key: "team", title: "The team" },
      { key: "entry", title: "Cars" },
      { key: "vendor", title: "Vendors" },
      { key: "sponsor", title: "Sponsors" },
      { key: "spectator", title: "Spectators" },
    ]

    const tile = (href: string, label: string, meta: string, search: string) => `
      <figure class="t" data-s="${search.toLowerCase().replace(/"/g, "")}">
        <div class="shot">
          <iframe src="${href}" scrolling="no" loading="lazy" title="${label}"></iframe>
          <a class="hit" href="${href}" target="_blank" rel="noopener" aria-label="Open ${label}"></a>
        </div>
        <figcaption>
          <a class="lbl" href="${href}" target="_blank" rel="noopener">${label}</a>
          <div class="meta">${meta}</div>
          <button class="cp" type="button" data-href="${href}">Copy link</button>
        </figcaption>
      </figure>`

    const sections = SURFACES.map((s) => {
      const tiles =
        s.key === "team"
          ? TEAM.map((person) => {
              const slug = person.name.toLowerCase().split(" ")[0]
              return tile(`?id=welcome-${slug}`, person.name, "welcome", `${person.name} welcome team onboarding`)
            })
          : CATALOGUE.filter((c) => c.surface === s.key).map((c) =>
              tile(
                `?id=ranch-${c.surface}-${c.stage}`,
                c.label,
                `${c.surface} &middot; ${c.stage}`,
                `${c.label} ${c.surface} ${c.stage}`,
              ),
            )
      return `<section class="grp" data-k="${s.key}">
          <h2>${s.title}<span>${tiles.length}</span></h2>
          <div class="grid">${tiles.join("")}</div>
        </section>`
    }).join("")

    /* The welcome is one template written per person, so it is one message and
       five previews. Saying 42 messages would be counting the same letter five
       times. */
    const messages = CATALOGUE.length + 1
    const previews = CATALOGUE.length + TEAM.length

    return new NextResponse(
      `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>The ranch email set</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Libre+Franklin:wght@400;500;600;800&display=swap">
<style>
  :root{--paper:#F7F6F3;--card:#FFF;--ink:#14181D;--body:#4A535E;--mute:#8A93A0;--line:#DDD8CE;--red:#B3121A}
  *{box-sizing:border-box}
  body{margin:0;background:var(--paper);color:var(--ink);font-family:'Libre Franklin',-apple-system,BlinkMacSystemFont,Arial,sans-serif;font-size:16px;line-height:1.6}
  .wrap{max-width:1280px;margin:0 auto;padding:44px 22px 90px}
  .eyebrow{font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--red);margin:0;font-weight:600}
  h1{font-family:Cinzel,Georgia,serif;font-size:clamp(32px,5vw,44px);margin:12px 0 10px;letter-spacing:.01em;line-height:1.05}
  .lede{color:var(--body);margin:0 0 6px;max-width:66ch;font-size:16.5px}
  .fine{color:var(--mute);margin:0;font-size:13.5px;max-width:66ch}
  .bar{position:sticky;top:0;z-index:5;background:rgba(247,246,243,.94);backdrop-filter:blur(10px);
       margin:26px -22px 30px;padding:14px 22px;border-bottom:1px solid var(--line);
       display:flex;gap:9px;flex-wrap:wrap;align-items:center}
  .bar button{font:600 13px/1 'Libre Franklin',Arial,sans-serif;border:1px solid var(--line);background:var(--card);
       color:var(--body);border-radius:999px;padding:9px 15px;cursor:pointer}
  .bar button[aria-pressed=true]{background:var(--ink);border-color:var(--ink);color:#fff}
  .bar input{flex:1 1 190px;min-width:150px;font:400 14px/1 'Libre Franklin',Arial,sans-serif;
       border:1px solid var(--line);border-radius:999px;padding:10px 15px;background:var(--card);color:var(--ink)}
  .grp{margin:0 0 44px}
  .grp h2{font-size:13px;letter-spacing:.15em;text-transform:uppercase;color:var(--mute);font-weight:600;
       margin:0 0 16px;padding-bottom:9px;border-bottom:1px solid var(--line);display:flex;gap:9px;align-items:baseline}
  .grp h2 span{font-family:ui-monospace,Menlo,monospace;font-size:11px;color:var(--mute);font-weight:400}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,340px);justify-content:center;gap:26px}
  @media (max-width:420px){.grid{grid-template-columns:1fr}.t,.shot{width:100%!important}}
  .t{margin:0;width:340px}
  .shot{position:relative;width:340px;height:430px;overflow:hidden;border:1px solid var(--line);
       border-radius:10px;background:#fff}
  .shot iframe{position:absolute;top:0;left:0;width:620px;height:790px;border:0;transform:scale(.548);transform-origin:0 0}
  .hit{position:absolute;inset:0;display:block}
  figcaption{padding:10px 2px 0}
  .lbl{color:var(--ink);text-decoration:none;font-weight:600;font-size:14.5px}
  .lbl:hover{text-decoration:underline}
  .meta{font-family:ui-monospace,Menlo,monospace;font-size:11px;color:var(--mute);margin-top:2px}
  .cp{margin-top:7px;font:500 12px/1 'Libre Franklin',Arial,sans-serif;background:none;border:0;padding:0;
      color:var(--red);text-decoration:underline;text-underline-offset:3px;cursor:pointer}
  .none{color:var(--mute);font-size:15px;display:none}
  .none.on{display:block}
</style>
</head>
<body>
<div class="wrap">
  <p class="eyebrow">The Piston Powered Ranch</p>
  <h1>The email set</h1>
  <p class="lede">${messages} messages, in ${previews} previews: the welcome is written per person, so it appears ${TEAM.length} times. Every one renders through the same module that sends the real thing, so this is the actual markup rather than a picture of it. Click any tile to open it on its own.</p>
  <p class="fine">Cinzel is loaded on this page and will not load in most inboxes, so the headings fall back to Georgia there. That is the design rather than a fault: the fallback is chosen, not accidental.</p>

  <div class="bar">
    <button type="button" data-f="all" aria-pressed="true">Everything</button>
    <button type="button" data-f="team" aria-pressed="false">Team</button>
    <button type="button" data-f="entry" aria-pressed="false">Cars</button>
    <button type="button" data-f="vendor" aria-pressed="false">Vendors</button>
    <button type="button" data-f="sponsor" aria-pressed="false">Sponsors</button>
    <button type="button" data-f="spectator" aria-pressed="false">Spectators</button>
    <input type="search" id="q" placeholder="Search the set" aria-label="Search the set">
  </div>

  ${sections}
  <p class="none" id="none">Nothing matches that.</p>
</div>
<script>
(function () {
  var q = document.getElementById("q");
  var none = document.getElementById("none");
  var groups = [].slice.call(document.querySelectorAll(".grp"));
  var btns = [].slice.call(document.querySelectorAll(".bar button"));
  var filter = "all";

  function apply() {
    var text = (q.value || "").trim().toLowerCase();
    var shown = 0;
    groups.forEach(function (g) {
      var any = 0;
      [].slice.call(g.querySelectorAll(".t")).forEach(function (t) {
        var ok = (filter === "all" || g.getAttribute("data-k") === filter) &&
                 (!text || t.getAttribute("data-s").indexOf(text) > -1);
        t.style.display = ok ? "" : "none";
        if (ok) any++;
      });
      g.style.display = any ? "" : "none";
      shown += any;
    });
    none.className = shown ? "none" : "none on";
  }

  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      filter = b.getAttribute("data-f");
      btns.forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      apply();
    });
  });
  q.addEventListener("input", apply);

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".cp");
    if (!b) return;
    var url = new URL(b.getAttribute("data-href"), location.href).href;
    var done = function () { var was = b.textContent; b.textContent = "Copied"; setTimeout(function () { b.textContent = was; }, 1400); };
    if (navigator.clipboard) { navigator.clipboard.writeText(url).then(done, done); return; }
    var ta = document.createElement("textarea");
    ta.value = url; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (err) {}
    document.body.removeChild(ta); done();
  });
})();
</script>
</body></html>`,
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
