"use client"

import { useEffect, useRef, useState } from "react"
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
const SPONSOR_LEVELS = ["Title", "Category exclusive", "Supporting", "In kind", "Not sure yet"]

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
    return () => io.disconnect()
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
    if (surface === "vendor" && !f.category) {
      setStatus("error")
      setWhy("Pick the category closest to what you sell.")
      return
    }
    if (tsState === "ready" && !ts) {
      setStatus("error")
      setWhy("Tick the box above the button first.")
      return
    }
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
    const common = { org, message, reach, page: "piston-powered-ranch" }
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
