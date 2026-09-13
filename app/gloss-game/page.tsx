"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { PageBackdrop } from "@/components/page-backdrop"
import { INSTAGRAM, PILLARS } from "@/lib/site-data"

const AMAZON_URL = "https://www.amazon.com/Gloss-Game-Detailing-Discipline-Display/dp/B0FMPGNTPY"
const KINDLE_URL = "https://www.amazon.com/dp/B0FMPH9ZK1"

const mono = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const arch = "Archivo,'Helvetica Neue',Helvetica,Arial,sans-serif"
const serif = "Newsreader,Georgia,'Times New Roman',serif"
const NOTCH = "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)"
const DETAILING = PILLARS.detailing.tone

const QUESTIONS = [
  ["Why do swirl marks come back after every wash?", "Because the wash is where they start. Chapters two and three code the whole thing, buckets, mitts, towels by panel, so nothing dirty touches clean paint twice."],
  ["What order do you detail a car in?", "Wheels first, paint last. Chapter four runs the wheel protocol to the Q-tip on the valve stems, and the loop above is the spine of the whole book."],
  ["Do you need a machine to get the gloss back?", "Sometimes. Chapter five, prep, correct, protect, is how to tell, before you spend a weekend or a dime you didn’t need to."],
  ["How do you detail a car interior?", "By touchpoint, not by scent. Chapter six works the cabin the way hands do: vents, stitching, the places fingers land, so it stays clean between washes."],
  ["Why do vents get coated?", "Vents sit in direct sun and they are the first plastic to go grey. Coated, the dirt washes off instead of soaking in, and the vent keeps cleaning easily for years rather than months."],
  ["How do you clean an engine bay under glass?", "Lift the glass first, so you are working on the bay and not through it. A safe all purpose cleaner with a little degreaser, then a pressure washer on a controlled stream rather than a jet, because a jet finds every connector you did not want it to find. Clean the glass last, since everything you rinse off the bay lands on it."],
  ["How do you organize detailing supplies?", "On hooks and shelves, bagged and labeled, one reach away. Time saved looking is time on the paint. Chapter two is the setup."],
]

const CHAPTERS = [
  ["01", "Before you buy anything", "The short list. What to skip."],
  ["02", "The setup", "Buckets, mitts, the pegboard."],
  ["03", "The wash", "Foam, the two-bucket method, drying."],
  ["04", "The wheels", "Protocol by zone, to the valve stems."],
  ["05", "Paint correction", "Prep, correct, protect."],
  ["06", "The interior", "By touchpoint, not by scent."],
  ["07", "Glass", "The panel that never reads the same way twice."],
  ["08", "Maintenance", "How to keep it between washes."],
  ["09", "The tools", "What earns a hook, what gets thrown out."],
  ["10", "The index", "Fifty-four products across eight zones."],
  ["11", "The seven-day reset", "The workbook. It wants a pen."],
  ["12", "The standard", "What all of this is actually for."],
]

/* Zone one of the Juice Box index, shown to everyone. The other seven zones go out by email as a PDF. */
const ZONE_1 = {
  zone: "Zone 1 · Wash",
  items: [
    { name: "AMMO Foam", link: "https://www.amazon.com/s?k=ammo+foam", note: "Pre-soak, every wash", price: "~$24", aff: true },
    { name: "Meguiar’s Gold Class Soap", link: "https://www.amazon.com/s?k=meguiars+gold+class", note: "Two-bucket method", price: "~$18", aff: true },
    { name: "Chemical Guys Maxi-Suds", link: "https://www.amazon.com/s?k=chemical+guys+maxi+suds", note: "High-lubricity rinse bucket", price: "~$14", aff: false },
    { name: "Griot’s Garage PFW Wash Mitt", link: "https://www.amazon.com/s?k=griot+garage+wash+mitt", note: "Wool. Replace when contaminated.", price: "~$22", aff: true },
    { name: "The Rag Company Eagle Edgeless 500", link: "https://www.amazon.com/s?k=rag+company+eagle+edgeless+500", note: "Drying towel. One per panel.", price: "~$8", aff: true },
  ],
}

const TIERS = [
  { tier: "Starter", price: "$150", desc: "Foam gun, soap, three towels, a mitt, Frothe.", note: "A first kit, or a car you are getting ready to sell" },
  { tier: "Builder", price: "$500", desc: "PF22.2, AMMO Foam, Boost, Reload, towels.", note: "Weekly use, a serious home garage" },
  { tier: "Pro", price: "$1,500+", desc: "Wall rack, BlowR Pro, four buckets, the Elixir stack, a tool cart.", note: "Client prep and delivery days" },
]

