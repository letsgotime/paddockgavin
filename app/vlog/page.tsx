import Link from "next/link"
import type { Metadata } from "next"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "The Vlog",
  description: "The PaddockGavin vlog, vertical phone video from the lot in Lebanon and Gavin\u2019s own garage. Clips land on Instagram first.",
}

const arch = "Archivo,Helvetica,Arial,sans-serif"
const mono = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

const EPS = [1,2,3,4,5,6].map(i => ({ id: `vlog-ep-${i}`, label: `EP 0${i}` }))

export default function VlogPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0E1A2A" }}>
      <SiteNav active="vlog" />

      {/* Hero */}
      <section style={{ padding: "clamp(48px,8vw,88px) clamp(20px,5vw,40px) clamp(40px,6vw,64px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "#00D2BE", transform: "skewX(-12deg)", padding: "7px 16px", margin: "0 0 26px" }}><span style={{ display: "inline-block", transform: "skewX(12deg)", fontWeight: 800, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: "#00302B" }}>The vlog</span></span>
          <h1 style={{ margin: "0 0 20px", fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", maxWidth: "16ch", fontFamily: arch }}>
            <span style={{ display: "block" }}>The lot, on video.</span>
            <span style={{ display: "block", color: "#F2C94C" }}>Vertical, like it was shot.</span>
          </h1>
          <p style={{ margin: "0 0 30px", fontSize: 19, lineHeight: 1.65, color: "#B4B6B2", maxWidth: "56ch" }}>Everything here starts as a phone video &mdash; trunk releases, hood latches, what came off the transporter this morning. The clips land on Instagram first. This page is the shelf they end up on.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", margin: "0 0 40px" }}>
            <a href="https://instagram.com/itspaddockgavin" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", fontFamily: arch, fontWeight: 800, fontSize: 15, letterSpacing: ".05em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>Watch on Instagram</a>
            <span style={{ fontFamily: mono, fontSize: 13, letterSpacing: ".18em", textTransform: "uppercase", color: "#B4B6B2" }}>@itspaddockgavin</span>
          </div>
          {/* Stats */}
          <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #27384F", background: "#152538" }}>
            {[["Views / 30 days","1,000,000"],["Followers","7,900"],["Format","Vertical"]].map(([k,v]) => (
              <div key={String(k)} style={{ flex: "1 1 200px", padding: "16px 20px", borderRight: "1px solid #27384F" }}>
                <p style={{ margin: "0 0 4px", fontFamily: mono, fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "#848482" }}>{k}</p>
                <p style={{ margin: 0, fontFamily: mono, fontSize: 19, letterSpacing: ".08em", color: "#00D2BE" }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Worth keeping */}
      <section style={{ background: "#0A1523", padding: "clamp(48px,8vw,88px) clamp(20px,5vw,40px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, borderTop: "1px solid #27384F", padding: "13px 0 0", margin: "0 0 10px" }}>
            <span style={{ fontFamily: arch, fontWeight: 700, fontSize: "clamp(15px,1.05vw,19px)", letterSpacing: ".16em", textTransform: "uppercase", color: "#EDF1F6", flex: "0 0 auto" }}>Worth keeping</span>
            <i style={{ flex: "1 1 auto", height: 5, background: "repeating-linear-gradient(90deg,rgba(255,255,255,.2) 0 1px,transparent 1px 6px)" }} />
          </div>
          <p style={{ margin: "0 0 26px", fontSize: 17, lineHeight: 1.6, color: "#8E99A8", maxWidth: "56ch" }}>The clips that deserve to outlive the feed.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(180px,44%),1fr))", gap: 8 }}>
            {EPS.map(ep => (
              <figure key={ep.id} style={{ margin: 0, background: "#0E1A2A", border: "1px solid #27384F" }}>
                <div style={{ width: "100%", aspectRatio: "9/16", background: "#152538", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#848482" }}>Drop a frame</span>
                </div>
                <figcaption style={{ padding: "9px 12px", fontFamily: mono, fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "#848482" }}>{ep.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* DM CTA */}
      <section style={{ padding: "clamp(48px,8vw,88px) clamp(20px,5vw,40px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", background: "#005185", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(24px,4vw,34px)", display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: "1 1 320px" }}>
            <h2 style={{ margin: "0 0 8px", fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", fontFamily: arch }}>See something worth filming?</h2>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: "#CFE4F4", maxWidth: "48ch" }}>DM me. If it is on the lot on a Saturday, there is a fair chance I am standing next to it.</p>
          </div>
          <a href="https://instagram.com/itspaddockgavin" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", fontFamily: arch, fontWeight: 800, fontSize: 15, letterSpacing: ".05em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>DM @itspaddockgavin</a>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
