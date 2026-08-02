"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export function SiteFooter() {
  const [shift, setShift] = useState<"day" | "night">("day")
  const [clock, setClock] = useState("\u2014")

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

  const accent = shift === "day" ? "#F8B800" : "#00D2BE"
  const shiftLabel = shift === "day" ? "Day shift" : "Night shift"
  const year = String(new Date().getFullYear())

  return (
    <footer
      style={{
        position: "relative",
        background: "linear-gradient(180deg,rgba(10,21,35,.55),rgba(10,21,35,.9))",
        backdropFilter: "blur(26px) saturate(160%)",
        WebkitBackdropFilter: "blur(26px) saturate(160%)",
        borderTop: "1px solid rgba(255,255,255,.12)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.12)",
        padding: "clamp(30px,4.4vw,58px) clamp(14px,4vw,40px) 0",
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
              {shiftLabel} &middot; {clock} Nashville
            </span>
          </span>
          <i
            aria-hidden="true"
            style={{ flex: "1 1 auto", minWidth: 16, height: 1, background: "rgba(255,255,255,.12)", display: "block" }}
          />
          <a
            href="#top"
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
            gap: "clamp(22px,3vw,44px)",
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
                width={40}
                height={40}
                style={{ display: "block", flexShrink: 0, objectFit: "contain" }}
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
                <span style={{ color: "#F8B800" }}>Paddock</span>
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
              Lot Operations and Events Manager, duPont REGISTRY
            </p>
            <a
              href="https://instagram.com/itspaddockgavin"
              target="_blank"
              rel="noopener noreferrer"
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

          {/* Day shift nav */}
          <nav aria-label="Day shift" style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <p
              style={{
                margin: "0 0 10px",
                display: "flex",
                alignItems: "center",
                gap: 9,
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 12,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "#91918F",
              }}
            >
              <i aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "#F8B800", display: "block" }} />
              Day shift
            </p>
            {[
              { href: "/gallery", label: "Lot ops in action" },
              { href: "/donuts",  label: "Donuts with duPont" },
              { href: "/intake",  label: "Find me a car" },
              { href: "/work",    label: "Buy from duPont" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  padding: "7px 0",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 600,
                  fontSize: 14.5,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "#DDE3EB",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Night shift nav */}
          <nav aria-label="Night shift" style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <p
              style={{
                margin: "0 0 10px",
                display: "flex",
                alignItems: "center",
                gap: 9,
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 12,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "#91918F",
              }}
            >
              <i aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "#00D2BE", display: "block" }} />
              Night shift
            </p>
            {[
              { href: "/scoreboard",                                                   label: "The scoreboard",  ext: false },
              { href: "https://supercariq.com",                                        label: "Supercar IQ",     ext: true  },
              { href: "https://www.amazon.com/s?k=The+Gloss+Game+Gavin+Brooks",        label: "The Gloss Game",  ext: true  },
              { href: "https://paddock20.com",                                         label: "Paddock20",       ext: true  },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                target={l.ext ? "_blank" : undefined}
                rel={l.ext ? "noopener noreferrer" : undefined}
                style={{
                  padding: "7px 0",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 600,
                  fontSize: 14.5,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "#DDE3EB",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Elsewhere nav */}
          <nav aria-label="Elsewhere" style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <p
              style={{
                margin: "0 0 10px",
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 12,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "#91918F",
              }}
            >
              Elsewhere
            </p>
            {[
              { href: "/gallery",                  label: "The gallery",      ext: false },
              { href: "/garage",                   label: "The garage",       ext: false },
              { href: "/why-a-paddock",            label: "Why a Paddock",    ext: false },
              { href: "/connect",                  label: "Every link",       ext: false },
              { href: "https://gavinbrookshq.com", label: "gavinbrookshq.com", ext: true },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                target={l.ext ? "_blank" : undefined}
                rel={l.ext ? "noopener noreferrer" : undefined}
                style={{
                  padding: "7px 0",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 600,
                  fontSize: 14.5,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "#DDE3EB",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            borderTop: "1px solid rgba(255,255,255,.12)",
            padding: "16px 0 24px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 600,
              fontSize: 13.5,
              letterSpacing: ".09em",
              textTransform: "uppercase",
              color: "#91918F",
            }}
          >
            Cars sourced and consigned through duPont REGISTRY
          </p>
          <i
            aria-hidden="true"
            style={{ flex: "1 1 auto", height: 1, minWidth: 20, background: "rgba(255,255,255,.1)", display: "block" }}
          />
          <p
            style={{
              margin: 0,
              fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
              fontSize: 13,
              letterSpacing: ".1em",
              color: "#91918F",
            }}
          >
            {year}
          </p>
        </div>
      </div>
    </footer>
  )
}
