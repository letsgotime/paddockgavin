"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export function HomeTwoShifts() {
  const [shift, setShift] = useState<"day" | "night">("day")
  const [clock, setClock]   = useState("")

  useEffect(() => {
    const tick = () => {
      const now  = new Date()
      const hour = Number(
        new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", hour12: false }).format(now)
      )
      setShift(hour >= 8 && hour < 18 ? "day" : "night")
      setClock(
        now.toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" }).replace(/\s/g, "\u2009")
      )
    }
    tick()
    const t = setInterval(tick, 30000)
    return () => clearInterval(t)
  }, [])

  const isDay   = shift === "day"
  const accent  = isDay ? "#F2C94C" : "#00D2BE"

  return (
    <section
      data-screen-label="Two shifts"
      id="shifts"
      style={{ display: "flex", flexDirection: "column", gap: "clamp(28px,5vw,64px)" }}
    >
      {/* Eyebrow */}
      <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: accent }}>
        {isDay ? "Day shift" : "Night shift"}{clock ? `\u2003·\u2003Nashville\u2003·\u2003${clock}` : ""}
      </span>

      {/* Headline */}
      <h2 style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(44px,8vw,96px)", lineHeight: .97, letterSpacing: "-.03em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "14ch" }}>
        Two shifts.{" "}<span style={{ color: accent }}>One operation.</span>
      </h2>

      {/* Two columns — no cards, just ruled left borders */}
      <div className="pg-two-col" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: "clamp(32px,5vw,64px)" }}>
        {/* Day */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingLeft: "clamp(20px,2.4vw,28px)", borderLeft: `3px solid #F2C94C` }}>
          <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color: "#F2C94C" }}>
            Day · 08:00 &rarr; 18:00
          </span>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(24px,3.2vw,36px)", lineHeight: 1.05, letterSpacing: "-.025em", textTransform: "uppercase", color: "#FFFFFF" }}>
            Lot operations at duPont REGISTRY, Nashville
          </p>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "clamp(16px,1.6vw,18px)", lineHeight: 1.65, color: "#C4CBD6" }}>
            Every exotic and luxury car on the Lebanon lot goes through inspection, photography, writeup, and staging before it reaches a buyer. The gate opens at eight. Nothing leaves until it clears.
          </p>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "clamp(16px,1.6vw,18px)", lineHeight: 1.65, color: "#8B93A7" }}>
            Lot Operations and Events Manager, duPont REGISTRY — the largest exotic car marketplace in the country. The gate, the calendar, and the camera all run through the same person.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingTop: 4 }}>
            <Link href="/donuts" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "14px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", textDecoration: "none" }}>
              Donuts with duPont
            </Link>
            <Link href="/events" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.22)", padding: "14px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", textDecoration: "none" }}>
              Private events
            </Link>
          </div>
        </div>

        {/* Night */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingLeft: "clamp(20px,2.4vw,28px)", borderLeft: `3px solid #00D2BE` }}>
          <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color: "#00D2BE" }}>
            Night · after hours
          </span>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(24px,3.2vw,36px)", lineHeight: 1.05, letterSpacing: "-.025em", textTransform: "uppercase", color: "#FFFFFF" }}>
            Automotive software and content, Nashville
          </p>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "clamp(16px,1.6vw,18px)", lineHeight: 1.65, color: "#C4CBD6" }}>
            Twenty-six years in technology don&apos;t disappear when the gate closes. Supercar IQ, The Gloss Game on Amazon, Paddock20 — tools built by someone who spent the day on the lot, not someone who read about it.
          </p>
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(255,255,255,.1)", marginTop: 4 }}>
            {[
              { href: "https://supercariq.com", label: "Supercar IQ", meta: "Sept 2026", color: "#00D2BE" },
              { href: "https://www.amazon.com/s?k=The+Gloss+Game+Gavin+Brooks", label: "The Gloss Game", meta: "On Amazon", color: "#F2C94C" },
              { href: "https://paddock20.com", label: "Paddock20", meta: "Software studio", color: "#8B93A7" },
            ].map((item) => (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,.08)", textDecoration: "none" }}>
                <span style={{ fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".1em", textTransform: "uppercase", color: "#EDF1F6", flex: "0 0 auto" }}>{item.label}</span>
                <i aria-hidden="true" style={{ flex: "1 1 auto", height: 0, borderBottom: "1px dotted rgba(255,255,255,.16)" }} />
                <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: item.color, flex: "0 0 auto" }}>{item.meta}</span>
              </a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingTop: 4 }}>
            <Link href="/scoreboard" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#00D2BE", color: "#00302B", padding: "14px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", textDecoration: "none" }}>
              The scoreboard
            </Link>
            <a href="https://www.amazon.com/s?k=The+Gloss+Game+Gavin+Brooks" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.22)", padding: "14px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", textDecoration: "none" }}>
              Get the book
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
