"use client"

import { useEffect, useState } from "react"

/**
 * The visit panel. It replaced two boxes of bulleted text that carried no live
 * data and nothing anyone could act on.
 *
 * Everything here is real: the address is the one on the deed, the gate
 * coordinates are the surveyed turn in off Highway 41-A, and the weather comes
 * from the National Weather Service grid the ranch actually sits in. Nothing
 * is estimated, and when a source is silent the row says so rather than
 * showing a plausible number.
 */

const ADDRESS = "179 Enon Church Rd, Unionville, TN 37180"
const GATE = { lat: 35.63751, lng: -86.59323 }
const SHOW = "2026-10-10T09:00:00-05:00"
// The grid the ranch falls in. Resolved once from api.weather.gov/points and
// pinned, because the lookup is a second round trip for a value that never
// changes.
const NWS_FORECAST = "https://api.weather.gov/gridpoints/OHX/59,34/forecast"

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace"
const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"

type Period = { name: string; startTime: string; temperature: number; temperatureUnit: string; shortForecast: string; probabilityOfPrecipitation?: { value: number | null } }

function Row({ label, value, sub, tone }: { label: string; value: React.ReactNode; sub?: string; tone?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,.09)" }}>
      <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "#8E9AA8", flex: "0 0 116px" }}>{label}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: ARCHIVO, fontWeight: 700, fontSize: "clamp(14.5px,1.5vw,16.5px)", color: tone || "#EDF1F6", fontVariantNumeric: "tabular-nums" }}>{value}</span>
        {sub ? <span style={{ display: "block", marginTop: 2, fontFamily: ARCHIVO, fontSize: 13, color: "#9BA7B5", lineHeight: 1.45 }}>{sub}</span> : null}
      </span>
    </div>
  )
}

export default function VisitOps() {
  const [now, setNow] = useState<number | null>(null)
  const [wx, setWx] = useState<Period | null>(null)
  const [wxState, setWxState] = useState<"loading" | "ok" | "down">("loading")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    // The forecast only reaches seven days out, so for most of the run up this
    // is the ranch's weather today rather than the weather on show day. The
    // label says which, because implying we know October's weather in August
    // would be a lie.
    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), 6000)
    fetch(NWS_FORECAST, { signal: ctl.signal, headers: { Accept: "application/geo+json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => {
        const periods: Period[] = j?.properties?.periods || []
        const show = periods.find((p) => p.startTime?.slice(0, 10) === "2026-10-10")
        const pick = show || periods.find((p) => p.name === "Today") || periods[0]
        if (pick) { setWx(pick); setWxState("ok") } else setWxState("down")
      })
      .catch(() => setWxState("down"))
      .finally(() => clearTimeout(timer))
    return () => { clearTimeout(timer); ctl.abort() }
  }, [])

  const gates = new Date(SHOW).getTime()
  const ms = now === null ? null : gates - now
  const d = ms === null ? null : Math.floor(ms / 864e5)
  const h = ms === null ? null : Math.floor((ms % 864e5) / 36e5)
  const m = ms === null ? null : Math.floor((ms % 36e5) / 6e4)

  const isShowDay = wx?.startTime?.slice(0, 10) === "2026-10-10"
  const maps = {
    google: `https://www.google.com/maps/dir/?api=1&destination=${GATE.lat},${GATE.lng}`,
    apple: `https://maps.apple.com/?daddr=${GATE.lat},${GATE.lng}&dirflg=d`,
    waze: `https://waze.com/ul?ll=${GATE.lat},${GATE.lng}&navigate=yes`,
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(ADDRESS)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard refused; the address is on screen either way */ }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>
      {/* the clock */}
      <div style={{ border: "1px solid rgba(242,201,76,.28)", borderTop: "3px solid #F2C94C", background: "rgba(21,37,56,.34)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", clipPath: "polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))", padding: "18px 20px" }}>
        <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#F2C94C" }}>Gates open in</span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 10, minHeight: 46 }}>
          {d === null ? (
            <span style={{ fontFamily: MONO, fontSize: 13, color: "#8E9AA8" }}>counting…</span>
          ) : (
            <>
              <span style={{ fontFamily: ARCHIVO, fontWeight: 900, fontSize: 42, lineHeight: 1, letterSpacing: "-.03em", color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>{d}</span>
              <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "#9BA7B5" }}>days</span>
              <span style={{ fontFamily: ARCHIVO, fontWeight: 900, fontSize: 22, lineHeight: 1, color: "#E7ECF3", fontVariantNumeric: "tabular-nums", marginLeft: 4 }}>{String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}</span>
            </>
          )}
        </div>
        <div style={{ marginTop: 14 }}>
          <Row label="The day" value="Saturday, October 10, 2026" />
          <Row label="Gates" value="Nine in the morning" sub="Field clear by three" />
          <Row label="Admission" value="Complimentary" sub="Spectators, no ticket needed" tone="#00D2BE" />
        </div>
      </div>

      {/* finding it */}
      <div style={{ border: "1px solid rgba(0,210,190,.26)", borderTop: "3px solid #00D2BE", background: "rgba(21,37,56,.34)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", clipPath: "polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))", padding: "18px 20px" }}>
        <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#00D2BE" }}>Finding it</span>
        <div style={{ marginTop: 10 }}>
          <Row label="Address" value={ADDRESS} sub="Rancho Jaramillo, Bedford County" />
          <Row label="The gate" value={`${GATE.lat}, ${GATE.lng}`} sub="Turn in off Highway 41-A, then the ranch road" />
          <Row label="From Nashville" value="About an hour south" />
          <Row
            label={isShowDay ? "Show day" : "At the ranch"}
            value={
              wxState === "ok" && wx ? `${wx.temperature}°${wx.temperatureUnit} · ${wx.shortForecast}` :
              wxState === "loading" ? "reading…" : "weather unavailable"
            }
            sub={
              wxState === "ok" && wx
                ? (isShowDay ? "National Weather Service forecast for October 10" : "Conditions now. The October 10 forecast appears once it is inside the seven day window.")
                : wxState === "down" ? "The National Weather Service did not answer" : undefined
            }
            tone={wxState === "ok" ? "#EDF1F6" : "#9BA7B5"}
          />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          {([["Google Maps", maps.google], ["Waze", maps.waze], ["Apple Maps", maps.apple]] as const).map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noopener" style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 12.5, letterSpacing: ".04em", color: "#EDF1F6", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.16)", borderRadius: 999, padding: "9px 15px", textDecoration: "none" }}>
              {label}
            </a>
          ))}
          <button onClick={copyAddress} style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 12.5, letterSpacing: ".04em", cursor: "pointer", color: copied ? "#04211D" : "#EDF1F6", background: copied ? "#00D2BE" : "rgba(255,255,255,.06)", border: `1px solid ${copied ? "#00D2BE" : "rgba(255,255,255,.16)"}`, borderRadius: 999, padding: "9px 15px" }}>
            {copied ? "Copied" : "Copy address"}
          </button>
        </div>
      </div>
    </div>
  )
}
