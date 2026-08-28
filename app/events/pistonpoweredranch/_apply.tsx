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
  bandImg: string
  closeImg: string
  focal?: string
  bandFocal?: string
  tone: string
  asks: { t: string; b: string }[]
  asksHead: string
  cta: { label: string; href: string }
  note?: string
  closeLine: string
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
      (en) =>
        en.forEach((x) => {
          if (x.isIntersecting) {
            x.target.classList.add("in")
            io.unobserve(x.target)
          }
        }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <SiteNav active="events" />
      <style>{`
        @keyframes pgKen{from{transform:scale(1.02)}to{transform:scale(1.13) translateY(-1.4%)}}
        [data-r]{opacity:0;transform:translate3d(0,26px,0)}
        [data-r].in{opacity:1;transform:none;transition:opacity .85s cubic-bezier(.16,.84,.32,1) var(--d,0ms),transform .85s cubic-bezier(.16,.84,.32,1) var(--d,0ms)}
        .pgKen{animation:pgKen 30s ease-in-out infinite alternate;transform-origin:center}
        .pgBand{position:sticky;top:0;height:100svh;overflow:hidden}
        .pgTile{transition:transform .5s cubic-bezier(.16,.84,.32,1),border-color .3s}
        @media (hover:hover){.pgTile:hover{transform:translateY(-4px);border-color:rgba(255,255,255,.3)}}
        .pgGo{transition:transform .3s cubic-bezier(.16,.84,.32,1)}
        @media (hover:hover){.pgGo:hover{transform:translateY(-2px)}}
        @media (prefers-reduced-motion:reduce){
          [data-r],[data-r].in{opacity:1!important;transform:none!important;transition:none!important}
          .pgKen{animation:none!important}
          .pgTile,.pgGo{transition:none!important}
        }
      `}</style>

      <main style={{ background: "#0A1523" }}>
        <section style={{ position: "relative", minHeight: "88svh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
          <Image className="pgKen" src={p.img} alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: p.focal || "center 55%" }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.97) 8%,rgba(10,21,35,.4) 58%,rgba(10,21,35,.6) 100%)" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px) clamp(44px,9vh,96px)", display: "flex", flexDirection: "column", gap: 16 }}>
            <span data-r="" style={{ fontFamily: MONO, fontSize: "clamp(10.5px,1.3vw,12px)", letterSpacing: ".26em", textTransform: "uppercase", color: p.tone }}>
              {p.kicker} &middot; October 10, 2026
            </span>
            <h1 data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(32px,7vw,72px)", lineHeight: 0.95, letterSpacing: "-.03em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "16ch", ["--d" as string]: "90ms" }}>
              {p.title}
            </h1>
            <p data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(16px,1.9vw,20px)", lineHeight: 1.5, color: "#E7ECF3", maxWidth: "48ch", ["--d" as string]: "170ms" }}>
              {p.lede}
            </p>
          </div>
        </section>

        <section style={{ position: "relative" }}>
          <div className="pgBand" aria-hidden="true">
            <Image src={p.bandImg} alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: p.bandFocal || "center 50%" }} />
            <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(10,21,35,.88) 0%,rgba(10,21,35,.42) 34%,rgba(10,21,35,.95) 100%)" }} />
          </div>
          <div style={{ position: "relative", marginTop: "-56svh", paddingBottom: "clamp(36px,8vh,84px)" }}>
            <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px)" }}>
              <div
                data-r=""
                style={{
                  background: "rgba(10,21,35,.82)",
                  backdropFilter: "blur(26px) saturate(165%)",
                  WebkitBackdropFilter: "blur(26px) saturate(165%)",
                  border: "1px solid rgba(255,255,255,.13)",
                  borderTop: `3px solid ${p.tone}`,
                  boxShadow: "0 30px 90px rgba(0,0,0,.5)",
                  clipPath: CLIP,
                  padding: "clamp(22px,4vw,44px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {p.body.map((b, i) => (
                  <p key={b.slice(0, 22)} style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(15.5px,1.8vw,19px)", lineHeight: 1.6, color: i === 0 ? "#E7ECF3" : "#C9D1DB", maxWidth: "58ch" }}>
                    {b}
                  </p>
                ))}
                {p.note && (
                  <p style={{ margin: "4px 0 0", fontFamily: ARCHIVO, fontSize: "clamp(15px,1.6vw,17px)", lineHeight: 1.6, color: "#B4B6B2", maxWidth: "54ch", borderLeft: `2px solid ${p.tone}`, paddingLeft: 16 }}>
                    {p.note}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(8px,2vh,20px) clamp(16px,5vw,40px) clamp(40px,9vh,96px)", display: "flex", flexDirection: "column", gap: 16 }}>
          <span data-r="" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: p.tone }}>
            {p.asksHead}
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(236px,1fr))", gap: 12 }}>
            {p.asks.map((a, i) => (
              <div
                key={a.t}
                data-r=""
                className="pgTile"
                style={{ border: "1px solid rgba(255,255,255,.12)", background: "rgba(21,37,56,.55)", clipPath: CLIP_SM, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 7, ["--d" as string]: `${i * 80}ms` }}
              >
                <span style={{ fontFamily: ARCHIVO, fontWeight: 900, fontSize: 15.5, textTransform: "uppercase", letterSpacing: "-.008em", color: "#FFFFFF" }}>{a.t}</span>
                <span style={{ fontFamily: ARCHIVO, fontSize: 14.5, lineHeight: 1.5, color: "#C4CCD6" }}>{a.b}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ position: "relative" }}>
          <div className="pgBand" aria-hidden="true">
            <Image src={p.closeImg} alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 50%" }} />
            <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(10,21,35,.86) 0%,rgba(10,21,35,.46) 30%,rgba(10,21,35,.9) 78%,rgba(10,21,35,.99) 100%)" }} />
          </div>
          <div style={{ position: "relative", marginTop: "-66svh", paddingBottom: "clamp(56px,13vh,140px)" }}>
            <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px)", display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" }}>
              <p data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(22px,3.6vw,38px)", lineHeight: 1.06, letterSpacing: "-.024em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "20ch" }}>
                {p.closeLine}
              </p>
              <div data-r="" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", ["--d" as string]: "110ms" }}>
                <a
                  className="pgGo"
                  href={p.cta.href}
                  target={p.cta.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener"
                  style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: p.tone, color: "#101010", padding: "16px 28px", clipPath: CLIP_SM, textDecoration: "none" }}
                >
                  {p.cta.label}
                </a>
                <Link href="/events/pistonpoweredranch" style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none" }}>
                  Back to the event
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
