"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * The live, editable "9/10/26 PPR Event Update" document.
 *
 * Ported from a claude.ai artifact: same two print-ready sheets, same
 * content, same interaction model (tap a box, type a note, it saves
 * itself, no save button). The artifact used claude.ai's own publish
 * capability to persist; this version PATCHes public.meeting_updates
 * instead, through /api/meeting-updates, behind the same password-gate
 * pattern as /sitemap-review.
 *
 * Every checkbox and text field is stamped with who touched it and when,
 * read from a one-time "who are you" name saved in this browser's
 * localStorage — there is no per-person login here, same as the artifact.
 */

type CheckRec = { v: boolean; by: string; at: string }
type TextRec = { v: string; by: string; at: string }
type Data = { c: Record<string, CheckRec>; t: Record<string, TextRec> }

const MARK = "/brand/rj-mark-320.png"

const TARGETS: { id: string; name: string; group: string }[] = [
  { id: "ferrari-nashville", name: "Ferrari Nashville", group: "dealers" },
  { id: "lamborghini-nashville", name: "Lamborghini Nashville", group: "dealers" },
  { id: "porsche-nashville", name: "Porsche Nashville", group: "dealers" },
  { id: "bmw-nashville", name: "BMW Nashville", group: "dealers" },
  { id: "111-motorcars", name: "111 Motorcars", group: "dealers" },
  { id: "auto-pro", name: "Auto Pro", group: "dealers" },
  { id: "auto-collection", name: "Auto Collection", group: "dealers" },
  { id: "kennedy-performance", name: "Kennedy Performance Center", group: "dealers" },
  { id: "exotic-auto-sport", name: "Exotic Auto Sport", group: "dealers" },
  { id: "german-performance", name: "German Performance Options", group: "dealers" },
  { id: "auto-vault", name: "Auto Vault Garage", group: "dealers" },
  { id: "the-collective", name: "The Collective", group: "dealers" },
  { id: "mercedes-nashville", name: "Mercedes-Benz of Nashville", group: "dealers" },
  { id: "vin-pics-miles", name: "Vin Pics Miles", group: "dealers" },
  { id: "ferrari-club", name: "Ferrari Club", group: "clubs" },
  { id: "lamborghini-club", name: "Lamborghini Club", group: "clubs" },
  { id: "pca-nashville", name: "Porsche Club of America (Nashville)", group: "clubs" },
  { id: "bmw-club", name: "BMW Club", group: "clubs" },
  { id: "standard-nashville", name: "The Standard Nashville", group: "clubs" },
  { id: "mob-inc", name: "Mob Inc", group: "clubs" },
  { id: "coca-cola", name: "Coca-Cola Consolidated", group: "beverage" },
  { id: "monster", name: "Monster Energy", group: "beverage" },
  { id: "nomad-ceramic", name: "Nomad of Nashville, or Ceramic Pro Nashville", group: "detailing" },
  { id: "southall", name: "Southall, Farm and Inn (Franklin)", group: "hospitality" },
  { id: "winery-ferrari", name: "Winery of Ferrari North America", group: "wine" },
]

const GROUPS: { key: string; h2: string; sub: string; pre?: React.ReactNode; open: { id: string; label: string | null }[] }[] = [
  {
    key: "dealers", h2: "Dealers and shops", sub: "Nashville area, closest to the cars already on the field.",
    pre: (
      <>
        <div className="assumption"><b>111 Motorcars is out as title sponsor, decided.</b> They can still sponsor some other way, just not the exclusive dealer position, so every dealer below is clear to call.</div>
        <div className="assumption"><b>Who reaches out, by relationship:</b> where Oscar already has the connection (111 and its own network), he makes the introduction rather than Gavin cold calling. Better close rate this close to the date, and Gavin takes point on that relationship himself next year, one fewer thing on Oscar each time after.</div>
      </>
    ),
    open: [{ id: "dealers-more-1", label: "More (write in)" }, { id: "dealers-more-2", label: null }],
  },
  { key: "clubs", h2: "Clubs", sub: "Members bring the cars. The sponsorship follows them.", open: [{ id: "clubs-more-1", label: "More (write in)" }] },
  { key: "beverage", h2: "Beverage", sub: "A sales split may fit this category better than a flat fee.", open: [{ id: "liquor-1", label: "Liquor companies" }, { id: "liquor-2", label: null }] },
  { key: "detailing", h2: "Detailing and care", sub: "Product, not service. The cars are already detailed for the show.", open: [{ id: "detail-supply-1", label: "Detail supply company" }] },
  { key: "hospitality", h2: "Hospitality", sub: "The founding-partner ask. Oscar signs this one.", open: [{ id: "hospitality-more-1", label: "More (write in)" }] },
  {
    key: "wine", h2: "Wine, aviation, insurance, finance",
    sub: "Open categories with a real precedent name attached, not yet approached. Insurance and finance now have a real product to pitch: staffing the $25 hospitality tent, not just a name on a sign.",
    open: [
      { id: "aviation-1", label: "Private aviation (the biggest open miss)" },
      { id: "insurance-1", label: "Collector insurance, Hagerty is the precedent" },
      { id: "finance-1", label: "Collector finance, Premier Financial Services is the precedent" },
    ],
  },
  {
    key: "farm", h2: "Farm and ranch trade", sub: "The venue’s own world. Nobody else at a car show is asking them.",
    open: [
      { id: "farm-lenders-1", label: "Farm land lenders" }, { id: "farm-lenders-2", label: null },
      { id: "farm-equipment-1", label: "Farm equipment manufacturers" }, { id: "farm-equipment-2", label: null },
    ],
  },
]

