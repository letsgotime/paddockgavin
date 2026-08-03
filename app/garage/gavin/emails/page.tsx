"use client"

import { useState, useEffect } from "react"

const arch = "Archivo, Helvetica, sans-serif"
const mono = "ui-monospace, 'Courier New', Courier, monospace"

const TEMPLATES = [
  { id: "welcome", label: "Subscriber Welcome" },
  { id: "digest",  label: "Wireframe Digest" },
  { id: "intake",  label: "Intake Confirmation" },
] as const

type TemplateId = typeof TEMPLATES[number]["id"]

export default function EmailPreviewPage() {
  const [active, setActive]           = useState<TemplateId>("welcome")
  const [src, setSrc]                 = useState<string>("")
  const [frameHeight, setFrameHeight] = useState<number>(1200)

  function load(id: TemplateId) {
    setActive(id)
    setFrameHeight(1200)
    setSrc(`/api/email-preview?id=${id}&t=${Date.now()}`)
  }

  useEffect(() => { load("welcome") }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Resize iframe to full email height via postMessage
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === "email-height") setFrameHeight(e.data.height + 40)
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  return (
    <main style={{ background: "#0A0E1A", minHeight: "100vh", fontFamily: arch }}>

      {/* Toolbar */}
      <div style={{
        position: "sticky", top: 5, zIndex: 50,
        background: "#0E1A2A",
        borderBottom: "1px solid rgba(255,255,255,.1)",
        padding: "14px 24px",
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
      }}>
        <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#8B93A7", flex: "0 0 auto" }}>
          Email Preview
        </span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => load(t.id)}
              style={{
                padding: "8px 18px",
                fontFamily: arch,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: ".04em",
                cursor: "pointer",
                border: `1px solid ${active === t.id ? "#F2C94C" : "rgba(255,255,255,.15)"}`,
                background: active === t.id ? "rgba(242,201,76,.12)" : "transparent",
                color: active === t.id ? "#F2C94C" : "#EDF1F6",
                transition: "all .18s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "#57C7F5" }}>
          /garage/gavin/emails
        </span>
      </div>

      {/* Preview frame */}
      <div style={{ display: "flex", justifyContent: "center", padding: "32px 16px" }}>
        <div style={{ width: "100%", maxWidth: 680, background: "#fff", overflow: "hidden", boxShadow: "0 8px 48px rgba(0,0,0,.7)" }}>
          {src ? (
            <iframe
              key={src}
              src={src}
              onLoad={(e) => {
                try {
                  const h = (e.target as HTMLIFrameElement).contentDocument?.body?.scrollHeight
                  if (h) setFrameHeight(h + 40)
                } catch {}
              }}
              style={{ width: "100%", height: frameHeight, border: "none", display: "block" }}
              title="Email preview"
            />
          ) : (
            <div style={{ height: 600, display: "flex", alignItems: "center", justifyContent: "center", background: "#0A0E1A" }}>
              <span style={{ fontFamily: mono, fontSize: 13, letterSpacing: ".2em", color: "#8B93A7" }}>Loading...</span>
            </div>
          )}
        </div>
      </div>

    </main>
  )
}
