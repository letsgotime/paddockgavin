"use client"

import { useCallback, useEffect, useState } from "react"
import { db, whoAmI } from "@/lib/crm/client"

/**
 * Who does what.
 *
 * The roles come from public.staff_allowlist, so this page cannot drift from
 * the thing that actually decides what each person sees. Row level security
 * is the gate: a signed out browser, or one signed in as somebody who is not
 * on the list, gets zero rows back rather than an error, which is why an
 * empty result is treated as "not staff" and not as a fault.
 *
 * What this page deliberately does not show: who sees cost. The split is real
 * and the database enforces it on every query, but printing it on a shared
 * page tells two people they are on the outside of it, which is worth nothing
 * to them and costs something. It stays in the policies where it belongs.
 */

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const DISPLAY = 'Cinzel, "Trajan Pro", "Times New Roman", serif'
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

/* Ranch ink and Jaramillo Red. #E5141A paints, #FF1A21 writes on the dark. */
const INK = "#0A1523"
const PANEL = "#111E2C"
const RAISE = "#18273A"
const LINE = "#22303F"
const LINE2 = "#1A2632"
const PAPER = "#EDF1F6"
const BODY = "#AEB9C6"
const MUTE = "#7C8898"
const FAINT = "#5A6674"
const RED_FILL = "#E5141A"
const RED_TEXT = "#FF1A21"

const TOOLS = "https://piston-powered-ranch.vercel.app"

type Link = { label: string; href: string; note: string }

/**
 * The order each role's rail actually renders in, so the sheet and the screen
 * agree on what comes first. Targets lives in the CRM now; everything else is
 * still on the tools domain.
 */
const FOCUS: Record<string, Link[]> = {
  Owner: [
    { label: "Journeys", href: `${TOOLS}/journeys/`, note: "the whole plan" },
    { label: "Entries queue", href: `${TOOLS}/console/#/ops`, note: "waiting on you" },
    { label: "Targets", href: "/events/pistonpoweredranch/targets", note: "the chase" },
    { label: "The Board", href: `${TOOLS}/board/`, note: "decisions" },
    { label: "Planning", href: `${TOOLS}/console/planning/`, note: "jobs and dates" },
    { label: "Chat", href: `${TOOLS}/chat/`, note: "the team" },
  ],
  "Property Owner": [
    { label: "Journeys", href: `${TOOLS}/journeys/`, note: "the whole plan" },
    { label: "Map", href: `${TOOLS}/map/`, note: "the property" },
    { label: "Site plan", href: `${TOOLS}/site-plan/`, note: "where it all sits" },
    { label: "Crew", href: `${TOOLS}/crew/`, note: "who is on the land" },
    { label: "Spectators", href: `${TOOLS}/rsvps/`, note: "how many are coming" },
    { label: "Chat", href: `${TOOLS}/chat/`, note: "the team" },
  ],
  "Brand Director": [
    { label: "Targets", href: "/events/pistonpoweredranch/targets", note: "who we are chasing" },
    { label: "Entries queue", href: `${TOOLS}/console/#/ops`, note: "vendors and sponsors" },
    { label: "Collateral", href: `${TOOLS}/collateral/`, note: "what to send" },
    { label: "Brand kit", href: `${TOOLS}/brand/rancho/`, note: "logos and type" },
    { label: "The Asks", href: `${TOOLS}/asks/`, note: "what we need" },
    { label: "Chat", href: `${TOOLS}/chat/`, note: "the team" },
  ],
  Member: [
    { label: "Targets", href: "/events/pistonpoweredranch/targets", note: "start here" },
    { label: "Crew", href: `${TOOLS}/crew/`, note: "volunteers and posts" },
    { label: "The Board", href: `${TOOLS}/board/`, note: "decisions" },
    { label: "The Asks", href: `${TOOLS}/asks/`, note: "what we need" },
    { label: "Chat", href: `${TOOLS}/chat/`, note: "the team" },
  ],
}

/** What each role carries, in the words the team uses for it. */
const CARRIES: Record<string, string> = {
  Owner: "Carries all of it. The only rail that is not split, because splitting it would pretend otherwise.",
  "Property Owner":
    "Owns the land and signs the founding partner asks. The rail leads with the property and who is standing on it.",
  "Brand Director":
    "Carries the brand and everyone we are talking to. Vendors and sponsors both come back here.",
  Member:
    "Works the chase and the day itself. Contacts are the contribution, and the target list is where they land.",
}

