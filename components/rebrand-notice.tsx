"use client"

import { useEffect, useState } from "react"

/**
 * "GoTime Motorsports is now PaddockGavin."
 *
 * gotimemotorsports.com redirects here, and a redirect on its own tells the
 * visitor nothing: they typed one brand and landed on another, which reads as a
 * hijack rather than a rename. This says what happened, once, and then stops.
 *
 * It shows when the visitor arrived from the old domain, by the ?from=gotime
 * the redirect appends or by the referrer when a client sends one. Dismissal is
 * remembered, so nobody sees it twice.
 *
 * Bottom anchored on purpose. The nav is fixed at the top with the scroll bar
 * above it, and a second fixed strip up there would fight both.
 */

const KEY = "pg.rebrand.gotime.v1"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"

export function RebrandNotice() {
  const [show, setShow] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    let dismissed = false
    try {
      dismissed = window.localStorage.getItem(KEY) === "1"
    } catch {
      // Private mode and blocked site data both throw. Showing the notice is the
      // safe failure: it is one line and it can be closed.
    }
    if (dismissed) return

    const params = new URLSearchParams(window.location.search)
    const flagged = params.get("from") === "gotime"
    const referred = /(^|\.)gotimemotorsports\.com$/i.test(
      (() => {
        try {
          return new URL(document.referrer).hostname
        } catch {
          return ""
        }
      })(),
    )
    if (flagged || referred) setShow(true)
  }, [])

  function close() {
    setLeaving(true)
    try {
      window.localStorage.setItem(KEY, "1")
    } catch {
      // Nothing to do. It reappears next visit, which is better than crashing.
    }
    window.setTimeout(() => setShow(false), 240)
  }

  if (!show) return null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        left: "max(12px, env(safe-area-inset-left))",
        right: "max(12px, env(safe-area-inset-right))",
        bottom: "max(12px, env(safe-area-inset-bottom))",
        zIndex: 90,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <style>{`
        @keyframes pgRebrandIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        .pgRebrand{animation:pgRebrandIn .34s cubic-bezier(.22,.61,.36,1) both}
        .pgRebrand[data-leaving="true"]{opacity:0;transform:translateY(10px);transition:opacity .22s ease,transform .22s ease}
        .pgRebrandRow{flex-direction:row;align-items:center;gap:16px}
        @media (max-width:560px){.pgRebrandRow{flex-direction:column;align-items:flex-start;gap:10px}}
        @media (prefers-reduced-motion:reduce){
          .pgRebrand{animation:none}
          .pgRebrand[data-leaving="true"]{transition:none}
        }
      `}</style>

      <div
        className="pgRebrand"
        data-leaving={leaving}
        style={{
          pointerEvents: "auto",
          width: "min(760px, 100%)",
          display: "flex",
          padding: "13px 15px 13px 17px",
          borderRadius: 14,
          background: "rgba(13,24,38,.93)",
          border: "1px solid rgba(255,255,255,.14)",
          boxShadow: "0 14px 38px rgba(0,0,0,.42)",
          backdropFilter: "blur(18px) saturate(150%)",
          WebkitBackdropFilter: "blur(18px) saturate(150%)",
        }}
      >
        <div className="pgRebrandRow" style={{ display: "flex", flex: "1 1 auto", minWidth: 0 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 9, flex: "1 1 auto", minWidth: 0 }}>
            <i
              aria-hidden="true"
              style={{ width: 7, height: 7, borderRadius: "50%", background: "#F2C94C", flex: "0 0 auto" }}
            />
            <span style={{ fontFamily: ARCHIVO, fontSize: 14.5, lineHeight: 1.45, color: "#EDF1F6" }}>
              <b style={{ fontWeight: 800 }}>GoTime Motorsports is now PaddockGavin.</b>{" "}
              <span style={{ color: "#A9B4C2" }}>
                Same person, same cars, new name. You are in the right place.
              </span>
            </span>
          </span>

          <button
            type="button"
            onClick={close}
            style={{
              flex: "0 0 auto",
              fontFamily: MONO,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#0A1523",
              background: "#F2C94C",
              border: 0,
              borderRadius: 9,
              padding: "9px 15px",
              cursor: "pointer",
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
