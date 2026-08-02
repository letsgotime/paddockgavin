"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

type Shift = "day" | "night"

const GROUPS = [
  {
    label: "Social",
    tone: "#F8B800",
    links: [
      {
        title: "@itspaddockgavin",
        note: "Instagram — new frames, lot life, and whatever rolled in that morning",
        href: "https://instagram.com/itspaddockgavin",
        target: "_blank",
        tone: "#F8B800",
        datum: "Instagram",
      },
      {
        title: "Gavin Brooks",
        note: "LinkedIn — twenty-six years of technology, in case you need the resume version",
        href: "https://www.linkedin.com/in/gavinbrooks-leader/",
        target: "_blank",
        tone: "#4BA3DE",
        datum: "LinkedIn",
      },
      {
        title: "@gotimemotorsports",
        note: "GoTime Motorsports on Instagram — the enthusiast brand",
        href: "https://www.instagram.com/gotimemotorsports/",
        target: "_blank",
        tone: "#00D2BE",
        datum: "Instagram",
      },
    ],
  },
  {
    label: "Day shift",
    tone: "#F8B800",
    links: [
      {
        title: "Donuts with duPont",
        note: "Last Saturday of every month. Free, no ticket. Lebanon, Tennessee.",
        href: "/donuts",
        target: "_self",
        tone: "#F8B800",
        datum: "Monthly",
      },
      {
        title: "Book the floor",
        note: "Private events on the duPont REGISTRY floor. Shoots, launches, meets.",
        href: "/events#inquire",
        target: "_self",
        tone: "#F8B800",
        datum: null,
      },
      {
        title: "Find a car",
        note: "Tell me the spec and the budget. We source through duPont REGISTRY.",
        href: "/intake",
        target: "_self",
        tone: "#B4B6B2",
        datum: "78 found",
      },
    ],
  },
  {
    label: "Night shift",
    tone: "#00D2BE",
    links: [
      {
        title: "Supercar IQ",
        note: "Point a phone at a car and it tells you what it is. Launching Sept 2026.",
        href: "https://supercariq.com",
        target: "_blank",
        tone: "#00D2BE",
        datum: "Sept 2026",
      },
      {
        title: "The Gloss Game",
        note: "The book. What goes on the paint, by car, and the reason for each one.",
        href: "https://www.amazon.com/s?k=The+Gloss+Game+Gavin+Brooks",
        target: "_blank",
        tone: "#F8B800",
        datum: "Amazon",
      },
      {
        title: "Paddock20",
        note: "Software and marketing for businesses. The agency the night work runs through.",
        href: "https://paddock20.com",
        target: "_blank",
        tone: "#00D2BE",
        datum: "paddock20.com",
      },
    ],
  },
  {
    label: "Elsewhere",
    tone: "#B4B6B2",
    links: [
      {
        title: "The gallery",
        note: "Shot on a phone between jobs. Three pillars: details, paint, the room.",
        href: "/gallery",
        target: "_self",
        tone: "#00D2BE",
        datum: null,
      },
      {
        title: "The scoreboard",
        note: "Everything I build on my own time, with live status and launch countdowns.",
        href: "/scoreboard",
        target: "_self",
        tone: "#4BA3DE",
        datum: null,
      },
      {
        title: "gavinbrookshq.com",
        note: "The professional biography. The long version of twenty-six years.",
        href: "https://gavinbrookshq.com",
        target: "_blank",
        tone: "#B4B6B2",
        datum: null,
      },
    ],
  },
]

function Readouts({ shift, clock }: { shift: Shift; clock: string }) {
  const accent = shift === "day" ? "#F8B800" : "#00D2BE"
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(min(120px,45%),1fr))",
        gap: 14,
        borderTop: "1px solid rgba(255,255,255,.12)",
        paddingTop: 16,
      }}
    >
      {[
        { label: "Shift",    value: shift === "day" ? "Day shift" : "Night shift", tone: accent },
        { label: "Nashville",value: clock,                                          tone: "#EDF1F6" },
        { label: "Location", value: "Nashville, TN",                               tone: "#B4B6B2" },
      ].map(r => (
        <span key={r.label} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <span
            style={{
              fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
              fontSize: 12,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: "#91918F",
            }}
          >
            {r.label}
          </span>
          <span
            style={{
              fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
              fontSize: 15,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: r.tone,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {r.value}
          </span>
        </span>
      ))}
    </div>
  )
}