function Eyebrow({ children, tone = "#B4B6B2" }: { children: React.ReactNode; tone?: string }) {
  return (
    <p style={{ margin: "0 0 18px", display: "flex", alignItems: "center", gap: 12, fontFamily: mono, fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: tone }}>
      <i aria-hidden="true" style={{ width: 26, height: 3, background: tone, flex: "0 0 auto" }} />
      {children}
    </p>
  )
}

export default function GlossGamePage() {
  const [unlocked, setUnlocked] = useState(false)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")
  const [msg, setMsg] = useState("")

  useEffect(() => {
    try { if (localStorage.getItem("jbIndexUnlocked") === "1") setUnlocked(true) } catch {}
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === "sending") return
    setStatus("sending")
    try {
      const r = await fetch("/api/juicebox", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
      if (!r.ok) throw new Error()
      setStatus("done")
      setMsg("Check your inbox. The PDF is on its way.")
      try { localStorage.setItem("jbIndexUnlocked", "1") } catch {}
      setUnlocked(true)
    } catch {
      setStatus("error")
      setMsg("Something went wrong. DM @itspaddockgavin directly.")
    }
  }

  const primary: React.CSSProperties = { display: "inline-flex", alignItems: "center", fontFamily: arch, fontWeight: 800, fontSize: 15, letterSpacing: ".03em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 26px", clipPath: NOTCH, textDecoration: "none", border: 0, cursor: "pointer" }
  const section: React.CSSProperties = { padding: "clamp(48px,7vw,80px) 0", borderBottom: "1px solid #27384F" }
  const h2: React.CSSProperties = { margin: "0 0 22px", fontFamily: arch, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF" }
  const body: React.CSSProperties = { margin: "0 0 18px", fontSize: 19, lineHeight: 1.65, color: "#DDE3EB" }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Book", "name": "The Gloss Game",
        "author": { "@type": "Person", "name": "Gavin Brooks", "alternateName": "PaddockGavin" },
        "publisher": { "@type": "Organization", "name": "GoTime Motorsports" },
        "bookEdition": "First edition", "datePublished": "2025-08", "numberOfPages": 96,
        "inLanguage": "en", "bookFormat": "https://schema.org/Paperback",
        "isbn": "979-8298190060", "url": "https://paddockgavin.com/gloss-game",
        "sameAs": "https://www.amazon.com/dp/B0FMPGNTPY",
        "offers": { "@type": "Offer", "price": "19.99", "priceCurrency": "USD", "availability": "https://schema.org/InStock", "url": AMAZON_URL },
      }) }} />
      <div style={{ minHeight: "100vh", background: "#0A1523" }}>
        <SiteNav active="gloss" />
        <PageBackdrop src="/images/918-grey.webp" pos="center 50%" opacity={0.2} />

        <main style={{ minWidth: 0, maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

          <section style={{ padding: "clamp(44px,6vw,72px) 0 clamp(44px,6vw,66px)", borderBottom: "1px solid #27384F" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(28px,5vw,60px)", alignItems: "center" }}>
              <div style={{ flex: "1.2 1 min(480px,100%)", minWidth: "min(440px,100%)" }}>
                <Eyebrow tone={DETAILING}>Detailing &middot; The book by Gavin Brooks</Eyebrow>
                <h1 style={{ margin: "0 0 22px", fontFamily: arch, fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", maxWidth: "17ch" }}>
                  Most swirl marks<br /><span style={{ color: "#F2C94C" }}>come from the wash.</span>
                </h1>
                <p style={{ margin: 0, fontSize: "clamp(18px,2.2vw,21px)", lineHeight: 1.6, color: "#DDE3EB", maxWidth: "54ch" }}>
                  Not the road. The mitt, the bucket, the towel that did the wheels first. The Gloss Game is the order that stops it: what to buy, what touches the paint, and in what sequence, so the shine you build on Saturday is still there on Friday.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 28px", marginTop: 30, padding: "20px 24px", background: "#152538", border: "1px solid #27384F", borderLeft: "4px solid #F2C94C" }}>
                  {[["Paperback", "$19.99"], ["Inside", "12 chapters · 96 pages"], ["Edition", "First · August 2025"], ["Ships", "Prime · in stock"]].map(([k, v]) => (
                    <div key={k} style={{ fontFamily: mono, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "#B4B6B2" }}>{k}<b style={{ display: "block", color: "#FFFFFF", fontFamily: arch, fontSize: 19, fontWeight: 900, letterSpacing: "-.01em", marginTop: 3 }}>{v}</b></div>
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginTop: 30 }}>
                  <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" style={{ ...primary, fontSize: 16, padding: "16px 28px" }}>Get the paperback &middot; $19.99</a>
                  <a href={KINDLE_URL} target="_blank" rel="noopener noreferrer" style={{ ...primary, background: "transparent", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.3)" }}>Kindle &middot; $9.99</a>
                  <a href="#picks" style={{ fontFamily: mono, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#7FE8DC", textDecoration: "none" }}>Free product index &darr;</a>
                </div>
              </div>
              <figure style={{ margin: 0, flex: "0 1 clamp(230px,26vw,320px)", minWidth: "min(230px,100%)" }}>
                <div style={{ aspectRatio: "1025/1600", background: "#152538", border: "1px solid rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "center", filter: "drop-shadow(0 34px 40px rgba(0,0,0,.55))" }}>
                  <div style={{ textAlign: "center", padding: 24 }}>
                    <p style={{ margin: "0 0 8px", fontFamily: arch, fontWeight: 900, fontSize: 28, color: "#F2C94C", letterSpacing: "-.02em", textTransform: "uppercase" }}>The Gloss Game</p>
                    <p style={{ margin: 0, fontFamily: serif, fontStyle: "italic", fontSize: 14, color: "#B4B6B2" }}>Gavin Brooks</p>
                  </div>
                </div>
                <figcaption style={{ marginTop: 12, textAlign: "center", fontFamily: mono, fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", color: "#B4B6B2" }}>First edition &middot; August 2025</figcaption>
              </figure>
            </div>
          </section>

          <section style={section}>
            <div style={{ maxWidth: 760 }}>
              <Eyebrow tone={DETAILING}>Where it started</Eyebrow>
              <h2 style={h2}>Detailing is how I fell for cars</h2>
              <p style={body}>Before any of the rest, there was a bucket, a mitt and a car that deserved better. That is what made me fall for cars, and this book is where it ended up: the order I work in, written down so you can run it too.</p>
              <p style={{ ...body, margin: 0 }}>
                Two build logs show it on real cars:{" "}
                <Link href="/cars/e92" style={{ color: DETAILING, textDecoration: "none", borderBottom: `1px solid ${DETAILING}` }}>the E92 M3</Link> and{" "}
                <Link href="/cars/r8" style={{ color: DETAILING, textDecoration: "none", borderBottom: `1px solid ${DETAILING}` }}>the Audi R8 V10</Link>.
              </p>
            </div>
          </section>

          <section style={section}>
            <div style={{ maxWidth: 760 }}>
              <Eyebrow>The reason you&rsquo;re on this page</Eyebrow>
              <h2 style={h2}>The shelf is full.<br /><span style={{ color: "#F2C94C" }}>The shine still fades.</span></h2>
              <p style={body}>You know the moment. Sunday went to the whole car, and by Friday the hood looks like nobody was there. The swirls came back two washes after the correction.</p>
              <p style={body}>So you bought a better soap, then a plusher towel, then a coating, and the line in the door caught the sun anyway.</p>
              <p style={{ ...body, margin: 0 }}>The products were never the problem. The order was: which bucket, which mitt, what touches the paint after the wheels. The Gloss Game is that order.</p>
            </div>
          </section>

          <section style={section}>
            <div style={{ maxWidth: 760 }}>
              <Eyebrow>What the book teaches</Eyebrow>
              <h2 style={{ ...h2, marginBottom: 26 }}>How to detail a car, in order</h2>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, margin: "0 0 30px" }}>
                {["Rubber", "Barrels", "Faces"].map((w) => (
                  <span key={w}>
                    <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#152538", border: "1px solid #27384F", padding: "11px 18px" }}><b style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: arch, fontWeight: 900, fontSize: 16, color: "#FFFFFF", textTransform: "uppercase" }}>{w}</b></span>
                    <b style={{ color: "#00D2BE", fontFamily: mono, fontSize: 17, margin: "0 8px" }}>&rarr;</b>
                  </span>
                ))}
                <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#152538", border: "1px solid #F2C94C", padding: "11px 18px" }}><b style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: arch, fontWeight: 900, fontSize: 16, color: "#F2C94C", textTransform: "uppercase" }}>Paint</b></span>
              </div>
              {QUESTIONS.map(([q, a]) => (
                <div key={q} style={{ margin: "0 0 24px" }}>
                  <h3 style={{ margin: "0 0 8px", fontFamily: arch, fontWeight: 800, fontSize: 19, color: "#FFFFFF" }}>{q}</h3>
                  <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.62, color: "#C4CBD6" }}>{a}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={section}>
            <div style={{ position: "relative", overflow: "hidden", background: "#EDF1F6", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(30px,5vw,56px)" }}>
              <p style={{ margin: "0 0 10px", fontFamily: mono, fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: "#505C6A" }}>From the book &middot; Chapter 2</p>
              <blockquote style={{ margin: "0 0 18px", fontFamily: serif, fontStyle: "italic", fontSize: "clamp(20px,3vw,26px)", lineHeight: 1.52, color: "#0E1A2A", maxWidth: "56ch" }}>&ldquo;One bucket is for soap. One bucket is for rinsing the mitt. They are not interchangeable. The moment they become interchangeable is the moment you start washing in your own dirt.&rdquo;</blockquote>
              <p style={{ margin: 0, fontFamily: mono, fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#505C6A" }}>Chapter 2 &middot; The setup</p>
            </div>
          </section>

          <section style={section}>
            <Eyebrow tone="#00D2BE">The twelve chapters</Eyebrow>
            <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid rgba(255,255,255,.1)" }}>
              {CHAPTERS.map(([n, t, s]) => (
                <div key={n} style={{ flex: "1 1 min(240px,100%)", minWidth: "min(240px,100%)", background: "#0A1523", padding: "22px 20px 24px", boxShadow: "-1px 0 0 rgba(255,255,255,.1),0 -1px 0 rgba(255,255,255,.1)" }}>
                  <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#F2C94C" }}>{n}</span>
                  <p style={{ margin: "8px 0 4px", fontFamily: arch, fontWeight: 800, fontSize: 15.5, color: "#FFFFFF" }}>{t}</p>
                  <p style={{ margin: 0, fontFamily: serif, fontSize: 14, lineHeight: 1.5, color: "#B4B6B2" }}>{s}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: "clamp(20px,3vw,28px) 0 0", fontFamily: mono, fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase" }}>
              <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#F2C94C", borderBottom: "1px solid rgba(242,201,76,.45)", paddingBottom: 2, textDecoration: "none" }}>All twelve chapters &middot; $19.99 &rarr;</a>
            </p>
          </section>

          <section id="picks" style={{ ...section, scrollMarginTop: 90 }}>
            <div style={{ maxWidth: 760 }}>
              <Eyebrow tone="#00D2BE">Chapter ten, free &middot; The Juice Box&trade;</Eyebrow>
              <h2 style={h2}>The products that keep their place on the shelf</h2>
              <p style={body}>Not the best detailing products by vote. These are the ones that stayed within reach, wash after wash, on my own cars and the cars of friends and clients.</p>
              <p style={{ fontFamily: mono, fontSize: 12, lineHeight: 1.75, letterSpacing: ".02em", color: "#B4B6B2", borderLeft: "2px solid #00D2BE", padding: "2px 0 2px 16px", margin: "0 0 28px" }}>
                <b style={{ color: "#EDF1F6", fontWeight: 400 }}>A dot means the link pays a commission.</b> Nothing was added because it pays, and nothing was left off because it doesn&rsquo;t. The book was written before any of the links existed.
              </p>
            </div>

            <div style={{ background: "#0A1523", border: "1px solid rgba(255,255,255,.1)", padding: "26px 24px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#00D2BE" }}>{ZONE_1.zone}</span>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 11 }}>
                {ZONE_1.items.map((it) => (
                  <li key={it.name} style={{ fontSize: 14.5, lineHeight: 1.45, color: "#C4CBD6", paddingLeft: 15, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: 9, width: 6, height: 1, background: "#00D2BE", display: "block" }} />
                    <a href={it.link} target="_blank" rel="noopener noreferrer" style={{ color: "#EDF1F6", fontWeight: 500, textDecoration: "none" }}>{it.name}</a>
                    {it.aff && <sup style={{ color: "#00D2BE", fontSize: 10, letterSpacing: ".1em", marginLeft: 4 }}>&#9679;</sup>}
                    <span style={{ fontFamily: mono, fontSize: 11, color: "#B4B6B2", marginLeft: 7 }}>{it.price}</span>
                    <em style={{ fontStyle: "normal", display: "block", color: "#B4B6B2", fontSize: 12.5, marginTop: 2 }}>{it.note}</em>
                  </li>
                ))}
              </ul>
            </div>

            {unlocked ? (
              <p role="status" style={{ margin: "18px 0 0", fontFamily: mono, fontSize: 12.5, letterSpacing: ".06em", color: "#00D2BE" }}>
                {msg || "The full index is in your inbox. Every zone, every link checked."}
              </p>
            ) : (
              <div style={{ marginTop: 18, border: "1px solid rgba(0,210,190,.35)", background: "linear-gradient(150deg,rgba(0,210,190,.08),rgba(0,210,190,0))", clipPath: "polygon(0 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%)", padding: "clamp(24px,4vw,40px)" }}>
                <h3 style={{ margin: "0 0 10px", fontFamily: arch, fontWeight: 800, fontSize: "var(--t-h3)", lineHeight: 1.1, letterSpacing: "-.02em", color: "#FFFFFF" }}>The other seven zones, by email</h3>
                <p style={{ margin: "0 0 22px", fontSize: 16, lineHeight: 1.6, color: "#C4CBD6", maxWidth: "56ch" }}>One email with the whole index as a PDF: every zone, every link checked, paid links marked.</p>
                <form onSubmit={submit} style={{ maxWidth: 560 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    <label htmlFor="jb-email" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Email address</label>
                    <input
                      id="jb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com" required autoComplete="email"
                      style={{ flex: "1 1 220px", minWidth: 0, background: "rgba(6,14,24,.55)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,.22)", padding: "16px 18px", fontFamily: arch, fontSize: 16, clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" }}
                    />
                    <button type="submit" disabled={status === "sending"} style={primary}>
                      {status === "sending" ? "Sending…" : "Send me the index"}
                    </button>
                  </div>
                  <p style={{ margin: "12px 0 0", fontSize: 13.5, lineHeight: 1.55, color: "#B4B6B2", maxWidth: "46ch" }}>One email with the PDF. After that I write when I have something worth reading, and every email has a link to stop them.</p>
                  {msg && <p role="status" aria-live="polite" style={{ margin: "10px 0 0", fontFamily: mono, fontSize: 12.5, letterSpacing: ".06em", color: status === "error" ? "#F2C94C" : "#00D2BE" }}>{msg}</p>}
                </form>
              </div>
            )}

            <p style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".06em", color: "#B4B6B2", margin: "16px 0 0", display: "flex", alignItems: "baseline", gap: 9 }}>
              <span style={{ color: "#00D2BE", fontSize: 10 }}>&#9679;</span> Paid link: buying through it sends a commission my way, at no cost to you.
            </p>

            <div style={{ marginTop: "clamp(36px,5vw,56px)" }}>
              <Eyebrow tone="#00D2BE">Three ways to start</Eyebrow>
              <div style={{ display: "flex", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,.1)", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
                {TIERS.map(({ tier, price, desc, note }) => (
                  <div key={tier} style={{ flex: "1 1 min(260px,100%)", minWidth: "min(260px,100%)", background: "#0A1523", padding: "26px 24px 28px", display: "flex", flexDirection: "column", gap: 10, boxShadow: "-1px 0 0 rgba(255,255,255,.1),0 -1px 0 rgba(255,255,255,.1)" }}>
                    <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#00D2BE" }}>{tier}</span>
                    <p style={{ margin: 0, fontFamily: arch, fontWeight: 900, fontSize: "clamp(28px,4vw,38px)", color: "#FFFFFF", letterSpacing: "-.03em", lineHeight: 1 }}>{price}</p>
                    <p style={{ margin: 0, fontFamily: serif, fontSize: 15.5, lineHeight: 1.55, color: "#B4B6B2" }}>{desc}</p>
                    <p style={{ margin: "auto 0 0", paddingTop: 14, fontFamily: mono, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "#00D2BE" }}>{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ padding: "clamp(36px,5vw,56px) 0", display: "flex", flexWrap: "wrap", gap: "8px 24px" }}>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none" }}>Tag your shelf &middot; @itspaddockgavin</a>
            <a href="https://www.etsy.com/shop/GoTimeMotorsports" target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none" }}>The Etsy shelf</a>
            <Link href="/affiliates" style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none" }}>Brands I use</Link>
          </section>

        </main>
        <SiteFooter />
      </div>
    </>
  )
}
