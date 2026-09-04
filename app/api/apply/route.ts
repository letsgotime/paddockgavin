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
 * Two messages go out. One to the person who applied, carrying the status link
 * that used to be shown once on screen and nowhere else, and one to the desk
 * that answers it.
 *
 * Nothing is mailed for a form a script filled in. Two checks: the honeypot
 * field, and Cloudflare Turnstile when TURNSTILE_SECRET is set on this
 * deployment. Without the secret the token is not checked, so the form keeps
 * working on a deployment that has not been given it yet, and the honeypot
 * still stands.
 */

const RANCH = "https://pistonpoweredranch.com"

/* pistonpoweredranch.com now receives: MX points at Google Workspace, and the
   role addresses are groups behind it. So replies go to the desk that owns the
   surface rather than to one person's gmail.

   Desk alerts are sent from noreply@ rather than from the role address, because
   a Google group receiving a message whose From is the group's own address can
   loop or be dropped. Different sender, same destination, no collision. */
const NOREPLY = "The Piston Powered Ranch <noreply@pistonpoweredranch.com>"

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
  phone?: string
  message?: string
  details?: Record<string, string>
  /** Minted in the browser and written on the row. The email carries it. */
  statusToken?: string
  /** Whether the browser's write to public.submissions succeeded. */
  recorded?: boolean
  turnstileToken?: string
  /** The honeypot. Anything in it and the form was filled by a script. */
  fax?: string
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

const TOKEN = /^[a-f0-9]{32,128}$/i

/** The one link every applicant keeps: their own status, no sign in. */
function statusBlocks(token: string): Block[] {
  if (!TOKEN.test(token)) return []
  return [
    { kind: "button", label: "Track your submission", href: `${RANCH}/status/?t=${token}` },
    { kind: "quiet", text: "That link is yours alone and needs no sign in. It shows where your submission is at any time, and it is the only copy, so keep this email." },
  ]
}

function applicantDoc(kind: Kind, name: string, org: string, token: string, d: Record<string, string>): RanchEmail {
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
        ...statusBlocks(token),
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
        ...statusBlocks(token),
        FACTS,
        {
          kind: "p",
          text: "Three hundred cars, every one of them chosen. Free for the public to attend. The day benefits Community Elementary School.",
        },
      ],
      signoff: "If you have a date you need an answer by, put it in your reply and we will work to it.",
    }
  }

  /* What they already told us is echoed back, so the "reply with three
     things" ask only names the things they left blank. */
  const told: string[] = []
  const missing: string[] = []
  const has = (k: string) => (d[k] || "").trim()
  if (has("offering") || has("message")) told.push(`Selling: ${has("offering") || has("message")}`)
  else missing.push("What you sell or serve")
  if (has("space_needed")) told.push(`Footprint: ${has("space_needed")}`)
  else missing.push("The footprint you need, including any vehicle or trailer")
  if (has("power")) told.push(`Power: ${has("power")}`)
  else missing.push("Whether you need power, and how much")

  return {
    preheader: cfg.preheader,
    eyebrow: "Stall enquiry",
    heading: "Received, and being read",
    blocks: [
      { kind: "lead", text: `Thank you for asking about a stall, ${first}.` },
      {
        kind: "p",
        text: "We take a limited number of vendors so that each one is worth walking to. Here is what we have from you:",
      },
      ...(told.length ? ([{ kind: "list", items: told }] as Block[]) : []),
      ...(missing.length
        ? ([
            { kind: "p", text: "Reply with the rest and we can move quickly:" },
            { kind: "list", items: missing },
          ] as Block[])
        : []),
      ...statusBlocks(token),
      { kind: "button", label: "Reserve the standard space", href: `${RANCH}/vendor/booth` },
      { kind: "quiet", text: "The 10 by 10 can be paid for now and is held the moment it clears. Larger footprints are quoted on what you are building." },
      FACTS,
    ],
    signoff: "Bekah Stallard will come back to you with what is available.",
  }
}