export default function ConnectPage() {
  const [shift, setShift] = useState<Shift>("day")
  const [clock, setClock] = useState("\u2014")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const tick = () => {
      const now  = new Date()
      const hour = Number(
        new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", hour12: false }).format(now)
      )
      setShift(hour >= 8 && hour < 18 ? "day" : "night")
      setClock(
        now.toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" })
          .replace(/\s/g, "\u2009")
      )
    }
    tick()
    const t = setInterval(tick, 20000)
    return () => clearInterval(t)
  }, [])

  const accent = shift === "day" ? "#F8B800" : "#00D2BE"

  const copyEmail = () => {
    navigator.clipboard.writeText("gavin@gotimemotorsports.com").then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    })
  }

  return (
    <>
      <SiteNav active="connect" />
      <main
        style={{
          position: "relative",
          zIndex: 1,
          minWidth: 0,
          maxWidth: 720,
          margin: "0 auto",
          padding: "clamp(16px,3vw,28px) clamp(14px,4vw,28px) clamp(40px,7vw,80px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(14px,2.4vw,20px)",
        }}
      >
        {/* Profile card */}
        <header
          style={{
            background: "linear-gradient(150deg,rgba(255,255,255,.075),rgba(255,255,255,.016))",
            backdropFilter: "blur(26px) saturate(165%)",
            WebkitBackdropFilter: "blur(26px) saturate(165%)",
            border: "1px solid rgba(255,255,255,.12)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.15)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            padding: "clamp(20px,3.2vw,30px)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(14px,3vw,20px)", flexWrap: "wrap" }}>
            {/* Face photo */}
            <div
              style={{
                flex: "0 0 auto",
                width: "clamp(84px,20vw,110px)",
                aspectRatio: "1",
                border: "1px solid rgba(255,255,255,.18)",
                clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)",
                overflow: "hidden",
                background: "rgba(21,37,56,.6)",
                position: "relative",
              }}
            >
              <Image
                src="/images/gavin-bar-sq.webp"
                alt="Gavin Brooks"
                fill
                style={{ objectFit: "cover" }}
                sizes="110px"
              />
            </div>
            <div style={{ flex: "1 1 200px", minWidth: 0, display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                <i
                  aria-hidden="true"
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: accent,
                    boxShadow: `0 0 12px ${accent}`,
                    flex: "0 0 auto",
                  }}
                />
                <span
                  style={{
                    fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                    fontSize: 12,
                    letterSpacing: ".2em",
                    textTransform: "uppercase",
                    color: accent,
                  }}
                >
                  {shift === "day" ? "Day shift" : "Night shift"} &middot; {clock}
                </span>
              </span>
              <h1
                style={{
                  margin: 0,
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(30px,7vw,46px)",
                  lineHeight: 1,
                  letterSpacing: "-.028em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "#F8B800" }}>Paddock</span>
                <span style={{ color: "#00D2BE" }}>Gavin</span>
              </h1>
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12.5,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#B4B6B2",
                }}
              >
                Gavin Brooks &middot; Nashville, TN
              </span>
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12.5,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#F8B800",
                }}
              >
                A life bent toward cars
              </span>
            </div>
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontSize: "clamp(16px,4vw,18px)",
              lineHeight: 1.58,
              color: "#C4CBD6",
            }}
          >
            Lot Operations and Events Manager at duPont REGISTRY by day. Software and a book by night. Everything I answer comes from one inbox.
          </p>
          <Readouts shift={shift} clock={clock} />
        </header>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            href="https://ig.me/m/itspaddockgavin"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: "1 1 200px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 56,
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: ".06em",
              textTransform: "uppercase",
              background: "#F8B800",
              color: "#101010",
              padding: "16px 24px",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
              textDecoration: "none",
            }}
          >
            DM on Instagram
          </a>
          <button
            type="button"
            onClick={copyEmail}
            style={{
              flex: "1 1 200px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 56,
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: ".06em",
              textTransform: "uppercase",
              background: "rgba(255,255,255,.05)",
              color: copied ? "#00D2BE" : "#EDF1F6",
              border: `1px solid ${copied ? "rgba(0,210,190,.4)" : "rgba(255,255,255,.24)"}`,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              padding: "16px 24px",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
              transition: "border-color .18s,color .18s",
            }}
          >
            {copied ? "Copied" : "Copy email"}
          </button>
        </div>

        {/* Link groups */}
        {GROUPS.map(g => (
          <section key={g.label} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "6px 2px 0",
              }}
            >
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12,
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: g.tone,
                }}
              >
                {g.label}
              </span>
              <i
                aria-hidden="true"
                style={{ flex: "1 1 auto", height: 0, borderBottom: "1px dotted rgba(255,255,255,.16)" }}
              />
            </div>
            {g.links.map(l => (
              <a
                key={l.href + l.title}
                href={l.href}
                target={l.target}
                rel={l.target === "_blank" ? "noopener noreferrer" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  minHeight: 64,
                  textDecoration: "none",
                  background: "linear-gradient(150deg,rgba(255,255,255,.062),rgba(255,255,255,.014))",
                  backdropFilter: "blur(20px) saturate(155%)",
                  WebkitBackdropFilter: "blur(20px) saturate(155%)",
                  border: "1px solid rgba(255,255,255,.11)",
                  borderLeft: `3px solid ${l.tone}`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,.13)",
                  clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)",
                  padding: "15px clamp(16px,3vw,22px)",
                  transition: "background .2s",
                }}
              >
                <span style={{ flex: "1 1 auto", minWidth: 0, display: "flex", flexDirection: "column", gap: 5 }}>
                  <span
                    style={{
                      fontFamily: "Archivo, Helvetica, sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(16px,4vw,19px)",
                      letterSpacing: "-.012em",
                      lineHeight: 1.15,
                      color: "#FFFFFF",
                    }}
                  >
                    {l.title}
                  </span>
                  <span
                    style={{
                      fontFamily: "Archivo, Helvetica, sans-serif",
                      fontSize: 14.5,
                      lineHeight: 1.45,
                      color: "#B4B6B2",
                    }}
                  >
                    {l.note}
                  </span>
                </span>
                {l.datum && (
                  <span
                    style={{
                      flex: "0 0 auto",
                      fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                      fontSize: 12,
                      letterSpacing: ".14em",
                      textTransform: "uppercase",
                      color: l.tone,
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {l.datum}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  style={{
                    flex: "0 0 auto",
                    fontFamily: "Archivo, Helvetica, sans-serif",
                    fontWeight: 700,
                    fontSize: 17,
                    color: l.tone,
                  }}
                >
                  &rsaquo;
                </span>
              </a>
            ))}
          </section>
        ))}

        {/* Fastest lane footer */}
        <footer
          style={{
            background: "linear-gradient(150deg,rgba(0,81,133,.88),rgba(0,81,133,.62))",
            backdropFilter: "blur(22px) saturate(150%)",
            WebkitBackdropFilter: "blur(22px) saturate(150%)",
            border: "1px solid #0A6BAA",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            padding: "clamp(20px,3.2vw,30px)",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <span
            style={{
              fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
              fontSize: 12,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: "#CFE4F4",
            }}
          >
            The fastest lane
          </span>
          <a
            href="https://ig.me/m/itspaddockgavin"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(19px,5vw,28px)",
              letterSpacing: "-.02em",
              color: "#FFFFFF",
              overflowWrap: "anywhere",
              textDecoration: "none",
            }}
          >
            DM @itspaddockgavin
          </a>
          <p
            style={{
              margin: 0,
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontSize: 16,
              lineHeight: 1.55,
              color: "#CFE4F4",
            }}
          >
            DMs get seen between jobs, and a person answers &mdash; usually me. Forms on the events pages land the same day.
          </p>
        </footer>
      </main>
      <SiteFooter />
    </>
  )
}
