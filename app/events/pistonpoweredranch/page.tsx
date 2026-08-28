"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

/* Copy ran through RAIL Redline (paddock20.com/rail/redline), WARM / WEB PAGE / US.
   The run's invented specifics, a $750 VIP price and a January submission date,
   were removed. No price or date appears here that has not been confirmed. */

const RANCH = "https://piston-powered-ranch.vercel.app"
const SHOW_DAY = "2026-10-10"

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const CLIP = "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)"
const CLIP_SM = "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)"

type Act = {
  id: string
  kicker: string
  title: string
  lede: string
  body: string[]
  img: string
  focal: string
  tone: string
  cta?: { label: string; href: string }
  lists?: { head: string; items: string[]; tone: string }[]
  grid?: { t: string; b: string }[]
}

const ACTS: Act[] = [
  {
    id: "look",
    kicker: "If you are coming to look",
    title: "You do not need a car to belong here",
    lede: "Gates open at nine and close at three, and everything between is yours.",
    body: [
      "Rows you can walk slowly. Engines you hear before you see. A field wide enough that nobody is standing in your photograph.",
      "Bring the children. Bring your mother. Bring whoever you have been meaning to take somewhere.",
      "Tell us you are coming so we know how much shade to put up.",
    ],
    img: "/images/ranch/ppr-walk.jpg",
    focal: "center 55%",
    tone: "#F2C94C",
    cta: { label: "Tell us you are coming", href: `${RANCH}/spectate` },
  },
  {
    id: "show",
    kicker: "If you are bringing a car",
    title: "Three hundred places, chosen one at a time",
    lede: "Send us yours and you will hear back either way.",
    body: ["Waiting in silence is its own answer, and we would rather give you a real one."],
    img: "/images/918-p1.webp",
    focal: "center 50%",
    tone: "#00D2BE",
    lists: [
      {
        head: "On the field",
        tone: "#00D2BE",
        items: ["Exotics", "Muscle", "Golf carts that turn heads, in two, four or six seats"],
      },
      { head: "Not this time", tone: "#E5484D", items: ["Trucks", "SUVs"] },
    ],
    cta: { label: "Send us your car", href: `${RANCH}/show` },
  },
  {
    id: "vip",
    kicker: "If you would rather be looked after",
    title: "VIP turns a day on the ranch into a curated experience",
    lede: "Twenty seats, for people who would rather experience the day than attend it.",
    body: [],
    img: "/images/ranch/ppr-dusk.jpg",
    focal: "center 60%",
    tone: "#F2C94C",
    grid: [
      { t: "Whiskey, wine, or dinner", b: "Your choice, and it is waiting when you arrive." },
      { t: "Table service", b: "Under a shaded tent, with the air kept moving." },
      { t: "Raised on this ground", b: "A meal from the Angus that graze the same pasture." },
      { t: "Someone who stays with you", b: "A concierge from the ranch, to answer what you ask and book the day you want next." },
      { t: "The quiet ride out", b: "Golf cart or hay ride to a place the crowd never finds, where the pictures are better and Oscar has time to talk." },
      { t: "Corral and petting zoo", b: "Horses and a small menagerie, for the people who brought children." },
      { t: "Made for cameras", b: "Shaded photo areas and a step and repeat, built for stills, video and live feeds." },
      { t: "The small things", b: "Hay rides behind a horse all day. Hay straws in the cocktails. A shirt and hat you keep." },
    ],
    cta: { label: "Ask about the twenty seats", href: `${RANCH}/show` },
  },
  {
    id: "partners",
    kicker: "If you want your name on the day",
    title: "Stand beside it, not only in the crowd",
    lede: "Vendor row, sponsorship, and blocks held for car clubs arriving together.",
    body: ["Tell us what you sell or who you are bringing, and we will tell you where you fit on the field."],
    img: "/images/cullinan-doors.webp",
    focal: "center 50%",
    tone: "#4BA3DE",
    cta: { label: "Start the conversation", href: `${RANCH}/clubs` },
  },
]

