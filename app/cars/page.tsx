"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

const CARS = [
  { n:"01", name:"1991 Honda Accord EX",          meta:"Black on tan",               note:"Dad\u2019s car. Saturday wax jobs came before anything else.", c:"#0B0D10", t:"#C8A878" },
  { n:"02", name:"1993 Honda Accord SE",           meta:"Gold on tan leather",         note:"Dad\u2019s last Accord. I drove it any chance I got, instead of my Mazda.", c:"#B39359", t:"#C8A878" },
  { n:"03", name:"1988 Mazda 323 Hatchback",       meta:"Baby blue on blue",          note:"First car of my own. First manual.", c:"#9CC3DE", t:"#3A5E80" },
  { n:"04", name:"1986 Honda Prelude",             meta:"Red on gray",                note:"My college girlfriend\u2019s car. It got us everywhere past 290,000 miles, and she later sold it to a friend for $40.", c:"#8A1C1C", t:"#6E7276" },
  { n:"05", name:"1997 Honda Civic DX",            meta:"Pine green on black",        note:"Manual, tons of fun.", c:"#1F4A38", t:"#14171C" },
  { n:"06", name:"1999 Honda Accord EX",           meta:"White on tan cloth",         note:"First one bought with my own money.", c:"#E9EBEA", t:"#C8A878" },
  { n:"07", name:"2002 Acura TL Type-S",           meta:"Black on black",             note:"First time paint depth and panel gaps mattered to me.", c:"#0B0D10", t:"#14171C" },
  { n:"08", name:"2005 Acura RL SH-AWD",           meta:"Black on black",             note:"The commute years, kept quiet and clean.", c:"#0B0D10", t:"#14171C" },
  { n:"09", name:"2005 Honda Accord LX",           meta:"Gray on gray",               note:"Nothing glamorous. Waxed like a flagship anyway.", c:"#8E9298", t:"#6E7276" },
  { n:"10", name:"2005 Toyota Tacoma TRD Off-Road",meta:"Gold on tan",                note:"First truck. Mud never got to hide sloppiness.", c:"#B39359", t:"#C8A878" },
  { n:"11", name:"2008 Nissan Frontier 4x4",       meta:"Silver on gray",             note:"The workhorse.", c:"#C6CBD0", t:"#6E7276" },
  { n:"12", name:"2010 Chevy Traverse LT3",        meta:"Burgundy on gray",           note:"Family miles. Big seats, big spills.", c:"#5E1F2A", t:"#6E7276" },
  { n:"13", name:"2011 Chevy Silverado 1500 6.2L", meta:"Silver on black",            note:"Crew cab, V8, and a lot of chrome to keep up with.", c:"#C6CBD0", t:"#14171C" },
  { n:"14", name:"2003 Honda S2000",               meta:"Silver on black",            note:"The only one I regret selling. The dog rode shotgun.",
    story:"The dream car, found in 2013 in Salt Lake City: a 2003 with 59,000 miles, bought under my wife\u2019s rule of no third car until we had a second house. Check engine light came on day two. I called the seller, and he asked where I worked. A few hours later a stranger walked into my office with a check for the repair. $1,600, good at his bank the same day. The repair got done. Still grateful to that man.", c:"#C6CBD0", t:"#14171C" },
  { n:"15", name:"2010 Lexus RX350 AWD",           meta:"Truffle Mica on tan",        note:"Winter drives and grocery runs at showroom standard.", c:"#4A3A30", t:"#C8A878" },
  { n:"16", name:"2011 Infiniti G37S Convertible", meta:"Black on black",             note:"Top down. Leather care became a schedule.", c:"#0B0D10", t:"#14171C" },
  { n:"17", name:"2009 BMW M3 E93 Convertible",    meta:"Black Sapphire on black",    note:"First M badge. 8,000 rpm with the roof away.",
    story:"The first M3, and the best car day of my life to that point. Black on black with the retractable hardtop, bought used in Georgia. Fully loaded, which meant headlight washers: a gasket that wept water after every wash. One more thing to watch on a car you pay attention to.", c:"#101722", t:"#14171C" },
  { n:"18", name:"2016 Toyota Tacoma TRD Off-Road Premium", meta:"White on black",    note:"A truck, paint-corrected and ceramic-coated anyway.", c:"#E9EBEA", t:"#14171C" },
  { n:"19", name:"2013 BMW M3 E92 Competition",    meta:"Still here",                 note:"Alpine White on black. The last naturally aspirated M3.", c:"#F2F4F3", t:"#14171C", href:"/cars/e92" },
  { n:"20", name:"2013 Chevy Silverado 2500 Duramax Z71", meta:"Gray on black",       note:"First diesel. Different dirt, same routine.", c:"#8E9298", t:"#14171C" },
  { n:"21", name:"2017 Lexus RX350 F-Sport Premium",meta:"White on black",            note:"Show-ready prep, even for Target runs.", c:"#E9EBEA", t:"#14171C" },
  { n:"22", name:"2015 BMW X5 M-Sport",            meta:"Mineral White on Dakota Brown", note:"Where BMW\u2019s soft paint got figured out.", c:"#E8EAE6", t:"#5C4033" },
  { n:"23", name:"2018 BMW M3 F80 Competition",    meta:"Alpine White on black",      note:"A lease takeover, kept right from mile one.",
    story:"Found this one on a lease swap: a guy in New York paying $3,000 toward his own payments for someone to take the keys, which brought the month to around $800. The car shipped south in the middle of the pandemic.", c:"#F2F4F3", t:"#14171C" },
  { n:"24", name:"2021 BMW M3 G80 Competition",    meta:"Brooklyn Gray on Kyalami Orange", note:"Zero miles at pickup. First shown at Tires \u0026 Timepieces.",
    story:"Fall of 2020, nobody was buying, and the dealership called a repeat customer with an offer. A thousand down instead of five held the build slot. Brooklyn Gray over Kyalami Orange, the 825M matte gray wheels, every package except the bucket seats. Delivery morning they opened the store an hour early for us.", c:"#7A8085", t:"#C75B12" },
  { n:"25", name:"2014 Audi R8 V10",              meta:"Panther Black on black",      note:"The first supercar.",
    story:"Started as a different car: a special-order G80 xDrive. I let the build slot go and paid $500 for a thirty-minute phone call. The honest answer: to live with a purpose-built car and learn what that was like. The shortlist was a 997.2 Turbo, an AMG GT, and the R8 V10. I went and drove one first.", c:"#0B0D10", t:"#14171C", href:"/cars/r8" },
  { n:"26", name:"2020 BMW 330i xDrive",           meta:"Black Sapphire on black",    note:"The daily, where coatings and wash intervals got tested.", c:"#101722", t:"#14171C" },
  { n:"27", name:"2011 Toyota Sienna",             meta:"Still here",                 note:"Black on gray leather. My girlfriend\u2019s, and the household commuter. An awesome driver.", c:"#0B0D10", t:"#6E7276" },
  { n:"28", name:"2016 Toyota Sequoia",            meta:"Still here",                 note:"Cream white on tan. My girlfriend\u2019s. I keep the maintenance, and I still love driving it.", c:"#EDE8D8", t:"#C8A878" },
  { n:"29", name:"2015 Chevy Express 2500",        meta:"Still here",                 note:"The mobile detailing van.", c:"", t:"" },
]

