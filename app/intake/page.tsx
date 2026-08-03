"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

type Step = 0 | 1 | 2 | 3 | 4   // 0 Car · 1 Condition · 2 Route · 3 You · 4 Done

const STEPS = [
  { label: "The car",     datum: "Step 01", head: "Tell me what",     sub: "you have.",         blurb: "Start with the VIN and our decoder pulls the rest. No VIN to hand? Type what you know."                                                                                              },
  { label: "Condition",   datum: "Step 02", head: "How it has",        sub: "been kept.",        blurb: "Straight answers here are worth money. A car with a known story sells faster than a perfect one with gaps."                                                                           },
  { label: "The route",   datum: "Step 03", head: "Where it",          sub: "should sell.",      blurb: "Four inventories, four different buyers. Pick one, or leave it to the concierge."                                                                                                    },
  { label: "You",         datum: "Step 04", head: "Where do I",        sub: "reach you?",        blurb: "This goes to the duPont REGISTRY auction concierge. They come back within 24 to 48 business hours with a number and the inventory it belongs in."                                     },
  { label: "Sent",        datum: "",        head: "Got it —",           sub: "I will come back to you.", blurb: "" },
]

const ROUTES = [
  { id: "wholesale", name: "WHOLESALE",      speed: "Fastest",      blurb: "Dealer to dealer, run through Manheim Nashville on Wednesdays. A clean number and the car is gone. No tyre kickers, no weekend viewings." },
  { id: "drlive",    name: "dR LIVE AUCTION",speed: "No reserve",   blurb: "A no reserve live auction at live.dupontregistry.com. Select vehicles are taken on through dR LIVE Consignment to run in it."           },
  { id: "retail",    name: "dR RETAIL",      speed: "Highest price", blurb: "Conventional retail transactions and trade-ins. Straight to the person who wants to own it — takes longer, and usually pays the most."  },
  { id: "unsure",    name: "NOT SURE YET",   speed: "Ask me",       blurb: "Tell us the car and what matters most — speed or price — and the concierge will point you at the right inventory."                        },
]

const CHIP_GROUPS = [
  { key: "title",    label: "Title status",    opts: ["Clean", "Salvage", "Rebuilt", "Lien on it"]           },
  { key: "accident", label: "Accident history",opts: ["None", "Reported, repaired", "Not sure"]              },
  { key: "owners",   label: "Owners",          opts: ["I am the first", "Second", "Third or more", "Not sure"]},
  { key: "records",  label: "Service records", opts: ["Full history", "Partial", "None"]                      },
]

interface V {
  year: string; make: string; model: string; trim: string;
  mileage: string; trans: string; ext: string; int: string; vin: string;
  provenance: string; mods: string; notes: string;
  title: string; accident: string; owners: string; records: string;
  price: string; timing: string; route: string;
  name: string; phone: string; email: string; zip: string;
}

const EMPTY: V = {
  year: "", make: "", model: "", trim: "",
  mileage: "", trans: "", ext: "", int: "", vin: "",
  provenance: "", mods: "", notes: "",
  title: "", accident: "", owners: "", records: "",
  price: "", timing: "", route: "",
  name: "", phone: "", email: "", zip: "",
}

type SendStatus = "idle" | "sending" | "sent" | "error"
type VinState = "idle" | "busy" | "ok" | "warn"

const inputSt: React.CSSProperties = {
  width: "100%", background: "#122135", border: "1px solid #2A3B52",
  color: "#fff", fontFamily: "Archivo,Helvetica,sans-serif", fontSize: 17,
  padding: "13px 14px", boxSizing: "border-box",
}

const labelSt: React.CSSProperties = {
  display: "block", marginBottom: 8,
  fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 600, fontSize: 14,
  letterSpacing: ".13em", textTransform: "uppercase", color: "#9BA5B3",
}

function titleCase(x: string) {
  return String(x || "").toLowerCase().replace(/\b([a-z])/g, (_, c) => c.toUpperCase())
}

