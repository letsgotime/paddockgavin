"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

const AMAZON_PB  = "https://www.amazon.com/dp/B0FMPGNTPY"
const AMAZON_KDL = "https://www.amazon.com/dp/B0FMPH9ZK1"

// ── scroll-reveal hook ────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.04 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, on }
}
function R({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const { ref, on } = useReveal()
  return (
    <div
      ref={ref}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "none" : "translateY(22px)",
        transition: "opacity .72s cubic-bezier(.16,1,.3,1), transform .72s cubic-bezier(.16,1,.3,1)",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ── shared token shortcuts ───────────────────────────────────────────────────
const S = {
  deep:    "#0A1523",
  navy:    "#0E1A2A",
  ink:     "#060E18",
  green:   "#00D2BE",
  greenHi: "#3FE3D2",
  greenDp: "#00302B",
  yellow:  "#F8B800",
  blue:    "#005185",
  blueEdge:"#0A6BAA",
  steel:   "#B4B6B2",
  mute:    "#91918F",
  paper:   "#EDF1F6",
  body:    "#C4CBD6",
  mono:    "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
  disp:    "Archivo,'Helvetica Neue',Helvetica,Arial,sans-serif",
  serif:   "Newsreader,Georgia,'Times New Roman',serif",
}

// ── sub-components ───────────────────────────────────────────────────────────
function Folio({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 26 }}>
      <i style={{ fontStyle: "normal", fontFamily: S.mono, fontSize: 12, letterSpacing: ".2em", color: S.mute }}>{n}</i>
      <span style={{ fontFamily: S.mono, fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: S.green }}>{label}</span>
      <u style={{ flex: "1 1 auto", height: 1, background: "rgba(255,255,255,.13)", textDecoration: "none" }} />
    </div>
  )
}

function Rule({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 30 }}>
      <i style={{ fontStyle: "normal", width: 26, height: 3, background: S.green, flex: "0 0 auto" }} />
      <span style={{ fontFamily: S.mono, fontSize: 11.5, letterSpacing: ".22em", textTransform: "uppercase", color: S.paper, whiteSpace: "nowrap" }}>{label}</span>
      <u style={{ flex: "1 1 auto", height: 1, background: "rgba(255,255,255,.12)", textDecoration: "none" }} />
    </div>
  )
}

function Btn({ href, children, small }: { href: string; children: React.ReactNode; small?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: S.disp,
        fontWeight: 800,
        fontSize: small ? 13 : 15,
        letterSpacing: ".05em",
        textTransform: "uppercase",
        background: S.green,
        color: S.greenDp,
        padding: small ? "13px 24px" : "17px 32px",
        clipPath: "polygon(0 0,100% 0,100% calc(100% - 13px),calc(100% - 13px) 100%,0 100%)",
        border: 0,
        cursor: "pointer",
        textDecoration: "none",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </a>
  )
}

