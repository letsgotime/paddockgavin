"use client"

import { useState } from "react"
import Link from "next/link"

type Status = "idle" | "sending" | "sent" | "error"

export function HomeAskMe() {
  const [msg, setMsg]       = useState("")
  const [status, setStatus] = useState<Status>("idle")

  const submit = async () => {
    if (!msg.trim() || status === "sending") return
    setStatus("sending")
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "ask-me", message: msg.trim(), page: "/" }),
      })
      setStatus(res.ok ? "sent" : "error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section
      data-screen-label="Ask me anything"
      id="contact"
      style={{ display: "flex", flexDirection: "column", gap: "clamp(40px,6vw,72px)" }}
    >
      {/* Eyebrow */}
      <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "#00D2BE" }}>
        Ask me anything
      </span>

      {/* Headline */}
      <h2 style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(44px,8vw,96px)", lineHeight: .97, letterSpacing: "-.03em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "12ch" }}>
        Send it and{" "}<span style={{ color: "#F8B800" }}>I&apos;ll answer.</span>
      </h2>

      {/* Subtext */}
      <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "clamp(18px,1.9vw,22px)", lineHeight: 1.65, color: "#C4CBD6", maxWidth: "48ch" }}>
        A question for the camera, a date you want on the floor, or a brand deal. Same inbox for all of it — I&apos;m the one reading it.
      </p>

      {/* Quick links */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="https://ig.me/m/itspaddockgavin" target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#F8B800", color: "#101010", padding: "14px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", textDecoration: "none" }}>
          DM @itspaddockgavin
        </a>
        <Link href="/connect"
          style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.22)", padding: "14px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", textDecoration: "none" }}>
          Every link
        </Link>
        <Link href="/intake"
          style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.22)", padding: "14px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", textDecoration: "none" }}>
          Tell me the spec
        </Link>
      </div>

      {/* Write-in form — open, not boxed */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: "clamp(28px,4vw,48px)", maxWidth: "64ch" }}>
        <label htmlFor="pg-msg" style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "#8B93A7" }}>
          Or write it here
        </label>
        <textarea
          id="pg-msg"
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && e.metaKey && !e.nativeEvent.isComposing) submit() }}
          rows={4}
          placeholder="What do you need?"
          style={{ background: "rgba(10,21,35,.6)", border: "1px solid rgba(255,255,255,.15)", borderBottom: "2px solid rgba(255,255,255,.25)", color: "#EDF1F6", fontFamily: "Archivo,'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: 17, lineHeight: 1.6, padding: "16px 18px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", resize: "vertical", minHeight: 100, width: "100%", boxSizing: "border-box", outline: "none" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button type="button" onClick={submit}
            style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: status === "sent" ? "#00D2BE" : "#EF4A18", color: status === "sent" ? "#003028" : "#FFFFFF", border: "none", padding: "14px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)" }}>
            {status === "sent" ? "Sent — I\u2019ll answer" : status === "sending" ? "Sending\u2026" : "Send it"}
          </button>
          {status === "error" && (
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#EF4A18" }}>
              Failed — DM me instead
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
