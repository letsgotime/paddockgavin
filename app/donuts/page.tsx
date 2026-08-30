"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

type Status = "idle" | "sending" | "sent" | "error"

function lastSaturdayOf(year: number, month: number): Date {
  const d = new Date(year, month + 1, 0)
  d.setDate(d.getDate() - ((d.getDay() + 1) % 7))
  return d
}

function nextDonutsDate(): Date {
  const now = new Date()
  let d = lastSaturdayOf(now.getFullYear(), now.getMonth())
  const cutoff = new Date(d); cutoff.setHours(11, 0, 0, 0)
  if (now > cutoff) d = lastSaturdayOf(now.getFullYear(), now.getMonth() + 1)
  return d
}

export default function DonutsPage() {
  const d = nextDonutsDate()
  const nextDate = "Sat " + d.toLocaleDateString("en-US", { month: "short", day: "numeric" })

  const [form, setForm] = useState({ name: "", reach: "", date: "", message: "" })
  const [status, setStatus] = useState<Status>("idle")

  const update = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.name.trim() || !form.reach.trim() || status === "sending") return
    setStatus("sending")
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "donuts-vendor", ...form, page: "donuts" }),
      })
      setStatus(res.ok ? "sent" : "error")
    } catch {
      setStatus("error")
    }
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(10,21,35,.55)",
    border: "1px solid rgba(255,255,255,.24)",
    color: "#EDF1F6",
    fontFamily: "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: 16,
    padding: "13px 15px",
    clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
    width: "100%",
    boxSizing: "border-box" as const,
    outline: "none",
  }

  const MOSAIC = [
    { src: "/images/donuts-tall.webp",   alt: "The crowd between the cars",  caption: "The floor, mid-morning" },
    { src: "/images/donuts-z06.webp",    alt: "Z06 out front",               caption: "Bring whatever you drive" },
    { src: "/images/donuts-square.webp", alt: "Donuts on the table",         caption: "The name is literal" },
    { src: "/images/donuts-floor.webp",  alt: "The room set for the morning",caption: "The room, set for it" },
  ]

  return (
    <>
      <SiteNav active="donuts" />

      {/* Fixed background */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", background: "#0A1523" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.22 }}>
          <Image src="/images/donuts-lot.webp" alt="" fill style={{ objectFit: "cover" }} priority />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(1100px 720px at 82% -6%,rgba(242,201,76,.15),transparent 60%),radial-gradient(1000px 700px at 4% 30%,rgba(0,81,133,.42),transparent 62%),linear-gradient(180deg,rgba(10,21,35,.86),rgba(10,21,35,.95))" }} />
      </div>

      <main style={{ position: "relative", zIndex: 1, minWidth: 0, maxWidth: 1180, margin: "0 auto", padding: "clamp(14px,2.4vw,22px) clamp(12px,4vw,40px) clamp(40px,7vw,84px)", display: "flex", flexDirection: "column", gap: "clamp(14px,2.4vw,22px)" }}>

        {/* Hero */}
        <section style={{ position: "relative", minHeight: "clamp(400px,58vh,580px)", border: "1px solid rgba(242,201,76,.3)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
          <Image src="/images/donuts-inside.webp" alt="Inside the floor on a Donuts morning" fill style={{ objectFit: "cover", objectPosition: "center 62%" }} priority />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.95) 8%,rgba(10,21,35,.4) 52%,rgba(10,21,35,.3) 100%)" }} />
          <div style={{ position: "relative", padding: "clamp(22px,3.6vw,42px)", display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>
            <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#F2C94C", padding: "6px 16px", alignSelf: "flex-start" }}>
              <span style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#101010" }}>Free &middot; last Saturday monthly &middot; 8&ndash;11 am</span>
            </span>
            <h1 style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(34px,6vw,66px)", lineHeight: 1.02, letterSpacing: "-.028em", textTransform: "uppercase", color: "#FFFFFF" }}>
              Donuts with <span style={{ textTransform: "none" }}>duPont</span><br />
              <span style={{ background: "#F2C94C", color: "#101010", padding: "1px 14px", fontSize: "0.6em" }}>oh, we have coffee too</span>
            </h1>
            <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "clamp(17px,1.8vw,19px)", lineHeight: 1.56, color: "#EDF1F6", maxWidth: "54ch", textShadow: "0 1px 10px rgba(10,21,35,.85)" }}>
              Come join us and see the new models &mdash; whatever rolled onto duPont REGISTRY&rsquo;s floor this month. Bring whatever you drive. I run it, and I&rsquo;ll be at the door.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="https://instagram.com/itspaddockgavin" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>
                The next date drops here
              </a>
              <Link href="/events" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.4)", background: "rgba(10,21,35,.36)", backdropFilter: "blur(8px)", padding: "15px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>
                All events
              </Link>
            </div>
          </div>
        </section>

        {/* Details board */}
        <section style={{ background: "linear-gradient(150deg,rgba(255,255,255,.065),rgba(255,255,255,.013))", backdropFilter: "blur(22px) saturate(155%)", WebkitBackdropFilter: "blur(22px) saturate(155%)", border: "1px solid rgba(255,255,255,.11)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.13)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(18px,2.6vw,26px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(150px,45%),1fr))", gap: 16 }}>
          {[
            { k: "When",      v: "8\u201311 am",            tone: "#00D2BE" },
            { k: "Where",     v: "duPont REGISTRY, Lebanon", tone: "#00D2BE" },
            { k: "Cost",      v: "Free",                     tone: "#00D2BE" },
            { k: "Next date", v: nextDate,                   tone: "#F2C94C" },
          ].map(row => (
            <span key={row.k} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F" }}>{row.k}</span>
              <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 15, letterSpacing: ".08em", textTransform: "uppercase", color: row.tone }}>{row.v}</span>
            </span>
          ))}
        </section>

        <p style={{ margin: 0, fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12.5, letterSpacing: ".14em", lineHeight: 1.6, textTransform: "uppercase", color: "#91918F" }}>
          Dates post on the <Link href="/events" style={{ color: "#00D2BE" }}>events page</Link>, <a href="https://instagram.com/dupontregistrylive" target="_blank" rel="noopener noreferrer" style={{ color: "#00D2BE" }}>@duPontREGISTRYLIVE</a> and <a href="https://instagram.com/itspaddockgavin" target="_blank" rel="noopener noreferrer" style={{ color: "#00D2BE" }}>@itspaddockgavin</a>
        </p>

        {/* Morning mosaic */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: "clamp(12px,1.8vw,18px)" }}>
          {MOSAIC.map((img) => (
            <figure key={img.src} style={{ margin: 0, position: "relative", aspectRatio: "3/4", overflow: "hidden", border: "1px solid rgba(255,255,255,.12)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)" }}>
              <Image src={img.src} alt={img.alt} fill style={{ objectFit: "cover" }} />
              <figcaption style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "32px 13px 11px", background: "linear-gradient(to top,rgba(10,21,35,.95),rgba(10,21,35,0))", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#EDF1F6" }}>{img.caption}</figcaption>
            </figure>
          ))}
        </section>

        {/* Full bleed — overflow */}
        <section style={{ position: "relative", width: "100%", height: "clamp(360px,60vh,640px)", overflow: "hidden" }}>
          <Image src="/images/donuts-overflow.webp" alt="The overflow. It fills up early and keeps filling" fill style={{ objectFit: "cover", objectPosition: "center 78%" }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.9) 0%,rgba(10,21,35,.12) 42%,rgba(10,21,35,.3) 100%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 clamp(12px,4vw,40px)" }}>
            <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 0 20px", display: "flex", alignItems: "center", gap: 11 }}>
              <i aria-hidden="true" style={{ width: 26, height: 3, background: "#F2C94C", flex: "0 0 auto", display: "block" }} />
              <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12.5, letterSpacing: ".16em", lineHeight: 1.5, textTransform: "uppercase", color: "#EDF1F6", textShadow: "0 1px 10px rgba(10,21,35,.9)" }}>The overflow. It fills up early and keeps filling</span>
            </div>
          </div>
        </section>

        {/* Vendors & VIP */}
        <section id="vendors" style={{ position: "relative", background: "linear-gradient(150deg,rgba(242,201,76,.1),rgba(255,255,255,.014))", backdropFilter: "blur(24px) saturate(160%)", WebkitBackdropFilter: "blur(24px) saturate(160%)", border: "1px solid rgba(242,201,76,.3)", borderLeft: "3px solid #F2C94C", boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(22px,3.2vw,34px)", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#F2C94C", padding: "6px 16px" }}>
              <span style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#101010" }}>Vendors &amp; VIP</span>
            </span>
            <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 16, height: 1, background: "rgba(255,255,255,.14)", display: "block" }} />
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#00D2BE" }}>50% to a rotating charity, every quarter</span>
          </div>
          <h2 style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(26px,3.8vw,42px)", lineHeight: 1.02, letterSpacing: "-.024em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "20ch" }}>Set up where the crowd <span style={{ color: "#F2C94C" }}>already is</span></h2>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 17, lineHeight: 1.58, color: "#C4CBD6", maxWidth: "58ch" }}>A few hundred people walk this floor every Donuts morning. Five vendor spots and ten VIP parking spots, all inside the building &mdash; and half of every dollar goes to a rotating charity each quarter.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(250px,100%),1fr))", gap: "clamp(12px,1.8vw,18px)" }}>
            {[
              { label: "VIP parking",          price: "$100", count: "10 spots", bg: "rgba(10,21,35,.45)", border: "1px solid rgba(255,255,255,.12)", body: "Your car parked inside the building, right where everyone walks." },
              { label: "Indoor vendor location",price: "$250", count: "5 spots",  bg: "rgba(10,21,35,.45)", border: "1px solid rgba(255,255,255,.12)", body: "A table inside the room, next to what everyone came to see." },
            ].map(card => (
              <div key={card.label} style={{ background: card.bg, border: card.border, clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)", padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F" }}>{card.label}</span>
                <span style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(30px,3.4vw,40px)", letterSpacing: "-.02em", color: "#F2C94C" }}>{card.price}</span>
                  <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#B4B6B2" }}>{card.count}</span>
                </span>
                <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 15.5, lineHeight: 1.5, color: "#C4CBD6" }}>{card.body}</p>
              </div>
            ))}
            <div style={{ background: "rgba(0,81,133,.5)", border: "1px solid #0A6BAA", clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)", padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4" }}>Where it goes</span>
              <span style={{ fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(30px,3.4vw,40px)", letterSpacing: "-.02em", color: "#FFFFFF" }}>50%</span>
              <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 15.5, lineHeight: 1.5, color: "#CFE4F4" }}>Half the proceeds go to a rotating charity, picked fresh every quarter.</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/book" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>
              Claim a spot
            </Link>
            <a href="https://ig.me/m/itspaddockgavin" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.3)", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>
              DM @itspaddockgavin
            </a>
          </div>
        </section>

        {/* Group CTA */}
        <section style={{ background: "linear-gradient(150deg,rgba(0,81,133,.9),rgba(0,81,133,.66))", backdropFilter: "blur(22px) saturate(150%)", WebkitBackdropFilter: "blur(22px) saturate(150%)", border: "1px solid #0A6BAA", boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(22px,3.2vw,34px)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(16px,2.6vw,28px)" }}>
          <div style={{ flex: "1 1 300px", minWidth: 0 }}>
            <h2 style={{ margin: "0 0 12px", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(24px,3.2vw,36px)", lineHeight: 1.02, letterSpacing: "-.022em", textTransform: "uppercase", color: "#FFFFFF" }}>Bringing a club out?</h2>
            <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 17, lineHeight: 1.58, color: "#CFE4F4", maxWidth: "54ch" }}>Tell me how many are coming and I&rsquo;ll make sure there&rsquo;s room to park together.</p>
          </div>
          <div style={{ flex: "0 0 auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/book" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>
              Send the headcount
            </Link>
          </div>
        </section>

      </main>

      <SiteFooter />
    </>
  )
}
