import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "The E92",
  description: "The E92 M3 build log: 25 hours on the paint, vents out and DLUX-coated, ECS stud conversion, wheels corrected and finished in gloss black.",
}

const arch = "Archivo,Helvetica,Arial,sans-serif"
const mono = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

export default function E92Page() {
  return (
    <div style={{ minHeight: "100vh", background: "#0E1A2A" }}>
      <SiteNav active="cars" />

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", isolation: "isolate", display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: "66svh" }}>
        <Image src="/images/f458-side.webp" alt="The E92 M3, Alpine White" fill style={{ objectFit: "cover" }} priority />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(0deg,rgba(10,21,35,.94) 0%,rgba(10,21,35,.55) 42%,rgba(10,21,35,.08) 78%)" }} />
        <div style={{ position: "relative", zIndex: 2, padding: "clamp(20px,5vw,40px)", maxWidth: 1080, margin: "0 auto", width: "100%" }}>
          <p className="pg-e0" style={{ margin: "0 0 14px", display: "inline-flex", alignItems: "center", gap: 12, fontFamily: mono, fontSize: 13, letterSpacing: ".2em", textTransform: "uppercase", color: "#EDF1F6", background: "rgba(10,21,35,.82)", padding: "9px 16px 9px 14px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)" }}>
            <i aria-hidden="true" style={{ width: 26, height: 3, background: "#00D2BE", flex: "0 0 auto" }} />
            2013 BMW M3 &middot; E92 ZCP &middot; Alpine White
          </p>
          <h1 style={{ margin: "0 0 16px", fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", fontFamily: arch }}>
            <span style={{ display: "block" }}>One car.</span>
            <span style={{ display: "block", color: "#F2C94C" }}>Twenty-five hours.</span>
          </h1>
          <p style={{ margin: 0, fontSize: 19, lineHeight: 1.65, color: "#DDE3EB", maxWidth: "54ch" }}>The newest car in the garage is the last naturally aspirated M3. This is the log: paint corrected, vents coated, studs converted, wheels out to gloss black.</p>
        </div>
      </section>

      {/* Spec strip */}
      <div style={{ background: "#0A1523", borderTop: "1px solid #27384F", borderBottom: "1px solid #27384F" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap" }}>
          {[["Chassis","E92 ZCP"],["Paint","Alpine White"],["Hours on paint","25"],["Tires","Michelin PS4S"]].map(([k,v]) => (
            <div key={String(k)} style={{ flex: "1 1 170px", padding: "16px 20px", borderRight: "1px solid #27384F" }}>
              <p style={{ margin: "0 0 4px", fontFamily: mono, fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "#848482" }}>{k}</p>
              <p style={{ margin: 0, fontFamily: mono, fontSize: 17, letterSpacing: ".08em", color: "#00D2BE" }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Day one */}
      <section style={{ padding: "clamp(48px,8vw,88px) clamp(20px,5vw,40px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))", gap: "clamp(24px,4vw,52px)", alignItems: "center" }}>
          <div>
            <span style={{ display: "inline-block", background: "#00D2BE", transform: "skewX(-12deg)", padding: "7px 16px", margin: "0 0 20px" }}><span style={{ display: "inline-block", transform: "skewX(12deg)", fontWeight: 800, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: "#00302B" }}>Day one</span></span>
            <h2 style={{ margin: "0 0 14px", fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", fontFamily: arch }}>What the sun hides</h2>
            <p style={{ margin: 0, fontSize: 17.5, lineHeight: 1.65, color: "#B4B6B2", maxWidth: "50ch" }}>The inspection lamp went over every panel before anything else did. Twenty-five hours of correction, conditioning and shine followed &mdash; my own count, not a shop estimate.</p>
          </div>
          <figure style={{ margin: 0, border: "1px solid #27384F", background: "#0A1523" }}>
            <Image src="/images/downpipe.webp" alt="Paint inspection" width={560} height={374} style={{ width: "100%", height: "auto", display: "block" }} />
            <figcaption style={{ padding: "10px 14px", fontFamily: mono, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#848482" }}>Swirls under the lamp, before the first pass</figcaption>
          </figure>
        </div>
      </section>

      {/* Correction */}
      <section style={{ background: "#0A1523", padding: "clamp(48px,8vw,88px) clamp(20px,5vw,40px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))", gap: "clamp(24px,4vw,52px)", alignItems: "center" }}>
          <figure style={{ margin: 0, border: "1px solid #27384F", background: "#0E1A2A" }}>
            <Image src="/images/918-pipes.webp" alt="Machine polisher on the paint" width={560} height={374} style={{ width: "100%", height: "auto", display: "block" }} />
            <figcaption style={{ padding: "10px 14px", fontFamily: mono, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#848482" }}>The machine, mid-panel</figcaption>
          </figure>
          <div>
            <span style={{ display: "inline-block", background: "#00D2BE", transform: "skewX(-12deg)", padding: "7px 16px", margin: "0 0 20px" }}><span style={{ display: "inline-block", transform: "skewX(12deg)", fontWeight: 800, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: "#00302B" }}>The correction</span></span>
            <h2 style={{ margin: "0 0 14px", fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", fontFamily: arch }}>Panel by panel</h2>
            <p style={{ margin: 0, fontSize: 17.5, lineHeight: 1.65, color: "#B4B6B2", maxWidth: "50ch" }}>Cut, refine, jewel. Alpine White does not forgive shortcuts &mdash; it just files them under a different light and shows you later.</p>
          </div>
        </div>
      </section>

      {/* Studs */}
      <section style={{ padding: "clamp(48px,8vw,88px) clamp(20px,5vw,40px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))", gap: "clamp(24px,4vw,52px)", alignItems: "center" }}>
          <div>
            <span style={{ display: "inline-block", background: "#00D2BE", transform: "skewX(-12deg)", padding: "7px 16px", margin: "0 0 20px" }}><span style={{ display: "inline-block", transform: "skewX(12deg)", fontWeight: 800, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: "#00302B" }}>The studs</span></span>
            <h2 style={{ margin: "0 0 14px", fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", fontFamily: arch }}>ECS conversion</h2>
            <p style={{ margin: 0, fontSize: 17.5, lineHeight: 1.65, color: "#B4B6B2", maxWidth: "50ch" }}>Wheel bolts out, ECS studs in, all four corners. A wheel that hangs itself on the hub is a wheel you never scratch on the way past the caliper.</p>
          </div>
          <figure style={{ margin: 0, border: "1px solid #27384F", background: "#0E1A2A" }}>
            <Image src="/images/aston-wheel.webp" alt="ECS wheel studs installed" width={560} height={374} style={{ width: "100%", height: "auto", display: "block" }} />
            <figcaption style={{ padding: "10px 14px", fontFamily: mono, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#848482" }}>Studs in, mid-conversion</figcaption>
          </figure>
        </div>
      </section>

      {/* CTA band */}
      <section style={{ padding: "0 clamp(20px,5vw,40px) clamp(48px,8vw,88px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", background: "#152538", border: "1px solid #27384F", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(24px,4vw,34px)", display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: "1 1 320px" }}>
            <h2 style={{ margin: "0 0 8px", fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", fontFamily: arch }}>The method is written down</h2>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: "#B4B6B2", maxWidth: "48ch" }}>Every step on this page is a chapter in the book. One of the <Link href="/cars" style={{ color: "#00D2BE" }}>29 in the register</Link>.</p>
          </div>
          <Link href="/gloss-game" style={{ display: "inline-flex", alignItems: "center", fontWeight: 800, fontSize: 15, letterSpacing: ".05em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>The Gloss Game</Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