export default function IntakePage() {
  const [step, setStep]           = useState<Step>(0)
  const [v, setV]                 = useState<V>(EMPTY)
  const [send, setSend]           = useState<SendStatus>("idle")
  const [vinStatus, setVinStatus] = useState("")
  const [vinState, setVinState]   = useState<VinState>("idle")

  const set = (k: keyof V) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV((prev) => ({ ...prev, [k]: e.target.value }))

  const toggle = (k: keyof V, val: string) =>
    setV((prev) => ({ ...prev, [k]: prev[k] === val ? "" : val }))

  const decodeVin = useCallback(async (vin: string) => {
    if (vin.length !== 17) {
      setVinStatus(`A VIN is 17 characters — ${vin.length} so far`)
      setVinState("warn")
      return
    }
    setVinStatus("Decoding…")
    setVinState("busy")
    try {
      const res  = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`)
      const json = await res.json()
      const d    = (json.Results && json.Results[0]) || {}
      if (!d.Make && !d.ModelYear) {
        setVinStatus("Our decoder found nothing for that VIN — fill it in by hand")
        setVinState("warn")
        return
      }
      const next: Partial<V> = {}
      if (d.ModelYear)         next.year  = d.ModelYear
      if (d.Make)              next.make  = titleCase(d.Make)
      if (d.Model)             next.model = titleCase(d.Model)
      const trim = d.Trim || d.Series || ""
      if (trim)                next.trim  = titleCase(trim)
      const trans = d.TransmissionStyle || (d.TransmissionSpeeds ? `${d.TransmissionSpeeds}-speed` : "")
      if (trans)               next.trans = titleCase(trans)
      setV((prev) => ({ ...prev, ...next }))
      setVinStatus([next.year, next.make, next.model].filter(Boolean).join(" ") + " — check it and fill in the rest")
      setVinState("ok")
    } catch {
      setVinStatus("Our decoder is not answering — fill it in by hand")
      setVinState("warn")
    }
  }, [])

  const onVinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17)
    setV((prev) => ({ ...prev, vin: val }))
    if (val.length === 17) setTimeout(() => decodeVin(val), 60)
    else if (vinStatus) { setVinStatus(""); setVinState("idle") }
  }

  const submit = async () => {
    if (send === "sending") return
    setSend("sending")
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "intake",
          message: `Intake: ${v.year} ${v.make} ${v.model}`.trim() || "Car intake",
          page: "/intake",
          ...v,
        }),
      })
      setSend(res.ok ? "sent" : "error")
      if (res.ok) setStep(4)
    } catch {
      setSend("error")
    }
  }

  // Route step: "Not sure yet" is a valid empty state — always allow advancing
  const canNext = step === 0 ? !!(v.year || v.make || v.model)
    : step === 1 ? true
    : step === 2 ? true
    : step === 3 ? !!(v.name && v.email)
    : false

  const pct = step >= 4 ? 100 : ((step + 1) / 4) * 100

  const vinStatusColor = vinState === "ok" ? "#00D2BE" : vinState === "warn" ? "#F2C94C" : "#9BA5B3"

  const routeName = (ROUTES.find((r) => r.id === v.route) || {}).name

  const cap = (x?: string) => x ? String(x).toUpperCase() : "—"
  const money = (x?: string) => {
    if (!x) return "—"
    const n = String(x).replace(/[^0-9.]/g, "")
    if (!n) return String(x).toUpperCase()
    return "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 })
  }

  const summary = [
    { k: "Car",       v: cap([v.year, v.make, v.model, v.trim].filter(Boolean).join(" ")) },
    { k: "Mileage",   v: v.mileage ? Number(String(v.mileage).replace(/[^0-9]/g, "")).toLocaleString("en-US") + " MI" : "—" },
    { k: "VIN",       v: v.vin ? v.vin.slice(-8) : "—" },
    { k: "Title",     v: cap(v.title) },
    { k: "Accidents", v: cap(v.accident) },
    { k: "Owners",    v: cap(v.owners) },
    { k: "Records",   v: cap(v.records) },
    { k: "Asking",    v: money(v.price) },
    { k: "Route",     v: routeName || "—" },
  ]

  const cur = STEPS[Math.min(step, 4)]

  return (
    <>
      <SiteNav active="intake" />

      <main
        style={{
          flex: "1 1 auto", width: "min(900px,100%)", marginInline: "auto",
          padding: "clamp(26px,4vw,58px) clamp(14px,4vw,44px) clamp(50px,7vw,96px)",
        }}
      >
        {/* Step header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, margin: "0 0 clamp(16px,2vw,24px)" }}>
          <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: "clamp(15px,1.05vw,19px)", letterSpacing: ".14em", color: "#4BA3DE", fontVariantNumeric: "tabular-nums", flex: "0 0 auto" }}>
            {step < 4 ? `Step ${step + 1} of 4` : "Sent"}
          </span>
          <span style={{ fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: "clamp(15px,1.05vw,19px)", letterSpacing: ".16em", textTransform: "uppercase", color: "#EDF1F6", flex: "0 0 auto" }}>
            {cur.label}
          </span>
          <i style={{ flex: "1 1 auto", height: 5, background: "repeating-linear-gradient(90deg,rgba(255,255,255,.26) 0 1px,transparent 1px 7px)" }} />
          <span style={{ fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 600, fontSize: "clamp(13.5px,.85vw,16px)", letterSpacing: ".15em", textTransform: "uppercase", color: "#B8C1CD", flex: "0 0 auto" }}>
            {cur.datum}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ position: "relative", height: 11, margin: "0 0 clamp(28px,3.6vw,44px)", background: "repeating-linear-gradient(90deg,rgba(255,255,255,.2) 0 1px,transparent 1px 7px)" }}>
          <i style={{ position: "absolute", top: -4, bottom: -4, left: 0, width: `${pct}%`, background: "#F2C94C", transition: "width .4s cubic-bezier(.16,1,.3,1)" }} />
        </div>

        {/* Headline */}
        {step < 5 && (
          <>
            <h1 style={{ margin: "0 0 14px", maxWidth: "22ch" }}>
              <span style={{ display: "block", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 800, fontSize: "clamp(30px,3vw,44px)", lineHeight: 1, letterSpacing: "-.024em", textTransform: "uppercase", color: "#fff" }}>
                {cur.head}
              </span>
              <span style={{ display: "block", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 400, fontSize: "clamp(29px,2.9vw,42px)", lineHeight: 1.1, letterSpacing: "-.02em", color: "#F2C94C" }}>
                {cur.sub}
              </span>
            </h1>
            {cur.blurb && (
              <p style={{ margin: "0 0 clamp(26px,3.2vw,40px)", fontSize: 18, lineHeight: 1.6, color: "#B9C2CE", maxWidth: "58ch" }}>
                {cur.blurb}
              </p>
            )}
          </>
        )}

        {/* ── STEP 0: The car ───────────────────────────────── */}
        {step === 0 && (
          <div style={{ background: "#0A1523", border: "1px solid rgba(255,255,255,.14)", borderLeft: "2px solid #F2C94C", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(22px,2.6vw,36px)" }}>
            {/* VIN row */}
            <div style={{ marginBottom: "clamp(18px,2.2vw,26px)", paddingBottom: "clamp(18px,2.2vw,26px)", borderBottom: "1px solid rgba(255,255,255,.13)" }}>
              <span style={labelSt}>VIN</span>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                  type="text" maxLength={17} autoCapitalize="characters" spellCheck={false}
                  placeholder="Off the door jamb or the base of the windshield"
                  value={v.vin} onChange={onVinInput}
                  style={{ ...inputSt, flex: "1 1 280px", minWidth: 0, letterSpacing: ".1em", textTransform: "uppercase" }}
                />
                <button
                  type="button"
                  onClick={() => decodeVin(v.vin)}
                  style={{
                    flex: "0 0 auto", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700,
                    fontSize: 14, letterSpacing: ".12em", textTransform: "uppercase",
                    background: "#F2C94C", color: "#0E1A2A", border: 0,
                    padding: "13px 24px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)",
                    cursor: "pointer",
                  }}
                >
                  Decode
                </button>
              </div>
              {vinStatus && (
                <p style={{ margin: "10px 0 0", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: ".1em", textTransform: "uppercase", color: vinStatusColor }}>
                  {vinStatus}
                </p>
              )}
            </div>

            {/* Car fields */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(155px,100%),1fr))", gap: "clamp(15px,1.8vw,20px)" }}>
              {([
                ["Year", "year", "2019"], ["Make", "make", "Porsche"], ["Model", "model", "911 GT3"],
                ["Trim", "trim", "Touring"], ["Mileage", "mileage", "12,400"], ["Transmission", "trans", "PDK"],
                ["Exterior", "ext", "Shark Blue"], ["Interior", "int", "Black leather"],
              ] as [string, keyof V, string][]).map(([lbl, key, ph]) => (
                <label key={key} style={{ display: "block" }}>
                  <span style={labelSt}>{lbl}</span>
                  <input type="text" placeholder={ph} value={v[key]} onChange={set(key)} style={inputSt} />
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1: Condition ─────────────────────────────── */}
        {step === 1 && (
          <div style={{ background: "#0A1523", border: "1px solid rgba(255,255,255,.14)", borderLeft: "2px solid #4BA3DE", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(22px,2.6vw,36px)" }}>
            {CHIP_GROUPS.map(({ key, label, opts }) => (
              <div key={key} style={{ marginBottom: "clamp(20px,2.4vw,28px)" }}>
                <p style={{ margin: "0 0 12px", ...labelSt as object }}>{label}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {opts.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => toggle(key as keyof V, o)}
                      style={{
                        background: v[key as keyof V] === o ? "rgba(242,201,76,.1)" : "transparent",
                        border: `1px solid ${v[key as keyof V] === o ? "#F2C94C" : "rgba(255,255,255,.22)"}`,
                        color: "#DDE3EB",
                        fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 600, fontSize: 14,
                        letterSpacing: ".1em", textTransform: "uppercase", padding: "12px 18px",
                        cursor: "pointer", transition: "border-color .18s,background .18s",
                      }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {([
              ["Provenance", "provenance", "Where it came from, who had it, anything documented. Window sticker, build sheet, books and tools."],
              ["Modifications", "mods", "Wheels, exhaust, tune. Or tell me it is stock."],
              ["Anything I should know", "notes", "Chips, a warning light, service coming due. Telling me now saves us both a trip."],
            ] as [string, keyof V, string][]).map(([lbl, key, ph]) => (
              <label key={key} style={{ display: "block", marginBottom: 16 }}>
                <span style={labelSt}>{lbl}</span>
                <textarea placeholder={ph} value={v[key]} onChange={set(key)} style={{ ...inputSt, minHeight: 106, resize: "vertical" }} />
              </label>
            ))}
          </div>
        )}

        {/* ── STEP 2: Route ─────────────────────────────────── */}
        {step === 2 && (
          <>
            <div style={{ display: "grid", gap: 12 }}>
              {ROUTES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setV((prev) => ({ ...prev, route: r.id }))}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    background: v.route === r.id ? "rgba(242,201,76,.07)" : "#0A1523",
                    border: `1px solid ${v.route === r.id ? "#F2C94C" : "rgba(255,255,255,.16)"}`,
                    clipPath: "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)",
                    padding: "clamp(18px,2vw,26px)", cursor: "pointer", transition: "border-color .18s,background .18s",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 7 }}>
                    <span style={{ fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: ".01em", color: "#fff" }}>{r.name}</span>
                    <i style={{ flex: "1 1 auto", height: 0, borderBottom: "1px dotted rgba(255,255,255,.26)", transform: "translateY(-4px)" }} />
                    <span style={{ fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 600, fontSize: 13.5, letterSpacing: ".13em", textTransform: "uppercase", color: "#F2C94C" }}>{r.speed}</span>
                  </span>
                  <span style={{ display: "block", fontSize: 17, lineHeight: 1.5, color: "#B9C2CE" }}>{r.blurb}</span>
                </button>
              ))}
            </div>

            {/* Price + timing */}
            <div style={{ marginTop: "clamp(16px,2vw,24px)", background: "#0A1523", border: "1px solid rgba(255,255,255,.14)", borderLeft: "2px solid #F2C94C", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(22px,2.6vw,32px)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: "clamp(15px,1.8vw,20px)" }}>
                <label style={{ display: "block" }}>
                  <span style={labelSt}>What you want for it</span>
                  <input type="text" inputMode="numeric" placeholder="$185,000" value={v.price} onChange={set("price")} style={inputSt} />
                </label>
                <label style={{ display: "block" }}>
                  <span style={labelSt}>How soon</span>
                  <input type="text" placeholder="This month, or no rush" value={v.timing} onChange={set("timing")} style={inputSt} />
                </label>
              </div>
              <p style={{ margin: "14px 0 0", fontSize: 17, lineHeight: 1.55, color: "#9BA5B3" }}>
                A number here is not a commitment. It tells the concierge whether the room you picked can actually get there.
              </p>
            </div>

            <p style={{ margin: "clamp(18px,2.2vw,26px) 0 0", fontSize: 17, lineHeight: 1.6, color: "#9BA5B3", maxWidth: "56ch" }}>
              Not sure which? Leave it blank. Every car sells through duPont REGISTRY either way, and the concierge will tell you which inventory it belongs in.
            </p>
          </>
        )}

        {/* ── STEP 3: Your details ──────────────────────────── */}
        {step === 3 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))", gap: "clamp(18px,2.4vw,30px)", alignItems: "start" }}>
            <div style={{ background: "#0A1523", border: "1px solid rgba(255,255,255,.14)", borderLeft: "2px solid #00D2BE", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(22px,2.6vw,32px)" }}>
              {([
                ["Name", "name", "Your name"],
                ["Phone", "phone", "Best number for a text"],
                ["Email", "email", "you@example.com"],
                ["Where the car is", "zip", "ZIP or city"],
              ] as [string, keyof V, string][]).map(([lbl, key, ph]) => (
                <label key={key} style={{ display: "block", marginBottom: 16 }}>
                  <span style={labelSt}>{lbl}</span>
                  <input type="text" placeholder={ph} value={v[key]} onChange={set(key)} style={inputSt} />
                </label>
              ))}
              <button
                type="button"
                onClick={submit}
                disabled={send === "sending"}
                style={{
                  width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 14,
                  letterSpacing: ".12em", textTransform: "uppercase",
                  background: "#F2C94C", color: "#0E1A2A", border: 0,
                  padding: "16px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)",
                  cursor: "pointer", opacity: send === "sending" ? 0.7 : 1,
                }}
              >
                {send === "sending" ? "Sending…" : send === "error" ? "Try again" : "Send it to me"}
              </button>
              {send === "error" && (
                <p style={{ margin: "10px 0 0", fontSize: 15, color: "#F2C94C" }}>
                  Could not send — DM @PaddockGavin instead.
                </p>
              )}
              <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.5, color: "#9BA5B3" }}>
                Consignment is case by case. No obligation, and no dealer calling you six times.
              </p>
            </div>

            {/* Summary card */}
            <div style={{ background: "#0A1523", border: "1px solid rgba(255,255,255,.14)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 11, padding: "13px 16px 11px", borderBottom: "1px solid rgba(255,255,255,.14)" }}>
                <span style={{ ...labelSt, margin: 0, flex: "0 0 auto" }}>Your car</span>
                <i style={{ flex: "1 1 auto", height: 5, background: "repeating-linear-gradient(90deg,rgba(255,255,255,.26) 0 1px,transparent 1px 6px)" }} />
              </div>
              <div style={{ padding: "6px 16px 14px" }}>
                {summary.map((row) => (
                  <div key={row.k} style={{ display: "flex", alignItems: "baseline", gap: 9, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                    <span style={{ ...labelSt, margin: 0, flex: "0 0 auto" }}>{row.k}</span>
                    <i style={{ flex: "1 1 auto", height: 0, borderBottom: "1px dotted rgba(255,255,255,.26)", transform: "translateY(-4px)" }} />
                    <span style={{ fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".08em", color: row.v === "—" ? "#4B5563" : "#fff", flex: "0 1 auto", textAlign: "right" }}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Done ──────────────────────────────────── */}
        {step === 4 && (
          <div style={{ background: "#0A1523", border: "1px solid rgba(255,255,255,.14)", borderLeft: "2px solid #00D2BE", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(26px,3.2vw,44px)" }}>
            <p style={{ margin: "0 0 18px", fontSize: 19, lineHeight: 1.55, color: "#DDE3EB", maxWidth: "52ch" }}>
              Your {[v.year, v.make, v.model].filter(Boolean).join(" ") || "car"} is in. Our auction concierge reviews every intake and will be in touch within 24 to 48 business hours — consignment cars are accepted on a case by case basis. If you want a second pair of eyes in the meantime, DM me and reference the car.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link
                href="/"
                style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".12em", textTransform: "uppercase", background: "#F2C94C", color: "#0E1A2A", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)", textDecoration: "none" }}
              >
                Back to the site
              </Link>
              <button
                type="button"
                onClick={() => { setV(EMPTY); setStep(0); setSend("idle"); setVinStatus(""); setVinState("idle") }}
                style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".12em", textTransform: "uppercase", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,.26)", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)", cursor: "pointer" }}
              >
                Send another car
              </button>
            </div>
          </div>
        )}

        {/* Step navigation */}
        {step < 4 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: "clamp(24px,3vw,36px)" }}>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as Step)}
                style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".12em", textTransform: "uppercase", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,.26)", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)", cursor: "pointer" }}
              >
                Back
              </button>
            )}
            {step < 3 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as Step)}
                disabled={!canNext}
                style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".12em", textTransform: "uppercase", background: "#F2C94C", color: "#0E1A2A", border: 0, padding: "15px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)", cursor: canNext ? "pointer" : "not-allowed", opacity: canNext ? 1 : 0.45 }}
              >
                {["Next: Condition", "Next: Route", "Almost there", ""][step]}
              </button>
            )}
          </div>
        )}
      </main>

      <SiteFooter />
    </>
  )
}