const ORG: Record<string, string> = {
  "Oscar Jaramillo": "Rancho Jaramillo",
  "Gavin Brooks": "PaddockGavin",
  "Bekah Stallard": "PaddockGavin",
  Arnie: "Tricky Air",
  Josh: "PaddockGavin",
}

const RANK: Record<string, number> = { Owner: 1, "Property Owner": 2, "Brand Director": 3, Member: 4 }

type Row = { email: string; name: string | null; role: string | null }
type Person = { name: string; role: string; emails: string[] }
type State = "loading" | "out" | "in"

export default function RolesPage() {
  const [state, setState] = useState<State>("loading")
  const [people, setPeople] = useState<Person[]>([])
  const [me, setMe] = useState("")

  const load = useCallback(async () => {
    const c = db()
    if (!c) return setState("out")

    const res = await c.from("staff_allowlist").select("email,name,role")
    // Zero rows is what a policy refusal looks like from the client. It is the
    // signed out case and the not on the list case, and they read the same.
    if (res.error || !res.data?.length) return setState("out")

    const by = new Map<string, Person>()
    for (const r of res.data as Row[]) {
      const name = (r.name || "").trim()
      if (!name) continue
      const p = by.get(name) ?? { name, role: r.role || "Member", emails: [] }
      p.emails.push(r.email.toLowerCase())
      by.set(name, p)
    }
    const list = [...by.values()].sort(
      (a, b) => (RANK[a.role] ?? 9) - (RANK[b.role] ?? 9) || a.name.localeCompare(b.name)
    )

    setPeople(list)
    setMe((await whoAmI()).toLowerCase())
    setState("in")
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (state === "loading") return <Shell><p style={{ color: MUTE, fontFamily: MONO, fontSize: 13 }}>Reading the list</p></Shell>

  if (state === "out")
    return (
      <Shell>
        <p style={{ ...eyebrow }}>The Piston Powered Ranch</p>
        <h1 style={{ ...h1 }}>Who does what</h1>
        <p style={{ color: BODY, fontSize: 17.5, maxWidth: "56ch", margin: "16px 0 0" }}>
          This one is for the five people running the day, so it wants a sign in first. There is no
          password: put your address in the email box and press the button that emails you a link.
        </p>
        <a href={`${TOOLS}/console/`} style={{ ...pill, marginTop: 26 }}>
          Sign in
        </a>
        <p style={{ color: FAINT, fontSize: 14, marginTop: 18, maxWidth: "56ch" }}>
          Use the address you were added under. Another address will sign in and show you nothing,
          which is the design rather than a fault.
        </p>
      </Shell>
    )

  return (
    <Shell>
      <p style={{ ...eyebrow }}>The Piston Powered Ranch &middot; Saturday 10 October 2026</p>
      <h1 style={{ ...h1 }}>Who does what</h1>
      <p style={{ color: BODY, fontSize: 18, maxWidth: "60ch", margin: "16px 0 0" }}>
        Five people, five different views of the same event. Every link below opens the tool that
        person actually works in, in the order their own screen puts them.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(310px,100%),1fr))",
          gap: 18,
          marginTop: 34,
        }}
      >
        {people.map((p) => {
          const mine = p.emails.includes(me)
          const links = FOCUS[p.role] ?? FOCUS.Member
          return (
            <article
              key={p.name}
              style={{
                background: PANEL,
                border: `1px solid ${mine ? RED_FILL : LINE}`,
                borderRadius: 18,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ padding: "22px 22px 18px", borderBottom: `1px solid ${LINE2}` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <h2 style={{ font: `700 25px/1.1 ${DISPLAY}`, color: PAPER, margin: 0 }}>{p.name}</h2>
                  {mine && (
                    <span
                      style={{
                        font: `600 9.5px/1 ${MONO}`,
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        color: "#FFFFFF",
                        background: RED_FILL,
                        borderRadius: 999,
                        padding: "5px 9px",
                      }}
                    >
                      You
                    </span>
                  )}
                </div>
                <p
                  style={{
                    font: `600 10px/1 ${MONO}`,
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    color: RED_TEXT,
                    margin: "9px 0 0",
                  }}
                >
                  {p.role}
                </p>
                <p style={{ color: MUTE, fontSize: 13.5, margin: "4px 0 0", fontFamily: ARCHIVO }}>
                  {ORG[p.name] ?? "The Piston Powered Ranch"}
                </p>
                <p style={{ color: BODY, fontSize: 15, lineHeight: 1.55, margin: "14px 0 0", fontFamily: ARCHIVO }}>
                  {CARRIES[p.role] ?? CARRIES.Member}
                </p>
              </div>

              <div style={{ padding: "16px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
                <p
                  style={{
                    font: `600 9.5px/1 ${MONO}`,
                    letterSpacing: ".15em",
                    textTransform: "uppercase",
                    color: FAINT,
                    margin: "0 0 10px",
                  }}
                >
                  {mine ? "Yours, in order" : "Theirs, in order"}
                </p>
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 10,
                      padding: "9px 12px",
                      borderRadius: 9,
                      textDecoration: "none",
                      color: PAPER,
                      fontSize: 14.5,
                      fontWeight: 500,
                      fontFamily: ARCHIVO,
                      border: "1px solid transparent",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = RAISE
                      e.currentTarget.style.borderColor = LINE
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "transparent"
                      e.currentTarget.style.borderColor = "transparent"
                    }}
                  >
                    {l.label}
                    <small style={{ marginLeft: "auto", color: MUTE, fontSize: 12.5, fontFamily: MONO, textAlign: "right" }}>
                      {l.note}
                    </small>
                  </a>
                ))}
              </div>
            </article>
          )
        })}
      </div>

      <div
        style={{
          marginTop: 22,
          padding: "16px 19px",
          borderLeft: `3px solid ${RED_FILL}`,
          background: PANEL,
          borderRadius: "0 12px 12px 0",
          fontSize: 14.5,
          color: BODY,
          fontFamily: ARCHIVO,
          maxWidth: "72ch",
        }}
      >
        <b style={{ color: PAPER }}>Nothing is hidden, only ranked.</b> Every tool is reachable from
        every page by pressing the Team pill, bottom left. A role decides what appears first, with the
        rest below a divider. At six in the morning on the tenth somebody will need a page that is not
        theirs, and a menu that hid it would be a menu they route around.
      </div>

      <h2 style={{ ...h2 }}>The one link you give out</h2>
      <p style={{ color: BODY, fontSize: 16, maxWidth: "66ch", margin: "12px 0 0", fontFamily: ARCHIVO }}>
        Spectator, entrant, vendor or sponsor, everybody outside this list gets the same address and
        nothing else. It carries the date, the RSVP, the entry form, the stall enquiry and the partner
        enquiry, and it is the only link that will still be right in a month.
      </p>
      <a href="https://pistonpoweredranch.com" style={{ ...pill, marginTop: 18 }}>
        pistonpoweredranch.com
      </a>

      <footer
        style={{
          marginTop: 52,
          paddingTop: 22,
          borderTop: `1px solid ${LINE}`,
          color: FAINT,
          fontSize: 13.5,
          fontFamily: ARCHIVO,
        }}
      >
        Names and roles read live from the staff list, so this page cannot drift from the thing that
        decides what each person sees. The order of links on each card is the order that role&rsquo;s
        own rail renders them in.
      </footer>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ background: INK, minHeight: "100vh", fontFamily: ARCHIVO }}>
      <div style={{ height: 3, background: RED_FILL }} />
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "42px clamp(14px,4vw,20px) 100px" }}>{children}</div>
    </main>
  )
}

const eyebrow: React.CSSProperties = {
  font: `600 10.5px/1 ${MONO}`,
  letterSpacing: ".22em",
  textTransform: "uppercase",
  color: RED_TEXT,
  margin: 0,
}

const h1: React.CSSProperties = {
  font: `700 clamp(36px,7vw,62px)/1 ${DISPLAY}`,
  color: PAPER,
  margin: "14px 0 0",
  letterSpacing: ".01em",
}

const h2: React.CSSProperties = {
  font: `600 12px/1 ${MONO}`,
  letterSpacing: ".2em",
  textTransform: "uppercase",
  color: MUTE,
  margin: "56px 0 0",
  paddingBottom: 11,
  borderBottom: `1px solid ${LINE}`,
}

/* Red pills carry white type. Always. */
const pill: React.CSSProperties = {
  display: "inline-block",
  font: `800 14.5px/1 ${ARCHIVO}`,
  color: "#FFFFFF",
  background: RED_FILL,
  borderRadius: 11,
  padding: "14px 24px",
  textDecoration: "none",
}
