"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { CrmLogin } from "@/components/crm-login"
import { RsvpBlock } from "@/components/rsvp-block"

/* Copy on this page ran through RAIL Redline (paddock20.com/rail/redline).
   Run: Claude Sonnet 4.5 · WARM · WEB PAGE · US · DataForSEO target
   "car events middle tennessee" · tells cut 0 of 0 · gap closed on this
   build: dates and registration information for attendees. */

type Status = "idle" | "sending" | "sent" | "error"

type EventRow = {
  key: string
  title: string
  venue: string
  place: string
  date: string | null
  when: string
  entry: string
  register: string
  state: "confirmed" | "scoping" | "closed"
  stateLabel: string
  blurb: string
  img: string
  href: string
  cta: string
  tone: string
}

const UPCOMING: EventRow[] = [
  {
    key: "ppr",
    title: "The Piston Powered Ranch",
    venue: "Rancho Jaramillo",
    place: "Unionville, TN",
    date: "2026-10-10",
    when: "9:00 AM to 3:00 PM",
    entry: "Free to spectate",
    register: "RSVP to be counted",
    state: "confirmed",
    stateLabel: "Confirmed",
    blurb:
      "Three hundred curated cars on a working ranch. Twelve acres of open pasture. Spectating is free. A share of every net dollar goes to Community Elementary School.",
    img: "/images/ranch/ppr-gate.jpg",
    href: "/events/pistonpoweredranch",
    cta: "The event",
    tone: "#F2C94C",
  },
  {
    key: "encanto",
    title: "Encanto Blossom Orchard",
    venue: "Encanto Blossom Orchard",
    place: "Shelbyville, TN",
    date: null,
    when: "Date to be set",
    entry: "To be announced",
    register: "Dates post here first",
    state: "scoping",
    stateLabel: "In scoping",
    blurb: "An orchard we are walking for a future field. In scoping. Nothing booked yet.",
    img: "/images/carrera-traffic.jpg",
    href: "/encantoblossomorchard",
    cta: "The property",
    tone: "#00D2BE",
  },
]

const PAST = [
  {
    key: "donuts",
    title: "Donuts with duPont",
    stateLabel: "Final edition, August 2026",
    blurb:
      "Monthly collector morning on the duPont REGISTRY floor in Lebanon. August 2026 was the final edition. Coffee, whatever you drove, and a room that never looked the same twice.",
    img: "/images/donuts-overflow.webp",
    href: "/donuts",
    cta: "The archive",
  },
  {
    key: "creator",
    title: "Creator Day",
    stateLabel: "Ran September 2026",
    blurb:
      "Installations built for cameras. Creators of every kind invited to shoot, film, paint and post. The winner took the bundle and a full day with a car.",
    img: "/images/cullinan-speedway.webp",
    href: "/events/creator-day",
    cta: "The page",
  },
  {
    key: "private",
    title: "Private client evenings",
    stateLabel: "Ongoing, by request",
    blurb:
      "The floor booked out for a collector group, a brand, or a birthday. Closed to the public. Listed so you can see the room gets used this way.",
    img: "/images/f458-dash.webp",
    href: "/connect",
    cta: "Ask about yours",
  },
]

const GALLERY = [
  { src: "/images/donuts-floor.webp", alt: "The duPont REGISTRY floor on a Donuts morning" },
  { src: "/images/918-p1.webp", alt: "A Porsche 918 beside a McLaren P1" },
  { src: "/images/donuts-z06.webp", alt: "A Corvette Z06 pulled onto the floor" },
  { src: "/images/cullinan-doors.webp", alt: "Rolls-Royce Cullinan with the doors open" },
  { src: "/images/aston-wheel.webp", alt: "Aston Martin wheel detail" },
  { src: "/images/donuts-inside.webp", alt: "Inside the showroom, cars and coffee" },
  { src: "/images/f458-extinguisher.webp", alt: "Ferrari 458 interior detail" },
  { src: "/images/donuts-tall.webp", alt: "The lot filling up before the doors opened" },
]

