"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"

type Shift = "day" | "night"

interface NavItem { key: string; href: string; label: string; note: string }
interface NavGroup { title: string; tone: string; items: NavItem[] }

/**
 * The menu, grouped the way the site is lived: what happens on the lot by
 * day, what gets built at night, what is on the calendar, and the rest.
 * Eleven flat items at 20px and weight 800 read as a wall on a phone; four
 * groups of two or three at 17px read as a map. The note under each label
 * is kept on every screen size instead of hidden below 620px.
 */
const NAV_GROUPS: NavGroup[] = [
  { title: "Day shift", tone: "#F2C94C", items: [
    { key: "lotops", href: "/lot-ops", label: "Lot Ops in Action", note: "Gate at 8" },
    { key: "events", href: "/events",  label: "Events",            note: "Book the floor" },
    { key: "intake", href: "/intake",  label: "Find me a car",     note: "Sourcing, retail or wholesale" },
  ]},
  { title: "Night shift", tone: "#00D2BE", items: [
    { key: "scoreboard", href: "/scoreboard", label: "Scoreboard", note: "What I build" },
    { key: "cars",       href: "/cars",       label: "The Garage", note: "29 cars" },
    { key: "gallery",    href: "/gallery",    label: "Gallery",    note: "Three pillars" },
  ]},
  { title: "On the calendar", tone: "#4BA3DE", items: [
    { key: "ranch",   href: "/events/pistonpoweredranch", label: "The Piston Powered Ranch", note: "Oct 10" },
  ]},
  { title: "The rest", tone: "#B4B6B2", items: [
    { key: "why",     href: "/why-a-paddock", label: "Why a Paddock", note: "The word" },
    { key: "connect", href: "/connect",       label: "Connect",       note: "Every link" },
  ]},
]

/**
 * The ranch's own menu, for pistonpoweredranch.com. Somebody arriving for a
 * charity car show at a ranch was being handed the whole of PaddockGavin.
 * Every destination here is on the event. Tones are gold and the ranch's text
 * red, and no blue, which does not carry on the ink.
 */
const RANCH_GROUPS: NavGroup[] = [
  { title: "The day", tone: "#F2C94C", items: [
    { key: "day",   href: "/",      label: "The day",      note: "10 October" },
    { key: "show",  href: "/#show", label: "The show",     note: "On the field" },
    { key: "rsvp",  href: "/#rsvp", label: "Spectate",     note: "Free to attend" },
    { key: "look",  href: "/#look", label: "The property", note: "Rancho Jaramillo" },
    { key: "ops",   href: "/#ops",  label: "Finding it",   note: "Unionville TN" },
  ]},
  { title: "Take part", tone: "#FF1A21", items: [
    { key: "entry",   href: "/events/pistonpoweredranch/entry",   label: "Enter a car", note: "By approval" },
    { key: "vendor",  href: "/events/pistonpoweredranch/vendor",  label: "Vendors",     note: "Take a stall" },
    { key: "sponsor", href: "/events/pistonpoweredranch/sponsor", label: "Partners",    note: "Back the day" },
  ]},
]

/** Gates at nine on Saturday 10 October 2026. */
const EVENT_DAY = Date.UTC(2026, 9, 10)

const ARCHIVO = "Archivo, Helvetica, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const NOTCH_SM = "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)"
const NOTCH_MD = "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)"

interface Props {
  active?: string
}

