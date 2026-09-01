"use client"

import { useState } from "react"
import { FOOTPRINTS, POWER_OPTIONS, money, type Footprint } from "@/lib/stripe/catalog"

/**
 * The booth picker.
 *
 * One footprint has a price in Stripe, so one footprint can be paid for here.
 * The other three are quoted, and a quote is not a number to invent: a vendor
 * who pays a figure nobody set has a receipt for it. Those route to the enquiry
 * form instead, which is what "footprint scaling uses ad hoc price_data" means
 * in practice until somebody sets the scale.
 *
 * The route answers 503 when Stripe is not configured on the deployment. That
 * is rendered as "not open yet" rather than as a failure, because it is not the
 * visitor's fault and it is not a bug.
 */

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const ACCENT = "#FF1A21" // Jaramillo Red lit for small text on the ink, 4.74:1. Text only, never a fill
const FILL = "#E5141A"   // Jaramillo Red, for anything that paints a shape

type State = "idle" | "starting" | "closed" | "error"

export function BoothPicker() {
  const [picked, setPicked] = useState<Footprint>(FOOTPRINTS[0])
  const [power, setPower] = useState(POWER_OPTIONS[0])
  const [email, setEmail] = useState("")
  const [org, setOrg] = useState("")
  const [state, setState] = useState<State>("idle")
  const [why, setWhy] = useState("")

  const payable = typeof picked.cents === "number"

  async function go() {
    if (!payable || state === "starting") return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState("error")
      setWhy("We need an address that works, so the receipt reaches you.")
      return
    }
    setState("starting")
    try {
      const r = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: "vendorBooth",
          email: email.trim(),
          org: org.trim(),
          note: `${picked.size} footprint. Power: ${power}`,
        }),
      })
      const j = await r.json()
      if (r.status === 503) {
        setState("closed")
        return
      }
      if (!r.ok || !j.url) {
        setState("error")
        setWhy("That did not start. Reply to vendors@pistonpoweredranch.com and we will take it by hand.")
        return
      }
      window.location.href = j.url
    } catch {
      setState("error")
      setWhy("That did not start. Check your connection and try again.")
    }
  }

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <style>{`
        .bpGrid{grid-template-columns:repeat(auto-fit,minmax(min(210px,100%),1fr))}
        .bpPair{grid-template-columns:1fr 1fr}
        @media (max-width:560px){.bpPair{grid-template-columns:1fr}}
      `}</style>

      <div className="bpGrid" style={{ display: "grid", gap: 11 }}>
        {FOOTPRINTS.map((f) => {
          const on = f.size === picked.size
          return (
            <button
              key={f.size}
              type="button"
              onClick={() => setPicked(f)}
              aria-pressed={on}
              style={{
                textAlign: "left",
                padding: "15px 16px",
                borderRadius: 13,
                cursor: "pointer",
                background: on ? "rgba(229,20,26,.13)" : "rgba(255,255,255,.04)",
                border: `1px solid ${on ? ACCENT : "rgba(255,255,255,.14)"}`,
                color: "#EDF1F6",
              }}
            >
              <span style={{ font: `800 17px/1.2 ${ARCHIVO}`, letterSpacing: "-.015em" }}>{f.size}</span>
              <span style={{ display: "block", fontFamily: MONO, fontSize: 11.5, color: on ? ACCENT : "#8b95a3", marginTop: 4 }}>
                {typeof f.cents === "number" ? money(f.cents) : "Quoted"}
              </span>
              <span style={{ display: "block", font: `400 13.5px/1.5 ${ARCHIVO}`, color: "#a9b4c2", marginTop: 7 }}>
                {f.note}
              </span>
            </button>
          )
        })}
      </div>

      <label style={{ display: "grid", gap: 6 }}>
        <span style={lbl}>Power</span>
        <select value={power} onChange={(e) => setPower(e.target.value)} style={input}>
          {POWER_OPTIONS.map((p) => (
            <option key={p} value={p} style={{ color: "#0A1523" }}>
              {p}
            </option>
          ))}
        </select>
      </label>

      <div className="bpPair" style={{ display: "grid", gap: 11 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={lbl}>What you sell or serve</span>
          <input value={org} onChange={(e) => setOrg(e.target.value)} style={input} autoComplete="organization" />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={lbl}>Email for the receipt</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
            autoComplete="email"
          />
        </label>
      </div>

      {payable ? (
        <div>
          <button
            type="button"
            onClick={go}
            disabled={state === "starting"}
            style={{
              font: `900 15px/1 ${ARCHIVO}`,
              letterSpacing: ".02em",
              color: "#fff",
              background: FILL,
              border: 0,
              borderRadius: 12,
              padding: "16px 30px",
              cursor: state === "starting" ? "default" : "pointer",
              opacity: state === "starting" ? 0.65 : 1,
            }}
          >
            {state === "starting" ? "Opening Stripe" : `Reserve the ${picked.size} for ${money(picked.cents!)}`}
          </button>
          <p style={{ ...note, marginTop: 11 }}>
            Card details are handled by Stripe on their own page. They never touch this site.
          </p>
        </div>
      ) : (
        <div>
          <a
            href="#apply"
            style={{
              display: "inline-block",
              font: `900 15px/1 ${ARCHIVO}`,
              color: "#FFFFFF",
              background: FILL,
              borderRadius: 12,
              padding: "16px 30px",
              textDecoration: "none",
            }}
          >
            Ask for a {picked.size} quote
          </a>
          <p style={{ ...note, marginTop: 11 }}>
            Footprints above the standard space are priced on what you are building, so this one goes
            to Bekah rather than to a checkout.
          </p>
        </div>
      )}

      {state === "closed" && (
        <p style={{ ...note, color: "#EDF1F6" }}>
          Booth payment is not switched on yet. Use the form below and we will hold the space, then
          send you a link the moment it opens.
        </p>
      )}
      {state === "error" && <p style={{ ...note, color: "#FF1A21" }}>{why}</p>}
    </div>
  )
}

const lbl: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 10,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: "#8b95a3",
  fontWeight: 600,
}
const input: React.CSSProperties = {
  font: `400 16px/1.4 ${ARCHIVO}`,
  color: "#EDF1F6",
  background: "rgba(0,0,0,.32)",
  border: "1px solid rgba(255,255,255,.15)",
  borderRadius: 10,
  padding: "12px 14px",
  width: "100%",
}
const note: React.CSSProperties = {
  margin: 0,
  font: `400 13.5px/1.6 ${ARCHIVO}`,
  color: "#8b95a3",
  maxWidth: "56ch",
}
