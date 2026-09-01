"use client"

import { use } from "react"

/**
 * The event's front door inside the CRM. For now it proves the spine works:
 * the route resolved an event, the shell authenticated you, and the surface
 * rendered. Panels land here as each tool is ported.
 */
export default function Hq({ params }: { params: Promise<{ event: string }> }) {
  const { event } = use(params)
  const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
  const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

  const ported: Array<[string, string]> = [
    ["The Ledger", "the dated plan, decisions, roles and lanes"],
    ["Targets", "45 categories and who we are chasing for each"],
    ["Board", "committed vendors and sponsors"],
    ["The Asks", "the outreach board"],
    ["Crew", "posts, hours and who is short"],
    ["The Awards", "the panel, the sheets, People's Choice"],
    ["Grounds", "the map and the printable site plan"],
    ["Chat", "threads attached to the record"],
  ]

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "34px 22px 80px", fontFamily: ARCHIVO }}>
      <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".2em",
        textTransform: "uppercase", color: "#F2C94C", fontWeight: 600 }}>
        PaddockGavin Events &middot; {event}
      </div>
      <h1 style={{ margin: "10px 0 0", font: `900 clamp(30px,5.4vw,44px)/1.02 ${ARCHIVO}`,
        letterSpacing: "-.032em", color: "#fff" }}>
        HQ
      </h1>
      <p style={{ margin: "13px 0 0", fontSize: 16.5, color: "#a9b4c2", maxWidth: "62ch" }}>
        The spine is live: this route resolved the event from the URL rather than a hardcoded id,
        checked you against the same staff list the ranch tools use, and drew the shell. Each tool
        below moves in here one at a time, and the old page keeps serving until its replacement is
        finished.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(232px,1fr))",
        gap: 11, marginTop: 26 }}>
        {ported.map(([name, what]) => (
          <div key={name} style={{ padding: "15px 17px", borderRadius: 16,
            background: "rgba(17,27,40,.58)", border: "1px solid rgba(255,255,255,.11)",
            backdropFilter: "blur(20px) saturate(1.5)", WebkitBackdropFilter: "blur(20px) saturate(1.5)" }}>
            <b style={{ display: "block", fontSize: 15.5, fontWeight: 900, color: "#fff",
              letterSpacing: "-.012em" }}>{name}</b>
            <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "#a9b4c2" }}>{what}</span>
            <span style={{ display: "inline-block", marginTop: 9, fontFamily: MONO, fontSize: 9,
              letterSpacing: ".12em", textTransform: "uppercase", color: "#F2C94C",
              background: "rgba(242,201,76,.14)", borderRadius: 999, padding: "3px 9px" }}>
              still on the ranch domain
            </span>
          </div>
        ))}
      </div>
    </main>
  )
}
