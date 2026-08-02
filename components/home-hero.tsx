"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

type Shift = "day" | "night"

// Sub-bar shows current section name + golden hour + progress pct
// This component wraps the fixed background + status bar under the nav
export function HomeHero() {
  const [shift, setShift]         = useState<Shift>("day")
  const [clock, setClock]         = useState("—")
  const [golden, setGolden]       = useState("—")
  const [goldenPct, setGoldenPct] = useState(0)
  const [secName, setSecName]     = useState("Intro")

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
      const s = hour >= 8 && hour < 18 ? "day" : "night"
      const c = now
        .toLocaleTimeString("en-US", {
          timeZone: "America/Chicago",
          hour: "numeric",
          minute: "2-digit",
        })
        .replace(/\s/g, "\u2009")
      setShift(s)
      setClock(c)

      // Progress within shift: 08:00–18:00 or 18:00–08:00 (30hr night)
      const mins = now.getHours() * 60 + now.getMinutes()
      let pct = 0
      if (s === "day") {
        pct = Math.min(1, Math.max(0, (mins - 8 * 60) / (10 * 60)))
      } else {
        const nightMins = mins >= 18 * 60 ? mins - 18 * 60 : mins + 6 * 60
        pct = Math.min(1, Math.max(0, nightMins / (14 * 60)))
      }
      setGoldenPct(pct)
    }

    const fetchGolden = async () => {
      const fmt = (ms: number) =>
        new Date(ms)
          .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
          .replace(/\s/g, "\u2009")
      try {
        const now  = new Date()
        const date =
          now.getFullYear() +
          "-" +
          String(now.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(now.getDate()).padStart(2, "0")
        const j = await (
          await fetch(
            `https://api.sunrise-sunset.org/json?lat=36.1627&lng=-86.7816&formatted=0&date=${date}`
          )
        ).json()
        if (!j.results || j.status !== "OK") throw new Error()
        const r = j.results
        const t = (k: string) => new Date(r[k]).getTime()
        const sunset = t("sunset")
        const rise   = t("sunrise")
        const nowTs  = Date.now()
        if (nowTs >= rise - 30 * 60000 && nowTs <= rise + 30 * 60000) {
          setGolden("Sunrise golden hour now")
        } else if (nowTs >= sunset - 30 * 60000 && nowTs <= sunset + 30 * 60000) {
          setGolden("Sunset golden hour now")
        } else if (nowTs < sunset) {
          setGolden(`Sunset ${fmt(sunset)}`)
        } else {
          setGolden(`Next sunrise ~${fmt(rise + 86400000)}`)
        }
      } catch {
        setGolden("—")
      }
    }

    // Section detection via IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const label = e.target.getAttribute("data-screen-label")
            if (label) setSecName(label)
          }
        })
      },
      { threshold: 0.4 }
    )
    document.querySelectorAll("[data-screen-label]").forEach((el) => observer.observe(el))

    tick()
    fetchGolden()
    const t = setInterval(tick, 20000)
    const g = setInterval(fetchGolden, 300000)
    return () => {
      clearInterval(t)
      clearInterval(g)
      observer.disconnect()
    }
  }, [])

  const accent = shift === "day" ? "#F8B800" : "#00D2BE"
  const pctStr = Math.round(goldenPct * 100) + "%"

  return (
    <>
      {/* Fixed full-bleed background */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
          background: "#0A1523",
        }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.22 }}>
          <Image
            src="/images/donuts-floor.webp"
            alt=""
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              shift === "day"
                ? "linear-gradient(160deg,rgba(14,26,42,.88),rgba(14,26,42,.72))"
                : "linear-gradient(160deg,rgba(10,21,35,.92),rgba(10,21,35,.78))",
            transition: "background 1.4s ease",
          }}
        />
      </div>

      {/* Telemetry sub-bar (fixed, under nav) */}
      <div
        style={{
          position: "fixed",
          top: 75,
          left: 0,
          right: 0,
          zIndex: 60,
          padding: "0 clamp(12px,4vw,40px)",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            position: "relative",
            background:
              "linear-gradient(150deg,rgba(255,255,255,.075),rgba(255,255,255,.018))",
            backdropFilter: "blur(26px) saturate(170%)",
            WebkitBackdropFilter: "blur(26px) saturate(170%)",
            border: "1px solid rgba(255,255,255,.12)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.16)",
            clipPath:
              "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)",
            padding: "11px clamp(14px,2.4vw,22px)",
            display: "flex",
            alignItems: "center",
            gap: "clamp(10px,2vw,20px)",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              flex: "0 0 auto",
              minWidth: 0,
            }}
          >
            <i
              aria-hidden="true"
              style={{ width: 26, height: 3, background: accent, flex: "0 0 auto" }}
            />
            <span
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 12.5,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "#EDF1F6",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {secName}
            </span>
          </span>
          <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 10 }} />
          <span
            style={{
              display: "inline-flex",
              alignItems: "baseline",
              gap: 8,
              flex: "0 0 auto",
            }}
          >
            <span
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 13,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "#EDF1F6",
              }}
            >
              Golden hour
            </span>
            <span
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 13.5,
                letterSpacing: ".08em",
                color: "#F8B800",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}
            >
              {golden}
            </span>
          </span>
          <span
            style={{
              fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
              fontSize: 13.5,
              letterSpacing: ".08em",
              color: "#EDF1F6",
              fontVariantNumeric: "tabular-nums",
              flex: "0 0 auto",
            }}
          >
            {clock}
          </span>
          {/* progress line */}
          <i
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              height: 2,
              width: pctStr,
              background: "linear-gradient(90deg,#00D2BE,#F8B800)",
              transition: "width .12s linear",
            }}
          />
        </div>
      </div>
      {/* Spacer for sub-bar */}
      <div aria-hidden="true" style={{ height: 50 }} />
    </>
  )
}
