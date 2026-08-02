"use client"

import { useState } from "react"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

type Step = 0 | 1 | 2 | 3 | 4   // 0 Car · 1 Condition · 2 Route · 3 You · 4 Done

const STEPS = [
  { label: "The car",        datum: "Step 1 of 4" },
  { label: "Condition",      datum: "Step 2 of 4" },
  { label: "What you want",  datum: "Step 3 of 4" },
  { label: "Your details",   datum: "Step 4 of 4" },
  { label: "Done",           datum: ""            },
]

const ROUTES = [
  { id: "list",   name: "List it on duPont REGISTRY",    speed: "Full exposure",     blurb: "The largest luxury and exotic marketplace. Your car in front of a global buyer pool."    },
  { id: "net",    name: "Network it to a buyer first",   speed: "Faster close",      blurb: "Show it quietly to pre-qualified buyers before it goes public. Works for high-value cars." },
  { id: "either", name: "Whichever gets it done faster", speed: "Your call",         blurb: "Tell me the spec and the timeline, and I will recommend the right route."                  },
]

const CONDITION_OPTS = {
  overall:   ["Excellent", "Good", "Fair", "Project"],
  title:     ["Clean", "Salvage", "Rebuilt", "Not sure"],
  accidents: ["None", "Minor", "Major", "Not sure"],
  owners:    ["1", "2", "3+", "Not sure"],
}

interface V {
  year: string; make: string; model: string; trim: string;
  mileage: string; trans: string; ext: string; int: string; vin: string;
  provenance: string; mods: string; notes: string;
  overall: string; title: string; accidents: string; owners: string;
  price: string; timing: string; route: string;
  name: string; phone: string; email: string;
}

const EMPTY: V = {
  year: "", make: "", model: "", trim: "",
  mileage: "", trans: "", ext: "", int: "", vin: "",
  provenance: "", mods: "", notes: "",
  overall: "", title: "", accidents: "", owners: "",
  price: "", timing: "", route: "",
  name: "", phone: "", email: "",
}

type SendStatus = "idle" | "sending" | "sent" | "error"

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

