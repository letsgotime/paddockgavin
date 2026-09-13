import Link from "next/link"
import { PILLARS, STATS } from "@/lib/site-data"
import { PGEMark } from "@/components/pge-brand"

const ARCHIVO = "Archivo, Helvetica, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

const CARDS = [
  {
    pillar: PILLARS.automotive,
    title: "The cars",
    body: `The ${STATS.carsOwned} cars that were mine, and the notable ones that came through the lot.`,
    links: [
      { href: "/cars", label: "The Garage" },
      { href: "/features", label: "The Paddock Files" },
      { href: "/gallery", label: "Gallery" },
    ],
  },
  {
    pillar: PILLARS.events,
    title: "Days built around cars",
    body: "Car shows you can walk into, on a working ranch and in a Scottsdale jeweler's car park, with track days next.",
    links: [
      { href: "/events/pistonpoweredranch", label: "The Piston Powered Ranch" },
      { href: "/events/tires-and-timepieces", label: "Tires & Timepieces" },
      { href: "/book", label: "Book an event" },
    ],
  },
  {
    pillar: PILLARS.detailing,
    title: "Where it started",
    body: "Detailing is how I fell for cars, and it is why I wrote The Gloss Game.",
    links: [
      { href: "/gloss-game", label: "The Gloss Game" },
      { href: "/gloss-game#picks", label: "The Juice Box" },
      { href: "/cars/e92", label: "E92 M3 build log" },
    ],
  },
  {
    pillar: PILLARS.tech,
    title: "Always learning",
    body: "Spreadsheets, then code, now agentic engineering, and the software that came out of it.",
    links: [
      { href: "/why-a-paddock", label: "Why a Paddock" },
      { href: "/supercar-iq", label: "Supercar IQ" },
      { href: "/scoreboard", label: "The Scoreboard" },
    ],
  },
]

/** The four pillars, in the first screen and a half, each with a way in. */
export function HomePillars() {
  return (
    <section id="pillars" aria-labelledby="pillars-h" style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
      <p style={{ margin: 0, fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".22em", textTransform: "uppercase", color: "#B4B6B2" }}>
        What PaddockGavin is
      </p>
      <h2 id="pillars-h" style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", maxWidth: "20ch", textWrap: "balance" as never }}>
        Four things I care about
      </h2>
      <style>{`.pg-pillars{display:grid;gap:12px;grid-template-columns:1fr}@media(min-width:560px){.pg-pillars{grid-template-columns:repeat(2,1fr)}}@media(min-width:1020px){.pg-pillars{grid-template-columns:repeat(4,1fr)}}`}</style>
      <div className="pg-pillars">
        {CARDS.map((c) => (
          <article
            key={c.pillar.key}
            className="pg-e1"
            style={{ display: "flex", flexDirection: "column", gap: 12, padding: "20px 20px 18px", borderTop: `3px solid ${c.pillar.tone}`, clipPath: "polygon(0 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%)" }}
          >
            <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 9, minHeight: 20, fontFamily: MONO, fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: c.pillar.tone }}>
              {c.pillar.key === "events" && <PGEMark height={18} />}
              {c.pillar.label}
            </p>
            <h3 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h3)", lineHeight: 1.1, letterSpacing: "-.015em", color: "#FFFFFF" }}>
              <Link href={c.pillar.href} style={{ color: "inherit", textDecoration: "none" }}>{c.title}</Link>
            </h3>
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 16, lineHeight: 1.55, color: "#C4CBD6", flex: "1 1 auto" }}>{c.body}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", borderTop: "1px solid rgba(255,255,255,.1)" }}>
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="pg-tap" style={{ width: "100%", justifyContent: "space-between", gap: 10, borderBottom: "1px solid rgba(255,255,255,.07)", fontFamily: ARCHIVO, fontWeight: 600, fontSize: 15, color: "#EDF1F6", textDecoration: "none" }}>
                    {l.label}
                    <span aria-hidden="true" style={{ color: c.pillar.tone }}>&rsaquo;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
