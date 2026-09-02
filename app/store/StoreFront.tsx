"use client"

import { useState } from "react"
import { DONATION_MIN, DONATION_MAX, DONATION_SUGGESTED, money, type StoreItem } from "@/lib/shop/store"

/**
 * The store, in three honest states.
 *
 * A card either takes money, sends you to a conversation, or says it is not
 * ready. There is no fourth state where a price is guessed to make the page
 * look finished.
 */

const INK = "#0A1523"
const PAPER = "#EDF1F6"
const MUTED = "#9FAAB8"
const LINE = "rgba(255,255,255,.14)"
const GLASS = "rgba(18,32,50,.72)"
const RED_FILL = "#E5141A"
const RED_TEXT = "#FF1A21"
const GREEN = "#00D2BE"
const DISPLAY = "Cinzel, Georgia, serif"
const BODY = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

export default function StoreFront({ items }: { items: StoreItem[] }) {
  const groups: StoreItem["group"][] = ["Giving", "Tickets", "Merchandise"]
  return (
    <main
      style={{
        background: INK,
        minHeight: "100dvh",
        padding:
          "max(28px, env(safe-area-inset-top)) 16px max(40px, env(safe-area-inset-bottom))",
        fontFamily: BODY,
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Archivo:wght@400;600;700&display=swap"
      />
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ height: 3, width: 48, background: RED_FILL, borderRadius: 2 }} />
        <p style={{ margin: "18px 0 6px", font: `700 11px/1 ${MONO}`, letterSpacing: ".2em", textTransform: "uppercase", color: RED_TEXT }}>
          October 10, 2026
        </p>
        <h1 style={{ margin: "0 0 12px", fontFamily: DISPLAY, fontWeight: 700, color: PAPER, fontSize: "clamp(30px,7vw,44px)", lineHeight: 1.06 }}>
          The store
        </h1>
        <p style={{ margin: "0 0 30px", color: MUTED, fontSize: 17, lineHeight: 1.6, maxWidth: "60ch" }}>
          Spectating is free and always will be. What is here is for anybody who wants to give to the
          school, sit closer, or take something home.
        </p>

        {groups.map((g) => {
          const inGroup = items.filter((i) => i.group === g)
          if (!inGroup.length) return null
          return (
            <section key={g} style={{ marginBottom: 34 }}>
              <h2 style={{ margin: "0 0 12px", fontFamily: DISPLAY, fontWeight: 700, color: PAPER, fontSize: 22 }}>{g}</h2>
              <div style={{ display: "grid", gap: 12 }}>
                {inGroup.map((i) =>
                  i.openAmount ? <Give key={i.slug} item={i} /> : <Card key={i.slug} item={i} />,
                )}
              </div>
            </section>
          )
        })}

        <p style={{ margin: "6px 0 0", color: MUTED, fontSize: 14.5, lineHeight: 1.6 }}>
          Payments are handled by Stripe. Nothing on this page stores a card.
        </p>
      </div>
    </main>
  )
}

/* ------------------------------------------------------------------ a card */

function Card({ item }: { item: StoreItem }) {
  const tone = item.availability === "buy" ? GREEN : item.availability === "ask" ? "#F2C94C" : MUTED
  return (
    <article style={shell(tone)}>
      <Head item={item} tone={tone} />
      {item.availability === "ask" && item.askHref && (
        <a href={item.askHref} style={btn(false)}>{item.askLabel || "Ask"}</a>
      )}
      {item.availability === "soon" && (
        <p style={{ margin: 0, color: MUTED, fontSize: 14.5 }}>
          Not priced yet. It goes on sale here the day it is.
        </p>
      )}
      {item.availability === "buy" && item.cents ? (
        <p style={{ margin: 0, color: PAPER, font: `700 17px/1 ${BODY}` }}>{money(item.cents)}</p>
      ) : null}
    </article>
  )
}

function Head({ item, tone }: { item: StoreItem; tone: string }) {
  return (
    <>
      <p style={{ margin: "0 0 8px", font: `700 11px/1 ${MONO}`, letterSpacing: ".16em", textTransform: "uppercase", color: tone }}>
        {item.availability === "buy" ? "Available" : item.availability === "ask" ? "By conversation" : "Not yet"}
      </p>
      <h3 style={{ margin: "0 0 6px", color: PAPER, font: `700 19px/1.3 ${BODY}` }}>{item.name}</h3>
      <p style={{ margin: "0 0 14px", color: MUTED, fontSize: 15.5, lineHeight: 1.6 }}>{item.blurb}</p>
    </>
  )
}

