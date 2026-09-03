"use client"

import { useEffect, useState } from "react"
import { PageBackdrop } from "@/components/page-backdrop"

type Shift = "day" | "night"

// Sub-bar shows current section name + golden hour + progress pct
// This component wraps the fixed background + status bar under the nav
export function HomeHero() {
  const [shift, setShift]   = useState<Shift>("day")
  const [golden, setGolden] = useState("—")
  const [scrollPct, setScrollPct] = useState(0)
  const [secName, setSecName]     = useState("PaddockGavin")

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
      setShift(s)

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
        // Golden hour windows: ~40min before each, ~30min after
        const riseStart = rise - 40 * 60000
        const riseEnd   = rise + 30 * 60000
        const setStart  = sunset - 40 * 60000
        const setEnd    = sunset + 30 * 60000

        if (nowTs >= riseStart && nowTs <= riseEnd) {
          const minsLeft = Math.max(1, Math.round((riseEnd - nowTs) / 60000))
          setGolden(`Golden hour · now · ${minsLeft} min left`)
        } else if (nowTs >= setStart && nowTs <= setEnd) {
          const minsLeft = Math.max(1, Math.round((setEnd - nowTs) / 60000))
          setGolden(`Golden hour · now · ${minsLeft} min left`)
        } else if (nowTs < riseStart) {
          const dur = Math.round((riseEnd - riseStart) / 60000)
          setGolden(`Golden hour ${fmt(riseStart)} · ${dur} min`)
        } else if (nowTs < setStart) {
          const dur = Math.round((setEnd - setStart) / 60000)
          setGolden(`Golden hour ${fmt(setStart)} · ${dur} min`)
        } else {
          // Past sunset — fetch tomorrow's sunrise
          const tom = new Date(now)
          tom.setDate(tom.getDate() + 1)
          const td = `${tom.getFullYear()}-${String(tom.getMonth()+1).padStart(2,"0")}-${String(tom.getDate()).padStart(2,"0")}`
          const j2 = await (await fetch(`https://api.sunrise-sunset.org/json?lat=36.1627&lng=-86.7816&formatted=0&date=${td}`)).json()
          if (j2.results && j2.status === "OK") {
            const tRise = new Date(j2.results.sunrise).getTime()
            setGolden(`Sunrise ${fmt(tRise - 40 * 60000)}`)
          } else {
            setGolden("Sunrise · tomorrow")
          }
        }
      } catch {
        setGolden("—")
      }
    }

    const SEC_LABEL: Record<string, string> = {
      intro:    "PaddockGavin",
      wall:     "The wall",
      story:    "Who's filming this",
      shifts:   "Two shifts",
      garage:   "The garage",
      mediakit: "For brands",
      contact:  "Ask me anything",
    }

    const onScroll = () => {
      // Scroll %
      const max = document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0
      setScrollPct(pct)

      // Active section — first [data-sec] whose top <= 160px from viewport top
      let found: string | null = null
      document.querySelectorAll<HTMLElement>("[data-sec]").forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top <= 160 && r.bottom > 160) found = el.getAttribute("data-sec")
      })
      if (found && SEC_LABEL[found]) setSecName(SEC_LABEL[found])
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    tick()
    fetchGolden()
    onScroll()
    const t = setInterval(tick, 20000)
    const g = setInterval(fetchGolden, 300000)
    return () => {
      clearInterval(t)
      clearInterval(g)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const accent     = shift === "day" ? "#F2C94C" : "#00D2BE"
  const shiftLabel = shift === "day" ? "Day Shift" : "Night Shift"
  const pctStr     = String(scrollPct).padStart(2, "0") + "%"
  const railPct = scrollPct + "%"

  return (
    <>
      <PageBackdrop src="/images/donuts-floor.webp" />

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
          className="pg-e1" style={{
            maxWidth: 1180,
            margin: "0 auto",
            position: "relative",
            clipPath:
              "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)",
            padding: "11px clamp(14px,2.4vw,22px)",
            display: "flex",
            alignItems: "center",
            gap: "clamp(10px,2vw,20px)",
            overflow: "hidden"
          }}
        >
          {/* Shift indicator — always visible on left */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              flex: "0 0 auto",
            }}
          >
            <i
              aria-hidden="true"
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: accent,
                boxShadow: `0 0 8px 2px ${accent}55`,
                flex: "0 0 auto",
              }}
            />
            <span
              style={{
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "#EDF1F6",
                whiteSpace: "nowrap",
              }}
            >
              {shiftLabel}
            </span>
          </span>

          {/* Section name — desktop only */}
          <span
            className="pg-hide-xs pg-telemetry-sec"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              flex: "0 0 auto",
              paddingLeft: 4,
              borderLeft: "1px solid rgba(255,255,255,.14)",
            }}
          >
            <span
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 11.5,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "rgba(237,241,246,0.82)",
                whiteSpace: "nowrap",
              }}
            >
              {secName}
            </span>
          </span>
          <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 10 }} />

          {/* Golden hour — premium redesign */}
          <span
            className="pg-telemetry-golden"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "clamp(10px,1.6vw,18px)",
              flex: "0 0 auto",
            }}
          >
            {/* Label + rule — desktop only */}
            <span
              className="pg-hide-xs"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <i
                aria-hidden="true"
                style={{
                  display: "block",
                  width: 22,
                  height: 1,
                  background: "linear-gradient(90deg,transparent,#F2C94C)",
                }}
              />
              <span
                style={{
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: 12,
                  letterSpacing: ".06em",
                  textTransform: "lowercase",
                  color: "rgba(242,201,76,.7)",
                  whiteSpace: "nowrap",
                }}
              >
                golden hour
              </span>
            </span>

            {/* Time — always visible */}
            <span
              style={{
                fontFamily: "Archivo Black, Archivo, Helvetica, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(15px,1.6vw,19px)",
                letterSpacing: "-.01em",
                color: "#F2C94C",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              {golden}
            </span>
          </span>

          {/* Minutes remaining — desktop only */}
          <span
            className="pg-hide-xs pg-telemetry-pct"
            style={{
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 400,
              fontSize: 12,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "rgba(242,201,76,0.82)",
              fontVariantNumeric: "tabular-nums",
              flex: "0 0 auto",
              opacity: 0.45,
            }}
          >
            {pctStr}
          </span>
          {/* scroll progress rail */}
          <i
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              height: 2,
              width: railPct,
              background: "linear-gradient(90deg,#00D2BE,#F2C94C)",
              transition: "width .12s linear",
            }}
          />
        </div>
      </div>
      {/* Spacer for sub-bar — also marks top section */}
      <div data-sec="intro" aria-hidden="true" style={{ height: 50 }} />
    </>
  )
}
