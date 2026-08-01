"use client"

import type React from "react"
import { useState } from "react"
import { SERVICES_OPTIONS, BUDGET_OPTIONS } from "@/lib/project-data"

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  padding: "0 14px",
  background: "#0C1929",
  border: "1px solid var(--line)",
  color: "#E6EAF0",
  fontFamily: "inherit",
  fontSize: 15,
  outline: "none",
  clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10.5,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--steel-deep)",
  display: "block",
  marginBottom: 8,
}

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
    budget: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div
        className="notch-panel"
        style={{
          background: "var(--panel)",
          border: "1px solid var(--line)",
          padding: "clamp(24px, 4vw, 34px)",
          position: "relative",
          animation: "fadeInUp 0.5s ease-out both",
        }}
      >
        {/* Yellow accent rule */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: "var(--green)",
          }}
        />
        <div className="lights mb-4">
          <i className="on" /><i className="on" /><i className="on" /><i className="on" /><i className="on" />
          <em
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--steel-deep)",
              fontStyle: "normal",
              marginLeft: 8,
            }}
          >
            Message sent
          </em>
        </div>
        <h3
          className="font-display uppercase text-white tracking-[-0.02em] leading-[1.02]"
          style={{ fontSize: 22 }}
        >
          Received.{" "}
          <span style={{ color: "var(--green)" }}>On it.</span>
        </h3>
        <p style={{ color: "var(--steel)", fontSize: 14, marginTop: 8 }}>
          Typical response is same day during Nashville business hours.
        </p>
      </div>
    )
  }

  return (
    <div style={{ animation: "fadeInUp 0.6s ease-out both" }}>
      {/* Section header */}
      <div
        style={{ borderTop: "1px solid var(--line)", paddingTop: 32, marginBottom: 28 }}
      >
        <div className="sector-tab w-fit mb-4"><i>Start a conversation</i></div>
        <h2
          className="font-display uppercase text-white tracking-[-0.02em] leading-[1.02] text-balance"
          style={{ fontSize: "clamp(20px, 3vw, 30px)", marginBottom: 8 }}
        >
          What are you working on?
        </h2>
        <p style={{ color: "var(--steel)", fontSize: 14 }}>
          Lot ops, software, detailing questions — anything works.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              placeholder="Your name"
              style={inputStyle}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              onFocus={(e) =>
                ((e.target as HTMLElement).style.borderColor = "var(--green)")
              }
              onBlur={(e) =>
                ((e.target as HTMLElement).style.borderColor = "var(--line)")
              }
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              style={inputStyle}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              onFocus={(e) =>
                ((e.target as HTMLElement).style.borderColor = "var(--green)")
              }
              onBlur={(e) =>
                ((e.target as HTMLElement).style.borderColor = "var(--line)")
              }
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Topic</label>
          <div style={{ position: "relative" }}>
            <select
              style={{ ...inputStyle, appearance: "none", paddingRight: 40, cursor: "pointer", color: formData.service ? "#E6EAF0" : "var(--steel-deep)" }}
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              required
              onFocus={(e) =>
                ((e.target as HTMLElement).style.borderColor = "var(--green)")
              }
              onBlur={(e) =>
                ((e.target as HTMLElement).style.borderColor = "var(--line)")
              }
            >
              <option value="" disabled>Select a topic…</option>
              {SERVICES_OPTIONS.map((opt) => (
                <option key={opt} value={opt} style={{ background: "var(--panel)", color: "#E6EAF0" }}>{opt}</option>
              ))}
            </select>
            <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--steel-deep)" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 5.5L7 9.5L11 5.5" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Message</label>
          <textarea
            placeholder="What&apos;s on your mind?"
            style={{
              ...inputStyle,
              height: 100,
              padding: "12px 14px",
              resize: "none",
              clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 11px), calc(100% - 11px) 100%, 0 100%)",
            }}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            onFocus={(e) =>
              ((e.target as HTMLElement).style.borderColor = "var(--green)")
            }
            onBlur={(e) =>
              ((e.target as HTMLElement).style.borderColor = "var(--line)")
            }
          />
        </div>

        <div>
          <label style={labelStyle}>Budget (if applicable)</label>
          <div style={{ position: "relative" }}>
            <select
              style={{ ...inputStyle, appearance: "none", paddingRight: 40, cursor: "pointer", color: formData.budget ? "#E6EAF0" : "var(--steel-deep)" }}
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              onFocus={(e) =>
                ((e.target as HTMLElement).style.borderColor = "var(--green)")
              }
              onBlur={(e) =>
                ((e.target as HTMLElement).style.borderColor = "var(--line)")
              }
            >
              <option value="">Not applicable</option>
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt} value={opt} style={{ background: "var(--panel)", color: "#E6EAF0" }}>{opt}</option>
              ))}
            </select>
            <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--steel-deep)" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 5.5L7 9.5L11 5.5" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
          <div className="lights">
            <i className="on" /><i className="on" /><i /><i /><i />
            <em
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                letterSpacing: "0.18em",
                textTransform: "uppercase" as const,
                color: "var(--steel-deep)",
                fontStyle: "normal",
                marginLeft: 8,
              }}
            >
              Same-day response
            </em>
          </div>

          <button
            type="submit"
            className="notch-btn font-sans font-bold uppercase tracking-[0.04em] transition-colors"
            style={{
              fontSize: 15,
              padding: "13px 28px",
              background: "var(--yellow)",
              color: "#101010",
              border: "none",
              cursor: "pointer",
              minWidth: 180,
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "var(--yellow-hi)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "var(--yellow)")
            }
          >
            Send message
          </button>
        </div>
      </form>
    </div>
  )
}
