"use client"

import { useEffect, useRef, useState } from "react"

/**
 * The visit panel, rebuilt in the instrument language /show uses.
 *
 * The first version was label and value rows, which read like a spreadsheet.
 * This is the pattern from the ranch site: the number leads at display size,
 * the label supports it underneath, and a bar carries the one thing a number
 * alone cannot show, which is how far through something we are.
 *
 * Every value is real. The address is the one on the deed, the coordinates are
 * the surveyed turn in off Enon Church Road, and the weather is the National
 * Weather Service grid the ranch sits in. When a source is silent the card
 * says so rather than showing a plausible number.
 */

const ADDRESS = "179 Enon Church Rd, Unionville, TN 37180"
const GATE = { lat: 35.63751, lng: -86.59323 }
const SHOW = "2026-10-10T09:00:00-05:00"
const ANNOUNCE = "2026-08-26T00:00:00-05:00" // the run up, for the progress bar
/* Ours, cached for half an hour. See app/api/weather/route.ts for why the
   visitor's browser no longer talks to the National Weather Service. */
const FORECAST = "/api/weather"

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace"
const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const CLIP = "polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))"

type Period = { name: string; startTime: string; temperature: number; temperatureUnit: string; shortForecast: string }

function Card({ tone, value, unit, label, sub, fill, ring }: {
  tone: string; value: string; unit?: string; label: string; sub?: string; fill?: number; ring?: boolean
}) {
  return (
    <div className="pg-e0" style={{
      position: "relative",
 overflow: "hidden",
 padding: "20px 22px 18px",
 clipPath: CLIP,
 borderTop: `3px solid ${tone}`
    }}>
      {ring ? <span aria-hidden="true" className="pgRing" style={{ borderColor: `${tone}28` }} /> : null}
      <div style={{ fontFamily: ARCHIVO, fontWeight: 900, fontSize: 38, lineHeight: 1, letterSpacing: "-.03em", color: "#fff", fontVariantNumeric: "tabular-nums" }}>
        {value}
        {unit ? <span style={{ fontSize: 16, fontWeight: 700, color: "#9BA7B5", marginLeft: 6 }}>{unit}</span> : null}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#9BA7B5", fontWeight: 600, marginTop: 8 }}>{label}</div>
      {sub ? <div style={{ fontFamily: ARCHIVO, fontSize: 13, lineHeight: 1.45, color: "#C9D1DB", marginTop: 6 }}>{sub}</div> : null}
      {typeof fill === "number" ? (
        <div style={{ height: 5, borderRadius: 999, background: "rgba(255,255,255,.1)", marginTop: 12, overflow: "hidden" }}>
          <span style={{ display: "block", height: "100%", width: `${Math.max(0, Math.min(100, fill))}%`, borderRadius: 999, background: "linear-gradient(90deg,#3D8FD6,#00D2BE)", transition: "width 1.2s cubic-bezier(.16,.84,.32,1)" }} />
        </div>
      ) : null}
    </div>
  )
}

