"use client"

import { useEffect, useRef, useState } from "react"
import { upload } from "@vercel/blob/client"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { db } from "@/lib/crm/client"

/* Copy ran through RAIL Redline, WARM / WEB PAGE / US, zero tells, with an
   explicit instruction not to introduce facts absent from the draft. */

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const CLIP = "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)"
const CLIP_SM = "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)"

/* The public face. Links in what the person keeps (the status link, the
   booth page) are written against this rather than against whichever door
   they happened to come in by, so a link from paddockgavin.com and a link
   from pistonpoweredranch.com are the same link. */
const RANCH = "https://pistonpoweredranch.com"

/* The same widget the team tools use. The key is public by design; the
   secret that checks it lives on the server. */
const TURNSTILE_SITEKEY = "0x4AAAAAAEkdaaU0WCZzdgGE"

/* Mirrors public.vendor_categories, which the anonymous form cannot read.
   If that table changes, change this. */
const VENDOR_CATEGORIES = [
  "Automotive lifestyle & apparel",
  "Collector sneakers",
  "Detailing & care products",
  "Timepieces & fine jewelry",
  "Artisan & ranch goods",
  "Local food & beverage (non-competing with the BBQ)",
  "Real estate & luxury lifestyle services",
  "Car clubs & registries (non-selling)",
]
/* The four footprints the booth page sells or quotes, plus the two honest
   answers a vendor gives before they have measured anything. */
const FOOTPRINTS = ["10 by 10", "10 by 20", "20 by 20", "40 by 40", "Food truck or trailer", "Not sure yet"]
const POWER = [
  "None, we run on batteries or nothing",
  "Light draw, under 1kW, lights and a card reader",
  "Cooking or refrigeration, tell us the load",
]
const SPONSOR_LEVELS = ["Presenting Sponsor", "Title Sponsor", "Secondary Sponsor", "Supporting Sponsor", "Community Partner", "Not sure yet"]

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Photographs, and what the desk needs to judge a car.
 *
 * Five is the floor because a car cannot be approved or declined from one
 * angle, and the person deciding is looking at a field of three hundred. Fifty
 * is the ceiling the private store and the review sheet were built for. Video
 * is capped at five minutes each, measured in the browser before a byte is
 * sent, because a phone will happily hand over an hour.
 *
 * The same numbers are enforced on the server in app/api/upload/route.ts by
 * size and type; duration is the one thing only the browser can measure.
 */
const MIN_PHOTOS = 5
const MAX_PHOTOS = 50
const MAX_VIDEOS = 3
const MAX_VIDEO_SEC = 300
/** A logo, for a vendor or a sponsor. One file, and the vector formats count. */
const MAX_LOGOS = 3

type Shot = { kind: string; url: string; pathname: string; name: string; size: number; type: string; seconds?: number }
type Manifest = { photo: Shot[]; video: Shot[]; voice: Shot[]; doc: Shot[] }
const EMPTY_MEDIA: Manifest = { photo: [], video: [], voice: [], doc: [] }

/**
 * One id per draft, kept for the tab's lifetime.
 *
 * Every file this person uploads is namespaced under it, and the server checks
 * the path against it before it will mint a token, so one submitter's files
 * cannot be written into anybody else's folder. Shape matches what that route
 * accepts: 8 to 64 characters of letters, digits, dash or underscore.
 */
function draftId(): string {
  const key = "ppr_draft_id"
  const made = "d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  try {
    const held = sessionStorage.getItem(key)
    if (held) return held
    sessionStorage.setItem(key, made)
  } catch {
    /* private mode, or storage refused. The generated one still works. */
  }
  return made
}

/** How long a clip runs, before it is uploaded. 0 when the browser cannot say. */
function seconds(file: File): Promise<number> {
  return new Promise((resolve) => {
    const el = document.createElement(file.type.startsWith("audio") ? "audio" : "video")
    const url = URL.createObjectURL(file)
    const done = (d: number) => {
      URL.revokeObjectURL(url)
      resolve(d)
    }
    el.preload = "metadata"
    el.onloadedmetadata = () => done(Number.isFinite(el.duration) ? el.duration : 0)
    el.onerror = () => done(0)
    el.src = url
  })
}

const mb = (n: number) => (n / (1024 * 1024)).toFixed(n < 10 * 1024 * 1024 ? 1 : 0) + " MB"

/* submissions.type is constrained to vehicle, vendor or sponsor. The form
   kinds are named for the page they sit on, so they have to be mapped. */
