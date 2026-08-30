"use client"

import { useState } from "react"
import { db } from "@/lib/crm/client"

/**
 * "Tell us you are coming."
 *
 * This is the one thing the old /show page did that the combined page did not:
 * it took an RSVP where the visitor already was, instead of sending them to
 * another domain to do it. Entry is free, so this is a headcount rather than a
 * ticket, and the headcount is what tells the caterer, the restroom contract
 * and the parking marshals what Saturday looks like.
 *
 * Writes straight to public.spectators. The insert policy there accepts an
 * anonymous write, which is deliberate: asking a spectator to make an account
 * to say they are coming would cost more names than it protects.
 */

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

type State = "idle" | "sending" | "done" | "error"

export function RsvpBlock({
  eventId,
  accent = "#F2C94C",
  source = "events",
}: {
  eventId: string
  accent?: string
  source?: string
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [party, setParty] = useState("2")
  const [state, setState] = useState<State>("idle")
  const [why, setWhy] = useState("")

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const client = db()
    if (!client) {
      setState("error")
      setWhy("No connection. Try again in a moment.")
      return
    }
    setState("sending")
    const r = await client.from("spectators").insert([
      {
        event_id: eventId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        party_size: Math.max(1, Math.min(20, Number(party) || 1)),
        source,
      },
    ])
    if (r?.error) {
      setState("error")
      setWhy(
        /duplicate|unique/i.test(r.error.message)
          ? "You are already on the list, which is the right answer."
          : "That did not send. Try again, or come anyway: entry is free.",
      )
      return
    }
    setState("done")
  }

  if (state === "done") {
    return (
      <div style={wrap}>
        <div style={{ ...kicker, color: accent }}>You are counted</div>
        <p style={{ ...lede, marginTop: 10 }}>
          Thank you, {name.trim().split(" ")[0] || "friend"}. Nothing else to do: entry is free and
          there is no ticket. We will send parking and timings the week before.
        </p>
      </div>
    )
  }

  return (
    <div style={wrap}>
      <style>{`
        .rsvpPair{grid-template-columns:1fr 1fr}
        @media (max-width:520px){.rsvpPair{grid-template-columns:1fr}}
      `}</style>
      <div style={{ ...kicker, color: accent }}>Free to attend</div>
      <h3 style={h3}>Tell us you are coming</h3>
      <p style={lede}>
        There is no ticket and no charge. The count is what tells us how much food to cook and how
        many restrooms to hire, so saying so genuinely helps.
      </p>

      <form onSubmit={send} style={{ display: "grid", gap: 10, marginTop: 16 }}>
        <div className="rsvpPair" style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 5 }}>
            <span style={lbl}>Your name</span>
            <input
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={input}
            />
          </label>
          <label style={{ display: "grid", gap: 5 }}>
            <span style={lbl}>Email</span>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={input}
            />
          </label>
        </div>
        <label style={{ display: "grid", gap: 5, maxWidth: 190 }}>
          <span style={lbl}>How many of you</span>
          <input
            type="number"
            min={1}
            max={20}
            value={party}
            onChange={(e) => setParty(e.target.value)}
            style={input}
          />
        </label>
        <button
          type="submit"
          disabled={state === "sending"}
          style={{
            ...primary,
            background: accent,
            opacity: state === "sending" ? 0.6 : 1,
            justifySelf: "start",
          }}
        >
          {state === "sending" ? "Sending" : "Count me in"}
        </button>
        {state === "error" ? (
          <p style={{ ...lede, color: "#ef6d70", fontSize: 14, margin: 0 }}>{why}</p>
        ) : null}
      </form>
    </div>
  )
}

const wrap: React.CSSProperties = {
  padding: "24px 26px",
  borderRadius: 18,
  background: "rgba(17,27,40,.58)",
  border: "1px solid rgba(255,255,255,.12)",
  backdropFilter: "blur(20px) saturate(1.5)",
  WebkitBackdropFilter: "blur(20px) saturate(1.5)",
  fontFamily: ARCHIVO,
}
const kicker: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 10.5,
  letterSpacing: ".18em",
  textTransform: "uppercase",
  fontWeight: 600,
}
const h3: React.CSSProperties = {
  margin: "9px 0 0",
  font: `900 clamp(22px,3.4vw,30px)/1.05 ${ARCHIVO}`,
  letterSpacing: "-.026em",
  color: "#fff",
}
const lede: React.CSSProperties = {
  margin: "9px 0 0",
  fontSize: 15,
  lineHeight: 1.55,
  color: "#a9b4c2",
  maxWidth: "56ch",
}
const lbl: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 9.5,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: "#7f8a99",
  fontWeight: 600,
}
const input: React.CSSProperties = {
  font: `400 15px/1.4 ${ARCHIVO}`,
  color: "#fff",
  background: "rgba(0,0,0,.3)",
  border: "1px solid rgba(255,255,255,.13)",
  borderRadius: 10,
  padding: "10px 12px",
  width: "100%",
}
const primary: React.CSSProperties = {
  font: `900 14.5px/1 ${ARCHIVO}`,
  color: "#04211d",
  border: 0,
  borderRadius: 12,
  padding: "13px 24px",
  cursor: "pointer",
  marginTop: 4,
}