export default function VisitOps() {
  const [now, setNow] = useState<number | null>(null)
  const [wx, setWx] = useState<Period | null>(null)
  const [wxState, setWxState] = useState<"loading" | "ok" | "down">("loading")
  const [copied, setCopied] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [])

  /* The forecast is a third-party call. It starts when these cards are
     within seven hundred pixels of the viewport, not at page open. */
  useEffect(() => {
    const el = rootRef.current
    if (!el || !("IntersectionObserver" in window)) { setNear(true); return }
    const io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { setNear(true); io.disconnect() } }, { rootMargin: "700px 0px" })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!near) return
    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), 6000)
    fetch(FORECAST, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: Period & { state?: string }) => {
        if (j?.state === "ok") { setWx(j); setWxState("ok") } else setWxState("down")
      })
      .catch(() => setWxState("down"))
      .finally(() => clearTimeout(timer))
    return () => { clearTimeout(timer); ctl.abort() }
  }, [near])

  const gates = new Date(SHOW).getTime()
  const start = new Date(ANNOUNCE).getTime()
  const days = now === null ? null : Math.max(0, Math.ceil((gates - now) / 864e5))
  const elapsed = now === null ? 0 : ((now - start) / (gates - start)) * 100
  const isShowDay = wx?.startTime?.slice(0, 10) === "2026-10-10"

  const maps = {
    google: `https://www.google.com/maps/dir/?api=1&destination=${GATE.lat},${GATE.lng}`,
    apple: `https://maps.apple.com/?daddr=${GATE.lat},${GATE.lng}&dirflg=d`,
    waze: `https://waze.com/ul?ll=${GATE.lat},${GATE.lng}&navigate=yes`,
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(ADDRESS)
      setCopied(true); setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard refused; the address is on screen anyway */ }
  }

  return (
    <div ref={rootRef} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <style>{`
        .pgRing{position:absolute;right:-8px;bottom:-8px;width:74px;height:74px;border-radius:50%;border:2px solid;pointer-events:none}
        .pgRing::before{content:"";position:absolute;inset:8px;border-radius:50%;border:2px solid rgba(0,210,190,.14);border-top-color:rgba(0,210,190,0.82)}
        @media (prefers-reduced-motion: no-preference){.pgRing::before{animation:pgSpin 9s linear infinite}}
        @keyframes pgSpin{to{transform:rotate(360deg)}}
        .pgTele{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px}
        @media (max-width:560px){.pgTele{grid-template-columns:1fr 1fr;gap:10px}}
        .pgFind{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center}
        @media (max-width:720px){.pgFind{grid-template-columns:1fr;align-items:start}}
      `}</style>

      <div className="pgTele">
        <Card tone="#F2C94C" value={days === null ? "··" : String(days)} unit={days === 1 ? "day" : "days"}
              label="Until the gates" sub="Saturday, October 10, 2026" fill={elapsed} ring />
        <Card tone="#00D2BE" value="9 to 3" label="Gates open" sub="Nine in the morning, field clear by three" />
        <Card tone="#4BA3DE" value="300" label="Cars on the field" sub="Chosen one at a time" />
        <Card
          tone={wxState === "ok" ? "#B4B6B2" : "#5B6672"}
          value={wxState === "ok" && wx ? `${wx.temperature}°` : wxState === "loading" ? "··" : "··"}
          unit={wxState === "ok" && wx ? wx.temperatureUnit : undefined}
          label={isShowDay ? "Show day forecast" : "At the ranch now"}
          sub={
            wxState === "ok" && wx ? wx.shortForecast
            : wxState === "loading" ? "Reading the National Weather Service"
            : "The National Weather Service did not answer"
          }
        />
      </div>

      <div className="pg-e0" style={{
        padding: "20px 22px",
 clipPath: CLIP,
 borderTop: "3px solid #00D2BE"
      }}>
        <div className="pgFind">
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#00D2BE", fontWeight: 600 }}>Finding it</div>
            <div style={{ fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(17px,2vw,21px)", color: "#fff", marginTop: 8, letterSpacing: "-.015em" }}>{ADDRESS}</div>
            <div style={{ fontFamily: ARCHIVO, fontSize: 13.5, color: "#9BA7B5", marginTop: 5, lineHeight: 1.5 }}>
              Rancho Jaramillo, Bedford County. Turn in off Enon Church Road, then the ranch road.
              <span style={{ fontFamily: MONO, color: "#7F8A99" }}> {GATE.lat}, {GATE.lng}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {([["Google", maps.google], ["Waze", maps.waze], ["Apple", maps.apple]] as const).map(([l, href]) => (
              <a key={l} href={href} target="_blank" rel="noopener" style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 12.5, color: "#EDF1F6", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.16)", borderRadius: 999, padding: "12px 16px", minHeight: 44, display: "inline-flex", alignItems: "center", textDecoration: "none", whiteSpace: "nowrap" }}>{l}</a>
            ))}
            <button onClick={copyAddress} style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 12.5, cursor: "pointer", color: copied ? "#04211D" : "#EDF1F6", background: copied ? "#00D2BE" : "rgba(255,255,255,.06)", border: `1px solid ${copied ? "#00D2BE" : "rgba(255,255,255,.16)"}`, borderRadius: 999, padding: "12px 16px", minHeight: 44, display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
              {copied ? "Copied" : "Copy address"}
            </button>
          </div>
        </div>

        {/* The two doors that left the landing with the acts: the field
            drawn on the ranch, and the block held for a club arriving
            together. Same pills as the maps, so they read as ways in. */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.1)" }}>
          <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#7F8A99", fontWeight: 600, marginRight: 4 }}>Once you are here</span>
          {([["Walk it on the map", "/#the-ground"], ["Bring a club block", "/clubs/"]] as const).map(([l, href]) => (
            <a key={href} href={href} style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 12.5, color: "#EDF1F6", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.16)", borderRadius: 999, padding: "12px 16px", minHeight: 44, display: "inline-flex", alignItems: "center", textDecoration: "none", whiteSpace: "nowrap" }}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  )
}
