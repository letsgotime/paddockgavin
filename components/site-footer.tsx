"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SITE_GROUPS } from "@/lib/site-map"
import { DM, INSTAGRAM } from "@/lib/site-data"
import { PGEMark } from "@/components/pge-brand"

const ARCHIVO = "Archivo, Helvetica, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const NOTCH = "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)"

export function SiteFooter() {
  const [shift, setShift] = useState<"day" | "night">("day")
  const [clock, setClock] = useState("")

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const hour = Number(
        new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", hour12: false }).format(now)
      )
      setShift(hour >= 8 && hour < 18 ? "day" : "night")
      setClock(
        now.toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" }).replace(/\s/g, " ")
      )
    }
    tick()
    const t = setInterval(tick, 20000)
    return () => clearInterval(t)
  }, [])

  const accent = shift === "day" ? "#F2C94C" : "#00D2BE"
  const shiftLabel = shift === "day" ? "Day shift" : "Night shift"
  const year = String(new Date().getFullYear())
  const linkStyle: React.CSSProperties = { padding: "6px 0", fontFamily: ARCHIVO, fontWeight: 600, fontSize: 15, lineHeight: 1.3, color: "#DDE3EB", textDecoration: "none" }
  const small: React.CSSProperties = { fontFamily: MONO, fontSize: 13, letterSpacing: ".08em", color: "#00D2BE", textDecoration: "none" }

  return (
    <footer
      style={{
        position: "relative",
        background: "linear-gradient(180deg,rgba(10,21,35,.82),rgba(10,21,35,.97))",
        borderTop: "1px solid rgba(255,255,255,.12)",
        padding: "clamp(30px,4.4vw,58px) clamp(14px,4vw,40px) 0",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: "clamp(24px,3vw,38px)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <i aria-hidden="true" style={{ width: 26, height: 3, background: accent, display: "block" }} />
            <span style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: ".2em", textTransform: "uppercase", color: "#EDF1F6" }}>
              {shiftLabel} &middot; {clock ? `${clock} ` : ""}Nashville
            </span>
          </span>
          <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 16, height: 1, background: "rgba(255,255,255,.12)", display: "block" }} />
          <a href="#top" className="pg-tap" style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", color: "#B4B6B2", textDecoration: "none" }}>
            Back to top
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(190px,100%),1fr))", gap: "clamp(28px,4vw,52px)", paddingBottom: "clamp(26px,3.2vw,42px)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <Image src="/images/mark-on-dark-96.png" alt="" aria-hidden="true" width={73} height={40} style={{ display: "block", flexShrink: 0, width: "auto", height: 40 }} />
              <p style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(22px,2vw,28px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                <span style={{ color: "#F2C94C" }}>Paddock</span>
                <span style={{ color: "#57C7F5" }}>Gavin</span>
              </p>
            </div>
            <p style={{ margin: 0, fontFamily: MONO, fontSize: 12, lineHeight: 1.7, letterSpacing: ".16em", textTransform: "uppercase", color: "#B4B6B2" }}>
              Automotive &middot; Events &middot; Detailing &middot; Lifestyle &amp; Technology
            </p>
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 16, lineHeight: 1.55, color: "#C4CBD6" }}>
              Gavin Brooks &middot; Nashville, Tennessee
            </p>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="pg-tap" style={small}>@itspaddockgavin</a>
            <a href="https://www.linkedin.com/in/gavinbrooksleader" target="_blank" rel="noopener noreferrer" className="pg-tap" style={small}>LinkedIn &middot; Gavin Brooks</a>
          </div>

          {SITE_GROUPS.map((g) => (
            <nav key={g.key} aria-label={g.title} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <p style={{ margin: "0 0 8px", display: "flex", alignItems: "center", gap: 9, fontFamily: MONO, fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: g.tone }}>
                {g.key === "events"
                  ? <PGEMark height={14} />
                  : <i aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: g.tone, flexShrink: 0 }} />}
                {g.title}
              </p>
              {g.links.map((l) =>
                l.external ? (
                  <a key={l.key} href={l.href} target="_blank" rel="noopener noreferrer" className="pg-tap" style={linkStyle}>{l.label}</a>
                ) : (
                  <Link key={l.key} href={l.href} className="pg-tap" style={linkStyle}>{l.label}</Link>
                )
              )}
            </nav>
          ))}
        </div>

        <div className="pg-e2" style={{ clipPath: "polygon(0 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%)", padding: "clamp(20px,3vw,30px)", marginBottom: "clamp(28px,3.5vw,44px)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px 28px" }}>
          <div style={{ flex: "1 1 320px", minWidth: 0 }}>
            <p style={{ margin: "0 0 6px", fontFamily: MONO, fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#F2C94C" }}>Buying, selling or consigning?</p>
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h3)", lineHeight: 1.15, letterSpacing: "-.02em", color: "#FFFFFF" }}>Tell me the car. Exotic or luxury, retail or wholesale.</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 22px" }}>
            <Link href="/intake" className="pg-tap" style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 28px", clipPath: NOTCH, textDecoration: "none" }}>Sell a car</Link>
            <a href={DM} target="_blank" rel="noopener noreferrer" className="pg-tap" style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.42)", padding: "15px 28px", clipPath: NOTCH, textDecoration: "none" }}>Find a car</a>
            <Link href="/exotic-car-broker" className="pg-textlink">How it works</Link>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.12)", padding: "18px 0 8px" }}>
          <p style={{ margin: "0 0 8px", fontSize: 12.5, lineHeight: 1.6, color: "#91918F" }}>
            PaddockGavin brokers exotic and luxury vehicles, retail or wholesale, and shops with a dealer&rsquo;s licence, so every auction is open. Every sale completes through a licensed dealer. A broker fee, if any, is set per sale and disclosed before you sign the broker agreement.
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 12.5, lineHeight: 1.6, color: "#91918F" }}>
            Some links earn a commission. Paid, gifted and affiliate content is always disclosed on the piece itself. Photography and video made on dealer lots appears with permission.
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 12.5, lineHeight: 1.6, color: "#91918F" }}>
            PaddockGavin™, Supercar IQ™, I Got Receipts™, Paddock20™, GavinBrooksHQ™ and The Scoreboard™ are trade marks of Gavin Brooks, in use with registration in progress.{" "}
            <a href="/legal/trademarks" style={{ color: "#91918F", textDecoration: "underline", textUnderlineOffset: 3 }}>Full list and what you may use.</a>
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", paddingTop: 8, paddingBottom: 24 }}>
            <p style={{ margin: 0, fontFamily: MONO, fontSize: 12.5, letterSpacing: ".08em", color: "#91918F" }}>&copy; {year} Gavin Brooks</p>
            <i aria-hidden="true" style={{ flex: "1 1 auto", height: 1, minWidth: 16, background: "rgba(255,255,255,.08)", display: "block" }} />
            {[
              { href: "/legal/terms", label: "Terms" },
              { href: "/legal/privacy", label: "Privacy" },
              { href: "/legal/trademarks", label: "Trade marks" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="pg-tap" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "#91918F", textDecoration: "none" }}>
                {l.label}
              </Link>
            ))}
            <a href={DM} target="_blank" rel="noopener noreferrer" className="pg-tap" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".1em", color: "#00D2BE", textDecoration: "none" }}>
              A person answers &rsaquo;
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
