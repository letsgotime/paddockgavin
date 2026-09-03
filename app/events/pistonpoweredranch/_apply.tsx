"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { db } from "@/lib/crm/client"

/* Copy ran through RAIL Redline, WARM / WEB PAGE / US, zero tells, with an
   explicit instruction not to introduce facts absent from the draft. */

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const CLIP = "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)"
const CLIP_SM = "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)"

export type ApplyProps = {
  kicker: string
  title: string
  lede: string
  body: string[]
  img: string
  bandImg: string
  closeImg: string
  focal?: string
  bandFocal?: string
  tone: string
  asks: { t: string; b: string }[]
  asksHead: string
  cta: { label: string; href: string }
  note?: string
  closeLine: string
  form?: { kind: string; head: string; orgLabel: string; askLabel: string }
}

type Status = "idle" | "sending" | "sent" | "error"

export function ApplyPage(p: ApplyProps) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-r]"))
    if (reduce) {
      els.forEach((e) => e.classList.add("in"))
      return
    }
    const io = new IntersectionObserver(
      (en) =>
        en.forEach((x) => {
          if (x.isIntersecting) {
            x.target.classList.add("in")
            io.unobserve(x.target)
          }
        }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <SiteNav active="events" />
      <style>{`
        @keyframes pgKen{from{transform:scale(1.02)}to{transform:scale(1.13) translateY(-1.4%)}}
        [data-r]{opacity:0;transform:translate3d(0,26px,0)}
        [data-r].in{opacity:1;transform:none;transition:opacity .85s cubic-bezier(.16,.84,.32,1) var(--d,0ms),transform .85s cubic-bezier(.16,.84,.32,1) var(--d,0ms)}
        .pgKen{animation:pgKen 30s ease-in-out infinite alternate;transform-origin:center}
        .pgBand{position:sticky;top:0;height:100svh;overflow:hidden}
        .pgTile{transition:transform .5s cubic-bezier(.16,.84,.32,1),border-color .3s}
        @media (hover:hover){.pgTile:hover{transform:translateY(-4px);border-color:rgba(255,255,255,0.82)}}
        .pgGo{transition:transform .3s cubic-bezier(.16,.84,.32,1)}
        @media (hover:hover){.pgGo:hover{transform:translateY(-2px)}}
        @media (prefers-reduced-motion:reduce){
          [data-r],[data-r].in{opacity:1!important;transform:none!important;transition:none!important}
          .pgKen{animation:none!important}
          .pgTile,.pgGo{transition:none!important}
        }
      `}</style>

      <main style={{ background: "#0A1523" }}>
        <section style={{ position: "relative", minHeight: "88svh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
          <Image className="pgKen" src={p.img} alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: p.focal || "center 55%" }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.97) 8%,rgba(10,21,35,.4) 58%,rgba(10,21,35,.6) 100%)" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px) clamp(44px,9vh,96px)", display: "flex", flexDirection: "column", gap: 16 }}>
            <span data-r="" style={{ fontFamily: MONO, fontSize: "clamp(10.5px,1.3vw,12px)", letterSpacing: ".26em", textTransform: "uppercase", color: p.tone }}>
              {p.kicker} &middot; October 10, 2026
            </span>
            <h1 data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(32px,7vw,72px)", lineHeight: 0.95, letterSpacing: "-.03em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "16ch", ["--d" as string]: "90ms" }}>
              {p.title}
            </h1>
            <p data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(16px,1.9vw,20px)", lineHeight: 1.5, color: "#E7ECF3", maxWidth: "48ch", ["--d" as string]: "170ms" }}>
              {p.lede}
            </p>
          </div>
        </section>

        <section style={{ position: "relative" }}>
          <div className="pgBand" aria-hidden="true">
            <Image src={p.bandImg} alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: p.bandFocal || "center 50%" }} />
            <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(10,21,35,.88) 0%,rgba(10,21,35,.42) 34%,rgba(10,21,35,.95) 100%)" }} />
          </div>
          <div style={{ position: "relative", marginTop: "-56svh", paddingBottom: "clamp(36px,8vh,84px)" }}>
            <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px)" }}>
              <div
                data-r=""
                className="pg-e1" style={{
                  background: "rgba(10,21,35,.82)",
                  borderTop: `3px solid ${p.tone}`,
                  boxShadow: "0 30px 90px rgba(0,0,0,.5)",
                  clipPath: CLIP,
                  padding: "clamp(22px,4vw,44px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16
                }}
              >
                {p.body.map((b, i) => (
                  <p key={b.slice(0, 22)} style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "clamp(15.5px,1.8vw,19px)", lineHeight: 1.6, color: i === 0 ? "#E7ECF3" : "#C9D1DB", maxWidth: "58ch" }}>
                    {b}
                  </p>
                ))}
                {p.note && (
                  <p style={{ margin: "4px 0 0", fontFamily: ARCHIVO, fontSize: "clamp(15px,1.6vw,17px)", lineHeight: 1.6, color: "#B4B6B2", maxWidth: "54ch", borderLeft: `2px solid ${p.tone}`, paddingLeft: 16 }}>
                    {p.note}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(8px,2vh,20px) clamp(16px,5vw,40px) clamp(40px,9vh,96px)", display: "flex", flexDirection: "column", gap: 16 }}>
          <span data-r="" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: p.tone }}>
            {p.asksHead}
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(236px,1fr))", gap: 12 }}>
            {p.asks.map((a, i) => (
              <div
                key={a.t}
                data-r=""
                className="pgTile"
                style={{ border: "1px solid rgba(255,255,255,.12)", background: "rgba(21,37,56,.55)", clipPath: CLIP_SM, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 7, ["--d" as string]: `${i * 80}ms` }}
              >
                <span style={{ fontFamily: ARCHIVO, fontWeight: 900, fontSize: 15.5, textTransform: "uppercase", letterSpacing: "-.008em", color: "#FFFFFF" }}>{a.t}</span>
                <span style={{ fontFamily: ARCHIVO, fontSize: 14.5, lineHeight: 1.5, color: "#C4CCD6" }}>{a.b}</span>
              </div>
            ))}
          </div>
        </section>

        {p.form && <ApplyForm tone={p.tone} form={p.form} />}

        <section style={{ position: "relative" }}>
          <div className="pgBand" aria-hidden="true">
            <Image src={p.closeImg} alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 50%" }} />
            <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(10,21,35,.86) 0%,rgba(10,21,35,.46) 30%,rgba(10,21,35,.9) 78%,rgba(10,21,35,.99) 100%)" }} />
          </div>
          <div style={{ position: "relative", marginTop: "-66svh", paddingBottom: "clamp(56px,13vh,140px)" }}>
            <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px)", display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" }}>
              <p data-r="" style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(22px,3.6vw,38px)", lineHeight: 1.06, letterSpacing: "-.024em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "20ch" }}>
                {p.closeLine}
              </p>
              <div data-r="" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", ["--d" as string]: "110ms" }}>
                <a
                  className="pgGo"
                  href={p.cta.href}
                  target={p.cta.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener"
                  style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: p.tone, color: "#101010", padding: "16px 28px", clipPath: CLIP_SM, textDecoration: "none" }}
                >
                  {p.cta.label}
                </a>
                <Link href="/events/pistonpoweredranch" style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#00D2BE", textDecoration: "none" }}>
                  Back to the event
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}