function QuoteBand({ quote, attrib }: { quote: string; attrib: string }) {
  return (
    <section style={{ padding: "clamp(40px,7vw,80px) 0", borderTop: "1px solid rgba(255,255,255,.1)", borderBottom: "1px solid rgba(255,255,255,.1)", background: "linear-gradient(150deg,rgba(0,210,190,.05),rgba(0,210,190,0))" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(18px,5vw,64px)" }}>
        <R>
          <blockquote style={{ fontFamily: S.serif, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(27px,4.6vw,50px)", lineHeight: 1.18, color: "#fff", margin: 0, maxWidth: "18ch", letterSpacing: "-.016em" }}>
            &ldquo;{quote}&rdquo;
          </blockquote>
          <p style={{ fontFamily: S.mono, fontSize: 11.5, letterSpacing: ".2em", textTransform: "uppercase", color: S.mute, margin: "22px 0 0" }}>{attrib}</p>
        </R>
      </div>
    </section>
  )
}

// ── cover plate (typographic stand-in) ─────────────────────────────────────
function CoverPlate() {
  return (
    <div style={{ aspectRatio: "5/8", background: "linear-gradient(158deg,#0E1A2A,#060E18 62%)", border: "1px solid rgba(255,255,255,.16)", boxShadow: "0 30px 60px -30px rgba(0,0,0,.9)", padding: "clamp(20px,2.6vw,30px)", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(115deg,transparent 32%,rgba(255,255,255,.07) 47%,transparent 58%)" }} />
      <p style={{ fontFamily: S.mono, fontSize: 9.5, letterSpacing: ".24em", textTransform: "uppercase", color: S.green, margin: 0 }}>GoTime Motorsports</p>
      <div>
        <p style={{ fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(26px,3.4vw,40px)", lineHeight: .9, letterSpacing: "-.04em", textTransform: "uppercase", color: "#fff", margin: 0 }}>
          The<br />Gloss<br />Game<sup style={{ fontSize: ".3em", verticalAlign: "super" }}>™</sup>
        </p>
        <p style={{ fontFamily: S.serif, fontStyle: "italic", fontSize: 13.5, lineHeight: 1.35, color: S.steel, margin: "12px 0 0" }}>This isn&apos;t detailing. It&apos;s discipline on display.</p>
      </div>
      <div>
        <hr style={{ border: 0, height: 1, background: "rgba(255,255,255,.18)", margin: "16px 0" }} />
        <p style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: S.paper, margin: 0 }}>Gavin Brooks</p>
      </div>
    </div>
  )
}

// ── lead magnet form ─────────────────────────────────────────────────────────
function JuiceBoxForm() {
  const [email, setEmail]   = useState("")
  const [status, setStatus] = useState<"idle"|"sending"|"ok"|"err">("idle")
  const [msg, setMsg]       = useState("")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus("err"); setMsg("That address does not look right. Have another go."); return
    }
    setStatus("sending")
    try {
      const r = await fetch("/api/juicebox", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
      const j = await r.json()
      if (r.ok) { setStatus("ok"); setMsg("On its way. If it is not there in a minute, check the spam folder and drag it out.") }
      else       { setStatus("err"); setMsg(j?.error || "Something went wrong. Try again in a moment.") }
    } catch { setStatus("err"); setMsg("Could not reach the server. Try again in a moment.") }
  }

  return (
    <form onSubmit={submit} noValidate>
      <label style={{ display: "block", fontFamily: S.mono, fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: S.green, marginBottom: 12 }}>
        Where should I send it
      </label>
      {status !== "ok" && (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{ flex: "1 1 240px", minWidth: 0, background: "rgba(6,14,24,.55)", color: "#fff", border: "1px solid rgba(255,255,255,.22)", padding: "16px 18px", fontFamily: S.disp, fontSize: 16, outline: "none" }}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: S.disp, fontWeight: 800, fontSize: 15, letterSpacing: ".05em", textTransform: "uppercase", background: S.green, color: S.greenDp, padding: "17px 32px", border: 0, cursor: "pointer", clipPath: "polygon(0 0,100% 0,100% calc(100% - 13px),calc(100% - 13px) 100%,0 100%)", whiteSpace: "nowrap" }}
            >
              {status === "sending" ? "Sending…" : "Send the index"}
            </button>
          </div>
          <p style={{ fontFamily: S.mono, fontSize: 11, lineHeight: 1.7, color: S.mute, margin: "16px 0 0", maxWidth: "46ch" }}>
            One email with the PDF. After that I write when I have something worth reading, and every email has a link to stop them.
          </p>
        </>
      )}
      {msg && (
        <p style={{ fontFamily: S.mono, fontSize: 12.5, lineHeight: 1.6, margin: "14px 0 0", color: status === "ok" ? S.green : "#FF8E85" }}>{msg}</p>
      )}
    </form>
  )
}

// ── page ─────────────────────────────────────────────────────────────────────
export default function GlossGamePage() {
  const gut = "clamp(18px,5vw,64px)"
  const col = { maxWidth: 720,  margin: "0 auto", padding: `0 ${gut}` }
  const wide = { maxWidth: 1180, margin: "0 auto", padding: `0 ${gut}` }
  const sec  = { padding: "clamp(56px,9vw,116px) 0" }
  const tight = { padding: "clamp(36px,6vw,68px) 0" }

  return (
    <>
      <SiteNav />
      <main style={{ background: S.deep, color: S.body, fontFamily: S.disp, overflowX: "hidden" }}>

        {/* ── 00 MASTHEAD ──────────────────────────────────────────────── */}
        <section style={{ ...sec, paddingTop: "clamp(46px,7vw,92px)" }}>
          <div style={wide}>
            <p style={{ fontFamily: S.mono, fontSize: 11.5, letterSpacing: ".26em", textTransform: "uppercase", color: S.green, margin: "0 0 20px" }}>
              Night shift &middot; Book one
            </p>
            <div style={{ display: "grid", gap: "clamp(28px,4vw,64px)", gridTemplateColumns: "min(100%,1fr)" }}>
              <div style={{ display: "grid", gap: "clamp(28px,4vw,64px)" }} className="mast-grid">
                <R>
                  <h1 style={{ fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(46px,11vw,132px)", lineHeight: .86, letterSpacing: "-.045em", textTransform: "uppercase", color: "#fff", margin: "0 0 26px" }}>
                    The Gloss<br />Game<sup style={{ fontSize: ".24em", verticalAlign: "super", letterSpacing: ".02em" }}>™</sup>
                  </h1>
                  <p style={{ fontFamily: S.serif, fontSize: "clamp(21px,2.7vw,30px)", lineHeight: 1.4, fontWeight: 300, fontStyle: "italic", color: S.paper, margin: "0 0 34px", maxWidth: "26ch" }}>
                    This isn&apos;t detailing. It&apos;s discipline on display.
                  </p>
                  <p style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontFamily: S.mono, fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", color: S.mute, margin: 0 }}>
                    <b style={{ color: S.paper, fontWeight: 400 }}>Gavin Brooks</b>
                    <span style={{ color: "rgba(255,255,255,.2)" }}>/</span>
                    <span>First edition, April 2025</span>
                    <span style={{ color: "rgba(255,255,255,.2)" }}>/</span>
                    <span>Paperback and Kindle</span>
                  </p>
                </R>
                <R>
                  <dl style={{ margin: "0 0 26px", padding: 0, borderTop: "1px solid rgba(255,255,255,.13)" }}>
                    {[["Chapters","Twelve, across 96 pages"],["Formats","Paperback and Kindle, $19.99"],["ISBN","979-8298190060"],["Started","Escondido, California, 1993"]].map(([dt, dd]) => (
                      <div key={dt} style={{ display: "grid", gridTemplateColumns: "88px 1fr", gap: 14, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.075)" }}>
                        <dt style={{ fontFamily: S.mono, fontSize: 10.5, letterSpacing: ".2em", textTransform: "uppercase", color: S.mute, paddingTop: 2 }}>{dt}</dt>
                        <dd style={{ margin: 0, fontFamily: S.disp, fontSize: 14, lineHeight: 1.5, color: S.body }}>{dd}</dd>
                      </div>
                    ))}
                  </dl>
                  <Btn href={AMAZON_PB} small>Buy on Amazon</Btn>
                </R>
              </div>
            </div>
          </div>
        </section>

        {/* ── QUOTE 1 ──────────────────────────────────────────────────── */}
        <QuoteBand quote="I didn't just learn how to clean cars. I learned how to build options." attrib="The Gloss Game, preface" />

        {/* ── 01 WHERE IT STARTED ──────────────────────────────────────── */}
        <section style={tight}>
          <div style={col}>
            <Folio n="01" label="Where it started" />
            <R>
              <p style={{ fontFamily: S.serif, fontSize: 18.5, lineHeight: 1.7, color: S.body, margin: "0 0 22px", maxWidth: "64ch" }}>
                <span style={{ float: "left", fontFamily: S.serif, fontWeight: 600, fontSize: 76, lineHeight: .82, padding: "9px 14px 0 0", color: S.yellow }}>I</span>
                t didn&apos;t start in a shop. It started with a crate and a driveway in Escondido, California, in 1993.
              </p>
            </R>
            <R><p style={{ fontFamily: S.serif, fontSize: 18.5, lineHeight: 1.7, color: S.body, margin: "0 0 22px", maxWidth: "64ch" }}>Every Saturday the car got detailed and the lawn got mowed and manicured, in that order, before anything else happened. No rhythm, no weekend.</p></R>
            <R><p style={{ fontFamily: S.serif, fontSize: 18.5, lineHeight: 1.7, color: S.body, margin: "0 0 22px", maxWidth: "64ch" }}>By 1995 I was fifteen and driving up to La Jolla to do it for people who paid. Twenty-five dollars for a wash and wax. A hundred and twenty-five if the car needed everything.</p></R>
            <R><p style={{ fontFamily: S.serif, fontSize: 18.5, lineHeight: 1.7, color: S.body, margin: "0 0 22px", maxWidth: "64ch" }}>Fifty-five thousand dollars is what it took to find out what actually works, and most of that went on finding out what I didn&apos;t need. It got spent over thirty years, on a few dozen of my own cars and on more client and friend cars than I kept count of.</p></R>
            <R><p style={{ fontFamily: S.serif, fontSize: 18.5, lineHeight: 1.7, color: S.body, margin: "0 0 22px", maxWidth: "64ch" }}>The book is twelve chapters of what came out of that. What to buy first, what order to do it in, what I got wrong, and who taught me.</p></R>
          </div>
        </section>

        {/* ── 02 CONTENTS ──────────────────────────────────────────────── */}
        <section style={sec}>
          <div style={wide}>
            <Folio n="02" label="Contents" />
            <R><h2 style={{ fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(26px,4.6vw,48px)", lineHeight: 1, letterSpacing: "-.034em", textTransform: "uppercase", color: "#fff", margin: "0 0 20px" }}>Twelve chapters</h2></R>
            <div style={{ borderTop: "1px solid rgba(255,255,255,.13)" }}>
              {[
                ["01","The Gloss Mindset","Clean isn't just a look. It's a language."],
                ["02","Setup Before Shine","Tools. Space. Timing. The pre-wash that powers every detail."],
                ["03","The Wash Flow™","Foam logic. Contact discipline. The towel that makes or breaks it."],
                ["04","Wheels, Barrels & Rubber","The discipline most skip, but everyone notices."],
                ["05","Prep Correct Protect","What your paint needs before you touch it."],
                ["06","Interiors That Stay Clean","Cabin systems. Real-world touchpoints."],
                ["07","Gloss Goals","Layering logic. Long-term shine."],
                ["08","The Maintenance Regimen","How to wash, wipe and reset without overthinking gloss."],
                ["09","Thank You to the Teachers","The people, products and platforms that built the rhythm."],
                ["10","The GoTime Juice Box™","What we use. Why we use it. How it got in."],
                ["11","The Gloss Reset System™","Seven days to bring the finish back, whatever the condition."],
                ["12","Gloss for Life™","What it means to live this way, and why it's bigger than shine."],
              ].map(([n, title, desc]) => (
                <R key={n}>
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px clamp(14px,3vw,34px)", padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,.075)", alignItems: "baseline" }}>
                    <span style={{ fontFamily: S.mono, fontSize: 12, letterSpacing: ".14em", color: S.green }}>{n}</span>
                    <h3 style={{ fontFamily: S.disp, fontWeight: 800, fontSize: "clamp(16px,2vw,19px)", lineHeight: 1.18, letterSpacing: "-.01em", color: "#fff", margin: 0 }}>{title}</h3>
                    <p style={{ margin: 0, fontFamily: S.serif, fontSize: 16, lineHeight: 1.5, color: S.mute, gridColumn: "2 / -1" }}>{desc}</p>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>

        {/* ── 03 WHAT IS INSIDE ────────────────────────────────────────── */}
        <section style={sec}>
          <div style={wide}>
            <Folio n="03" label="What is inside" />
            <R>
              <h2 style={{ fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(26px,4.6vw,48px)", lineHeight: 1, letterSpacing: "-.034em", textTransform: "uppercase", color: "#fff", margin: "0 0 12px" }}>Eight things you walk away with</h2>
              <p style={{ fontFamily: S.disp, fontSize: 16, lineHeight: 1.64, color: S.body, margin: "0 0 clamp(20px,3vw,38px)", maxWidth: "64ch" }}>Not theory and not a product list. Systems that were built on a driveway, run on a few dozen of my own cars, and then written down in the order you would actually do them.</p>
            </R>
            <div style={{ borderTop: "1px solid rgba(255,255,255,.13)" }}>
              {[
                ["Chapter 3","The Wash Flow","Four buckets, a mitt map and a towel code, so the swirls you are looking at stop being ones you put there yourself."],
                ["Chapter 4","Rubber first","Why the wheels come before the paint, and how to tell when a tire is actually clean rather than just wet."],
                ["Chapter 5","Prep, correct, protect","What the paint needs before a pad ever touches it, and what it costs you when you skip it."],
                ["Chapter 6","Interiors that stay clean","The cabin as a system. Which surfaces get coated, which get left alone, and what nothing should ever feel like."],
                ["Chapter 7","Gloss goals","Three layers, in order, and how long to wait between them. Skip one and you halve the life of the finish."],
                ["Chapter 9","The teachers","The people whose work this is built on, named, because a system built on other people's work should say so."],
                ["Chapter 10","The Juice Box","Every product, tool and towel by zone, with the reason each one is in there and the three loadouts to start from."],
                ["Chapter 11","The Gloss Reset","Seven days, one car, one journal. A day per job so nothing gets rushed into the next thing."],
              ].map(([ch, title, desc]) => (
                <R key={ch}>
                  <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: "clamp(10px,2.4vw,30px)", padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,.075)", alignItems: "baseline" }}>
                    <span style={{ fontFamily: S.mono, fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: S.green }}>{ch}</span>
                    <div>
                      <h3 style={{ fontFamily: S.disp, fontWeight: 800, fontSize: "clamp(16px,2vw,19px)", color: "#fff", margin: "0 0 6px" }}>{title}</h3>
                      <p style={{ margin: 0, fontFamily: S.serif, fontSize: 16.5, lineHeight: 1.55, color: S.mute }}>{desc}</p>
                    </div>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUOTE 2 ──────────────────────────────────────────────────── */}
        <QuoteBand quote="Some people meditate. I wash." attrib="Chapter one, The Gloss Mindset" />

        {/* ── 04 HOW IT READS ──────────────────────────────────────────── */}
        <section style={sec}>
          <div style={wide}>
            <Folio n="04" label="A few lines from it" />
            <R><h2 style={{ fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(26px,4.6vw,48px)", lineHeight: 1, letterSpacing: "-.034em", textTransform: "uppercase", color: "#fff", margin: "0 0 20px" }}>How it reads</h2></R>
            <div style={{ display: "grid", gap: 1, background: "rgba(255,255,255,.1)", borderTop: "1px solid rgba(255,255,255,.1)", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
              {[
                ["\u201cYou don\u2019t wash a car. You reset a finish.\u201d","Chapter 3"],
                ["\u201cMost swirls come from rinse buckets, not dirty paint.\u201d","Chapter 3"],
                ["\u201cThe tire is clean when it squeaks.\u201d","Chapter 4"],
                ["\u201cTime shrinks when rhythm grows.\u201d","Chapter 2"],
                ["\u201cGloss is like cardio. You lose it if you skip the rhythm.\u201d","Chapter 8"],
                ["\u201cDon\u2019t layer out of fear. Layer with purpose.\u201d","Chapter 8"],
              ].map(([q, ch]) => (
                <R key={q}>
                  <div style={{ background: S.deep, padding: "28px 26px 30px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 18, minHeight: 168 }}>
                    <p style={{ margin: 0, fontFamily: S.serif, fontStyle: "italic", fontWeight: 300, fontSize: 21, lineHeight: 1.34, color: "#fff", letterSpacing: "-.008em" }}>{q}</p>
                    <span style={{ fontFamily: S.mono, fontSize: 10.5, letterSpacing: ".2em", textTransform: "uppercase", color: S.mute }}>{ch}</span>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>

        {/* ── 05 LEAD MAGNET ───────────────────────────────────────────── */}
        <section id="index" style={{ padding: "clamp(56px,9vw,116px) 0", borderTop: "1px solid rgba(255,255,255,.1)", borderBottom: "1px solid rgba(255,255,255,.1)", background: "linear-gradient(150deg,rgba(0,210,190,.06),rgba(0,210,190,0))" }}>
          <div style={wide}>
            <div style={{ display: "grid", gap: "clamp(28px,4vw,64px)" }}>
              <R>
                <Folio n="05" label="The index, free" />
                <h2 style={{ fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(26px,4.6vw,48px)", lineHeight: 1, letterSpacing: "-.034em", textTransform: "uppercase", color: "#fff", margin: "0 0 20px" }}>The whole product list, before you buy anything</h2>
                <p style={{ fontFamily: S.disp, fontSize: 16, lineHeight: 1.64, color: S.body, margin: "0 0 16px", maxWidth: "64ch" }}>Fifty-four products across eight zones, every link fetched and checked, and the eight that pay me a commission marked so you can see them.</p>
                <p style={{ fontFamily: S.disp, fontSize: 16, lineHeight: 1.64, color: S.body, margin: 0, maxWidth: "64ch" }}>It is the shopping half of chapter ten. What it does not have is the reason each one is in there, which is the half that took thirty years.</p>
              </R>
              <R><JuiceBoxForm /></R>
            </div>
          </div>
        </section>

        {/* ── 06 WHO IT IS FOR ─────────────────────────────────────────── */}
        <section style={tight}>
          <div style={col}>
            <Folio n="06" label="Who it is for" />
            <R><p style={{ fontFamily: S.serif, fontSize: 18.5, lineHeight: 1.7, color: S.body, margin: "0 0 22px", maxWidth: "64ch" }}>Flip cars. Client preps. Daily drivers that used to pop. Cars going back on lease, and garage queens that have been hiding since the last two rainstorms.</p></R>
            <R><p style={{ fontFamily: S.serif, fontSize: 18.5, lineHeight: 1.7, color: S.body, margin: "0 0 22px", maxWidth: "64ch" }}>It assumes a driveway and a folding table, not a shop. That is what I started with, and the rules do not change at four hundred square feet or forty.</p></R>
          </div>
        </section>

        {/* ── 07 THE TEACHERS ──────────────────────────────────────────── */}
        <section style={sec}>
          <div style={wide}>
            <Folio n="07" label="The teachers" />
            <R>
              <h2 style={{ fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(26px,4.6vw,48px)", lineHeight: 1, letterSpacing: "-.034em", textTransform: "uppercase", color: "#fff", margin: "0 0 12px" }}>None of it came from nowhere</h2>
              <p style={{ fontFamily: S.disp, fontSize: 16, lineHeight: 1.64, color: S.body, margin: "0 0 clamp(20px,3vw,38px)", maxWidth: "64ch" }}>Chapter nine is a list of people who taught me something, most of them without knowing they were doing it. It is in the book because a system built on other people&apos;s work should say so.</p>
            </R>
            <div style={{ borderTop: "1px solid rgba(255,255,255,.13)" }}>
              {[
                ["Chemical Guys",         "",                 "Where it started",          "Bought the full line. Watched all the videos. First foam cannon, first rhythm."],
                ["Larry Kosilla",         "AMMO NYC",         "Mousse, Frothe, mindset",   "A random phone call turned into one of the biggest mindset shifts I've ever had."],
                ["Matt Moreman",          "Obsessed Garage",  "Garage layout as a language","Shelves are standards. Labels are respect. My setup is an extension of my system."],
                ["Pan The Organizer",     "",                 "Science to shine",          "Stopped trying everything for fun and started building a forever kit."],
                ["Esoteric Car Care",     "",                 "Raised the floor",          "Correction, lighting, technique. Expert-level shine isn't hype, it's habit."],
              ].map(([name, brand, role, desc]) => (
                <R key={name}>
                  <div style={{ display: "grid", gap: "clamp(6px,2vw,30px)", padding: "22px 0", borderBottom: "1px solid rgba(255,255,255,.075)" }}>
                    <div>
                      <h3 style={{ fontFamily: S.disp, fontWeight: 800, fontSize: "clamp(16px,2vw,19px)", color: "#fff", margin: 0 }}>{name}</h3>
                      {brand && <p style={{ fontFamily: S.disp, fontSize: 13.5, color: S.steel, margin: "4px 0 0" }}>{brand}</p>}
                    </div>
                    <span style={{ fontFamily: S.mono, fontSize: 11, letterSpacing: ".17em", textTransform: "uppercase", color: S.green, lineHeight: 1.6 }}>{role}</span>
                    <p style={{ margin: 0, fontFamily: S.serif, fontSize: 17, lineHeight: 1.55, color: S.body }}>{desc}</p>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUOTE 3 ──────────────────────────────────────────────────── */}
        <QuoteBand quote="You don't polish paint. You polish presence." attrib="Chapter twelve, Gloss for Life" />

        {/* ── 08 BUY THE BOOK ──────────────────────────────────────────── */}
        <section style={sec}>
          <div style={wide}>
            <R>
              <div style={{ background: "linear-gradient(150deg,rgba(0,81,133,.94),rgba(0,81,133,.55))", border: "1px solid #0A6BAA", boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 26px),calc(100% - 26px) 100%,0 100%)", padding: "clamp(26px,4.4vw,52px)", display: "grid", gap: "clamp(26px,4vw,52px)" }}>
                <CoverPlate />
                <div>
                  <h2 style={{ fontFamily: S.disp, fontWeight: 900, fontSize: "clamp(26px,4.6vw,48px)", lineHeight: 1, letterSpacing: "-.034em", textTransform: "uppercase", color: "#fff", margin: "0 0 16px" }}>Get the book</h2>
                  <p style={{ fontFamily: S.disp, fontSize: 16, lineHeight: 1.64, color: "#DCE8F2", margin: 0, maxWidth: "46ch" }}>Paperback and Kindle on Amazon. Twelve chapters, the full Juice Box index with the reason each product is in it, and the seven-day Gloss Reset written as a journal you fill in as you go.</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginTop: 26 }}>
                    <Btn href={AMAZON_PB}>Paperback on Amazon</Btn>
                    <a href={AMAZON_KDL} target="_blank" rel="noopener noreferrer" style={{ fontFamily: S.mono, fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", color: S.green, borderBottom: "1px solid rgba(0,210,190,.4)", paddingBottom: 2, textDecoration: "none" }}>
                      Kindle edition
                    </a>
                    <span style={{ fontFamily: S.mono, fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", color: "#BBD4E6" }}>ISBN 979-8298190060 &middot; 96 pages</span>
                  </div>
                </div>
              </div>
            </R>
          </div>
        </section>

        {/* ── 09 COLOPHON ──────────────────────────────────────────────── */}
        <section style={tight}>
          <div style={wide}>
            <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 34, display: "grid", gap: "clamp(18px,3vw,44px)", gridTemplateColumns: "repeat(auto-fit,minmax(min(220px,100%),1fr))" }}>
              <R>
                <h4 style={{ fontFamily: S.mono, fontSize: 10.5, letterSpacing: ".22em", textTransform: "uppercase", color: S.green, margin: "0 0 10px", fontWeight: 400 }}>Imprint</h4>
                <p style={{ margin: "0 0 7px", fontFamily: S.disp, fontSize: 14, lineHeight: 1.6, color: S.body }}>Written by Gavin Brooks</p>
                <p style={{ margin: "0 0 7px", fontFamily: S.disp, fontSize: 14, lineHeight: 1.6, color: S.body }}>Published by GoTime Motorsports™</p>
                <p style={{ margin: 0, fontFamily: S.disp, fontSize: 14, lineHeight: 1.6, color: S.body }}>First edition, April 2025</p>
              </R>
              <R>
                <h4 style={{ fontFamily: S.mono, fontSize: 10.5, letterSpacing: ".22em", textTransform: "uppercase", color: S.green, margin: "0 0 10px", fontWeight: 400 }}>Dedication</h4>
                <p style={{ margin: 0, fontFamily: S.serif, fontStyle: "italic", fontSize: 16, color: S.steel }}>For April and Rian, and for Jerry and Robyn.</p>
              </R>
              <R>
                <h4 style={{ fontFamily: S.mono, fontSize: 10.5, letterSpacing: ".22em", textTransform: "uppercase", color: S.green, margin: "0 0 10px", fontWeight: 400 }}>Questions</h4>
                <p style={{ margin: "0 0 7px", fontFamily: S.disp, fontSize: 14, lineHeight: 1.6, color: S.body }}>
                  <a href="mailto:paddock20auto@gmail.com" style={{ color: S.green, textDecoration: "none" }}>paddock20auto@gmail.com</a>
                </p>
                <p style={{ margin: "0 0 7px", fontFamily: S.disp, fontSize: 14, lineHeight: 1.6, color: S.body }}>
                  <a href="https://instagram.com/PaddockGavin" target="_blank" rel="noopener noreferrer" style={{ color: S.green, textDecoration: "none" }}>@PaddockGavin</a> on Instagram
                </p>
                <p style={{ margin: 0, fontFamily: S.mono, fontSize: 13, color: S.mute }}>Tag a reset — #TheGlossGame</p>
              </R>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}
