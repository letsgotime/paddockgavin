"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

type Status = "idle" | "sending" | "sent" | "error"

export function HomeAskMe() {
  const [msg, setMsg] = useState("")
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
      style={{ display: "flex", flexWrap: "wrap", gap: "clamp(14px,2.4vw,22px)" }}
    >
      {/* Left: Ask me form */}
      <div
        style={{
          flex: "6 1 300px",
          minWidth: 0,
          position: "relative",
          background: "linear-gradient(150deg,rgba(255,255,255,.07),rgba(255,255,255,.015))",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          border: "1px solid rgba(255,255,255,.12)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
          clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
          padding: "clamp(24px,3.4vw,38px)",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <Image
          src="/images/cage-rig.webp"
          alt=""
          aria-hidden
          fill
          style={{ objectFit: "cover", objectPosition: "right center", opacity: 0.45, zIndex: -1 }}
        />
        <span
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, zIndex: -1,
            background: "linear-gradient(100deg,rgba(14,26,42,.97) 0%,rgba(14,26,42,.9) 55%,rgba(14,26,42,.66) 100%)",
          }}
        />
        <span
          style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#F8B800", padding: "6px 16px", alignSelf: "flex-start" }}
        >
          <span
            style={{
              display: "inline-block", transform: "skewX(12deg)",
              fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 12.5,
              letterSpacing: ".16em", textTransform: "uppercase", color: "#101010",
            }}
          >
            Ask me anything
          </span>
        </span>
        <h2
          style={{
            margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900,
            fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.02, letterSpacing: "-.024em",
            textTransform: "uppercase", color: "#FFFFFF", maxWidth: "14ch",
          }}
        >
          Send it and{" "}
          <span style={{ color: "#F8B800" }}>I&apos;ll answer</span>
        </h2>
        <p
          style={{
            margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 17,
            lineHeight: 1.58, color: "#C4CBD6", maxWidth: "52ch",
          }}
        >
          A question for the camera, a date you want on the floor, or a brand deal. Same inbox for all of it, and I&apos;m the one reading it.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            href="https://ig.me/m/itspaddockgavin"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center",
              fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15,
              letterSpacing: ".04em", textTransform: "uppercase",
              background: "#F8B800", color: "#101010", padding: "15px 26px",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
              textDecoration: "none",
            }}
          >
            DM @itspaddockgavin
          </a>
          <Link
            href="/connect"
            style={{
              display: "inline-flex", alignItems: "center",
              fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15,
              letterSpacing: ".04em", textTransform: "uppercase",
              color: "#EDF1F6", border: "1px solid rgba(255,255,255,.28)", padding: "15px 26px",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
              textDecoration: "none",
            }}
          >
            Every link
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 18 }}>
          <label
            htmlFor="pg-msg"
            style={{
              fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
              fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F",
            }}
          >
            Or write it here
          </label>
          <textarea
            id="pg-msg"
            value={msg}
            onChange={e => setMsg(e.target.value)}
            rows={3}
            placeholder="What do you need?"
            style={{
              background: "rgba(10,21,35,.55)",
              border: "1px solid rgba(255,255,255,.18)",
              color: "#EDF1F6",
              fontFamily: "Archivo,'Helvetica Neue',Helvetica,Arial,sans-serif",
              fontSize: 16,
              lineHeight: 1.55,
              padding: "14px 16px",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
              resize: "vertical",
              minHeight: 88,
              width: "100%",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={submit}
            style={{
              alignSelf: "flex-start",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: 14.5,
              letterSpacing: ".04em",
              textTransform: "uppercase",
              background: "rgba(255,255,255,.05)",
              color: status === "sent" ? "#00D2BE" : "#EDF1F6",
              border: "1px solid rgba(255,255,255,.24)",
              padding: "14px 24px",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
            }}
          >
            {status === "sent" ? "Sent \u2014 I\u2019ll answer" : status === "sending" ? "Sending\u2026" : "Send it"}
          </button>
          <span
            style={{
              fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
              fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#91918F",
            }}
          >
            {status === "error" ? "Could not send \u2014 DM @itspaddockgavin instead" : status === "sent" ? "Landed in my inbox" : ""}
          </span>
        </div>
      </div>

      {/* Right: Car intake CTA */}
      <div
        style={{
          flex: "4 1 240px",
          minWidth: 0,
          position: "relative",
          background: "linear-gradient(150deg,rgba(0,81,133,.9),rgba(0,81,133,.68))",
          backdropFilter: "blur(22px) saturate(150%)",
          WebkitBackdropFilter: "blur(22px) saturate(150%)",
          border: "1px solid #0A6BAA",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)",
          clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
          padding: "clamp(22px,3vw,32px)",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          justifyContent: "center",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <Image
          src="/images/veyron-front.webp"
          alt=""
          aria-hidden
          fill
          style={{ objectFit: "cover", opacity: 0.24, zIndex: -1 }}
        />
        <span
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, zIndex: -1,
            background: "linear-gradient(180deg,rgba(0,50,82,.55),rgba(0,40,66,.72))",
          }}
        />
        <span
          style={{
            fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
            fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#CFE4F4",
          }}
        >
          Want one of these
        </span>
        <p
          style={{
            margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: 17,
            lineHeight: 1.58, color: "#CFE4F4",
          }}
        >
          Tell me the spec and the budget and I&apos;ll go looking. The deal runs on duPont REGISTRY&apos;s licence with their sales team, and the fee to you is zero.
        </p>
        <Link
          href="/intake"
          style={{
            alignSelf: "flex-start",
            display: "inline-flex", alignItems: "center",
            fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 15,
            letterSpacing: ".04em", textTransform: "uppercase",
            color: "#101010", background: "#F8B800", padding: "15px 26px",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
            textDecoration: "none",
          }}
        >
          Tell me the spec
        </Link>
      </div>
    </section>
  )
}
