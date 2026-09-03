"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

const AMAZON_URL = "https://www.amazon.com/Gloss-Game-Detailing-Discipline-Display/dp/B0FMPGNTPY"
const KINDLE_URL = "https://www.amazon.com/dp/B0FMPH9ZK1"

const mono = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const arch = "Archivo,'Helvetica Neue',Helvetica,Arial,sans-serif"
const serif = "Newsreader,Georgia,'Times New Roman',serif"

function fmt(d: Date) {
  return d.toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" }).replace(/\s/g, "\u2009")
}
function isDay(d: Date) {
  const h = Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", hour12: false }).format(d))
  return h >= 8 && h < 18
}

export default function GlossGamePage() {
  const [time, setTime] = useState("")
  const [day, setDay] = useState(true)

  useEffect(() => {
    const tick = () => { const n = new Date(); setTime(fmt(n)); setDay(isDay(n)) }
    tick()
    const t = setInterval(tick, 20000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context":"https://schema.org","@type":"Book","name":"The Gloss Game",
        "author":{"@type":"Person","name":"Gavin Brooks","alternateName":"PaddockGavin"},
        "publisher":{"@type":"Organization","name":"GoTime Motorsports"},
        "bookEdition":"First edition","datePublished":"2025-08","numberOfPages":96,
        "inLanguage":"en","bookFormat":"https://schema.org/Paperback",
        "isbn":"979-8298190060","url":"https://paddockgavin.com/gloss-game",
        "sameAs":"https://www.amazon.com/dp/B0FMPGNTPY",
        "offers":{"@type":"Offer","price":"19.99","priceCurrency":"USD","availability":"https://schema.org/InStock","url":AMAZON_URL}
      }) }} />
      <div style={{ minHeight: "100vh", background: "#0A1523" }}>
        <SiteNav active="gloss" />

        {/* Telemetry bar */}
        <div style={{ borderBottom: "1px solid #27384F", background: "#0E1A2A" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", padding: "13px clamp(20px,5vw,40px)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 12, fontFamily: mono, fontSize: 12.5, letterSpacing: ".24em", textTransform: "uppercase", color: "#EDF1F6" }}>
              <i aria-hidden="true" style={{ width: 34, height: 4, background: "#F2C94C", flex: "0 0 auto" }} />
              {day ? "Day shift" : "Night shift"} &middot; {time} Nashville
            </span>
            <i aria-hidden="true" style={{ flex: "1 1 auto", height: 1, background: "#27384F", minWidth: 40 }} />
            <span style={{ fontFamily: mono, fontSize: 12.5, letterSpacing: ".24em", textTransform: "uppercase", color: "#B4B6B2" }}>Book one &middot; The Gloss Game™</span>
          </div>
        </div>

        <main style={{ minWidth: 0, maxWidth: 1000, margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>

          {/* Hero */}
          <section style={{ padding: "clamp(50px,7vw,78px) 0 clamp(44px,6vw,66px)", borderBottom: "1px solid #27384F" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(28px,5vw,60px)", alignItems: "center" }}>
              <div style={{ flex: "1.2 1 min(480px,100%)", minWidth: "min(440px,100%)" }}>
                <p style={{ margin: "0 0 18px", fontFamily: mono, fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#B4B6B2" }}>The car detailing book &middot; by Gavin Brooks</p>
                <h1 style={{ margin: "0 0 22px", fontFamily: arch, fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", maxWidth: "17ch" }}>
                  Most swirl marks<br /><span style={{ color: "#F2C94C" }}>come from the wash.</span>
                </h1>
                <p style={{ margin: 0, fontSize: "clamp(18px,2.2vw,21px)", lineHeight: 1.6, color: "#DDE3EB", maxWidth: "54ch" }}>Not the road. The mitt, the bucket, the towel that did the wheels first. The Gloss Game is the order that stops it &mdash; what to buy, what touches the paint, and in what sequence, so the shine you build on Saturday is still there on Friday.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 28px", marginTop: 30, padding: "20px 24px", background: "#152538", border: "1px solid #27384F", borderLeft: "4px solid #F2C94C" }}>
                  {[["Paperback","$19.99"],["Inside","12 chapters \u00b7 96 pages"],["Edition","First \u00b7 August 2025"],["Ships","Prime \u00b7 in stock"]].map(([k,v]) => (
                    <div key={String(k)} style={{ fontFamily: mono, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "#B4B6B2" }}>{k}<b style={{ display: "block", color: "#FFFFFF", fontFamily: arch, fontSize: 19, fontWeight: 900, letterSpacing: "-.01em", marginTop: 3 }}>{v}</b></div>
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginTop: 30 }}>
                  <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", fontFamily: arch, fontWeight: 800, fontSize: 16, letterSpacing: ".03em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "16px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>Get the paperback &middot; $19.99</a>
                  <a href={KINDLE_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", fontFamily: arch, fontWeight: 800, fontSize: 15, letterSpacing: ".03em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.3)", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>Kindle &middot; $9.99</a>
                  <span style={{ fontSize: 14, color: "#B4B6B2" }}>The back half is a workbook. It wants a pen.</span>
                </div>
              </div>
              <figure style={{ margin: 0, flex: "0 1 clamp(230px,26vw,320px)", minWidth: "min(230px,100%)" }}>
                <div style={{ aspectRatio: "1025/1600", background: "#0E1A2A", border: "1px solid rgba(255,255,255,.14)", overflow: "hidden", filter: "drop-shadow(0 34px 40px rgba(0,0,0,.55))" }}>
                  <div style={{ width: "100%", height: "100%", background: "#152538", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ textAlign: "center", padding: 24 }}>
                      <p style={{ margin: "0 0 8px", fontFamily: arch, fontWeight: 900, fontSize: 28, color: "#F2C94C", letterSpacing: "-.02em", textTransform: "uppercase" }}>The Gloss Game</p>
                      <p style={{ margin: 0, fontFamily: serif, fontStyle: "italic", fontSize: 14, color: "#B4B6B2" }}>Gavin Brooks</p>
                    </div>
                  </div>
                </div>
                <figcaption style={{ marginTop: 12, textAlign: "center", fontFamily: mono, fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", color: "#B4B6B2" }}>First edition &middot; August 2025</figcaption>
              </figure>
            </div>
          </section>

          {/* The reason */}
          <section style={{ padding: "clamp(48px,7vw,80px) 0", borderBottom: "1px solid #27384F" }}>
            <div style={{ maxWidth: 760 }}>
              <p style={{ margin: "0 0 18px", fontFamily: mono, fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#B4B6B2" }}>The reason you&rsquo;re on this page</p>
              <h2 style={{ margin: "0 0 22px", fontFamily: arch, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF" }}>The shelf is full.<br /><span style={{ color: "#F2C94C" }}>The shine still fades.</span></h2>
              <p style={{ margin: "0 0 18px", fontSize: 19, lineHeight: 1.65, color: "#DDE3EB" }}>You know the moment. Sunday went to the whole car, and by Friday the hood looks like nobody was there. The swirls came back two washes after the correction. The bottle that promised depth left streaks you can read in the garage light.</p>
              <p style={{ margin: "0 0 18px", fontSize: 19, lineHeight: 1.65, color: "#DDE3EB" }}>So you bought a better soap. Then a plusher towel. Then a coating. The line in the door caught the sun anyway.</p>
              <p style={{ margin: 0, fontSize: 19, lineHeight: 1.65, color: "#DDE3EB" }}>The products were never the problem. The order was &mdash; which bucket, which mitt, what touches the paint after the wheels. The Gloss Game is that order, written down so you can run it.</p>
            </div>
          </section>

          {/* The order */}
          <section style={{ padding: "clamp(48px,7vw,80px) 0", borderBottom: "1px solid #27384F" }}>
            <div style={{ maxWidth: 760 }}>
              <p style={{ margin: "0 0 18px", fontFamily: mono, fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#B4B6B2" }}>What the book teaches</p>
              <h2 style={{ margin: "0 0 26px", fontFamily: arch, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF" }}>How to detail a car, in order</h2>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, margin: "0 0 30px" }}>
                {["Rubber","Barrels","Faces"].map((w,i) => (
                  <span key={w}>
                    <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#152538", border: "1px solid #27384F", padding: "11px 18px" }}><b style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: arch, fontWeight: 900, fontSize: 16, color: "#FFFFFF", textTransform: "uppercase" }}>{w}</b></span>
                    <b style={{ color: "#00D2BE", fontFamily: mono, fontSize: 17, margin: "0 8px" }}>&rarr;</b>
                  </span>
                ))}
                <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#152538", border: "1px solid #F2C94C", padding: "11px 18px" }}><b style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: arch, fontWeight: 900, fontSize: 16, color: "#F2C94C", textTransform: "uppercase" }}>Paint</b></span>
              </div>
              {[
                ["Why do swirl marks come back after every wash?","Because the wash is where they start. Chapters two and three code the whole thing \u2014 buckets, mitts, towels by panel \u2014 so nothing dirty touches clean paint twice."],
                ["What order do you detail a car in?","Wheels first, paint last. Chapter four runs the wheel protocol to the Q-tip on the valve stems, and the loop above is the spine of the whole book."],
                ["Do you need a machine to get the gloss back?","Sometimes. Chapter five \u2014 prep, correct, protect \u2014 is how to tell, before you spend a weekend or a dime you didn\u2019t need to."],
                ["How do you detail a car interior?","By touchpoint, not by scent. Chapter six works the cabin the way hands do \u2014 vents, stitching, the places fingers land \u2014 so it stays clean between Saturdays."],
                ["How do you organize detailing supplies?","On hooks and shelves, bagged and labeled, one reach away \u2014 time saved looking is time on the paint. Chapter two is the setup."],
              ].map(([q,a]) => (
                <div key={String(q)} style={{ margin: "0 0 24px" }}>
                  <h3 style={{ margin: "0 0 8px", fontFamily: arch, fontWeight: 800, fontSize: 19, color: "#FFFFFF" }}>{q}</h3>
                  <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.62, color: "#C4CBD6" }}>{a}</p>
                </div>
              ))}
              <p style={{ margin: "clamp(20px,3vw,28px) 0 0", fontFamily: mono, fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase" }}>
                <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#F2C94C", borderBottom: "1px solid rgba(242,201,76,.45)", paddingBottom: 2 }}>The whole order is $19.99 &rarr;</a>
              </p>
            </div>
          </section>

          {/* Chapter excerpt */}
          <section style={{ padding: "clamp(48px,7vw,80px) 0", borderBottom: "1px solid #27384F" }}>
            <div style={{ position: "relative", overflow: "hidden", background: "#EDF1F6", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(30px,5vw,56px)" }}>
              <span aria-hidden="true" style={{ position: "absolute", right: 18, top: 8, fontFamily: arch, fontWeight: 900, fontSize: 120, lineHeight: 1, letterSpacing: "-.04em", color: "transparent", WebkitTextStroke: "2px rgba(14,26,42,.12)", pointerEvents: "none" }}>02</span>
              <p style={{ margin: "0 0 10px", fontFamily: mono, fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: "#505C6A" }}>From the book &middot; Chapter 2</p>
              <blockquote style={{ margin: "0 0 18px", fontFamily: serif, fontStyle: "italic", fontSize: "clamp(20px,3vw,26px)", lineHeight: 1.52, color: "#0E1A2A", maxWidth: "56ch" }}>&ldquo;One bucket is for soap. One bucket is for rinsing the mitt. They are not interchangeable. The moment they become interchangeable is the moment you start washing in your own dirt.&rdquo;</blockquote>
              <p style={{ margin: 0, fontFamily: mono, fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#505C6A" }}>Chapter 2 &middot; The setup</p>
            </div>
          </section>

          {/* TOC */}
          <section style={{ padding: "clamp(48px,7vw,80px) 0", borderBottom: "1px solid #27384F" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 15, margin: "0 0 30px" }}>
              <i style={{ fontStyle: "normal", width: 26, height: 3, background: "#00D2BE", flex: "0 0 auto" }} />
              <span style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".22em", textTransform: "uppercase", color: "#EDF1F6", whiteSpace: "nowrap" }}>The twelve chapters</span>
              <u style={{ flex: "1 1 auto", height: 1, background: "rgba(255,255,255,.12)", textDecoration: "none" }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid rgba(255,255,255,.1)" }}>
              {[
                ["01","Before you buy anything","The short list. What to skip."],
                ["02","The setup","Buckets, mitts, the pegboard."],
                ["03","The wash","Foam, the two-bucket method, drying."],
                ["04","The wheels","Protocol by zone, to the valve stems."],
                ["05","Paint correction","Prep, correct, protect."],
                ["06","The interior","By touchpoint, not by scent."],
                ["07","Glass","The panel that never reads the same way twice."],
                ["08","Maintenance","How to keep it between Saturdays."],
                ["09","The tools","What earns a hook, what gets thrown out."],
                ["10","The index","Fifty-four products across eight zones."],
                ["11","The seven-day reset","The workbook. It wants a pen."],
                ["12","The standard","What all of this is actually for."],
              ].map(([n,t,s]) => (
                <div key={n} style={{ flex: "1 1 min(240px,100%)", minWidth: "min(240px,100%)", background: "#0A1523", padding: "22px 20px 24px", boxShadow: "-1px 0 0 rgba(255,255,255,.1),0 -1px 0 rgba(255,255,255,.1)" }}>
                  <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#F2C94C" }}>{n}</span>
                  <p style={{ margin: "8px 0 4px", fontFamily: arch, fontWeight: 800, fontSize: 15.5, color: "#FFFFFF" }}>{t}</p>
                  <p style={{ margin: 0, fontFamily: serif, fontSize: 14, lineHeight: 1.5, color: "#B4B6B2" }}>{s}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: "clamp(20px,3vw,28px) 0 0", fontFamily: mono, fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase" }}>
              <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#F2C94C", borderBottom: "1px solid rgba(242,201,76,.45)", paddingBottom: 2 }}>All twelve chapters &middot; $19.99 &rarr;</a>
            </p>
          </section>

          {/* Juice Box CTA */}
          <section style={{ padding: "clamp(48px,7vw,80px) 0" }}>
            <div style={{ border: "1px solid #0A6BAA", background: "linear-gradient(150deg,rgba(0,81,133,.94),rgba(0,81,133,.55))", boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(26px,4.4vw,48px)", display: "flex", flexWrap: "wrap", gap: "clamp(24px,4vw,44px)", alignItems: "center" }}>
              <div style={{ flex: "1 1 min(320px,100%)" }}>
                <h2 style={{ margin: "0 0 12px", fontFamily: arch, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF" }}>Chapter ten is free</h2>
                <p style={{ margin: "0 0 22px", fontSize: 16, lineHeight: 1.64, color: "#DCE8F2", maxWidth: "50ch" }}>The full product index &mdash; every zone, every link checked, the paid ones marked &mdash; free with your email. The reasoning behind each product is in the other eleven chapters.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
                  <Link href="/juice-box" style={{ display: "inline-flex", alignItems: "center", fontFamily: arch, fontWeight: 800, fontSize: 15, letterSpacing: ".03em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>Get the index &rarr;</Link>
                  <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", color: "#7FE8DC", textDecoration: "none" }}>Full book &middot; $19.99 &rarr;</a>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "clamp(24px,4vw,36px)", display: "flex", flexWrap: "wrap", gap: "8px 24px" }}>
              <a href="https://instagram.com/itspaddockgavin" target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none" }}>Tag your shelf &middot; @itspaddockgavin</a>
              <span style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", color: "#00D2BE" }}>GoTime Motorsports</span>
              <a href="https://www.etsy.com/shop/GoTimeMotorsports" target="_blank" rel="noopener noreferrer" style={{ fontFamily: mono, fontSize: 11.5, letterSpacing: ".17em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none" }}>The Etsy shelf</a>
            </div>
          </section>

        </main>
        <SiteFooter />
      </div>
    </>
  )
}