export default function PistonPoweredRanchPage() {
  const [now, setNow] = useState(Date.now())
  const [open, setOpen] = useState<string | null>("look")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-r]"))
    let io: IntersectionObserver | null = null
    if (reduce) {
      els.forEach((e) => e.classList.add("in"))
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in")
              io?.unobserve(en.target)
            }
          })
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
      )
      els.forEach((e) => io?.observe(e))
    }
    const t = setInterval(() => setNow(Date.now()), 60000)
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setProgress(max > 0 ? Math.min(1, h.scrollTop / max) : 0)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      io?.disconnect()
      clearInterval(t)
      window.removeEventListener("scroll", onScroll)
    }
  }, [open])

  const d = new Date(now)
  const today = Date.parse(
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T00:00:00`,
  )
  const days = Math.max(0, Math.round((Date.parse(SHOW_DAY + "T00:00:00") - today) / 86400000))

  return (
    <>
      <SiteNav active="events" />

      <style>{`
        @keyframes pgPulse{0%,100%{opacity:1}50%{opacity:.28}}
        @keyframes pgKen{from{transform:scale(1.02)}to{transform:scale(1.14) translateY(-1.5%)}}
        [data-r]{opacity:0;transform:translate3d(0,26px,0)}
        [data-r].in{opacity:1;transform:none;transition:opacity .85s cubic-bezier(.16,.84,.32,1) var(--d,0ms),transform .85s cubic-bezier(.16,.84,.32,1) var(--d,0ms)}
        .pgBand{position:sticky;top:0;height:100svh;overflow:hidden}
        .pgKen{animation:pgKen 30s ease-in-out infinite alternate;transform-origin:center}
        .pgOpen{display:grid;grid-template-rows:0fr;opacity:0;overflow:hidden;transition:grid-template-rows .6s cubic-bezier(.16,.84,.32,1),opacity .45s ease}
        .pgOpen.on{grid-template-rows:1fr;opacity:1}
        .pgOpen>div{min-height:0}
        .pgChev{display:inline-block;line-height:1;transition:transform .4s cubic-bezier(.16,.84,.32,1)}
        .pgChev.on{transform:rotate(180deg)}
        .pgTile{transition:transform .5s cubic-bezier(.16,.84,.32,1),border-color .3s}
        @media (hover:hover){.pgTile:hover{transform:translateY(-4px);border-color:rgba(242,201,76,.5)}}
        @media (prefers-reduced-motion:reduce){
          [data-r],[data-r].in{opacity:1!important;transform:none!important;transition:none!important}
          .pgKen{animation:none!important}
          .pgOpen,.pgChev,.pgTile{transition:none!important}
        }
      `}</style>

      <div aria-hidden="true" style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 80, background: "rgba(255,255,255,.08)" }}>
        <div style={{ height: "100%", width: `${(progress * 100).toFixed(2)}%`, background: "linear-gradient(90deg,#F2C94C,#00D2BE)" }} />
      </div>

      <div style={{ position: "fixed", top: 75, left: 0, right: 0, zIndex: 60, padding: "0 clamp(12px,4vw,40px)", pointerEvents: "none" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", background: "rgba(10,21,35,.72)", backdropFilter: "blur(22px) saturate(160%)", WebkitBackdropFilter: "blur(22px) saturate(160%)", border: "1px solid rgba(255,255,255,.12)", clipPath: CLIP, padding: "10px clamp(14px,2.4vw,20px)", display: "flex", alignItems: "center", gap: 12 }}>
          <i aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: "#F2C94C", animation: "pgPulse 2.4s ease-in-out infinite", flex: "0 0 auto" }} />
          <span style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: ".2em", textTransform: "uppercase", color: "#EDF1F6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Saturday, October 10
          </span>
          <i aria-hidden="true" style={{ flex: "1 1 auto" }} />
          <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "#00D2BE", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
            {days} days
          </span>
        </div>
      </div>

      <main style={{ position: "relative", background: "#0A1523" }}>
        <section style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
          <Image className="pgKen" src="/images/ranch/ppr-hero.jpg" alt="The pasture at Rancho Jaramillo before the field is set" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 62%" }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.96) 6%,rgba(10,21,35,.35) 52%,rgba(10,21,35,.55) 100%)" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(20px,5vw,40px) clamp(52px,10vh,110px)", display: "flex", flexDirection: "column", gap: 18 }}>
            <span data-r="" style={{ fontFamily: MONO, fontSize: "clamp(10.5px,1.3vw,12px)", letterSpacing: ".26em", textTransform: "uppercase", color: "#F2C94C" }}>
              October 10, 2026 &middot; Rancho Jaramillo &middot; Unionville, Tennessee
            </span>
            <h1 data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(38px,8.5vw,86px)", lineHeight: 0.94, letterSpacing: "-.032em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "14ch", ["--d" as string]: "90ms" }}>
              Come stand
              <br />
              <span style={{ color: "#F2C94C" }}>in the field</span>
            </h1>
            <p data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(17px,2.1vw,21px)", lineHeight: 1.5, color: "#E7ECF3", maxWidth: "42ch", ["--d" as string]: "180ms" }}>
              Three hundred cars. One Tennessee ranch. A Saturday that ends at golden hour. Standing here costs nothing.
            </p>
            <div data-r="" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4, ["--d" as string]: "260ms" }}>
              <a href={`${RANCH}/spectate`} target="_blank" rel="noopener" style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "16px 28px", clipPath: CLIP_SM, textDecoration: "none" }}>
                Tell us you are coming
              </a>
              <a href="#look" style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.32)", padding: "16px 28px", clipPath: CLIP_SM, textDecoration: "none" }}>
                Find your way in
              </a>
            </div>
          </div>
        </section>

        {ACTS.map((a, ai) => {
          const isOpen = open === a.id
          return (
            <section key={a.id} id={a.id} style={{ position: "relative", scrollMarginTop: 128 }}>
              <div className="pgBand" aria-hidden="true">
                <Image src={a.img} alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: a.focal }} />
                <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(10,21,35,.86) 0%,rgba(10,21,35,.42) 34%,rgba(10,21,35,.94) 100%)" }} />
              </div>

              <div style={{ position: "relative", marginTop: "-56svh", paddingBottom: "clamp(40px,9vh,96px)" }}>
                <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px)" }}>
                  <div
                    data-r=""
                    style={{
                      background: "rgba(10,21,35,.82)",
                      backdropFilter: "blur(26px) saturate(165%)",
                      WebkitBackdropFilter: "blur(26px) saturate(165%)",
                      border: "1px solid rgba(255,255,255,.13)",
                      borderTop: `3px solid ${a.tone}`,
                      boxShadow: "0 30px 90px rgba(0,0,0,.5)",
                      clipPath: CLIP,
                      padding: "clamp(22px,4vw,44px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <span style={{ fontFamily: MONO, fontSize: "clamp(10px,1.2vw,11.5px)", letterSpacing: ".24em", textTransform: "uppercase", color: a.tone }}>
                      {String(ai + 1).padStart(2, "0")} &middot; {a.kicker}
                    </span>
                    <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(26px,4.6vw,50px)", lineHeight: 1.02, letterSpacing: "-.026em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "18ch" }}>
                      {a.title}
                    </h2>
                    <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(16px,1.9vw,20px)", lineHeight: 1.5, color: "#E7ECF3", maxWidth: "46ch" }}>
                      {a.lede}
                    </p>

                    <button
                      onClick={() => setOpen(isOpen ? null : a.id)}
                      aria-expanded={isOpen}
                      aria-controls={`${a.id}-panel`}
                      style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 10, background: "none", border: 0, padding: "8px 0", cursor: "pointer", fontFamily: MONO, fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: a.tone }}
                    >
                      {isOpen ? "Close" : "Open this"}
                      <span className={`pgChev${isOpen ? " on" : ""}`} aria-hidden="true">&#9662;</span>
                    </button>

                    <div id={`${a.id}-panel`} className={`pgOpen${isOpen ? " on" : ""}`}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 4 }}>
                        {a.body.map((p) => (
                          <p key={p.slice(0, 24)} style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(15px,1.6vw,17px)", lineHeight: 1.62, color: "#C9D1DB", maxWidth: "58ch" }}>
                            {p}
                          </p>
                        ))}

                        {a.lists && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                            {a.lists.map((l) => (
                              <div key={l.head} style={{ flex: "1 1 240px", border: `1px solid ${l.tone}44`, borderTop: `3px solid ${l.tone}`, background: "rgba(21,37,56,.5)", clipPath: CLIP_SM, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                                <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: l.tone }}>{l.head}</span>
                                {l.items.map((it) => (
                                  <span key={it} style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: "clamp(14.5px,1.5vw,16px)", color: "#EDF1F6" }}>{it}</span>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}

                        {a.grid && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(232px,1fr))", gap: 12 }}>
                            {a.grid.map((g) => (
                              <div key={g.t} className="pgTile" style={{ border: "1px solid rgba(255,255,255,.12)", background: "rgba(21,37,56,.5)", clipPath: CLIP_SM, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                                <span style={{ fontFamily: ARCHIVO, fontWeight: 900, fontSize: 15, letterSpacing: "-.008em", textTransform: "uppercase", color: a.tone }}>{g.t}</span>
                                <span style={{ fontFamily: ARCHIVO, fontSize: 14.5, lineHeight: 1.5, color: "#C4CCD6" }}>{g.b}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {a.cta && (
                          <a href={a.cta.href} target="_blank" rel="noopener" style={{ alignSelf: "flex-start", marginTop: 4, fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: a.tone, color: "#101010", padding: "15px 26px", clipPath: CLIP_SM, textDecoration: "none" }}>
                            {a.cta.label}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )
        })}

        <section style={{ position: "relative" }}>
          <div className="pgBand" aria-hidden="true">
            <Image src="/images/ranch/ppr-field.jpg" alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 45%" }} />
            <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(10,21,35,.84) 0%,rgba(10,21,35,.4) 36%,rgba(10,21,35,.96) 100%)" }} />
          </div>
          <div style={{ position: "relative", marginTop: "-56svh", paddingBottom: "clamp(40px,9vh,96px)" }}>
            <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px)", display: "flex", flexDirection: "column", gap: 18 }}>
              <span data-r="" style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: ".24em", textTransform: "uppercase", color: "#00D2BE" }}>
                The land
              </span>
              <h2 data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(26px,4.6vw,50px)", lineHeight: 1.02, letterSpacing: "-.026em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "16ch", ["--d" as string]: "80ms" }}>
                Four hundred and eight acres. Twelve of them opened.
              </h2>
              <p data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(16px,1.8vw,19px)", lineHeight: 1.55, color: "#D8DEE7", maxWidth: "48ch", ["--d" as string]: "150ms" }}>
                Rancho Jaramillo is a working ranch in Bedford County, not a venue dressed as one. Cars turn in off Highway 41-A and follow the ranch road out to the pasture, and for one Saturday the cattle have company.
              </p>
              <div data-r="" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(148px,1fr))", gap: 12, marginTop: 6, ["--d" as string]: "210ms" }}>
                {[
                  ["Property", "408 acres"],
                  ["Opened", "12 acres"],
                  ["County", "Bedford, TN"],
                  ["Gate", "Off Hwy 41-A"],
                ].map(([k, v]) => (
                  <div key={k} style={{ border: "1px solid rgba(255,255,255,.12)", background: "rgba(10,21,35,.6)", clipPath: CLIP_SM, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 5 }}>
                    <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#848482" }}>{k}</span>
                    <span style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 16, color: "#EDF1F6" }}>{v}</span>
                  </div>
                ))}
              </div>
              <a data-r="" href={`${RANCH}/map`} target="_blank" rel="noopener" style={{ alignSelf: "flex-start", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.32)", padding: "15px 26px", clipPath: CLIP_SM, textDecoration: "none", ["--d" as string]: "260ms" }}>
                Walk it on the map
              </a>
            </div>
          </div>
        </section>

        <section style={{ position: "relative", padding: "clamp(48px,10vh,120px) clamp(16px,5vw,40px) clamp(60px,12vh,140px)", background: "linear-gradient(180deg,rgba(10,21,35,1),rgba(14,26,42,1))" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
            <span data-r="" style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: ".24em", textTransform: "uppercase", color: "#F2C94C" }}>
              Why we run it
            </span>
            <h2 data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(26px,4.4vw,46px)", lineHeight: 1.03, letterSpacing: "-.026em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "18ch", ["--d" as string]: "80ms" }}>
              A share of every net dollar goes to Community Elementary School
            </h2>
            <p data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(16px,1.8vw,19px)", lineHeight: 1.55, color: "#D8DEE7", maxWidth: "46ch", ["--d" as string]: "150ms" }}>
              The school is down the road from the gate. That is the whole reason the field opens.
            </p>
            <div data-r="" style={{ display: "flex", gap: 10, flexWrap: "wrap", ["--d" as string]: "210ms" }}>
              <a href={`${RANCH}/spectate`} target="_blank" rel="noopener" style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "16px 28px", clipPath: CLIP_SM, textDecoration: "none" }}>
                Tell us you are coming
              </a>
              <Link href="/events" style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.32)", padding: "16px 28px", clipPath: CLIP_SM, textDecoration: "none" }}>
                Every other event
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
