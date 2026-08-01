"use client"

import { useState, useEffect } from "react"
import { AboutModal } from "./about-modal"

const CREDENTIALS = [
  { stat: "$125M+/mo", label: "DRX Lot Assistant™ · Active retainer" },
  { stat: "78 cars", label: "Brokered · Buyer fee $0" },
  { stat: "$1.2B+", label: "Revenue driven · Career" },
  { stat: "$64M+", label: "Tires & Timepieces™ · Display assets" },
]

export const DesignSidebar = () => {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx((p) => (p + 1) % CREDENTIALS.length)
        setVisible(true)
      }, 280)
    }, 4800)
    return () => clearInterval(t)
  }, [])

  return (
    <nav
      className="flex flex-col w-full h-full"
      style={{ background: "var(--panel)", borderRight: "1px solid var(--line)" }}
    >
      {/* 4-colour livery bar */}
      <div className="bars flex-shrink-0"><i /><i /><i /><i /></div>

      <div
        className="flex flex-col flex-1 justify-between overflow-y-auto"
        style={{ padding: "clamp(28px, 4vw, 44px)" }}
      >
        {/* ── IDENTITY ── */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="eyebrow mb-2">Agentic Engineering Studio</p>
            <h1
              className="font-display uppercase text-white leading-[0.96] tracking-[-0.02em]"
              style={{ fontSize: "clamp(28px, 3.8vw, 42px)" }}
            >
              Gavin
              <br />
              Brooks
            </h1>
            <p className="eyebrow mt-3" style={{ color: "var(--steel)" }}>
              Nashville, TN — Paddock20™
            </p>
          </div>

          {/* Accent slash + positioning statement */}
          <div className="flex flex-col gap-3">
            <div className="accent-slash" />
            <p
              className="leading-relaxed text-balance"
              style={{ color: "var(--steel)", fontSize: 14, maxWidth: "32ch" }}
            >
              The person who ran the operation is now building the software.
            </p>
          </div>

          {/* CTAs — inline underline links */}
          <div className="flex items-center gap-6">
            <a
              href="#work"
              className="eyebrow"
              style={{
                color: "var(--yellow)",
                letterSpacing: "0.22em",
                borderBottom: "1px solid var(--yellow)",
                paddingBottom: 2,
                transition: "opacity 0.18s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              See the work ↓
            </a>
            <AboutModal />
          </div>
        </div>

        {/* ── ROTATING CREDENTIAL ── */}
        <div style={{ marginTop: "auto", paddingTop: 40 }}>
          <div style={{ height: 1, background: "var(--line)", marginBottom: 24 }} />

          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.28s ease, transform 0.28s ease",
              minHeight: 72,
            }}
          >
            <p
              className="font-display uppercase"
              style={{
                fontSize: "clamp(26px, 3.2vw, 36px)",
                color: "var(--yellow)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {CREDENTIALS[idx].stat}
            </p>
            <p
              className="eyebrow mt-2"
              style={{ color: "var(--steel-deep)", lineHeight: 1.5 }}
            >
              {CREDENTIALS[idx].label}
            </p>
          </div>

          {/* Pip dots */}
          <div className="flex gap-1.5 mt-4">
            {CREDENTIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Credential ${i + 1}`}
                style={{
                  width: i === idx ? 20 : 5,
                  height: 5,
                  background: i === idx ? "var(--yellow)" : "var(--line)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.28s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── TAGLINE ── */}
        <p
          className="eyebrow"
          style={{ marginTop: 28, color: "var(--line)", fontSize: 9 }}
        >
          Digest. Develop. Deliver.™
        </p>
      </div>
    </nav>
  )
}