const DB_TYPE: Record<string, string> = {
  entry: "vehicle",
  "sponsor-application": "sponsor",
  "vendor-application": "vendor",
}
const DESK: Record<string, string> = {
  entry: "entries@pistonpoweredranch.com",
  "sponsor-application": "sponsors@pistonpoweredranch.com",
  "vendor-application": "vendors@pistonpoweredranch.com",
}

export type ApplyProps = {
  kicker: string
  title: string
  lede: string
  body: string[]
  img: string
  bandImg: string
  closeImg: string
  focal?: string
  bandFocal?: string
  tone: string
  asks: { t: string; b: string }[]
  asksHead: string
  cta: { label: string; href: string }
  note?: string
  closeLine: string
  form?: { kind: string; head: string; orgLabel: string; askLabel: string }
}

type Status = "idle" | "sending" | "sent" | "error"

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
    }
  }
}

export function ApplyPage(p: ApplyProps) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-r]"))
    if (reduce) {
      els.forEach((e) => e.classList.add("in"))
      return
    }
    const io = new IntersectionObserver(
      (en) =>
        en.forEach((x) => {
          if (x.isIntersecting) {
            x.target.classList.add("in")
            io.unobserve(x.target)
          }
        }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    )
    els.forEach((e) => io.observe(e))
    /* Whatever the observer does, nothing stays invisible. A form that never
       appears because a callback never fired is worse than a fade that
       happens off screen. */
    const fallback = window.setTimeout(() => els.forEach((e) => e.classList.add("in")), 1600)
    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <>
      <SiteNav active="events" />
      <style>{`
        @keyframes pgKen{from{transform:scale(1.02)}to{transform:scale(1.13) translateY(-1.4%)}}
        [data-r]{opacity:0;transform:translate3d(0,26px,0)}
        [data-r].in{opacity:1;transform:none;transition:opacity .85s cubic-bezier(.16,.84,.32,1) var(--d,0ms),transform .85s cubic-bezier(.16,.84,.32,1) var(--d,0ms)}
        .pgKen{animation:pgKen 30s ease-in-out infinite alternate;transform-origin:center}
        .pgBand{position:sticky;top:0;height:100svh;overflow:hidden}
        .pgTile{transition:transform .5s cubic-bezier(.16,.84,.32,1),border-color .3s}
        @media (hover:hover){.pgTile:hover{transform:translateY(-4px);border-color:rgba(255,255,255,0.82)}}
        .pgGo{transition:transform .3s cubic-bezier(.16,.84,.32,1)}
        @media (hover:hover){.pgGo:hover{transform:translateY(-2px)}}
        .pgSel option{color:#0A1523}
        @media (prefers-reduced-motion:reduce){
          [data-r],[data-r].in{opacity:1!important;transform:none!important;transition:none!important}
          .pgKen{animation:none!important}
          .pgTile,.pgGo{transition:none!important}
        }
      `}</style>

      <main style={{ background: "#0A1523" }}>
        {/* Sized so the headline is on the first screen of a phone. At 88svh
            the hero was 714px tall on an iPhone and the headline sat on the
            bottom edge under the mark and the photograph. */}
        <section style={{ position: "relative", minHeight: "clamp(560px,78svh,800px)", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
          <Image className="pgKen" src={p.img} alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: p.focal || "center 55%" }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.97) 8%,rgba(10,21,35,.4) 58%,rgba(10,21,35,.6) 100%)" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px) clamp(40px,8vh,96px)", display: "flex", flexDirection: "column", gap: 16 }}>
            <span data-r="" style={{ fontFamily: MONO, fontSize: "clamp(10.5px,1.3vw,12px)", letterSpacing: ".26em", textTransform: "uppercase", color: p.tone }}>
              {p.kicker} &middot; October 10, 2026
            </span>
            <h1 data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(32px,7vw,72px)", lineHeight: 0.95, letterSpacing: "-.03em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "16ch", ["--d" as string]: "90ms" }}>
              {p.title}
            </h1>
            <p data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(16px,1.9vw,20px)", lineHeight: 1.5, color: "#E7ECF3", maxWidth: "48ch", ["--d" as string]: "170ms" }}>
              {p.lede}
            </p>
          </div>
        </section>

        <section style={{ position: "relative" }}>
          <div className="pgBand" aria-hidden="true">
            <Image src={p.bandImg} alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: p.bandFocal || "center 50%" }} />
            <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(10,21,35,.88) 0%,rgba(10,21,35,.42) 34%,rgba(10,21,35,.95) 100%)" }} />
          </div>
          <div style={{ position: "relative", marginTop: "-56svh", paddingBottom: "clamp(36px,8vh,84px)" }}>
            <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px)" }}>
              <div
                data-r=""
                className="pg-e1" style={{
                  background: "rgba(10,21,35,.82)",
                  borderTop: `3px solid ${p.tone}`,
                  boxShadow: "0 30px 90px rgba(0,0,0,.5)",
                  clipPath: CLIP,
                  padding: "clamp(22px,4vw,44px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16
                }}
              >
                {p.body.map((b, i) => (
                  <p key={b.slice(0, 22)} style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(15.5px,1.8vw,19px)", lineHeight: 1.6, color: i === 0 ? "#E7ECF3" : "#C9D1DB", maxWidth: "58ch" }}>
                    {b}
                  </p>
                ))}
                {p.note && (
                  <p style={{ margin: "4px 0 0", fontFamily: ARCHIVO, fontSize: "clamp(15px,1.6vw,17px)", lineHeight: 1.6, color: "#B4B6B2", maxWidth: "54ch", borderLeft: `2px solid ${p.tone}`, paddingLeft: 16 }}>
                    {p.note}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(8px,2vh,20px) clamp(16px,5vw,40px) clamp(40px,9vh,96px)", display: "flex", flexDirection: "column", gap: 16 }}>
          <span data-r="" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: p.tone }}>
            {p.asksHead}
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(236px,1fr))", gap: 12 }}>
            {p.asks.map((a, i) => (
              <div
                key={a.t}
                data-r=""
                className="pgTile"
                style={{ border: "1px solid rgba(255,255,255,.12)", background: "rgba(21,37,56,.55)", clipPath: CLIP_SM, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 7, ["--d" as string]: `${i * 80}ms` }}
              >
                <span style={{ fontFamily: ARCHIVO, fontWeight: 900, fontSize: 15.5, textTransform: "uppercase", letterSpacing: "-.008em", color: "#FFFFFF" }}>{a.t}</span>
                <span style={{ fontFamily: ARCHIVO, fontSize: 14.5, lineHeight: 1.5, color: "#C4CCD6" }}>{a.b}</span>
              </div>
            ))}
          </div>
        </section>

        {p.form && <ApplyForm tone={p.tone} form={p.form} />}

        <section style={{ position: "relative" }}>
          <div className="pgBand" aria-hidden="true">
            <Image src={p.closeImg} alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 50%" }} />
            <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(10,21,35,.86) 0%,rgba(10,21,35,.46) 30%,rgba(10,21,35,.9) 78%,rgba(10,21,35,.99) 100%)" }} />
          </div>
          <div style={{ position: "relative", marginTop: "-66svh", paddingBottom: "clamp(56px,13vh,140px)" }}>
            <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px)", display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" }}>
              <p data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(22px,3.6vw,38px)", lineHeight: 1.06, letterSpacing: "-.024em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "20ch" }}>
                {p.closeLine}
              </p>
              <div data-r="" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", ["--d" as string]: "110ms" }}>
                <a
                  className="pgGo"
                  href={p.cta.href}
                  target={p.cta.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener"
                  style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: p.tone, color: "#101010", padding: "16px 28px", clipPath: CLIP_SM, textDecoration: "none" }}
                >
                  {p.cta.label}
                </a>
                <Link href="/events/pistonpoweredranch" style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none" }}>
                  Back to the event
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}

