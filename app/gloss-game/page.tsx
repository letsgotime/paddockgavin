"use client"

import { useEffect, useRef, useState } from "react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

const AMAZON_PB  = "https://www.amazon.com/dp/B0FMPGNTPY"
const AMAZON_KDL = "https://www.amazon.com/dp/B0FMPH9ZK1"

// ── tokens ───────────────────────────────────────────────────────────────────
const S = {
  bg:      "#0A0E1A",
  navy:    "#0E1627",
  ink:     "#060E18",
  orange:  "#EF4A18",
  orangeD: "#7A1C04",
  gold:    "#F2C94C",
  blue:    "#57C7F5",
  steel:   "#8B93A7",
  body:    "#C4CBD6",
  mute:    "#6B7280",
  paper:   "#EDF1F6",
  mono:    "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
  disp:    "'Titillium Web','Arial Narrow',Arial,sans-serif",
  sans:    "Inter,system-ui,sans-serif",
  serif:   "Newsreader,Georgia,'Times New Roman',serif",
}

// ── scroll-reveal ─────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, on }
}
function R({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, on } = useReveal()
  return (
    <div ref={ref} style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(24px)", transition: `opacity .68s ${delay}ms cubic-bezier(.16,1,.3,1), transform .68s ${delay}ms cubic-bezier(.16,1,.3,1)`, ...style }}>
      {children}
    </div>
  )
}

// ── sticky buy bar ────────────────────────────────────────────────────────────
function StickyBar() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const h = () => setShow(window.scrollY > 420)
    window.addEventListener("scroll", h, { passive: true })
    return () => window.removeEventListener("scroll", h)
  }, [])
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: "rgba(6,14,24,.97)", backdropFilter: "blur(12px)",
      borderBottom: `2px solid ${S.orange}`,
      transform: show ? "translateY(0)" : "translateY(-100%)",
      transition: "transform .35s cubic-bezier(.16,1,.3,1)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px clamp(16px,4vw,48px)", gap: 16, flexWrap: "wrap",
    }}>
      <p style={{ margin: 0, fontFamily: S.disp, fontWeight: 700, fontSize: 15, color: "#fff", letterSpacing: ".02em" }}>
        The Gloss Game<sup style={{ fontSize: ".5em" }}>™</sup>
        <span style={{ marginLeft: 12, fontFamily: S.mono, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: S.steel }}>$19.99 · Paperback & Kindle</span>
      </p>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <a href={AMAZON_KDL} target="_blank" rel="noopener noreferrer" style={{ fontFamily: S.mono, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: S.gold, textDecoration: "none", borderBottom: `1px solid rgba(242,201,76,.4)`, paddingBottom: 1 }}>Kindle</a>
        <a href={AMAZON_PB} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", padding: "9px 22px", background: S.orange, color: "#fff", fontFamily: S.disp, fontWeight: 700, fontSize: 12.5, letterSpacing: ".08em", textTransform: "uppercase", textDecoration: "none", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)" }}>
          Buy on Amazon
        </a>
      </div>
    </div>
  )
}