const VENUES = [
  {
    name: "Rancho Jaramillo",
    place: "Unionville, TN",
    spec: "408 acres with 12 in use",
    img: "/images/ranch/ppr-rail.jpg",
    href: "/events/pistonpoweredranch",
    live: true,
  },
  {
    name: "Encanto Blossom Orchard",
    place: "Shelbyville, TN",
    spec: "In scoping",
    img: "/images/carrera-traffic.jpg",
    href: "/encantoblossomorchard",
    live: false,
  },
]

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const CLIP = "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)"
const CLIP_LG = "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)"
const CLIP_SM = "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)"
const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

function midday(iso: string) {
  return Date.parse(iso + "T12:00:00")
}
function daysUntil(iso: string, now: number) {
  const t = new Date(now)
  const today = Date.parse(
    `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T00:00:00`,
  )
  return Math.round((Date.parse(iso + "T00:00:00") - today) / 86400000)
}
function countdown(iso: string, now: number) {
  const days = daysUntil(iso, now)
  if (days > 1) return `in ${days} days`
  if (days === 1) return "tomorrow"
  if (days === 0) return "today"
  return "done"
}
function dateParts(iso: string) {
  const d = new Date(midday(iso))
  return { m: MONTHS[d.getMonth()], d: d.getDate(), y: d.getFullYear() }
}

function Tag({ children, bg = "#F2C94C", fg = "#101010" }: { children: React.ReactNode; bg?: string; fg?: string }) {
  return (
    <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: bg, padding: "6px 15px", alignSelf: "flex-start" }}>
      <span style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: fg }}>
        {children}
      </span>
    </span>
  )
}

function Eyebrow({ children, color = "#00D2BE" }: { children: React.ReactNode; color?: string }) {
  return <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color }}>{children}</span>
}

function SectionHead({ title, right }: { title: string; right: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,.14)", paddingBottom: 10 }}>
      <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(22px,3vw,32px)", letterSpacing: "-.02em", textTransform: "uppercase", color: "#FFFFFF" }}>{title}</h2>
      {right}
    </div>
  )
}

