"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"

type Shift = "day" | "night"

const NAV_ITEMS = [
  { key: "home",      href: "/",                  label: "Home",               note: "Two shifts",      tone: "#F8B800" },
  { key: "gallery",   href: "/gallery",            label: "Gallery",            note: "Three pillars",   tone: "#00D2BE" },
  { key: "cars",      href: "/garage",             label: "The garage",         note: "29 cars",         tone: "#B4B6B2" },
  { key: "scoreboard",href: "/scoreboard",         label: "Scoreboard",         note: "What I build",    tone: "#4BA3DE" },
  { key: "events",    href: "/events",             label: "Events",             note: "Book the floor",  tone: "#4BA3DE" },
  { key: "donuts",    href: "/donuts",             label: "Donuts with duPont", note: "Come by",         tone: "#F8B800" },
  { key: "creator",   href: "/events/creator-day", label: "Creator Day",        note: "Sep 19",          tone: "#00D2BE" },
  { key: "why",       href: "/why-a-paddock",      label: "Why a Paddock",      note: "The word",        tone: "#00D2BE" },
  { key: "lotops",    href: "/lot-ops",            label: "Lot Ops in Action",  note: "Gate at 8",       tone: "#F8B800" },
  { key: "connect",   href: "/connect",            label: "Connect",            note: "Every link",      tone: "#00D2BE" },
  { key: "intake",    href: "/intake",             label: "Sell a car",         note: "Start the intake",tone: "#4BA3DE" },
]

interface Props {
  active?: string
}