function ApplyForm({ tone, form }: { tone: string; form: NonNullable<ApplyProps["form"]> }) {
  const [f, setF] = useState({ name: "", org: "", reach: "", phone: "", message: "" })
  const [status, setStatus] = useState<Status>("idle")
  const [why, setWhy] = useState("")

  const up = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((x) => ({ ...x, [k]: e.target.value }))

  const send = async () => {
    if (!f.name.trim() || status === "sending") return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.reach.trim())) {
      setStatus("error")
      setWhy("We need an email address. A phone number alone means we cannot send you a decision.")
      return
    }
    setStatus("sending")

    /* Two paths, deliberately independent.
       The CRM write is the one we want, but the anonymous Data API session it
       needs does not exist: Neon Auth on this project offers email and password
       only, with no anonymous method, and paddockgavin.com is not yet a trusted
       origin. So the write is attempted and its failure is logged rather than
       shown, because the email below still reaches a person. The moment a
       server side credential exists this becomes the primary path again. */
    const reach = f.reach.trim()
    const payload = { kind: form.kind, ...f }

    /* submissions.type is constrained to vehicle, vendor or sponsor. The form
       kinds are named for the page they sit on, so they have to be mapped
       rather than passed straight through. */
    const DB_TYPE: Record<string, string> = {
      entry: "vehicle",
      "sponsor-application": "sponsor",
      "vendor-application": "vendor",
    }

    try {
      const client = db()
      if (client) {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reach)
        const saved = await client.from("submissions").insert([
          {
            type: DB_TYPE[form.kind] ?? "vehicle",
            applicant_name: f.name.trim(),
            email: isEmail ? reach.toLowerCase() : "",
            phone: f.phone.trim() || (isEmail ? null : reach),
            status: "pending",
            details: { org: f.org.trim(), message: f.message.trim(), reach, page: "piston-powered-ranch" },
          },
        ])
        if (saved?.error) console.warn("[apply] not recorded in the CRM:", saved.error.message)
      }
    } catch (err) {
      console.warn("[apply] not recorded in the CRM:", err)
    }

    /* This is what decides what the visitor is told, because this is the path
       that reaches a human today. */
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      setStatus(res.ok ? "sent" : "error")
    } catch {
      setStatus("error")
    }
  }

  const input: React.CSSProperties = {
    background: "rgba(10,21,35,.6)",
    border: "1px solid rgba(255,255,255,.22)",
    color: "#EDF1F6",
    fontFamily: ARCHIVO,
    fontSize: 16,
    padding: "14px 16px",
    clipPath: CLIP_SM,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
  }

  return (
    <section id="apply" style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,5vw,40px) clamp(40px,9vh,96px)", scrollMarginTop: 110 }}>
      <div
        data-r=""
        style={{
          border: "1px solid rgba(255,255,255,.13)",
          borderTop: `3px solid ${tone}`,
          background: "rgba(21,37,56,.55)",
          clipPath: CLIP,
          padding: "clamp(22px,4vw,40px)",
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(20px,3vw,36px)",
        }}
      >
        <div style={{ flex: "4 1 260px", minWidth: 0 }}>
          <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 900, fontSize: "clamp(22px,3.2vw,32px)", lineHeight: 1.05, letterSpacing: "-.022em", textTransform: "uppercase", color: "#FFFFFF" }}>
            {form.head}
          </h2>
        </div>
        <div style={{ flex: "5 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {status === "sent" ? (
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 17, lineHeight: 1.5, color: "#00D2BE" }}>
              Received. We answer every one of these, and you will hear from us at what you left.
            </p>
          ) : (
            <>
              <input style={input} placeholder="Your name" value={f.name} onChange={up("name")} />
              <input style={input} placeholder={form.orgLabel} value={f.org} onChange={up("org")} />
              <input style={input} type="email" inputMode="email" autoComplete="email"
                placeholder="Email, so we can write back" value={f.reach} onChange={up("reach")} />
              <input style={input} type="tel" inputMode="tel" autoComplete="tel"
                placeholder="Phone, optional" value={f.phone} onChange={up("phone")} />
              <textarea style={{ ...input, minHeight: 104, resize: "vertical" }} placeholder={form.askLabel} value={f.message} onChange={up("message")} />
              {status === "error" && (
                <span style={{ fontFamily: ARCHIVO, fontSize: 14, color: "#F2994A" }}>
                  {why || "That did not send. Try again, or write to entries@pistonpoweredranch.com."}
                </span>
              )}
              <button
                onClick={send}
                disabled={status === "sending"}
                className="pgGo"
                style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, letterSpacing: ".05em", textTransform: "uppercase", background: tone, color: "#101010", border: "none", padding: "16px 28px", cursor: status === "sending" ? "default" : "pointer", opacity: status === "sending" ? .6 : 1, clipPath: CLIP_SM }}
              >
                {status === "sending" ? "Sending" : "Send it"}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
