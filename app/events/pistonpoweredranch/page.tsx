"use client"

import { useState, useEffect } from "react"
import VisitOps from "./VisitOps"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

/* Copy ran through RAIL Redline (paddock20.com/rail/redline), WARM / WEB PAGE / US.
   The run's invented specifics, a $750 VIP price and a January submission date,
   were removed. No price or date appears here that has not been confirmed. */

const RANCH = "https://pistonpoweredranch.com"

// Set to "/video/teaser.mp4" the day the film is in public/video. While it is
// null the block shows the photograph on its own, with no player chrome.
const TEASER: string | null = "/video/teaser.mp4"
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
  ctas?: { label: string; href: string }[]
  lists?: { head: string; items: string[]; tone: string }[]
  grid?: { t: string; b: string }[]
  tiers?: { name: string; tone: string; line: string; items: string[] }[]
}

const ACTS: Act[] = [
  {
    id: "look",
    kicker: "If you are coming to look",
    title: "You do not need a car to belong here",
    lede: "Gates open at nine and close at three, and everything between is yours.",
    body: [
      "Spectator admission is complimentary. Rows you can walk slowly, engines you hear before you see, and a field wide enough that nobody is standing in your photograph.",
      "Bring the children. Bring your mother. Bring whoever you have been meaning to take somewhere.",
      "Turn in off Highway 41-A and the marshals will wave you down the ranch road to the pasture. Tell us you are coming so we know how much shade to put up.",
    ],
    img: "/images/ranch/ppr-rail.jpg",
    focal: "center 34%",
    tone: "#F2C94C",
    cta: { label: "Tell us you are coming", href: `${RANCH}/spectate` },
  },
  {
    id: "visit",
    kicker: "If you are planning the drive",
    title: "Plan your visit",
    lede: "Saturday, October 10, 2026. Gates at nine, field clear by three.",
    body: [
      "The Piston Powered Ranch is an October car show in Tennessee, held at Rancho Jaramillo in Unionville, Bedford County, about an hour south of Nashville. Turn in off Highway 41-A and the marshals will point you down the ranch road.",
      "Spectator parking sits on the pasture south of the show field. Bring a hat, bring a chair if you like one, and bring cash for the vendors who prefer it.",
    ],
    img: "/images/ranch/ppr-bins.jpg",
    focal: "center 52%",
    tone: "#B4B6B2",
    lists: [
      {
        head: "The day",
        tone: "#F2C94C",
        items: ["Saturday, October 10, 2026", "Nine in the morning to three", "Spectator admission complimentary"],
      },
      {
        head: "Finding it",
        tone: "#00D2BE",
        items: ["Rancho Jaramillo, Unionville TN", "An hour south of Nashville", "In off Highway 41-A"],
      },
    ],
    cta: { label: "Open the site map", href: `${RANCH}/map` },
  },
  {
    id: "vip",
    kicker: "If you would rather be looked after",
    title: "VIP turns a day on the ranch into a curated experience",
    lede: "Twenty seats in two rooms. Both are hosted. One goes further out.",
    body: [
      "Every VIP seat comes with the hospitality: a shaded tent with the air kept moving, table service, and a steak off the Angus that graze this pasture, hung three weeks before the day. A shirt and a hat you keep. The corral and the petting zoo for whoever you brought. Shaded photo areas and a step and repeat built for stills, video and live feeds.",
      "The difference between the two is how far in you get.",
    ],
    img: "/images/ranch/ppr-dusk.jpg",
    focal: "center 60%",
    tone: "#F2C94C",
    tiers: [
      {
        name: "The Terrace",
        tone: "#00D2BE",
        line: "The hosted room, on the rail above the show field.",
        items: [
          "Shaded tent, table service, air kept moving",
          "A bottle of whiskey, a bottle of wine, or dinner at Southall or Sinatra, arranged before you arrive",
          "Ranch raised Angus, hung three weeks",
          "Commemorative shirt and hat",
          "Corral, petting zoo, and the photo areas",
        ],
      },
      {
        name: "The Owner's Table",
        tone: "#F2C94C",
        line: "Everything on The Terrace, and the part of the ranch the crowd never reaches.",
        items: [
          "The quiet ride out by golf cart or hay ride",
          "A place the crowd never finds, for the pictures",
          "Time with Oscar, away from the noise",
          "A concierge from the ranch who stays with you",
          "Hay rides behind a horse, hay straws in the cocktails",
        ],
      },
    ],
    cta: { label: "Ask about the twenty seats", href: "/events/pistonpoweredranch/sponsor" },
  },
  {
    id: "show",
    kicker: "If you are bringing a car",
    title: "Three hundred places, chosen one at a time",
    lede: "Send us yours and you will hear back either way.",
    body: ["Waiting in silence is its own answer, and we would rather give you a real one."],
    img: "/images/ranch/ppr-barn.jpg",
    focal: "center 46%",
    tone: "#00D2BE",
    lists: [
      {
        head: "On the field",
        tone: "#00D2BE",
        items: ["Exotics", "Muscle", "Golf carts that turn heads, in two, four or six seats"],
      },
      { head: "Not this time", tone: "#E5484D", items: ["Trucks", "SUVs"] },
    ],
    cta: { label: "How entry works", href: "/events/pistonpoweredranch/entry" },
  },
  {
    id: "partners",
    kicker: "If you want your name on the day",
    title: "Stand beside it, not only in the crowd",
    lede: "Vendor row, sponsorship, and blocks held for car clubs arriving together.",
    body: ["Tell us what you sell or who you are bringing, and we will tell you where you fit on the field."],
    img: "/images/ranch/ppr-light.jpg",
    focal: "center 40%",
    tone: "#4BA3DE",
    ctas: [
      { label: "Sponsor the day", href: "/events/pistonpoweredranch/sponsor" },
      { label: "Take a vendor space", href: "/events/pistonpoweredranch/vendor" },
      { label: "Bring a club block", href: `${RANCH}/clubs/` },
    ],
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
        .pgTeaser{display:grid;grid-template-columns:minmax(300px,360px) 1fr;gap:clamp(20px,3vw,38px);align-items:center}
        .pgTeaserFilm{position:relative;aspect-ratio:9/16;overflow:hidden;background:#0A1523;border:1px solid rgba(255,255,255,.14);clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))}
        .pgTeaserSay{display:flex;flex-direction:column;min-width:0}
        .pgTeaserFacts{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,.12)}
        @media (max-width:980px){
          .pgTeaser{grid-template-columns:1fr;gap:24px}
          .pgTeaserFilm{max-width:min(78vw,340px);margin:0 auto;width:100%}
          .pgTeaserFacts{grid-template-columns:1fr;gap:14px}
        }
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
              Three hundred cars
              <br />
              <span style={{ color: "#F2C94C" }}>twelve curated acres</span>
            </h1>
            <p data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 700, fontSize: "clamp(19px,2.6vw,26px)", lineHeight: 1.3, color: "#FFFFFF", maxWidth: "42ch", ["--d" as string]: "180ms" }}>
              Open to everyone, for one Saturday.
            </p>
            <p data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.55, color: "#C9D1DB", maxWidth: "44ch", ["--d" as string]: "220ms" }}>
              The curation of a concours lawn, on ground that still runs cattle. Three hundred collector cars across twelve acres, an hour south of Nashville.
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

        {/* The teaser. Marketing launches 30 August and this is where the film
            lands: drop teaser.mp4 into public/video and it plays. Until it is
            there the poster carries the block on its own, so the page is never
            broken by a missing file. */}
        {/* The film is 9:16, shot on a phone. In a 1180px container that always
            leaves space beside it, so the space has to carry something: the
            ranch is behind the whole block rather than flat navy, and the right
            column holds the copy, the three facts and the way in. It is a real
            grid, not flex-wrap, so the desktop and phone layouts are each
            designed rather than one being a side effect of the other. */}
        <section id="teaser" style={{ position: "relative", overflow: "hidden", padding: "clamp(56px,10vh,120px) 0" }}>
          <Image src="/images/ranch/ppr-light.jpg" alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 42%" }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,21,35,.9) 0%,rgba(10,21,35,.72) 40%,rgba(10,21,35,.94) 100%)" }} />
          <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px)" }}>
            <div
              data-r=""
              className="pgTeaser"
              style={{
                background: "rgba(10,21,35,.5)",
                backdropFilter: "blur(30px) saturate(180%)",
                WebkitBackdropFilter: "blur(30px) saturate(180%)",
                border: "1px solid rgba(255,255,255,.16)",
                borderTop: "3px solid #F2C94C",
                boxShadow: "0 34px 100px rgba(0,0,0,.58), 0 2px 0 rgba(255,255,255,.05) inset",
                clipPath: CLIP,
                padding: "clamp(20px,3.2vw,34px)",
              }}
            >
              <div className="pgTeaserFilm">
                {TEASER ? (
                  <video
                    src={TEASER}
                    poster="/images/ranch/ppr-rail.jpg"
                    controls
                    playsInline
                    preload="metadata"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <Image src="/images/ranch/ppr-rail.jpg" alt="A bay looking out over the pallet rail at Rancho Jaramillo" fill sizes="(max-width:860px) 100vw, 360px" style={{ objectFit: "cover", objectPosition: "center 38%" }} />
                )}
              </div>

              <div className="pgTeaserSay">
                <span style={{ fontFamily: MONO, fontSize: "clamp(10px,1.2vw,11.5px)", letterSpacing: ".24em", textTransform: "uppercase", color: "#F2C94C" }}>
                  One Saturday in October
                </span>
                <h2 style={{ margin: "10px 0 0", fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(26px,4vw,44px)", lineHeight: 1.02, letterSpacing: "-.03em", textTransform: "uppercase", color: "#FFFFFF" }}>
                  The ground it<br />happens on
                </h2>
                <p style={{ margin: "16px 0 0", fontFamily: ARCHIVO, fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.62, color: "#C9D1DB", maxWidth: "46ch" }}>
                  Rancho Jaramillo is a working cattle ranch, four hundred and eight acres of it,
                  an hour south of Nashville. For one Saturday in October, twelve of those acres
                  hold three hundred collector cars, and the gate is open to everyone.
                </p>
                <div className="pgTeaserFacts">
                  {[
                    ["Saturday, October 10", "Gates at nine, field clear by three"],
                    ["Three hundred cars", "Chosen one at a time"],
                    ["Complimentary", "Spectators, no ticket needed"],
                  ].map(([t, b]) => (
                    <div key={t}>
                      <b style={{ display: "block", fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(14.5px,1.5vw,16px)", color: "#FFFFFF", letterSpacing: "-.01em" }}>{t}</b>
                      <span style={{ display: "block", marginTop: 3, fontFamily: ARCHIVO, fontSize: 13.5, lineHeight: 1.45, color: "#9BA7B5" }}>{b}</span>
                    </div>
                  ))}
                </div>
                <a href={`${RANCH}/spectate`} target="_blank" rel="noopener" style={{ alignSelf: "flex-start", marginTop: 22, display: "inline-block", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 26px", clipPath: CLIP_SM, textDecoration: "none" }}>
                  Tell us you are coming
                </a>
              </div>
            </div>
          </div>
        </section>

        {ACTS.map((a, ai) => {
          const isOpen = open === a.id
          return (
            <section key={a.id} id={a.id} style={{ position: "relative", scrollMarginTop: 128 }}>
              <div className="pgBand" aria-hidden="true">
                <Image src={a.img} alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: a.focal }} />
                <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(10,21,35,.78) 0%,rgba(10,21,35,.3) 36%,rgba(10,21,35,.9) 100%)" }} />
              </div>

              <div style={{ position: "relative", marginTop: "-56svh", paddingBottom: "clamp(40px,9vh,96px)" }}>
                <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px)" }}>
                  <div
                    data-r=""
                    style={{
                      background: "rgba(10,21,35,.58)",
                      backdropFilter: "blur(30px) saturate(180%)",
                      WebkitBackdropFilter: "blur(30px) saturate(180%)",
                      border: "1px solid rgba(255,255,255,.16)",
                      borderTop: `3px solid ${a.tone}`,
                      boxShadow: "0 34px 100px rgba(0,0,0,.58), 0 2px 0 rgba(255,255,255,.05) inset",
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

                        {a.id === "visit" ? (
                          <VisitOps />
                        ) : a.lists ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                            {a.lists.map((l) => (
                              <div key={l.head} style={{ flex: "1 1 240px", border: `1px solid ${l.tone}44`, borderTop: `3px solid ${l.tone}`, background: "rgba(21,37,56,.34)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", clipPath: CLIP_SM, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                                <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: l.tone }}>{l.head}</span>
                                {l.items.map((it) => (
                                  <span key={it} style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: "clamp(14.5px,1.5vw,16px)", color: "#EDF1F6" }}>{it}</span>
                                ))}
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {a.tiers && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(272px,1fr))", gap: 14 }}>
                            {a.tiers.map((t) => (
                              <div key={t.name} className="pgTile" style={{ border: `1px solid ${t.tone}3d`, borderTop: `3px solid ${t.tone}`, background: "rgba(10,21,35,.4)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", clipPath: CLIP_SM, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
                                <span style={{ fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(19px,2.3vw,24px)", lineHeight: 1.05, letterSpacing: "-.02em", textTransform: "uppercase", color: t.tone }}>{t.name}</span>
                                <span style={{ fontFamily: ARCHIVO, fontSize: 14.5, lineHeight: 1.5, color: "#E7ECF3" }}>{t.line}</span>
                                <ul style={{ margin: "4px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                                  {t.items.map((it) => (
                                    <li key={it} style={{ fontFamily: ARCHIVO, fontSize: 14, lineHeight: 1.45, color: "#C4CCD6", paddingLeft: 14, position: "relative" }}>
                                      <span aria-hidden="true" style={{ position: "absolute", left: 0, top: 8, width: 5, height: 5, borderRadius: "50%", background: t.tone }} />
                                      {it}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {a.grid && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(232px,1fr))", gap: 12 }}>
                            {a.grid.map((g) => (
                              <div key={g.t} className="pgTile" style={{ border: "1px solid rgba(255,255,255,.12)", background: "rgba(21,37,56,.34)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", clipPath: CLIP_SM, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                                <span style={{ fontFamily: ARCHIVO, fontWeight: 900, fontSize: 15, letterSpacing: "-.008em", textTransform: "uppercase", color: a.tone }}>{g.t}</span>
                                <span style={{ fontFamily: ARCHIVO, fontSize: 14.5, lineHeight: 1.5, color: "#C4CCD6" }}>{g.b}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {a.cta && (
                          <a href={a.cta.href} target={a.cta.href.startsWith("http") ? "_blank" : undefined} rel="noopener" style={{ alignSelf: "flex-start", marginTop: 4, fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: a.tone, color: "#101010", padding: "15px 26px", clipPath: CLIP_SM, textDecoration: "none" }}>
                            {a.cta.label}
                          </a>
                        )}

                        {a.ctas && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
                            {a.ctas.map((c, ci) => (
                              <a key={c.href} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener" style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: ci === 0 ? a.tone : "transparent", color: ci === 0 ? "#101010" : "#EDF1F6", border: ci === 0 ? `1px solid ${a.tone}` : "1px solid rgba(255,255,255,.32)", padding: "15px 26px", clipPath: CLIP_SM, textDecoration: "none" }}>
                                {c.label}
                              </a>
                            ))}
                          </div>
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
                Four hundred and eight acres of working ranch in Unionville, Tennessee, and twelve of them opened for one Saturday. Not a venue dressed as a ranch. Cars turn in off Highway 41-A and follow the ranch road out to the pasture, and for one day the cattle have company.
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
              The school is down the road from the gate. A good day is better shared, so we open the field, look after the community that makes it possible, and come back and do it again.
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
