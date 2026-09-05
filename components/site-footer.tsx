"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export function SiteFooter() {
  const [shift, setShift] = useState<"day" | "night">("day")
  const [clock, setClock] = useState("")

  useEffect(() => {
    const tick = () => {
      const now = new Date()
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
      setShift(s as "day" | "night")
      setClock(c)
    }
    tick()
    const t = setInterval(tick, 20000)
    return () => clearInterval(t)
  }, [])

  const accent = shift === "day" ? "#F2C94C" : "#00D2BE"
  const shiftLabel = shift === "day" ? "Day shift" : "Night shift"
  const year = String(new Date().getFullYear())

  return (
    <footer
      style={{
        position: "relative",
        background: "linear-gradient(180deg,rgba(10,21,35,.82),rgba(10,21,35,.97))",
        borderTop: "1px solid rgba(255,255,255,.12)",
        padding: "clamp(30px,4.4vw,58px) clamp(14px,4vw,40px) 0"
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Shift header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
            marginBottom: "clamp(24px,3vw,38px)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <i aria-hidden="true" style={{ width: 26, height: 3, background: accent, display: "block" }} />
            <span
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 12.5,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "#EDF1F6",
              }}
            >
              {shiftLabel} &middot; {clock ? `${clock} ` : ""}Nashville
            </span>
          </span>
          <i
            aria-hidden="true"
            style={{ flex: "1 1 auto", minWidth: 16, height: 1, background: "rgba(255,255,255,.12)", display: "block" }}
          />
          <a
            href="#top"
            className="pg-tap"
            style={{
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#B4B6B2",
              textDecoration: "none",
              transition: "color .18s",
            }}
          >
            Back to top
          </a>
        </div>

        {/* Four-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(230px,100%),1fr))",
            gap: "clamp(40px,5vw,72px)",
            paddingBottom: "clamp(26px,3.2vw,42px)",
          }}
        >
          {/* Brand column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {/* Logo lockup — mark + wordmark side by side, never smashed */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <Image
                src="/images/mark-on-dark-96.png"
                alt=""
                aria-hidden="true"
                width={73}
                height={40}
                style={{ display: "block", flexShrink: 0, width: "auto", height: 40 }}
              />
              <p
                style={{
                  margin: 0,
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(22px,2vw,28px)",
                  letterSpacing: "-.02em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "#F2C94C" }}>Paddock</span>
                <span style={{ color: "#57C7F5" }}>Gavin</span>
              </p>
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 12.5,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "#B4B6B2",
              }}
            >
              A life bent toward cars
            </p>
            <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 16, lineHeight: 1.55, color: "#C4CBD6" }}>
              Gavin Brooks &middot; Nashville, Tennessee
            </p>
            <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 15.5, lineHeight: 1.55, color: "#B4B6B2" }}>
              Lot operations, events and vehicle sourcing
            </p>
            <a
              href="https://instagram.com/itspaddockgavin"
              target="_blank"
              rel="noopener noreferrer"
              className="pg-tap"
              style={{
                marginTop: 4,
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 13,
                letterSpacing: ".08em",
                color: "#00D2BE",
                textDecoration: "none",
              }}
            >
              @itspaddockgavin
            </a>
            <a
              href="https://www.linkedin.com/in/gavinbrooksleader"
              target="_blank"
              rel="noopener noreferrer"
              className="pg-tap"
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 13,
                letterSpacing: ".08em",
                color: "#00D2BE",
                textDecoration: "none",
              }}
            >
              LinkedIn &middot; Gavin Brooks
            </a>
          </div>

          <nav aria-label="Sourcing" style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <p style={{ margin: "0 0 10px", display: "flex", alignItems: "center", gap: 9, fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F" }}>
              <i aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "#F2C94C", flexShrink: 0 }} />
              Sourcing
            </p>
            {[
              { href: "/sell-my-exotic-car", label: "Sell my exotic car" },
              { href: "/exotic-car-broker", label: "Find me a car" },
              { href: "/exotic-car-consignment", label: "Consignment" },
              { href: "/intake", label: "Start the intake" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="pg-tap" style={{ padding: "7px 0", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 600, fontSize: 14.5, letterSpacing: ".08em", textTransform: "uppercase", color: "#DDE3EB", textDecoration: "none" }}>
                {l.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="The lot" style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <p style={{ margin: "0 0 10px", display: "flex", alignItems: "center", gap: 9, fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F" }}>
              <i aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "#00D2BE", flexShrink: 0 }} />
              The lot
            </p>
            {[
              { href: "/lot-ops", label: "Lot Ops in Action" },
              { href: "/events", label: "Events" },
              { href: "/events/pistonpoweredranch", label: "The Piston Powered Ranch" },
              { href: "/gallery", label: "The gallery" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="pg-tap" style={{ padding: "7px 0", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 600, fontSize: 14.5, letterSpacing: ".08em", textTransform: "uppercase", color: "#DDE3EB", textDecoration: "none" }}>
                {l.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Elsewhere" style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <p style={{ margin: "0 0 10px", display: "flex", alignItems: "center", gap: 9, fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F" }}>
              <i aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "#B4B6B2", flexShrink: 0 }} />
              Elsewhere
            </p>
            {[
              { href: "/cars", label: "The Garage" },
              { href: "/scoreboard", label: "The scoreboard" },
              { href: "/why-a-paddock", label: "Why a Paddock" },
              { href: "https://paddock20.com", label: "Paddock20" },
              { href: "/connect", label: "Every link" },
              { href: "/press", label: "Press" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="pg-tap" style={{ padding: "7px 0", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 600, fontSize: 14.5, letterSpacing: ".08em", textTransform: "uppercase", color: "#DDE3EB", textDecoration: "none" }}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* The one next step, on every page */}
        <div className="pg-e2" style={{ clipPath: "polygon(0 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%)", padding: "clamp(20px,3vw,30px)", marginBottom: "clamp(28px,3.5vw,44px)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px 28px" }}>
          <div style={{ flex: "1 1 320px", minWidth: 0 }}>
            <p style={{ margin: "0 0 6px", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#F2C94C" }}>Looking for a car, or selling one?</p>
            <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 800, fontSize: "var(--t-h3)", lineHeight: 1.1, letterSpacing: "-.02em", color: "#FFFFFF" }}>Tell me the car. I am the one reading it.</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 22px" }}>
            <Link href="/intake" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>Start the intake</Link>
            <Link href="/partner" className="pg-textlink">Brands</Link>
            <Link href="/press" className="pg-textlink">Press</Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.12)",
            padding: "18px 0 8px",
          }}
        >
          {/* Disclosures */}
          <p style={{ margin: "0 0 8px", fontSize: 12.5, lineHeight: 1.6, color: "#91918F" }}>
            PaddockGavin sources vehicles as a concierge broker, retail or wholesale, and shops with a dealer&rsquo;s licence, so every auction is open. A broker fee, if any, is set per sale and disclosed before you sign the broker agreement.
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 12.5, lineHeight: 1.6, color: "#91918F" }}>
            Some links earn a commission. Paid, gifted and affiliate content is always disclosed on the piece itself. Photography and video made on dealer lots appears with permission.
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 12.5, lineHeight: 1.6, color: "#91918F" }}>
            PaddockGavin™, Supercar IQ™, I Got Receipts™, Paddock20™, GavinBrooksHQ™ and The Scoreboard™ are trade marks of Gavin Brooks, in use with registration in progress.{" "}
            <a href="/legal/trademarks" style={{ color: "#91918F", textDecoration: "underline", textUnderlineOffset: 3 }}>Full list and what you may use.</a>
          </p>
          {/* Legal row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              paddingTop: 8,
              paddingBottom: 24,
            }}
          >
            <p style={{ margin: 0, fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12.5, letterSpacing: ".08em", color: "#91918F" }}>
              &copy; {year} Gavin Brooks
            </p>
            <i aria-hidden="true" style={{ flex: "1 1 auto", height: 1, minWidth: 16, background: "rgba(255,255,255,.08)", display: "block" }} />
            {[
              { href: "/legal/terms", label: "Terms" },
              { href: "/legal/privacy", label: "Privacy" },
              { href: "/legal/trademarks", label: "Trade marks" },
              { href: "/press", label: "Press" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="pg-tap"
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "#91918F",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="https://ig.me/m/itspaddockgavin"
              target="_blank"
              rel="noopener noreferrer"
              className="pg-tap"
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 12,
                letterSpacing: ".1em",
                color: "#00D2BE",
                textDecoration: "none",
              }}
            >
              A person answers &rsaquo;
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
