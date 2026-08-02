"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export function HomeTwoShifts() {
  const [shift, setShift] = useState<"day" | "night">("day")

  useEffect(() => {
    const tick = () => {
      const now  = new Date()
      const hour = Number(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Chicago",
          hour: "numeric",
          hour12: false,
        }).format(now)
      )
      setShift(hour >= 8 && hour < 18 ? "day" : "night")
    }
    tick()
    const t = setInterval(tick, 20000)
    return () => clearInterval(t)
  }, [])

  const accent     = shift === "day" ? "#F8B800" : "#00D2BE"
  const shiftLabel = shift === "day" ? "Day shift" : "Night shift"

  return (
    <>
      <section
        data-screen-label="Two shifts"
        id="shifts"
        style={{
          maxWidth: 1180,
          width: "100%",
          margin: "0 auto",
          padding: "0 clamp(12px,4vw,40px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(16px,2.4vw,24px)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
              fontSize: 13.5,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "#EDF1F6",
            }}
          >
            Two shifts, and they don&apos;t overlap
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
          <span
            style={{
              fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
              fontSize: 12.5,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: accent,
            }}
          >
            {shiftLabel} now
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(14px,2.4vw,22px)" }}>
          {/* Day shift card */}
          <div
            style={{
              flex: "1 1 320px",
              minWidth: 0,
              position: "relative",
              background:
                shift === "day"
                  ? "linear-gradient(150deg,rgba(255,255,255,.10),rgba(255,255,255,.03))"
                  : "linear-gradient(150deg,rgba(255,255,255,.07),rgba(255,255,255,.015))",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              border: `1px solid ${shift === "day" ? "rgba(248,184,0,.30)" : "rgba(255,255,255,.12)"}`,
              borderTop: "3px solid #F8B800",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
              padding: "clamp(22px,3.2vw,34px)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              transition: "background .8s ease,border-color .8s ease",
              overflow: "hidden",
              isolation: "isolate",
            }}
          >
            <Image
              src="/images/donuts-floor.webp"
              alt=""
              aria-hidden="true"
              fill
              style={{ objectFit: "cover", opacity: 0.55, zIndex: -1 }}
              loading="lazy"
            />
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(160deg,rgba(14,26,42,.96) 0%,rgba(14,26,42,.88) 52%,rgba(14,26,42,.58) 100%)",
                zIndex: -1,
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <i
                aria-hidden="true"
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#F8B800",
                  boxShadow: shift === "day" ? "0 0 14px #F8B800" : "none",
                  flex: "0 0 auto",
                  transition: "box-shadow .8s",
                }}
              />
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12,
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "#F8B800",
                }}
              >
                Day shift
              </span>
              <i
                aria-hidden="true"
                style={{
                  flex: "1 1 auto",
                  minWidth: 10,
                  height: 1,
                  background: "rgba(255,255,255,.12)",
                }}
              />
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "#91918F",
                }}
              >
                8am &rarr; 6pm
              </span>
            </div>
            <h2
              style={{
                margin: 0,
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(26px,3.6vw,40px)",
                lineHeight: 1.02,
                letterSpacing: "-.024em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                maxWidth: "16ch",
              }}
            >
              The lot, and the room it sits in
            </h2>
            <p
              style={{
                margin: 0,
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontSize: 17,
                lineHeight: 1.58,
                color: "#C4CBD6",
                maxWidth: "50ch",
              }}
            >
              The gate opens at eight. Everything off a truck gets checked, cleaned, photographed, written up and put somewhere safe, and nothing leaves until it&apos;s verified.
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontSize: 16,
                lineHeight: 1.6,
                color: "#B4B6B2",
                maxWidth: "50ch",
              }}
            >
              Cars like these are better shared. That&apos;s why we put events on duPont REGISTRY&apos;s floor in Lebanon every month &mdash; so you can stand next to the one you&apos;ve only seen on a screen.
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontSize: 16,
                lineHeight: 1.6,
                color: "#C4CBD6",
                maxWidth: "50ch",
              }}
            >
              I&apos;m their Lot Operations and Events Manager, so the gate, the coffee and the calendar run through me. Come join us &mdash; we can&apos;t wait to see you there!
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 2 }}>
              <Link
                href="/donuts"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 14.5,
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                  background: "#F8B800",
                  color: "#101010",
                  padding: "14px 24px",
                  clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
                  textDecoration: "none",
                }}
              >
                Donuts with duPont
              </Link>
              <Link
                href="/events"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 14.5,
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                  color: "#EDF1F6",
                  border: "1px solid rgba(255,255,255,.28)",
                  padding: "14px 24px",
                  clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
                  textDecoration: "none",
                }}
              >
                Inquire about private events
              </Link>
            </div>
          </div>

          {/* Night shift card */}
          <div
            style={{
              flex: "1 1 320px",
              minWidth: 0,
              position: "relative",
              background:
                shift === "night"
                  ? "linear-gradient(150deg,rgba(0,210,190,.10),rgba(0,210,190,.03))"
                  : "linear-gradient(150deg,rgba(255,255,255,.07),rgba(255,255,255,.015))",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              border: `1px solid ${shift === "night" ? "rgba(0,210,190,.30)" : "rgba(255,255,255,.12)"}`,
              borderTop: "3px solid #00D2BE",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
              padding: "clamp(22px,3.2vw,34px)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              transition: "background .8s ease,border-color .8s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <i
                aria-hidden="true"
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#00D2BE",
                  boxShadow: shift === "night" ? "0 0 14px #00D2BE" : "none",
                  flex: "0 0 auto",
                  transition: "box-shadow .8s",
                }}
              />
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12,
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "#00D2BE",
                }}
              >
                Night shift
              </span>
              <i
                aria-hidden="true"
                style={{ flex: "1 1 auto", minWidth: 10, height: 1, background: "rgba(255,255,255,.12)" }}
              />
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "#91918F",
                }}
              >
                After hours
              </span>
            </div>
            <h2
              style={{
                margin: 0,
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(26px,3.6vw,40px)",
                lineHeight: 1.02,
                letterSpacing: "-.024em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                maxWidth: "16ch",
              }}
            >
              My desk, after the gate shuts
            </h2>
            <p
              style={{
                margin: 0,
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontSize: 17,
                lineHeight: 1.58,
                color: "#C4CBD6",
                maxWidth: "50ch",
              }}
            >
              Twenty-six years of technology didn&apos;t go anywhere. It moved to evenings, and it builds the things I kept wishing existed while I was on the lot.
            </p>
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(255,255,255,.12)" }}>
              {[
                { href: "https://supercariq.com", label: "Supercar IQ", meta: "Sept 2026", metaColor: "#00D2BE", ext: true },
                { href: "https://www.amazon.com/s?k=The+Gloss+Game+Gavin+Brooks", label: "The Gloss Game", meta: "On Amazon", metaColor: "#F8B800", ext: true },
                { href: "https://paddock20.com", label: "Paddock20", meta: "Software & marketing", metaColor: "#91918F", ext: true },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target={item.ext ? "_blank" : undefined}
                  rel={item.ext ? "noopener noreferrer" : undefined}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                    padding: "11px 0",
                    borderBottom: "1px solid rgba(255,255,255,.08)",
                    textDecoration: "none",
                    transition: "padding-left .18s",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Archivo, Helvetica, sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "#EDF1F6",
                      flex: "0 0 auto",
                    }}
                  >
                    {item.label}
                  </span>
                  <i
                    aria-hidden="true"
                    style={{ flex: "1 1 auto", height: 0, borderBottom: "1px dotted rgba(255,255,255,.18)" }}
                  />
                  <span
                    style={{
                      fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                      fontSize: 12,
                      letterSpacing: ".14em",
                      textTransform: "uppercase",
                      color: item.metaColor,
                      flex: "0 0 auto",
                    }}
                  >
                    {item.meta}
                  </span>
                </a>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 2 }}>
              <Link
                href="/scoreboard"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 14.5,
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                  background: "#00D2BE",
                  color: "#00302B",
                  padding: "14px 24px",
                  clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
                  textDecoration: "none",
                }}
              >
                The scoreboard
              </Link>
              <a
                href="https://www.amazon.com/s?k=The+Gloss+Game+Gavin+Brooks"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 14.5,
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                  color: "#EDF1F6",
                  border: "1px solid rgba(255,255,255,.28)",
                  padding: "14px 24px",
                  clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
                  textDecoration: "none",
                }}
              >
                Get the book
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Full bleed — Donuts lot */}
      <section
        data-screen-label="The lot"
        style={{
          position: "relative",
          left: "50%",
          marginLeft: "-50vw",
          width: "100vw",
          height: "clamp(340px,58vh,620px)",
          overflow: "hidden",
        }}
      >
        <Image
          src="/images/donuts-lot.webp"
          alt="The lot at Donuts with duPont"
          fill
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top,rgba(10,21,35,.9) 0%,rgba(10,21,35,.12) 42%,rgba(10,21,35,.3) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "0 clamp(12px,4vw,40px)",
          }}
        >
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              padding: "0 0 20px",
              display: "flex",
              alignItems: "center",
              gap: 11,
            }}
          >
            <i aria-hidden="true" style={{ width: 26, height: 3, background: "#F8B800", flex: "0 0 auto" }} />
            <span
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 12.5,
                letterSpacing: ".16em",
                lineHeight: 1.5,
                textTransform: "uppercase",
                color: "#EDF1F6",
                textShadow: "0 1px 10px rgba(10,21,35,.9)",
              }}
            >
              Donuts with duPont &middot; Lebanon, Tennessee
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
