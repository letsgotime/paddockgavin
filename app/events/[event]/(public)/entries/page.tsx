import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { loadEvent } from "@/lib/events/load"
import { loadRoster, rosterCounts } from "@/lib/events/roster"
import { ranchShare } from "@/lib/events/ranch-share"

/**
 * The field: which cars are actually coming.
 *
 * A link to send anybody, which is the whole reason it exists. Separate from
 * /entry, which is the form: that one asks, this one answers.
 *
 * It shows cars and not the people who own them. A submission carries a name,
 * an email, a phone number and photographs with plates in them, and none of
 * that is improved by being public. It also shows only accepted cars, because
 * a pending entry is a decision nobody has made and publishing it would tell
 * an owner they were in before the desk had said so.
 */

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ event: string }> }): Promise<Metadata> {
  const { event } = await params
  const e = await loadEvent(event)
  return ranchShare({
    path: "/entries",
    title: e ? `The field · ${e.name}` : "The field",
    description: e
      ? `The cars accepted for ${e.name}${e.venue_name ? " at " + e.venue_name : ""}.`
      : "The cars accepted for the show.",
  })
}

const BODY = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

export default async function Entries({ params }: { params: Promise<{ event: string }> }) {
  const { event } = await params
  const e = await loadEvent(event)
  if (!e) notFound()

  const [cars, counts] = await Promise.all([loadRoster(e.id), rosterCounts()])
  const accepted = cars ?? []
  const pending = counts?.pending ?? 0

  return (
    <main
      style={{
        background: "var(--ink, #0A1523)",
        minHeight: "100dvh",
        fontFamily: BODY,
        padding: "max(28px, env(safe-area-inset-top)) 16px max(48px, env(safe-area-inset-bottom))",
      }}
    >
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Archivo:wght@400;600;900&display=swap" />
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ height: 3, width: 48, background: "#E5141A", borderRadius: 2, marginBottom: 22 }} />
        <p style={{ margin: 0, fontFamily: MONO, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#FF1A21" }}>
          The field
        </p>
        <h1 style={{ margin: "10px 0 0", fontFamily: "Cinzel, Georgia, serif", fontWeight: 700, color: "#EDF1F6", fontSize: "clamp(30px,6vw,46px)", lineHeight: 1.05 }}>
          {accepted.length > 0 ? `${accepted.length} cars in` : "The field is being chosen"}
        </h1>

        <p style={{ margin: "14px 0 0", color: "#C9D1DB", fontSize: 17, lineHeight: 1.6, maxWidth: "62ch" }}>
          {accepted.length > 0
            ? "Every car below has a place on the field. They are looked at one at a time, so this list grows as the desk works through them."
            : "Every car is looked at one at a time and nobody has been told yes yet. This page fills as the desk works through them, so it is worth coming back to."}
          {pending > 0 && ` ${pending} ${pending === 1 ? "entry is" : "entries are"} still with the judges.`}
        </p>

        {accepted.length > 0 && (
          <ul style={{ listStyle: "none", margin: "30px 0 0", padding: 0, display: "grid", gap: 1, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, overflow: "hidden" }}>
            {accepted.map((c) => (
              <li key={c.id} style={{ background: "#0A1523", padding: "15px 18px", color: "#EDF1F6", fontSize: 16.5 }}>
                {c.car}
              </li>
            ))}
          </ul>
        )}

        <p style={{ margin: "32px 0 0", color: "#9FAAB8", fontSize: 15.5, lineHeight: 1.6 }}>
          Bringing something? {" "}
          <a href={`/events/${e.slug}/entry`} style={{ color: "#FF1A21", fontWeight: 600 }}>
            Send it in
          </a>
          . You will hear back either way.
        </p>
      </div>
    </main>
  )
}