type Fields = {
  name: string
  org: string
  reach: string
  phone: string
  message: string
  category: string
  footprint: string
  power: string
  website: string
  level: string
  /* The honeypot. Hidden from people, filled in by scripts. */
  fax: string
}

const EMPTY: Fields = { name: "", org: "", reach: "", phone: "", message: "", category: "", footprint: "", power: POWER[0], website: "", level: "", fax: "" }

/* 48 hex characters. The status page and the portal both read this back, and
   both check for at least 32 hex characters, so the shape is not negotiable. */
function mintToken(): string {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
}

function ApplyForm({ tone, form }: { tone: string; form: NonNullable<ApplyProps["form"]> }) {
  const surface = form.kind === "entry" ? "entry" : form.kind === "vendor-application" ? "vendor" : "sponsor"
  const [f, setF] = useState<Fields>(EMPTY)
  const [status, setStatus] = useState<Status>("idle")
  const [why, setWhy] = useState("")
  const [token, setToken] = useState("")
  const [copied, setCopied] = useState(false)
  const [media, setMedia] = useState<Manifest>(EMPTY_MEDIA)
  const [busy, setBusy] = useState("")
  const [mediaNote, setMediaNote] = useState("")
  const draft = useRef<string>("")
  const sessionRef = useRef<{ value: string | null; until: number } | null>(null)
  const [ts, setTs] = useState("")
  const [tsState, setTsState] = useState<"loading" | "ready" | "solved" | "failed">("loading")
  const tsRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  const up = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((x) => ({ ...x, [k]: e.target.value }))

  /* The booth page sends the larger footprints here with ?size=, because a
     quote is a conversation rather than a checkout. Land it in the field. */
  useEffect(() => {
    try {
      const s = new URLSearchParams(location.search).get("size")
      if (!s) return
      setF((x) => (FOOTPRINTS.includes(s) ? { ...x, footprint: s } : { ...x, message: x.message || `Footprint: ${s}` }))
    } catch {
      /* no query string to read */
    }
  }, [])

  /* The human check. Rendered explicitly so the token lands in state rather
     than in a hidden field a script could set. If the widget cannot load at
     all the form still sends, and the server decides what to do with a
     submission that carries no token. */
  useEffect(() => {
    let gone = false
    const render = () => {
      if (gone || !tsRef.current || !window.turnstile) return
      try {
        window.turnstile.render(tsRef.current, {
          sitekey: TURNSTILE_SITEKEY,
          theme: "dark",
          size: "flexible",
          action: `apply-${surface}`,
          callback: (t: string) => {
            setTs(t)
            setTsState("solved")
          },
          "expired-callback": () => {
            setTs("")
            setTsState("ready")
          },
          "error-callback": () => {
            setTs("")
            setTsState("failed")
          },
        })
        setTsState((s) => (s === "solved" ? s : "ready"))
      } catch {
        setTsState("failed")
      }
    }
    if (window.turnstile) render()
    else {
      const s = document.createElement("script")
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      s.async = true
      s.onload = render
      s.onerror = () => setTsState("failed")
      document.head.appendChild(s)
    }
    return () => {
      gone = true
    }
  }, [surface])

  /* One human check buys a window of uploads rather than one file. A car
     entry is fifty photographs and a video: verifying each would fail on the
     second with a duplicate token, which is the exact fault that made the
     console refuse everything it was handed. */
  async function uploadSession(): Promise<string | null> {
    const held = sessionRef.current
    if (held && held.until > Date.now()) return held.value
    if (!draft.current) draft.current = draftId()
    const res = await fetch("/api/upload-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: ts || null, draftId: draft.current, submissionType: DB_TYPE[form.kind] ?? "vehicle" }),
    })
    const j = (await res.json().catch(() => ({}))) as { enforced?: boolean; session?: string; expiresIn?: number; error?: string }
    if (!res.ok) throw new Error(j.error || "The human check did not pass. Tick the box and try again.")
    if (!j.enforced) {
      sessionRef.current = { value: null, until: Date.now() + 25 * 60 * 1000 }
      return null
    }
    sessionRef.current = { value: j.session ?? null, until: Date.now() + (j.expiresIn ?? 0) - 60000 }
    return sessionRef.current.value
  }

  async function addFiles(kind: "photo" | "video" | "doc", chosen: FileList | null) {
    const files = Array.from(chosen || [])
    if (!files.length) return
    setMediaNote("")
    const cap = kind === "photo" ? MAX_PHOTOS : kind === "video" ? MAX_VIDEOS : MAX_LOGOS
    const room = cap - media[kind].length
    if (room <= 0) {
      setMediaNote(`That is the limit: ${cap}.`)
      return
    }
    const take = files.slice(0, room)
    const skipped = files.length - take.length

    if (!draft.current) draft.current = draftId()
    const submissionType = DB_TYPE[form.kind] ?? "vehicle"

    for (let i = 0; i < take.length; i++) {
      const file = take[i]
      setBusy(`${kind === "photo" ? "Photograph" : kind === "video" ? "Video" : "File"} ${i + 1} of ${take.length}`)
      try {
        let length: number | undefined
        if (kind === "video") {
          length = await seconds(file)
          if (length > MAX_VIDEO_SEC + 2) {
            setMediaNote(`${file.name} runs ${Math.round(length / 60)} minutes. Five is the limit, so trim it and try again.`)
            continue
          }
        }
        const session = await uploadSession()
        const safe = String(file.name || "file").replace(/[^\w.\-]+/g, "_").slice(-80)
        const path = `submissions/${submissionType}/${draft.current}/${kind}/${safe}`
        const done = await upload(path, file, {
          access: "private",
          handleUploadUrl: "/api/upload",
          multipart: file.size > 20 * 1024 * 1024,
          clientPayload: JSON.stringify({ kind, submissionType, draftId: draft.current, session }),
          onUploadProgress: (p) => setBusy(`${kind === "photo" ? "Photograph" : "Video"} ${i + 1} of ${take.length}, ${Math.round(p.percentage)}%`),
        })
        const shot: Shot = { kind, url: done.url, pathname: done.pathname, name: file.name, size: file.size, type: file.type || "", ...(length ? { seconds: Math.round(length) } : {}) }
        if (kind === "photo") LOCAL.set(done.pathname, file)
        setMedia((m) => ({ ...m, [kind]: [...m[kind], shot] }))
      } catch (err) {
        const why = err instanceof Error ? err.message : "That file did not go up."
        setMediaNote(`${file.name}: ${why}`)
        break
      }
    }
    setBusy("")
    if (skipped > 0) setMediaNote(`Added what fits. ${skipped} more than the limit of ${cap} were left out.`)
  }

  const drop = (kind: keyof Manifest, path: string) =>
    setMedia((m) => ({ ...m, [kind]: m[kind].filter((s) => s.pathname !== path) }))

  const send = async () => {
    if (status === "sending") return
    setWhy("")
    if (!f.name.trim()) {
      setStatus("error")
      setWhy("We need your name.")
      nameRef.current?.focus()
      return
    }
    const reach = f.reach.trim()
    if (!EMAIL.test(reach)) {
      setStatus("error")
      setWhy("We need an email address. A phone number alone means we cannot send you a decision.")
      return
    }
    if (surface === "entry" && media.photo.length < MIN_PHOTOS) {
      setStatus("error")
      setWhy(
        media.photo.length === 0
          ? `Add ${MIN_PHOTOS} photographs of the car. It cannot be judged without them.`
          : `${media.photo.length} of ${MIN_PHOTOS} photographs so far. ${MIN_PHOTOS - media.photo.length} more and it can go.`,
      )
      return
    }
    if (busy) {
      setStatus("error")
      setWhy("One moment, a file is still going up.")
      return
    }
    if (surface === "vendor" && !f.category) {
      setStatus("error")
      setWhy("Pick the category closest to what you sell.")
      return
    }
    /* No client side gate on the human check. The widget can draw and still
       never produce a token, which is what happened in a browser that would
       not paint its box, and a person was refused for it while the server
       was not even enforcing the check. The server decides: when it is
       enforcing and the token is missing it answers "verification", and that
       is the one moment the person is asked to tick the box. */
    setStatus("sending")

    const name = f.name.trim()
    const org = f.org.trim()
    const message = f.message.trim()
    const statusToken = mintToken()

    /* One row, in the shape HQ already reads. The review sheet looks for
       business, category, offering, space_needed, power and website on a
       vendor, and company, sponsorship_level, goals and website on a
       sponsor. org is kept as well because the roster and the journeys page
       read it, and vehicle because the field roster does. */
    /* The manifest HQ's review sheet already reads: details.media, with the
       four buckets, each file named by its path in the private store. The
       sheet signs those paths through /api/media, so a staff address sees the
       photographs and a URL on its own shows nobody anything. */
    const anyMedia = media.photo.length + media.video.length + media.doc.length > 0
    const common = { org, message, reach, page: "piston-powered-ranch", ...(anyMedia ? { media } : {}) }
    const details =
      surface === "vendor"
        ? { ...common, business: org, category: f.category, offering: message, space_needed: f.footprint, power: f.power, website: f.website.trim() }
        : surface === "sponsor"
          ? { ...common, company: org, sponsorship_level: f.level, goals: message, website: f.website.trim() }
          : { ...common, vehicle: org }

    /* Recorded first, then mailed. If the mail fails the entry is still on
       record and answerable by hand; if the record fails the desk email still
       carries everything, including the token. */
    let recorded = false
    try {
      const client = db()
      if (client) {
        const saved = await client.from("submissions").insert([
          {
            type: DB_TYPE[form.kind] ?? "vehicle",
            applicant_name: name,
            email: reach.toLowerCase(),
            phone: f.phone.trim() || null,
            status: "pending",
            status_token: statusToken,
            details,
          },
        ])
        recorded = !saved?.error
        if (saved?.error) console.warn("[apply] not recorded:", saved.error.message)
      }
    } catch (err) {
      console.warn("[apply] not recorded:", err)
    }

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: form.kind,
          name,
          org,
          reach,
          phone: f.phone.trim(),
          message,
          details,
          statusToken,
          recorded,
          turnstileToken: ts,
          fax: f.fax,
        }),
      })
      if (res.ok) {
        setToken(statusToken)
        setStatus("sent")
        return
      }
      const j = (await res.json().catch(() => ({}))) as { error?: string; detail?: string }
      setStatus("error")
      setWhy(j.detail || `That did not send. Try again, or write to ${DESK[form.kind]}.`)
      if (j.error === "verification") {
        setTs("")
        try {
          window.turnstile?.reset()
        } catch {
          /* the widget will re-render on its own */
        }
      }
    } catch {
      setStatus("error")
      setWhy(`That did not send. Check your connection, or write to ${DESK[form.kind]}.`)
    }
  }

  const input: React.CSSProperties = {
    background: "rgba(10,21,35,.6)",
    border: "1px solid rgba(255,255,255,.22)",
    color: "#EDF1F6",
    fontFamily: ARCHIVO,
    fontSize: 16,
    padding: "14px 16px",
    clipPath: CLIP_SM,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
  }
  const label: React.CSSProperties = { fontFamily: MONO, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#8b95a3" }
  const field = (l: string, el: React.ReactNode) => (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={label}>{l}</span>
      {el}
    </label>
  )
  const select = (k: keyof Fields, opts: string[], blank?: string) => (
    <select className="pgSel" style={{ ...input, appearance: "auto" }} value={f[k]} onChange={up(k)}>
      {blank !== undefined && <option value="">{blank}</option>}
      {opts.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )

  const statusUrl = token ? `${RANCH}/status/?t=${token}` : ""
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(statusUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      /* the field below is selectable */
    }
  }

  return (
    <section id="apply" style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px) clamp(40px,9vh,96px)", scrollMarginTop: 110 }}>
      <div
        data-r=""
        style={{
          border: "1px solid rgba(255,255,255,.13)",
          borderTop: `3px solid ${tone}`,
          background: "rgba(21,37,56,.55)",
          clipPath: CLIP,
          padding: "clamp(22px,4vw,40px)",
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(20px,3vw,36px)",
        }}
      >
        <div style={{ flex: "4 1 260px", minWidth: 0 }}>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(22px,3.2vw,32px)", lineHeight: 1.05, letterSpacing: "-.022em", textTransform: "uppercase", color: "#FFFFFF" }}>
            {form.head}
          </h2>
        </div>
        <div style={{ flex: "5 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {status === "sent" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 17, lineHeight: 1.5, color: "#00D2BE" }}>
                Received. A confirmation is on its way to {f.reach.trim()}, and you will hear from us either way.
              </p>
              {statusUrl && (
                <div style={{ display: "grid", gap: 6 }}>
                  <span style={label}>Your status link, no sign in needed</span>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input readOnly value={statusUrl} onFocus={(e) => e.currentTarget.select()} style={{ ...input, flex: "1 1 240px", fontSize: 14 }} />
                    <button type="button" onClick={copy} className="pgGo" style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 13, letterSpacing: ".05em", textTransform: "uppercase", background: "transparent", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.3)", padding: "12px 18px", cursor: "pointer", clipPath: CLIP_SM }}>
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <span style={{ fontFamily: ARCHIVO, fontSize: 13.5, color: "#8b95a3" }}>The same link is in the confirmation email.</span>
                </div>
              )}
              {surface === "vendor" && (
                <a className="pgGo" href="/events/pistonpoweredranch/vendor/booth" style={{ alignSelf: "flex-start", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".05em", textTransform: "uppercase", background: tone, color: "#101010", padding: "14px 22px", clipPath: CLIP_SM, textDecoration: "none" }}>
                  Reserve the standard space now
                </a>
              )}
            </div>
          ) : (
            <>
              <input ref={nameRef} style={input} placeholder="Your name" autoComplete="name" value={f.name} onChange={up("name")} />
              <input style={input} placeholder={form.orgLabel} autoComplete="organization" value={f.org} onChange={up("org")} />
              <input style={input} type="email" inputMode="email" autoComplete="email"
                placeholder="Email, so we can write back" value={f.reach} onChange={up("reach")} />
              <input style={input} type="tel" inputMode="tel" autoComplete="tel"
                placeholder="Phone, optional" value={f.phone} onChange={up("phone")} />

              {surface === "vendor" && (
                <>
                  {field("What you sell, closest category", select("category", VENDOR_CATEGORIES, "Pick one"))}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
                    {field("Footprint", select("footprint", FOOTPRINTS, "Not sure yet"))}
                    {field("Power", select("power", POWER))}
                  </div>
                  <input style={input} type="url" inputMode="url" placeholder="Website or Instagram, optional" value={f.website} onChange={up("website")} />
                </>
              )}
              {surface === "sponsor" && (
                <>
                  {field("Position you have in mind", select("level", SPONSOR_LEVELS, "Not sure yet"))}
                  <input style={input} type="url" inputMode="url" placeholder="Website, optional" value={f.website} onChange={up("website")} />
                </>
              )}

              <textarea style={{ ...input, minHeight: 104, resize: "vertical" }} placeholder={form.askLabel} value={f.message} onChange={up("message")} />

              {surface === "entry" ? (
                <Media
                  tone={tone}
                  busy={busy}
                  note={mediaNote}
                  photos={media.photo}
                  videos={media.video}
                  onAdd={addFiles}
                  onDrop={drop}
                />
              ) : (
                <Logos tone={tone} busy={busy} note={mediaNote} files={media.doc} onAdd={addFiles} onDrop={drop} />
              )}

              {/* Not for people. Off screen, out of the tab order, and any
                  value in it means a script filled the form. */}
              <input name="fax" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.fax} onChange={up("fax")}
                style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />

              <div ref={tsRef} style={{ minHeight: tsState === "failed" ? 0 : 65 }} />

              {status === "error" && (
                <span role="alert" style={{ fontFamily: ARCHIVO, fontSize: 14, color: "#F2994A" }}>
                  {why || `That did not send. Try again, or write to ${DESK[form.kind]}.`}
                </span>
              )}
              <button
                onClick={send}
                disabled={status === "sending"}
                className="pgGo"
                style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".05em", textTransform: "uppercase", background: tone, color: "#101010", border: "none", padding: "16px 28px", cursor: status === "sending" ? "default" : "pointer", opacity: status === "sending" ? .6 : 1, clipPath: CLIP_SM }}
              >
                {status === "sending" ? "Sending" : "Send it"}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * Photographs and video, on the public entry form.
 *
 * The count is the loudest thing here on purpose. Five is a requirement, and a
 * requirement a person only meets after being refused is a bad form, so it
 * says where they are the whole time rather than at the end.
 *
 * Thumbnails are the local file, not the uploaded one: the store is private
 * and reading it back needs a staff token, so the browser shows what it just
 * sent from its own memory. That also means a thumbnail appearing is proof
 * the file left the phone, which is the thing somebody wants to see.
 */
