"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

/* Blurb copy carried from the RAIL Redline run on /events
   (Claude Sonnet 4.5 · WARM · WEB PAGE · US · target "car events middle
   tennessee" · 0 tells). New copy on this page still owes its own run
   through the Redline workspace. */

const RANCH = "https://piston-powered-ranch.vercel.app"
const SHOW_DAY = "2026-10-10"

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const CLIP = "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)"
const CLIP_LG = "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)"
const CLIP_SM = "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)"

const FACTS: [string, string][] = [
  ["Date", "Saturday, October 10, 2026"],
  ["Hours", "9:00 AM to 3:00 PM"],
  ["Where", "Rancho Jaramillo, Unionville TN"],
  ["Cars", "300, selected"],
  ["Spectating", "Free"],
  ["Benefiting", "Community Elementary School"],
]

const DOORS = [
  {
    k: "rsvp",
    title: "RSVP to spectate",
    body: "Spectating is free. Tell us you are coming so we know how many to expect and which gate to open.",
    href: `${RANCH}/spectate`,
    cta: "Count me in",
    tone: "#F2C94C",
    img: "/images/ranch/ppr-walk.jpg",
  },
  {
    k: "car",
    title: "Submit a car",
    body: "Cars are selected, not first come. Send yours and we will tell you either way.",
    href: `${RANCH}/show`,
    cta: "Submit it",
    tone: "#00D2BE",
    img: "/images/918-p1.webp",
  },
  {
    k: "map",
    title: "The site map",
    body: "The show field, vendor row, parking and the gate, drawn on the real property line. It updates as the layout firms up.",
    href: `${RANCH}/map`,
    cta: "Open the map",
    tone: "#4BA3DE",
    img: "/images/ranch/ppr-field.jpg",
  },
  {
    k: "club",
    title: "Bring a club",
    body: "Rolling in with a group. Tell us how many and we will hold ground together.",
    href: `${RANCH}/clubs`,
    cta: "Club block",
    tone: "#B4B6B2",
    img: "/images/donuts-overflow.webp",
  },
]

function Tag({ children, bg = "#F2C94C", fg = "#101010" }: { children: React.ReactNode; bg?: string; fg?: string }) {
  return (
    <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: bg, padding: "6px 15px", alignSelf: "flex-start" }}>
      <span style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: fg }}>
        {children}
      </span>
    </span>
  )
}

