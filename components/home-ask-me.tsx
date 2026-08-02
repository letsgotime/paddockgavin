"use client"

import { useState } from "react"

type Status = "idle" | "sending" | "sent" | "error"

export function HomeAskMe() {
  const [message, setMessage] = useState("")
  const [reach, setReach]     = useState("")
  const [status, setStatus]   = useState<Status>("idle")

  const submit = async () => {
    if (!message.trim() || status === "sending") return
    setStatus("sending")
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "ask-me",
          message: message.trim(),
          reach: reach.trim() || undefined,
          page: "/",
        }),
      })
      setStatus(res.ok ? "sent" : "error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section
      data-screen-label="Ask me"
      id="ask-me"
      style={{
        background: "linear-gradient(150deg,rgba(255,255,255,.07),rgba(255,255,255,.015))",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        border: "1px solid rgba(255,255,255,.12)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
        clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
        padding: "clamp(22px,3.2vw,36px)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span
          style={{
            display: "inline-block",
            transform: "skewX(-12deg)",
            background: "#00D2BE",
            padding: "6px 16px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              transform: "skewX(12deg)",
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: 12.5,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "#00302B",
            }}
          >
            Ask me
          </span>
        </span>
      </div>

      <h2
        style={{
          margin: 0,
          fontFamily: "Archivo, Helvetica, sans-serif",
          fontWeight: 900,
          fontSize: "clamp(26px,3.8vw,42px)",
          lineHeight: 1.02,
          letterSpacing: "-.024em",
          textTransform: "uppercase",
          color: "#FFFFFF",
          maxWidth: "22ch",
        }}
      >
        A car, an event, a build.{" "}
        <span style={{ color: "#00D2BE" }}>Drop it here.</span>
      </h2>

      <p
        style={{
          margin: 0,
          fontFamily: "Archivo, Helvetica, sans-serif",
          fontSize: 17,
          lineHeight: 1.58,
          color: "#C4CBD6",
          maxWidth: "54ch",
        }}
      >
        Whatever&apos;s on your mind &mdash; a car you&apos;re looking for, an event you want to host, a build you want to start. Send it. I read everything.
      </p>

      {status === "sent" ? (
        <div
          style={{
            padding: "clamp(18px,3vw,26px)",
            background: "rgba(0,210,190,.10)",
            border: "1px solid rgba(0,210,190,.30)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: 17,
              color: "#00D2BE",
            }}
          >
            Got it. I&apos;ll be in touch.
          </p>
          <p
            style={{
              margin: "6px 0 0",
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontSize: 15,
              color: "#B4B6B2",
            }}
          >
            In the meantime, DM{" "}
            <a
              href="https://instagram.com/itspaddockgavin"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00D2BE" }}
            >
              @itspaddockgavin
            </a>{" "}
            on Instagram.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind?"
            rows={5}
            style={{
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontSize: 16,
              lineHeight: 1.55,
              color: "#EDF1F6",
              background: "rgba(21,37,56,.6)",
              border: "1px solid rgba(255,255,255,.18)",
              padding: "16px 18px",
              resize: "vertical",
              outline: "none",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <input
            type="text"
            value={reach}
            onChange={(e) => setReach(e.target.value)}
            placeholder="How should I reach you? (optional — Instagram, phone, etc.)"
            style={{
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontSize: 15,
              color: "#EDF1F6",
              background: "rgba(21,37,56,.6)",
              border: "1px solid rgba(255,255,255,.18)",
              padding: "14px 18px",
              outline: "none",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={submit}
              disabled={!message.trim() || status === "sending"}
              style={{
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: ".04em",
                textTransform: "uppercase",
                background: message.trim() ? "#00D2BE" : "rgba(0,210,190,.3)",
                color: "#00302B",
                padding: "15px 28px",
                border: "none",
                cursor: message.trim() ? "pointer" : "default",
                clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
                transition: "background .18s",
              }}
            >
              {status === "sending" ? "Sending\u2026" : "Send it"}
            </button>
            {status === "error" && (
              <span
                style={{
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontSize: 14,
                  color: "#F87171",
                }}
              >
                Something went wrong. DM{" "}
                <a
                  href="https://instagram.com/itspaddockgavin"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#F87171" }}
                >
                  @itspaddockgavin
                </a>{" "}
                instead.
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