const TODAY_ROWS = [
  { id: "end-price", html: "VIP pricing approved and live, or changed here." },
  { id: "end-bundle", html: "The sponsor bundle settled: seats, perks, and the $399 gap closed." },
  { id: "end-entry", html: "Entry pricing decided, or tabled on purpose." },
  { id: "end-list", html: "A sponsor list ready to start recording who we’ve talked to, the status, a deadline for the ones we haven’t, and what’s left to discuss." },
]
const VIP_ROWS = [
  { id: "vip-price", html: <><b>The price.</b> $249 and $399 stand, or change them here.</> },
  { id: "vip-pairing", html: <><b>The room pairing above.</b> Terrace at $249, Owner’s Table at $399, or swapped.</> },
  { id: "vip-includes", html: <><b>What either includes.</b> Any line to add, cut, or move between rooms.</> },
  { id: "vip-golive", html: <><b>Go live.</b> The moment this is checked, the two rooms go on sale at pistonpoweredranch.com/store for real money. Not before.</> },
]
const TABLE_ROWS = [
  { id: "tbl-kelley", html: <><b>Kelley Lovelace.</b> Whether her information can be shared, or not.</> },
  { id: "tbl-entry", html: <><b>Entry pricing.</b> Not a fee. A $25 donation buys a t-shirt and a seat in a limited hospitality tent, shade and better refreshments, capacity capped. Entry itself stays free, so this replaces the $20-after-100-cars idea rather than sitting beside it.</> },
  { id: "tbl-targets", html: <><b>Sponsor targets.</b> Who is realistic at $500. Who is realistic at $1,000. The working list is the next page.</> },
  { id: "tbl-bundling", html: <><b>Sponsor bundling.</b> The proposal below, or selling the two apart.</> },
  { id: "tbl-restroom", html: <><b>Restroom count.</b> Ranch Control derives a number live from the attendance dial.</> },
  { id: "tbl-steers", html: <><b>The two steers.</b> What the presentation is called, and the slaughter date. Separate question: how the auction runs, and whether it’s one steer auctioned or both.</> },
  { id: "tbl-dupont", html: <><b>duPont Registry, live auction.</b> May or may not commit to a car. Need a backup house lined up before we’re counting on them. Bring a Trailer is the one already named.</> },
  { id: "tbl-elem", html: <><b>Community Elementary.</b> What it takes to get in front of them and settle how the day actually works with the school.</> },
  { id: "tbl-swag", html: <><b>Swag budget.</b> Shirts and hats, under $750 to start. Need a vendor and a quality bar.</> },
  { id: "tbl-rolls", html: <><b>The Rolls-Royce Wraith.</b> Confirm it can go out in the field for a video shoot, Friday 9/11.</> },
  { id: "tbl-southern", html: <><b>Southern Events.</b> A drop-in visit to see if they can support or help with tents.</> },
  { id: "tbl-charities", html: <><b>Charities to invite.</b> None named yet, beyond Community Elementary.</> },
  { id: "tbl-lifeflight", html: <><b>Life Flight Vanderbilt.</b> Email Megan Jones.</> },
  { id: "tbl-dj", html: <><b>A DJ.</b> Music playing whenever live music isn’t.</> },
  { id: "tbl-livemusic", html: <><b>Live music.</b> Whether it moves VIP sales, and whether to book more acts.</> },
]
const MECH_ROWS = [
  { id: "mech-car", html: <><b>The car.</b> Already theirs to give, or do we help source or donate one?</> },
  { id: "mech-recipient", html: <><b>The recipient.</b> How they’re chosen, and whether that’s settled before the event or announced live.</> },
  { id: "mech-moment", html: <><b>The moment.</b> Stage time, how long, sound and signage needs for the handoff.</> },
  { id: "mech-contact", html: <><b>Our contact.</b> Brian Sweatt is the name public materials point to. Confirm if that’s who we’re actually talking to.</> },
  { id: "mech-media", html: <><b>Media.</b> Recipient’s consent to be photographed and named, and whether they want press on it.</> },
  { id: "mech-liability", html: <><b>Liability.</b> Whose insurance covers a vehicle changing hands on our field.</> },
]
const NOTE_IDS = ["note-1", "note-2", "note-3", "note-4", "note-5"]

