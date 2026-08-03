"use client"

import { useState, useEffect } from "react"
import SubscriberWelcome from "@/emails/subscriber-welcome"
import WireframeDigestIssue from "@/emails/wireframe-digest-issue"
import IntakeConfirmation from "@/emails/intake-confirmation"
import { render } from "@react-email/render"

const arch = "Archivo, Helvetica, sans-serif"
const mono = "ui-monospace, 'Courier New', Courier, monospace"

const TEMPLATES = [
  { id: "welcome",    label: "Subscriber Welcome" },
  { id: "digest",     label: "Wireframe Digest" },
  { id: "intake",     label: "Intake Confirmation" },
] as const

type TemplateId = typeof TEMPLATES[number]["id"]

async function getHtml(id: TemplateId): Promise<string> {
  if (id === "welcome")  return render(SubscriberWelcome({ source: "juice-box" }))
  if (id === "digest")   return render(WireframeDigestIssue({
    issueNumber: "012",
    issueDate:   "August 2026",
    title:       "What Agentic Engineering Actually Looks Like on a $25K Build",
    kicker:      "Agentic Engineering · Cluster 1.1",
    slug:        "what-is-agentic-engineering",
    lede:        "Everyone is calling their intern an AI engineer. Here is what the term actually means when real production software is involved.",
    body:        "The term agentic engineering is new. Andrej Karpathy coined it in early 2025 and the internet immediately turned it into a buzzword.\n\nHere is what it actually means in practice on a real build.\n\nIt means the engineer already knows how to do the work — manually, with legacy tools, under pressure. The AI does not replace that knowledge. It accelerates it. The leverage point is not the AI. It is the person who has run the operation and now writes the software.",
    linkedInPost: "Everyone is using AI. Not everyone knows what they are building.\n\nNew post: what agentic engineering actually looks like on a $25K build.\n\n→ paddockgavin.com/blog/what-is-agentic-engineering",
    instagramCaption: "AI doesn't replace the operator. It accelerates one.\n\nNew post in the Wireframe Digest. Link in bio.\n\n#agenticengineering #buildinpublic #paddockgavin",
  }))
  if (id === "intake") return render(IntakeConfirmation({
    firstName: "Marcus",
    make:      "Porsche",
    model:     "GT3",
    year:      "2024",
    budget:    "$200,000 – $220,000",
    notes:     "PTS preferred, manual only, no PDK.",
    refNumber: "PG-2026-0047",
  }))
  return ""
}

export default function EmailPreviewPage() {
  const [active, setActive] = useState<TemplateId>("welcome")
  const [html, setHtml]     = useState<string>("")
  const [loaded, setLoaded] = useState<TemplateId | null>(null)

  async function load(id: TemplateId) {
    setActive(id)
    if (loaded === id) return
    const result = await getHtml(id)
    setHtml(result)
    setLoaded(id)
  }

  // Load default on mount
  useEffect(() => { load("welcome") }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main style={{ background: "#0A0E1A", minHeight: "100vh", fontFamily: arch }}>

      {/* ── Toolbar ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#0E1A2A", borderBottom: "1px solid rgba(255,255,255,.1)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#8B93A7", flex: "0 0 auto" }}>
          Email Preview
        </span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => load(t.id)}
              style={{
                padding: "8px 16px",
                fontFamily: arch,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: ".06em",
                cursor: "pointer",
                border: `1px solid ${active === t.id ? "#F2C94C" : "rgba(255,255,255,.15)"}`,
                background: active === t.id ? "rgba(239,74,24,.12)" : "transparent",
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

      {/* ── Preview frame ── */}
      <div style={{ display: "flex", justifyContent: "center", padding: "32px 16px" }}>
        <div style={{ width: "100%", maxWidth: 680, background: "#fff", borderRadius: 2, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,.6)" }}>
          {html ? (
            <iframe
              srcDoc={html}
              style={{ width: "100%", height: 900, border: "none", display: "block" }}
              title="Email preview"
            />
          ) : (
            <div style={{ height: 900, display: "flex", alignItems: "center", justifyContent: "center", background: "#0A0E1A" }}>
              <span style={{ fontFamily: mono, fontSize: 13, letterSpacing: ".2em", color: "#8B93A7" }}>Loading...</span>
            </div>
          )}
        </div>
      </div>

    </main>
  )
}
