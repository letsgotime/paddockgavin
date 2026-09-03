"use client"

import { useState } from "react"
import { PageBackdrop } from "@/components/page-backdrop"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

type Status = "idle" | "sending" | "sent" | "error"

const KINDS = [
  {
    key: "private",
    eyebrow: "The floor",
    title: "A private event",
    tone: "#4BA3DE",
    blurb: "Select private events on the showroom floor in Lebanon. Inquire with Gavin for details.",
    hint: "The occasion, the date, the headcount",
    img: "/images/donuts-floor-sq.webp",
  },
  {
    key: "sales",
    eyebrow: "Buy, trade or sell",
    title: "Your next vehicle",
    tone: "#00D2BE",
    blurb: "I source retail or wholesale with a dealer\u2019s licence, so every auction is open.",
    hint: "The car, the budget, buying or selling",
    img: "/images/f458-front-sq.webp",
  },
  {
    key: "other",
    eyebrow: "Anything else",
    title: "Something different",
    tone: "#B4B6B2",
    blurb: "Reach out on IG or LinkedIn, or put it in the form \u2014 it all lands with me.",
    hint: "Whatever it is",
    img: "/images/gavin-gwagen-sq.webp",
  },
]


export default function BookPage() {
  const [picked, setPicked] = useState("club")
  const [form, setForm] = useState({ name: "", reach: "", date: "", message: "" })
  const [status, setStatus] = useState<Status>("idle")

  const cur = KINDS.find(k => k.key === picked) || KINDS[0]

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
        body: JSON.stringify({ kind: picked, ...form, page: "book" }),
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


  return (
    <>
      <SiteNav active="events" />

      <PageBackdrop src="/images/donuts-floor.webp" opacity={0.2} />

      <main style={{ position: "relative", zIndex: 1, minWidth: 0, maxWidth: 1080, margin: "0 auto", padding: "clamp(16px,3vw,28px) clamp(12px,4vw,40px) clamp(40px,7vw,84px)", display: "flex", flexDirection: "column", gap: "clamp(14px,2.4vw,22px)" }}>

        {/* Hero */}
        <section style={{ position: "relative", minHeight: "clamp(300px,44vh,470px)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
          <Image src="/images/donuts-floor.webp" alt="The floor, set for it" fill style={{ objectFit: "cover", objectPosition: "center 60%" }} priority />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.95) 10%,rgba(10,21,35,.42) 56%,rgba(10,21,35,.3) 100%)" }} />
          <div style={{ position: "relative", padding: "clamp(22px,3.4vw,38px)", display: "flex", flexDirection: "column", gap: 14, maxWidth: 720 }}>
            <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#F2C94C", padding: "6px 16px", alignSelf: "flex-start" }}>
              <span style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#101010" }}>Book it &middot; Lebanon, TN</span>
            </span>
            <h1 style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 800, fontSize: "var(--t-h1)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF" }}>
              Tell me what you&rsquo;re <span style={{ color: "#F2C94C" }}>bringing</span>
            </h1>
            <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "clamp(17px,1.7vw,19px)", lineHeight: 1.58, color: "#EDF1F6", maxWidth: "56ch", textShadow: "0 1px 10px rgba(10,21,35,.85)" }}>
              Pick the one that fits, give me the shape of it, and I&rsquo;ll come back with the details. Every one of these lands with me.
            </p>
          </div>
        </section>

        {/* Booking lanes */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))", gap: "clamp(12px,1.8vw,18px)" }}>
          {KINDS.map(k => {
            const on = k.key === picked
            return (
              <button
                key={k.key}
                type="button"
                onClick={() => { setPicked(k.key); setStatus("idle"); document.getElementById("form")?.scrollIntoView({ behavior: "smooth", block: "start" }) }}
                className="pg-e1" style={{ position: "relative", overflow: "hidden", isolation: "isolate", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: 10, background: on ? "rgba(242,201,76,.12)" : "linear-gradient(150deg,rgba(255,255,255,.06),rgba(255,255,255,.013))", border: on ? "1px solid rgba(242,201,76,.5)" : "1px solid rgba(255,255,255,.11)", borderLeft: `3px solid ${k.tone}`, clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)", padding: "clamp(18px,2.4vw,24px)" }}
              >
                <div style={{ position: "absolute", inset: 0, zIndex: -1 }}>
                  <Image src={k.img} alt="" fill style={{ objectFit: "cover", opacity: 0.36 }} />
                  <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(14,26,42,.96) 0%,rgba(14,26,42,.87) 52%,rgba(14,26,42,.62) 100%)" }} />
                </div>
                <span style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
                  <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: k.tone }}>{k.eyebrow}</span>
                  <i aria-hidden="true" style={{ flex: "1 1 auto", height: 0, borderBottom: "1px dotted rgba(255,255,255,.18)" }} />
                  <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: on ? "#F2C94C" : "#91918F" }}>{on ? "Selected" : "Pick"}</span>
                </span>
                <span style={{ fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 800, fontSize: "clamp(19px,2.2vw,24px)", letterSpacing: "-.016em", lineHeight: 1.12, color: "#FFFFFF" }}>{k.title}</span>
                <span style={{ fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 15.5, lineHeight: 1.52, color: "#C4CBD6" }}>{k.blurb}</span>
              </button>
            )
          })}
        </section>

        {/* The form */}
        <section
          id="form"
          className="pg-e1" style={{ position: "relative", background: "linear-gradient(150deg,rgba(0,81,133,.9),rgba(0,81,133,.66))", border: "1px solid #0A6BAA", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)", padding: "clamp(22px,3.2vw,34px)", scrollMarginTop: 120, display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4" }}>Booking</span>
            <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#F2C94C", padding: "5px 13px" }}>
              <span style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#101010" }}>{cur.title}</span>
            </span>
            <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 12, height: 1, background: "rgba(255,255,255,.2)", display: "block" }} />
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <label style={{ flex: "1 1 160px", display: "flex", flexDirection: "column", gap: 7 }}>
              <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4" }}>Your name</span>
              <input type="text" value={form.name} onChange={update("name")} placeholder="Name" style={inputStyle} />
            </label>
            <label style={{ flex: "1 1 160px", display: "flex", flexDirection: "column", gap: 7 }}>
              <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4" }}>How I reach you</span>
              <input type="text" value={form.reach} onChange={update("reach")} placeholder="Phone, email or @handle" style={inputStyle} />
            </label>
            <label style={{ flex: "1 1 140px", display: "flex", flexDirection: "column", gap: 7 }}>
              <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4" }}>The date, if there is one</span>
              <input type="text" value={form.date} onChange={update("date")} placeholder="When" style={inputStyle} />
            </label>
          </div>
          <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4" }}>The shape of it</span>
            <textarea rows={3} value={form.message} onChange={update("message")} placeholder={cur.hint} style={{ ...inputStyle, resize: "vertical", minHeight: 84, lineHeight: 1.5 }} />
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={submit}
              style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#F2C94C", color: "#101010", border: 0, padding: "15px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)" }}
            >
              {status === "sent" ? "Sent \u2014 I\u2019ll answer" : status === "sending" ? "Sending\u2026" : "Send it to Gavin"}
            </button>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#CFE4F4" }}>
              {status === "error" ? "Could not send from here \u2014 DM @itspaddockgavin instead" : status === "sent" ? "Landed with me" : "DM @itspaddockgavin for a faster response"}
            </span>
          </div>
        </section>

        {/* Direct lines */}
        <section style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F" }}>Rather go direct?</span>
          <a href="https://ig.me/m/itspaddockgavin" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".06em", textTransform: "uppercase", color: "#00302B", background: "#00D2BE", padding: "12px 20px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)", textDecoration: "none" }}>
            DM @itspaddockgavin
          </a>
          <a href="https://www.linkedin.com/in/gavinbrooksleader" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".06em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.28)", padding: "12px 20px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)", textDecoration: "none" }}>
            LinkedIn
          </a>
        </section>

      </main>

      <SiteFooter />
    </>
  )
}