export function SiteNav({ active = "home" }: Props) {
  const [open, setOpen]   = useState(false)
  const [shift, setShift] = useState<Shift>("day")
  const [clock, setClock] = useState("")
  const [ranch, setRanch] = useState(false)
  const [days, setDays] = useState(0)

  /* Which front door this is. The page is identical on both; only the menu
     changes, and it is closed on load, so nobody sees it settle. */
  useEffect(() => {
    const h = window.location.hostname.toLowerCase()
    setRanch(h === "pistonpoweredranch.com" || h === "www.pistonpoweredranch.com")
    const now = new Date()
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
    setDays(Math.max(0, Math.round((EVENT_DAY - today) / 86400000)))
  }, [])

  // Nashville shift tick
  const tick = useCallback(() => {
    const now  = new Date()
    const hour = Number(
      new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", hour12: false }).format(now)
    )
    const s: Shift = hour >= 8 && hour < 18 ? "day" : "night"
    const c = now
      .toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" })
      .replace(/\s/g, " ")
    setShift(s)
    setClock(c)
    document.body.dataset.pgShift = s
  }, [])

  useEffect(() => {
    tick()
    const t = setInterval(tick, 20000)
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", onKey)
    return () => { clearInterval(t); document.removeEventListener("keydown", onKey) }
  }, [tick])

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : ""
    return () => { document.documentElement.style.overflow = "" }
  }, [open])

  const shiftColor = shift === "day" ? "#F2C94C" : "#00D2BE"
  const shiftLabel = shift === "day" ? "Day shift" : "Night shift"

  const groups    = ranch ? RANCH_GROUPS : NAV_GROUPS
  const pillTone  = ranch ? "#F2C94C" : shiftColor
  const pillLabel = ranch ? "The Ranch" : shiftLabel
  const pillValue = ranch ? (days === 0 ? "Today" : days === 1 ? "1 day" : `${days} days`) : clock
  const eyebrow   = ranch
    ? "Saturday 10 October · gates at nine"
    : `${shiftLabel}${clock ? ` · ${clock} Nashville` : ""}`

  return (
    <>
      {/* Fixed nav bar, 5px under the livery stripe that app/layout.tsx draws */}
      <div style={{ position: "fixed", top: 5, left: 0, right: 0, zIndex: 80 }}>
        <div
          className="pg-e1"
          style={{
            background: "linear-gradient(180deg,rgba(14,26,42,.92),rgba(14,26,42,.76))",
            borderBottom: "1px solid rgba(255,255,255,.10)",
          }}
        >
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: "clamp(8px,2vw,20px)",
              padding: "10px clamp(14px,4vw,48px)",
            }}
          >
            {/* Logo */}
            <Link href="/" style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center", gap: 11, textDecoration: "none", whiteSpace: "nowrap" }}>
              <Image
                src={ranch ? "/brand/rj-mark-ondark.png" : "/images/mark-on-dark-96.png"}
                alt={ranch ? "Rancho Jaramillo" : "PG mark"}
                width={ranch ? 50 : 58}
                height={32}
                style={{ height: 32, width: "auto", display: "block", flexShrink: 0 }}
              />
              <span style={{ fontFamily: ARCHIVO, fontWeight: 800, fontSize: ranch ? "clamp(13px,3.1vw,24px)" : "clamp(18px,1.7vw,24px)", letterSpacing: "-.018em", textTransform: "uppercase" }}>
                {ranch ? (
                  <><span style={{ color: "#EDF1F6" }}>The Piston </span><span style={{ color: "#F2C94C" }}>Powered Ranch</span></>
                ) : (
                  <><span style={{ color: "#F2C94C" }}>Paddock</span><span style={{ color: "#57C7F5" }}>Gavin</span></>
                )}
              </span>
            </Link>

            <span style={{ flex: "1 1 auto" }} />

            {/* Shift pill: the dot and the clock on every screen, the label from 620px */}
            <span
              title="Nashville local time"
              className="pg-e0"
              style={{ display: "inline-flex", alignItems: "center", gap: 9, flex: "0 0 auto", padding: "7px 12px", clipPath: NOTCH_SM }}
            >
              <i aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: pillTone, boxShadow: `0 0 10px ${pillTone}`, flex: "0 0 auto" }} />
              <span className="pg-hide-xs" style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#EDF1F6", whiteSpace: "nowrap" }}>
                {pillLabel}
              </span>
              <span style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: ".06em", color: pillTone, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                {pillValue}
              </span>
            </span>

            {/* Menu button */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="pg-e0"
              style={{ flex: "0 0 auto", height: 44, minWidth: 44, display: "inline-flex", alignItems: "center", gap: 10, padding: "0 15px", cursor: "pointer", clipPath: NOTCH_SM, color: "#EDF1F6" }}
            >
              <span className="pg-hide-xs" style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#EDF1F6" }}>
                Menu
              </span>
              <span aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: 4.5, width: 20 }}>
                <i style={{ display: "block", height: 2, background: "#EDF1F6", borderRadius: 1 }} />
                <i style={{ display: "block", height: 2, background: "#EDF1F6", borderRadius: 1 }} />
                <i style={{ display: "block", height: 2, width: "70%", background: "#EDF1F6", borderRadius: 1 }} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer: 5px stripe + 70px bar */}
      <div aria-hidden="true" style={{ height: 75 }} />

      {/* Full-screen menu overlay */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="pg-e2"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 150,
            overflowY: "auto",
            background: "linear-gradient(160deg,rgba(10,21,35,.95),rgba(10,21,35,.98))",
            border: 0,
            animation: "pgNavIn var(--dur-move) var(--ease-settle) both",
          }}
        >
          <style>{`
            @keyframes pgNavIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
            .pg-menu-row{display:grid;grid-template-columns:1fr auto;column-gap:14px;align-items:center;padding:11px 10px 11px 0;border-bottom:1px solid rgba(255,255,255,.08);text-decoration:none;transition:background var(--dur-quick),padding-left var(--dur-quick)}
            .pg-menu-row:hover{background:rgba(255,255,255,.04);padding-left:8px}
            .pg-menu-row:focus-visible{outline:2px solid #F2C94C;outline-offset:2px}
            .pg-menu-groups{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:26px clamp(28px,5vw,72px)}
          `}</style>

          {/* Radial ambient glows */}
          <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(900px 620px at 84% 4%,rgba(0,210,190,.14),transparent 60%),radial-gradient(800px 600px at 6% 90%,rgba(242,201,76,.10),transparent 62%)" }} />

          <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "clamp(24px,5vw,72px) clamp(18px,4vw,40px) clamp(40px,6vw,72px)" }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: "clamp(22px,3.6vw,40px)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <i aria-hidden="true" style={{ width: 26, height: 3, background: pillTone }} />
                <span style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#EDF1F6" }}>
                  {eyebrow}
                </span>
              </span>
              <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 16, height: 1, background: "rgba(255,255,255,.14)" }} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="pg-e0"
                style={{ width: 48, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#EDF1F6", fontSize: 26, lineHeight: 1, clipPath: NOTCH_SM }}
              >
                &times;
              </button>
            </div>

            {/* Groups */}
            <nav aria-label="Pages" className="pg-menu-groups">
              {groups.map((g) => (
                <div key={g.title}>
                  <p style={{ margin: "0 0 4px", display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: g.tone }}>
                    <i aria-hidden="true" style={{ width: 18, height: 2, background: g.tone, flex: "0 0 auto" }} />
                    {g.title}
                  </p>
                  {g.items.map((item) => {
                    const isActive = active === item.key
                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="pg-menu-row"
                        aria-current={isActive ? "page" : undefined}
                        style={{ borderLeft: isActive ? `3px solid ${g.tone}` : "3px solid transparent", paddingLeft: isActive ? 10 : 0 }}
                      >
                        <span style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                          <span style={{ fontFamily: ARCHIVO, fontWeight: 600, fontSize: 17, letterSpacing: "-.005em", lineHeight: 1.25, color: isActive ? "#FFFFFF" : "#EDF1F6" }}>
                            {item.label}
                          </span>
                          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "#B4B6B2" }}>
                            {item.note}
                          </span>
                        </span>
                        <i aria-hidden="true" style={{ width: 12, height: 12, borderRight: `2px solid ${isActive ? g.tone : "rgba(255,255,255,.28)"}`, borderTop: `2px solid ${isActive ? g.tone : "rgba(255,255,255,.28)"}`, transform: "rotate(45deg)", marginRight: 6 }} />
                      </Link>
                    )
                  })}
                </div>
              ))}
            </nav>

            {/* The two things a visitor does, then everywhere else */}
            <div style={{ marginTop: "clamp(26px,4vw,44px)", display: "flex", flexWrap: "wrap", gap: 10 }}>
              {ranch ? (
                <>
                  <Link href="/#rsvp" onClick={() => setOpen(false)} style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".06em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "14px 24px", clipPath: NOTCH_MD, textDecoration: "none" }}>
                    Count me in
                  </Link>
                  <Link href="/events/pistonpoweredranch/entry" onClick={() => setOpen(false)} style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".06em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.28)", padding: "14px 24px", clipPath: NOTCH_MD, textDecoration: "none" }}>
                    Enter a car
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/intake" onClick={() => setOpen(false)} style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".06em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "14px 24px", clipPath: NOTCH_MD, textDecoration: "none" }}>
                    Sell a car
                  </Link>
                  <a href="https://ig.me/m/itspaddockgavin" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".06em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.28)", padding: "14px 24px", clipPath: NOTCH_MD, textDecoration: "none" }}>
                    DM @itspaddockgavin
                  </a>
                </>
              )}
            </div>

            {!ranch && (
              <p style={{ margin: "22px 0 0", display: "flex", flexWrap: "wrap", gap: "6px 22px", fontFamily: MONO, fontSize: 11.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#B4B6B2" }}>
                <a href="https://instagram.com/itspaddockgavin" target="_blank" rel="noopener noreferrer" style={{ color: "#8FD9D2", textDecoration: "none" }}>Instagram</a>
                <a href="https://www.linkedin.com/in/gavinbrooksleader" target="_blank" rel="noopener noreferrer" style={{ color: "#EDF1F6", textDecoration: "none" }}>LinkedIn</a>
                <a href="https://www.youtube.com/@paddockgavin" target="_blank" rel="noopener noreferrer" style={{ color: "#EDF1F6", textDecoration: "none" }}>YouTube</a>
                <a href="https://www.tiktok.com/@paddockgavin" target="_blank" rel="noopener noreferrer" style={{ color: "#EDF1F6", textDecoration: "none" }}>TikTok</a>
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
