"use client"

import { useEffect, useRef, useState } from "react"
import { track } from "@vercel/analytics"

/**
 * "Tell us you are coming."
 *
 * Entry is free, so this is a headcount rather than a ticket, and the
 * headcount is what tells the caterer, the restroom contract and the parking
 * marshals what Saturday looks like.
 *
 * Recorded on the server through /api/rsvp, which keeps one row per address,
 * stores the three consents with it, and sends the "you are counted" email.
 * The form used to write the row itself through the browser on an anonymous
 * token that the auth move took away, so it failed quietly for everyone.
 *
 * Two things stand between a script and the list: a honeypot field no person
 * sees, and the same Cloudflare human check the entry, stall and sponsor
 * forms pass. The server decides what to do with a submission that carries
 * no token; the form itself never refuses a person for a box that did not
 * draw.
 */

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const TURNSTILE_SITEKEY = "0x4AAAAAAEkdaaU0WCZzdgGE"

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
    }
  }
}

type State = "idle" | "sending" | "done" | "error"
type Consent = { sms: boolean; event_email: boolean; pg_events: boolean }

export function RsvpBlock({
  eventId,
  accent = "#F2C94C",
  fill,
  onFill,
  source = "events",
}: {
  eventId: string
  /** Small text on a dark ground. Needs contrast against the ground. */
  accent?: string
  /** Button background. Needs its own text to have contrast against IT, which
   *  is a different requirement and therefore a different colour. Passing one
   *  value for both is what turned the button pink on the ranch. */
  fill?: string
  /** Text on the button. White on the ranch red, dark on our amber. */
  onFill?: string
  source?: string
}) {
  const solid = fill || accent
  const onSolid = onFill || "#04211d"
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [party, setParty] = useState("2")
  const [consent, setConsent] = useState<Consent>({ sms: false, event_email: true, pg_events: false })
  const [fax, setFax] = useState("")
  const [state, setState] = useState<State>("idle")
  const [again, setAgain] = useState(false)
  const [why, setWhy] = useState("")

  /* The human check, rendered explicitly so the token lands in state. */
  const [ts, setTs] = useState("")
  const [tsState, setTsState] = useState<"loading" | "ready" | "solved" | "failed">("loading")
  const tsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let gone = false
    const render = () => {
      if (gone || !tsRef.current || !window.turnstile) return
      if (tsRef.current.childElementCount > 0) return
      try {
        window.turnstile.render(tsRef.current, {
          sitekey: TURNSTILE_SITEKEY,
          theme: "dark",
          size: "flexible",
          action: "rsvp",
          callback: (t: string) => {
            setTs(t)
            setTsState("solved")
          },
          "expired-callback": () => {
            setTs("")
            setTsState("ready")
          },
          "error-callback": () => {
            setTs("")
            setTsState("failed")
          },
        })
        setTsState((s) => (s === "solved" ? s : "ready"))
      } catch {
        setTsState("failed")
      }
    }
    let booted = false
    let existing: HTMLScriptElement | null = null
    const boot = () => {
      if (booted || gone) return
      booted = true
      if (window.turnstile) {
        render()
        return
      }
      existing = document.querySelector<HTMLScriptElement>('script[src^="https://challenges.cloudflare.com/turnstile"]')
      if (existing) {
        existing.addEventListener("load", render)
        return
      }
      const s = document.createElement("script")
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      s.async = true
      s.defer = true
      s.addEventListener("load", render)
      s.addEventListener("error", () => setTsState("failed"))
      document.head.appendChild(s)
    }
    /* The check is a script and an iframe from Cloudflare, and this form
       sits at the foot of the page. It loads when the form is near, or on
       the first touch of a field, not at page open. */
    const el = tsRef.current
    let io: IntersectionObserver | null = null
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { boot(); io?.disconnect() } }, { rootMargin: "700px 0px" })
      io.observe(el)
    } else boot()
    const onFocus = () => boot()
    document.addEventListener("focusin", onFocus)
    return () => {
      gone = true
      io?.disconnect()
      document.removeEventListener("focusin", onFocus)
      existing?.removeEventListener("load", render)
    }
  }, [])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setState("sending")
    /* Every RSVP used to record a null source. The host, the path and any
       campaign parameter are read here so the column is never empty. */
    let where = source || "unknown"
    try {
      const u = new URL(window.location.href)
      const tag = u.searchParams.get("utm_source") || u.searchParams.get("from") || u.searchParams.get("ref")
      const at = u.hostname.replace(/^www\./, "") + u.pathname.replace(/\/$/, "")
      where = [source, tag, at].filter(Boolean).join(" | ").slice(0, 120)
    } catch {
      /* keep the prop */
    }
    try {
      const r = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          party: Math.max(1, Math.min(20, Number(party) || 1)),
          source: where,
          consent,
          fax,
          turnstileToken: ts,
        }),
      })
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; created?: boolean; error?: string; detail?: string }
      if (!r.ok) {
        setState("error")
        setWhy(j?.detail || "That did not send. Try again, or come anyway: entry is free.")
        if (j?.error === "verification") {
          setTs("")
          try {
            window.turnstile?.reset()
          } catch {
            /* the widget draws again on its own */
          }
        }
        return
      }
      setAgain(j?.created === false)
      track("rsvp", { again: j?.created === false })
      setState("done")
    } catch {
      setState("error")
      setWhy("No connection. Try again in a moment.")
    }
  }

  if (state === "done") {
    return (
      <div className="pg-e1" style={wrap}>
        <div style={{ ...kicker, color: accent }}>You are counted</div>
        <p style={{ ...lede, marginTop: 10 }}>
          {again
            ? `Thank you, ${name.trim().split(" ")[0] || "friend"}. You were already on the list, and your count and your choices are updated. Entry is free and there is no ticket.`
            : `Thank you, ${name.trim().split(" ")[0] || "friend"}. Nothing else to do: entry is free and there is no ticket. We will send parking and timings the week before.`}
        </p>
      </div>
    )
  }

  const consentRow = (key: keyof Consent, label: string, note: string, locked?: boolean) => (
    <label key={key} style={{ display: "flex", gap: 12, alignItems: "flex-start", minHeight: 44, cursor: locked ? "default" : "pointer" }}>
      <input
        type="checkbox"
        checked={consent[key]}
        disabled={locked}
        onChange={(e) => setConsent({ ...consent, [key]: e.target.checked })}
        style={{ width: 24, height: 24, marginTop: 0, flex: "0 0 auto", accentColor: solid }}
      />
      <span style={{ display: "grid", gap: 1 }}>
        <span style={{ fontFamily: ARCHIVO, fontSize: 14, lineHeight: 1.4, color: "#EDF1F6" }}>{label}</span>
        <span style={{ fontFamily: ARCHIVO, fontSize: 12.5, lineHeight: 1.45, color: "#8b95a3" }}>{note}</span>
      </span>
    </label>
  )

  return (
    <div className="pg-e1" style={wrap}>
      <style>{`
        .rsvpPair{grid-template-columns:1fr 1fr}
        @media (max-width:520px){.rsvpPair{grid-template-columns:1fr}}
      `}</style>
      <div style={{ ...kicker, color: accent }}>Free to attend</div>
      <h3 style={h3}>Tell us you are coming</h3>
      <p style={lede}>
        There is no ticket and no charge. The count tells us how much food to cook and how many
        restrooms to hire.
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

        {/* Nobody sees this field. A script that fills every input fills it. */}
        <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
          <label>
            Fax
            <input name="fax" tabIndex={-1} autoComplete="off" value={fax} onChange={(e) => setFax(e.target.value)} />
          </label>
        </div>

        <div style={{ display: "grid", gap: 9, marginTop: 4, padding: "12px 14px 13px", border: "1px solid rgba(255,255,255,.13)", borderLeft: `3px solid ${solid}`, borderRadius: 12, background: "rgba(0,0,0,.22)" }}>
          <span style={{ ...lbl, color: accent }}>How we may reach you</span>
          {consentRow("event_email", "Emails about this event", "Parking and timings the week before. This is the one that makes the RSVP useful.", true)}
          {consentRow("sms", "Text messages about the day", "Only for this event. Reply STOP at any time.")}
          {consentRow("pg_events", "News of future PaddockGavin events", "A few times a year. Unsubscribe in one tap.")}
        </div>

        <div ref={tsRef} style={{ minHeight: tsState === "failed" ? 0 : 65, marginTop: 4 }} />

        <button
          type="submit"
          disabled={state === "sending"}
          style={{
            ...primary,
            background: solid,
            color: onSolid,
            opacity: state === "sending" ? 0.6 : 1,
            justifySelf: "start",
          }}
        >
          {state === "sending" ? "Sending" : "Count me in"}
        </button>
        {state === "error" ? (
          <p style={{ ...lede, color: "#FF1A21", fontSize: 14, margin: 0 }}>{why}</p>
        ) : null}
      </form>
    </div>
  )
}

const wrap: React.CSSProperties = {
  position: "relative",
  padding: "24px 26px",
  borderRadius: 18,
  background: "rgba(17,27,40,.58)",
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
  fontSize: 10,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: "#7f8a99",
  fontWeight: 600,
}
const input: React.CSSProperties = {
  font: `400 16px/1.4 ${ARCHIVO}`,
  color: "#fff",
  background: "rgba(0,0,0,.3)",
  border: "1px solid rgba(255,255,255,.13)",
  borderRadius: 10,
  padding: "10px 12px",
  minHeight: 44,
  width: "100%",
}
const primary: React.CSSProperties = {
  font: `900 14.5px/1 ${ARCHIVO}`,
  color: "#04211d",
  border: 0,
  borderRadius: 12,
  padding: "13px 24px",
  minHeight: 44,
  cursor: "pointer",
  marginTop: 4,
}
