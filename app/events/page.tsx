"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

type Status = "idle" | "sending" | "sent" | "error"

const EVENTS = [
  {
    key: "donuts",
    title: "Donuts with duPont",
    date: null as string | null,
    when: "8\u201311 am",
    entry: "Free",
    blurb: "Oh, we have coffee too. Come see what rolled in this month, and bring whatever you drive. Next date posts on Instagram.",
    img: "/images/donuts-square-sq.webp",
    href: "/donuts",
    cta: "Come by",
    tone: "#F8B800",
  },
  {
    key: "private",
    title: "Private client evening",
    date: "2026-09-12",
    when: "Evening",
    entry: "Booked",
    blurb: "The floor booked out for a collector group. Closed to the public, listed so you can see the room gets used this way.",
    img: "/images/ferrari-red-sq.webp",
    href: "/book",
    cta: "Ask about yours",
    tone: "#4BA3DE",
  },
  {
    key: "creator",
    title: "Creator Day",
    date: "2026-09-19",
    when: "Golden hour to golden hour",
    entry: "Free",
    blurb: "Four to five installations with cars, and creators of every kind invited. Shoot, film, paint, create \u2014 post your best, duPont votes, winner takes the bundle and a full day with a duPont car.",
    img: "/images/cullinan-speedway-sq.webp",
    href: "/events/creator-day",
    cta: "The page",
    tone: "#F8B800",
  },
]

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const DOWS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

function midday(iso: string) { return Date.parse(iso + "T12:00:00") }
function countdown(iso: string, now: number) {
  const days = Math.ceil((midday(iso) - now) / 86400000)
  if (days > 1) return `in ${days} days`
  if (days === 1) return "tomorrow"
  if (days === 0) return "today"
  return "done"
}

