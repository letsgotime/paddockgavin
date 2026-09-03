"use client"

import { useState } from "react"
import { Section } from "@/components/home-sections"

type Status = "idle" | "sending" | "sent" | "error"
const ARCHIVO = "Archivo, Helvetica, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const NOTCH = "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)"

export function HomeAskMe() {
  const [msg, setMsg] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  const submit = async () => {
    if (!msg.trim() || status === "sending") return
    setStatus("sending")
    try {
      const res = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "ask-me", message: msg.trim(), page: "/" }) })
      setStatus(res.ok ? "sent" : "error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <Section id="contact" eyebrow="Ask me anything" tone="#00D2BE" title="Send it and I'll answer">
      <p style={{ margin: 0 }}>
        A question for the camera, a date you want on the floor, a car you want found, or a brand deal. One inbox for all of it, and I&rsquo;m the one reading it.
      </p>
      <div className="pg-e1" style={{ display: "flex", flexDirection: "column", gap: 12, padding: "clamp(16px,2.4vw,22px)", clipPath: "polygon(0 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%)" }}>
        <label htmlFor="pg-msg" style={{ fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".2em", textTransform: "uppercase", color: "#8B93A7" }}>
          Write it here
        </label>
        <textarea
          id="pg-msg"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey && !e.nativeEvent.isComposing) submit() }}
          rows={4}
          placeholder="What do you need?"
          style={{ background: "rgba(10,21,35,.6)", border: "1px solid rgba(255,255,255,.15)", borderBottom: "2px solid rgba(255,255,255,.25)", color: "#EDF1F6", fontFamily: ARCHIVO, fontSize: 17, lineHeight: 1.6, padding: "14px 16px", resize: "vertical", minHeight: 100, width: "100%", boxSizing: "border-box", outline: "none" }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 22px" }}>
          <button type="button" onClick={submit} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: status === "sent" ? "#57C7F5" : "#F2C94C", color: "#0A0E1A", border: "none", padding: "15px 28px", clipPath: NOTCH }}>
            {status === "sent" ? "Sent. I’ll answer" : status === "sending" ? "Sending…" : "Send it"}
          </button>
          <a href="https://ig.me/m/itspaddockgavin" target="_blank" rel="noopener noreferrer" className="pg-textlink">or DM @itspaddockgavin</a>
          {status === "error" && (
            <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#8B93A7" }}>Failed. DM me instead</span>
          )}
        </div>
      </div>
    </Section>
  )
}
