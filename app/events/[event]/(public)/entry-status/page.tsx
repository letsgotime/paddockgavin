import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { loadEvent } from "@/lib/events/load"
import { loadEntryByToken, statusCopy } from "@/lib/events/entry"

/**
 * Where an entrant finds out what happened to their car.
 *
 * The link in their email carries the token and that is the whole key. No sign
 * in: somebody who filled in a form should not need an account to ask what
 * became of it.
 *
 * Never indexed, and a bad token is answered exactly like a good one that has
 * been revoked, so a stranger guessing learns nothing either way.
 */

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Your entry",
  robots: { index: false, follow: false, nocache: true },
  /* The token is in the address. Without this, following any link off this
     page hands the whole address, token and all, to wherever it goes. */
  referrer: "no-referrer",
}

const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

const TONE: Record<string, string> = {
  wait: "#F2C94C",
  yes: "#00D2BE",
  hold: "#6E8FE8",
  no: "#FF1A21",
}

function Frame({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <main
      style={{
        background: "#0A1523",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(20px,6vw,56px)",
        fontFamily: "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 620 }}>
        <div style={{ height: 3, width: 54, background: accent || "#E5141A", borderRadius: 2, marginBottom: 24 }} />
        {children}
      </div>
    </main>
  )
}

export default async function EntryStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ event: string }>
  searchParams: Promise<{ t?: string }>
}) {
  const { event } = await params
  const { t } = await searchParams
  const ev = await loadEvent(event)
  if (!ev) notFound()

  const entry = t ? await loadEntryByToken(t) : null

  if (!entry) {
    return (
      <Frame>
        <h1 style={{ margin: "0 0 14px", fontFamily: "Cinzel, Georgia, serif", fontWeight: 700, fontSize: "clamp(28px,5vw,40px)", color: "#EDF1F6", lineHeight: 1.08 }}>
          We cannot find that entry
        </h1>
        <p style={{ margin: "0 0 22px", fontSize: 17, lineHeight: 1.6, color: "#C9D1DB" }}>
          The link may have been cut short by a mail client, which happens. Open it again from the
          original email, or reply to that email and we will tell you where your car stands.
        </p>
        <a
          href="https://pistonpoweredranch.com" rel="noreferrer"
          style={{ display: "inline-block", font: "700 14px/1 inherit", letterSpacing: ".04em", textTransform: "uppercase", color: "#FFFFFF", background: "#E5141A", borderRadius: 11, padding: "14px 22px", textDecoration: "none" }}
        >
          {ev.name}
        </a>
      </Frame>
    )
  }

  const s = statusCopy(entry.status)
  const accent = TONE[s.tone]
  const submitted = new Date(entry.submittedAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago",
  })

  return (
    <Frame accent={accent}>
      <p style={{ margin: 0, fontFamily: MONO, fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: accent }}>
        {ev.name}
      </p>
      <h1 style={{ margin: "12px 0 14px", fontFamily: "Cinzel, Georgia, serif", fontWeight: 700, fontSize: "clamp(30px,6vw,46px)", color: "#EDF1F6", lineHeight: 1.06 }}>
        {s.head}
      </h1>
      <p style={{ margin: "0 0 26px", fontSize: 17.5, lineHeight: 1.6, color: "#C9D1DB" }}>{s.line}</p>

      <dl style={{ margin: 0, display: "grid", gap: 1, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, overflow: "hidden" }}>
        {[
          ["Entered by", entry.applicantName],
          ["The car", entry.subject],
          ["Sent in", submitted],
        ]
          .filter(([, v]) => Boolean(v))
          .map(([k, v]) => (
            <div key={k as string} style={{ background: "#0A1523", display: "grid", gridTemplateColumns: "minmax(110px,150px) 1fr", gap: 16, padding: "14px 18px" }}>
              <dt style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "#7E8B99" }}>{k as string}</dt>
              <dd style={{ margin: 0, fontSize: 16, color: "#EDF1F6" }}>{v as string}</dd>
            </div>
          ))}
      </dl>

      {entry.message && (
        <p style={{ margin: "20px 0 0", fontSize: 15.5, lineHeight: 1.6, color: "#9FAAB8", borderLeft: `3px solid ${accent}`, paddingLeft: 16 }}>
          {entry.message}
        </p>
      )}

      <p style={{ margin: "30px 0 0", fontSize: 15, lineHeight: 1.6, color: "#7E8B99" }}>
        This page always shows where your entry stands. Keep the link.
      </p>
      <p style={{ margin: "18px 0 0" }}>
        <a href="https://pistonpoweredranch.com" rel="noreferrer" style={{ display: "inline-block", font: "700 14px/1 inherit", letterSpacing: ".04em", textTransform: "uppercase", color: "#FFFFFF", background: "#E5141A", borderRadius: 11, padding: "14px 22px", textDecoration: "none" }}>
          {ev.name}
        </a>
      </p>
    </Frame>
  )
}
