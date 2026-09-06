import Link from "next/link"

/**
 * The foot of a ranch page.
 *
 * The paddock's footer is about the paddock: sourcing, the lot, the night
 * shift. On a ranch page it ran 1,600 px on a phone and named a business
 * the reader had not come for. This is the ranch's own: the day, the four
 * doors, who runs it and who it helps, and the legal lines. Facts only.
 */
const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

const DOORS = [
  { href: "/events/pistonpoweredranch/entry", label: "Enter a car" },
  { href: "/events/pistonpoweredranch/vendor", label: "Take a stall" },
  { href: "/events/pistonpoweredranch/sponsor", label: "Sponsor the day" },
  { href: "/events/pistonpoweredranch#rsvp", label: "Tell us you are coming" },
  { href: "/events/pistonpoweredranch/entries", label: "The field" },
  { href: "/events/pistonpoweredranch/store", label: "Give to the school" },
]

export function RanchFooter() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,.12)", background: "#0A1523", padding: "clamp(36px,6vw,64px) clamp(16px,5vw,40px) clamp(28px,4vw,40px)", fontFamily: ARCHIVO }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gap: 26 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".2em", textTransform: "uppercase", color: "#FF1A21", fontWeight: 600 }}>The Piston Powered Ranch</span>
          <span style={{ fontSize: 15.5, lineHeight: 1.55, color: "#C9D1DB" }}>
            Saturday 10 October 2026, 9am to 3pm. Rancho Jaramillo, Unionville, Tennessee. Free to attend.
          </span>
        </div>
        <nav aria-label="Ranch pages" style={{ display: "flex", flexWrap: "wrap", gap: "6px 8px" }}>
          {DOORS.map((d) => (
            <Link key={d.href} href={d.href} style={{ display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,.16)", color: "#EDF1F6", textDecoration: "none", fontWeight: 700, fontSize: 13, letterSpacing: ".04em", textTransform: "uppercase" }}>
              {d.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 22px", paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.1)", fontSize: 13.5, color: "#8b95a3" }}>
          <span>
            A <a href="https://paddockgavin.com" style={{ color: "#C9D1DB", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,.22)" }}>PaddockGavin</a> event, benefiting Community Elementary School.
          </span>
          <a href="mailto:hello@pistonpoweredranch.com" style={{ display: "inline-flex", alignItems: "center", minHeight: 44, color: "#C9D1DB", textDecoration: "none" }}>hello@pistonpoweredranch.com</a>
          <Link href="/legal/privacy" style={{ display: "inline-flex", alignItems: "center", minHeight: 44, color: "#8b95a3", textDecoration: "none" }}>Privacy</Link>
          <Link href="/legal/terms" style={{ display: "inline-flex", alignItems: "center", minHeight: 44, color: "#8b95a3", textDecoration: "none" }}>Terms</Link>
        </div>
      </div>
    </footer>
  )
}
