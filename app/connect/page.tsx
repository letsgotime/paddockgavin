"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

type Shift = "day" | "night"

const HANDLE = "PaddockGavin"

const GROUPS = [
  {
    key: "watch",
    label: "Watch and follow",
    tone: "#00D2BE",
    links: [
      {
        key: "ig",
        title: "Instagram",
        note: "The clips land here first",
        href: `https://instagram.com/${HANDLE}`,
        target: "_blank",
        tone: "#00D2BE",
        datum: `@${HANDLE}`,
      },
      {
        key: "wall",
        title: "The wall",
        note: "Every clip, filtered by pillar",
        href: "/#wall",
        target: "_self",
        tone: "#F2C94C",
        datum: null as string | null,
      },
      {
        key: "gal",
        title: "The gallery",
        note: "Three pillars of stills",
        href: "/gallery",
        target: "_self",
        tone: "#00D2BE",
        datum: null as string | null,
      },
    ],
  },
  {
    key: "come",
    label: "Come see us",
    tone: "#F2C94C",
    links: [
      {
        key: "donuts",
        title: "Donuts with duPont",
        note: "Free, monthly, 8\u201311am in Lebanon TN",
        href: "/donuts",
        target: "_self",
        tone: "#F2C94C",
        datum: "Free",
      },
      {
        key: "floor",
        title: "Book the floor",
        note: "duPont REGISTRY\u2019s showroom, and I run the events on it",
        href: "/events",
        target: "_self",
        tone: "#4BA3DE",
        datum: null as string | null,
      },
    ],
  },
  {
    key: "built",
    label: "Things I built",
    tone: "#4BA3DE",
    links: [
      {
        key: "gloss",
        title: "The Gloss Game",
        note: "The book, on Amazon today",
        href: "https://www.amazon.com/s?k=The+Gloss+Game+Gavin+Brooks",
        target: "_blank",
        tone: "#F2C94C",
        datum: "Buy",
      },
      {
        key: "siq",
        title: "Supercar IQ",
        note: "Point a phone at a car and it tells you what it is",
        href: "https://supercariq.com",
        target: "_blank",
        tone: "#00D2BE",
        datum: null as string | null,
      },
      {
        key: "board",
        title: "The scoreboard",
        note: "Everything on the night shift, with dates",
        href: "/scoreboard",
        target: "_self",
        tone: "#4BA3DE",
        datum: null as string | null,
      },
    ],
  },
  {
    key: "work",
    label: "Work with me",
    tone: "#B4B6B2",
    links: [
      {
        key: "find",
        title: "Find me a car",
        note: "Sourced through duPont REGISTRY. The fee to you is zero",
        href: "/intake",
        target: "_self",
        tone: "#F2C94C",
        datum: "No fee",
      },
      {
        key: "garage",
        title: "The garage",
        note: "29 of my own, and what happened to each",
        href: "/garage",
        target: "_self",
        tone: "#B4B6B2",
        datum: "29",
      },
      {
        key: "p20",
        title: "Paddock20",
        note: "Software and marketing, the night-shift agency",
        href: "https://paddock20.com",
        target: "_blank",
        tone: "#00D2BE",
        datum: null as string | null,
      },
      {
        key: "hq",
        title: "gavinbrookshq.com",
        note: "The operator side \u2014 metrics, systems, r\u00e9sum\u00e9",
        href: "https://gavinbrookshq.com",
        target: "_blank",
        tone: "#848482",
        datum: null as string | null,
      },
      {
        key: "li",
        title: "LinkedIn",
        note: "Gavin Brooks \u2014 the leadership side",
        href: "https://www.linkedin.com/in/gavinbrooksleader",
        target: "_blank",
        tone: "#4BA3DE",
        datum: null as string | null,
      },
    ],
  },
]

