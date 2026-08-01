"use client"

import { useState, useEffect } from "react"
import { AboutModal } from "./about-modal"

const STATS = [
  { label: "Base", value: "Nashville, TN" },
  { label: "Lot", value: "70,000 sq ft" },
  { label: "Owned", value: "29" },
  { label: "Years", value: "30+" },
]

const CREDENTIALS = [
  {
    quote:
      "Everything that lands in the lot comes through lot ops first. Some mornings that's one car still warm off the truck. Some it's four Ferraris and nowhere to walk.",
    label: "Lot Ops · duPont REGISTRY",
  },
  {
    quote:
      "78 cars brokered. Your fee: $0. The value is the access — knowing what the market has been doing with a car before you decide what to do with it.",
    label: "SupercarIQ · Market intel",
  },
  {
    quote:
      "Paint correction is a long argument with the surface. It takes what it takes. The results are the same cars you've been watching in the videos.",
    label: "Detailing · The Gloss Game",
  },
]

export const DesignSidebar = () => {
  const [credentialIndex, setCredentialIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCredentialIndex((prev) => (prev + 1) % CREDENTIALS.length)
        setVisible(true)
      }, 300)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  return (
    <nav
      className="flex flex-col justify-between w-full h-full overflow-hidden select-none"
      style={{ background: "var(--panel)", borderRight: "1px solid var(--line)" }}
    >
      {/* Garage-door bar at top */}
      <div className="bars"><i /><i /><i /><i /></div>

      <div className="flex flex-col flex-1 justify-between p-8 overflow-y-auto">
        {/* Top: Driver plate + hero copy */}
        <div className="flex flex-col gap-7">
          {/* Driver plate */}
          <p className="driver-plate mt-2">
            <strong style={{ color: "#fff", fontWeight: 700 }}>Gavin Paddock</strong>
            <span style={{ color: "var(--steel-deep)", margin: "0 6px" }}>·</span>
            Nashville, TN
          </p>

          {/* Race number watermark + headline */}
          <div className="relative">
            <div
              className="racenum absolute -top-4 -right-4 pointer-events-none opacity-100 select-none"
              aria-hidden="true"
            >
              20
            </div>
            <div className="relative">
              <div className="sector-tab mb-3">
                <i>Who you&apos;re dealing with</i>
              </div>
              <h1
                className="font-display uppercase text-white text-balance leading-[1.02] tracking-[-0.02em]"
                style={{ fontSize: "clamp(26px, 4.2vw, 40px)", marginBottom: 0 }}
              >
                Nobody gets used to this.
                <br />
                <span style={{ color: "var(--yellow)" }}>Stopped trying.</span>
              </h1>
            </div>
          </div>

          {/* Lede */}
          <p
            className="text-balance leading-relaxed"
            style={{
              color: "#C4CBD6",
              fontSize: "clamp(15px, 1.8vw, 17px)",
              maxWidth: "52ch",
            }}
          >
            Lot operations manager at duPont REGISTRY by day. Detailer, car nerd,
            and software builder by night. The same person in all three jobs.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <a
              href="#work"
              className="notch-btn inline-flex items-center justify-center gap-2 font-sans font-bold uppercase tracking-[0.04em] transition-colors"
              style={{
                fontSize: 15,
                padding: "15px 26px",
                background: "var(--yellow)",
                color: "#101010",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "var(--yellow-hi)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "var(--yellow)")
              }
            >
              See the garage
            </a>
            <AboutModal />
          </div>
        </div>

        {/* Middle: Telemetry */}
        <div className="mt-8">
          <div className="telemetry w-full flex-wrap">
            {STATS.map((s) => (
              <span key={s.label}>
                {s.label} <b>{s.value}</b>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom: Rotating credential quotes */}
        <div className="mt-8">
          <div className="kerb-green mb-5" />
          <div className="relative overflow-hidden" style={{ minHeight: 110 }}>
            <div
              key={credentialIndex}
              className="flex flex-col gap-2"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(-10px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              <p
                className="italic leading-relaxed text-balance"
                style={{ color: "var(--steel)", fontSize: 13 }}
              >
                &ldquo;{CREDENTIALS[credentialIndex].quote}&rdquo;
              </p>
              <p
                className="font-mono uppercase tracking-widest"
                style={{ color: "var(--steel-deep)", fontSize: 10.5 }}
              >
                {CREDENTIALS[credentialIndex].label}
              </p>
            </div>

            {/* Pagination dots */}
            <div className="flex gap-1.5 mt-4">
              {CREDENTIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCredentialIndex(i)}
                  aria-label={`View credential ${i + 1}`}
                  className="transition-all"
                  style={{
                    width: i === credentialIndex ? 18 : 6,
                    height: 6,
                    background:
                      i === credentialIndex ? "var(--green)" : "var(--line)",
                    border: "none",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
