"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

const arch = "Archivo,Helvetica,Arial,sans-serif"
const mono = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"


export default function SupercarIQPage() {
  const DEFS = [
    { label: "Factory spec",       v: 30 },
    { label: "Safety record",      v: 50 },
    { label: "Market fingerprint", v: 75 },
    { label: "Visual tells",       v: 100 },
  ]
  const STATUS = ["Spec on file", "+ recalls and crash ratings", "+ live market fingerprint", "Fully studied \u2014 scan-ready"]
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const autoRef = useRef(auto)
  autoRef.current = auto

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) { setActive(3); setAuto(false); return }
    const t = setInterval(() => {
      if (!autoRef.current) return
      setActive(a => a >= 3 ? 0 : a + 1)
    }, 2200)
    return () => clearInterval(t)
  }, [])

  const score = `${DEFS[active].v}/100`
  const meterW = `${DEFS[active].v}%`

  return (
    <div style={{ minHeight: "100vh", background: "#0E1A2A" }}>
      <SiteNav active="scoreboard" />

      {/* Hero */}
      <section style={{ padding: "clamp(48px,8vw,88px) clamp(20px,5vw,40px) clamp(40px,6vw,70px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(340px,100%),1fr))", gap: "clamp(28px,4vw,56px)", alignItems: "center" }}>
          <div>
            <span style={{ display: "inline-block", background: "#00D2BE", transform: "skewX(-12deg)", padding: "7px 16px", margin: "0 0 26px" }}><span style={{ display: "inline-block", transform: "skewX(12deg)", fontWeight: 800, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: "#00302B" }}>Launches Sep 2026 &middot; pre-order open</span></span>
            <h1 style={{ margin: "0 0 18px", fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", fontFamily: arch }}>
              <span style={{ display: "block" }}>Point it at a supercar.</span>
              <span style={{ display: "block", color: "#F2C94C" }}>Get the dossier.</span>
            </h1>
            <p style={{ margin: "0 0 28px", fontSize: 19, lineHeight: 1.65, color: "#B4B6B2", maxWidth: "50ch" }}>Supercar IQ reads a photo and answers with the whole record &mdash; factory spec, tire sizes, recalls, crash ratings, what it sells for and where. Not a guess dressed up as an answer: a file that was built before you ever raised the phone.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <a href="#preorder" style={{ display: "inline-flex", alignItems: "center", fontFamily: arch, fontWeight: 800, fontSize: 15, letterSpacing: ".05em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>Pre-order &middot; from $4.99</a>
              <a href="https://instagram.com/itspaddockgavin" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", fontFamily: arch, fontWeight: 800, fontSize: 15, letterSpacing: ".05em", textTransform: "uppercase", color: "#00D2BE", border: "1px solid #00D2BE", padding: "14px 25px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>Follow @itspaddockgavin</a>
            </div>
          </div>
          <figure style={{ margin: 0, position: "relative", border: "1px solid #27384F", background: "#0A1523", overflow: "hidden" }}>
            <div style={{ aspectRatio: "4/3", background: "#152538", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ textAlign: "center", padding: 32 }}>
                <p style={{ margin: "0 0 12px", fontFamily: mono, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#00D2BE" }}>Supercar IQ</p>
                <p style={{ margin: "0 0 8px", fontFamily: arch, fontWeight: 900, fontSize: 28, color: "#FFFFFF", letterSpacing: "-.02em", textTransform: "uppercase" }}>Scanning&hellip;</p>
                <div style={{ width: 120, height: 2, background: "#27384F", margin: "0 auto" }}>
                  <div style={{ width: "60%", height: "100%", background: "#00D2BE" }} />
                </div>
              </div>
              {/* corner brackets */}
              {["tl","tr","bl","br"].map(p => (
                <i key={p} aria-hidden="true" style={{ position: "absolute", width: 26, height: 26, ...(p[0]==="t"?{top:10}:{bottom:10}), ...(p[1]==="l"?{left:10}:{right:10}), borderTop: p[0]==="t" ? "2px solid #00D2BE" : "none", borderBottom: p[0]==="b" ? "2px solid #00D2BE" : "none", borderLeft: p[1]==="l" ? "2px solid #00D2BE" : "none", borderRight: p[1]==="r" ? "2px solid #00D2BE" : "none" }} />
              ))}
            </div>
          </figure>
        </div>
      </section>

      {/* Spec strip */}
      <div style={{ background: "#0A1523", borderTop: "1px solid #27384F", borderBottom: "1px solid #27384F" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap" }}>
          {[["Launch","Sep 2026"],["Pre-order","From $4.99"],["It studies","Every night"]].map(([k,v]) => (
            <div key={String(k)} style={{ flex: "1 1 170px", padding: "16px 20px", borderRight: "1px solid #27384F" }}>
              <p style={{ margin: "0 0 4px", fontFamily: mono, fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "#848482" }}>{k}</p>
              <p style={{ margin: 0, fontFamily: mono, fontSize: 17, letterSpacing: ".08em", color: "#00D2BE" }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The capsule */}
      <section style={{ padding: "clamp(48px,8vw,88px) clamp(20px,5vw,40px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "#00D2BE", transform: "skewX(-12deg)", padding: "7px 16px", margin: "0 0 20px" }}><span style={{ display: "inline-block", transform: "skewX(12deg)", fontWeight: 800, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: "#00302B" }}>The capsule</span></span>
          <h2 style={{ margin: "0 0 14px", fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", maxWidth: "22ch", fontFamily: arch }}>Every car earns a permanent file</h2>
          <p style={{ margin: "0 0 34px", fontSize: 18, lineHeight: 1.65, color: "#B4B6B2", maxWidth: "58ch" }}>For each make, model and year, Supercar IQ keeps one record &mdash; the capsule &mdash; and fills it from four directions. Built once, checked nightly, ready before you ask.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(250px,100%),1fr))", gap: 2, background: "#27384F", border: "1px solid #27384F" }}>
            {[
              ["01 \u00b7 Factory spec","Engine, gearbox, drivetrain, horsepower, 0\u201360, top speed, curb weight \u2014 and the tire sizes it left the factory on."],
              ["02 \u00b7 Safety record","Recalls with what they were for, federal crash ratings, complaint counts. The part sellers skip."],
              ["03 \u00b7 Market fingerprint","Real comps: the value range, the trend, which colors carry a premium, and which auction house moves the most of them."],
              ["04 \u00b7 Visual tells","The things your eye checks \u2014 pop-up headlights, a Targa bar, flying buttresses \u2014 taught to the scanner, one silhouette at a time."],
            ].map(([t,d]) => (
              <div key={String(t)} style={{ background: "#152538", padding: "clamp(20px,2.6vw,28px)" }}>
                <p style={{ margin: "0 0 10px", fontFamily: mono, fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "#00D2BE" }}>{t}</p>
                <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.6, color: "#B4B6B2" }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capsule health interactive */}
      <section style={{ background: "#0A1523", padding: "clamp(48px,8vw,88px) clamp(20px,5vw,40px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))", gap: "clamp(28px,4vw,56px)", alignItems: "center" }}>
          <div>
            <span style={{ display: "inline-block", background: "#00D2BE", transform: "skewX(-12deg)", padding: "7px 16px", margin: "0 0 20px" }}><span style={{ display: "inline-block", transform: "skewX(12deg)", fontWeight: 800, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: "#00302B" }}>Capsule health</span></span>
            <h2 style={{ margin: "0 0 14px", fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", maxWidth: "20ch", fontFamily: arch }}>A file that fills itself in</h2>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.65, color: "#B4B6B2", maxWidth: "50ch" }}>A capsule scores itself as it grows &mdash; spec first, then safety, then market, then the visual read. Tap the layers to watch one build.</p>
          </div>
          <div style={{ background: "#152538", border: "1px solid #27384F", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(20px,3vw,30px)" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14, margin: "0 0 6px" }}>
              <p style={{ margin: 0, fontFamily: mono, fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "#848482" }}>Capsule completeness</p>
              <p style={{ margin: 0, fontFamily: mono, fontSize: 26, letterSpacing: ".06em", color: "#00D2BE", fontVariantNumeric: "tabular-nums" }}>{score}</p>
            </div>
            <div style={{ height: 8, background: "#0A1523", border: "1px solid #27384F", margin: "0 0 18px" }}>
              <div style={{ display: "block", height: "100%", width: meterW, background: "#00D2BE", transition: "width .5s cubic-bezier(.2,.7,.2,1)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {DEFS.map((l, i) => (
                <button key={l.label} onClick={() => { setActive(i); setAuto(false) }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", background: i === active ? "rgba(0,210,190,.08)" : "transparent", border: `1px solid ${i === active ? "#00D2BE" : "#27384F"}`, padding: "12px 14px", cursor: "pointer", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)", transition: "background .25s,border-color .25s" }}>
                  <i style={{ width: 8, height: 8, flex: "0 0 auto", background: i <= active ? "#00D2BE" : "#27384F", transition: "background .25s" }} />
                  <span style={{ flex: "1 1 auto", fontFamily: arch, fontWeight: 800, fontSize: 13.5, letterSpacing: ".12em", textTransform: "uppercase", color: i <= active ? "#FFFFFF" : "#848482" }}>{l.label}</span>
                  <span style={{ fontFamily: mono, fontSize: 12.5, letterSpacing: ".14em", color: i <= active ? "#00D2BE" : "#848482" }}>{i <= active ? `+${l.v}` : "\u2014"}</span>
                </button>
              ))}
            </div>
            <p style={{ margin: "16px 0 0", fontFamily: mono, fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase", color: "#848482", minHeight: 18 }}>{STATUS[active]}</p>
          </div>
        </div>
      </section>

      {/* The scan */}
      <section style={{ padding: "clamp(48px,8vw,88px) clamp(20px,5vw,40px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "#00D2BE", transform: "skewX(-12deg)", padding: "7px 16px", margin: "0 0 20px" }}><span style={{ display: "inline-block", transform: "skewX(12deg)", fontWeight: 800, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: "#00302B" }}>The scan</span></span>
          <h2 style={{ margin: "0 0 14px", fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", maxWidth: "22ch", fontFamily: arch }}>The AI and the file answer together</h2>
          <p style={{ margin: "0 0 12px", fontSize: 18, lineHeight: 1.65, color: "#B4B6B2", maxWidth: "58ch" }}>When you scan, the live AI and the capsule are asked at the same time. Where they agree, you get confirmation. Where they disagree on a number, the factory record wins &mdash; a spec sheet does not hallucinate horsepower.</p>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.65, color: "#B4B6B2", maxWidth: "58ch" }}>Tire sizes, crash ratings and recall counts arrive with the identification, not as a second search you have to run.</p>
          <div style={{ margin: "34px 0 0", border: "1px solid #27384F", background: "#0E1A2A" }}>
            {[["SCAN","The whole record, the moment the car is identified."],["GARAGE","The same record pinned to your car, with your price, dates and notes on top."],["VALUE","The capsule\u2019s range against the live market feed \u2014 two sources checking each other."],["STUDIO","The dossier condensed into a card and caption, ready to post."]].map(([k,v]) => (
              <div key={String(k)} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0 clamp(14px,2vw,24px)", alignItems: "baseline", borderBottom: "1px solid #27384F", padding: "15px clamp(14px,2vw,22px)" }}>
                <span style={{ fontFamily: mono, fontSize: 13, letterSpacing: ".14em", color: "#F2C94C" }}>{k}</span>
                <span style={{ fontSize: 16.5, lineHeight: 1.6, color: "#B4B6B2" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-order */}
      <section id="preorder" style={{ background: "#0A1523", padding: "clamp(48px,8vw,88px) clamp(20px,5vw,40px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div aria-hidden="true" style={{ height: 9, background: "repeating-linear-gradient(112deg,#F2C94C 0 24px,#0A1523 24px 48px)", margin: "0 0 clamp(28px,4vw,44px)" }} />
          <span style={{ display: "inline-block", background: "#00D2BE", transform: "skewX(-12deg)", padding: "7px 16px", margin: "0 0 20px" }}><span style={{ display: "inline-block", transform: "skewX(12deg)", fontWeight: 800, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: "#00302B" }}>Pre-order</span></span>
          <h2 style={{ margin: "0 0 14px", fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", maxWidth: "22ch", fontFamily: arch }}>Hold your seat before the doors open</h2>
          <p style={{ margin: "0 0 34px", fontSize: 18, lineHeight: 1.65, color: "#B4B6B2", maxWidth: "54ch" }}>Pre-order locks the early price. The app lands at the end of September; your access starts the day it does.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: 14, maxWidth: 820 }}>
            {[{tier:"First 60 days",color:"#00D2BE",price:"$4.99",sub:"with pre-order",desc:"Two months of the full record \u2014 every scan, every capsule \u2014 for the price of a coffee."},
              {tier:"First 12 months",color:"#F2C94C",price:"$19.99",sub:"/year",desc:"A full year, locked before the price moves."}].map(({tier,color,price,sub,desc}) => (
              <div key={tier} style={{ background: "#152538", border: "1px solid #27384F", borderTop: `3px solid ${color}`, clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(22px,3vw,30px)", display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ margin: 0, fontFamily: mono, fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color }}>{tier}</p>
                <p style={{ margin: 0, display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontFamily: arch, fontWeight: 900, fontSize: "clamp(38px,4vw,52px)", lineHeight: 1, letterSpacing: "-.02em", color: "#FFFFFF" }}>{price}</span>
                  <span style={{ fontSize: 15, color: "#B4B6B2" }}>{sub}</span>
                </p>
                <p style={{ margin: "0 0 8px", fontSize: 16, lineHeight: 1.6, color: "#B4B6B2" }}>{desc}</p>
                <a href="https://supercariq.com" target="_blank" rel="noopener noreferrer" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", fontFamily: arch, fontWeight: 800, fontSize: 14, letterSpacing: ".05em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "13px 22px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>Pre-order &middot; {price}</a>
              </div>
            ))}
          </div>
          <p style={{ margin: "22px 0 0", fontSize: 15.5, lineHeight: 1.6, color: "#848482", maxWidth: "54ch" }}>Pre-orders run at <a href="https://supercariq.com" target="_blank" rel="noopener noreferrer" style={{ color: "#00D2BE" }}>supercariq.com</a>. Follow <a href="https://instagram.com/itspaddockgavin" target="_blank" rel="noopener noreferrer" style={{ color: "#00D2BE" }}>@itspaddockgavin</a> for build updates between now and launch.</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
