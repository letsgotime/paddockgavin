import { NextResponse } from "next/server"
import { renderRanchEmail, renderRanchText, type Block, type RanchEmail } from "@/lib/email/ranch"

/**
 * Confirmations for the three Piston Powered Ranch intake forms.
 *
 * The submission is written to public.submissions by the browser before this is
 * called. That order is deliberate: if this route fails the entry is still on
 * record and answerable by hand, where a write that depended on the mail
 * succeeding would lose it outright.
 *
 * Two messages go out. One to the person who applied, which until recently did
 * not exist at all, and one to the desk that answers it.
 */

/* pistonpoweredranch.com now receives: MX points at Google Workspace, and the
   role addresses are groups behind it. So replies go to the desk that owns the
   surface rather than to one person's gmail.

   Desk alerts are sent from noreply@ rather than from the role address, because
   a Google group receiving a message whose From is the group's own address can
   loop or be dropped. Different sender, same destination, no collision. */
const NOREPLY = "The Piston Powered Ranch <noreply@pistonpoweredranch.com>"

/* The role addresses are live: verified by a send from noreply@, which Google
   treats as an external sender because it is a Resend identity rather than a
   Workspace user. That is the exact path a real alert takes, and it delivered
   to all four on 30 August. */
const DESK: Record<Kind, string> = {
  entry: "entries@pistonpoweredranch.com",
  "sponsor-application": "sponsors@pistonpoweredranch.com",
  "vendor-application": "vendors@pistonpoweredranch.com",
}

type Kind = "entry" | "sponsor-application" | "vendor-application"

interface Body {
  kind: Kind
  name?: string
  org?: string
  reach?: string
  message?: string
}

const CONFIG: Record<Kind, { from: string; label: string; subject: string; preheader: string; deskSubject: string }> = {
  entry: {
    from: "The Piston Powered Ranch <entries@pistonpoweredranch.com>",
    label: "Car entry",
    subject: "Your car is in the queue for 10 October",
    preheader: "We read every entry ourselves. Here is what happens next.",
    deskSubject: "Car entry",
  },
  "sponsor-application": {
    from: "The Piston Powered Ranch <sponsors@pistonpoweredranch.com>",
    label: "Partner enquiry",
    subject: "Your note reached the right desk",
    preheader: "Who is reading it, and when you will hear back.",
    deskSubject: "Partner enquiry",
  },
  "vendor-application": {
    from: "The Piston Powered Ranch <vendors@pistonpoweredranch.com>",
    label: "Stall enquiry",
    subject: "Stall enquiry received for 10 October",
    preheader: "Three things and we can move quickly.",
    deskSubject: "Stall enquiry",
  },
}

const FACTS: Block = {
  kind: "facts",
  rows: [
    { label: "When", value: "Saturday 10 October 2026" },
    { label: "Hours", value: "9am to 3pm" },
    { label: "Where", value: "Rancho Jaramillo, Unionville, Tennessee" },
    { label: "Entry", value: "Free, to show and to watch" },
  ],
}

function applicantDoc(kind: Kind, name: string, org: string): RanchEmail {
  const cfg = CONFIG[kind]
  const first = name.trim().split(/\s+/)[0] || "there"

  if (kind === "entry") {
    return {
      preheader: cfg.preheader,
      eyebrow: "Entry received",
      heading: "Your car is in the queue",
      blocks: [
        { kind: "lead", text: `Thank you for entering ${org || "your car"}.` },
        {
          kind: "p",
          text: "The Piston Powered Ranch takes 300 cars and every one of them is chosen. A person reads your entry rather than a form deciding on a first come basis. That takes us a little time, and it is the reason the field looks the way it does.",
        },
        {
          kind: "p",
          text: "You will hear either way. If your car is in, that email carries your gate time, your bay and the make you are grouped with.",
        },
        FACTS,
        { kind: "quiet", text: "Nothing is owed and nothing is due." },
      ],
      signoff:
        "Reply to this email if anything about the car changes, including if you need to pull out. Knowing early costs us nothing. Knowing on the day costs a space somebody else wanted.",
    }
  }

  if (kind === "sponsor-application") {
    return {
      preheader: cfg.preheader,
      eyebrow: "Partner enquiry",
      heading: "Your note reached the right desk",
      blocks: [
        { kind: "lead", text: `Thank you for asking about ${org || "a partnership"} at the Piston Powered Ranch.` },
        {
          kind: "p",
          text: "Gavin Brooks and Bekah Stallard read every partner enquiry themselves. One of them will come back to you on what you actually asked about, rather than sending the same deck to everybody.",
        },
        FACTS,
        {
          kind: "p",
          text: "Three hundred cars, every one of them chosen. Free for the public to attend. The day benefits Community Elementary School.",
        },
      ],
      signoff: "If you have a date you need an answer by, put it in your reply and we will work to it.",
    }
  }

  return {
    preheader: cfg.preheader,
    eyebrow: "Stall enquiry",
    heading: "Received, and being read",
    blocks: [
      { kind: "lead", text: `Thank you for asking about a stall, ${first}.` },
      {
        kind: "p",
        text: "We take a limited number of vendors so that each one is worth walking to. If you have not already told us, reply with three things and we can move quickly:",
      },
      {
        kind: "list",
        items: [
          "What you sell or serve",
          "The footprint you need, including any vehicle or trailer",
          "Whether you need power, and how much",
        ],
      },
      FACTS,
    ],
    signoff: "Bekah Stallard will come back to you with what is available.",
  }
}

function deskDoc(kind: Kind, name: string, org: string, reach: string, message: string, isEmail: boolean): RanchEmail {
  const cfg = CONFIG[kind]
  const rows = [
    { label: "Name", value: name },
    ...(org ? [{ label: "Detail", value: org }] : []),
    { label: "Contact", value: isEmail ? reach : `${reach} (not an address)` },
    { label: "Type", value: cfg.label },
  ]
  return {
    preheader: `${cfg.label} from ${name}`,
    eyebrow: "New submission",
    heading: name,
    blocks: [
      { kind: "facts", rows },
      ...(message ? ([{ kind: "p", text: message }] as Block[]) : []),
      { kind: "quiet", text: "Saved to submissions. Work it in the console." },
    ],
  }
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
      const doc = applicantDoc(b.kind, name, org)
      jobs.push(
        send({
          from: cfg.from,
          to: [reach],
          reply_to: DESK[b.kind],
          subject: cfg.subject,
          html: renderRanchEmail(doc),
          text: renderRanchText(doc),
        }),
      )
    }

    const desk = deskDoc(b.kind, name, org, reach, message, isEmail)
    jobs.push(
      send({
        from: NOREPLY,
        to: [DESK[b.kind]],
        reply_to: isEmail ? reach : DESK[b.kind],
        subject: `${cfg.deskSubject}: ${name}${org ? `, ${org}` : ""}`,
        html: renderRanchEmail(desk),
        text: renderRanchText(desk),
      }),
    )

    /* Neither message may hold up the other, and neither failing should tell the
       visitor their entry did not land: it did, the browser wrote it first. */
    const results = await Promise.allSettled(jobs)
    const failed = results.filter((r) => r.status === "rejected" || !r.value.ok).length
    if (failed) console.error("[apply] %d of %d messages failed", failed, results.length)

    return NextResponse.json({ ok: true, mailed: results.length - failed })
  } catch (err) {
    console.error("[apply]", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