function deskDoc(kind: Kind, b: Body, name: string, org: string, reach: string, isEmail: boolean, recorded: boolean): RanchEmail {
  const cfg = CONFIG[kind]
  const d = b.details || {}
  const rows = [
    { label: "Name", value: name },
    ...(org ? [{ label: kind === "entry" ? "Car" : "Business", value: org }] : []),
    { label: "Contact", value: isEmail ? reach : `${reach} (not an address)` },
    ...(b.phone ? [{ label: "Phone", value: b.phone }] : []),
    { label: "Type", value: cfg.label },
    ...(d.category ? [{ label: "Category", value: d.category }] : []),
    ...(d.space_needed ? [{ label: "Footprint", value: d.space_needed }] : []),
    ...(d.power ? [{ label: "Power", value: d.power }] : []),
    ...(d.sponsorship_level ? [{ label: "Position", value: d.sponsorship_level }] : []),
    ...(d.website ? [{ label: "Website", value: d.website }] : []),
  ]
  return {
    preheader: `${cfg.label} from ${name}`,
    eyebrow: "New submission",
    heading: name,
    blocks: [
      { kind: "facts", rows },
      ...(b.message ? ([{ kind: "p", text: b.message }] as Block[]) : []),
      { kind: "button", label: "Open in HQ", href: `${RANCH}/console/#/ops` },
      {
        kind: "quiet",
        text: recorded
          ? "Saved to submissions. Decide it in HQ and the answer goes out from there."
          : "Not saved to submissions: the browser's write failed, so this email is the only record. Enter it by hand.",
      },
    ],
  }
}

/** Cloudflare's answer on a token, or null when this deployment has no secret. */
async function human(token: string | undefined, ip: string | null, action: string): Promise<{ ok: boolean; why?: string } | null> {
  const secret = process.env.TURNSTILE_SECRET
  if (!secret) return null
  if (!token) return { ok: false, why: "missing" }
  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip) body.set("remoteip", ip)
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })
    const j = (await res.json()) as { success?: boolean; action?: string; "error-codes"?: string[] }
    /* A secret Cloudflare rejects is our fault. Refusing every genuine vendor,
       sponsor and entrant because a key is wrong is far worse than letting a
       bot through, and the honeypot still stands either way. */
    if (!j.success && (j["error-codes"] || []).includes("invalid-input-secret")) {
      console.error("[apply] TURNSTILE_SECRET is not a key Cloudflare accepts; the check is open until it is fixed")
      return { ok: true }
    }
    if (!j.success) return { ok: false, why: (j["error-codes"] || []).join(",") || "failed" }
    if (j.action && j.action !== action) return { ok: false, why: "wrong-action" }
    return { ok: true }
  } catch {
    /* Cloudflare unreachable is not the applicant's fault. Let it through and
       say so in the log, rather than turn away a real person. */
    console.warn("[apply] turnstile siteverify unreachable")
    return { ok: true }
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
    if (!name || !reach) return NextResponse.json({ error: "Missing name or contact" }, { status: 400 })

    /* A script filled the field people cannot see. Say yes and send nothing. */
    if ((b.fax ?? "").trim()) {
      console.warn("[apply] honeypot tripped", { kind: b.kind })
      return NextResponse.json({ ok: true, mailed: 0 })
    }

    const surface = b.kind === "entry" ? "entry" : b.kind === "vendor-application" ? "vendor" : "sponsor"
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || null
    const check = await human(b.turnstileToken, ip, `apply-${surface}`)
    if (check && !check.ok) {
      console.warn("[apply] turnstile refused", { kind: b.kind, why: check.why })
      return NextResponse.json(
        { error: "verification", detail: "The human check did not pass. Tick the box again and resend." },
        { status: 400 },
      )
    }

    const key = process.env.RESEND_API_KEY
    if (!key) {
      console.log("[apply] No RESEND_API_KEY, would confirm:", { kind: b.kind, name, reach })
      return NextResponse.json({ ok: true, mailed: false })
    }

    // Only a contact that parses as an address can be written to.
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reach)
    const token = (b.statusToken ?? "").trim()
    const recorded = b.recorded === true

    const send = (payload: Record<string, unknown>) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

    const jobs: Promise<Response>[] = []

    if (isEmail) {
      const doc = applicantDoc(b.kind, name, org, recorded ? token : "", b.details || {})
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

    const desk = deskDoc(b.kind, b, name, org, reach, isEmail, recorded)
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