export default function IntakePage() {
  const [step, setStep]   = useState<Step>(0)
  const [v, setV]         = useState<V>(EMPTY)
  const [send, setSend]   = useState<SendStatus>("idle")

  const set = (k: keyof V) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV((prev) => ({ ...prev, [k]: e.target.value }))

  const toggle = (k: keyof V, val: string) =>
    setV((prev) => ({ ...prev, [k]: prev[k] === val ? "" : val }))

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
          year: v.year, make: v.make, model: v.model, trim: v.trim,
          mileage: v.mileage, vin: v.vin, color: v.ext,
          ...v,
        }),
      })
      setSend(res.ok ? "sent" : "error")
      if (res.ok) setStep(4)
    } catch {
      setSend("error")
    }
  }

  const canNext = step === 0 ? !!(v.year || v.make || v.model)
    : step === 1 ? true
    : step === 2 ? !!v.route
    : step === 3 ? !!(v.name && v.email)
    : false

  const pct = step >= 4 ? 100 : ((step + 1) / 4) * 100

  const chip = (group: keyof V, val: string) => (
    <button
      key={val}
      type="button"
      onClick={() => toggle(group, val)}
      style={{
        background: v[group] === val ? "rgba(248,184,0,.1)" : "transparent",
        border: `1px solid ${v[group] === val ? "#F8B800" : "rgba(255,255,255,.22)"}`,
        color: "#DDE3EB",
        fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 600, fontSize: 14,
        letterSpacing: ".1em", textTransform: "uppercase", padding: "12px 18px",
        cursor: "pointer", transition: "border-color .18s,background .18s",
      }}
    >
      {val}
    </button>
  )

  const summary = [
    v.year && { k: "Year",    v: v.year    },
    v.make && { k: "Make",    v: v.make    },
    v.model && { k: "Model",   v: v.model   },
    v.mileage && { k: "Miles",   v: v.mileage },
    v.ext && { k: "Colour",  v: v.ext     },
    v.price && { k: "Asking",  v: v.price   },
  ].filter(Boolean) as { k: string; v: string }[]

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
            {step < 4 ? `0${step + 1}` : ""}
          </span>
          <span style={{ fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: "clamp(15px,1.05vw,19px)", letterSpacing: ".16em", textTransform: "uppercase", color: "#EDF1F6", flex: "0 0 auto" }}>
            {STEPS[step].label}
          </span>
          <i style={{ flex: "1 1 auto", height: 5, background: "repeating-linear-gradient(90deg,rgba(255,255,255,.26) 0 1px,transparent 1px 7px)" }} />
          <span style={{ fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 600, fontSize: "clamp(13.5px,.85vw,16px)", letterSpacing: ".15em", textTransform: "uppercase", color: "#B8C1CD", flex: "0 0 auto" }}>
            {STEPS[step].datum}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ position: "relative", height: 11, margin: "0 0 clamp(28px,3.6vw,44px)", background: "repeating-linear-gradient(90deg,rgba(255,255,255,.2) 0 1px,transparent 1px 7px)" }}>
          <i style={{ position: "absolute", top: -4, bottom: -4, left: 0, width: `${pct}%`, background: "#F8B800", transition: "width .4s cubic-bezier(.16,1,.3,1)" }} />
        </div>

        {/* Headline */}
        {step < 4 && (
          <>
            <h1 style={{ margin: "0 0 14px", maxWidth: "22ch" }}>
              <span style={{ display: "block", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 800, fontSize: "clamp(30px,3vw,44px)", lineHeight: 1, letterSpacing: "-.024em", textTransform: "uppercase", color: "#fff" }}>
                {["Tell me about the car", "How does it present?", "Which way do you want to go?", "Where do I send the reply?"][step]}
              </span>
              <span style={{ display: "block", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 400, fontSize: "clamp(29px,2.9vw,42px)", lineHeight: 1.1, letterSpacing: "-.02em", color: "#F8B800" }}>
                {["Year, make, model, VIN.", "Honest is fine.", "I\u2019ll get you to the right room.", "Name and email."][step]}
              </span>
            </h1>
            <p style={{ margin: "0 0 clamp(26px,3.2vw,40px)", fontSize: 18, lineHeight: 1.6, color: "#B9C2CE", maxWidth: "58ch" }}>
              {[
                "The fee to you is zero. Deals run on duPont\u2019s dealer licence. Start with what you know.",
                "Provenance, condition and any mods. Nothing disqualifies a car \u2014 being straight with me means no surprises later.",
                "Every car sells through duPont REGISTRY either way. Pick the route that fits the timeline.",
                "A person answers \u2014 usually me. No auto-replies, no account managers.",
              ][step]}
            </p>
          </>
        )}

        {/* ── STEP 0: The car ───────────────────────────────── */}
        {step === 0 && (
          <div style={{ background: "#0A1523", border: "1px solid rgba(255,255,255,.14)", borderLeft: "2px solid #F8B800", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(22px,2.6vw,36px)" }}>
            {/* VIN */}
            <div style={{ marginBottom: "clamp(18px,2.2vw,26px)", paddingBottom: "clamp(18px,2.2vw,26px)", borderBottom: "1px solid rgba(255,255,255,.13)" }}>
              <span style={labelSt}>VIN</span>
              <input type="text" maxLength={17} autoCapitalize="characters" spellCheck={false} placeholder="Off the door jamb or the base of the windshield" value={v.vin} onChange={set("vin")} style={{ ...inputSt }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(155px,100%),1fr))", gap: "clamp(15px,1.8vw,20px)" }}>
              {([["Year","year","2019"],["Make","make","Porsche"],["Model","model","911 GT3"],["Trim","trim","Touring"],["Mileage","mileage","12,400"],["Transmission","trans","PDK"],["Exterior","ext","Guards Red"],["Interior","int","Black"]] as [string, keyof V, string][]).map(([lbl, key, ph]) => (
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
            {(Object.entries(CONDITION_OPTS) as [keyof typeof CONDITION_OPTS, string[]][]).map(([grp, opts]) => (
              <div key={grp} style={{ marginBottom: "clamp(20px,2.4vw,28px)" }}>
                <p style={{ margin: "0 0 12px", ...labelSt as object }}>{grp === "overall" ? "Overall" : grp === "title" ? "Title" : grp === "accidents" ? "Accidents" : "Previous owners"}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>{opts.map((o) => chip(grp as keyof V, o))}</div>
              </div>
            ))}
            {([ ["Provenance","provenance","Where it came from, who had it, anything documented. Window sticker, build sheet, books and tools."], ["Modifications","mods","Wheels, exhaust, tune. Or tell me it is stock."], ["Anything I should know","notes","Chips, a warning light, service coming due. Telling me now saves us both a trip."] ] as [string, keyof V, string][]).map(([lbl, key, ph]) => (
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
                  style={{ display: "block", width: "100%", textAlign: "left", background: v.route === r.id ? "rgba(248,184,0,.07)" : "#0A1523", border: `1px solid ${v.route === r.id ? "#F8B800" : "rgba(255,255,255,.16)"}`, clipPath: "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)", padding: "clamp(18px,2vw,26px)", cursor: "pointer", transition: "border-color .18s,background .18s" }}
                >
                  <span style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 7 }}>
                    <span style={{ fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: ".01em", color: "#fff" }}>{r.name}</span>
                    <i style={{ flex: "1 1 auto", height: 0, borderBottom: "1px dotted rgba(255,255,255,.26)", transform: "translateY(-4px)" }} />
                    <span style={{ fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 600, fontSize: 13.5, letterSpacing: ".13em", textTransform: "uppercase", color: "#F8B800" }}>{r.speed}</span>
                  </span>
                  <span style={{ display: "block", fontSize: 17, lineHeight: 1.5, color: "#B9C2CE" }}>{r.blurb}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: "clamp(16px,2vw,24px)", background: "#0A1523", border: "1px solid rgba(255,255,255,.14)", borderLeft: "2px solid #F8B800", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(22px,2.6vw,32px)" }}>
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
              <p style={{ margin: "14px 0 0", fontSize: 17, lineHeight: 1.55, color: "#9BA5B3" }}>A number here is not a commitment. It tells the concierge whether the room you picked can actually get there.</p>
            </div>
          </>
        )}

        {/* ── STEP 3: Your details ──────────────────────────── */}
        {step === 3 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))", gap: "clamp(18px,2.4vw,30px)", alignItems: "start" }}>
            <div style={{ background: "#0A1523", border: "1px solid rgba(255,255,255,.14)", borderLeft: "2px solid #00D2BE", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(22px,2.6vw,32px)" }}>
              {([["Your name","name","Gavin"],["Email","email","name@domain.com"],["Phone","phone","Optional"]] as [string, keyof V, string][]).map(([lbl, key, ph]) => (
                <label key={key} style={{ display: "block", marginBottom: 16 }}>
                  <span style={labelSt}>{lbl}</span>
                  <input type="text" placeholder={ph} value={v[key]} onChange={set(key)} style={inputSt} />
                </label>
              ))}
              <button
                type="button"
                onClick={submit}
                disabled={send === "sending"}
                style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".12em", textTransform: "uppercase", background: "#F8B800", color: "#0E1A2A", border: 0, padding: "16px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)", cursor: "pointer", opacity: send === "sending" ? 0.7 : 1 }}
              >
                {send === "sending" ? "Sending\u2026" : send === "error" ? "Try again" : "Send the intake"}
              </button>
              {send === "error" && <p style={{ margin: "10px 0 0", fontSize: 15, color: "#F8B800" }}>Could not send &mdash; DM @itspaddockgavin instead.</p>}
              <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.5, color: "#9BA5B3" }}>No obligation, and no dealer calling you six times.</p>
            </div>
            {/* Summary */}
            {summary.length > 0 && (
              <div style={{ background: "#0A1523", border: "1px solid rgba(255,255,255,.14)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 11, padding: "13px 16px 11px", borderBottom: "1px solid rgba(255,255,255,.14)" }}>
                  <span style={{ ...labelSt, margin: 0, flex: "0 0 auto" }}>Your car</span>
                  <i style={{ flex: "1 1 auto", height: 5, background: "repeating-linear-gradient(90deg,rgba(255,255,255,.26) 0 1px,transparent 1px 6px)" }} />
                </div>
                <div style={{ padding: "6px 16px 14px" }}>
                  {summary.map((row) => (
                    <div key={row.k} style={{ display: "flex", alignItems: "baseline", gap: 9, padding: "9px 0" }}>
                      <span style={{ ...labelSt, margin: 0, flex: "0 0 auto" }}>{row.k}</span>
                      <i style={{ flex: "1 1 auto", height: 0, borderBottom: "1px dotted rgba(255,255,255,.26)", transform: "translateY(-4px)" }} />
                      <span style={{ fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".08em", color: "#fff", flex: "0 1 auto", textAlign: "right" }}>{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 4: Done ──────────────────────────────────── */}
        {step === 4 && (
          <div style={{ background: "#0A1523", border: "1px solid rgba(255,255,255,.14)", borderLeft: "2px solid #00D2BE", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(26px,3.2vw,44px)" }}>
            <p style={{ margin: "0 0 18px", fontSize: 19, lineHeight: 1.55, color: "#DDE3EB", maxWidth: "52ch" }}>
              Got it. I&rsquo;ll look it over and reply directly. No auto-confirmation, just a real answer when I&rsquo;ve had a look at what you sent.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".12em", textTransform: "uppercase", background: "#F8B800", color: "#0E1A2A", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)" }}>Back to the site</Link>
              <button type="button" onClick={() => { setV(EMPTY); setStep(0); setSend("idle") }} style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".12em", textTransform: "uppercase", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,.26)", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)", cursor: "pointer" }}>Send another car</button>
            </div>
          </div>
        )}

        {/* Step navigation */}
        {step < 4 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: "clamp(24px,3vw,36px)" }}>
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => (s - 1) as Step)} style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".12em", textTransform: "uppercase", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,.26)", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)", cursor: "pointer" }}>Back</button>
            )}
            {step < 3 && (
              <button type="button" onClick={() => setStep((s) => (s + 1) as Step)} disabled={!canNext} style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".12em", textTransform: "uppercase", background: "#F8B800", color: "#0E1A2A", border: 0, padding: "15px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)", cursor: canNext ? "pointer" : "not-allowed", opacity: canNext ? 1 : 0.45 }}>
                {["Next: Condition", "Next: Route", "Next: Your details"][step]}
              </button>
            )}
          </div>
        )}
      </main>

      <SiteFooter />
    </>
  )
}
