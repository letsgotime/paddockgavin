"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

const STEPS = [
  { word: "Checked",      line: "Looked over properly before it goes anywhere. Every panel, every corner." },
  { word: "Cleaned",      line: "The road comes off before anything else happens." },
  { word: "Photographed", line: "Every angle, while it\u2019s at its best." },
  { word: "Written up",   line: "What it is, what it has, what it needs." },
  { word: "Safe",         line: "A spot of its own until it\u2019s wanted." },
]

const CREW = [
  "Mechanic \u0026 vendor leader",
  "Operations manager",
  "Auction concierge",
  "Retail concierge",
  "Manheim teams",
  "Every team in the office",
]

function centralHour() {
  try { return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })).getHours() }
  catch { return new Date().getHours() }
}

export default function LotOpsPage() {
  const [step, setStep] = useState(0)
  const [lotNow, setLotNow] = useState("")

  useEffect(() => {
    const update = () => {
      const h = centralHour()
      const open = h >= 8 && h < 18
      setLotNow(open ? "Gate\u2019s open" : h < 8 ? "Opens at 8" : "Closed \u2014 back at 8")
    }
    update()
    const tick = setInterval(update, 30000)
    const cycle = setInterval(() => setStep(s => (s + 1) % STEPS.length), 3200)
    return () => { clearInterval(tick); clearInterval(cycle) }
  }, [])

  return (
    <>
      <SiteNav active="lotops" />

      {/* Fixed background */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", background: "#0A1523" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
          <Image src="/images/gavin-gwagen.webp" alt="" fill style={{ objectFit: "cover" }} priority />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(1100px 720px at 82% -6%,rgba(248,184,0,.13),transparent 60%),radial-gradient(1000px 700px at 4% 30%,rgba(0,81,133,.44),transparent 62%),linear-gradient(180deg,rgba(10,21,35,.88),rgba(10,21,35,.96))" }} />
      </div>

      <main style={{ position: "relative", zIndex: 1, minWidth: 0, maxWidth: 1180, margin: "0 auto", padding: "clamp(14px,2.4vw,22px) clamp(12px,4vw,40px) clamp(40px,7vw,84px)", display: "flex", flexDirection: "column", gap: "clamp(14px,2.4vw,22px)" }}>

        {/* Hero */}
        <section style={{ position: "relative", minHeight: "clamp(400px,56vh,560px)", border: "1px solid rgba(255,255,255,.14)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
          <Image src="/images/ferrari-upperdeck.webp" alt="Coming off the transporter at duPont REGISTRY" fill style={{ objectFit: "cover", objectPosition: "center 55%" }} priority />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.95) 10%,rgba(10,21,35,.42) 56%,rgba(10,21,35,.3) 100%)" }} />
          <div style={{ position: "relative", padding: "clamp(22px,3.6vw,42px)", display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>
            <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#F8B800", padding: "6px 16px", alignSelf: "flex-start" }}>
              <span style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#101010" }}>Lot ops &middot; duPont REGISTRY, Lebanon TN</span>
            </span>
            <h1 style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(34px,6vw,66px)", lineHeight: 1.02, letterSpacing: "-.028em", textTransform: "uppercase", color: "#FFFFFF" }}>
              The gate opens<br /><span style={{ color: "#F8B800" }}>at eight</span>
            </h1>
            <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "clamp(17px,1.8vw,19px)", lineHeight: 1.56, color: "#EDF1F6", maxWidth: "54ch", textShadow: "0 1px 10px rgba(10,21,35,.85)" }}>
              The bay door goes up and there&rsquo;s a transporter already waiting. Some mornings it&rsquo;s one car. Some mornings you can&rsquo;t walk through the place. I run duPont REGISTRY&rsquo;s lot operations, and this is what that looks like.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="https://instagram.com/PaddockGavin" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#F8B800", color: "#101010", padding: "15px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>
                Watch the mornings
              </a>
              <Link href="/intake" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.4)", background: "rgba(10,21,35,.36)", backdropFilter: "blur(8px)", padding: "15px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>
                The full intake
              </Link>
            </div>
          </div>
        </section>

        {/* Lot board */}
        <section style={{ background: "linear-gradient(150deg,rgba(255,255,255,.065),rgba(255,255,255,.013))", backdropFilter: "blur(22px) saturate(155%)", WebkitBackdropFilter: "blur(22px) saturate(155%)", border: "1px solid rgba(255,255,255,.11)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.13)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(18px,2.6vw,26px)", display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F" }}>duPont REGISTRY&rsquo;s lot &mdash; I run its mornings</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(150px,45%),1fr))", gap: 16 }}>
            {[
              { k: "The floor", v: "70,000 sq ft, duPont\u2019s", tone: "#00D2BE" },
              { k: "Gate",      v: "8:00 am",                     tone: "#00D2BE" },
              { k: "Right now", v: lotNow || "\u2014",            tone: "#F8B800" },
              { k: "Outbound",  v: "Verified first",              tone: "#00D2BE" },
            ].map(row => (
              <span key={row.k} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F" }}>{row.k}</span>
                <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 15, letterSpacing: ".08em", textTransform: "uppercase", color: row.tone, fontVariantNumeric: "tabular-nums" }}>{row.v}</span>
              </span>
            ))}
          </div>
        </section>

        {/* The sequence — animated step tabs */}
        <section style={{ background: "linear-gradient(150deg,rgba(255,255,255,.065),rgba(255,255,255,.013))", backdropFilter: "blur(24px) saturate(160%)", WebkitBackdropFilter: "blur(24px) saturate(160%)", border: "1px solid rgba(255,255,255,.11)", borderLeft: "3px solid #00D2BE", boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(22px,3.2vw,34px)", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#00D2BE", padding: "6px 16px" }}>
              <span style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#00302B" }}>Everything inbound</span>
            </span>
            <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 16, height: 1, background: "rgba(255,255,255,.14)", display: "block" }} />
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#91918F" }}>Before it goes anywhere</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {STEPS.map((st, i) => (
              <button
                key={st.word}
                type="button"
                onClick={() => setStep(i)}
                aria-label={st.word}
                style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 9, background: "transparent", border: 0, padding: "6px 2px" }}
              >
                <i aria-hidden="true" style={{ width: 14, height: 14, borderRadius: "50%", background: i === step ? "#00D2BE" : "rgba(255,255,255,.14)", boxShadow: i === step ? "0 0 12px rgba(0,210,190,.8)" : "none", transition: "background .25s,box-shadow .25s", display: "block" }} />
                <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: i === step ? "#EDF1F6" : "#91918F", transition: "color .25s" }}>{st.word}</span>
              </button>
            ))}
          </div>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 800, fontSize: "clamp(22px,3.2vw,34px)", lineHeight: 1.16, letterSpacing: "-.018em", color: "#FFFFFF", maxWidth: "30ch", minHeight: "2.4em" }}>
            {STEPS[step].line}
          </p>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 16, lineHeight: 1.58, color: "#C4CBD6", maxWidth: "58ch" }}>
            Five words is the whole of it. The step-by-step lives on its own page &mdash; <Link href="/intake" style={{ color: "#00D2BE" }}>the intake</Link>.
          </p>
        </section>

        {/* The crew */}
        <section style={{ background: "linear-gradient(150deg,rgba(248,184,0,.09),rgba(255,255,255,.014))", backdropFilter: "blur(24px) saturate(160%)", WebkitBackdropFilter: "blur(24px) saturate(160%)", border: "1px solid rgba(248,184,0,.28)", borderLeft: "3px solid #F8B800", boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(22px,3.2vw,34px)", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#F8B800", padding: "6px 16px" }}>
              <span style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#101010" }}>The crew</span>
            </span>
            <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 16, height: 1, background: "rgba(255,255,255,.14)", display: "block" }} />
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#91918F" }}>It never stops</span>
          </div>
          <h2 style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(26px,3.8vw,42px)", lineHeight: 1.02, letterSpacing: "-.024em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "22ch" }}>
            Four of us run <span style={{ color: "#F8B800" }}>the warehouse</span>
          </h2>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 17, lineHeight: 1.58, color: "#C4CBD6", maxWidth: "60ch" }}>
            Me and three lot ops techs, on duPont REGISTRY&rsquo;s warehouse floor. It never stops, it never looks the same two days running, and the cars passing through are some of the most sought-after in the world.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F" }}>In it with us, every day</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(230px,100%),1fr))", gap: "10px 22px" }}>
              {CREW.map(name => (
                <span key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <i aria-hidden="true" style={{ width: 26, height: 3, background: "#00D2BE", flex: "0 0 auto", display: "block" }} />
                  <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#B4B6B2" }}>{name}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Outbound CTA */}
        <section style={{ background: "linear-gradient(150deg,rgba(0,81,133,.9),rgba(0,81,133,.66))", backdropFilter: "blur(22px) saturate(150%)", WebkitBackdropFilter: "blur(22px) saturate(150%)", border: "1px solid #0A6BAA", boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(22px,3.2vw,34px)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(16px,2.6vw,28px)" }}>
          <div style={{ flex: "1 1 300px", minWidth: 0 }}>
            <h2 style={{ margin: "0 0 12px", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(24px,3.2vw,36px)", lineHeight: 1.02, letterSpacing: "-.022em", textTransform: "uppercase", color: "#FFFFFF" }}>Nothing moves until we&rsquo;re sure</h2>
            <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 17, lineHeight: 1.58, color: "#CFE4F4", maxWidth: "56ch" }}>Everything leaving gets verified first. There&rsquo;s real fraud in this business, and somebody trusted us with a car they love.</p>
          </div>
          <div style={{ flex: "0 0 auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/book" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#F8B800", color: "#101010", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>
              Buy, trade or sell
            </Link>
          </div>
        </section>

      </main>

      <SiteFooter />
    </>
  )
}
