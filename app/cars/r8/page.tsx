import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { PageBackdrop } from "@/components/page-backdrop"

export const metadata: Metadata = {
  title: "The R8",
  description: "The R8 V10 log: the foam bath, the V10 under glass, the deck lid up in the garage, and the shortlist that ended at an R8.",
}

const arch = "Archivo,Helvetica,Arial,sans-serif"
const mono = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

export default function R8Page() {
  return (
    <div style={{ minHeight: "100vh", background: "#0E1A2A" }}>
      <SiteNav active="cars" />
      <PageBackdrop src="/images/f458-wheel.webp" pos="center 50%" opacity={0.2} />

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", isolation: "isolate", display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: "66svh" }}>
        <Image src="/images/f458-wide.webp" alt="The R8 V10 at speed" fill style={{ objectFit: "cover" }} priority />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(0deg,rgba(10,21,35,.94) 0%,rgba(10,21,35,.55) 42%,rgba(10,21,35,.08) 78%)" }} />
        <div style={{ position: "relative", zIndex: 2, padding: "clamp(20px,5vw,40px)", maxWidth: 1080, margin: "0 auto", width: "100%" }}>
          <p className="pg-e0" style={{ margin: "0 0 14px", display: "inline-flex", alignItems: "center", gap: 12, fontFamily: mono, fontSize: 13, letterSpacing: ".2em", textTransform: "uppercase", color: "#EDF1F6", background: "rgba(10,21,35,.82)", padding: "9px 16px 9px 14px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)" }}>
            <i aria-hidden="true" style={{ width: 26, height: 3, background: "#00D2BE", flex: "0 0 auto" }} />
            2014 Audi R8 &middot; V10 &middot; The first supercar
          </p>
          <h1 style={{ margin: "0 0 16px", fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", fontFamily: arch }}>
            <span style={{ display: "block" }}>Ten cylinders.</span>
            <span style={{ display: "block", color: "#F2C94C" }}>One bucket.</span>
          </h1>
          <p style={{ margin: "0 0 26px", fontSize: 19, lineHeight: 1.65, color: "#DDE3EB", maxWidth: "54ch" }}>The first supercar in the register, and the same rules as every car before it: wheels first, foam before the mitt, and nothing touches the paint twice.</p>
        </div>
      </section>

      {/* Spec strip */}
      <div style={{ background: "#0A1523", borderTop: "1px solid #27384F", borderBottom: "1px solid #27384F" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap" }}>
          {[["Year", "2014"], ["Engine", "V10, under glass"], ["The shortlist", "3 cars"]].map(([k, v]) => (
            <div key={String(k)} style={{ flex: "1 1 170px", padding: "16px 20px", borderRight: "1px solid #27384F" }}>
              <p style={{ margin: "0 0 4px", fontFamily: mono, fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "#848482" }}>{k}</p>
              <p style={{ margin: 0, fontFamily: mono, fontSize: 17, letterSpacing: ".08em", color: "#00D2BE" }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The choice */}
      <section style={{ padding: "clamp(48px,8vw,88px) clamp(20px,5vw,40px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))", gap: "clamp(24px,4vw,52px)", alignItems: "center" }}>
          <div>
            <span style={{ display: "inline-block", background: "#00D2BE", transform: "skewX(-12deg)", padding: "7px 16px", margin: "0 0 20px" }}><span style={{ display: "inline-block", transform: "skewX(12deg)", fontWeight: 800, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: "#00302B" }}>The choice</span></span>
            <h2 style={{ margin: "0 0 14px", fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", fontFamily: arch }}>Three cars on the list</h2>
            <p style={{ margin: 0, fontSize: 17.5, lineHeight: 1.65, color: "#B4B6B2", maxWidth: "50ch" }}>It started as a special-order G80 xDrive that never got built. A $500 phone call reframed the question: not a souped-up street car, a purpose-built one. The shortlist came back a 997.2 Turbo, an AMG GT, and the R8 V10, and the advice was to go drive one before deciding. I did. <Link href="/cars" style={{ color: "#00D2BE" }}>The full story is on the register</Link>.</p>
          </div>
          <figure style={{ margin: 0, border: "1px solid #27384F", background: "#0A1523" }}>
            <Image src="/images/gavin-gwagen.webp" alt="Gavin next to the car" width={560} height={374} style={{ width: "100%", height: "auto", display: "block" }} />
            <figcaption style={{ padding: "10px 14px", fontFamily: mono, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#848482" }}>The R8 on the street. The dog came too</figcaption>
          </figure>
        </div>
      </section>

      {/* Foam first */}
      <section style={{ background: "#0A1523", padding: "clamp(48px,8vw,88px) clamp(20px,5vw,40px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "#00D2BE", transform: "skewX(-12deg)", padding: "7px 16px", margin: "0 0 20px" }}><span style={{ display: "inline-block", transform: "skewX(12deg)", fontWeight: 800, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: "#00302B" }}>The ritual</span></span>
          <h2 style={{ margin: "0 0 14px", fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", fontFamily: arch }}>Foam first, glass after</h2>
          <p style={{ margin: "0 0 26px", fontSize: 17.5, lineHeight: 1.65, color: "#B4B6B2", maxWidth: "56ch" }}>A supercar does not change the order of operations. The foam sits, the mitt follows, and the engine bay gets treated like a display case, because on this car, it is one.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))", gap: 8 }}>
            {[["918-pipes.webp","The foam bath, doing its work","01 \u00b7 The foam bath"],["918-charging.webp","The V10 under glass","02 \u00b7 The V10 under glass"]].map(([src, alt, cap]) => (
              <figure key={String(src)} style={{ margin: 0, border: "1px solid #27384F", background: "#0E1A2A" }}>
                <Image src={`/images/${src}`} alt={String(alt)} width={560} height={420} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                <figcaption style={{ padding: "10px 14px", fontFamily: mono, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#848482" }}>{cap}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* The garage */}
      <section style={{ padding: "clamp(48px,8vw,88px) clamp(20px,5vw,40px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))", gap: "clamp(24px,4vw,52px)", alignItems: "center" }}>
          <figure style={{ margin: 0, border: "1px solid #27384F", background: "#0A1523" }}>
            <Image src="/images/g993-cabin.webp" alt="In the garage, deck lid up" width={560} height={374} style={{ width: "100%", height: "auto", display: "block" }} />
            <figcaption style={{ padding: "10px 14px", fontFamily: mono, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#848482" }}>Deck lid up, arsenal shelved, old plates on the wall</figcaption>
          </figure>
          <div>
            <span style={{ display: "inline-block", background: "#00D2BE", transform: "skewX(-12deg)", padding: "7px 16px", margin: "0 0 20px" }}><span style={{ display: "inline-block", transform: "skewX(12deg)", fontWeight: 800, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: "#00302B" }}>The garage</span></span>
            <h2 style={{ margin: "0 0 14px", fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", fontFamily: arch }}>Where the work happened</h2>
            <p style={{ margin: 0, fontSize: 17.5, lineHeight: 1.65, color: "#B4B6B2", maxWidth: "50ch" }}>Deck lid up, products on the shelf behind it, and license plates from the miles before Tennessee on the wall. The R8 got the same bench discipline as every car in the register. The supplies just moved closer.</p>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section style={{ padding: "0 clamp(20px,5vw,40px) clamp(48px,8vw,88px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", background: "#152538", border: "1px solid #27384F", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(24px,4vw,34px)", display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: "1 1 320px" }}>
            <h2 style={{ margin: "0 0 8px", fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", fontFamily: arch }}>The ritual is written down</h2>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: "#B4B6B2", maxWidth: "48ch" }}>Foam order, mitt rules, the whole system, all in the book. The <Link href="/cars/e92" style={{ color: "#00D2BE" }}>E92 got the same treatment in its own build log</Link>.</p>
          </div>
          <Link href="/gloss-game" style={{ display: "inline-flex", alignItems: "center", fontWeight: 800, fontSize: 15, letterSpacing: ".05em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>The Gloss Game</Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