const TOTAL = 29
const filled = CARS.length
const current = CARS.filter(c => c.meta === "Still here").length
const range = `${CARS[0].name.split(" ")[0]}\u2013${CARS[CARS.length-1].name.split(" ")[0]}`

const mono = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const arch = "Archivo,Helvetica,Arial,sans-serif"

export default function CarsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0E1A2A" }}>
      <SiteNav active="cars" />

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", isolation: "isolate", display: "flex", flexDirection: "column", minHeight: "62svh" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image src="/images/cullinan-doors.webp" alt="One of the cars" fill style={{ objectFit: "cover" }} priority />
        </div>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: "linear-gradient(103deg,rgba(10,21,35,.92) 0%,rgba(10,21,35,.62) 44%,rgba(10,21,35,.06) 82%)" }} />
        <div style={{ position: "relative", zIndex: 3, flex: "1 1 auto", display: "flex", alignItems: "flex-end", padding: "clamp(20px,4vw,60px)" }}>
          <div className="pg-e1" style={{ width: "min(560px,100%)", background: "rgba(20,34,53,.56)", borderTop: "1px solid rgba(255,255,255,.26)", borderLeft: "2px solid #F2C94C", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", boxShadow: "0 34px 90px -24px rgba(0,0,0,.8)", padding: "clamp(24px,2.6vw,40px)" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, margin: "0 0 22px" }}>
              <span style={{ fontFamily: arch, fontWeight: 700, fontSize: "clamp(15px,1.05vw,19px)", letterSpacing: ".16em", textTransform: "uppercase", color: "#EDF1F6", flex: "0 0 auto" }}>The register</span>
              <i style={{ flex: "1 1 auto", height: 5, background: "repeating-linear-gradient(90deg,rgba(255,255,255,.26) 0 1px,transparent 1px 6px)" }} />
              <span style={{ fontFamily: arch, fontWeight: 600, fontSize: "clamp(13.5px,.85vw,16px)", letterSpacing: ".15em", textTransform: "uppercase", color: "#B8C1CD", flex: "0 0 auto" }}>Personal</span>
            </div>
            <h1 style={{ margin: "0 0 18px" }}>
              <span style={{ display: "block", fontFamily: arch, fontWeight: 800, fontSize: "clamp(31px,3.2vw,48px)", lineHeight: 1, letterSpacing: "-.024em", textTransform: "uppercase", color: "#fff" }}>The cars that</span>
              <span style={{ display: "block", fontFamily: arch, fontWeight: 400, fontSize: "clamp(30px,3.1vw,46px)", lineHeight: 1.1, letterSpacing: "-.02em", color: "#F2C94C" }}>have been mine.</span>
            </h1>
            <p style={{ margin: "0 0 24px", fontSize: 18, lineHeight: 1.6, color: "#B9C2CE" }}>Not inventory, not a dealer lot. These are the ones I bought, ran, argued with and sold on. Sales bonuses and side hustles paid for every one of them, and they were bought to experience, not to show off.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(16px,2vw,30px)" }}>
              {[["Owned", TOTAL], ["Logged", filled], ["Still here", current]].map(([k, v]) => (
                <span key={String(k)} style={{ fontFamily: arch, fontWeight: 600, fontSize: 14, letterSpacing: ".13em", textTransform: "uppercase", color: "#9BA5B3" }}>{k} <b style={{ fontFamily: arch, fontWeight: 700, color: "#fff", marginLeft: 6, fontVariantNumeric: "tabular-nums" }}>{v}</b></span>
              ))}
            </div>
          </div>
        </div>
        <p className="pg-e0" style={{ position: "relative", zIndex: 4, margin: 0, background: "rgba(8,17,29,.9)", borderTop: "1px solid rgba(255,255,255,.14)", padding: "clamp(10px,1.6vh,18px) clamp(14px,3vw,30px) clamp(12px,2vh,22px)", fontFamily: arch, fontWeight: 600, fontSize: 14.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#DFE5ED" }}>Mine. Nothing on this page belongs to <span style={{ textTransform: "none" }}>duPont</span> REGISTRY</p>
      </section>

      {/* Register table */}
      <section style={{ background: "#0A1523", padding: "clamp(50px,7vw,100px) clamp(14px,4vw,64px)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, borderTop: "1px solid rgba(255,255,255,.14)", padding: "13px 0 0", margin: "0 0 clamp(26px,3.4vw,44px)" }}>
          <span style={{ fontFamily: arch, fontWeight: 700, fontSize: "clamp(15px,1.05vw,19px)", letterSpacing: ".16em", textTransform: "uppercase", color: "#EDF1F6", flex: "0 0 auto" }}>The register</span>
          <i style={{ flex: "1 1 auto", height: 5, background: "repeating-linear-gradient(90deg,rgba(255,255,255,.2) 0 1px,transparent 1px 6px)" }} />
          <span style={{ fontFamily: arch, fontWeight: 600, fontSize: "clamp(13.5px,.85vw,16px)", letterSpacing: ".15em", textTransform: "uppercase", color: "#B8C1CD", flex: "0 0 auto" }}>{range}</span>
        </div>
        <div style={{ border: "1px solid rgba(255,255,255,.14)", background: "#0E1A2A" }}>
          {CARS.map((c) => (
            <RegisterRow key={c.n} car={c} />
          ))}
        </div>
        <p style={{ margin: "clamp(18px,2.2vw,26px) 0 0", fontSize: 17, lineHeight: 1.6, color: "#9BA5B3", maxWidth: "60ch" }}>The list is still growing. Every car got the same Saturday treatment, regardless of what it cost.</p>
      </section>

      {/* Photo grid */}
      <section style={{ background: "#0E1A2A", padding: "clamp(46px,6vw,90px) clamp(14px,4vw,64px)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, borderTop: "1px solid rgba(255,255,255,.14)", padding: "13px 0 0", margin: "0 0 clamp(22px,2.8vw,36px)" }}>
          <span style={{ fontFamily: arch, fontWeight: 700, fontSize: "clamp(15px,1.05vw,19px)", letterSpacing: ".16em", textTransform: "uppercase", color: "#EDF1F6", flex: "0 0 auto" }}>The ones I have shots of</span>
          <i style={{ flex: "1 1 auto", height: 5, background: "repeating-linear-gradient(90deg,rgba(255,255,255,.2) 0 1px,transparent 1px 6px)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(210px,45%),1fr))", gap: 8 }}>
          {[
            { src: "/images/e92-front.jpg",        alt: "E92 M3 front" },
            { src: "/images/e92-side.jpg",         alt: "E92 M3 side" },
            { src: "/images/e92-wheels-three.jpg", alt: "E92 M3 wheels" },
            { src: "/images/r8-garage.webp",       alt: "R8 in the garage" },
            { src: "/images/r8-dog-walk.webp",     alt: "R8 on a dog walk" },
            { src: "",                             alt: "" },
          ].map((s, i) => s.src ? (
            <figure key={i} style={{ margin: 0, position: "relative", background: "#0A1523", border: "1px solid rgba(255,255,255,.1)", overflow: "hidden", aspectRatio: "4/3" }}>
              <Image src={s.src} alt={s.alt} fill style={{ objectFit: "cover" }} loading="lazy" />
            </figure>
          ) : (
            <figure key={i} style={{ margin: 0, background: "#0A1523", border: "1px solid rgba(255,255,255,.1)", aspectRatio: "4/3" }} />
          ))}
        </div>
      </section>

      {/* Looking for one */}
      <section style={{ background: "#0A1523", padding: "clamp(44px,6vw,88px) clamp(14px,4vw,64px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: "clamp(24px,3vw,52px)", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: "0 0 16px" }}>
              <span style={{ display: "block", fontFamily: arch, fontWeight: 800, fontSize: "clamp(29px,2.5vw,39px)", lineHeight: 1.02, letterSpacing: "-.024em", textTransform: "uppercase", color: "#fff" }}>Looking for one</span>
              <span style={{ display: "block", fontFamily: arch, fontWeight: 400, fontSize: "clamp(28px,2.4vw,37px)", lineHeight: 1.14, letterSpacing: "-.02em", color: "#F2C94C" }}>like these?</span>
            </h2>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6, color: "#B9C2CE", maxWidth: "52ch" }}>We source through duPont REGISTRY. Tell me the spec and the budget &mdash; 78 found so far, most of them before they were listed.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/intake" style={{ display: "inline-flex", alignItems: "center", fontFamily: arch, fontWeight: 700, fontSize: 14, letterSpacing: ".12em", textTransform: "uppercase", background: "#F2C94C", color: "#0E1A2A", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)", textDecoration: "none" }}>Send me a spec</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

function RegisterRow({ car }: { car: typeof CARS[0] }) {
  const hasStory = !!car.story
  const [open, setOpen] = useState(false)
  const hasPaint = !!car.c

  return (
    <div
      onClick={() => hasStory && setOpen(o => !o)}
      style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "0 clamp(12px,1.6vw,20px)", alignItems: "baseline", borderBottom: "1px solid rgba(255,255,255,.09)", padding: "13px clamp(13px,1.6vw,22px)", cursor: hasStory ? "pointer" : "default", transition: "background .16s" }}
    >
      <span style={{ fontFamily: mono, fontSize: 14, letterSpacing: ".12em", color: hasPaint ? "#00D2BE" : "#848482", fontVariantNumeric: "tabular-nums" }}>{car.n}</span>
      <span style={{ display: "flex", alignItems: "baseline", gap: 9, minWidth: 0 }}>
        {car.href ? (
          <Link href={car.href} onClick={e => e.stopPropagation()} style={{ fontFamily: arch, fontWeight: 700, fontSize: 16.5, letterSpacing: ".02em", textTransform: "uppercase", color: "#F2C94C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: "none" }}>{car.name}</Link>
        ) : (
          <span style={{ fontFamily: arch, fontWeight: 700, fontSize: 16.5, letterSpacing: ".02em", textTransform: "uppercase", color: hasPaint ? "#EDF1F6" : "#B4B6B2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{car.name}</span>
        )}
        <i style={{ flex: "1 1 auto", height: 0, borderBottom: "1px dotted rgba(255,255,255,.2)", transform: "translateY(-4px)" }} />
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: arch, fontWeight: 600, fontSize: 14, letterSpacing: ".12em", textTransform: "uppercase", color: "#848482", whiteSpace: "nowrap" }}>
        {hasPaint && (
          <span style={{ display: "inline-flex", gap: 3 }}>
            <i style={{ width: 12, height: 12, background: car.c, border: "1px solid rgba(255,255,255,.2)" }} />
            <i style={{ width: 12, height: 12, background: car.t, border: "1px solid rgba(255,255,255,.2)" }} />
          </span>
        )}
        {car.meta}
      </span>
      <span style={{ gridColumn: "2/4", fontSize: 15, lineHeight: 1.5, color: "#8E99A8", maxWidth: "70ch" }}>{car.note}</span>
      {hasStory && <span style={{ gridColumn: "2/4", fontFamily: mono, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#00D2BE", paddingTop: 4 }}>{open ? "Close story" : "Read the story \u2192"}</span>}
      {open && <div style={{ display: "block", gridColumn: "1/4", margin: "12px 0 6px", padding: "16px 18px", background: "rgba(0,210,190,.05)", borderLeft: "2px solid #00D2BE", fontSize: 16, lineHeight: 1.68, color: "#B9C2CE", maxWidth: "75ch" }}>{car.story}</div>}
    </div>
  )
}
