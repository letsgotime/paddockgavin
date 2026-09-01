"use client"

import { useState } from "react"
import Image from "next/image"
import { RsvpBlock } from "@/components/rsvp-block"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { CrmLogin } from "@/components/crm-login"
import { RanchMark } from "@/components/ranch-mark"
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
    /* Type on a fill painted in the accent. White on the ranch's red, dark on
       an amber door. One token answers both, which is why it is not a literal. */
    ["--on-accent" as string]: b.onAccent || "#FFFFFF",
    ["--display" as string]: b.display || "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    ["--body" as string]: b.body || "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  }
}

/** Whole days until the event, counted in the venue's day, not the reader's. */
function daysUntil(iso: string | null): number | null {
  if (!iso) return null
  const at = (d: Date) =>
    Date.parse(new Date(d).toLocaleDateString("en-CA", { timeZone: "America/Chicago" }) + "T00:00:00Z")
  const left = Math.round((at(new Date(iso)) - at(new Date())) / 86400000)
  return left < 0 ? null : left
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
        color: solid ? "var(--on-accent)" : "var(--paper)",
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

  const left = daysUntil(event.starts_at)
  const shortDay = event.starts_at
    ? new Date(event.starts_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "America/Chicago" })
    : ""
  const b = event.brand || {}

  return (
    <div style={brandVars(event)}>
      <style>{`
        @keyframes evKen { from { transform: scale(1.02) } to { transform: scale(1.14) translateY(-1.5%) } }
        .evKen { animation: evKen 30s ease-in-out infinite alternate; transform-origin: center; will-change: transform }
        @media (prefers-reduced-motion: reduce) { .evKen { animation: none !important; transform: scale(1.08) translateY(-1.5%) } }
      `}</style>
      <SiteNav active="events" />
      <CrmLogin />

      {/* The date and the count, kept in view. Not a link, so it does not take
          the tap that belongs to the menu behind it. */}
      {shortDay && (
        <div style={{ position: "fixed", top: 75, left: 0, right: 0, zIndex: 60, padding: "0 clamp(12px,4vw,40px)", pointerEvents: "none" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, padding: "9px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,.14)", background: "linear-gradient(180deg,rgba(12,24,38,.94),rgba(10,21,35,.9))", backdropFilter: "blur(10px)" }}>
            <i aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-strong)", flex: "0 0 auto" }} />
            <span style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: ".2em", textTransform: "uppercase", color: "#EDF1F6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {shortDay}
            </span>
            <i aria-hidden="true" style={{ flex: "1 1 auto" }} />
            {left !== null && (
              <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--second)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                {left === 0 ? "Today" : left === 1 ? "1 day" : `${left} days`}
              </span>
            )}
          </div>
        </div>
      )}

      {/* The venue's own mark, from its brand row. */}
      {b.logo && (
        <div style={{ position: "absolute", top: "clamp(126px,15vh,152px)", left: 0, right: 0, zIndex: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 9, pointerEvents: "none" }}>
          <RanchMark
            src={b.logoOnDark || b.logo}
            alt={b.name || event.venue_name || event.name}
            width={152}
            ratio={475 / 748}
            label={c.producer || "The day run by PaddockGavin"}
          />
        </div>
      )}

    <main style={{ background: "var(--ink)", minHeight: "100vh", position: "relative" }}>
      {hero && (
        <section style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
          <Image className="evKen" src={hero.img} alt={hero.alt} fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: hero.focal || "center 62%" }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.96) 6%,rgba(10,21,35,.34) 62%,rgba(10,21,35,.22))" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: 1180, margin: "0 auto", padding: "0 clamp(20px,5vw,40px) clamp(52px,10vh,110px)", display: "grid", gap: 18 }}>
            <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 12 }}>
              <i aria-hidden="true" style={{ width: 28, height: 3, background: "var(--accent-strong)", flex: "0 0 auto", borderRadius: 2 }} />
              <span style={{
                fontFamily: MONO,
                fontSize: "clamp(11px,1.3vw,12.5px)",
                letterSpacing: ".22em",
                textTransform: "uppercase",
                color: "#EDF1F6",
                textShadow: "0 1px 4px rgba(4,9,16,.95)",
              }}>
                {hero.eyebrow}
              </span>
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
          <RsvpBlock eventId={event.id} accent="var(--accent)" fill="var(--accent-strong)" onFill="var(--on-accent)" source="event-page" />
        </div>
      </section>
    </main>
      <SiteFooter />
    </div>
  )
}
