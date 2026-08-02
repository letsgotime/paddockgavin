"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

type Group = "all" | "shipping" | "live" | "past"

const BUILDS = [
  {
    key: "siq",
    name: "Supercar IQ",
    host: "supercariq.com",
    href: "https://supercariq.com",
    what: "Point a phone at a car and it tells you what it is. Subscription, monthly or yearly.",
    status: "building" as const,
    launch: "2026-09-30",
    group: "shipping" as Group,
  },
  {
    key: "gloss",
    name: "The Gloss Game",
    host: "Amazon",
    href: "https://www.amazon.com/s?k=The+Gloss+Game+Gavin+Brooks",
    what: "The book. What goes on the paint, by car, and the reason for each one.",
    status: "shipped" as const,
    datum: "Buy it",
    group: "shipping" as Group,
  },
  {
    key: "p20",
    name: "Paddock20",
    host: "paddock20.com",
    href: "https://paddock20.com",
    what: "Software and marketing for businesses. The agency the night work runs through.",
    status: "live" as const,
    datum: "Open",
    group: "live" as Group,
  },
  {
    key: "pg",
    name: "paddockgavin.com",
    host: "",
    href: "",
    what: "This site. Cloudflare in front of it, Behold feeding the wall, and it fills itself in.",
    status: "live" as const,
    datum: "You are on it",
    group: "live" as Group,
  },
  {
    key: "tnt",
    name: "Tires & Timepieces",
    host: "",
    href: "",
    what: "A car and watch show. I started it, and it keeps happening.",
    status: "live" as const,
    datum: "Running",
    group: "live" as Group,
  },
  {
    key: "gotime",
    name: "GoTime Motorsports",
    host: "",
    href: "",
    what: "Founded 2021. A good company, and a side hustle. Folded into PaddockGavin.",

    status: "retired" as const,
    datum: "2021 \u2013 2026",
    group: "past" as Group,
  },
]

const STACK = [
  { key: "stream", role: "Video", name: "Cloudflare Stream", note: "Every clip, with captions burned in and poster frames it makes itself.", tone: "#F8B800" },
  { key: "images", role: "Photos", name: "Cloudflare Images", note: "One upload, five named sizes. The gallery never asks for a resize.", tone: "#00D2BE" },
  { key: "edge", role: "In front", name: "Cloudflare DDoS & WAF", note: "The site sits behind it, so a bad day for the internet is not a bad day here.", tone: "#4BA3DE" },
  { key: "behold", role: "The feed", name: "Behold", note: "Three Instagram accounts, read straight into the wall and the gallery.", tone: "#00D2BE" },
  { key: "more", role: "Next", name: "More to come", note: "Search, the ask-me archive, and whatever the lot turns up that needs building.", tone: "#848482" },
]

const TONE = {
  live:     { tone: "#00D2BE", pillBg: "rgba(0,210,190,.16)",  pillLine: "rgba(0,210,190,.42)",  pillInk: "#7FE6DC" },
  shipped:  { tone: "#F8B800", pillBg: "rgba(248,184,0,.16)",  pillLine: "rgba(248,184,0,.42)",  pillInk: "#FFD866" },
  building: { tone: "#4BA3DE", pillBg: "rgba(0,81,133,.55)",   pillLine: "#0A6BAA",              pillInk: "#CFE4F4" },
  retired:  { tone: "#848482", pillBg: "rgba(255,255,255,.05)", pillLine: "rgba(255,255,255,.18)", pillInk: "#B4B6B2" },
}

const GROUPS = [
  { key: "all",      label: "All" },
  { key: "shipping", label: "Shipping" },
  { key: "live",     label: "Live" },
  { key: "past",     label: "Retired" },
]

const READOUTS = [
  { label: "Builds",  value: String(BUILDS.length),                                               tone: "#00D2BE" },
  { label: "Shipping",value: String(BUILDS.filter(b => b.group === "shipping").length),            tone: "#4BA3DE" },
  { label: "Live",    value: String(BUILDS.filter(b => b.group === "live").length),                tone: "#00D2BE" },
  { label: "Retired", value: String(BUILDS.filter(b => b.group === "past").length),                tone: "#848482" },
]