function stampDate() { const d = new Date(); return `${d.getMonth() + 1}/${d.getDate()}` }
function emptyData(): Data { return { c: {}, t: {} } }

export default function MeetingUpdatesApp() {
  const [phase, setPhase] = useState<"loading" | "locked" | "ready" | "error">("loading")
  const [data, setData] = useState<Data>(emptyData())
  const [password, setPassword] = useState("")
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState("")
  const [name, setNameState] = useState("")
  const [namePaneOpen, setNamePaneOpen] = useState(false)
  const [status, setStatus] = useState<{ text: string; tone?: "saving" | "ro" }>({ text: "" })
  const writableRef = useRef(true)
  const dataRef = useRef(data)
  dataRef.current = data

  useEffect(() => {
    try { setNameState(localStorage.getItem("ppr_name") || "") } catch { /* ignore */ }
  }, [])
  useEffect(() => {
    if (phase === "ready" && !name) setNamePaneOpen(true)
  }, [phase, name])

  const load = useCallback(async () => {
    const res = await fetch("/api/meeting-updates")
    if (res.status === 401) { setPhase("locked"); return }
    if (!res.ok) { setPhase("error"); return }
    const body = await res.json()
    setData(body.data || emptyData())
    setPhase("ready")
  }, [])
  useEffect(() => { void load() }, [load])

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault()
    setAuthBusy(true)
    setAuthError("")
    try {
      const res = await fetch("/api/meeting-updates", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (res.status === 401) { setAuthError("Wrong password."); setAuthBusy(false); return }
      if (!res.ok) { setAuthError("Could not reach the server."); setAuthBusy(false); return }
      await load()
    } catch {
      setAuthError("Could not reach the server.")
    }
    setAuthBusy(false)
  }

  const patch = useCallback(async (next: Data) => {
    if (!writableRef.current) return
    setStatus({ text: "Saving…", tone: "saving" })
    try {
      const res = await fetch("/api/meeting-updates", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ data: next }),
      })
      if (res.status === 401) {
        writableRef.current = false
        setPhase("locked")
        setAuthError("Logged out. Enter the password again, then retry.")
        setStatus({ text: "" })
        return
      }
      if (!res.ok) throw new Error("failed")
      setStatus({ text: "Saved" })
      setTimeout(() => setStatus((s) => (s.text === "Saved" ? { text: "" } : s)), 1600)
    } catch {
      setStatus({ text: "Couldn’t save, retrying", tone: "saving" })
      setTimeout(() => { void patch(dataRef.current) }, 3000)
    }
  }, [])

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  function saveSoon(next: Data) {
    setData(next)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => void patch(next), 600)
  }

  function toggleCheck(id: string) {
    const rec = data.c[id]
    const v = !(rec && rec.v)
    const next: Data = { ...data, c: { ...data.c, [id]: v ? { v: true, by: name || "Someone", at: stampDate() } : { v: false, by: "", at: "" } } }
    setData(next)
    void patch(next)
  }
  function setText(id: string, value: string) {
    setData((d) => ({ ...d, t: { ...d.t, [id]: { v: value, by: d.t[id]?.by || "", at: d.t[id]?.at || "" } } }))
  }
  function commitText(id: string) {
    const cur = data.t[id]?.v || ""
    const next: Data = { ...data, t: { ...data.t, [id]: cur.trim() ? { v: cur, by: name || "Someone", at: stampDate() } : { v: "", by: "", at: "" } } }
    saveSoon(next)
  }

  function chooseName(n: string) {
    setNameState(n)
    try { localStorage.setItem("ppr_name", n) } catch { /* ignore */ }
    setNamePaneOpen(false)
  }

  if (phase === "loading") return <div className="mu-shell"><MuStyle /><p style={{ padding: 40, fontFamily: "monospace" }}>Loading…</p></div>
  if (phase === "error") return <div className="mu-shell"><MuStyle /><p style={{ padding: 40, fontFamily: "monospace" }}>Could not reach the server. Reload to try again.</p></div>
  if (phase === "locked") {
    return (
      <div className="mu-shell">
        <MuStyle />
        <div style={{ maxWidth: 380, margin: "80px auto", padding: 24 }}>
          <h1 style={{ fontFamily: "Cinzel, serif", fontSize: 24 }}>9/10/26 PPR Event Update</h1>
          <form onSubmit={submitPassword} style={{ display: "grid", gap: 10, marginTop: 20 }}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoFocus
              style={{ padding: "11px 13px", border: "1.5px solid #837555", borderRadius: 8, font: "15px Archivo,sans-serif" }} />
            <button type="submit" disabled={authBusy || !password} style={{ padding: "12px 18px", background: "#14181D", color: "#FAF8F4", border: 0, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
              {authBusy ? "Checking…" : "Enter"}
            </button>
            {authError && <p style={{ color: "#B01319", fontSize: 13 }}>{authError}</p>}
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="mu-shell">
      <MuStyle />
      <div className="bar">
        <span className={"status" + (status.tone ? " " + status.tone : "")}>{status.text || " "}</span>
        <button className="who" type="button" onClick={() => setNamePaneOpen(true)}>Signing as <b>{name || "…"}</b></button>
      </div>
      {namePaneOpen && (
        <div className="namePane on" onClick={(e) => { if (e.target === e.currentTarget) setNamePaneOpen(false) }}>
          <div className="nameBox">
            <h3>Who are you?</h3>
            <button type="button" onClick={() => chooseName("Gavin")}>Gavin</button>
            <button type="button" onClick={() => chooseName("Oscar")}>Oscar</button>
            <NameInput onGo={chooseName} />
          </div>
        </div>
      )}

      <div className="sheet">
        <div className="livery"><i style={{ background: "#E5141A" }} /><i style={{ background: "#FAF8F4", border: "1px solid #D8D2C4" }} /><i style={{ background: "#1424A1" }} /></div>
        <div className="markWrap"><img className="mark" src={MARK} alt="Rancho Jaramillo" /></div>
        <header>
          <div>
            <p className="eyebrow">The Piston Powered Ranch &middot; Approval draft</p>
            <h1>VIP: Two Rooms, Thirty Seats</h1>
          </div>
          <div className="meta">
            <div>Saturday <b>October 10, 2026</b></div>
            <div>Rancho Jaramillo, Unionville TN</div>
            <div>For <b>Oscar</b> &middot; from Gavin</div>
          </div>
        </header>

        <p className="intro">What we&rsquo;re covering today: VIP pricing, entry pricing, and the sponsor plan, plus the smaller open items below.</p>
        <div className="decide" style={{ marginBottom: 30 }}>
          <h2>By the end of today</h2>
          {TODAY_ROWS.map((r) => <DecideRow key={r.id} id={r.id} data={data} onToggle={toggleCheck}>{r.html}</DecideRow>)}
        </div>

        <p className="intro">The hospitality copy below is already written and lives on the event page today. The price is new: settled internally at $249 and $399, never yet shown to anyone outside the team. Nothing here is live. This is the draft for approval before it goes public.</p>
        <h2>The two rooms</h2>
        <p className="sub">Both hosted. One goes further out.</p>
        <div className="rooms">
          <div className="room terrace">
            <p className="roomName">The Terrace</p><p className="roomPrice">$249</p><p className="roomSeats">20 seats</p>
            <ul>
              <li>Shaded tent, table service, air kept moving</li>
              <li>A bottle of whiskey, a bottle of wine, or dinner at Southall or Sinatra, arranged before you arrive</li>
              <li>Ranch raised Angus, aged steaks</li>
              <li>Commemorative shirt and hat</li>
              <li>Corral, petting zoo, and the photo areas</li>
            </ul>
          </div>
          <div className="room owner">
            <p className="roomName">The Owner&rsquo;s Table</p><p className="roomPrice">$399</p><p className="roomSeats">10 seats</p>
            <ul>
              <li>Everything on The Terrace, plus</li>
              <li className="extra">The quiet ride out by golf cart or hay ride</li>
              <li className="extra">A place the crowd never finds, for the pictures</li>
              <li className="extra">Time with Oscar, away from the noise</li>
              <li className="extra">A concierge from the ranch who stays with you</li>
              <li className="extra">Hay rides behind a horse, hay straws in the cocktails</li>
            </ul>
          </div>
        </div>
        <div className="assumption"><b>One pairing to confirm, not yet written down anywhere:</b> which price goes with which room. Above assumes Terrace at $249 and Owner&rsquo;s Table at $399, the higher price on the room that goes further out. If that is backwards, mark it below.</div>
        <div className="total">
          <div><span className="label">Total at thirty of thirty seats</span><span className="sub2">20 &times; $249 plus 10 &times; $399</span></div>
          <span className="figure">$8,970</span>
        </div>

        <div className="decide">
          <h2>To decide today</h2>
          {VIP_ROWS.map((r) => <DecideRow key={r.id} id={r.id} data={data} onToggle={toggleCheck}>{r.html}</DecideRow>)}
        </div>

        <h2>Also on the table</h2>
        <p className="sub">Not VIP. The rest of today&rsquo;s agenda.</p>
        <div className="decide">
          {TABLE_ROWS.map((r) => <DecideRow key={r.id} id={r.id} data={data} onToggle={toggleCheck}>{r.html}</DecideRow>)}
        </div>
        <div className="assumption"><b>The sponsor bundle, proposed:</b> $500 gets two VIP seats, an event sign with their brand, the steak meal, a complimentary gift, and every other VIP perk: $250 a seat. $1,000 gets four seats at the same rate, same perks. The $399 solo seat costs more per seat and carries no sign. Needs its own added value, or it is the worse deal.</div>
        <div className="assumption"><b>The hospitality tent is its own sponsorship, not just entry pricing:</b> whoever sponsors it staffs a table inside and gets real time with the $25 crowd, a self selected, more engaged audience than the general field. A charity, Hagerty, or a bank are all real fits. Ties directly to the open Collector insurance and Collector finance rows on the next page: this is the product to actually offer them, not just a category.</div>

        <h2>Mechanics on a Mission</h2>
        <p className="sub">Giving away a car at the event. Confirm fast, we don&rsquo;t understand the mechanics of it yet.</p>
        <div className="decide">
          {MECH_ROWS.map((r) => <DecideRow key={r.id} id={r.id} data={data} onToggle={toggleCheck}>{r.html}</DecideRow>)}
        </div>

        <h2>The pitch, two ways</h2>
        <p className="sub">Same day, what goes public versus what Oscar needs to see in full.</p>
        <p className="intro" style={{ marginBottom: 10 }}><b>Public<span className="mtag pub">safe to use</span></b></p>
        <p className="intro" style={{ marginBottom: 14 }}>Help Middle Tennessee close out fall before it gets chilly. Spend a day on the ranch.</p>
        <ul className="mlist">
          <li>Three hundred curated exotic cars</li>
          <li>Open pit barbecue, ranch raised Black Angus</li>
          <li>A vendor fair, curated with the ranch</li>
          <li>A live car giveaway</li>
          <li>A live exotic car auction</li>
          <li>A livestock auction</li>
          <li>A helicopter landing</li>
          <li>Live music from one of country music&rsquo;s biggest names</li>
          <li>Encanto Blossom Orchard&rsquo;s farmers market: apples, baked goods, preserves, tamales, and more</li>
        </ul>
        <p className="intro" style={{ marginBottom: 10 }}><b>For Oscar<span className="mtag priv">not for anyone else</span></b></p>
        <ul className="mlist internal">
          <li><b>Exotic car show.</b> Up to three hundred cars.</li>
          <li><b>Open pit BBQ.</b> Ranch raised Black Angus, donated by Rancho Jaramillo.</li>
          <li><b>Vendor fair.</b> Twenty five to thirty five vendors, already committed ones on the next page.</li>
          <li><b>Live car giveaway.</b> Mechanics on a Mission. Not understood yet, see the section above.</li>
          <li><b>Live exotic car auction.</b> Waiting on duPont Registry to commit. Bring a Trailer is the named backup.</li>
          <li><b>Livestock auction.</b> Ranch raised. Need details from Oscar: is it his own Black Angus steer, and is it one steer or both.</li>
          <li><b>Helicopter landing.</b> Life Flight Vanderbilt, Megan Jones is the contact to email.</li>
          <li><b>Live music.</b> A major country name, confirmed, cannot go public yet.</li>
          <li><b>Encanto Blossom Orchard farmers market.</b> Apples, fruit, baked goods, apple butter, grape jam, tamales, and more.</li>
          <li><b>Custom cowboy boots.</b> Need a vendor.</li>
          <li><b>Custom cowboy hats.</b> Need a vendor. Seth, if that contact is real.</li>
          <li><b>Custom sneakers.</b> Need a vendor.</li>
          <li><b>Cigars.</b> Placentia, Poppa P&rsquo;s, or the duPont contact. Not decided.</li>
        </ul>

        <div className="notes">
          <h3>Notes</h3>
          {NOTE_IDS.map((id) => <TextField key={id} id={id} data={data} onChange={setText} onCommit={commitText} className="tin note-ln" placeholder="-" />)}
        </div>
        <footer>
          <span className="footLeft"><img className="footMark" src={MARK} alt="" /><span>Piston Powered Ranch &middot; Event update</span></span>
          <span>Meeting September 10, 2026</span>
        </footer>
      </div>

      <div className="sheet targetsSheet">
        <div className="livery"><i style={{ background: "#E5141A" }} /><i style={{ background: "#FAF8F4", border: "1px solid #D8D2C4" }} /><i style={{ background: "#1424A1" }} /></div>
        <div className="markWrap"><img className="mark" src={MARK} alt="Rancho Jaramillo" /></div>
        <header>
          <div>
            <p className="eyebrow">The Piston Powered Ranch &middot; Prospecting draft</p>
            <h1>Sponsor Targets</h1>
          </div>
          <div className="meta">
            <div>Saturday <b>October 10, 2026</b></div>
            <div>Rancho Jaramillo, Unionville TN</div>
            <div>For <b>Oscar</b> &middot; from Gavin</div>
          </div>
        </header>
        <p className="intro">Not yet contacted. Mark $500 or $1,000 as each one is decided.</p>

        {GROUPS.map((g) => (
          <div key={g.key}>
            <h2>{g.h2}</h2>
            <p className="sub">{g.sub}</p>
            {g.pre}
            <div className="targets">
              <div className="tGroup">
                {TARGETS.filter((t) => t.group === g.key).map((t) => <TargetRow key={t.id} t={t} data={data} name={name} onToggle={toggleCheck} onChange={setText} onCommit={commitText} />)}
                {g.open.map((o, i) => (
                  <div key={o.id}>
                    {o.label && <div className="tOpenLabel">{o.label}</div>}
                    <div className="tOpenRow"><TextField id={o.id} data={data} onChange={setText} onCommit={commitText} className="tin" placeholder="name" /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <footer>
          <span className="footLeft"><img className="footMark" src={MARK} alt="" /><span>Piston Powered Ranch &middot; Sponsor targets</span></span>
          <span>Meeting September 10, 2026</span>
        </footer>
      </div>
    </div>
  )
}

function NameInput({ onGo }: { onGo: (n: string) => void }) {
  const [v, setV] = useState("")
  return (
    <>
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Someone else…" maxLength={24} />
      <button type="button" style={{ background: "#14181D", color: "#FAF8F4", textAlign: "center" }}
        onClick={() => { if (v.trim()) onGo(v.trim()) }}>Use this name</button>
    </>
  )
}

function Sig({ rec }: { rec?: CheckRec | TextRec }) {
  if (!rec || !rec.by) return null
  return <span className="sig">{rec.by} {rec.at}</span>
}

function DecideRow({ id, data, onToggle, children }: { id: string; data: Data; onToggle: (id: string) => void; children: React.ReactNode }) {
  const rec = data.c[id]
  return (
    <div className="row">
      <label>
        <input type="checkbox" className="chk" checked={!!rec?.v} onChange={() => onToggle(id)} />
        <p>{children}</p>
      </label>
      <Sig rec={rec} />
    </div>
  )
}

function TextField({ id, data, onChange, onCommit, className, placeholder }: { id: string; data: Data; onChange: (id: string, v: string) => void; onCommit: (id: string) => void; className: string; placeholder?: string }) {
  return (
    <input type="text" className={className} value={data.t[id]?.v || ""} placeholder={placeholder}
      onChange={(e) => onChange(id, e.target.value)}
      onBlur={() => onCommit(id)}
      onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur() }} />
  )
}

function TargetRow({ t, data, name, onToggle, onChange, onCommit }: {
  t: { id: string; name: string }; data: Data; name: string
  onToggle: (id: string) => void; onChange: (id: string, v: string) => void; onCommit: (id: string) => void
}) {
  const t500 = data.c[`${t.id}:500`], t1000 = data.c[`${t.id}:1000`]
  const talked = data.c[`${t.id}:talked`], closed = data.c[`${t.id}:closed`], passed = data.c[`${t.id}:passed`]
  const sigRec = talked?.v ? talked : closed?.v ? closed : passed?.v ? passed : t500?.v ? t500 : t1000
  return (
    <div className="tRow">
      <div className="tTop">
        <p className="tName">{t.name}</p>
        <div className="tTiers">
          <label className="tTier"><input type="checkbox" className="chk chkSm" checked={!!t500?.v} onChange={() => onToggle(`${t.id}:500`)} />$500</label>
          <label className="tTier"><input type="checkbox" className="chk chkSm" checked={!!t1000?.v} onChange={() => onToggle(`${t.id}:1000`)} />$1,000</label>
        </div>
      </div>
      <div className="tTrack">
        <label className="tStat"><input type="checkbox" className="chk chkSm" checked={!!talked?.v} onChange={() => onToggle(`${t.id}:talked`)} />Talked to</label>
        <label className="tStat"><input type="checkbox" className="chk chkSm" checked={!!closed?.v} onChange={() => onToggle(`${t.id}:closed`)} />Closed</label>
        <label className="tStat"><input type="checkbox" className="chk chkSm" checked={!!passed?.v} onChange={() => onToggle(`${t.id}:passed`)} />Passed</label>
        <span className="tField">By <TextField id={`${t.id}:by`} data={data} onChange={onChange} onCommit={onCommit} className="tin" placeholder="date" /></span>
        <span className="tField" style={{ flex: "2 1 160px" }}>Discuss <TextField id={`${t.id}:discuss`} data={data} onChange={onChange} onCommit={onCommit} className="tin" placeholder="notes" /></span>
      </div>
      <Sig rec={sigRec} />
    </div>
  )
}

function MuStyle() {
  return (
    <style>{`
  .mu-shell{--paper:#FAF8F4;--ink:#14181D;--body:#3A4048;--mute:#4B525C;--line:#837555;--red:#B01319;
    --display:Cinzel,"Trajan Pro",Georgia,serif;--sans:Archivo,"Helvetica Neue",Helvetica,Arial,sans-serif;--mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
    background:#EDE8DC;color:var(--body);font-family:var(--sans);font-size:14.5px;line-height:1.55;min-height:100vh}
  .mu-shell *{box-sizing:border-box}
  .sheet{max-width:860px;margin:0 auto;background:var(--paper);padding:clamp(28px,5vw,56px);min-height:100vh;position:relative}
  .livery{display:flex;height:4px;border-radius:2px;overflow:hidden;margin:0}
  .livery i{flex:1 1 0}
  .markWrap{display:flex;justify-content:center;padding:34px 0 30px}
  .mark{height:56px;width:auto;display:block}
  header{border-bottom:2px solid var(--ink);padding-bottom:18px;margin-bottom:26px;display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap}
  .eyebrow{font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--red);margin:0 0 8px;font-weight:700}
  h1{margin:0;font-family:var(--display);font-weight:800;font-size:clamp(26px,4.6vw,36px);color:var(--ink);letter-spacing:-.005em}
  .meta{text-align:right;font-family:var(--mono);font-size:11.5px;color:var(--mute);line-height:1.7}
  .meta b{color:var(--ink)}
  .intro{font-size:15px;color:var(--body);max-width:68ch;margin:0 0 30px}
  h2{font-family:var(--display);font-weight:700;font-size:19px;color:var(--ink);margin:0 0 4px;letter-spacing:-.005em}
  .sub{font-size:12.5px;color:var(--mute);margin:0 0 16px}
  .rooms{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1.5px solid var(--ink);border-radius:2px;overflow:hidden;margin-bottom:8px}
  .room{padding:20px 22px;border-left:1px solid var(--line)}
  .room:first-child{border-left:0}
  .room.owner{background:#F5F0E4}
  .roomName{font-family:var(--display);font-weight:700;font-size:17px;color:var(--ink);margin:0 0 3px}
  .roomPrice{font-family:var(--display);font-weight:800;font-size:32px;color:var(--red);margin:2px 0 2px;font-variant-numeric:tabular-nums}
  .roomSeats{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin:0 0 16px}
  .room ul{margin:0;padding:0;list-style:none}
  .room li{padding:7px 0;border-top:1px solid var(--line);font-size:13.5px;color:var(--body);display:flex;gap:9px}
  .room li:first-of-type{border-top:0}
  .room li::before{content:"-";flex:0 0 auto;color:var(--mute)}
  .room li.extra{font-weight:600;color:var(--ink)}
  .assumption{margin:14px 0 30px;padding:13px 16px;background:#FBF0DC;border:1px solid #E3C88A;border-radius:3px;font-size:13px;color:#5C4515}
  .assumption b{color:var(--ink)}
  .total{display:flex;justify-content:space-between;align-items:baseline;padding:16px 0;border-top:2px solid var(--ink);border-bottom:2px solid var(--ink);margin-bottom:34px}
  .total .label{font-family:var(--display);font-weight:700;font-size:16px;color:var(--ink)}
  .total .figure{font-family:var(--display);font-weight:800;font-size:24px;color:var(--ink);font-variant-numeric:tabular-nums}
  .total .sub2{display:block;font-family:var(--sans);font-weight:400;font-size:11px;color:var(--mute);margin-top:3px}
  .decide{margin-bottom:36px}
  .row{display:flex;align-items:flex-start;gap:12px;padding:2px 0;border-top:1px solid var(--line);flex-wrap:wrap}
  .row:first-of-type{border-top:0}
  .row label{display:flex;gap:12px;align-items:flex-start;flex:1 1 auto;cursor:pointer;margin:0;padding:11px 6px 11px 0;border-radius:6px;transition:background .15s ease}
  .row label:active{background:rgba(20,24,29,.05)}
  .row p{margin:0;font-size:13.5px;color:var(--body);flex:1 1 240px}
  .row p b{color:var(--ink)}
  .chk{appearance:none;-webkit-appearance:none;flex:0 0 auto;width:20px;height:20px;border:1.5px solid var(--ink);border-radius:5px;margin:1px 0 0;padding:0;cursor:pointer;position:relative;background:var(--paper);transition:background .12s ease,transform .12s ease}
  .chk:active{transform:scale(.9)}
  .chk:checked{background:var(--ink)}
  .chk:checked::after{content:"";position:absolute;left:6px;top:2px;width:5px;height:10px;border:solid var(--paper);border-width:0 2px 2px 0;transform:rotate(40deg)}
  .tTier,.tStat{min-height:30px;padding:4px 6px 4px 0;border-radius:6px;transition:background .15s ease}
  .tTier:active,.tStat:active{background:rgba(20,24,29,.05)}
  .chkSm{width:17px;height:17px;border-radius:4px}
  .chkSm:checked::after{left:5px;top:1.5px;width:4.5px;height:8.5px}
  .sig{display:inline-flex;align-items:center;gap:4px;font-family:var(--mono);font-size:10px;color:#5C7A5C;white-space:nowrap;margin-left:auto;padding:2px 8px;background:#E9F1E9;border-radius:999px}
  .sig::before{content:"✓";font-size:10px}
  .tin{font-family:inherit;font-size:13px;color:var(--ink);border:none;border-bottom:1px dotted var(--line);background:transparent;padding:6px 3px;width:100%;min-width:60px;min-height:30px;border-radius:2px}
  .tin:focus{outline:none;border-bottom:1.5px solid var(--ink);background:rgba(20,24,29,.03)}
  .tin::placeholder{color:var(--mute);opacity:.7}
  .note-ln{border-bottom:1px solid var(--line);height:28px;padding:0 2px;margin-bottom:4px}
  @media (hover:hover){
    .row label:hover{background:rgba(20,24,29,.035)}
    .tTier:hover,.tStat:hover{background:rgba(20,24,29,.035)}
    .chk:hover{border-color:var(--red)}
  }
  .targets{margin-bottom:8px}
  .tGroup{margin-bottom:28px}
  .tGroup:last-child{margin-bottom:0}
  .tRow{border-top:1px solid var(--line);padding:9px 0 4px}
  .tRow:first-of-type{border-top:0}
  .tTop{display:flex;align-items:center;justify-content:space-between;gap:16px}
  .tName{margin:0;font-size:13.5px;color:var(--ink);font-weight:600}
  .tTiers{display:flex;gap:14px;flex:0 0 auto}
  .tTier{display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:10.5px;letter-spacing:.04em;color:var(--mute)}
  .tOpenLabel{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);margin:0 0 8px;padding-top:9px;border-top:1px solid var(--line)}
  .tGroup>div:first-child .tOpenLabel{border-top:0;padding-top:0}
  .tOpenRow{padding-bottom:8px}
  .tTrack{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:6px 0 8px;font-family:var(--mono);font-size:10px;color:var(--mute)}
  .tStat{display:flex;align-items:center;gap:5px;white-space:nowrap;cursor:pointer}
  .tField{display:flex;align-items:center;gap:6px;flex:1 1 130px;min-width:110px}
  .tField .tin{font-size:11px}
  .mlist{margin:0 0 24px;padding:0;list-style:none}
  .mlist li{padding:7px 0;border-top:1px solid var(--line);font-size:13.5px;color:var(--body);display:flex;gap:9px}
  .mlist li:first-child{border-top:0}
  .mlist li::before{content:"-";flex:0 0 auto;color:var(--mute)}
  .mlist.internal li b{color:var(--ink)}
  .mtag{display:inline-block;font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;padding:2px 7px;border-radius:3px;margin-left:8px;vertical-align:1px}
  .mtag.pub{background:#E3EFE3;color:#2E5E3A}
  .mtag.priv{background:var(--pg-error-fill);color:var(--paper);font-weight:700}
  .notes{border:1.5px dashed var(--line);border-radius:3px;padding:18px 20px;margin-bottom:10px}
  .notes h3{margin:0 0 12px;font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--mute)}
  footer{margin-top:32px;padding-top:16px;border-top:1px solid var(--line);font-family:var(--mono);font-size:10.5px;color:var(--mute);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;align-items:center}
  .footMark{height:20px;width:auto;flex:0 0 auto;opacity:.85}
  .footLeft{display:flex;align-items:center;gap:9px}
  .bar{position:sticky;top:0;z-index:40;display:flex;justify-content:flex-end;gap:8px;align-items:center;padding:8px clamp(10px,3vw,20px);background:rgba(237,232,220,.92);backdrop-filter:blur(6px);font-family:var(--mono);font-size:11px;color:var(--mute)}
  .who{display:flex;align-items:center;gap:6px;background:var(--paper);border:1px solid var(--line);border-radius:999px;padding:5px 12px;cursor:pointer;color:var(--mute);font:500 11px var(--mono)}
  .who b{color:var(--ink);font-weight:700}
  .status{padding:5px 10px;color:var(--mute)}
  .status.saving{color:var(--red)}
  .status.ro{color:var(--paper);background:var(--pg-error-fill);border-radius:999px;padding:5px 12px}
  .namePane{position:fixed;inset:0;background:rgba(10,10,10,.4);z-index:60;display:flex;align-items:center;justify-content:center}
  .nameBox{background:var(--paper);border-radius:10px;padding:24px;max-width:300px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.35)}
  .nameBox h3{margin:0 0 12px;font-family:var(--display);font-size:18px;color:var(--ink)}
  .nameBox button{display:block;width:100%;text-align:left;padding:11px 14px;margin-bottom:8px;border:1.5px solid var(--ink);border-radius:8px;background:var(--paper);font:600 14px var(--sans);color:var(--ink);cursor:pointer}
  .nameBox input{width:100%;padding:10px 12px;border:1.5px solid var(--line);border-radius:8px;font:14px var(--sans);margin-bottom:8px}
  @media print{
    .bar,.namePane{display:none!important}
    .mu-shell{background:var(--paper)}
    .sheet{padding:0.4in;max-width:none}
    .notes{break-inside:avoid}
    .rooms{break-inside:avoid}
    .tGroup{break-inside:avoid}
    .targetsSheet{break-before:page;page-break-before:always}
    .tin{border-bottom:none!important;color:var(--ink)}
    .tin::placeholder{color:transparent}
    .chk{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  }
  @media (max-width:640px){
    .rooms{grid-template-columns:1fr}
    .room{border-left:0;border-top:1px solid var(--line)}
    .room:first-child{border-top:0}
    header{flex-direction:column;align-items:flex-start}
    .meta{text-align:left}
    .tTop{flex-wrap:wrap}
  }
    `}</style>
  )
}
