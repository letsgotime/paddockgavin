import { NextResponse } from "next/server"

/**
 * Confirmations for the three Piston Powered Ranch intake forms.
 *
 * The submission itself is written to public.submissions by the browser before
 * this is called, on the anonymous Data API session the RSVP block already
 * uses. That order is deliberate. If this route fails the entry is still on
 * record and can be answered by hand, where a server side write that depended
 * on the mail succeeding would lose the entry outright.
 *
 * Two messages go out per submission: one to the person who applied, which
 * until now did not exist at all, and one to the desk that answers it.
 */

/* Sending from pistonpoweredranch.com works today: the domain is verified in
   Resend. Receiving does not yet, because the forwarding rules are not set up,
   so replies point at the inbox that is known to work. Change REPLY_TO to the
   role address once entries@ and sponsors@ forward. */
const REPLY_TO = "paddock20auto@gmail.com"
const DESK = "paddock20auto@gmail.com"

type Kind = "entry" | "sponsor-application" | "vendor-application"

interface Body {
  kind: Kind
  name?: string
  org?: string
  reach?: string
  message?: string
}

const CONFIG: Record<Kind, { from: string; label: string; subject: string; deskSubject: string }> = {
  entry: {
    from: "The Piston Powered Ranch <entries@pistonpoweredranch.com>",
    label: "Car entry",
    subject: "Your car is in the queue for 10 October",
    deskSubject: "Car entry",
  },
  "sponsor-application": {
    from: "The Piston Powered Ranch <sponsors@pistonpoweredranch.com>",
    label: "Partner enquiry",
    subject: "Your note reached the right desk",
    deskSubject: "Partner enquiry",
  },
  "vendor-application": {
    from: "The Piston Powered Ranch <vendors@pistonpoweredranch.com>",
    label: "Stall enquiry",
    subject: "Stall enquiry received for 10 October",
    deskSubject: "Stall enquiry",
  },
}

const FACTS = `Saturday 10 October 2026, 9am to 3pm<br />Rancho Jaramillo, Unionville, Tennessee`

function bodyFor(kind: Kind, name: string, org: string): string {
  const first = name.trim().split(/\s+/)[0] || "there"
  if (kind === "entry") {
    return `
      <p>Thank you for entering ${org ? esc(org) : "your car"}.</p>
      <p>The Piston Powered Ranch takes 300 cars and every one of them is chosen. A person reads
      your entry rather than a form deciding on a first come basis. That takes us a little time,
      and it is the reason the field looks the way it does.</p>
      <p>You will hear either way. If your car is in, that email carries your gate time, your bay
      and the make you are grouped with.</p>
      <p>Nothing is owed and nothing is due. Entry is free.</p>
      <p style="color:#8B93A7">${FACTS}</p>
      <p>Reply to this email if anything about the car changes, including if you need to pull out.
      Knowing early costs us nothing. Knowing on the day costs a space somebody else wanted.</p>`
  }
  if (kind === "sponsor-application") {
    return `
      <p>Thank you for asking about ${org ? esc(org) : "a partnership"} at the Piston Powered Ranch.</p>
      <p>Gavin Brooks and Bekah Stallard read every partner enquiry themselves. One of them will
      come back to you on what you actually asked about, rather than sending the same deck to
      everybody.</p>
      <p>What is settled so far: Saturday 10 October 2026, 9am to 3pm, at Rancho Jaramillo in
      Unionville, Tennessee. Three hundred cars, every one of them chosen. Free for the public to
      attend. The day benefits Community Elementary School.</p>
      <p>If you have a date you need an answer by, put it in your reply and we will work to it.</p>`
  }
  return `
    <p>Thank you for asking about a stall at the Piston Powered Ranch, ${esc(first)}.</p>
    <p>We take a limited number of vendors so that each one is worth walking to. If you have not
    already told us, reply with three things and we can move quickly: what you sell or serve, the
    footprint you need including any vehicle or trailer, and whether you need power.</p>
    <p>Bekah Stallard will come back to you with what is available.</p>
    <p style="color:#8B93A7">${FACTS}</p>`
}

function esc(s: string): string {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] as string)
}

function shell(inner: string): string {
  return `<!DOCTYPE html><html><body style="margin:0;background:#0A1523;font-family:Helvetica,Arial,sans-serif;padding:34px 20px">
<div style="max-width:600px;margin:0 auto">
  <div style="height:4px;background:#E5141A;margin-bottom:22px"></div>
  <p style="margin:0 0 20px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#8B93A7">The Piston Powered Ranch</p>
  <div style="font-size:16px;line-height:1.62;color:#DDE3EB">${inner}</div>
  <p style="margin:26px 0 0;padding-top:16px;border-top:1px solid #1E2A3A;font-size:12px;color:#6B7889">
    Rancho Jaramillo, Unionville, Tennessee. A PaddockGavin event.
  </p>
</div></body></html>`
}

export async function POST(req: Request) {
  try {
    const b: Body = await req.json()
    const cfg = CONFIG[b.kind]
    if (!cfg) return NextResponse.json({ error: "Unknown kind" }, { status: 400 })

    const name = (b.name ?? "").trim()
    const org = (b.org ?? "").trim()
    const reach = (b.reach ?? "").trim()
    const message = (b.message ?? "").trim()
    if (!name || !reach) return NextResponse.json({ error: "Missing name or contact" }, { status: 400 })

    const key = process.env.RESEND_API_KEY
    if (!key) {
      console.log("[apply] No RESEND_API_KEY, would confirm:", { kind: b.kind, name, reach })
      return NextResponse.json({ ok: true, mailed: false })
    }

    // Only a contact that parses as an address can be written to.
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reach)

    const send = (payload: Record<string, unknown>) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

    const jobs: Promise<Response>[] = []

    if (isEmail) {
      jobs.push(
        send({
          from: cfg.from,
          to: [reach],
          reply_to: REPLY_TO,
          subject: cfg.subject,
          html: shell(bodyFor(b.kind, name, org)),
        }),
      )
    }

    jobs.push(
      send({
        from: cfg.from,
        to: [DESK],
        reply_to: isEmail ? reach : REPLY_TO,
        subject: `${cfg.deskSubject}: ${name}${org ? `, ${org}` : ""}`,
        html: shell(
          `<p><b>${esc(cfg.label)}</b></p>
           <p>Name: ${esc(name)}<br />
           ${org ? `Detail: ${esc(org)}<br />` : ""}
           Contact: ${esc(reach)}${isEmail ? "" : " (not an address, reply by hand)"}</p>
           ${message ? `<p>${esc(message).replace(/\n/g, "<br />")}</p>` : ""}
           <p style="color:#8B93A7">Saved to submissions. Work it in the console.</p>`,
        ),
      }),
    )

    // The applicant's confirmation must not be held up by the desk alert, and
    // neither failing should tell the visitor their entry did not land: it did,
    // the browser wrote it before calling this.
    const results = await Promise.allSettled(jobs)
    const failed = results.filter((r) => r.status === "rejected" || !r.value.ok).length
    if (failed) console.error("[apply] %d of %d messages failed", failed, results.length)

    return NextResponse.json({ ok: true, mailed: results.length - failed })
  } catch (err) {
    console.error("[apply]", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
