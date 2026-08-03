"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

const AMAZON_URL = "https://www.amazon.com/Gloss-Game-Detailing-Discipline-Display/dp/B0FMPGNTPY"

const mono = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const arch = "Archivo,'Helvetica Neue',Helvetica,Arial,sans-serif"
const serif = "Newsreader,Georgia,'Times New Roman',serif"

// Sample zones shown before the gate — full index unlocks on email
const ZONE_1 = {
  zone: "Zone 1 \u00b7 Wash",
  items: [
    { name: "AMMO Foam", link: "https://www.amazon.com/s?k=ammo+foam", note: "Pre-soak, every wash", price: "~$24", aff: true },
    { name: "Meguiar\u2019s Gold Class Soap", link: "https://www.amazon.com/s?k=meguiars+gold+class", note: "Two-bucket method", price: "~$18", aff: true },
    { name: "Chemical Guys Maxi-Suds", link: "https://www.amazon.com/s?k=chemical+guys+maxi+suds", note: "High-lubricity rinse bucket", price: "~$14", aff: false },
    { name: "Griot\u2019s Garage PFW Wash Mitt", link: "https://www.amazon.com/s?k=griot+garage+wash+mitt", note: "Wool. Replace when contaminated.", price: "~$22", aff: true },
    { name: "The Rag Company Eagle Edgeless 500", link: "https://www.amazon.com/s?k=rag+company+eagle+edgeless+500", note: "Drying towel. One per panel.", price: "~$8", aff: true },
  ],
}

function fmt(d: Date) {
  return d.toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" }).replace(/\s/g, "\u2009")
}
function isDay(d: Date) {
  const h = Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", hour12: false }).format(d))
  return h >= 8 && h < 18
}