/* ------------------------------------------------------------------ giving */

function Give({ item }: { item: StoreItem }) {
  const [cents, setCents] = useState<number>(DONATION_SUGGESTED[1])
  const [custom, setCustom] = useState("")
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)

  /* The typed figure wins when it is a real one, so a suggestion never
     overrides what somebody deliberately entered. */
  const typed = Math.round(parseFloat(custom.replace(/[^0-9.]/g, "")) * 100)
  const amount = custom.trim() && Number.isFinite(typed) ? typed : cents
  const valid = Number.isInteger(amount) && amount >= DONATION_MIN && amount <= DONATION_MAX

  const go = async () => {
    if (!valid) {
      setProblem(`Give between ${money(DONATION_MIN)} and ${money(DONATION_MAX)}.`)
      return
    }
    setBusy(true)
    setProblem(null)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: "donation", amountCents: amount }),
      })
      const data = await res.json().catch(() => null)
      if (res.status === 503) {
        setProblem("Giving is not switched on yet. It will be before the day.")
      } else if (!res.ok || !data?.url) {
        setProblem(data?.detail || "We could not open the payment page. Try again in a moment.")
      } else {
        window.location.assign(data.url)
        return
      }
    } catch {
      setProblem("We could not reach the payment page. Check your connection.")
    }
    setBusy(false)
  }

  return (
    <article style={shell(GREEN)}>
      <Head item={item} tone={GREEN} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {DONATION_SUGGESTED.map((c) => {
          const on = !custom.trim() && cents === c
          return (
            <button
              key={c}
              type="button"
              onClick={() => { setCents(c); setCustom("") }}
              style={{
                font: `700 15px/1 ${BODY}`, cursor: "pointer", borderRadius: 10, padding: "12px 16px",
                color: on ? "#FFFFFF" : PAPER,
                background: on ? RED_FILL : "rgba(10,21,35,.86)",
                border: `1px solid ${on ? RED_FILL : LINE}`,
              }}
            >
              {money(c)}
            </button>
          )
        })}
      </div>
      <label htmlFor="give" style={{ display: "block", font: `600 13px/1.6 ${BODY}`, color: MUTED }}>
        Or another amount
      </label>
      <input
        id="give"
        inputMode="decimal"
        placeholder="$"
        value={custom}
        onChange={(e) => setCustom(e.target.value)}
        style={{
          width: "100%", boxSizing: "border-box", fontSize: 16, fontFamily: BODY, color: PAPER,
          background: "rgba(10,21,35,.86)", border: `1px solid ${LINE}`, borderRadius: 10,
          padding: "13px 14px", marginBottom: 12,
        }}
      />
      <button type="button" onClick={go} disabled={busy} style={{ ...btn(true), opacity: busy ? 0.65 : 1 }}>
        {busy ? "One moment" : `Give ${valid ? money(amount) : ""}`.trim()}
      </button>
      {problem && (
        <p style={{ margin: "12px 0 0", color: PAPER, fontSize: 15, lineHeight: 1.55 }}>{problem}</p>
      )}
    </article>
  )
}

/* ------------------------------------------------------------------ pieces */

function shell(accent: string): React.CSSProperties {
  return {
    background: GLASS,
    border: `1px solid ${LINE}`,
    borderLeft: `3px solid ${accent}`,
    borderRadius: 14,
    padding: "18px 20px",
  }
}

function btn(solid: boolean): React.CSSProperties {
  return {
    display: "inline-block", width: solid ? "100%" : undefined, textAlign: "center",
    font: `700 14px/1 ${BODY}`, letterSpacing: ".04em", textTransform: "uppercase",
    color: "#FFFFFF", background: solid ? RED_FILL : "transparent",
    border: `1px solid ${solid ? RED_FILL : LINE}`, borderRadius: 11,
    padding: "14px 20px", textDecoration: "none", cursor: "pointer",
  }
}
