"use client"

import { useState } from "react"
import Image from "next/image"
import { RsvpBlock } from "@/components/rsvp-block"
import { resolveHref, type EventRow, type EventAct, type EventCta } from "@/lib/events/types"

/**
 * The public page for any event.
 *
 * Everything on it comes from the events row: the palette and both typefaces
 * from brand, the words from content, the date and venue from their own
 * columns. A second event is a row and a logo, not a second page.
 *
 * This is a client component so the acts can open and close, but Next renders
 * it on the server first, so the words are in the HTML. That matters more here
 * than anywhere else on the estate: this is the page the event is found by.
 */

const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

function brandVars(e: EventRow): React.CSSProperties {
  const b = e.brand || {}
  return {
    ["--accent" as string]: b.accentText || b.accent || "#FF1A21",
    ["--accent-strong" as string]: b.accent || "#E5141A",
    ["--second" as string]: b.secondText || b.second || "#6E8FE8",
    ["--second-strong" as string]: b.second || "#1424A1",
    ["--ink" as string]: b.ink || "#0A1523",
    ["--paper" as string]: b.paper || "#FAF8F4",
    ["--display" as string]: b.display || "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    ["--body" as string]: b.body || "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  }
}

/** Saturday, October 10, 2026. Fixed to the venue's day, not the reader's. */
function longDate(iso: string | null): string {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago",
  })
}
function clockRange(a: string | null, b: string | null): string {
  if (!a) return ""
  const f = (s: string) =>
    new Date(s).toLocaleTimeString("en-US", { hour: "numeric", timeZone: "America/Chicago" }).toLowerCase()
  return b ? `${f(a)} to ${f(b)}` : f(a)
}

function Cta({ c, slug, primary }: { c: EventCta; slug: string; primary?: boolean }) {
  const solid = primary ?? c.primary
  return (
    <a
      href={resolveHref(c.href, slug)}
      style={{
        fontFamily: "var(--body)",
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: ".04em",
        textTransform: "uppercase",
        textDecoration: "none",
        padding: "14px 22px",
        borderRadius: 11,
        display: "inline-block",
        color: solid ? "#FFFFFF" : "var(--paper)",
        background: solid ? "var(--accent-strong)" : "transparent",
        border: solid ? "1px solid var(--accent-strong)" : "1px solid rgba(255,255,255,.34)",
      }}
    >
      {c.label}
    </a>
  )
}