export default function EventsPage() {
  const [now, setNow] = useState(Date.now())
  const [form, setForm] = useState({ name: "", reach: "", where: "", message: "" })
  const [status, setStatus] = useState<Status>("idle")

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(t)
  }, [])

  const update =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.name.trim() || !form.reach.trim() || status === "sending") return
    setStatus("sending")
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "venue-offer", ...form, page: "events" }),
      })
      setStatus(res.ok ? "sent" : "error")
    } catch {
      setStatus("error")
    }
  }

  const next = UPCOMING.filter((e) => e.date && midday(e.date) > now - 43200000).sort(
    (a, b) => midday(a.date!) - midday(b.date!),
  )[0]

  const inputStyle: React.CSSProperties = {
    background: "rgba(10,21,35,.55)",
    border: "1px solid rgba(255,255,255,.24)",
    color: "#EDF1F6",
    fontFamily: ARCHIVO,
    fontSize: 16,
    padding: "13px 15px",
    clipPath: CLIP_SM,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
  }

  return (
    <>
      <SiteNav active="events" />
      <CrmLogin />

      <style>{`
        @keyframes pgPulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes pgKb{from{transform:scale(1) translateY(0)}to{transform:scale(1.08) translateY(-1.5%)}}
        .pgCard{transition:transform .22s cubic-bezier(.16,.84,.32,1)}
        @media (hover:hover){.pgCard:hover{transform:translateY(-3px)}}
        .pgShotImg{transition:transform .5s cubic-bezier(.16,.84,.32,1)}
        @media (hover:hover){.pgShot:hover .pgShotImg{transform:scale(1.06)}}
        @media (prefers-reduced-motion:reduce){
          .pgCard,.pgShotImg{transition:none!important}
          .pgCard:hover{transform:none!important}
          [data-kb]{animation:none!important}
        }
      `}</style>

      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", background: "#0A1523" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.22 }}>
          <Image src="/images/ranch/ppr-field.jpg" alt="" fill style={{ objectFit: "cover" }} priority />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(1100px 720px at 82% -6%,rgba(242,201,76,.13),transparent 60%),radial-gradient(1000px 700px at 4% 30%,rgba(0,81,133,.42),transparent 62%),linear-gradient(180deg,rgba(10,21,35,.86),rgba(10,21,35,.96))" }} />
      </div>

      {/* Ticker */}
      <div style={{ position: "fixed", top: 75, left: 0, right: 0, zIndex: 60, padding: "0 clamp(12px,4vw,40px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", background: "linear-gradient(150deg,rgba(255,255,255,.075),rgba(255,255,255,.018))", backdropFilter: "blur(26px) saturate(170%)", WebkitBackdropFilter: "blur(26px) saturate(170%)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.16)", clipPath: CLIP, padding: "11px clamp(14px,2.4vw,22px)", display: "flex", alignItems: "center", gap: "clamp(10px,2vw,18px)", overflow: "hidden" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10, flex: "0 0 auto" }}>
            <i aria-hidden="true" style={{ width: 9, height: 9, borderRadius: "50%", background: "#F2C94C", animation: "pgPulse 2.2s ease-in-out infinite", display: "block" }} />
            <span style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: ".2em", textTransform: "uppercase", color: "#EDF1F6", whiteSpace: "nowrap" }}>Next on the field</span>
          </span>
          <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 10 }} />
          <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase", color: "#F2C94C", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>
            {next ? next.title : "Dates post here first"}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", fontVariantNumeric: "tabular-nums", flex: "0 0 auto", whiteSpace: "nowrap" }}>
            {next?.date ? countdown(next.date, now) : ""}
          </span>
        </div>
      </div>
      <div aria-hidden="true" style={{ height: 52 }} />

      <main style={{ position: "relative", zIndex: 1, minWidth: 0, maxWidth: 1180, margin: "0 auto", padding: "clamp(14px,2.4vw,22px) clamp(12px,4vw,40px) clamp(40px,7vw,84px)", display: "flex", flexDirection: "column", gap: "clamp(18px,3vw,30px)" }}>
        {/* Hero */}
        <section style={{ position: "relative", minHeight: "clamp(400px,58vh,580px)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)", clipPath: CLIP_LG, overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
          <Image data-kb="" src="/images/ranch/ppr-bins.jpg" alt="The grain bins and the ranch road at Rancho Jaramillo" fill style={{ objectFit: "cover", objectPosition: "center 62%", animation: "pgKb 26s ease-in-out infinite alternate", transformOrigin: "center" }} priority />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.95) 8%,rgba(10,21,35,.4) 55%,rgba(10,21,35,.3) 100%)" }} />
          <div style={{ position: "relative", padding: "clamp(22px,3.6vw,40px)", display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>
            <Tag>Car events &middot; Middle Tennessee</Tag>
            <h1 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(34px,6vw,64px)", lineHeight: 1, letterSpacing: "-.028em", textTransform: "uppercase", color: "#FFFFFF" }}>
              Every field
              <br />
              <span style={{ color: "#F2C94C" }}>we open</span>
            </h1>
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(17px,1.7vw,19px)", lineHeight: 1.56, color: "#E4E9F0", maxWidth: "58ch", textShadow: "0 1px 10px rgba(10,21,35,.8)" }}>
              We produce collector car events in Middle Tennessee. Working ranches. Orchards. Showroom floors. What is booked runs at the top of this page. What already ran sits below. The properties we represent close it out.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/events/pistonpoweredranch" style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 26px", clipPath: CLIP_SM, textDecoration: "none" }}>
                The Piston Powered Ranch
              </Link>
              <a href="#property" style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.34)", background: "rgba(10,21,35,.32)", backdropFilter: "blur(8px)", padding: "15px 26px", clipPath: CLIP_SM, textDecoration: "none" }}>
                Bring us a property
              </a>
            </div>
          </div>
        </section>

        {/* Coming up */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,18px)" }}>
          <SectionHead title="Coming up" right={<Eyebrow>{UPCOMING.length} on the calendar</Eyebrow>} />

          {UPCOMING.map((e) => {
            const dp = e.date ? dateParts(e.date) : null
            return (
              <article key={e.key} className="pgCard" style={{ position: "relative", border: "1px solid rgba(255,255,255,.13)", borderTop: `3px solid ${e.tone}`, boxShadow: "inset 0 1px 0 rgba(255,255,255,.13)", clipPath: CLIP_LG, overflow: "hidden", isolation: "isolate", display: "flex", flexWrap: "wrap", minHeight: 300 }}>
                <Image src={e.img} alt="" aria-hidden fill style={{ objectFit: "cover", opacity: 0.34, zIndex: -1 }} />
                <span aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: -1, background: "linear-gradient(150deg,rgba(14,26,42,.97) 0%,rgba(14,26,42,.9) 50%,rgba(14,26,42,.6) 100%)" }} />

                <div style={{ flex: "0 0 auto", width: "clamp(112px,15vw,150px)", borderRight: "1px solid rgba(255,255,255,.12)", padding: "clamp(18px,2.4vw,26px) 10px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2, background: "rgba(10,21,35,.35)" }}>
                  {dp ? (
                    <>
                      <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: ".2em", textTransform: "uppercase", color: e.tone }}>{dp.m}</span>
                      <span style={{ fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(38px,5.4vw,58px)", lineHeight: 1, color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>{dp.d}</span>
                      <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".16em", color: "#B4B6B2" }}>{dp.y}</span>
                      <span style={{ marginTop: 8, fontFamily: MONO, fontSize: 11.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#00D2BE", textAlign: "center" }}>{countdown(e.date!, now)}</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(24px,3.2vw,32px)", lineHeight: 1, color: "#FFFFFF", textAlign: "center" }}>TBA</span>
                      <span style={{ marginTop: 6, fontFamily: MONO, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#B4B6B2", textAlign: "center" }}>Date to be set</span>
                    </>
                  )}
                </div>

                <div style={{ flex: "1 1 320px", minWidth: 0, padding: "clamp(20px,2.8vw,32px)", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <Tag bg={e.state === "confirmed" ? "#F2C94C" : "#00D2BE"} fg={e.state === "confirmed" ? "#101010" : "#00302B"}>
                      {e.stateLabel}
                    </Tag>
                    <Eyebrow color="#B4B6B2">
                      {e.venue} &middot; {e.place}
                    </Eyebrow>
                  </div>
                  <h3 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(24px,3.4vw,38px)", lineHeight: 1.02, letterSpacing: "-.022em", textTransform: "uppercase", color: "#FFFFFF" }}>{e.title}</h3>
                  <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(15px,1.5vw,17px)", lineHeight: 1.55, color: "#D8DEE7", maxWidth: "62ch" }}>{e.blurb}</p>
                  <dl style={{ margin: "2px 0 0", display: "flex", gap: "clamp(16px,3vw,32px)", flexWrap: "wrap" }}>
                    {[
                      ["Hours", e.when],
                      ["Entry", e.entry],
                      ["How to come", e.register],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <dt style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#848482" }}>{k}</dt>
                        <dd style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, color: "#EDF1F6" }}>{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div style={{ marginTop: "auto", paddingTop: 14 }}>
                    <Link href={e.href} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14.5, letterSpacing: ".05em", textTransform: "uppercase", background: e.state === "confirmed" ? "#F2C94C" : "transparent", color: e.state === "confirmed" ? "#101010" : "#EDF1F6", border: e.state === "confirmed" ? "1px solid #F2C94C" : "1px solid rgba(255,255,255,.34)", padding: "13px 24px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", textDecoration: "none" }}>
                      {e.cta}
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </section>

        {/* What already ran */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,18px)" }}>
          <SectionHead title="What already ran" right={<Eyebrow color="#B4B6B2">The record</Eyebrow>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(272px,1fr))", gap: "clamp(12px,2vw,18px)" }}>
            {PAST.map((e) => (
              <article key={e.key} className="pgCard" style={{ position: "relative", border: "1px solid rgba(255,255,255,.12)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.12)", clipPath: CLIP, overflow: "hidden", isolation: "isolate", display: "flex", flexDirection: "column", minHeight: 268 }}>
                <Image src={e.img} alt="" aria-hidden fill style={{ objectFit: "cover", opacity: 0.26, zIndex: -1 }} />
                <span aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: -1, background: "linear-gradient(160deg,rgba(14,26,42,.96),rgba(14,26,42,.88))" }} />
                <div style={{ padding: "clamp(18px,2.4vw,24px)", display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
                  <Eyebrow color="#848482">{e.stateLabel}</Eyebrow>
                  <h3 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(19px,2.2vw,23px)", lineHeight: 1.08, letterSpacing: "-.018em", textTransform: "uppercase", color: "#FFFFFF" }}>{e.title}</h3>
                  <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 14.5, lineHeight: 1.5, color: "#C9D1DB" }}>{e.blurb}</p>
                  <div style={{ marginTop: "auto", paddingTop: 12 }}>
                    <Link href={e.href} style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none", borderBottom: "1px solid rgba(0,210,190,.45)", paddingBottom: 2 }}>
                      {e.cta}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,18px)" }}>
          <SectionHead
            title="The gallery"
            right={
              <Link href="/gallery" style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none" }}>
                All of it
              </Link>
            }
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "clamp(8px,1.4vw,12px)" }}>
            {GALLERY.map((g) => (
              <div key={g.src} className="pgShot" style={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden", border: "1px solid rgba(255,255,255,.1)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)" }}>
                <Image className="pgShotImg" src={g.src} alt={g.alt} fill sizes="(max-width:700px) 50vw, 25vw" style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </section>

        {/* Venues */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,18px)" }}>
          <SectionHead title="The properties we represent" right={<Eyebrow>Venues</Eyebrow>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "clamp(12px,2vw,18px)" }}>
            {VENUES.map((v) => (
              <Link key={v.name} href={v.href} className="pgCard" style={{ position: "relative", minHeight: 210, border: "1px solid rgba(255,255,255,.12)", clipPath: CLIP, overflow: "hidden", isolation: "isolate", display: "flex", alignItems: "flex-end", textDecoration: "none" }}>
                <Image src={v.img} alt="" aria-hidden fill style={{ objectFit: "cover", opacity: 0.5, zIndex: -1 }} />
                <span aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: -1, background: "linear-gradient(to top,rgba(10,21,35,.96) 12%,rgba(10,21,35,.42) 100%)" }} />
                <div style={{ padding: "clamp(16px,2.2vw,22px)", display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
                  <Eyebrow color={v.live ? "#F2C94C" : "#B4B6B2"}>{v.place}</Eyebrow>
                  <span style={{ fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(20px,2.4vw,26px)", lineHeight: 1.05, letterSpacing: "-.02em", textTransform: "uppercase", color: "#FFFFFF" }}>{v.name}</span>
                  <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#B4B6B2" }}>{v.spec}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Bring us a property */}
        <section id="property" style={{ position: "relative", background: "linear-gradient(150deg,rgba(242,201,76,.09),rgba(255,255,255,.014))", backdropFilter: "blur(24px) saturate(160%)", WebkitBackdropFilter: "blur(24px) saturate(160%)", border: "1px solid rgba(242,201,76,.28)", borderTop: "3px solid #F2C94C", boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)", clipPath: CLIP_LG, padding: "clamp(22px,3.4vw,36px)", display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,36px)" }}>
          <div style={{ flex: "5 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <Tag>Have ground</Tag>
            <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(24px,3.4vw,36px)", lineHeight: 1.03, letterSpacing: "-.022em", textTransform: "uppercase", color: "#FFFFFF" }}>
              Bring us a property
            </h2>
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(15px,1.5vw,17px)", lineHeight: 1.55, color: "#D8DEE7", maxWidth: "50ch" }}>
              A ranch, an orchard, an airfield, a floor. If it holds cars and people, tell us where it is. We handle curation, ticketing, marshals and the site plan.
            </p>
          </div>
          <div style={{ flex: "4 1 280px", minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {status === "sent" ? (
              <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 16, lineHeight: 1.5, color: "#00D2BE" }}>
                Got it. We will come back to you at the address you left.
              </p>
            ) : (
              <>
                <input style={inputStyle} placeholder="Your name" value={form.name} onChange={update("name")} />
                <input style={inputStyle} placeholder="Email or phone" value={form.reach} onChange={update("reach")} />
                <input style={inputStyle} placeholder="Where is the property" value={form.where} onChange={update("where")} />
                <textarea style={{ ...inputStyle, minHeight: 92, resize: "vertical" }} placeholder="Anything else" value={form.message} onChange={update("message")} />
                {status === "error" && (
                  <span style={{ fontFamily: ARCHIVO, fontSize: 14, color: "#F2994A" }}>That did not send. Try again, or email gavin@paddock20.com.</span>
                )}
                <button
                  onClick={submit}
                  disabled={status === "sending"}
                  style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".05em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", border: "none", padding: "15px 26px", cursor: status === "sending" ? "default" : "pointer", opacity: status === "sending" ? 0.6 : 1, clipPath: CLIP_SM }}
                >
                  {status === "sending" ? "Sending" : "Send it"}
                </button>
              </>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