function Media({
  tone,
  busy,
  note,
  photos,
  videos,
  onAdd,
  onDrop,
}: {
  tone: string
  busy: string
  note: string
  photos: Shot[]
  videos: Shot[]
  onAdd: (kind: "photo" | "video" | "doc", files: FileList | null) => void
  onDrop: (kind: keyof Manifest, path: string) => void
}) {
  const photoRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLInputElement>(null)
  const short = Math.max(0, MIN_PHOTOS - photos.length)
  const met = short === 0

  return (
    <div style={{ display: "grid", gap: 12, border: "1px solid rgba(255,255,255,.14)", borderLeft: `3px solid ${met ? "#00D2BE" : tone}`, background: "rgba(10,21,35,.42)", padding: "16px 16px 18px", clipPath: CLIP_SM }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: met ? "#00D2BE" : tone }}>
          Photographs, {MIN_PHOTOS} at least
        </span>
        <span style={{ fontFamily: MONO, fontSize: 12, color: met ? "#00D2BE" : "#C4CCD6", fontVariantNumeric: "tabular-nums" }}>
          {photos.length} of {MAX_PHOTOS}
          {met ? ", enough" : `, ${short} to go`}
        </span>
      </div>

      <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 14.5, lineHeight: 1.5, color: "#A9B4C2" }}>
        Exterior from both sides, the front, the interior, and the engine. As it sits today, not at its best year.
      </p>

      {photos.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(84px,1fr))", gap: 8 }}>
          {photos.map((s) => (
            <figure key={s.pathname} style={{ position: "relative", margin: 0, aspectRatio: "1", overflow: "hidden", borderRadius: 8, background: "rgba(255,255,255,.05)" }}>
              <Thumb shot={s} />
              <button
                type="button"
                aria-label={`Remove ${s.name}`}
                onClick={() => onDrop("photo", s.pathname)}
                style={{ position: "absolute", top: 4, right: 4, width: 26, height: 26, borderRadius: 13, border: "none", background: "rgba(10,21,35,.82)", color: "#EDF1F6", fontSize: 15, lineHeight: 1, cursor: "pointer" }}
              >
                &times;
              </button>
            </figure>
          ))}
        </div>
      )}

      {videos.length > 0 && (
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
          {videos.map((s) => (
            <li key={s.pathname} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: ARCHIVO, fontSize: 14, color: "#C4CCD6" }}>
              <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
              <span style={{ fontFamily: MONO, fontSize: 12, color: "#8b95a3" }}>
                {s.seconds ? `${Math.floor(s.seconds / 60)}:${String(s.seconds % 60).padStart(2, "0")}` : mb(s.size)}
              </span>
              <button type="button" aria-label={`Remove ${s.name}`} onClick={() => onDrop("video", s.pathname)} style={{ border: "none", background: "none", color: "#8b95a3", fontSize: 17, cursor: "pointer", padding: 4 }}>
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <input ref={photoRef} type="file" accept="image/*" multiple hidden onChange={(e) => { onAdd("photo", e.target.files); e.target.value = "" }} />
        <input ref={videoRef} type="file" accept="video/*" hidden onChange={(e) => { onAdd("video", e.target.files); e.target.value = "" }} />
        <button type="button" disabled={Boolean(busy)} onClick={() => photoRef.current?.click()} className="pgGo"
          style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".04em", textTransform: "uppercase", background: met ? "transparent" : tone, color: met ? "#EDF1F6" : "#101010", border: met ? "1px solid rgba(255,255,255,.3)" : "none", padding: "13px 20px", cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1, clipPath: CLIP_SM }}>
          {photos.length ? "Add more photographs" : "Add photographs"}
        </button>
        <button type="button" disabled={Boolean(busy) || videos.length >= MAX_VIDEOS} onClick={() => videoRef.current?.click()}
          style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".04em", textTransform: "uppercase", background: "transparent", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.3)", padding: "13px 20px", cursor: busy || videos.length >= MAX_VIDEOS ? "default" : "pointer", opacity: busy || videos.length >= MAX_VIDEOS ? 0.5 : 1, clipPath: CLIP_SM }}>
          Add video
        </button>
      </div>

      <span aria-live="polite" style={{ fontFamily: ARCHIVO, fontSize: 13.5, color: note ? "#F2994A" : "#8b95a3", minHeight: 19 }}>
        {note || busy || `Up to ${MAX_PHOTOS} photographs, and video up to five minutes each.`}
      </span>
    </div>
  )
}