export default function PistonPoweredRanchPage() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(t)
  }, [])
  const t = new Date(now)
  const today = Date.parse(
    `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T00:00:00`,
  )
  const days = Math.max(0, Math.round((Date.parse(SHOW_DAY + "T00:00:00") - today) / 86400000))

  return (
    <>
      <SiteNav active="events" />

      <style>{`
        @keyframes pgPulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes pgKb{from{transform:scale(1)}to{transform:scale(1.08)}}
        .pgCard{transition:transform .22s cubic-bezier(.16,.84,.32,1)}
        @media (hover:hover){.pgCard:hover{transform:translateY(-3px)}}
        @media (prefers-reduced-motion:reduce){.pgCard{transition:none!important}.pgCard:hover{transform:none!important}[data-kb]{animation:none!important}}
      `}</style>

      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", background: "#0A1523" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.22 }}>
          <Image src="/images/ranch/ppr-dusk.jpg" alt="" fill style={{ objectFit: "cover" }} priority />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(1100px 720px at 82% -6%,rgba(242,201,76,.13),transparent 60%),linear-gradient(180deg,rgba(10,21,35,.86),rgba(10,21,35,.96))" }} />
      </div>

      <div style={{ position: "fixed", top: 75, left: 0, right: 0, zIndex: 60, padding: "0 clamp(12px,4vw,40px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", background: "linear-gradient(150deg,rgba(255,255,255,.075),rgba(255,255,255,.018))", backdropFilter: "blur(26px) saturate(170%)", WebkitBackdropFilter: "blur(26px) saturate(170%)", border: "1px solid rgba(255,255,255,.12)", clipPath: CLIP, padding: "11px clamp(14px,2.4vw,22px)", display: "flex", alignItems: "center", gap: 14, overflow: "hidden" }}>
          <i aria-hidden="true" style={{ width: 9, height: 9, borderRadius: "50%", background: "#F2C94C", animation: "pgPulse 2.2s ease-in-out infinite", display: "block", flex: "0 0 auto" }} />
          <span style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: ".2em", textTransform: "uppercase", color: "#EDF1F6", whiteSpace: "nowrap" }}>Gates open Oct 10</span>
          <i aria-hidden="true" style={{ flex: "1 1 auto" }} />
          <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
            {days} days out
          </span>
        </div>
      </div>
      <div aria-hidden="true" style={{ height: 52 }} />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 1180, margin: "0 auto", padding: "clamp(14px,2.4vw,22px) clamp(12px,4vw,40px) clamp(40px,7vw,84px)", display: "flex", flexDirection: "column", gap: "clamp(18px,3vw,30px)" }}>
        <section style={{ position: "relative", minHeight: "clamp(420px,60vh,600px)", border: "1px solid rgba(255,255,255,.12)", clipPath: CLIP_LG, overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
          <Image data-kb="" src="/images/ranch/ppr-hero.jpg" alt="The pasture at Rancho Jaramillo where the field is set" fill style={{ objectFit: "cover", objectPosition: "center 62%", animation: "pgKb 26s ease-in-out infinite alternate" }} priority />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.95) 8%,rgba(10,21,35,.4) 58%,rgba(10,21,35,.3) 100%)" }} />
          <div style={{ position: "relative", padding: "clamp(22px,3.6vw,40px)", display: "flex", flexDirection: "column", gap: 16, maxWidth: 780 }}>
            <Tag>October 10, 2026 &middot; Unionville, TN</Tag>
            <h1 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(32px,5.6vw,62px)", lineHeight: 1, letterSpacing: "-.028em", textTransform: "uppercase", color: "#FFFFFF" }}>
              The Piston
              <br />
              <span style={{ color: "#F2C94C" }}>Powered Ranch</span>
            </h1>
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(17px,1.7vw,19px)", lineHeight: 1.56, color: "#E4E9F0", maxWidth: "58ch", textShadow: "0 1px 10px rgba(10,21,35,.8)" }}>
              Three hundred curated cars on a working ranch. Twelve acres of open pasture. Spectating is free. A share of every net dollar goes to Community Elementary School.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href={`${RANCH}/spectate`} target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 26px", clipPath: CLIP_SM, textDecoration: "none" }}>
                RSVP, it is free
              </a>
              <a href={`${RANCH}/map`} target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.34)", background: "rgba(10,21,35,.32)", padding: "15px 26px", clipPath: CLIP_SM, textDecoration: "none" }}>
                The site map
              </a>
            </div>
          </div>
        </section>

        {/* Facts */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(168px,1fr))", gap: "clamp(10px,1.6vw,14px)" }}>
          {FACTS.map(([k, v]) => (
            <div key={k} style={{ border: "1px solid rgba(255,255,255,.12)", background: "rgba(21,37,56,.55)", clipPath: CLIP, padding: "clamp(14px,1.8vw,18px)", display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#848482" }}>{k}</span>
              <span style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: "clamp(14px,1.5vw,16px)", lineHeight: 1.25, color: "#EDF1F6" }}>{v}</span>
            </div>
          ))}
        </section>

        {/* Doors */}
        <section style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,18px)" }}>
          <div style={{ borderBottom: "1px solid rgba(255,255,255,.14)", paddingBottom: 10 }}>
            <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(22px,3vw,32px)", letterSpacing: "-.02em", textTransform: "uppercase", color: "#FFFFFF" }}>
              How to come
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(258px,1fr))", gap: "clamp(12px,2vw,18px)" }}>
            {DOORS.map((d) => (
              <a key={d.k} href={d.href} target="_blank" rel="noopener" className="pgCard" style={{ position: "relative", border: "1px solid rgba(255,255,255,.12)", borderTop: `3px solid ${d.tone}`, clipPath: CLIP, overflow: "hidden", isolation: "isolate", display: "flex", flexDirection: "column", minHeight: 232, textDecoration: "none" }}>
                <Image src={d.img} alt="" aria-hidden fill style={{ objectFit: "cover", opacity: 0.24, zIndex: -1 }} />
                <span aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: -1, background: "linear-gradient(160deg,rgba(14,26,42,.96),rgba(14,26,42,.88))" }} />
                <div style={{ padding: "clamp(16px,2.2vw,22px)", display: "flex", flexDirection: "column", gap: 9, height: "100%" }}>
                  <h3 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(18px,2.1vw,22px)", lineHeight: 1.08, letterSpacing: "-.018em", textTransform: "uppercase", color: "#FFFFFF" }}>{d.title}</h3>
                  <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 14.5, lineHeight: 1.5, color: "#C9D1DB" }}>{d.body}</p>
                  <span style={{ marginTop: "auto", paddingTop: 12, fontFamily: MONO, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: d.tone }}>{d.cta}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Venue */}
        <section style={{ position: "relative", border: "1px solid rgba(255,255,255,.12)", clipPath: CLIP_LG, overflow: "hidden", isolation: "isolate", padding: "clamp(22px,3.4vw,36px)", display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,36px)" }}>
          <Image src="/images/ranch/ppr-dusk.jpg" alt="" aria-hidden fill style={{ objectFit: "cover", opacity: 0.3, zIndex: -1 }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: -1, background: "linear-gradient(150deg,rgba(14,26,42,.96),rgba(14,26,42,.82))" }} />
          <div style={{ flex: "5 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <Tag bg="#00D2BE" fg="#00302B">The venue</Tag>
            <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(24px,3.4vw,36px)", lineHeight: 1.03, letterSpacing: "-.022em", textTransform: "uppercase", color: "#FFFFFF" }}>
              Rancho Jaramillo
            </h2>
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(15px,1.5vw,17px)", lineHeight: 1.55, color: "#D8DEE7", maxWidth: "52ch" }}>
              A 408 acre working ranch in Bedford County, twelve acres of it opened for the day. Cars turn in off Highway 41-A and follow the ranch road to the field.
            </p>
            <Link href="/events" style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none", borderBottom: "1px solid rgba(0,210,190,.45)", paddingBottom: 2, alignSelf: "flex-start" }}>
              All events
            </Link>
          </div>
          <div style={{ flex: "4 1 260px", minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ["Property", "408 acres"],
              ["In use", "12 acres"],
              ["County", "Bedford, Tennessee"],
              ["Gate", "Off Highway 41-A"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: "1px solid rgba(255,255,255,.1)", paddingBottom: 7 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "#848482" }}>{k}</span>
                <span style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14.5, color: "#EDF1F6" }}>{v}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
