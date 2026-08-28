"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

/* Copy ran through RAIL Redline, WARM / WEB PAGE / US, zero tells, with an
   explicit instruction not to introduce facts absent from the draft. */

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const CLIP = "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)"
const CLIP_SM = "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)"

export type ApplyProps = {
  kicker: string
  title: string
  lede: string
  body: string[]
  img: string
  focal?: string
  tone: string
  asks: { t: string; b: string }[]
  asksHead: string
  cta: { label: string; href: string }
  note?: string
}

export function ApplyPage(p: ApplyProps) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-r]"))
    if (reduce) {
      els.forEach((e) => e.classList.add("in"))
      return
    }
    const io = new IntersectionObserver(
      (en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target) } }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <SiteNav active="events" />
      <style>{`
        @keyframes pgKen{from{transform:scale(1.02)}to{transform:scale(1.12) translateY(-1.2%)}}
        [data-r]{opacity:0;transform:translate3d(0,24px,0)}
        [data-r].in{opacity:1;transform:none;transition:opacity .8s cubic-bezier(.16,.84,.32,1) var(--d,0ms),transform .8s cubic-bezier(.16,.84,.32,1) var(--d,0ms)}
        .pgKen{animation:pgKen 28s ease-in-out infinite alternate;transform-origin:center}
        .pgTile{transition:transform .45s cubic-bezier(.16,.84,.32,1),border-color .3s}
        @media (hover:hover){.pgTile:hover{transform:translateY(-4px)}}
        @media (prefers-reduced-motion:reduce){
          [data-r],[data-r].in{opacity:1!important;transform:none!important;transition:none!important}
          .pgKen{animation:none!important}.pgTile{transition:none!important}
        }
      `}</style>

      <main style={{ background: "#0A1523" }}>
        <section style={{ position: "relative", minHeight: "76svh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
          <Image className="pgKen" src={p.img} alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: p.focal || "center 55%" }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.97) 8%,rgba(10,21,35,.42) 60%,rgba(10,21,35,.6) 100%)" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px) clamp(40px,8vh,88px)", display: "flex", flexDirection: "column", gap: 16 }}>
            <span data-r="" style={{ fontFamily: MONO, fontSize: "clamp(10.5px,1.3vw,12px)", letterSpacing: ".26em", textTransform: "uppercase", color: p.tone }}>
              {p.kicker} &middot; October 10, 2026
            </span>
            <h1 data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(32px,6.6vw,68px)", lineHeight: .96, letterSpacing: "-.03em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "16ch", ["--d" as string]: "90ms" }}>
              {p.title}
            </h1>
            <p data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(16px,1.9vw,20px)", lineHeight: 1.5, color: "#E7ECF3", maxWidth: "48ch", ["--d" as string]: "170ms" }}>
              {p.lede}
            </p>
          </div>
        </section>

        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(32px,6vh,72px) clamp(16px,5vw,40px) clamp(48px,10vh,110px)", display: "flex", flexDirection: "column", gap: "clamp(20px,3vw,32px)" }}>
          <div data-r="" style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: "58ch" }}>
            {p.body.map((b) => (
              <p key={b.slice(0, 22)} style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(15.5px,1.7vw,18px)", lineHeight: 1.62, color: "#D3DAE4" }}>{b}</p>
            ))}
          </div>

          <div data-r="" style={{ ["--d" as string]: "90ms", display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: p.tone }}>{p.asksHead}</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(236px,1fr))", gap: 12 }}>
              {p.asks.map((a) => (
                <div key={a.t} className="pgTile" style={{ border: "1px solid rgba(255,255,255,.12)", background: "rgba(21,37,56,.5)", clipPath: CLIP_SM, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontFamily: ARCHIVO, fontWeight: 900, fontSize: 15, textTransform: "uppercase", letterSpacing: "-.008em", color: "#FFFFFF" }}>{a.t}</span>
                  <span style={{ fontFamily: ARCHIVO, fontSize: 14.5, lineHeight: 1.5, color: "#C4CCD6" }}>{a.b}</span>
                </div>
              ))}
            </div>
          </div>

          {p.note && (
            <p data-r="" style={{ ["--d" as string]: "140ms", margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(15px,1.6vw,17px)", lineHeight: 1.6, color: "#B4B6B2", maxWidth: "54ch", borderLeft: `2px solid ${p.tone}`, paddingLeft: 16 }}>
              {p.note}
            </p>
          )}

          <div data-r="" style={{ ["--d" as string]: "190ms", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <a href={p.cta.href} target={p.cta.href.startsWith("http") ? "_blank" : undefined} rel="noopener" style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: p.tone, color: "#101010", padding: "16px 28px", clipPath: CLIP_SM, textDecoration: "none" }}>
              {p.cta.label}
            </a>
            <Link href="/events/pistonpoweredranch" style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none" }}>
              Back to the event
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