export default function JuiceBoxPage() {
  const [time, setTime] = useState("")
  const [day, setDay] = useState(true)
  const [unlocked, setUnlocked] = useState(false)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle"|"sending"|"done"|"error">("idle")
  const [msg, setMsg] = useState("")

  useEffect(() => {
    const tick = () => { const n = new Date(); setTime(fmt(n)); setDay(isDay(n)) }
    tick(); const t = setInterval(tick, 20000); return () => clearInterval(t)
  }, [])

  useEffect(() => {
    try { if (localStorage.getItem("jbIndexUnlocked") === "1") setUnlocked(true) } catch {}
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === "sending") return
    setStatus("sending")
    try {
      const r = await fetch("/api/juicebox", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
      if (r.ok) {
        setStatus("done"); setMsg("Check your inbox \u2014 the PDF is on its way.")
        try { localStorage.setItem("jbIndexUnlocked", "1") } catch {}
        setUnlocked(true)
      } else { throw new Error() }
    } catch { setStatus("error"); setMsg("Something went wrong. DM @PaddockGavin directly.") }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A1523" }}>
      <SiteNav active="gloss" />

      {/* Telemetry bar */}
      <div style={{ borderBottom: "1px solid #27384F", background: "#0E1A2A" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "13px clamp(20px,5vw,40px)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12, fontFamily: mono, fontSize: 12.5, letterSpacing: ".24em", textTransform: "uppercase", color: "#EDF1F6" }}>
            <i aria-hidden="true" style={{ width: 34, height: 4, background: "#00D2BE", flex: "0 0 auto" }} />
            {day ? "Day shift" : "Night shift"} &middot; {time} Nashville
          </span>
          <i aria-hidden="true" style={{ flex: "1 1 auto", height: 1, background: "#27384F", minWidth: 40 }} />
          <span style={{ fontFamily: mono, fontSize: 12.5, letterSpacing: ".24em", textTransform: "uppercase", color: "#B4B6B2" }}>Chapter ten &middot; the index</span>
        </div>
      </div>

      <main style={{ minWidth: 0, maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

        {/* Masthead */}
        <section style={{ padding: "clamp(50px,7vw,78px) 0 clamp(40px,6vw,60px)", borderBottom: "1px solid #27384F" }}>
          <p style={{ margin: "0 0 18px", fontFamily: mono, fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#B4B6B2" }}>The official index &middot; from The Gloss Game™</p>
          <h1 style={{ margin: "0 0 22px", fontFamily: arch, fontWeight: 900, fontSize: "clamp(38px,6.6vw,68px)", lineHeight: 1.04, letterSpacing: "-.02em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "16ch" }}>
            The GoTime<br /><span style={{ color: "#F8B800" }}>Juice Box™</span>
          </h1>
          <p style={{ margin: 0, fontSize: "clamp(18px,2.2vw,21px)", lineHeight: 1.6, color: "#DDE3EB", maxWidth: "54ch" }}>Not the best car detailing products by vote &mdash; the ones that keep earning their slot. Roughly $55K went through this garage finding them, on twenty-nine of his own cars plus clients&rsquo; and friends&rsquo;. This is what stayed within reach.</p>
          <div style={{ marginTop: 26, maxWidth: "62ch" }}>
            <p style={{ fontFamily: mono, fontSize: 12, lineHeight: 1.75, letterSpacing: ".02em", color: "#B4B6B2", borderLeft: "2px solid #00D2BE", padding: "2px 0 2px 16px", margin: 0 }}>
              <b style={{ color: "#EDF1F6", fontWeight: 400 }}>A dot means the link pays a commission.</b> Nothing was added because it pays, and nothing was left off because it doesn&rsquo;t. The book was written before any of the links existed.
            </p>
          </div>
        </section>

        {/* Zone 1 — always visible */}
        <section style={{ padding: "clamp(44px,6vw,72px) 0", borderBottom: "1px solid #27384F" }}>
          <div style={{ display: "flex", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,.1)", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
            <div style={{ flex: "1 1 min(250px,100%)", minWidth: "min(250px,100%)", background: "#0A1523", padding: "26px 24px 28px", display: "flex", flexDirection: "column", gap: 10, boxShadow: "-1px 0 0 rgba(255,255,255,.1),0 -1px 0 rgba(255,255,255,.1)" }}>
              <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#00D2BE" }}>{ZONE_1.zone}</span>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 11 }}>
                {ZONE_1.items.map(it => (
                  <li key={it.name} style={{ fontSize: 14.5, lineHeight: 1.45, color: "#C4CBD6", paddingLeft: 15, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: 9, width: 6, height: 1, background: "#00D2BE", display: "block" }} />
                    <a href={it.link} target="_blank" rel="noopener noreferrer" style={{ color: "#EDF1F6", fontWeight: 500, textDecoration: "none" }}>{it.name}</a>
                    {it.aff && <sup style={{ color: "#00D2BE", fontSize: 10, letterSpacing: ".1em", marginLeft: 4 }}>&#9679;</sup>}
                    {it.price && <span style={{ fontFamily: mono, fontSize: 11, color: "#B4B6B2", marginLeft: 7 }}>{it.price}</span>}
                    <em style={{ fontStyle: "normal", display: "block", color: "#B4B6B2", fontSize: 12.5, marginTop: 2 }}>{it.note}</em>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Gate / unlock */}
          {!unlocked && (
            <>
              <div style={{ position: "relative", marginTop: -70, height: 70, background: "linear-gradient(180deg,rgba(10,21,35,0),#0A1523)", pointerEvents: "none" }} />
              <div style={{ border: "1px solid rgba(0,210,190,.35)", background: "linear-gradient(150deg,rgba(0,210,190,.08),rgba(0,210,190,0))", clipPath: "polygon(0 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%)", padding: "clamp(24px,4vw,40px)" }}>
                <p style={{ margin: "0 0 14px", fontFamily: mono, fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: "#00D2BE" }}>7 more zones behind this line</p>
                <h2 style={{ margin: "0 0 10px", fontFamily: arch, fontWeight: 900, fontSize: "clamp(24px,3.6vw,36px)", lineHeight: 1.05, letterSpacing: "-.02em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "22ch" }}>That was zone one. The rest goes where your email does</h2>
                <p style={{ margin: "0 0 22px", fontSize: 16, lineHeight: 1.6, color: "#C4CBD6", maxWidth: "56ch" }}>One email, the whole index as a PDF &mdash; every zone, every link checked, the paid ones marked &mdash; and this page unlocks with it.</p>
                <form onSubmit={submit} style={{ maxWidth: 560 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com" required
                      style={{ flex: "1 1 220px", minWidth: 0, background: "rgba(6,14,24,.55)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,.22)", padding: "16px 18px", fontFamily: arch, fontSize: 16, clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)", outline: "none" }}
                    />
                    <button type="submit" disabled={status === "sending"} style={{ fontFamily: arch, fontWeight: 800, fontSize: 15, letterSpacing: ".03em", textTransform: "uppercase", background: "#F8B800", color: "#101010", border: 0, cursor: "pointer", padding: "15px 24px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)" }}>
                      {status === "sending" ? "Sending\u2026" : "Send me the index"}
                    </button>
                  </div>
                  <p style={{ margin: "12px 0 0", fontSize: 13.5, lineHeight: 1.55, color: "#B4B6B2", maxWidth: "46ch" }}>One email with the PDF. After that I write when I have something worth reading, and every email has a link to stop them.</p>
                  {msg && <p role="status" aria-live="polite" style={{ margin: "10px 0 0", fontFamily: mono, fontSize: 12.5, letterSpacing: ".06em", color: status === "error" ? "#848482" : "#00D2BE", minHeight: 18 }}>{msg}</p>}
                </form>
              </div>
            </>
          )}

          <p style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".06em", color: "#B4B6B2", margin: "16px 0 0", display: "flex", alignItems: "baseline", gap: 9 }}>
            <span style={{ color: "#00D2BE", fontSize: 9 }}>&#9679;</span> Paid link &mdash; buying through it sends a commission Gavin&rsquo;s way, at no cost to you.
          </p>
          <p style={{ margin: "14px 0 0", fontSize: 15, lineHeight: 1.6, color: "#C4CBD6" }}>
            The reasoning behind each product is in the book. <Link href="/gloss-game" style={{ fontWeight: 600, color: "#00D2BE", textDecoration: "none" }}>See the whole system &rarr;</Link>
          </p>
        </section>

        {/* Three ways to start */}
        <section style={{ padding: "clamp(44px,6vw,72px) 0", borderBottom: "1px solid #27384F" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 15, margin: "0 0 30px" }}>
            <i style={{ fontStyle: "normal", width: 26, height: 3, background: "#00D2BE", flex: "0 0 auto" }} />
            <span style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".22em", textTransform: "uppercase", color: "#EDF1F6", whiteSpace: "nowrap" }}>Three ways to start</span>
            <u style={{ flex: "1 1 auto", height: 1, background: "rgba(255,255,255,.12)", textDecoration: "none" }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,.1)", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
            {[
              { tier: "Starter", price: "$150", desc: "Foam gun, soap, three towels, a mitt, Frothe.", note: "Entry point and flip cars" },
              { tier: "Builder", price: "$500", desc: "PF22.2, AMMO Foam, Boost, Reload, towels.", note: "Weekly use, semi-pro garage" },
              { tier: "Pro", price: "$1,500+", desc: "Wall rack, BlowR Pro, four buckets, the Elixir stack, a tool cart.", note: "Workshop-ready, client prep, delivery days" },
            ].map(({ tier, price, desc, note }, i) => (
              <div key={tier} style={{ flex: "1 1 min(260px,100%)", minWidth: "min(260px,100%)", background: "#0A1523", padding: "26px 24px 28px", display: "flex", flexDirection: "column", gap: 10, boxShadow: "-1px 0 0 rgba(255,255,255,.1),0 -1px 0 rgba(255,255,255,.1)" }}>
                <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#00D2BE" }}>{tier}</span>
                <p style={{ margin: 0, fontFamily: arch, fontWeight: 900, fontSize: "clamp(28px,4vw,38px)", color: "#FFFFFF", letterSpacing: "-.03em", lineHeight: 1 }}>{price}</p>
                <p style={{ margin: 0, fontFamily: serif, fontSize: 15.5, lineHeight: 1.55, color: "#B4B6B2" }}>{desc}</p>
                <p style={{ margin: "auto 0 0", paddingTop: 14, fontFamily: mono, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "#00D2BE" }}>{note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Book band */}
        <section style={{ padding: "clamp(48px,7vw,80px) 0" }}>
          <div style={{ border: "1px solid #0A6BAA", background: "linear-gradient(150deg,rgba(0,81,133,.94),rgba(0,81,133,.55))", boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(26px,4.4vw,48px)", display: "flex", flexWrap: "wrap", gap: "clamp(24px,4vw,44px)", alignItems: "center" }}>
            <div style={{ flex: "1 1 min(320px,100%)" }}>
              <h2 style={{ margin: "0 0 12px", fontFamily: arch, fontWeight: 900, fontSize: "clamp(26px,4vw,40px)", lineHeight: 1.04, letterSpacing: "-.02em", textTransform: "uppercase", color: "#FFFFFF" }}>The index is chapter ten</h2>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.64, color: "#DCE8F2", maxWidth: "50ch" }}>The order that makes these products work is the other eleven chapters. Ninety-six pages, and the back half is the workbook.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginTop: 24 }}>
                <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", fontFamily: arch, fontWeight: 800, fontSize: 15, letterSpacing: ".03em", textTransform: "uppercase", background: "#F8B800", color: "#101010", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>Get the book &middot; $19.99</a>
                <Link href="/gloss-game" style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", color: "#7FE8DC", textDecoration: "none" }}>See the whole system &rarr;</Link>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "clamp(24px,4vw,36px)", display: "flex", flexWrap: "wrap", gap: "8px 24px" }}>
            <a href="https://instagram.com/PaddockGavin" target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none" }}>Tag your shelf &middot; @PaddockGavin</a>
            <a href="https://gotimemotorsports.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none" }}>gotimemotorsports.com</a>
            <a href="https://www.etsy.com/shop/GoTimeMotorsports" target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none" }}>The Etsy shelf</a>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  )
}