export default function EventsPage() {
  const [now, setNow] = useState(Date.now())
  const [form, setForm] = useState({ name: "", reach: "", date: "", message: "" })
  const [status, setStatus] = useState<Status>("idle")

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(t)
  }, [])

  const update = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.name.trim() || !form.reach.trim() || status === "sending") return
    setStatus("sending")
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "book-the-floor", ...form, page: "events" }),
      })
      setStatus(res.ok ? "sent" : "error")
    } catch {
      setStatus("error")
    }
  }

  const dated = EVENTS.filter(e => e.date && midday(e.date) > now - 43200000)
    .sort((a, b) => midday(a.date!) - midday(b.date!))
  const next = dated[0]
  const creatorIn = countdown("2026-09-19", now)

  const inputStyle: React.CSSProperties = {
    background: "rgba(10,21,35,.55)",
    border: "1px solid rgba(255,255,255,.24)",
    color: "#EDF1F6",
    fontFamily: "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: 16,
    padding: "13px 15px",
    clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
    width: "100%",
    boxSizing: "border-box" as const,
    outline: "none",
  }

  return (
    <>
      <SiteNav active="events" />

      <style>{`
        @keyframes pgPulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes pgKb{from{transform:scale(1) translateY(0)}to{transform:scale(1.09) translateY(-1.6%)}}
      `}</style>

      {/* Fixed background */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", background: "#0A1523" }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.24 }}>
          <Image src="/images/donuts-lot.webp" alt="" fill style={{ objectFit: "cover" }} priority />
        </div>
        <div
          style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(1100px 720px at 82% -6%,rgba(248,184,0,.13),transparent 60%),radial-gradient(1000px 700px at 4% 30%,rgba(0,81,133,.42),transparent 62%),linear-gradient(180deg,rgba(10,21,35,.85),rgba(10,21,35,.95))",
          }}
        />
      </div>

      {/* Ticker bar */}
      <div style={{ position: "fixed", top: 75, left: 0, right: 0, zIndex: 60, padding: "0 clamp(12px,4vw,40px)" }}>
        <div
          style={{
            maxWidth: 1180, margin: "0 auto",
            background: "linear-gradient(150deg,rgba(255,255,255,.075),rgba(255,255,255,.018))",
            backdropFilter: "blur(26px) saturate(170%)",
            WebkitBackdropFilter: "blur(26px) saturate(170%)",
            border: "1px solid rgba(255,255,255,.12)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.16)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)",
            padding: "11px clamp(14px,2.4vw,22px)",
            display: "flex", alignItems: "center", gap: "clamp(10px,2vw,18px)", overflow: "hidden",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10, flex: "0 0 auto" }}>
            <i aria-hidden="true" style={{ width: 9, height: 9, borderRadius: "50%", background: "#F8B800", animation: "pgPulse 2.2s ease-in-out infinite", flex: "0 0 auto", display: "block" }} />
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12.5, letterSpacing: ".2em", textTransform: "uppercase", color: "#EDF1F6", whiteSpace: "nowrap" }}>
              Next on the floor
            </span>
          </span>
          <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 10 }} />
          <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase", color: "#F8B800", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>
            {next ? `${next.title} \u00b7 ${countdown(next.date!, now)}` : "Donuts with duPont \u00b7 date on Instagram"}
          </span>
          <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", fontVariantNumeric: "tabular-nums", flex: "0 0 auto", whiteSpace: "nowrap" }}>
            {next ? countdown(next.date!, now) : ""}
          </span>
        </div>
      </div>
      <div aria-hidden="true" style={{ height: 52 }} />

      <main style={{ position: "relative", zIndex: 1, minWidth: 0, maxWidth: 1180, margin: "0 auto", padding: "clamp(14px,2.4vw,22px) clamp(12px,4vw,40px) clamp(40px,7vw,84px)", display: "flex", flexDirection: "column", gap: "clamp(14px,2.4vw,22px)" }}>

        {/* Hero */}
        <section style={{ position: "relative", minHeight: "clamp(400px,58vh,580px)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
          <Image src="/images/donuts-overflow.webp" alt="The overflow lot filling up on a Donuts morning" fill style={{ objectFit: "cover", objectPosition: "center 88%", animation: "pgKb 26s ease-in-out infinite alternate", transformOrigin: "center" }} priority />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.95) 8%,rgba(10,21,35,.34) 55%,rgba(10,21,35,.3) 100%)" }} />
          <div style={{ position: "relative", padding: "clamp(22px,3.6vw,40px)", display: "flex", flexDirection: "column", gap: 16, maxWidth: 740 }}>
            <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#F8B800", padding: "6px 16px", alignSelf: "flex-start" }}>
              <span style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#101010" }}>Events &middot; Lebanon, TN</span>
            </span>
            <h1 style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(34px,6vw,64px)", lineHeight: 1, letterSpacing: "-.028em", textTransform: "uppercase", color: "#FFFFFF" }}>
              Cars like these<br />
              <span style={{ color: "#F8B800" }}>are better shared</span>
            </h1>
            <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "clamp(17px,1.7vw,19px)", lineHeight: 1.56, color: "#E4E9F0", maxWidth: "56ch", textShadow: "0 1px 10px rgba(10,21,35,.8)" }}>
              That&rsquo;s why we put something on duPont REGISTRY&rsquo;s floor every month &mdash; so you can stand next to the one you&rsquo;ve only seen on a screen, ask how it works, and bring whatever you drive. I&rsquo;m their events manager, so the calendar runs through me.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/donuts" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#F8B800", color: "#101010", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>
                Donuts with duPont
              </Link>
              <a href="#inquire" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.34)", background: "rgba(10,21,35,.32)", backdropFilter: "blur(8px)", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>
                Book the floor
              </a>
            </div>
          </div>
        </section>

        {/* Creator Day feature card */}
        <section id="creator-day" style={{ position: "relative", background: "linear-gradient(150deg,rgba(248,184,0,.1),rgba(255,255,255,.014))", backdropFilter: "blur(24px) saturate(160%)", WebkitBackdropFilter: "blur(24px) saturate(160%)", border: "1px solid rgba(248,184,0,.3)", borderTop: "3px solid #F8B800", boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", overflow: "hidden", isolation: "isolate", padding: "clamp(22px,3.4vw,36px)", display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,36px)" }}>
          <Image src="/images/cullinan-speedway.webp" alt="" aria-hidden fill style={{ objectFit: "cover", opacity: 0.4, zIndex: -1 }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: -1, background: "linear-gradient(160deg,rgba(14,26,42,.97) 0%,rgba(14,26,42,.9) 52%,rgba(14,26,42,.64) 100%)" }} />
          <div style={{ flex: "6 1 320px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#F8B800", padding: "6px 16px" }}>
                <span style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#101010" }}>Sep 19 &middot; Creator Day</span>
              </span>
              <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#00D2BE" }}>{creatorIn}</span>
            </div>
            <h2 style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(28px,4.4vw,48px)", lineHeight: 1, letterSpacing: "-.026em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "18ch" }}>
              Golden hour to golden hour,{" "}<span style={{ color: "#F8B800" }}>with the cars</span>
            </h2>
            <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "clamp(16.5px,1.6vw,18px)", lineHeight: 1.58, color: "#DFE5EC", maxWidth: "58ch" }}>
              duPont REGISTRY sets up four to five installations with cars, and creators of every kind are invited. Shoot, film, paint, create &mdash; then post your best work.
            </p>
            <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "clamp(16.5px,1.6vw,18px)", lineHeight: 1.58, color: "#C4CBD6", maxWidth: "58ch" }}>
              duPont votes, and the winner takes a creator bundle from a leading brand plus a full day to create with a duPont car of their choice.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/events/creator-day" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#F8B800", color: "#101010", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>
                Creator Day, the page
              </Link>
              <a href="https://ig.me/m/PaddockGavin" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.3)", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>
                or DM @PaddockGavin
              </a>
            </div>
          </div>
          {/* 2x2 photo grid */}
          <div style={{ flex: "4 1 240px", minWidth: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignContent: "center" }}>
            {[
              { src: "/images/creator-booth-alt.jpg", alt: "Shooting the Ford GT MkII in the studio", mt: 0 },
              { src: "/images/cage-rig-sq.webp",       alt: "Caged race build on the floor",           mt: 18 },
              { src: "/images/aston-wheel-sq.webp",    alt: "Aston Martin wheel, up close",            mt: 0 },
              { src: "/images/f458-side-sq.webp",      alt: "Ferrari 458 side profile",                mt: 18 },
            ].map((img, i) => (
              <div key={i} style={{ aspectRatio: "1", overflow: "hidden", border: "1px solid rgba(255,255,255,.14)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)", position: "relative", marginTop: img.mt }}>
                <Image src={img.src} alt={img.alt} fill style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </section>

        {/* Coming up */}
        <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", padding: "6px 2px 0" }}>
            <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#00D2BE", padding: "6px 16px" }}>
              <span style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#00302B" }}>Coming up</span>
            </span>
            <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 16, height: 1, background: "rgba(255,255,255,.14)", display: "block" }} />
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#91918F" }}>
              {EVENTS.length} listed
            </span>
          </div>

          {EVENTS.map((e) => {
            const d = e.date ? new Date(midday(e.date)) : null
            const mon = d ? MONTHS[d.getMonth()] : "Every"
            const day = d ? String(d.getDate()) : "\u25CF"
            const dow = d ? DOWS[d.getDay()] : "month"
            const entryTone = e.entry === "Free" ? "#00D2BE" : "#F8B800"
            return (
              <div key={e.key} style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: "clamp(14px,2.4vw,24px)", background: "linear-gradient(150deg,rgba(255,255,255,.06),rgba(255,255,255,.013))", backdropFilter: "blur(20px) saturate(155%)", WebkitBackdropFilter: "blur(20px) saturate(155%)", border: "1px solid rgba(255,255,255,.11)", borderLeft: `3px solid ${e.tone}`, boxShadow: "inset 0 1px 0 rgba(255,255,255,.13)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)", padding: "clamp(16px,2.4vw,22px)" }}>
                {/* Thumbnail */}
                <div style={{ flex: "0 0 auto", width: "clamp(96px,14vw,150px)", alignSelf: "center" }}>
                  <div style={{ aspectRatio: "1", overflow: "hidden", border: "1px solid rgba(255,255,255,.14)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)", position: "relative" }}>
                    <Image src={e.img} alt={e.title} fill style={{ objectFit: "cover" }} />
                  </div>
                </div>
                {/* Date column */}
                <div style={{ flex: "0 0 auto", alignSelf: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 64 }}>
                  <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: e.tone }}>{mon}</span>
                  <span style={{ fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(26px,3vw,36px)", lineHeight: 1, color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>{day}</span>
                  <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#91918F" }}>{dow}</span>
                </div>
                {/* Title / blurb */}
                <div style={{ flex: "3 1 240px", minWidth: 0, alignSelf: "center", display: "flex", flexDirection: "column", gap: 8 }}>
                  <h3 style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 800, fontSize: "clamp(19px,2.2vw,26px)", letterSpacing: "-.016em", lineHeight: 1.12, color: "#FFFFFF" }}>{e.title}</h3>
                  <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 15.5, lineHeight: 1.52, color: "#C4CBD6", maxWidth: "52ch" }}>{e.blurb}</p>
                </div>
                {/* Meta + CTA */}
                <div style={{ flex: "2 1 220px", minWidth: 0, alignSelf: "center", display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Time",  value: e.when, valueTone: "#EDF1F6" },
                    { label: "Where", value: "Lebanon, TN", valueTone: "#EDF1F6" },
                    { label: "Entry", value: e.entry, valueTone: entryTone },
                  ].map(row => (
                    <span key={row.label} style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
                      <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F", flex: "0 0 auto" }}>{row.label}</span>
                      <i aria-hidden="true" style={{ flex: "1 1 auto", height: 0, borderBottom: "1px dotted rgba(255,255,255,.2)" }} />
                      <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase", color: row.valueTone, flex: "0 0 auto" }}>{row.value}</span>
                    </span>
                  ))}
                  <div style={{ marginTop: 6 }}>
                    <Link href={e.href} style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 13.5, letterSpacing: ".06em", textTransform: "uppercase", background: e.tone, color: "#101010", padding: "12px 20px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)", textDecoration: "none" }}>
                      {e.cta}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        {/* Full bleed — urus on deck */}
        <section style={{ position: "relative", width: "100%", height: "clamp(340px,56vh,600px)", overflow: "hidden" }}>
          <Image src="/images/ferrari-upperdeck.webp" alt="On the duPont REGISTRY Logistics deck, strapped and going" fill style={{ objectFit: "cover" }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.9) 0%,rgba(10,21,35,.12) 42%,rgba(10,21,35,.3) 100%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 clamp(12px,4vw,40px)" }}>
            <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 0 20px", display: "flex", alignItems: "center", gap: 11 }}>
              <i aria-hidden="true" style={{ width: 26, height: 3, background: "#F8B800", flex: "0 0 auto", display: "block" }} />
              <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12.5, letterSpacing: ".16em", lineHeight: 1.5, textTransform: "uppercase", color: "#EDF1F6", textShadow: "0 1px 10px rgba(10,21,35,.9)" }}>On the duPont REGISTRY Logistics deck, strapped and going</span>
            </div>
          </div>
        </section>

        {/* Book the floor form */}
        <section
          id="inquire"
          style={{ position: "relative", background: "linear-gradient(150deg,rgba(0,81,133,.9),rgba(0,81,133,.66))", backdropFilter: "blur(22px) saturate(150%)", WebkitBackdropFilter: "blur(22px) saturate(150%)", border: "1px solid #0A6BAA", boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", overflow: "hidden", isolation: "isolate", padding: "clamp(22px,3.2vw,34px)", scrollMarginTop: 150 }}
        >
          <Image src="/images/donuts-floor.webp" alt="" aria-hidden fill style={{ objectFit: "cover", opacity: 0.2, zIndex: -1 }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,50,82,.6),rgba(0,40,66,.78))", zIndex: -1 }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,40px)" }}>
            <div style={{ flex: "4 1 280px", minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4" }}>Private events &middot; your date</span>
              <h2 style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(26px,3.8vw,42px)", lineHeight: 1.02, letterSpacing: "-.024em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "16ch" }}>Your event, on duPont REGISTRY&rsquo;s floor</h2>
              <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 17, lineHeight: 1.58, color: "#CFE4F4", maxWidth: "50ch" }}>The room is duPont&rsquo;s, in Lebanon, and booking it out is part of my job. It&rsquo;s not just the room that makes it special &mdash; it&rsquo;s what&rsquo;s passing through while you&rsquo;re there. Send a date and I&rsquo;ll check it.</p>
              <a href="https://ig.me/m/PaddockGavin" target="_blank" rel="noopener noreferrer" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".06em", textTransform: "uppercase", color: "#FFFFFF", border: "1px solid rgba(255,255,255,.4)", padding: "13px 22px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)", textDecoration: "none" }}>
                Rather DM? @PaddockGavin
              </a>
            </div>
            <div style={{ flex: "5 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <label style={{ flex: "1 1 160px", display: "flex", flexDirection: "column", gap: 7 }}>
                  <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4" }}>Your name</span>
                  <input type="text" value={form.name} onChange={update("name")} placeholder="Name" style={inputStyle} />
                </label>
                <label style={{ flex: "1 1 160px", display: "flex", flexDirection: "column", gap: 7 }}>
                  <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4" }}>How I reach you</span>
                  <input type="text" value={form.reach} onChange={update("reach")} placeholder="Phone, email or @handle" style={inputStyle} />
                </label>
                <label style={{ flex: "1 1 140px", display: "flex", flexDirection: "column", gap: 7 }}>
                  <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4" }}>The date</span>
                  <input type="text" value={form.date} onChange={update("date")} placeholder="When" style={inputStyle} />
                </label>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4" }}>What it is</span>
                <textarea rows={3} value={form.message} onChange={update("message")} placeholder="Headcount, the occasion, anything else" style={{ ...inputStyle, resize: "vertical", minHeight: 84, lineHeight: 1.5 }} />
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={submit}
                  style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#F8B800", color: "#101010", border: 0, padding: "15px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)" }}
                >
                  {status === "sent" ? "Sent \u2014 I\u2019ll answer" : status === "sending" ? "Sending\u2026" : "Send it to Gavin"}
                </button>
                <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#CFE4F4" }}>
                  {status === "error" ? "Could not send \u2014 DM @PaddockGavin instead" : status === "sent" ? "Landed in my inbox" : "DM @PaddockGavin for a faster response"}
                </span>
              </div>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </>
  )
}