function Act({ act, slug, open, onToggle }: { act: EventAct; slug: string; open: boolean; onToggle: () => void }) {
  const links = (act.cta ? [act.cta] : []).concat(act.ctas || [])
  return (
    <section id={act.id} style={{ position: "relative", scrollMarginTop: 96, borderTop: "1px solid rgba(255,255,255,.12)" }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${act.id}-body`}
        style={{
          all: "unset",
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 20,
          alignItems: "start",
          width: "100%",
          cursor: "pointer",
          padding: "clamp(26px,4vw,44px) clamp(16px,5vw,40px)",
          maxWidth: 1180,
          margin: "0 auto",
        }}
      >
        <span>
          <span style={{ display: "block", fontFamily: MONO, fontSize: 11.5, letterSpacing: ".2em", textTransform: "uppercase", color: act.tone, marginBottom: 12 }}>
            {act.kicker}
          </span>
          <h2 style={{ margin: 0, fontFamily: "var(--display)", fontWeight: 700, fontSize: "clamp(26px,4.2vw,44px)", lineHeight: 1.08, color: "var(--paper)", textWrap: "balance" }}>
            {act.title}
          </h2>
          <span style={{ display: "block", marginTop: 12, fontFamily: "var(--body)", fontSize: "clamp(16px,1.9vw,19px)", lineHeight: 1.5, color: "#C9D1DB", maxWidth: "58ch" }}>
            {act.lede}
          </span>
        </span>
        <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: 26, lineHeight: 1, color: act.tone, transform: open ? "rotate(45deg)" : "none", transition: "transform .2s" }}>
          +
        </span>
      </button>

      <div id={`${act.id}-body`} hidden={!open} style={{ padding: open ? "0 clamp(16px,5vw,40px) clamp(30px,5vw,56px)" : 0, maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))", gap: "clamp(20px,3vw,38px)", alignItems: "start" }}>
          <div>
            {act.body.map((p, i) => (
              <p key={i} style={{ margin: "0 0 14px", fontFamily: "var(--body)", fontSize: 16.5, lineHeight: 1.62, color: "#C9D1DB", maxWidth: "62ch" }}>
                {p}
              </p>
            ))}

            {act.lists?.map((l) => (
              <div key={l.head} style={{ marginTop: 22 }}>
                <p style={{ margin: "0 0 9px", fontFamily: MONO, fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: l.tone }}>{l.head}</p>
                <ul style={{ margin: 0, paddingLeft: 18, color: "#C9D1DB", fontFamily: "var(--body)", fontSize: 16 }}>
                  {l.items.map((it) => <li key={it} style={{ margin: "5px 0" }}>{it}</li>)}
                </ul>
              </div>
            ))}

            {act.tiers?.map((t) => (
              <div key={t.name} style={{ marginTop: 22, padding: "18px 20px", border: "1px solid rgba(255,255,255,.14)", borderTop: `3px solid ${t.tone}`, borderRadius: 14 }}>
                <p style={{ margin: 0, fontFamily: "var(--display)", fontSize: 21, fontWeight: 700, color: "var(--paper)" }}>{t.name}</p>
                <p style={{ margin: "6px 0 12px", fontFamily: "var(--body)", fontSize: 15.5, color: "#9FAAB8" }}>{t.line}</p>
                <ul style={{ margin: 0, paddingLeft: 18, color: "#C9D1DB", fontFamily: "var(--body)", fontSize: 15.5 }}>
                  {t.items.map((it) => <li key={it} style={{ margin: "5px 0" }}>{it}</li>)}
                </ul>
              </div>
            ))}

            {links.length > 0 && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
                {links.map((c, i) => <Cta key={c.label} c={c} slug={slug} primary={i === 0} />)}
              </div>
            )}
          </div>

          <div style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,.12)" }}>
            <Image src={act.img} alt="" fill sizes="(max-width:900px) 100vw, 46vw" style={{ objectFit: "cover", objectPosition: act.focal }} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function EventPublic({ event }: { event: EventRow }) {
  const c = event.content || {}
  const hero = c.hero
  const acts = c.acts || []
  const [open, setOpen] = useState<string | null>(acts[0]?.id ?? null)

  const facts = [
    longDate(event.starts_at),
    clockRange(event.starts_at, event.ends_at),
    [event.venue_name, event.venue_address].filter(Boolean).join(", "),
    event.charity ? `Benefiting ${event.charity}` : "",
  ].filter(Boolean)

  return (
    <main style={{ ...brandVars(event), background: "var(--ink)", minHeight: "100vh" }}>
      {hero && (
        <section style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
          <Image src={hero.img} alt={hero.alt} fill priority sizes="100vw" style={{ objectFit: "cover" }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.96) 6%,rgba(10,21,35,.34) 62%,rgba(10,21,35,.22))" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(20px,5vw,40px) clamp(52px,10vh,110px)", display: "grid", gap: 18 }}>
            <p style={{
              margin: 0,
              fontFamily: MONO,
              fontSize: "clamp(11px,1.3vw,12.5px)",
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "var(--accent)",
              textShadow: "0 1px 3px rgba(4,9,16,.9), 0 0 14px rgba(4,9,16,.7)",
            }}>
              {hero.eyebrow}
            </p>
            <h1 style={{ margin: 0, fontFamily: "var(--display)", fontWeight: 900, fontSize: "clamp(38px,8.5vw,86px)", lineHeight: 0.94, letterSpacing: "-.02em", color: "#FFFFFF", textWrap: "balance" }}>
              {hero.title}
              {hero.titleAccent && (<><br /><span style={{ color: "var(--accent-strong)" }}>{hero.titleAccent}</span></>)}
            </h1>
            <p style={{ margin: 0, fontFamily: "var(--body)", fontWeight: 700, fontSize: "clamp(19px,2.6vw,26px)", lineHeight: 1.3, color: "#FFFFFF" }}>
              {hero.lead}
            </p>
            <p style={{ margin: 0, fontFamily: "var(--body)", fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.55, color: "#C9D1DB", maxWidth: "46ch" }}>
              {hero.body}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
              {hero.ctas.map((x, i) => <Cta key={x.label} c={x} slug={event.slug} primary={i === 0} />)}
            </div>
          </div>
        </section>
      )}

      {facts.length > 0 && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,.12)", borderBottom: "1px solid rgba(255,255,255,.12)" }}>
          <ul style={{ listStyle: "none", margin: "0 auto", padding: "18px clamp(16px,5vw,40px)", maxWidth: 1180, display: "flex", flexWrap: "wrap", gap: "10px 26px" }}>
            {facts.map((f) => (
              <li key={f} style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: ".08em", color: "#9FAAB8" }}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {acts.map((a) => (
        <Act key={a.id} act={a} slug={event.slug} open={open === a.id} onToggle={() => setOpen(open === a.id ? null : a.id)} />
      ))}

      <section id="rsvp" style={{ scrollMarginTop: 96, padding: "clamp(48px,8vw,90px) clamp(16px,5vw,40px)", borderTop: "1px solid rgba(255,255,255,.12)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <RsvpBlock eventId={event.id} accent="var(--accent)" fill="var(--accent-strong)" source="event-page" />
        </div>
      </section>
    </main>
  )
}
