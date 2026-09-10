"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import "./ranchcontrol.css"
import {
  DIALS,
  ROWS,
  SPONSOR_LINES,
  RUN,
  LAUNCH,
  DEGREES,
  TABS,
  usd,
  assumptionsFrom,
  deriveFrom,
  rowValue,
  totalsFrom,
  type FullState,
  type SheetEntry,
  type SponsorEntry,
  type RowDef,
} from "@/lib/ranchcontrol/data"

/**
 * Ranch control, the real page.
 *
 * Ported from a claude.ai artifact that hit two dead ends: its sharing
 * toggle was blocked by a personal information scanner, and even shared,
 * every claude.ai artifact link unfurls in iMessage as a generic "Claude
 * Artifact" card. This is the same tool, on Gavin's own domain, behind one
 * shared password instead of a login.
 *
 * The source used claude.use("db"), a store that only exists inside a
 * claude.ai artifact iframe. This talks to /api/ranchcontrol instead: a GET
 * for the whole workspace, a POST for one write at a time. A ten second
 * poll stands in for the source's live snapshot listeners, which is why an
 * edit from a teammate can take a few seconds to show up here rather than
 * appearing instantly.
 *
 * The site plan tab (Leaflet, satellite imagery, the property's exact
 * coordinates) is not here. Out of scope for this page by design: no map,
 * no exact GPS or street address content of any kind.
 */

type Phase = "loading" | "locked" | "error" | "ready"
type SaveState = "idle" | "saving" | "saved"

const GATES: [string, string][] = [
  ["Liability bound", "General and liquor liability, Rancho Jaramillo named additional insured. No other commitment is safe before this."],
  ["The landing zone walked", "Overhead wires, slope, surface and a clear approach into wind. The aerial shows power lines along the south boundary."],
  ["Bedford County signed off", "Traffic control, EMS requirement and the permit. Meeting 8 September."],
  ["Every entrant answered", "Ten entries are pending and none has been told yes or no."],
]

const REV_LINES: [string, string, number, number][] = [
  ["Vendor stalls", "Setup fee, the confirmed rate", 250, 0],
  ["VIP tier one", "Settled 8 September", 0, 0],
  ["VIP tier two", "Settled 8 September", 0, 0],
  ["Premier sponsor", "Floor, starting at", 5000, 1],
  ["Secondary sponsor", "Floor, category exclusive", 2500, 2],
  ["Supporting sponsor", "Floor, starting at", 500, 4],
]

const LIVE_OK = "Live. Everyone with the link sees each change as it saves."

function Livery() {
  return (
    <div className="livery">
      <i style={{ background: "#E5141A" }} />
      <i style={{ background: "#FAF8F4" }} />
      <i style={{ background: "#1424A1" }} />
    </div>
  )
}