export default function ConnectPage() {
  const [shift, setShift] = useState<Shift>("day")
  const [clock, setClock] = useState("\u2014")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
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

  const accent = shift === "day" ? "#F2C94C" : "#00D2BE"

  const saveCard = () => {
    const card = [
      "BEGIN:VCARD", "VERSION:3.0",
      "N:Brooks;Gavin;;;", "FN:Gavin Brooks",
      "NICKNAME:PaddockGavin",
      "ORG:duPont REGISTRY", "TITLE:Lot Operations and Events Manager",
      "ADR;TYPE=WORK:;;;Nashville;TN;;USA",
      "URL:https://paddockgavin.com",
      `X-SOCIALPROFILE;TYPE=instagram:https://instagram.com/${HANDLE}`,
      "END:VCARD",
    ].join("\r\n")
    const url = URL.createObjectURL(new Blob([card], { type: "text/vcard" }))
    const a = document.createElement("a")
    a.href = url; a.download = "PaddockGavin.vcf"
    document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 4000)
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  const days = Math.ceil((Date.parse("2026-09-30") - Date.now()) / 86400000)

  const readouts = [
    { label: "Instagram", value: `@${HANDLE}`, tone: "#00D2BE" },
    { label: "Based",     value: "Nashville, TN", tone: "#F2C94C" },
    { label: "Replies from", value: "Me", tone: "#B4B6B2" },
  ]

  // patch up the Supercar IQ datum dynamically
  const patchedGroups = GROUPS.map(g => ({
    ...g,
    links: g.links.map(l =>
      l.key === "siq" ? { ...l, datum: days > 0 ? `${days} days` : "Live" } : l
    ),
  }))

  return (
    <>
      <SiteNav active="connect" />

      {/* Fixed background */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", background: "#0A1523" }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.24 }}>
          <Image src="/images/donuts-lot.webp" alt="" fill style={{ objectFit: "cover" }} />
        </div>
        <div
          style={{
            position: "absolute", inset: 0, transition: "background 1.4s ease",
            background: shift === "day"
              ? "radial-gradient(900px 640px at 82% -8%,rgba(242,201,76,.17),transparent 60%),radial-gradient(900px 660px at 4% 34%,rgba(0,81,133,.38),transparent 62%),linear-gradient(180deg,rgba(10,21,35,.82),rgba(10,21,35,.94))"
              : "radial-gradient(900px 640px at 84% -6%,rgba(0,210,190,.19),transparent 60%),radial-gradient(900px 660px at 4% 32%,rgba(0,81,133,.46),transparent 62%),linear-gradient(180deg,rgba(10,21,35,.88),rgba(10,21,35,.96))",
          }}
        />
      </div>

      <main
        style={{
          position: "relative", zIndex: 1, minWidth: 0, maxWidth: 720, margin: "0 auto",
          padding: "clamp(16px,3vw,28px) clamp(14px,4vw,28px) clamp(40px,7vw,80px)",
          display: "flex", flexDirection: "column", gap: "clamp(14px,2.4vw,20px)",
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
            display: "flex", flexDirection: "column", gap: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(14px,3vw,20px)", flexWrap: "wrap" }}>
            {/* Face */}
            <div
              style={{
                flex: "0 0 auto", width: "clamp(84px,20vw,110px)", aspectRatio: "1",
                border: "1px solid rgba(255,255,255,.18)",
                clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)",
                overflow: "hidden", background: "rgba(21,37,56,.6)", position: "relative",
              }}
            >
              <Image src="/images/gavin-bar-sq.webp" alt="Gavin Brooks" fill style={{ objectFit: "cover" }} sizes="110px" />
            </div>
            <div style={{ flex: "1 1 200px", minWidth: 0, display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                <i
                  aria-hidden="true"
                  style={{ width: 9, height: 9, borderRadius: "50%", background: accent, boxShadow: `0 0 12px ${accent}`, flex: "0 0 auto", display: "block" }}
                />
                <span
                  style={{
                    fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                    fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: accent,
                  }}
                >
                  {shift === "day" ? "Day shift" : "Night shift"} &middot; {clock}
                </span>
              </span>
              <h1
                style={{
                  margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900,
                  fontSize: "clamp(30px,7vw,46px)", lineHeight: 1, letterSpacing: "-.028em", textTransform: "uppercase",
                }}
              >
                <span style={{ color: "#F2C94C" }}>Paddock</span>
                <span style={{ color: "#00D2BE" }}>Gavin</span>
              </h1>
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#B4B6B2",
                }}
              >
                Gavin Brooks &middot; Nashville, TN
              </span>
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#F2C94C",
                }}
              >
                A life bent toward cars
              </span>
            </div>
          </div>
          <p
            style={{
              margin: 0, fontFamily: "Archivo, Helvetica, sans-serif",
              fontSize: "clamp(16px,4vw,18px)", lineHeight: 1.58, color: "#C4CBD6",
            }}
          >
            Lot Operations and Events Manager at duPont REGISTRY by day. Software and a book by night. Everything I answer comes from one inbox.
          </p>
          {/* Readouts */}
          <div
            style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(120px,45%),1fr))",
              gap: 14, borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 16,
            }}
          >
            {readouts.map(r => (
              <span key={r.label} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F" }}>{r.label}</span>
                <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 15, letterSpacing: ".08em", textTransform: "uppercase", color: r.tone, fontVariantNumeric: "tabular-nums" }}>{r.value}</span>
              </span>
            ))}
          </div>
        </header>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={saveCard}
            style={{
              flex: "1 1 200px", cursor: "pointer", display: "inline-flex", alignItems: "center",
              justifyContent: "center", minHeight: 56,
              fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15,
              letterSpacing: ".06em", textTransform: "uppercase",
              background: "#F2C94C", color: "#101010", border: 0, padding: "16px 24px",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
            }}
          >
            {saved ? "Saved to contacts" : "Save my contact"}
          </button>
          <a
            href="https://ig.me/m/itspaddockgavin"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: "1 1 200px", display: "inline-flex", alignItems: "center",
              justifyContent: "center", minHeight: 56,
              fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15,
              letterSpacing: ".06em", textTransform: "uppercase",
              background: "rgba(255,255,255,.05)", color: "#EDF1F6",
              border: "1px solid rgba(255,255,255,.24)",
              backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              padding: "16px 24px",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
              textDecoration: "none",
            }}
          >
            DM @itspaddockgavin
          </a>
        </div>

        {/* Link groups */}
        {patchedGroups.map(g => (
          <section key={g.key} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 2px 0" }}>
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: g.tone,
                }}
              >
                {g.label}
              </span>
              <i aria-hidden="true" style={{ flex: "1 1 auto", height: 0, borderBottom: "1px dotted rgba(255,255,255,.16)", display: "block" }} />
            </div>
            {g.links.map(l => (
              <a
                key={l.key}
                href={l.href}
                target={l.target}
                rel={l.target === "_blank" ? "noopener noreferrer" : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 14, minHeight: 64, textDecoration: "none",
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
                  <span style={{ fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 800, fontSize: "clamp(16px,4vw,19px)", letterSpacing: "-.012em", lineHeight: 1.15, color: "#FFFFFF" }}>{l.title}</span>
                  <span style={{ fontFamily: "Archivo,Helvetica,sans-serif", fontSize: 14.5, lineHeight: 1.45, color: "#B4B6B2" }}>{l.note}</span>
                </span>
                {l.datum && (
                  <span
                    style={{
                      flex: "0 0 auto", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                      fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase",
                      color: l.tone, textAlign: "right", fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {l.datum}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  style={{ flex: "0 0 auto", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 17, color: l.tone }}
                >
                  &rsaquo;
                </span>
              </a>
            ))}
          </section>
        ))}

        {/* Fastest lane */}
        <footer
          style={{
            background: "linear-gradient(150deg,rgba(0,81,133,.88),rgba(0,81,133,.62))",
            backdropFilter: "blur(22px) saturate(150%)",
            WebkitBackdropFilter: "blur(22px) saturate(150%)",
            border: "1px solid #0A6BAA",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            padding: "clamp(20px,3.2vw,30px)",
            display: "flex", flexDirection: "column", gap: 14,
          }}
        >
          <span
            style={{
              fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
              fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4",
            }}
          >
            The fastest lane
          </span>
          <a
            href="https://ig.me/m/itspaddockgavin"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900,
              fontSize: "clamp(19px,5vw,28px)", letterSpacing: "-.02em",
              color: "#FFFFFF", overflowWrap: "anywhere", textDecoration: "none",
            }}
          >
            DM @itspaddockgavin
          </a>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 16, lineHeight: 1.55, color: "#CFE4F4" }}>
            DMs get seen between jobs, and a person answers &mdash; usually me. Forms on the events pages land the same day.
          </p>
        </footer>
      </main>

      <div style={{ position: "relative", zIndex: 1 }}>
        <SiteFooter />
      </div>
    </>
  )
}