/** The lighter version, for a vendor or a sponsor: a logo, or a stall picture. */
function Logos({
  tone,
  busy,
  note,
  files,
  onAdd,
  onDrop,
}: {
  tone: string
  busy: string
  note: string
  files: Shot[]
  onAdd: (kind: "photo" | "video" | "doc", files: FileList | null) => void
  onDrop: (kind: keyof Manifest, path: string) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div style={{ display: "grid", gap: 10, border: "1px solid rgba(255,255,255,.14)", borderLeft: `3px solid ${tone}`, background: "rgba(10,21,35,.42)", padding: "14px 16px 16px", clipPath: CLIP_SM }}>
      <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: tone }}>
        Your logo, optional
      </span>
      <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 14.5, lineHeight: 1.5, color: "#A9B4C2" }}>
        Vector if you have it, on a transparent background. SVG, EPS, AI or PDF. A photograph of the stall works too.
      </p>
      {files.length > 0 && (
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
          {files.map((s) => (
            <li key={s.pathname} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: ARCHIVO, fontSize: 14, color: "#C4CCD6" }}>
              <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
              <span style={{ fontFamily: MONO, fontSize: 12, color: "#8b95a3" }}>{mb(s.size)}</span>
              <button type="button" aria-label={`Remove ${s.name}`} onClick={() => onDrop("doc", s.pathname)} style={{ border: "none", background: "none", color: "#8b95a3", fontSize: 17, cursor: "pointer", padding: 4 }}>
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input ref={ref} type="file" accept=".svg,.eps,.ai,.pdf,image/*,application/pdf,image/svg+xml,application/postscript,application/illustrator" hidden
          onChange={(e) => { onAdd("doc", e.target.files); e.target.value = "" }} />
        <button type="button" disabled={Boolean(busy) || files.length >= MAX_LOGOS} onClick={() => ref.current?.click()}
          style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".04em", textTransform: "uppercase", background: "transparent", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.3)", padding: "13px 20px", cursor: busy ? "default" : "pointer", opacity: busy || files.length >= MAX_LOGOS ? 0.5 : 1, clipPath: CLIP_SM }}>
          {files.length ? "Add another" : "Add a file"}
        </button>
        <span aria-live="polite" style={{ fontFamily: ARCHIVO, fontSize: 13.5, color: note ? "#F2994A" : "#8b95a3" }}>{note || busy}</span>
      </div>
    </div>
  )
}

/** The local file, drawn from memory. The store it went to is private. */
function Thumb({ shot }: { shot: Shot }) {
  const [src, setSrc] = useState("")
  useEffect(() => {
    const held = LOCAL.get(shot.pathname)
    if (!held) return
    const url = URL.createObjectURL(held)
    setSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [shot.pathname])
  if (!src) {
    return (
      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 10, color: "#8b95a3", textAlign: "center", padding: 6 }}>
        Sent
      </span>
    )
  }
  /* eslint-disable-next-line @next/next/no-img-element */
  return <img src={src} alt={shot.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
}

/** What the browser still holds, so a thumbnail costs no network at all. */
const LOCAL = new Map<string, File>()