export default function RanchControlApp() {
  const [phase, setPhase] = useState<Phase>("loading")
  const [data, setData] = useState<FullState | null>(null)
  const [activeTab, setActiveTab] = useState<string>("assume")
  const [whoName, setWhoName] = useState("")
  const [hydrated, setHydrated] = useState(false)
  const [liveNote, setLiveNote] = useState("Connecting to the live workspace.")
  const [passwordInput, setPasswordInput] = useState("")
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState("")
  const [savingState, setSavingState] = useState<Record<string, SaveState>>({})
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const load = useCallback(async (): Promise<"ok" | "locked" | "error"> => {
    try {
      const res = await fetch("/api/ranchcontrol", { cache: "no-store" })
      if (res.status === 401) return "locked"
      if (!res.ok) return "error"
      const json = (await res.json()) as FullState
      setData(json)
      setLiveNote(LIVE_OK)
      return "ok"
    } catch {
      return "error"
    }
  }, [])

  /* Name and last tab are per browser, not per team; nothing here reads
     localStorage until after mount, so the server render and the first
     client render match. */
  useEffect(() => {
    try {
      const savedName = window.localStorage.getItem("ppr.editor")
      if (savedName) setWhoName(savedName)
    } catch {
      /* private mode or blocked site data; the field just starts empty */
    }
    try {
      const savedTab = window.localStorage.getItem("ppr.tab")
      if (savedTab && TABS.some(([k]) => k === savedTab)) setActiveTab(savedTab)
    } catch {
      /* same as above */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    let cancelled = false
    load().then((s) => {
      if (!cancelled) setPhase(s === "ok" ? "ready" : s)
    })
    return () => {
      cancelled = true
    }
  }, [load])

  /* Stands in for the source's live snapshot listeners: not instant, but
     nothing here goes stale for more than a few seconds. */
  useEffect(() => {
    if (phase !== "ready") return
    const id = setInterval(async () => {
      const s = await load()
      if (s === "locked") setPhase("locked")
    }, 10000)
    return () => clearInterval(id)
  }, [phase, load])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem("ppr.editor", whoName)
    } catch {
      /* ignore */
    }
  }, [whoName, hydrated])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem("ppr.tab", activeTab)
    } catch {
      /* ignore */
    }
  }, [activeTab, hydrated])

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault()
    if (authBusy) return
    setAuthBusy(true)
    setAuthError("")
    try {
      const res = await fetch("/api/ranchcontrol/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      })
      if (res.status === 200) {
        const s = await load()
        setPhase(s === "ok" ? "ready" : "error")
      } else {
        setAuthError("Wrong password. Try again.")
      }
    } catch {
      setAuthError("Could not reach the server. Try again.")
    } finally {
      setAuthBusy(false)
    }
  }

  async function postWrite(payload: Record<string, unknown>): Promise<boolean> {
    try {
      const res = await fetch("/api/ranchcontrol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.status === 401) {
        setPhase("locked")
        return false
      }
      if (!res.ok) {
        setLiveNote("That did not save. Try again.")
        return false
      }
      const json = (await res.json()) as FullState
      setData(json)
      setLiveNote(LIVE_OK)
      return true
    } catch {
      setLiveNote("That did not save. Try again.")
      return false
    }
  }

  const canEdit = phase === "ready" && whoName.trim().length > 0

  function onDialBlur(k: string, raw: string) {
    if (!canEdit || !data) return
    const now = Math.max(0, Number(raw.replace(/[^0-9.]/g, "")) || 0)
    const was = data.dials[k]
    if (now === was) return
    setData({ ...data, dials: { ...data.dials, [k]: now } })
    void postWrite({ type: "dial", k, v: now, who: whoName })
  }

  function onCellBlur(row: RowDef, f: "rate" | "qty", raw: string) {
    if (!canEdit || !data) return
    const a = assumptionsFrom(data.dials)
    const r = deriveFrom(a)
    const before = rowValue(row, a, r, data.sheet[row.k])
    const trimmed = raw.trim()
    const val =
      f === "rate"
        ? trimmed === ""
          ? null
          : Number(trimmed.replace(/[^0-9.]/g, ""))
        : Math.max(0, Math.round(Number(trimmed.replace(/[^0-9]/g, "")) || 0))
    const beforeVal = f === "rate" ? before.rate : before.qty
    if (val === beforeVal) return
    const nextEntry: SheetEntry = {
      ...data.sheet[row.k],
      rate: f === "rate" ? (val as number | null) : before.rate,
      qty: f === "qty" ? (val as number) : before.qty,
    }
    setData({ ...data, sheet: { ...data.sheet, [row.k]: nextEntry } })
    void postWrite({ type: "sheet", k: row.k, f, v: val, who: whoName })
  }

  function saveSlot(id: string) {
    if (!canEdit) return
    const container = slotRefs.current[id]
    if (!container) return
    const body: Record<string, string> = {}
    container.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-f]").forEach((el) => {
      const f = el.getAttribute("data-f")
      if (f) body[f] = el.value
    })
    setSavingState((s) => ({ ...s, [id]: "saving" }))
    postWrite({ type: "sponsor", id, body, who: whoName }).then((ok) => {
      setSavingState((s) => ({ ...s, [id]: ok ? "saved" : "idle" }))
      if (ok) {
        setTimeout(() => setSavingState((s) => ({ ...s, [id]: "idle" })), 1200)
      }
    })
  }

  function retry() {
    setPhase("loading")
    load().then((s) => setPhase(s === "ok" ? "ready" : s))
  }

  if (phase === "loading") {
    return (
      <div className="rcApp">
        <div className="gate">
          <p style={{ color: "var(--mute)", fontFamily: "var(--sans)" }}>Loading Ranch control.</p>
        </div>
      </div>
    )
  }

  if (phase === "locked") {
    return (
      <div className="rcApp">
        <div className="gate">
          <div className="gateCard">
            <Livery />
            <h1>Ranch control</h1>
            <p className="sub">The Piston Powered Ranch, team workspace.</p>
            <form onSubmit={submitPassword}>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
              />
              <button type="submit" disabled={authBusy || !passwordInput}>
                {authBusy ? "Checking" : "Enter"}
              </button>
            </form>
            {authError && <p className="gateError">{authError}</p>}
            <p className="gateNote">Ask Gavin for the password if you do not have it.</p>
          </div>
        </div>
      </div>
    )
  }

  if (phase === "error" || !data) {
    return (
      <div className="rcApp">
        <div className="gate">
          <div className="gateCard">
            <Livery />
            <h1>Ranch control</h1>
            <p className="sub">Could not reach the workspace. Check the connection and try again.</p>
            <button type="button" onClick={retry}>
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const a = assumptionsFrom(data.dials)
  const r = deriveFrom(a)
  const t = totalsFrom(a, r, data.sheet, data.sponsors)

  const stripCells: [string, string, string, string][] = [
    ["Cost to build", usd(t.cost), `${ROWS.length - t.open} of ${ROWS.length} lines priced`, ""],
    ["VIP tickets", usd(t.vipRev), `${a.vipA} at ${usd(a.vipAp)}, ${a.vipB} at ${usd(a.vipBp)}`, "ok"],
    ["Exposed", usd(Math.max(0, t.gap)), t.gap > 0 ? "To find from stalls and sponsors" : "VIP covers the build", t.gap > 0 ? "bad" : "ok"],
    ["Unpriced", String(t.open), "Lines with no quote yet", "warn"],
    ["Sponsors named", `${t.named} of ${t.slotTotal}`, "Three slots on each line", ""],
  ]

  const unpriced = ROWS.filter((x) => rowValue(x, a, r, data.sheet[x.k]).rate === null)
  const gate = unpriced.filter((x) => x.k === "insurance" || x.k === "waste")
  const bare = SPONSOR_LINES.filter(
    (l) =>
      ![1, 2, 3].some((i) => {
        const d = data.sponsors[`${l.k}-${i}`] ?? (i === 1 ? l.seed : null)
        return d && (d.company || d.contact)
      }),
  )
  const jobs: [string, string][] = []
  if (gate.length) jobs.push([`Price ${gate.map((x) => x.n.toLowerCase()).join(" and ")}`, "These gate a permit. Nothing else commits safely until liability is bound."])
  if (t.gap > 0) jobs.push([`Find ${usd(t.gap)} outside VIP`, "Thirty VIP seats do not cover the build. Stalls and sponsorship carry the rest."])
  if (bare.length) jobs.push([`${bare.length} lines with nobody against them`, bare.map((l) => l.label).join(", ") + "."])
  jobs.push(["Bedford County, 8 September", `Traffic control, EMS and the permit settle at that meeting. ${r.officers} officers plus a supervisor are in the sheet at the Franklin rate until then.`])
  jobs.push(["Walk the landing zone", "The LZ is provisional. Stand in it and send LifeFlight the real coordinate."])

  const levers: [string, string, string][] = [
    [
      "Buy the restrooms as one contract",
      `Standard, accessible and the VIP trailer are three lines here at list. They are ${r.portas + r.ada + 1} units from one supplier, and VannGo is already chosen for all of it.`,
      `${usd(t.rest)} at stake, ${Math.round((t.rest / (t.cost || 1)) * 100)} percent of the sheet`,
    ],
    ["Hold the trailer to the quoted figure", "A supplier quotes a 3 stall at $1,500 Friday to Sunday. The sheet carries $1,800 for a 4 to 5 stall because none has been quoted.", "Target saving $300"],
    ["Find picnic tables with benches", "General admission seating is priced as tables plus chairs because the rate card has nothing with benches.", "Target saving $270"],
    [
      "Use Bedford County's rate",
      `Traffic control sits at a Franklin published rate as a placeholder, now across ${r.officers} officers and a supervisor.`,
      `${usd(r.officers * 190 + r.supers * 220)} at stake, direction unknown`,
    ],
  ]

  const fillStripCells: [string, string, string][] = [
    ["Show cars wanted", String(a.cars), "Ten entered so far"],
    ["Vendor stalls", String(a.booths), "Two rows on the field"],
    ["Sponsor slots filled", `${t.named} of ${t.slotTotal}`, "Three on every line"],
  ]

  const rev = REV_LINES.map(([n, note, u, q], i) => {
    if (i === 0) return [n, note, u, a.booths] as const
    if (i === 1) return [n, note, a.vipAp, a.vipA] as const
    if (i === 2) return [n, note, a.vipBp, a.vipB] as const
    return [n, note, u, q] as const
  })
  const gross = rev.reduce((s, x) => s + x[2] * x[3], 0)
  const net = gross - t.cost
  const charity = Math.max(0, net) * (a.charity / 100)

  const modelStripCells: [string, string, string, string][] = [
    ["Gross revenue", usd(gross), "Stalls, VIP and sponsor floors", "ok"],
    ["Known cost", usd(t.cost), `${t.open} lines still unpriced`, ""],
    ["Net before unpriced", usd(net), "Optimistic by an unknown amount", net > 0 ? "" : "bad"],
    ["To the school", usd(charity), `${a.charity} percent of net`, "ok"],
    ["Left to the event", usd(net - charity), "Before the unpriced lines land", ""],
  ]

  return (
    <div className="rcApp">
      <div className="wrap">
        <header>
          <Livery />
          <p className="eyebrow">The Piston Powered Ranch · Saturday 10 October 2026</p>
          <h1>Ranch control</h1>
          <p className="sub">
            One workspace for the whole build. Every number here comes from the assumptions below, so a figure exists in exactly one place and moving it moves everything downstream. Put your name in once and the board records who changed what.
          </p>
        </header>

        <nav className="tabs" role="tablist">
          {TABS.map(([k, l, s]) => (
            <button key={k} type="button" role="tab" id={`t-${k}`} aria-selected={activeTab === k} aria-controls={`p-${k}`} onClick={() => setActiveTab(k)}>
              {l}
              <small>{s}</small>
            </button>
          ))}
        </nav>

        {activeTab !== "log" && (
          <dl className="strip">
            {stripCells.map(([dt, dd, sm, cls], i) => (
              <div className={`cell ${cls}`} key={i}>
                <dt>{dt}</dt>
                <dd>
                  {dd}
                  <small>{sm}</small>
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* ASSUMPTIONS */}
        <div className={`panel${activeTab === "assume" ? " on" : ""}`} id="p-assume" role="tabpanel">
          <h2>Assumptions</h2>
          <p className="lede">The dials the whole workspace reads. Change one and every phase and the model follow it.</p>

          <div className="who">
            <label htmlFor="whoName">Your name, so every change is attributed</label>
            <div className="whoRow">
              <input
                id="whoName"
                type="text"
                placeholder="Type your name once"
                autoComplete="name"
                enterKeyHint="done"
                value={whoName}
                onChange={(e) => setWhoName(e.target.value.slice(0, 60))}
              />
              <span className={`tag${whoName ? " on" : ""}`}>{whoName ? `Editing as ${whoName}` : "Not set"}</span>
            </div>
            <p className="liveNote">{liveNote}</p>
          </div>

          <div className="dials">
            {DIALS.map((d) => (
              <div className="dial" key={d.k}>
                <label htmlFor={`d-${d.k}`}>{d.label}</label>
                <input
                  id={`d-${d.k}`}
                  key={`dial-${d.k}-${data.dials[d.k]}`}
                  inputMode="numeric"
                  defaultValue={data.dials[d.k]}
                  disabled={!canEdit}
                  onBlur={(e) => onDialBlur(d.k, e.target.value)}
                />
                <div className="hint">{d.hint}</div>
              </div>
            ))}
          </div>

          <div className="note info" style={{ marginTop: 18 }}>
            <strong>Rates are editable. Counts are derived.</strong> A rate is a supplier's quote, so anyone can update it as quotes come in. A count follows from the plan, so restrooms, officers and tables are calculated from the dials above rather than typed. Set the dials once and every phase and the model read from them.
          </div>

          <h3 className="sec">What the dials drive</h3>
          <div className="calc">
            <span>
              <b>{a.cars}</b>
              <i>show cars</i>
            </span>
            <em>×</em>
            <span>
              <b>1.2</b>
              <i>occupants each</i>
            </span>
            <em>=</em>
            <span className="out">
              <b>{Math.round(a.cars * 1.2)}</b>
              <i>arriving with a car</i>
            </span>
          </div>
          <div className="calc">
            <span>
              <b>{r.outside.toLocaleString("en-US")}</b>
              <i>people outside VIP</i>
            </span>
            <em>÷</em>
            <span>
              <b>{a.perLoo}</b>
              <i>per unit</i>
            </span>
            <em>=</em>
            <span className="out">
              <b>{r.portas}</b>
              <i>restrooms, plus {r.ada} accessible</i>
            </span>
          </div>
          <div className="calc">
            <span>
              <b>
                {a.vipA} × {usd(a.vipAp)}
              </b>
              <i>tier one</i>
            </span>
            <em>+</em>
            <span>
              <b>
                {a.vipB} × {usd(a.vipBp)}
              </b>
              <i>tier two</i>
            </span>
            <em>=</em>
            <span className="out">
              <b>{usd(r.vipRev)}</b>
              <i>VIP revenue</i>
            </span>
          </div>
        </div>

        {/* PHASE 1 */}
        <div className={`panel${activeTab === "build" ? " on" : ""}`} id="p-build" role="tabpanel">
          <h2>Phase one, build</h2>
          <p className="lede">What it costs to put the day on the ground. Rates are editable; counts marked derived are computed from the assumptions and cannot be typed over, which is what stops the two models drifting apart again.</p>
          <ol className="todo">
            {jobs.map(([b, s], i) => (
              <li key={i}>
                <div>
                  <b>{b}</b>
                  <span>{s}</span>
                </div>
              </li>
            ))}
          </ol>
          <h3 className="sec">The sheet</h3>
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th scope="col">Line</th>
                  <th scope="col">State</th>
                  <th scope="col" className="n">Rate</th>
                  <th scope="col" className="n">Qty</th>
                  <th scope="col" className="n">Total</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => {
                  const { rate, qty, derived, by, at } = rowValue(row, a, r, data.sheet[row.k])
                  const priced = rate !== null && Number.isFinite(rate)
                  return (
                    <tr key={row.k} className={derived ? "derived" : priced ? "" : "open"}>
                      <td>
                        <span className="nm">{row.n}</span>
                        <span className="nt">
                          {row.note}
                          {by ? ` Last changed by ${by} on ${at}.` : ""}
                        </span>
                      </td>
                      <td>{derived ? <span className="tg d">Derived</span> : <span className={`tg ${priced ? "q" : "o"}`}>{priced ? "Priced" : "Open"}</span>}</td>
                      <td className="n">
                        <input
                          className="cin"
                          key={`rate-${row.k}-${rate ?? "open"}`}
                          defaultValue={priced ? (rate as number) : ""}
                          inputMode="decimal"
                          placeholder="-"
                          aria-label={`Rate for ${row.n}`}
                          disabled={!canEdit}
                          onBlur={(e) => onCellBlur(row, "rate", e.target.value)}
                        />
                      </td>
                      <td className="n">
                        {derived ? (
                          <span className="lock">{qty}</span>
                        ) : (
                          <input
                            className="cin q"
                            key={`qty-${row.k}-${qty}`}
                            defaultValue={qty}
                            inputMode="numeric"
                            aria-label={`Count for ${row.n}`}
                            disabled={!canEdit}
                            onBlur={(e) => onCellBlur(row, "qty", e.target.value)}
                          />
                        )}
                      </td>
                      <td className="n">
                        <span className="tot">{priced ? usd((rate as number) * qty) : "-"}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td>Cost to build</td>
                  <td></td>
                  <td className="n"></td>
                  <td className="n"></td>
                  <td className="n">{usd(t.cost)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="note" style={{ marginTop: 16 }}>
            <strong>Three lines size themselves from attendance.</strong> At {a.heads.toLocaleString("en-US")} people the sheet carries {r.officers} traffic officers and{" "}
            {r.supers ? "one supervising officer, required once three or more are on site" : "no supervising officer"}, {r.portas} restrooms plus {r.ada} accessible, and {r.tables} tables at one per stall plus twenty for hospitality.
          </div>
          {(() => {
            /* Square footage comes straight off each tent's own stated
               dimensions in its name, not a separate assumption. VIP seating
               is the one figure the rate card actually states a capacity
               for, "one 5ft round of eight under each", so it is the one
               figure checked against a real headcount below. */
            const TENTS: Record<string, { w: number; d: number; seatsEach?: number }> = {
              "tent-vip": { w: 20, d: 20, seatsEach: 8 },
              "tent-shade": { w: 20, d: 30 },
              "tent-main": { w: 40, d: 60 },
              "tent-second": { w: 20, d: 40 },
            }
            let count = 0
            let sqft = 0
            let vipSeats = 0
            for (const row of ROWS) {
              const spec = TENTS[row.k]
              if (!spec) continue
              const { qty } = rowValue(row, a, r, data.sheet[row.k])
              count += qty
              sqft += qty * spec.w * spec.d
              if (spec.seatsEach) vipSeats += qty * spec.seatsEach
            }
            const vipSold = a.vipA + a.vipB
            const vipCovers = vipSeats >= vipSold
            return (
              <div className="note info" style={{ marginTop: 12 }}>
                <strong>Tent summary.</strong> {count} tents, {sqft.toLocaleString("en-US")} sq ft of frame under contract.
                {" "}VIP seating covers VIP tickets: {vipSeats} seats under the four VIP tents against {vipSold} sold, {vipCovers ? `${vipSeats - vipSold} spare` : `${vipSold - vipSeats} short`}.
                {" "}The shade, main and secondary tents have no stated per-tent capacity on the rate card, so there is nothing to check general admission against yet. That number has to come from whoever quoted them, not be assumed here.
              </div>
            )
          })()}
          <h3 className="sec">Where it can come down</h3>
          <div className="lines">
            {levers.map(([h, p, amt], i) => (
              <div className="line" key={i} style={{ padding: "14px 15px" }}>
                <h4 style={{ margin: "0 0 5px", fontFamily: "var(--display)", fontWeight: 700, fontSize: 15.5, color: "var(--ink)" }}>{h}</h4>
                <p style={{ margin: "0 0 6px", fontSize: 13.5, lineHeight: 1.55, color: "var(--mute)" }}>{p}</p>
                <p style={{ margin: 0, fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--good)", fontWeight: 700 }}>{amt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PHASE 2 */}
        <div className={`panel${activeTab === "fill" ? " on" : ""}`} id="p-fill" role="tabpanel">
          <h2>Phase two, fill it</h2>
          <p className="lede">Cars, vendors and sponsors. Three slots on every line so nothing rests on one person's idea, and every slot says who is taking it and how close they are.</p>
          <div className="calc">
            <span>
              <b>1st</b>
              <i>you can call them today</i>
            </span>
            <em>→</em>
            <span>
              <b>2nd</b>
              <i>you know somebody who knows them</i>
            </span>
            <em>→</em>
            <span className="out">
              <b>3rd</b>
              <i>cold, no way in yet</i>
            </span>
          </div>
          <h3 className="sec">Where the field stands</h3>
          <div className="strip">
            {fillStripCells.map(([dt, dd, sm], i) => (
              <div className="cell" key={i}>
                <dt>{dt}</dt>
                <dd>
                  {dd}
                  <small>{sm}</small>
                </dd>
              </div>
            ))}
          </div>
          <h3 className="sec">Who is bringing the money</h3>
          <div className="lines">
            {SPONSOR_LINES.map((l) => {
              let named = 0
              const row = ROWS.find((x) => x.k === l.k)
              const amt = row
                ? (() => {
                    const { rate, qty } = rowValue(row, a, r, data.sheet[row.k])
                    return rate === null ? "open" : usd(rate * qty)
                  })()
                : "open"
              const slotEls = [1, 2, 3].map((i) => {
                const id = `${l.k}-${i}`
                const d: SponsorEntry | null = data.sponsors[id] ?? (i === 1 ? l.seed : null)
                if (d && (d.company || d.contact)) named += 1
                const filled = !!(d && (d.company || d.contact))
                const dl = DEGREES.find((x) => x[0] === (d?.degree || ""))?.[1] || ""
                const state = savingState[id] ?? "idle"
                return (
                  <div
                    className={`slot${filled ? " filled" : ""}`}
                    key={id}
                    ref={(el) => {
                      slotRefs.current[id] = el
                    }}
                  >
                    <div className="slotHead">
                      <span className="slotNo">Slot {i}</span>
                      {d?.degree ? <span className={`deg d${d.degree}`}>{dl}</span> : null}
                    </div>
                    <input className="f" data-f="company" key={`${id}-company-${d?.company ?? ""}`} defaultValue={d?.company ?? ""} placeholder="Company" disabled={!canEdit} />
                    <input className="f" data-f="contact" key={`${id}-contact-${d?.contact ?? ""}`} defaultValue={d?.contact ?? ""} placeholder="Contact name" disabled={!canEdit} />
                    <input className="f" data-f="method" key={`${id}-method-${d?.method ?? ""}`} defaultValue={d?.method ?? ""} placeholder="Email or phone" disabled={!canEdit} />
                    <div className="two">
                      <input className="f" data-f="owner" key={`${id}-owner-${d?.owner ?? ""}`} defaultValue={d?.owner ?? ""} placeholder="Who is taking it" disabled={!canEdit} />
                      <select className="f" data-f="degree" key={`${id}-degree-${d?.degree ?? ""}`} defaultValue={d?.degree ?? ""} disabled={!canEdit}>
                        {DEGREES.map(([v, lab]) => (
                          <option key={v} value={v}>
                            {lab}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input className="f" data-f="note" key={`${id}-note-${d?.note ?? ""}`} defaultValue={d?.note ?? ""} placeholder="What we know" disabled={!canEdit} />
                    <div className="slotFoot">
                      <button type="button" className="save" disabled={!canEdit || state === "saving"} onClick={() => saveSlot(id)}>
                        {state === "saving" ? "Saving" : state === "saved" ? "Saved" : "Save"}
                      </button>
                      <span className="by">{d?.updatedBy ? `By ${d.updatedBy}, ${d.updatedAt || ""}` : "Never edited"}</span>
                    </div>
                  </div>
                )
              })
              return (
                <article className="line" key={l.k}>
                  <div className="lineHead">
                    <div>
                      <h4>{l.label}</h4>
                      <p>{l.look}</p>
                    </div>
                    <div className="lineMeta">
                      <span className="amt">{amt}</span>
                      <span className={`cnt${named ? " on" : ""}`}>{named} of 3 named</span>
                    </div>
                  </div>
                  <div className="slots">{slotEls}</div>
                </article>
              )
            })}
          </div>
        </div>

        {/* PHASE 3 */}
        <div className={`panel${activeTab === "run" ? " on" : ""}`} id="p-run" role="tabpanel">
          <h2>Phase three, run the day</h2>
          <p className="lede">The order of the day, who holds each post, and the two things that have to be right before anybody drives in.</p>
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">What happens</th>
                  <th scope="col">Who holds it</th>
                  <th scope="col">Public</th>
                </tr>
              </thead>
              <tbody>
                {RUN.map(([time, what, who, pub], i) => (
                  <tr key={i}>
                    <td className="n" style={{ textAlign: "left" }}>{time}</td>
                    <td>
                      <span className="nm">{what}</span>
                    </td>
                    <td style={{ color: "var(--mute)", fontSize: 13.5 }}>{who}</td>
                    <td>
                      <span className={`tg ${pub ? "q" : "d"}`}>{pub ? "Public" : "Internal"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="sec">Not negotiable before the gates open</h3>
          <ol className="todo">
            {GATES.map(([b, s], i) => (
              <li key={i}>
                <div>
                  <b>{b}</b>
                  <span>{s}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* LAUNCH */}
        <div className={`panel${activeTab === "launch" ? " on" : ""}`} id="p-launch" role="tabpanel">
          <h2>Launch</h2>
          <p className="lede">What the public sees, in the order they meet it. Every surface here is live already; this is the state of each one.</p>
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th scope="col">Surface</th>
                  <th scope="col">Who it is for</th>
                  <th scope="col">State</th>
                </tr>
              </thead>
              <tbody>
                {LAUNCH.map(([surface, who, state], i) => (
                  <tr key={i}>
                    <td>
                      {surface.startsWith("/") ? (
                        <a className="nm" href={surface}>{surface}</a>
                      ) : (
                        <a className="nm" href={`https://${surface}`} target="_blank" rel="noopener">{surface}</a>
                      )}
                    </td>
                    <td style={{ color: "var(--mute)", fontSize: 13.5 }}>{who}</td>
                    <td style={{ fontSize: 13.5 }}>{state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* THE MODEL */}
        <div className={`panel${activeTab === "model" ? " on" : ""}`} id="p-model" role="tabpanel">
          <h2>The model</h2>
          <p className="lede">Revenue against cost, both computed from the same assumptions the rest of the workspace uses. Lines with no quote are excluded from cost, so the net shown is better than reality, never worse.</p>
          <div className="strip">
            {modelStripCells.map(([dt, dd, sm, cls], i) => (
              <div className={`cell ${cls}`} key={i}>
                <dt>{dt}</dt>
                <dd>
                  {dd}
                  <small>{sm}</small>
                </dd>
              </div>
            ))}
          </div>
          <h3 className="sec">Revenue</h3>
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th scope="col">Line</th>
                  <th scope="col" className="n">Unit</th>
                  <th scope="col" className="n">Qty</th>
                  <th scope="col" className="n">Total</th>
                </tr>
              </thead>
              <tbody>
                {rev.map(([n, note, u, q], i) => (
                  <tr key={i}>
                    <td>
                      <span className="nm">{n}</span>
                      <span className="nt">{note}</span>
                    </td>
                    <td className="n">{usd(u)}</td>
                    <td className="n">{q}</td>
                    <td className="n">
                      <span className="tot">{usd(u * q)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Gross</td>
                  <td className="n"></td>
                  <td className="n"></td>
                  <td className="n">{usd(gross)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="note info" style={{ marginTop: 16 }}>
            <strong>Three shares are deliberately not counted above.</strong> Food and refreshment vendors share fifteen to twenty percent of sales. Handbags and watches were considered for a three percent share and rejected, because a watch sale closes by wire the following week and cannot be audited; those categories carry a higher stall fee and category exclusivity instead. Merchandise sales go entirely to the school. None can be modelled without a sales estimate, so none is counted. All three are upside on every number here.
          </div>
          <h3 className="sec">What scale drives</h3>
          <div>
            <div className="note info">
              <strong>Policing.</strong> {r.officers} traffic officers at {a.heads.toLocaleString("en-US")} people, plus one supervising officer, which is required once three or more are on site. {usd(r.officers * 190 + r.supers * 220)} in total, at the Franklin rate until Bedford County confirms on 8 September.
            </div>
            <div className="note info">
              <strong>Restrooms.</strong> {r.outside.toLocaleString("en-US")} people outside VIP at one per {a.perLoo} is {r.portas} units plus {r.ada} accessible. {usd(t.rest)} with the VIP trailer, {Math.round((t.rest / (t.cost || 1)) * 100)} percent of the build and the single largest line. One contract across all {r.portas + r.ada + 1} units is where the negotiation sits.
            </div>
            <div className="note info">
              <strong>Awaiting quotes.</strong> {t.open} lines. Insurance and EMS are required, so the net figure moves once those two are in. Everything else on this page is quoted or comes from a rate card.
            </div>
          </div>
        </div>

        {/* CHANGES */}
        <div className={`panel${activeTab === "log" ? " on" : ""}`} id="p-log" role="tabpanel">
          <h2>Event team update summary</h2>
          <p className="lede">Newest first. Every change anybody makes lands here with their name against it.</p>
          <ul className="changes">
            {data.changes.length ? (
              data.changes.slice(0, 30).map((c, i) => (
                <li key={i}>
                  <time>{c.at}</time>
                  <span>
                    <b>{c.who}</b> {c.what}
                  </span>
                </li>
              ))
            ) : (
              <li className="empty">No updates yet. The first change anybody makes shows up here.</li>
            )}
          </ul>
        </div>

        <footer>
          <p>
            Rancho Jaramillo
            <br />
            A PaddockGavin event, benefiting Community Elementary School
            <br />
            Internal working document. Costs, margins and sponsor positions are not public.
          </p>
        </footer>
      </div>
    </div>
  )
}