// ── cover plate ───────────────────────────────────────────────────────────────
function Cover({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const p = size === "lg" ? 36 : size === "md" ? 26 : 18
  const fs = size === "lg" ? "clamp(28px,4vw,48px)" : size === "md" ? "clamp(22px,3vw,34px)" : 18
  return (
    <div style={{
      aspectRatio: "5/8",
      background: `linear-gradient(160deg, ${S.navy} 0%, ${S.ink} 65%)`,
      border: "1px solid rgba(255,255,255,.14)",
      boxShadow: `0 32px 80px -20px rgba(0,0,0,.95), 0 0 0 1px rgba(255,255,255,.04), inset 0 1px 0 rgba(255,255,255,.1)`,
      padding: p,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      position: "relative", overflow: "hidden",
    }}>
      {/* speed stripe */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${S.orange} 0%, ${S.gold} 40%, ${S.blue} 70%, ${S.steel} 100%)` }} />
      {/* shimmer */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(120deg,transparent 35%,rgba(255,255,255,.055) 48%,transparent 60%)" }} />
      {/* top tag */}
      <p style={{ margin: 0, fontFamily: S.mono, fontSize: 9, letterSpacing: ".26em", textTransform: "uppercase", color: S.orange }}>GoTime Motorsports</p>
      {/* title */}
      <div>
        <p style={{ margin: 0, fontFamily: S.disp, fontWeight: 900, fontSize: fs, lineHeight: .88, letterSpacing: "-.03em", textTransform: "uppercase", color: "#fff" }}>
          The<br />Gloss<br />Game<sup style={{ fontSize: ".28em", verticalAlign: "super" }}>™</sup>
        </p>
        <p style={{ margin: "10px 0 0", fontFamily: S.serif, fontStyle: "italic", fontSize: size === "lg" ? 14 : 12, lineHeight: 1.4, color: S.steel }}>
          You spent six figures on the finish.<br />Protect it like you did.
        </p>
      </div>
      {/* bottom */}
      <div>
        <div style={{ height: 1, background: "rgba(255,255,255,.15)", margin: "14px 0" }} />
        <p style={{ margin: 0, fontFamily: S.mono, fontSize: 9.5, letterSpacing: ".2em", textTransform: "uppercase", color: S.paper }}>Gavin Brooks</p>
      </div>
    </div>
  )
}

// ── primary CTA block ─────────────────────────────────────────────────────────
function BuyBlock({ context }: { context?: string }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
      <a href={AMAZON_PB} target="_blank" rel="noopener noreferrer"
        style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "17px 34px", background: S.orange, color: "#fff", fontFamily: S.disp, fontWeight: 700, fontSize: 16, letterSpacing: ".05em", textTransform: "uppercase", textDecoration: "none", clipPath: "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)" }}>
        Paperback — $19.99
      </a>
      <a href={AMAZON_KDL} target="_blank" rel="noopener noreferrer"
        style={{ display: "inline-flex", alignItems: "center", padding: "17px 28px", border: `1px solid ${S.gold}`, color: S.gold, fontFamily: S.disp, fontWeight: 700, fontSize: 14, letterSpacing: ".05em", textTransform: "uppercase", textDecoration: "none" }}>
        Kindle — $9.99
      </a>
      {context && <p style={{ margin: 0, fontFamily: S.mono, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: S.mute, width: "100%" }}>{context}</p>}
    </div>
  )
}

// ── star rating ───────────────────────────────────────────────────────────────
function Stars({ n = 5, label }: { n?: number; label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill={S.gold}><path d="M7 0l1.76 5.4H14l-4.6 3.35 1.75 5.39L7 10.9l-4.15 3.24 1.75-5.4L0 5.4h5.24z" /></svg>
      ))}
      {label && <span style={{ fontFamily: S.mono, fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: S.mute }}>{label}</span>}
    </div>
  )
}

// ── divider ───────────────────────────────────────────────────────────────────
function D() {
  return <div style={{ height: 1, background: "rgba(255,255,255,.1)", margin: "0" }} />
}

// ── lead magnet form ──────────────────────────────────────────────────────────
function JuiceBoxForm() {
  const [email, setEmail]   = useState("")
  const [status, setStatus] = useState<"idle"|"sending"|"ok"|"err">("idle")
  const [msg, setMsg]       = useState("")
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setStatus("err"); setMsg("That address does not look right."); return }
    setStatus("sending")
    try {
      const r = await fetch("/api/juicebox", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
      const j = await r.json()
      if (r.ok) { setStatus("ok"); setMsg("On its way. Check spam if it is not there in two minutes.") }
      else       { setStatus("err"); setMsg(j?.error || "Something went wrong. Try again.") }
    } catch { setStatus("err"); setMsg("Could not reach the server. Try again.") }
  }
  return (
    <form onSubmit={submit} noValidate style={{ width: "100%" }}>
      {status !== "ok" ? (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
              style={{ flex: "1 1 220px", minWidth: 0, background: "rgba(255,255,255,.06)", color: "#fff", border: "1px solid rgba(255,255,255,.18)", padding: "15px 18px", fontFamily: S.sans, fontSize: 15, outline: "none", borderRadius: 0 }} />
            <button type="submit" disabled={status === "sending"}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "15px 28px", background: S.gold, color: "#0A0E1A", fontFamily: S.disp, fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", border: 0, cursor: "pointer", whiteSpace: "nowrap" }}>
              {status === "sending" ? "Sending…" : "Send the index"}
            </button>
          </div>
          <p style={{ margin: "12px 0 0", fontFamily: S.mono, fontSize: 11, lineHeight: 1.7, color: S.mute }}>
            One email with the PDF. I write when I have something worth reading. Every email has an unsubscribe link.
          </p>
        </>
      ) : null}
      {msg && <p style={{ margin: "12px 0 0", fontFamily: S.mono, fontSize: 12, lineHeight: 1.6, color: status === "ok" ? S.gold : "#FF8E85" }}>{msg}</p>}
    </form>
  )
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function GlossGamePage() {
  const gut  = "clamp(18px,5vw,64px)"
  const col  = { maxWidth: 760,  margin: "0 auto", padding: `0 ${gut}` }
  const wide = { maxWidth: 1180, margin: "0 auto", padding: `0 ${gut}` }
  const sec  = "clamp(72px,10vw,128px) 0"
  const mid  = "clamp(52px,7vw,88px) 0"

  return (
    <>
      <StickyBar />
      <SiteNav />
      <main style={{ background: S.bg, color: S.body, fontFamily: S.sans, overflowX: "hidden" }}>

        {/* ━━ 00  HERO — hook + buy above the fold ━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section style={{ padding: "clamp(52px,8vw,100px) 0 0" }}>
          <div style={{ ...wide, display: "grid", gap: "clamp(40px,6vw,80px)", gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))", alignItems: "center" }}>

            {/* left — cover */}
            <R style={{ maxWidth: 280, margin: "0 auto", width: "100%" }}>
              <Cover size="lg" />
            </R>

            {/* right — headline + buy */}
            <div>
              <R>
                <p style={{ margin: "0 0 16px", fontFamily: S.mono, fontSize: 11, letterSpacing: ".26em", textTransform: "uppercase", color: S.orange }}>
                  Night shift &middot; Book one &middot; GoTime Motorsports
                </p>
                <h1 style={{ margin: "0 0 20px", fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(42px,9vw,96px)", lineHeight: .88, letterSpacing: "-.04em", textTransform: "uppercase", color: "#fff" }}>
                  The Gloss<br />Game<sup style={{ fontSize: ".22em", verticalAlign: "super" }}>™</sup>
                </h1>
                <p style={{ margin: "0 0 28px", fontFamily: S.serif, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(18px,2.4vw,24px)", lineHeight: 1.42, color: S.paper, maxWidth: "28ch" }}>
                  You spent six figures on the finish.<br />Most detailers are guessing.
                </p>
              </R>
              <R delay={80}>
                <Stars label="Paperback and Kindle · $19.99" />
                <div style={{ height: 22 }} />
                <BuyBlock context="Ships free with Prime · Kindle delivers instantly" />
              </R>
              <R delay={140}>
                <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.1)", display: "flex", gap: "clamp(20px,4vw,48px)", flexWrap: "wrap" }}>
                  {[["12","Chapters"],["96","Pages"],["30 yrs","Of doing it"],["$55K","Spent finding out"]].map(([n, l]) => (
                    <div key={l}>
                      <p style={{ margin: 0, fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(22px,3vw,30px)", color: S.orange, letterSpacing: "-.02em" }}>{n}</p>
                      <p style={{ margin: 0, fontFamily: S.mono, fontSize: 9.5, letterSpacing: ".18em", textTransform: "uppercase", color: S.mute }}>{l}</p>
                    </div>
                  ))}
                </div>
              </R>
            </div>
          </div>
        </section>

        {/* ━━ social proof strip ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section style={{ margin: "clamp(40px,5vw,64px) 0 0", borderTop: "1px solid rgba(255,255,255,.08)", borderBottom: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)", padding: "22px 0", overflow: "hidden" }}>
          <div style={{ ...wide, display: "flex", gap: "clamp(20px,5vw,56px)", flexWrap: "wrap", alignItems: "center" }}>
            {[
              ["\u201cIf you paid six figures for the paint, you owe it the right mitt.\u201d","Chapter 3"],
              ["\u201cMost swirl marks come from the wash, not from the road.\u201d","Chapter 3"],
              ["\u201cThe person with the buffer is guessing unless they know what is under it.\u201d","Chapter 5"],
              ["\u201cA ceramic coat on top of bad prep is an expensive mistake.\u201d","Chapter 5"],
            ].map(([q, s]) => (
              <div key={s} style={{ flex: "1 1 200px" }}>
                <p style={{ margin: "0 0 4px", fontFamily: S.serif, fontStyle: "italic", fontSize: 15, lineHeight: 1.4, color: S.paper }}>{q}</p>
                <p style={{ margin: 0, fontFamily: S.mono, fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: S.mute }}>{s}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ━━ 01  ORIGIN STORY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section style={{ padding: mid }}>
          <div style={col}>
            <R>
              <p style={{ margin: "0 0 8px", fontFamily: S.mono, fontSize: 10.5, letterSpacing: ".22em", textTransform: "uppercase", color: S.orange }}>01 &middot; Where it started</p>
              <h2 style={{ margin: "0 0 28px", fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(26px,4vw,42px)", letterSpacing: "-.03em", textTransform: "uppercase", color: "#fff", lineHeight: 1 }}>
                Escondido, California.<br />1993.
              </h2>
            </R>
            <R delay={60}>
              <p style={{ margin: "0 0 20px", fontFamily: S.serif, fontSize: "clamp(17px,2vw,20px)", lineHeight: 1.72, color: S.body }}>
                <span style={{ float: "left", fontFamily: S.disp, fontWeight: 900, fontSize: 72, lineHeight: .82, padding: "8px 14px 0 0", color: S.orange }}>T</span>
                he most expensive mistake most exotic owners make is trusting the wrong person with the wrong products on a finish that cost more than most people&apos;s cars. It happens the first time. Then the swirls are there and they are not coming out without correction.
              </p>
              <p style={{ margin: "0 0 20px", fontFamily: S.serif, fontSize: "clamp(17px,2vw,20px)", lineHeight: 1.72, color: S.body }}>I started detailing at fourteen in Escondido. By fifteen I was driving to La Jolla to do it for people who paid. Over thirty years I put fifty-five thousand dollars into learning what actually protects a finish and what just looks like it does.</p>
              <p style={{ margin: "0 0 20px", fontFamily: S.serif, fontSize: "clamp(17px,2vw,20px)", lineHeight: 1.72, color: S.body }}>This book is what I wish someone had given me the first time I stood in front of a paint job worth protecting. Not what products to buy. The reason behind the order — because the order is what the products can and cannot do.</p>
              <p style={{ margin: 0, fontFamily: S.serif, fontSize: "clamp(17px,2vw,20px)", lineHeight: 1.72, color: S.body }}>If you own something worth protecting, you owe it to the finish to understand what is being done to it. Chapter five alone is worth the price of the book.</p>
            </R>
          </div>
        </section>

        {/* ━━ 02  CHAPTER MAP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section style={{ padding: sec }}>
          <div style={wide}>
            <R>
              <p style={{ margin: "0 0 8px", fontFamily: S.mono, fontSize: 10.5, letterSpacing: ".22em", textTransform: "uppercase", color: S.orange }}>02 &middot; Contents</p>
              <h2 style={{ margin: "0 0 32px", fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(26px,4vw,42px)", letterSpacing: "-.03em", textTransform: "uppercase", color: "#fff", lineHeight: 1 }}>Twelve chapters</h2>
            </R>
            <D />
            {[
              ["01","The Gloss Mindset","Clean isn\u2019t just a look. It\u2019s a language."],
              ["02","Setup Before Shine","Tools, space, timing. The pre-wash that powers every detail."],
              ["03","The Wash Flow\u2122","Foam logic. Contact discipline. The towel that makes or breaks it."],
              ["04","Wheels, Barrels & Rubber","The discipline most skip, but everyone notices."],
              ["05","Prep Correct Protect","What your paint needs before you touch it."],
              ["06","Interiors That Stay Clean","Cabin systems. Real-world touchpoints."],
              ["07","Gloss Goals","Layering logic. Long-term shine."],
              ["08","The Maintenance Regimen","How to wash, wipe and reset without overthinking gloss."],
              ["09","Thank You to the Teachers","The people, products and platforms that built the rhythm."],
              ["10","The GoTime Juice Box\u2122","What we use. Why we use it. How it got in."],
              ["11","The Gloss Reset System\u2122","Seven days to bring the finish back, whatever the condition."],
              ["12","Gloss for Life\u2122","What it means to live this way, and why it\u2019s bigger than shine."],
            ].map(([n, title, desc], i) => (
              <R key={n} delay={i * 28}>
                <div style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: "8px clamp(14px,3vw,32px)", padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,.07)", alignItems: "baseline" }}>
                  <span style={{ fontFamily: S.mono, fontSize: 11, letterSpacing: ".14em", color: S.orange }}>{n}</span>
                  <div>
                    <p style={{ margin: "0 0 4px", fontFamily: S.disp, fontWeight: 700, fontSize: "clamp(15px,1.8vw,18px)", color: "#fff" }}>{title}</p>
                    <p style={{ margin: 0, fontFamily: S.serif, fontSize: 15.5, lineHeight: 1.5, color: S.mute }}>{desc}</p>
                  </div>
                </div>
              </R>
            ))}
            <R>
              <div style={{ marginTop: 36 }}>
                <BuyBlock context="Paperback ships free with Prime · Kindle instant download" />
              </div>
            </R>
          </div>
        </section>

        {/* ━━ 03  WHAT YOU WALK AWAY WITH ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section style={{ padding: mid, background: "rgba(255,255,255,.015)", borderTop: "1px solid rgba(255,255,255,.08)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <div style={wide}>
            <R>
              <p style={{ margin: "0 0 8px", fontFamily: S.mono, fontSize: 10.5, letterSpacing: ".22em", textTransform: "uppercase", color: S.orange }}>03 &middot; Eight systems, not tips</p>
              <h2 style={{ margin: "0 0 12px", fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(26px,4vw,42px)", letterSpacing: "-.03em", textTransform: "uppercase", color: "#fff", lineHeight: 1 }}>What you walk away with</h2>
              <p style={{ margin: "0 0 36px", fontFamily: S.sans, fontSize: 16, lineHeight: 1.64, color: S.body, maxWidth: "58ch" }}>Not a product list. The reasoning behind each step, so when someone is standing in front of your car you know whether they are doing it right — or doing it wrong in a way you will see for years.</p>
            </R>
            <div style={{ display: "grid", gap: 2 }}>
              {[
                ["Ch. 3","The Wash Flow™","Four buckets, a mitt map and a towel code. The swirls you are looking at stop being ones you put there yourself."],
                ["Ch. 4","Wheels first","Why the wheels come before the paint. How to tell when a tire is actually clean rather than just wet."],
                ["Ch. 5","Prep, correct, protect","What the paint needs before a pad ever touches it. What it costs you when you skip it."],
                ["Ch. 6","Interiors that stay clean","The cabin as a system. Which surfaces get coated, which get left alone, and what nothing should ever feel like."],
                ["Ch. 7","Gloss goals","Three layers, in order. How long to wait between them. Skip one and you halve the life of the finish."],
                ["Ch. 10","The Juice Box™","Every product and tool by zone. The reason each one is in there. Three loadouts to start from."],
                ["Ch. 11","The Gloss Reset™","Seven days, one car. A day per job so nothing gets rushed into the next thing."],
                ["Ch. 12","Gloss for life™","Why this is a system and not a hobby, and what it looks like twenty years from now."],
              ].map(([ch, title, desc], i) => (
                <R key={ch} delay={i * 30}>
                  <div style={{ display: "grid", gridTemplateColumns: "88px 1fr", gap: "clamp(8px,2vw,24px)", padding: "22px 0", borderBottom: "1px solid rgba(255,255,255,.07)", alignItems: "start" }}>
                    <span style={{ fontFamily: S.mono, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: S.orange, paddingTop: 3 }}>{ch}</span>
                    <div>
                      <p style={{ margin: "0 0 5px", fontFamily: S.disp, fontWeight: 700, fontSize: "clamp(15px,1.8vw,17px)", color: "#fff" }}>{title}</p>
                      <p style={{ margin: 0, fontFamily: S.serif, fontSize: 15.5, lineHeight: 1.55, color: S.body }}>{desc}</p>
                    </div>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>

        {/* ━━ 04  PULL LINES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section style={{ padding: mid }}>
          <div style={wide}>
            <R>
              <p style={{ margin: "0 0 8px", fontFamily: S.mono, fontSize: 10.5, letterSpacing: ".22em", textTransform: "uppercase", color: S.orange }}>04 &middot; A few lines from it</p>
              <h2 style={{ margin: "0 0 28px", fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(26px,4vw,42px)", letterSpacing: "-.03em", textTransform: "uppercase", color: "#fff", lineHeight: 1 }}>How it reads</h2>
            </R>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(300px,100%),1fr))", gap: 2 }}>
              {[
                ["\u201cThe finish on a serious car is not a cosmetic. It is a surface that needs a system.\u201d","Ch. 1"],
                ["\u201cIf you paid six figures for the paint, you owe it the right mitt.\u201d","Ch. 3"],
                ["\u201cMost swirl marks come from the wash, not from the road.\u201d","Ch. 3"],
                ["\u201cA ceramic coat on top of bad prep is an expensive mistake.\u201d","Ch. 5"],
                ["\u201cThe person with the buffer is guessing unless they know what is under it.\u201d","Ch. 5"],
                ["\u201cLayer with purpose. Not out of fear, and not to add product.\u201d","Ch. 8"],
              ].map(([q, ch], i) => (
                <R key={i} delay={i * 40}>
                  <div style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.08)", padding: "clamp(20px,2.8vw,32px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 14, minHeight: 140 }}>
                    <p style={{ margin: 0, fontFamily: S.serif, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(17px,2vw,20px)", lineHeight: 1.38, color: "#fff" }}>{q}</p>
                    <span style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: S.mute }}>{ch}</span>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>

        {/* ━━ 05  LEAD MAGNET ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section id="index" style={{ padding: sec, background: `linear-gradient(150deg, rgba(242,201,76,.06) 0%, rgba(242,201,76,0) 60%)`, borderTop: "1px solid rgba(255,255,255,.1)", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
          <div style={wide}>
            <div style={{ display: "grid", gap: "clamp(32px,5vw,72px)", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", alignItems: "start" }}>
              <R>
                <p style={{ margin: "0 0 8px", fontFamily: S.mono, fontSize: 10.5, letterSpacing: ".22em", textTransform: "uppercase", color: S.gold }}>Free &middot; No catch</p>
                <h2 style={{ margin: "0 0 16px", fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(24px,3.8vw,38px)", letterSpacing: "-.03em", textTransform: "uppercase", color: "#fff", lineHeight: 1 }}>Everything that goes on the car. Free. Before you buy anything.</h2>
                <p style={{ margin: "0 0 12px", fontFamily: S.sans, fontSize: 15.5, lineHeight: 1.64, color: S.body }}>Fifty-four products across eight zones. What goes on which surface, in which order, with which tools. Every link verified. Affiliate items marked.</p>
                <p style={{ margin: 0, fontFamily: S.sans, fontSize: 15.5, lineHeight: 1.64, color: S.body }}>The index tells you what. The book tells you why — and on a six-figure finish, the why is the part that matters.</p>
              </R>
              <R delay={80}>
                <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderTop: `3px solid ${S.gold}`, padding: "clamp(22px,3vw,36px)" }}>
                  <p style={{ margin: "0 0 6px", fontFamily: S.mono, fontSize: 10.5, letterSpacing: ".22em", textTransform: "uppercase", color: S.gold }}>The GoTime Juice Box Index™</p>
                  <p style={{ margin: "0 0 22px", fontFamily: S.disp, fontWeight: 700, fontSize: 20, color: "#fff" }}>54 products. 8 zones. Free PDF.</p>
                  <JuiceBoxForm />
                </div>
              </R>
            </div>
          </div>
        </section>

        {/* ━━ 06  WHO IT IS FOR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section style={{ padding: mid }}>
          <div style={col}>
            <R>
              <p style={{ margin: "0 0 8px", fontFamily: S.mono, fontSize: 10.5, letterSpacing: ".22em", textTransform: "uppercase", color: S.orange }}>05 &middot; Who this is for</p>
              <h2 style={{ margin: "0 0 28px", fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(24px,3.8vw,38px)", letterSpacing: "-.03em", textTransform: "uppercase", color: "#fff", lineHeight: 1 }}>The finish on your car has a price tag. Protect it like it does.</h2>
            </R>
            <R delay={60}>
              <p style={{ margin: "0 0 20px", fontFamily: S.serif, fontSize: "clamp(16px,1.8vw,19px)", lineHeight: 1.72, color: S.body }}>This book is for owners who want to know what is being done to their car — not to do it themselves necessarily, but to be able to tell whether the person doing it knows what they are doing.</p>
              <p style={{ margin: 0, fontFamily: S.serif, fontSize: "clamp(16px,1.8vw,19px)", lineHeight: 1.72, color: S.body }}>It works on a $400K Enzo and it works on a $40K M3. The chemistry does not change. The order does not change. The standard does not change.</p>
            </R>
            <R delay={100}>
              <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(180px,100%),1fr))", gap: 2 }}>
                {["Porsche owners","Ferrari owners","McLaren owners","Lamborghini owners","BMW M owners","Any car worth protecting"].map(t => (
                  <div key={t} style={{ padding: "14px 16px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)" }}>
                    <span style={{ fontFamily: S.mono, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: S.paper }}>{t}</span>
                  </div>
                ))}
              </div>
            </R>
          </div>
        </section>

        {/* ━━ 07  TEACHERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section style={{ padding: sec, background: "rgba(255,255,255,.015)", borderTop: "1px solid rgba(255,255,255,.08)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <div style={wide}>
            <R>
              <p style={{ margin: "0 0 8px", fontFamily: S.mono, fontSize: 10.5, letterSpacing: ".22em", textTransform: "uppercase", color: S.orange }}>06 &middot; None of it came from nowhere</p>
              <h2 style={{ margin: "0 0 12px", fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(26px,4vw,42px)", letterSpacing: "-.03em", textTransform: "uppercase", color: "#fff", lineHeight: 1 }}>The teachers</h2>
              <p style={{ margin: "0 0 36px", fontFamily: S.sans, fontSize: 16, lineHeight: 1.64, color: S.body, maxWidth: "58ch" }}>Chapter nine names the people whose work this is built on, because a system built on other people&apos;s work should say so.</p>
            </R>
            <D />
            {[
              ["Chemical Guys",     "",                  "Where it started",           "Bought the full line. Watched all the videos. First foam cannon, first rhythm."],
              ["Larry Kosilla",     "AMMO NYC",          "Mousse, Frothe, mindset",    "A random phone call turned into one of the biggest mindset shifts I have had."],
              ["Matt Moreman",      "Obsessed Garage",   "Garage layout as a language","Shelves are standards. Labels are respect. My setup is an extension of my system."],
              ["Pan The Organizer", "",                  "Science to shine",           "Stopped trying everything for fun and started building a forever kit."],
              ["Esoteric Car Care", "",                  "Raised the floor",           "Correction, lighting, technique. Expert-level shine is not hype, it is habit."],
            ].map(([name, brand, role, desc], i) => (
              <R key={name} delay={i * 40}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px 24px", padding: "24px 0", borderBottom: "1px solid rgba(255,255,255,.07)", alignItems: "start" }}>
                  <div>
                    <p style={{ margin: "0 0 3px", fontFamily: S.disp, fontWeight: 700, fontSize: "clamp(15px,1.8vw,18px)", color: "#fff" }}>{name}</p>
                    {brand && <p style={{ margin: 0, fontFamily: S.sans, fontSize: 13.5, color: S.steel }}>{brand}</p>}
                    <p style={{ margin: "10px 0 0", fontFamily: S.serif, fontSize: 15.5, lineHeight: 1.55, color: S.body }}>{desc}</p>
                  </div>
                  <span style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: S.orange, textAlign: "right", lineHeight: 1.5, maxWidth: "16ch" }}>{role}</span>
                </div>
              </R>
            ))}
          </div>
        </section>

        {/* ━━ 08  FINAL BUY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section style={{ padding: sec }}>
          <div style={wide}>
            <R>
              <div style={{ display: "grid", gap: "clamp(36px,5vw,72px)", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", alignItems: "center", background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.1)", borderTop: `4px solid ${S.orange}`, padding: "clamp(28px,4.4vw,56px)" }}>

                <div style={{ maxWidth: 240, margin: "0 auto", width: "100%" }}>
                  <Cover size="md" />
                </div>

                <div>
                  <p style={{ margin: "0 0 8px", fontFamily: S.mono, fontSize: 10.5, letterSpacing: ".22em", textTransform: "uppercase", color: S.orange }}>Get the book</p>
                  <h2 style={{ margin: "0 0 16px", fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(28px,4.2vw,48px)", letterSpacing: "-.03em", textTransform: "uppercase", color: "#fff", lineHeight: 1 }}>The Gloss Game™</h2>
                  <p style={{ margin: "0 0 28px", fontFamily: S.sans, fontSize: 16, lineHeight: 1.64, color: S.body, maxWidth: "46ch" }}>Twelve chapters on what the finish on a serious car actually needs. The Juice Box index with the reasoning behind every product. The seven-day Gloss Reset — written as a journal you work through on the car itself.</p>

                  <div style={{ marginBottom: 28 }}>
                    <Stars n={5} label="Paperback · $19.99" />
                    <div style={{ height: 8 }} />
                    <Stars n={5} label="Kindle · $9.99" />
                  </div>

                  <BuyBlock />

                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", gap: 24, flexWrap: "wrap" }}>
                    {[["ISBN","979-8298190060"],["Pages","96"],["Published","April 2025"],["Imprint","GoTime Motorsports"]].map(([k, v]) => (
                      <div key={k}>
                        <p style={{ margin: "0 0 2px", fontFamily: S.mono, fontSize: 9.5, letterSpacing: ".18em", textTransform: "uppercase", color: S.mute }}>{k}</p>
                        <p style={{ margin: 0, fontFamily: S.sans, fontSize: 13.5, color: S.paper }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </R>
          </div>
        </section>

        {/* ━━ colophon ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section style={{ padding: "clamp(36px,5vw,56px) 0", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ ...wide, display: "grid", gap: "clamp(18px,3vw,44px)", gridTemplateColumns: "repeat(auto-fit,minmax(min(200px,100%),1fr))" }}>
            <R>
              <p style={{ margin: "0 0 8px", fontFamily: S.mono, fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase", color: S.orange, fontWeight: 400 }}>Imprint</p>
              <p style={{ margin: "0 0 5px", fontFamily: S.sans, fontSize: 14, lineHeight: 1.6, color: S.body }}>Written by Gavin Brooks</p>
              <p style={{ margin: "0 0 5px", fontFamily: S.sans, fontSize: 14, lineHeight: 1.6, color: S.body }}>Published by GoTime Motorsports™</p>
              <p style={{ margin: 0, fontFamily: S.sans, fontSize: 14, lineHeight: 1.6, color: S.body }}>First edition, April 2025</p>
            </R>
            <R>
              <p style={{ margin: "0 0 8px", fontFamily: S.mono, fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase", color: S.orange, fontWeight: 400 }}>Dedication</p>
              <p style={{ margin: 0, fontFamily: S.serif, fontStyle: "italic", fontSize: 15.5, color: S.steel }}>For April and Rian, and for Jerry and Robyn.</p>
            </R>
            <R>
              <p style={{ margin: "0 0 8px", fontFamily: S.mono, fontSize: 9.5, letterSpacing: ".22em", textTransform: "uppercase", color: S.orange, fontWeight: 400 }}>Questions</p>
              <p style={{ margin: "0 0 5px", fontFamily: S.sans, fontSize: 14, lineHeight: 1.6, color: S.body }}>
                <a href="mailto:paddock20auto@gmail.com" style={{ color: S.orange, textDecoration: "none" }}>paddock20auto@gmail.com</a>
              </p>
              <p style={{ margin: "0 0 5px", fontFamily: S.sans, fontSize: 14, lineHeight: 1.6, color: S.body }}>
                <a href="https://instagram.com/PaddockGavin" target="_blank" rel="noopener noreferrer" style={{ color: S.orange, textDecoration: "none" }}>@PaddockGavin</a> on Instagram
              </p>
              <p style={{ margin: 0, fontFamily: S.mono, fontSize: 12, color: S.mute }}>#TheGlossGame</p>
            </R>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}
