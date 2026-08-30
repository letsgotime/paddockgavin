"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

type Status = "idle" | "sending" | "sent" | "error"

function countdown(iso: string, now: number) {
  const days = Math.ceil((Date.parse(iso + "T12:00:00") - now) / 86400000)
  if (days > 1) return `in ${days} days`
  if (days === 1) return "tomorrow"
  if (days === 0) return "today"
  return "done"
}

export default function CreatorDayPage() {
  const [now, setNow] = useState(Date.now())
  const [lightWindow, setLightWindow] = useState("First light to last")
  const [form, setForm] = useState({ name: "", reach: "", message: "" })
  const [status, setStatus] = useState<Status>("idle")

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    fetch("https://api.sunrise-sunset.org/json?lat=36.2081&lng=-86.2911&formatted=0&date=2026-09-19")
      .then(r => r.json())
      .then(j => {
        if (!j.results || j.status !== "OK") return
        const fmt = (iso: string) =>
          new Date(iso).toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" }).replace(/\s/g, "\u2009")
        setLightWindow(`Sunrise ${fmt(j.results.sunrise)} \u00b7 sunset ${fmt(j.results.sunset)}`)
      })
      .catch(() => {})
  }, [])

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
        body: JSON.stringify({ kind: "creator-day-rsvp", ...form, page: "creator-day" }),
      })
      setStatus(res.ok ? "sent" : "error")
    } catch {
      setStatus("error")
    }
  }

  const creatorIn = countdown("2026-09-19", now)

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

      <style>{`
        @keyframes pgKb{from{transform:scale(1) translateY(0)}to{transform:scale(1.09) translateY(-1.6%)}}
      `}</style>

      {/* Fixed background */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", background: "#0A1523" }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.22 }}>
          <Image src="/images/cullinan-speedway.webp" alt="" fill style={{ objectFit: "cover" }} />
        </div>
        <div
          style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(1100px 720px at 82% -6%,rgba(242,201,76,.15),transparent 60%),radial-gradient(1000px 700px at 4% 30%,rgba(0,81,133,.42),transparent 62%),linear-gradient(180deg,rgba(10,21,35,.86),rgba(10,21,35,.95))",
          }}
        />
      </div>

      <main
        style={{
          position: "relative", zIndex: 1, minWidth: 0, maxWidth: 1180, margin: "0 auto",
          padding: "clamp(14px,2.4vw,22px) clamp(12px,4vw,40px) clamp(40px,7vw,84px)",
          display: "flex", flexDirection: "column", gap: "clamp(14px,2.4vw,22px)",
        }}
      >
        {/* Hero */}
        <section
          style={{
            position: "relative",
            minHeight: "clamp(440px,62vh,620px)",
            border: "1px solid rgba(242,201,76,.3)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            overflow: "hidden",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <Image
            src="/images/creator-booth.jpg"
            alt="Shooting the Ford GT MkII on the studio turntable"
            fill
            style={{ objectFit: "cover", objectPosition: "center 42%" }}
            priority
          />
          {/* Light overlay — photo is bright so text needs a light-to-dark gradient at bottom */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top,rgba(240,243,247,.92) 6%,rgba(240,243,247,.4) 30%,rgba(240,243,247,0) 55%)",
            }}
          />
          <div
            style={{ position: "relative", padding: "clamp(22px,3.6vw,42px)", display: "flex", flexDirection: "column", gap: 16, maxWidth: 780 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#F2C94C", padding: "6px 16px" }}>
                <span
                  style={{
                    display: "inline-block", transform: "skewX(12deg)",
                    fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12.5,
                    letterSpacing: ".16em", textTransform: "uppercase", color: "#101010",
                  }}
                >
                  Sep 19, 2026 &middot; Lebanon, TN
                </span>
              </span>
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase",
                  color: "#F2C94C", background: "#0E1A2A", padding: "7px 14px",
                  clipPath: "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)",
                }}
              >
                {creatorIn}
              </span>
            </div>
            <h1
              style={{
                margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900,
                fontSize: "clamp(34px,5.6vw,62px)", lineHeight: 1.06, letterSpacing: "-.026em",
                textTransform: "uppercase", color: "#0E1A2A",
              }}
            >
              <span
                style={{
                  background: "linear-gradient(100deg,#005185 0%,#0A6BAA 100%)",
                  color: "#FFFFFF", padding: "1px 14px",
                  WebkitBoxDecorationBreak: "clone",
                  boxDecorationBreak: "clone" as React.CSSProperties["boxDecorationBreak"],
                }}
              >
                Creator Day
              </span>
              <br />
              <span
                style={{
                  background: "#F2C94C", color: "#101010", padding: "1px 14px",
                  WebkitBoxDecorationBreak: "clone",
                  boxDecorationBreak: "clone" as React.CSSProperties["boxDecorationBreak"],
                }}
              >
                golden hour to golden hour
              </span>
            </h1>
          </div>
        </section>

        {/* The invite */}
        <section
          style={{
            background: "linear-gradient(150deg,rgba(255,255,255,.07),rgba(255,255,255,.015))",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: "1px solid rgba(255,255,255,.12)",
            borderLeft: "3px solid #F2C94C",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            padding: "clamp(20px,3vw,30px)",
            display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(16px,2.6vw,28px)",
          }}
        >
          <p
            style={{
              margin: 0, flex: "1 1 320px", minWidth: 0,
              fontFamily: "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(17px,1.8vw,19px)", lineHeight: 1.56, color: "#C4CBD6", maxWidth: "60ch",
            }}
          >
            duPont REGISTRY sets up four to five installations with cars, and creators of every kind are invited. Shoot it, film it, paint it &mdash; make whatever the light gives you.
          </p>
          <div style={{ flex: "0 0 auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href="#rsvp"
              style={{
                display: "inline-flex", alignItems: "center",
                fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15,
                letterSpacing: ".04em", textTransform: "uppercase",
                background: "#F2C94C", color: "#101010", padding: "15px 28px",
                clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
                textDecoration: "none",
              }}
            >
              RSVP
            </a>
            <a
              href="https://ig.me/m/itspaddockgavin"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center",
                fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15,
                letterSpacing: ".04em", textTransform: "uppercase",
                color: "#EDF1F6", border: "1px solid rgba(255,255,255,.3)", padding: "15px 28px",
                clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
                textDecoration: "none",
              }}
            >
              DM @itspaddockgavin
            </a>
          </div>
        </section>

        {/* How the day runs */}
        <section
          style={{
            background: "linear-gradient(150deg,rgba(255,255,255,.065),rgba(255,255,255,.013))",
            backdropFilter: "blur(22px) saturate(155%)",
            WebkitBackdropFilter: "blur(22px) saturate(155%)",
            border: "1px solid rgba(255,255,255,.11)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.13)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            padding: "clamp(22px,3.2vw,34px)",
            display: "flex", flexDirection: "column", gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <span style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#00D2BE", padding: "6px 16px" }}>
              <span
                style={{
                  display: "inline-block", transform: "skewX(12deg)",
                  fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12.5,
                  letterSpacing: ".16em", textTransform: "uppercase", color: "#00302B",
                }}
              >
                How the day runs
              </span>
            </span>
            <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 16, height: 1, background: "rgba(255,255,255,.14)", display: "block" }} />
            <span
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#91918F",
              }}
            >
              {lightWindow}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(230px,100%),1fr))", gap: "clamp(12px,1.8vw,18px)" }}>
            {[
              {
                dots: ["#00D2BE", null, null],
                title: "Create all day",
                body: "Four to five installations with cars, first light to last. Photo, video, paint, whatever you make \u2014 bring your kit and work the room.",
                border: "1px solid rgba(255,255,255,.10)",
              },
              {
                dots: ["#00D2BE", "#00D2BE", null],
                title: "Post your best",
                body: "Submit the work you\u2019re proudest of and tag it. duPont votes on the entries.",
                border: "1px solid rgba(255,255,255,.10)",
              },
              {
                dots: ["#F2C94C", "#F2C94C", "#F2C94C"],
                title: "Winner takes the bag",
                body: "A creator bundle from a leading brand, plus a full day to create with a duPont car of your choice.",
                border: "1px solid rgba(242,201,76,.3)",
              },
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(10,21,35,.42)",
                  border: card.border,
                  clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)",
                  padding: 18,
                  display: "flex", flexDirection: "column", gap: 10,
                }}
              >
                <span style={{ display: "flex", gap: 6 }} aria-hidden="true">
                  {card.dots.map((c, j) => (
                    <i
                      key={j}
                      style={{
                        width: 12, height: 12, borderRadius: "50%",
                        background: c ?? "rgba(255,255,255,.14)",
                        boxShadow: c ? `0 0 10px ${c}` : undefined,
                        display: "block",
                      }}
                    />
                  ))}
                </span>
                <span style={{ fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "-.01em", color: "#FFFFFF" }}>{card.title}</span>
                <p style={{ margin: 0, fontFamily: "Archivo,Helvetica,sans-serif", fontSize: 15.5, lineHeight: 1.55, color: "#C4CBD6" }}>{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Full bleed photo */}
        <section
          style={{
            position: "relative",
            width: "100%",
            height: "clamp(460px,84vh,820px)",
            overflow: "hidden",
          }}
        >
          <Image
            src="/images/donuts-lot.webp"
            alt="Cars lined up across the lot at the meet"
            fill
            style={{ objectFit: "cover" }}
          />
          <span
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.9) 0%,rgba(10,21,35,.12) 42%,rgba(10,21,35,.3) 100%)" }}
          />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 clamp(12px,4vw,40px)" }}>
            <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 0 20px", display: "flex", alignItems: "center", gap: 11 }}>
              <i aria-hidden="true" style={{ width: 26, height: 3, background: "#F2C94C", flex: "0 0 auto", display: "block" }} />
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12.5, letterSpacing: ".16em", lineHeight: 1.5,
                  textTransform: "uppercase", color: "#EDF1F6", textShadow: "0 1px 10px rgba(10,21,35,.9)",
                }}
              >
                Two GT3 RSs and a G-Wagen 4x4&sup2;, waiting on the light
              </span>
            </div>
          </div>
        </section>

        {/* RSVP form */}
        <section
          id="rsvp"
          style={{
            position: "relative",
            background: "linear-gradient(150deg,rgba(0,81,133,.9),rgba(0,81,133,.66))",
            backdropFilter: "blur(22px) saturate(150%)",
            WebkitBackdropFilter: "blur(22px) saturate(150%)",
            border: "1px solid #0A6BAA",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            overflow: "hidden",
            isolation: "isolate",
            padding: "clamp(22px,3.2vw,34px)",
            scrollMarginTop: 120,
          }}
        >
          <Image
            src="/images/cage-rig.webp"
            alt=""
            aria-hidden
            fill
            style={{ objectFit: "cover", objectPosition: "right center", opacity: 0.18, zIndex: -1 }}
          />
          <span
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, zIndex: -1, background: "linear-gradient(180deg,rgba(0,50,82,.6),rgba(0,40,66,.78))" }}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,40px)" }}>
            {/* Left copy */}
            <div style={{ flex: "4 1 260px", minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4",
                }}
              >
                Creator Day &middot; Sep 19
              </span>
              <h2
                style={{
                  margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900,
                  fontSize: "clamp(26px,3.8vw,42px)", lineHeight: 1.02, letterSpacing: "-.024em",
                  textTransform: "uppercase", color: "#FFFFFF", maxWidth: "14ch",
                }}
              >
                Put your name on the list
              </h2>
              <p
                style={{
                  margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 17,
                  lineHeight: 1.58, color: "#CFE4F4", maxWidth: "48ch",
                }}
              >
                Tell me what you make and I&rsquo;ll have you on the gate list. Free, and whatever you drive is welcome in the lot.
              </p>
              <Link
                href="/events"
                style={{
                  alignSelf: "flex-start",
                  fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700,
                  fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase",
                  color: "#CFE4F4", textDecoration: "none",
                }}
              >
                &larr; All events
              </Link>
            </div>
            {/* Form */}
            <div style={{ flex: "5 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <label style={{ flex: "1 1 160px", display: "flex", flexDirection: "column", gap: 7 }}>
                  <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4" }}>Your name</span>
                  <input type="text" value={form.name} onChange={update("name")} placeholder="Name" style={inputStyle} />
                </label>
                <label style={{ flex: "1 1 160px", display: "flex", flexDirection: "column", gap: 7 }}>
                  <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4" }}>How I reach you</span>
                  <input type="text" value={form.reach} onChange={update("reach")} placeholder="Phone, email or @handle" style={inputStyle} />
                </label>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4" }}>What you create</span>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Photo, video, paint, something else \u2014 and where you post it"
                  style={{ ...inputStyle, resize: "vertical", minHeight: 84, lineHeight: 1.5 }}
                />
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={submit}
                  style={{
                    cursor: "pointer", display: "inline-flex", alignItems: "center",
                    fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15,
                    letterSpacing: ".04em", textTransform: "uppercase",
                    background: "#F2C94C", color: "#101010", border: 0, padding: "15px 28px",
                    clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
                  }}
                >
                  {status === "sent" ? "You\u2019re on the list" : status === "sending" ? "Sending\u2026" : "Add me to the list"}
                </button>
                <span
                  style={{
                    fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                    fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#CFE4F4",
                  }}
                >
                  {status === "error" ? "Could not send \u2014 DM @itspaddockgavin instead" : status === "sent" ? "I\u2019ll be in touch" : "Free entry \u00b7 all welcome"}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div style={{ position: "relative", zIndex: 1 }}>
        <SiteFooter />
      </div>
    </>
  )
}