export function SiteNav({ active = "home" }: Props) {
  const [open, setOpen]   = useState(false)
  const [shift, setShift] = useState<Shift>("day")
  const [clock, setClock] = useState("—")
  const [goldenFull, setGoldenFull] = useState("—")
  const [goldenNote, setGoldenNote] = useState("Working it out")

  // Nashville shift tick
  const tick = useCallback(() => {
    const now  = new Date()
    const hour = Number(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        hour: "numeric",
        hour12: false,
      }).format(now)
    )
    const s = hour >= 8 && hour < 18 ? "day" : "night"
    const c = now
      .toLocaleTimeString("en-US", {
        timeZone: "America/Chicago",
        hour: "numeric",
        minute: "2-digit",
      })
      .replace(/\s/g, "\u2009")
    setShift(s as Shift)
    setClock(c)
    document.body.dataset.pgShift = s
  }, [])

  // Golden hour from sunrise-sunset API
  const fetchGolden = useCallback(async () => {
    const fmt = (ms: number) =>
      new Date(ms)
        .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
        .replace(/\s/g, "\u2009")
    const mins = (a: number, b: number) => Math.max(1, Math.round((b - a) / 60000))
    const loadDay = async (offset: number) => {
      const d = new Date()
      d.setDate(d.getDate() + offset)
      const date =
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0")
      const j = await (
        await fetch(
          `https://api.sunrise-sunset.org/json?lat=36.1627&lng=-86.7816&formatted=0&date=${date}`
        )
      ).json()
      if (!j.results || j.status !== "OK") throw new Error("no data")
      const r = j.results
      const t = (k: string) => new Date(r[k]).getTime()
      const m = t("sunrise") - t("civil_twilight_begin")
      const e = t("civil_twilight_end") - t("sunset")
      return [
        { name: "Sunrise", start: t("sunrise") - (m * 2) / 3, end: t("sunrise") + m },
        { name: "Sunset", start: t("sunset") - e, end: t("sunset") + (e * 2) / 3 },
      ]
    }
    try {
      const win = await loadDay(0)
      const now = Date.now()
      const live = win.find((w) => now >= w.start && now <= w.end)
      if (live) {
        setGoldenFull("Happening now")
        setGoldenNote(`${live.name} golden hour, until ${fmt(live.end)}`)
        return
      }
      let next = win.find((w) => w.start > now)
      let when = "today"
      if (!next) {
        const tom = await loadDay(1)
        next = tom[0]
        when = "tomorrow"
      }
      if (next) {
        setGoldenFull(`${fmt(next.start)} \u2013 ${fmt(next.end)}`)
        setGoldenNote(
          `${next.name} golden hour ${when}, ${mins(next.start, next.end)} minutes of it`
        )
      }
    } catch {
      setGoldenFull("—")
      setGoldenNote("Could not reach the solar data")
    }
  }, [])

  useEffect(() => {
    tick()
    fetchGolden()
    const t = setInterval(tick, 20000)
    const g = setInterval(fetchGolden, 300000)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => {
      clearInterval(t)
      clearInterval(g)
      document.removeEventListener("keydown", onKey)
    }
  }, [tick, fetchGolden])

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : ""
    return () => { document.documentElement.style.overflow = "" }
  }, [open])

  const shiftColor = shift === "day" ? "#F8B800" : "#00D2BE"
  const shiftLabel = shift === "day" ? "Day shift" : "Night shift"

  return (
    <>
      {/* Fixed nav bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 80 }}>
        {/* Garage-door livery bar */}
        <div aria-hidden="true" style={{ display: "flex", height: 5 }}>
          <i style={{ flex: 1, background: "#F8B800" }} />
          <i style={{ flex: 1, background: "#00D2BE" }} />
          <i style={{ flex: 1, background: "#005185" }} />
          <i style={{ flex: 1, background: "#848482" }} />
        </div>

        {/* Nav strip */}
        <div
          style={{
            background: "linear-gradient(180deg,rgba(14,26,42,.92),rgba(14,26,42,.76))",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            borderBottom: "1px solid rgba(255,255,255,.10)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.10)",
          }}
        >
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: "clamp(10px,2vw,20px)",
              padding: "11px clamp(14px,4vw,40px)",
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              style={{
                flex: "0 0 auto",
                display: "inline-flex",
                alignItems: "center",
                gap: 11,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <Image
                src="/images/mark-on-dark-96.png"
                alt="PG mark"
                width={32}
                height={32}
                style={{ height: 32, width: "auto", display: "block" }}
              />
              <span
                style={{
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(19px,1.7vw,24px)",
                  letterSpacing: "-.018em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "#F8B800" }}>Paddock</span>
                <span style={{ color: "#00D2BE" }}>Gavin</span>
              </span>
            </Link>

            <span style={{ flex: "1 1 auto" }} />

            {/* Shift pill */}
            <span
              title="Nashville local time"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                flex: "0 0 auto",
                background: "rgba(255,255,255,.055)",
                border: "1px solid rgba(255,255,255,.14)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                padding: "7px 13px",
                clipPath:
                  "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)",
              }}
            >
              <i
                aria-hidden="true"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: shiftColor,
                  boxShadow: `0 0 10px ${shiftColor}`,
                  flex: "0 0 auto",
                }}
              />
              <span
                style={{
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 12.5,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#EDF1F6",
                  whiteSpace: "nowrap",
                }}
              >
                {shiftLabel}
              </span>
              <span
                className="pg-hide-xs"
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 13,
                  letterSpacing: ".06em",
                  color: shiftColor,
                  fontVariantNumeric: "tabular-nums",
                  whiteSpace: "nowrap",
                }}
              >
                {clock}
              </span>
            </span>

            {/* Menu button */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              style={{
                flex: "0 0 auto",
                height: 40,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "0 15px",
                cursor: "pointer",
                background: "rgba(255,255,255,.055)",
                border: "1px solid rgba(255,255,255,.18)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                clipPath:
                  "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)",
                transition: "border-color .18s",
                color: "#EDF1F6",
              }}
            >
              <span
                className="pg-hide-xs"
                style={{
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 12.5,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#EDF1F6",
                }}
              >
                Menu
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: 4, width: 18 }}>
                <i style={{ display: "block", height: 2, background: "#EDF1F6" }} />
                <i style={{ display: "block", height: 2, background: "#EDF1F6" }} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div aria-hidden="true" style={{ height: 75 }} />

      {/* Full-screen menu overlay */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 150,
            overflowY: "auto",
            background: "linear-gradient(160deg,rgba(10,21,35,.95),rgba(10,21,35,.98))",
            backdropFilter: "blur(40px) saturate(170%)",
            WebkitBackdropFilter: "blur(40px) saturate(170%)",
            animation: "pgNavIn .34s cubic-bezier(.16,1,.3,1) both",
          }}
        >
          <style>{`@keyframes pgNavIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`}</style>

          {/* Radial ambient glows */}
          <div
            aria-hidden="true"
            style={{
              position: "fixed",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(900px 620px at 84% 4%,rgba(0,210,190,.16),transparent 60%),radial-gradient(800px 600px at 6% 90%,rgba(248,184,0,.10),transparent 62%)",
            }}
          />

          {/* Top livery bar */}
          <div
            aria-hidden="true"
            style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", height: 5 }}
          >
            <i style={{ flex: 1, background: "#F8B800" }} />
            <i style={{ flex: 1, background: "#00D2BE" }} />
            <i style={{ flex: 1, background: "#005185" }} />
            <i style={{ flex: 1, background: "#848482" }} />
          </div>

          <div
            style={{
              position: "relative",
              maxWidth: 1180,
              margin: "0 auto",
              padding:
                "clamp(72px,8vw,104px) clamp(16px,4vw,40px) clamp(40px,6vw,72px)",
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexWrap: "wrap",
                marginBottom: "clamp(26px,3.6vw,40px)",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <i
                  aria-hidden="true"
                  style={{ width: 26, height: 3, background: shiftColor }}
                />
                <span
                  style={{
                    fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                    fontSize: 12.5,
                    letterSpacing: ".2em",
                    textTransform: "uppercase",
                    color: "#EDF1F6",
                  }}
                >
                  {shiftLabel} &middot; {clock} Nashville
                </span>
              </span>
              <i
                aria-hidden="true"
                style={{
                  flex: "1 1 auto",
                  minWidth: 16,
                  height: 1,
                  background: "rgba(255,255,255,.14)",
                }}
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                style={{
                  width: 44,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.2)",
                  color: "#EDF1F6",
                  fontSize: 22,
                  lineHeight: 1,
                  clipPath:
                    "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)",
                  transition: "border-color .18s,color .18s",
                }}
              >
                &times;
              </button>
            </div>

            {/* Nav links grid */}
            <nav
              aria-label="Pages"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))",
                gap: "0 clamp(24px,4vw,64px)",
              }}
            >
              {NAV_ITEMS.map((item, i) => {
                const isActive = active === item.key
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "clamp(12px,1.6vw,18px)",
                      padding: "clamp(13px,1.6vw,17px) 12px clamp(13px,1.6vw,17px) 4px",
                      borderBottom: `1px solid ${isActive ? "rgba(255,255,255,.28)" : "rgba(255,255,255,.10)"}`,
                      textDecoration: "none",
                      background: isActive ? "rgba(255,255,255,.05)" : "transparent",
                      transition: "background .2s,padding-left .2s",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                        fontSize: 13,
                        letterSpacing: ".14em",
                        color: item.tone,
                        flex: "0 0 auto",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontFamily: "Archivo, Helvetica, sans-serif",
                        fontWeight: 800,
                        fontSize: "clamp(22px,2.6vw,34px)",
                        letterSpacing: "-.022em",
                        lineHeight: 1.04,
                        color: isActive ? "#FFFFFF" : "#EDF1F6",
                        flex: "0 1 auto",
                        textWrap: "balance" as never,
                      }}
                    >
                      {item.label}
                    </span>
                    <i
                      aria-hidden="true"
                      style={{
                        flex: "1 1 auto",
                        minWidth: 10,
                        height: 0,
                        borderBottom: "1px dotted rgba(255,255,255,.16)",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "Archivo, Helvetica, sans-serif",
                        fontWeight: 600,
                        fontSize: 13,
                        letterSpacing: ".14em",
                        textTransform: "uppercase",
                        color: "#B4B6B2",
                        flex: "0 0 auto",
                        textAlign: "right",
                      }}
                    >
                      {item.note}
                    </span>
                  </Link>
                )
              })}
            </nav>

            {/* Info cards */}
            <div
              style={{
                marginTop: "clamp(28px,3.6vw,46px)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))",
                gap: "clamp(14px,2vw,20px)",
              }}
            >
              {/* Golden hour */}
              <div
                style={{
                  background:
                    "linear-gradient(150deg,rgba(255,255,255,.07),rgba(255,255,255,.015))",
                  border: "1px solid rgba(255,255,255,.12)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
                  clipPath:
                    "polygon(0 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%)",
                  padding: "17px 19px 16px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 9px",
                    fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                    fontSize: 12,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "#91918F",
                  }}
                >
                  Golden hour
                </p>
                <p
                  style={{
                    margin: "0 0 6px",
                    fontFamily: "Archivo, Helvetica, sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(21px,2vw,27px)",
                    letterSpacing: "-.01em",
                    color: "#F8B800",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {goldenFull}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "Archivo, Helvetica, sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    letterSpacing: ".1em",
                    lineHeight: 1.5,
                    textTransform: "uppercase",
                    color: "#B4B6B2",
                  }}
                >
                  {goldenNote}
                </p>
              </div>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/gavinbrooksleader"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  textDecoration: "none",
                  background:
                    "linear-gradient(150deg,rgba(255,255,255,.07),rgba(255,255,255,.015))",
                  border: "1px solid rgba(255,255,255,.12)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
                  clipPath:
                    "polygon(0 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%)",
                  padding: "17px 19px 16px",
                  transition: "border-color .18s",
                }}
              >
                <p
                  style={{
                    margin: "0 0 9px",
                    fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                    fontSize: 12,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "#91918F",
                  }}
                >
                  LinkedIn
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "Archivo, Helvetica, sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(15px,1.3vw,17px)",
                    letterSpacing: "-.005em",
                    color: "#EDF1F6",
                    overflowWrap: "anywhere",
                  }}
                >
                  Gavin Brooks
                </p>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/itspaddockgavin"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  textDecoration: "none",
                  background:
                    "linear-gradient(150deg,rgba(0,210,190,.16),rgba(0,210,190,.04))",
                  border: "1px solid rgba(0,210,190,.34)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
                  clipPath:
                    "polygon(0 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%)",
                  padding: "17px 19px 16px",
                  transition: "border-color .18s",
                }}
              >
                <p
                  style={{
                    margin: "0 0 9px",
                    fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                    fontSize: 12,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "#8FD9D2",
                  }}
                >
                  Instagram
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "Archivo, Helvetica, sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(15px,1.3vw,17px)",
                    letterSpacing: "-.005em",
                    color: "#EDF1F6",
                  }}
                >
                  @itspaddockgavin
                </p>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
