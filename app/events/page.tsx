"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

type Status = "idle" | "sending" | "sent" | "error"

// Compute last Saturday of a given month
function lastSaturdayOf(year: number, month: number): Date {
  const d = new Date(year, month + 1, 0)
  d.setDate(d.getDate() - ((d.getDay() + 1) % 7))
  return d
}

function nextLastSaturday(): Date {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  let d = lastSaturdayOf(now.getFullYear(), now.getMonth())
  if (d < today) d = lastSaturdayOf(now.getFullYear(), now.getMonth() + 1)
  return d
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

const UPCOMING = [
  {
    key: "donuts",
    title: "Donuts with duPont",
    blurb: "Last Saturday of every month, 8\u201311am. Bring the car you drove or just bring yourself. Oh, we have coffee too.",
    when: "8\u201311am",
    entry: "Free",
    entryTone: "#00D2BE",
    tone: "#F8B800",
    cta: "Come by",
    href: "/donuts",
    img: "/images/donuts-square-sq.webp",
    date: null as string | null,
  },
  {
    key: "private",
    title: "Private client evening",
    blurb: "The floor booked out for a collector group. Closed to the public, listed so you can see the room gets used this way.",
    when: "Evening",
    entry: "Booked",
    entryTone: "#F8B800",
    tone: "#4BA3DE",
    cta: "Ask about yours",
    href: "#inquire",
    img: "/images/ferrari-red-sq.webp",
    date: "2026-09-12",
  },
  {
    key: "creator",
    title: "Creator Day",
    blurb: "Four to five installations with cars, and creators of every kind invited. Shoot, film, paint, create — post your best, duPont votes, winner takes the bundle and a full day with a duPont car.",
    when: "Golden hour to golden hour",
    entry: "Free",
    entryTone: "#00D2BE",
    tone: "#F8B800",
    cta: "The page",
    href: "#creator-day",
    img: "/images/creator-booth-alt.jpg",
    date: "2026-09-19",
  },
]

function midday(iso: string) { return Date.parse(iso + "T12:00:00") }
function countdownLabel(iso: string) {
  const days = Math.ceil((midday(iso) - Date.now()) / 86400000)
  if (days > 1) return `in ${days} days`
  if (days === 1) return "tomorrow"
  if (days === 0) return "today"
  return "done"
}

export default function EventsPage() {
  const nextDonut  = nextLastSaturday()
  const nextMonth  = MONTHS[nextDonut.getMonth()].slice(0, 3).toUpperCase()
  const nextDay    = String(nextDonut.getDate())
  const nextDow    = DAYS[nextDonut.getDay()].slice(0, 3).toUpperCase()

  // Next upcoming dated event (for ticker)
  const nextDated = UPCOMING
    .filter(e => e.date && midday(e.date) > Date.now() - 43200000)
    .sort((a, b) => midday(a.date!) - midday(b.date!))[0]

  const [form, setForm]   = useState({ name: "", email: "", phone: "", date: "", size: "", notes: "" })
  const [status, setStatus] = useState<Status>("idle")

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || status === "sending") return
    setStatus("sending")
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "event-inquiry", ...form, page: "/events" }),
      })
      setStatus(res.ok ? "sent" : "error")
    } catch {
      setStatus("error")
    }
  }

  const inputStyle: React.CSSProperties = {
    fontFamily: "Archivo, Helvetica, sans-serif",
    fontSize: 16,
    color: "#EDF1F6",
    background: "rgba(21,37,56,.7)",
    border: "1px solid rgba(255,255,255,.18)",
    padding: "14px 16px",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)",
  }

  return (
    <>
      <SiteNav active="events" />

      {/* Next event ticker */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 60,
          padding: "0 clamp(12px,4vw,40px)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            background: "linear-gradient(150deg,rgba(255,255,255,.075),rgba(255,255,255,.018))",
            backdropFilter: "blur(26px) saturate(170%)",
            WebkitBackdropFilter: "blur(26px) saturate(170%)",
            border: "1px solid rgba(255,255,255,.12)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.16)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)",
            padding: "11px clamp(14px,2.4vw,22px)",
            display: "flex",
            alignItems: "center",
            gap: "clamp(10px,2vw,18px)",
            pointerEvents: "auto",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              flex: "0 0 auto",
            }}
          >
            <i
              aria-hidden="true"
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#F8B800",
                animation: "pgPulse 2.2s ease-in-out infinite",
                flex: "0 0 auto",
              }}
            />
            <span
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 12.5,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "#EDF1F6",
                whiteSpace: "nowrap",
              }}
            >
              Next on the floor
            </span>
          </span>
          <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 10 }} />
          <span
            style={{
              fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
              fontSize: 13,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "#F8B800",
              whiteSpace: "nowrap",
            }}
          >
            {nextDated ? `${nextDated.title} \u00b7 ${countdownLabel(nextDated.date!)}` : `Donuts with duPont \u00b7 date on Instagram`}
          </span>
        </div>
      </div>

      <style>{`@keyframes pgPulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>

      <main
        style={{
          position: "relative",
          zIndex: 1,
          minWidth: 0,
          maxWidth: 1180,
          margin: "0 auto",
          padding: "clamp(14px,2.4vw,22px) clamp(12px,4vw,40px) clamp(40px,7vw,84px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(14px,2.4vw,22px)",
        }}
      >
        {/* Hero */}
        <section
          style={{
            position: "relative",
            minHeight: "clamp(400px,58vh,580px)",
            border: "1px solid rgba(255,255,255,.12)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            overflow: "hidden",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <Image
            src="/images/donuts-overflow.webp"
            alt="The overflow lot filling up on a Donuts morning"
            fill
            style={{ objectFit: "cover", objectPosition: "center 88%" }}
            priority
          />
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top,rgba(10,21,35,.95) 8%,rgba(10,21,35,.34) 55%,rgba(10,21,35,.3) 100%)",
            }}
          />
          <div
            style={{
              position: "relative",
              padding: "clamp(22px,3.6vw,40px)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 740,
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: "skewX(-12deg)",
                background: "#F8B800",
                padding: "6px 16px",
                alignSelf: "flex-start",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  transform: "skewX(12deg)",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 12.5,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#101010",
                }}
              >
                Events &middot; Lebanon, TN
              </span>
            </span>
            <h1
              style={{
                margin: 0,
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(34px,6vw,64px)",
                lineHeight: 1,
                letterSpacing: "-.028em",
                textTransform: "uppercase",
                color: "#FFFFFF",
              }}
            >
              Cars like these<br />
              <span style={{ color: "#F8B800" }}>are better shared</span>
            </h1>
            <p
              style={{
                margin: 0,
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontSize: "clamp(17px,1.7vw,19px)",
                lineHeight: 1.56,
                color: "#E4E9F0",
                maxWidth: "56ch",
              }}
            >
              That&rsquo;s why we put something on duPont REGISTRY&rsquo;s floor every month &mdash; so you can stand next to the one you&rsquo;ve only seen on a screen, ask how it works, and bring whatever you drive. I&rsquo;m their events manager, so the calendar runs through me.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link
                href="/donuts"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                  background: "#F8B800",
                  color: "#101010",
                  padding: "15px 26px",
                  clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
                  textDecoration: "none",
                }}
              >
                Donuts with duPont
              </Link>
              <a
                href="#inquire"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                  color: "#EDF1F6",
                  border: "1px solid rgba(255,255,255,.34)",
                  background: "rgba(10,21,35,.32)",
                  backdropFilter: "blur(8px)",
                  padding: "15px 26px",
                  clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
                  textDecoration: "none",
                }}
              >
                Book the floor
              </a>
            </div>
          </div>
        </section>

        {/* Coming up */}
        <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", padding: "6px 2px 0" }}>
            <span
              style={{
                display: "inline-block",
                transform: "skewX(-12deg)",
                background: "#00D2BE",
                padding: "6px 16px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  transform: "skewX(12deg)",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 12.5,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#00302B",
                }}
              >
                Coming up
              </span>
            </span>
            <i
              aria-hidden="true"
              style={{ flex: "1 1 auto", minWidth: 16, height: 1, background: "rgba(255,255,255,.14)" }}
            />
            <span
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 12.5,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "#91918F",
              }}
            >
              {UPCOMING.length} listed
            </span>
          </div>

          {UPCOMING.map(e => (
            <div
              key={e.key}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "stretch",
                gap: "clamp(14px,2.4vw,24px)",
                background: "linear-gradient(150deg,rgba(255,255,255,.06),rgba(255,255,255,.013))",
                backdropFilter: "blur(20px) saturate(155%)",
                WebkitBackdropFilter: "blur(20px) saturate(155%)",
                border: "1px solid rgba(255,255,255,.11)",
                borderLeft: `3px solid ${e.tone}`,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,.13)",
                clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)",
                padding: "clamp(16px,2.4vw,22px)",
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  flex: "0 0 auto",
                  width: "clamp(96px,14vw,150px)",
                  alignSelf: "center",
                }}
              >
                <div
                  style={{
                    aspectRatio: "1",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,.14)",
                    clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)",
                    position: "relative",
                  }}
                >
                  <Image src={e.img} alt={e.title} fill style={{ objectFit: "cover" }} />
                </div>
              </div>

              {/* Date column */}
              <div
                style={{
                  flex: "0 0 auto",
                  alignSelf: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  minWidth: 64,
                }}
              >
                {(() => {
                  const d = e.date ? new Date(midday(e.date)) : null
                  const mon  = d ? MONTHS[d.getMonth()].slice(0, 3).toUpperCase() : nextMonth
                  const day  = d ? String(d.getDate())                             : nextDay
                  const dow  = d ? DAYS[d.getDay()].slice(0, 3).toUpperCase()      : nextDow
                  return (
                    <>
                      <span style={{ fontFamily:"ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize:12, letterSpacing:".18em", textTransform:"uppercase", color:e.tone }}>{mon}</span>
                      <span style={{ fontFamily:"Archivo,Helvetica,sans-serif", fontWeight:900, fontSize:"clamp(26px,3vw,36px)", lineHeight:1, color:"#FFFFFF", fontVariantNumeric:"tabular-nums" }}>{day}</span>
                      <span style={{ fontFamily:"ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize:11.5, letterSpacing:".16em", textTransform:"uppercase", color:"#91918F" }}>{dow}</span>
                    </>
                  )
                })()}
              </div>

              {/* Text */}
              <div
                style={{
                  flex: "3 1 240px",
                  minWidth: 0,
                  alignSelf: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "Archivo, Helvetica, sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(19px,2.2vw,26px)",
                    letterSpacing: "-.016em",
                    lineHeight: 1.12,
                    color: "#FFFFFF",
                  }}
                >
                  {e.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "Archivo, Helvetica, sans-serif",
                    fontSize: 15.5,
                    lineHeight: 1.52,
                    color: "#C4CBD6",
                    maxWidth: "52ch",
                  }}
                >
                  {e.blurb}
                </p>
              </div>

              {/* Meta + CTA */}
              <div
                style={{
                  flex: "2 1 220px",
                  minWidth: 0,
                  alignSelf: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {[
                  { k: "Time",  v: e.when,       vTone: "#EDF1F6" },
                  { k: "Where", v: "Lebanon, TN", vTone: "#EDF1F6" },
                  { k: "Entry", v: e.entry,       vTone: e.entryTone },
                ].map(row => (
                  <span
                    key={row.k}
                    style={{ display: "flex", alignItems: "baseline", gap: 9 }}
                  >
                    <span
                      style={{
                        fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                        fontSize: 11.5,
                        letterSpacing: ".18em",
                        textTransform: "uppercase",
                        color: "#91918F",
                        flex: "0 0 auto",
                      }}
                    >
                      {row.k}
                    </span>
                    <i
                      aria-hidden="true"
                      style={{
                        flex: "1 1 auto",
                        height: 0,
                        borderBottom: "1px dotted rgba(255,255,255,.2)",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                        fontSize: 12.5,
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        color: row.vTone,
                        flex: "0 0 auto",
                      }}
                    >
                      {row.v}
                    </span>
                  </span>
                ))}
                <div style={{ marginTop: 6 }}>
                  <Link
                    href={e.href}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontFamily: "Archivo, Helvetica, sans-serif",
                      fontWeight: 700,
                      fontSize: 13.5,
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                      background: e.tone,
                      color: "#101010",
                      padding: "12px 20px",
                      clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)",
                      textDecoration: "none",
                    }}
                  >
                    {e.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Creator Day feature section */}
        <section
          id="creator-day"
          style={{
            position: "relative",
            background: "linear-gradient(150deg,rgba(248,184,0,.10),rgba(255,255,255,.014))",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: "1px solid rgba(248,184,0,.3)",
            borderTop: "3px solid #F8B800",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            overflow: "hidden",
            isolation: "isolate",
            padding: "clamp(22px,3.4vw,36px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(20px,3vw,36px)",
          }}
        >
          {/* Background speedway image */}
          <Image
            src="/images/cullinan-speedway.webp"
            alt=""
            aria-hidden="true"
            fill
            style={{ objectFit: "cover", opacity: 0.4, zIndex: -1 }}
            loading="lazy"
          />
          <span
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, zIndex: -1,
              background: "linear-gradient(160deg,rgba(14,26,42,.97) 0%,rgba(14,26,42,.9) 52%,rgba(14,26,42,.64) 100%)",
            }}
          />

          {/* Left: text */}
          <div style={{ flex: "6 1 320px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#F8B800", padding: "6px 16px" }}>
                <span style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#101010" }}>
                  Sep 19 &middot; Creator Day
                </span>
              </span>
              <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#00D2BE" }}>
                {countdownLabel("2026-09-19")}
              </span>
            </div>
            <h2 style={{ margin: 0, fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 900, fontSize: "clamp(28px,4.4vw,48px)", lineHeight: 1, letterSpacing: "-.026em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "18ch" }}>
              Golden hour to golden hour,{" "}
              <span style={{ color: "#F8B800" }}>with the cars</span>
            </h2>
            <p style={{ margin: 0, fontFamily: "Archivo,Helvetica,sans-serif", fontSize: "clamp(16.5px,1.6vw,18px)", lineHeight: 1.58, color: "#DFE5EC", maxWidth: "58ch" }}>
              duPont REGISTRY sets up four to five installations with cars, and creators of every kind are invited. Shoot, film, paint, create &mdash; then post your best work.
            </p>
            <p style={{ margin: 0, fontFamily: "Archivo,Helvetica,sans-serif", fontSize: "clamp(16.5px,1.6vw,18px)", lineHeight: 1.58, color: "#C4CBD6", maxWidth: "58ch" }}>
              duPont votes, and the winner takes a creator bundle from a leading brand plus a full day to create with a duPont car of their choice.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <a
                href="https://ig.me/m/itspaddockgavin"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#F8B800", color: "#101010", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}
              >
                DM @itspaddockgavin
              </a>
              <a
                href="#inquire"
                style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.3)", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}
              >
                Book the floor
              </a>
            </div>
          </div>

          {/* Right: staggered 2×2 photo grid */}
          <div style={{ flex: "4 1 240px", minWidth: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignContent: "center" }}>
            {[
              { src: "/images/creator-booth-alt.jpg", alt: "Shooting the Ford GT MkII in the studio", mt: 0 },
              { src: "/images/ford-gt-studio-sq.webp", alt: "Ford GT studio angle", mt: 18 },
              { src: "/images/ferrari-red-sq.webp", alt: "Ferrari on the floor", mt: 0 },
              { src: "/images/donuts-inside.webp", alt: "The Donuts with duPont floor", mt: 18 },
            ].map((img, i) => (
              <div
                key={i}
                style={{ aspectRatio: "1", overflow: "hidden", border: "1px solid rgba(255,255,255,.14)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)", marginTop: img.mt, position: "relative" }}
              >
                <Image src={img.src} alt={img.alt} fill loading="lazy" style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </section>

        {/* Full-bleed photo */}
        <section
          style={{
            position: "relative",
            left: "50%",
            marginLeft: "-50vw",
            width: "100vw",
            height: "clamp(340px,56vh,600px)",
            overflow: "hidden",
          }}
        >
          <Image
            src="/images/donuts-inside.webp"
            alt="On the duPont REGISTRY floor — event morning"
            fill
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top,rgba(10,21,35,.9) 0%,rgba(10,21,35,.12) 42%,rgba(10,21,35,.3) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "0 clamp(12px,4vw,40px)",
            }}
          >
            <div
              style={{
                maxWidth: 1180,
                margin: "0 auto",
                padding: "0 0 20px",
                display: "flex",
                alignItems: "center",
                gap: 11,
              }}
            >
              <i aria-hidden="true" style={{ width: 26, height: 3, background: "#F8B800", flex: "0 0 auto" }} />
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12.5,
                  letterSpacing: ".16em",
                  lineHeight: 1.5,
                  textTransform: "uppercase",
                  color: "#EDF1F6",
                  textShadow: "0 1px 10px rgba(10,21,35,.9)",
                }}
              >
                The floor on a Donuts morning
              </span>
            </div>
          </div>
        </section>

        {/* Book the floor */}
        <section
          id="inquire"
          style={{
            position: "relative",
            background: "linear-gradient(150deg,rgba(0,81,133,.9),rgba(0,81,133,.66))",
            backdropFilter: "blur(22px) saturate(150%)",
            WebkitBackdropFilter: "blur(22px) saturate(150%)",
            border: "1px solid #0A6BAA",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            overflow: "hidden",
            isolation: "isolate",
            padding: "clamp(22px,3.2vw,34px)",
            scrollMarginTop: 150,
          }}
        >
          <Image
            src="/images/donuts-floor.webp"
            alt=""
            aria-hidden="true"
            fill
            style={{ objectFit: "cover", opacity: 0.18, zIndex: -1 }}
            loading="lazy"
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,40px)" }}>
            <div style={{ flex: "4 1 280px", minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    display: "inline-block",
                    transform: "skewX(-12deg)",
                    background: "#F8B800",
                    padding: "6px 16px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      transform: "skewX(12deg)",
                      fontFamily: "Archivo, Helvetica, sans-serif",
                      fontWeight: 700,
                      fontSize: 12.5,
                      letterSpacing: ".16em",
                      textTransform: "uppercase",
                      color: "#101010",
                    }}
                  >
                    Private events
                  </span>
                </span>
              </div>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(26px,3.6vw,42px)",
                  lineHeight: 1.02,
                  letterSpacing: "-.026em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  maxWidth: "20ch",
                }}
              >
                Book the floor<br />
                <span style={{ color: "#F8B800" }}>for your event</span>
              </h2>
              <p
                style={{
                  margin: 0,
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontSize: "clamp(16px,1.6vw,18px)",
                  lineHeight: 1.58,
                  color: "#CFE4F4",
                  maxWidth: "52ch",
                }}
              >
                Corporate shoot, launch event, car reveal, private meet &mdash; the duPont REGISTRY floor in Lebanon holds all of it. Booking it is part of my job. Send me a date and I will check it.
              </p>
              {[
                { label: "Capacity", val: "Up to 300 guests" },
                { label: "Cars", val: "Whatever is in inventory" },
                { label: "Catering", val: "Coordinate through us" },
              ].map(row => (
                <span key={row.label} style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
                  <span
                    style={{
                      fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                      fontSize: 12,
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                      color: "#91918F",
                      flex: "0 0 auto",
                    }}
                  >
                    {row.label}
                  </span>
                  <i
                    aria-hidden="true"
                    style={{
                      flex: "1 1 auto",
                      height: 0,
                      borderBottom: "1px dotted rgba(255,255,255,.28)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                      fontSize: 13,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "#CFE4F4",
                      flex: "0 0 auto",
                    }}
                  >
                    {row.val}
                  </span>
                </span>
              ))}
            </div>

            {/* Inquiry form */}
            <div style={{ flex: "5 1 320px", minWidth: 0 }}>
              {status === "sent" ? (
                <div
                  style={{
                    padding: "clamp(22px,3vw,32px)",
                    background: "rgba(0,210,190,.10)",
                    border: "1px solid rgba(0,210,190,.30)",
                    clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)",
                  }}
                >
                  <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 19, color: "#00D2BE" }}>
                    Got it. I&rsquo;ll be in touch.
                  </p>
                  <p style={{ margin: "8px 0 0", fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 16, color: "#B4B6B2" }}>
                    Or DM{" "}
                    <a href="https://instagram.com/itspaddockgavin" target="_blank" rel="noopener noreferrer" style={{ color: "#00D2BE" }}>
                      @itspaddockgavin
                    </a>{" "}
                    on Instagram.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    background: "rgba(8,17,29,.72)",
                    border: "1px solid rgba(255,255,255,.16)",
                    clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
                    padding: "clamp(20px,2.8vw,30px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(200px,100%),1fr))", gap: 12 }}>
                    {[
                      { key: "name" as const, label: "Your name", ph: "Gavin Brooks" },
                      { key: "email" as const, label: "Email", ph: "gavin@example.com" },
                      { key: "phone" as const, label: "Phone (optional)", ph: "(615) 555-0100" },
                      { key: "date" as const, label: "Date you have in mind", ph: "Sept 27, 2026" },
                      { key: "size" as const, label: "Expected size", ph: "50 – 100 guests" },
                    ].map(f => (
                      <label key={f.key} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        <span
                          style={{
                            fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                            fontSize: 12,
                            letterSpacing: ".16em",
                            textTransform: "uppercase",
                            color: "#91918F",
                          }}
                        >
                          {f.label}
                        </span>
                        <input
                          type="text"
                          placeholder={f.ph}
                          value={form[f.key]}
                          onChange={update(f.key)}
                          style={inputStyle}
                        />
                      </label>
                    ))}
                  </div>
                  <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <span
                      style={{
                        fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                        fontSize: 12,
                        letterSpacing: ".16em",
                        textTransform: "uppercase",
                        color: "#91918F",
                      }}
                    >
                      Tell me about the event (optional)
                    </span>
                    <textarea
                      placeholder="Corporate launch, charity event, brand shoot..."
                      value={form.notes}
                      onChange={update("notes")}
                      rows={4}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </label>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={submit}
                      disabled={!form.name.trim() || !form.email.trim() || status === "sending"}
                      style={{
                        fontFamily: "Archivo, Helvetica, sans-serif",
                        fontWeight: 700,
                        fontSize: 15,
                        letterSpacing: ".04em",
                        textTransform: "uppercase",
                        background: form.name.trim() && form.email.trim() ? "#F8B800" : "rgba(248,184,0,.3)",
                        color: "#101010",
                        padding: "15px 28px",
                        border: "none",
                        cursor: form.name.trim() && form.email.trim() ? "pointer" : "default",
                        clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
                        transition: "background .18s",
                      }}
                    >
                      {status === "sending" ? "Sending\u2026" : "Check a date"}
                    </button>
                    {status === "error" && (
                      <span style={{ fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 14, color: "#F87171" }}>
                        Something went wrong. DM{" "}
                        <a href="https://instagram.com/itspaddockgavin" target="_blank" rel="noopener noreferrer" style={{ color: "#F87171" }}>
                          @itspaddockgavin
                        </a>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