function countdown(iso: string, now: number) {
  const days = Math.ceil((Date.parse(iso) - now) / 86400000)
  if (days > 1) return `${days}d to launch`
  if (days === 1) return "Tomorrow"
  if (days === 0) return "Today"
  return "Launched"
}

const S: Record<string, React.CSSProperties> = {
  card: {
    display: "flex",
    flexWrap: "wrap" as const,
    alignItems: "center",
    gap: "clamp(10px,1.6vw,20px)",
    background: "linear-gradient(150deg,rgba(255,255,255,.065),rgba(255,255,255,.013))",
    backdropFilter: "blur(22px) saturate(155%)",
    WebkitBackdropFilter: "blur(22px) saturate(155%)",
    border: "1px solid rgba(255,255,255,.11)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,.12)",
    clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)",
    padding: "clamp(14px,2vw,18px) clamp(16px,2vw,22px)",
  },
}

export default function ScoreboardPage() {
  const [filter, setFilter] = useState<Group>("all")
  const [now, setNow]       = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(t)
  }, [])

  const filtered = filter === "all" ? BUILDS : BUILDS.filter(b => b.group === filter)
  const counts   = Object.fromEntries(GROUPS.map(g => [g.key, g.key === "all" ? BUILDS.length : BUILDS.filter(b => b.group === g.key).length]))

  return (
    <>
      <SiteNav active="scoreboard" />

      {/* Fixed dark photo background — matches design doc */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", background: "#0A1523" }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
          <Image src="/images/918-p1.webp" alt="" fill style={{ objectFit: "cover" }} priority />
        </div>
        <div
          style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(1100px 740px at 86% -6%,rgba(0,210,190,.20),transparent 60%),radial-gradient(1000px 700px at 2% 34%,rgba(0,81,133,.44),transparent 62%),linear-gradient(180deg,rgba(10,21,35,.88),rgba(10,21,35,.96))",
          }}
        />
      </div>

      <main
        style={{
          position: "relative",
          zIndex: 1,
          minWidth: 0,
          maxWidth: 1180,
          margin: "0 auto",
          padding: "clamp(18px,3vw,30px) clamp(12px,4vw,40px) clamp(40px,7vw,84px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(16px,2.6vw,26px)",
        }}
      >
        {/* Header */}
        <header style={{ display: "flex", flexWrap: "wrap", gap: "clamp(14px,2.4vw,24px)", alignItems: "flex-end" }}>
          <div style={{ flex: "6 1 320px", minWidth: 0 }}>
            <span
              style={{
                display: "inline-block",
                transform: "skewX(-12deg)",
                background: "#00D2BE",
                padding: "6px 16px",
                margin: "0 0 16px",
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
                Night shift
              </span>
            </span>
            <h1
              style={{
                margin: "0 0 16px",
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(34px,6.2vw,68px)",
                lineHeight: 1,
                letterSpacing: "-.03em",
                textTransform: "uppercase",
                color: "#FFFFFF",
              }}
            >
              The board<br />
              <span style={{ color: "#00D2BE" }}>after the gate shuts</span>
            </h1>
            <p
              style={{
                margin: 0,
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontSize: "clamp(17px,1.7vw,19px)",
                lineHeight: 1.58,
                color: "#C4CBD6",
                maxWidth: "58ch",
              }}
            >
              Twenty-six years of technology moved to evenings. Everything here is mine, built on my own time. None of it is duPont REGISTRY&rsquo;s, and none of it runs on their hours.
            </p>
          </div>

          {/* Stats card */}
          <div
            style={{
              flex: "3 1 230px",
              minWidth: 0,
              background: "linear-gradient(150deg,rgba(255,255,255,.065),rgba(255,255,255,.013))",
              backdropFilter: "blur(22px) saturate(155%)",
              WebkitBackdropFilter: "blur(22px) saturate(155%)",
              border: "1px solid rgba(255,255,255,.11)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.13)",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
              padding: "clamp(18px,2.4vw,24px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(110px,45%),1fr))",
              gap: 14,
            }}
          >
            {READOUTS.map(r => (
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
        </header>

        {/* Board */}
        <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Filter chips */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 4 }}>
            {GROUPS.map(g => {
              const active = filter === g.key
              return (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => setFilter(g.key as Group)}
                  style={{
                    cursor: "pointer",
                    fontFamily: "Archivo, Helvetica, sans-serif",
                    fontWeight: 700,
                    fontSize: 12.5,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    padding: "9px 15px",
                    border: `1px solid ${active ? "#00D2BE" : "rgba(255,255,255,.18)"}`,
                    background: active ? "rgba(0,210,190,.14)" : "rgba(255,255,255,.04)",
                    color: active ? "#00D2BE" : "#B4B6B2",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    clipPath: "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)",
                    transition: "background .18s,border-color .18s,color .18s",
                  }}
                >
                  {g.label}{" "}
                  <span
                    style={{
                      opacity: 0.62,
                      fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                    }}
                  >
                    {counts[g.key]}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Column headers — hide on narrow */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "52px minmax(0,3fr) minmax(0,4fr) 132px 128px",
              gap: "0 clamp(12px,1.6vw,20px)",
              padding: "0 clamp(16px,2vw,22px) 10px",
            }}
          >
            {["Pos", "Build", "What it does", "Status", "Datum"].map((col, i) => (
              <span
                key={col}
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12,
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "#91918F",
                  textAlign: i === 4 ? "right" : "left",
                }}
              >
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((b, idx) => {
            const t = TONE[b.status]
            const datum =
              b.status === "building" && b.launch
                ? countdown(b.launch, now)
                : b.datum ?? b.status
            return (
              <div
                key={b.key}
                style={{
                  ...S.card,
                  borderLeft: `3px solid ${t.tone}`,
                }}
              >
                <span
                  style={{
                    flex: "0 0 34px",
                    fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                    fontSize: 15,
                    letterSpacing: ".06em",
                    color: t.tone,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    flex: "3 1 180px",
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Archivo, Helvetica, sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(18px,2vw,24px)",
                      letterSpacing: "-.016em",
                      color: "#FFFFFF",
                      lineHeight: 1.1,
                    }}
                  >
                    {b.name}
                  </span>
                  {b.host && b.href && (
                    <a
                      href={b.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                        fontSize: 12,
                        letterSpacing: ".12em",
                        color: "#91918F",
                        transition: "color .18s",
                        textDecoration: "none",
                      }}
                    >
                      {b.host}
                    </a>
                  )}
                </span>
                <span
                  style={{
                    flex: "4 1 240px",
                    minWidth: 0,
                    fontFamily: "Archivo, Helvetica, sans-serif",
                    fontSize: 15.5,
                    lineHeight: 1.5,
                    color: "#C4CBD6",
                  }}
                >
                  {b.what}
                </span>
                <span
                  style={{
                    flex: "0 0 auto",
                    display: "inline-flex",
                    alignItems: "center",
                    background: t.pillBg,
                    border: `1px solid ${t.pillLine}`,
                    padding: "7px 13px",
                    clipPath: "polygon(0 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Archivo, Helvetica, sans-serif",
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: ".16em",
                      textTransform: "uppercase",
                      color: t.pillInk,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {b.status}
                  </span>
                </span>
                <span
                  style={{
                    flex: "0 0 auto",
                    minWidth: 104,
                    textAlign: "right",
                    fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                    fontSize: 13,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: t.tone,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {datum}
                </span>
              </div>
            )
          })}

          {/* Reserved slot */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
              border: "1px dashed rgba(255,255,255,.18)",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)",
              padding: "clamp(14px,2vw,18px) clamp(16px,2vw,22px)",
            }}
          >
            <span
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 15,
                letterSpacing: ".06em",
                color: "#91918F",
                flex: "0 0 34px",
              }}
            >
              {String(filtered.length + 1).padStart(2, "0")}
            </span>
            <span
              style={{
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "#91918F",
              }}
            >
              Reserved &mdash; next build
            </span>
            <i
              aria-hidden="true"
              style={{
                flex: "1 1 auto",
                minWidth: 16,
                height: 0,
                borderBottom: "1px dotted rgba(255,255,255,.16)",
              }}
            />
            <a
              href="https://ig.me/m/itspaddockgavin"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "#00D2BE",
                textDecoration: "none",
              }}
            >
              Pitch one
            </a>
          </div>
        </section>

        {/* The stack */}
        <section
          style={{
            background: "linear-gradient(150deg,rgba(255,255,255,.065),rgba(255,255,255,.013))",
            backdropFilter: "blur(22px) saturate(155%)",
            WebkitBackdropFilter: "blur(22px) saturate(155%)",
            border: "1px solid rgba(255,255,255,.11)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.13)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            padding: "clamp(22px,3.2vw,34px)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
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
                Running this site
              </span>
            </span>
            <i
              aria-hidden="true"
              style={{ flex: "1 1 auto", minWidth: 16, height: 1, background: "rgba(255,255,255,.14)" }}
            />
            <span
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 12,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "#91918F",
              }}
            >
              More to come
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(230px,100%),1fr))",
              gap: "clamp(12px,1.8vw,18px)",
            }}
          >
            {STACK.map(t => (
              <div
                key={t.key}
                style={{
                  background: "rgba(10,21,35,.42)",
                  border: "1px solid rgba(255,255,255,.10)",
                  clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)",
                  padding: "16px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <i
                    aria-hidden="true"
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: t.tone,
                      boxShadow: `0 0 10px ${t.tone}`,
                      flex: "0 0 auto",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                      fontSize: 12,
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                      color: "#91918F",
                    }}
                  >
                    {t.role}
                  </span>
                </span>
                <span
                  style={{
                    fontFamily: "Archivo, Helvetica, sans-serif",
                    fontWeight: 800,
                    fontSize: 17,
                    letterSpacing: "-.01em",
                    color: "#FFFFFF",
                  }}
                >
                  {t.name}
                </span>
                <span
                  style={{
                    fontFamily: "Archivo, Helvetica, sans-serif",
                    fontSize: 14.5,
                    lineHeight: 1.5,
                    color: "#B4B6B2",
                  }}
                >
                  {t.note}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Day shift CTA */}
        <section
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(14px,2.4vw,22px)",
            alignItems: "center",
            background: "linear-gradient(150deg,rgba(0,81,133,.9),rgba(0,81,133,.66))",
            backdropFilter: "blur(22px) saturate(150%)",
            WebkitBackdropFilter: "blur(22px) saturate(150%)",
            border: "1px solid #0A6BAA",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            padding: "clamp(22px,3.2vw,34px)",
          }}
        >
          <div style={{ flex: "1 1 300px", minWidth: 0 }}>
            <span
              style={{
                display: "block",
                marginBottom: 12,
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 12,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "#CFE4F4",
              }}
            >
              Day shift is somewhere else
            </span>
            <h2
              style={{
                margin: "0 0 12px",
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(24px,3.2vw,36px)",
                lineHeight: 1.02,
                letterSpacing: "-.022em",
                textTransform: "uppercase",
                color: "#FFFFFF",
              }}
            >
              The lot, the floor and the events
            </h2>
            <p
              style={{
                margin: 0,
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontSize: 17,
                lineHeight: 1.58,
                color: "#CFE4F4",
                maxWidth: "54ch",
              }}
            >
              Eight to six I run lot operations and events for duPont REGISTRY in Lebanon. That work, and their floor, lives on its own pages.
            </p>
          </div>
          <div style={{ flex: "0 0 auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              href="/events"
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
              Book the floor
            </Link>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: ".04em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,.4)",
                padding: "15px 26px",
                clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
                textDecoration: "none",
              }}
            >
              Both shifts
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
