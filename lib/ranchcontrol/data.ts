/**
 * Ranch control: the data and the math, shared by the API routes and the
 * client page.
 *
 * Ported from the claude.ai artifact Gavin was sharing tonight. The
 * organising rule carries over unchanged: a number exists once. The dials
 * are the only place a planning figure is entered; every count that follows
 * from one is derived and cannot be typed over. Rates stay editable, because
 * a rate is a quote from a supplier and a count is a consequence of the plan.
 *
 * The site plan tab (Leaflet, satellite imagery, the property's exact
 * coordinates) is not ported. It is out of scope for this page: no map, no
 * site plan, no exact GPS or street address content of any kind.
 */

export interface DialDef {
  k: string
  label: string
  v: number
  hint: string
}

export interface Assumptions {
  heads: number
  cars: number
  booths: number
  vipA: number
  vipAp: number
  vipB: number
  vipBp: number
  perLoo: number
  perCop: number
  charity: number
}

export interface Derived {
  outside: number
  portas: number
  ada: number
  officers: number
  supers: number
  tables: number
  vipRev: number
}

export interface RowDef {
  k: string
  n: string
  note: string
  /** A supplier's price. null means no quote yet. */
  rate: number | null
  /** A fixed count, when it is not a function of the assumptions. */
  qty?: number
  /** A count that follows from the assumptions and cannot be typed over. */
  d?: (a: Assumptions, r: Derived) => number
}

export interface SheetEntry {
  rate?: number | null
  qty?: number
  updatedBy?: string
  updatedAt?: string
}

export interface SponsorSeed {
  company?: string
  contact?: string
  method?: string
  owner?: string
  degree?: string
  note?: string
}

export interface SponsorLineDef {
  k: string
  label: string
  look: string
  seed: SponsorSeed
}

export interface SponsorEntry {
  company?: string
  contact?: string
  method?: string
  owner?: string
  degree?: string
  note?: string
  updatedBy?: string
  updatedAt?: string
}

export interface ChangeEntry {
  who: string
  at: string
  ts: number
  what: string
}

export const DIALS: DialDef[] = [
  { k: "heads", label: "Attendance", v: 1744, hint: "Peak on site, everybody, all day. Drives restrooms, waste and officers." },
  { k: "cars", label: "Show cars", v: 300, hint: "Parked by marque." },
  { k: "booths", label: "Vendor stalls", v: 30, hint: "Two rows. Drives the table count." },
  { k: "vipA", label: "VIP seats, tier 1", v: 20, hint: "At the tier 1 price below." },
  { k: "vipAp", label: "Tier 1 price", v: 249, hint: "Settled 8 September." },
  { k: "vipB", label: "VIP seats, tier 2", v: 10, hint: "At the tier 2 price below." },
  { k: "vipBp", label: "Tier 2 price", v: 399, hint: "Settled 8 September." },
  { k: "perLoo", label: "People per restroom", v: 85, hint: "Six hour day with drink served." },
  { k: "perCop", label: "People per officer", v: 300, hint: "A supervisor is required at three or more." },
  { k: "charity", label: "Charity share", v: 30, hint: "Percent of net. Target 30 to 50. Stand behind the low end." },
]

/* rate: a supplier's price, editable. qty: either a number, or a function of
   the assumptions, in which case it is derived and locked. */
export const ROWS: RowDef[] = [
  { k: "tent-vip", n: "VIP tents, 20x20 frame", note: "One 5ft round of eight under each.", rate: 350, qty: 4 },
  { k: "tent-shade", n: "Shade tents, 20x30", note: "Three long tables under each.", rate: 350, qty: 5 },
  { k: "tent-main", n: "Main tent, 40x60", note: "White wedding, three piece.", rate: 1300, qty: 1 },
  { k: "tent-second", n: "Secondary tent, 20x40", note: "White wedding.", rate: 550, qty: 1 },
  { k: "seat-vip", n: "VIP seating", note: "Rounds and chairs for the VIP tents.", rate: 112, qty: 1 },
  { k: "seat-ga", n: "General admission seating", note: "Long tables and chairs. Chairs come out if picnic tables are found.", rate: 420, qty: 1 },
  { k: "tables", n: "Banquet tables", note: "One per stall plus twenty for hospitality.", rate: 9.5, d: (a) => a.booths + 20 },
  { k: "restroom-ga", n: "Portable restrooms", note: "Everyone outside VIP, at the ratio set in the dials.", rate: 170, d: (a) => Math.ceil((a.heads - a.vipA - a.vipB) / Math.max(1, a.perLoo)) },
  { k: "restroom-ada", n: "Accessible restrooms", note: "One in twenty, never fewer than three.", rate: 230, d: (a, r) => Math.max(3, Math.ceil(r.portas / 20)) },
  { k: "trailer", n: "VIP restroom trailer", note: "Four to five stalls. Unquoted; a 3 stall is quoted at $1,500.", rate: 1800, qty: 1 },
  { k: "officers", n: "Traffic control officers", note: "Franklin rate as a placeholder. Bedford County confirms 8 September.", rate: 190, d: (a) => Math.max(4, Math.ceil(a.heads / Math.max(1, a.perCop))) },
  { k: "super", n: "Supervising officer", note: "Required once three or more officers are on site. This line was missing from the build sheet entirely.", rate: 220, d: (a, r) => (r.officers >= 3 ? 1 : 0) },
  { k: "entertain", n: "Entertainment and AV", note: "DJ and photo booth. Arnie is on the microphone between sets.", rate: 500, qty: 1 },
  { k: "awards", n: "Awards, signage, production", note: "Range $500 to $750.", rate: 500, qty: 1 },
  { k: "permit", n: "County permit", note: "Bedford County.", rate: 155, qty: 1 },
  { k: "waste", n: "Waste and janitorial", note: "Scales with attendance. Price it beside the restroom contract.", rate: null, qty: 1 },
  { k: "insurance", n: "General and liquor liability", note: "Rancho Jaramillo named additional insured. Nothing else commits safely until this is bound.", rate: null, qty: 1 },
  { k: "ems", n: "First aid and EMS", note: "LifeFlight brings an aircraft. Confirm what the county wants on the ground.", rate: null, qty: 1 },
  { k: "bar", n: "Mobile bar", note: "Licence and certificate before a booking.", rate: null, qty: 1 },
  { k: "merch", n: "Merchandise production", note: "All sales go to the school, so production is the only cost.", rate: null, qty: 1 },
  { k: "picnic", n: "Picnic tables", note: "Not on the rate card at any size.", rate: null, qty: 1 },
  { k: "covers", n: "Table covers", note: "Nineteen tables need them.", rate: null, qty: 1 },
]

export const SPONSOR_LINES: SponsorLineDef[] = [
  { k: "tents", label: "Tents", look: "A brand on every structure on the field.", seed: { company: "Franklin tent supplier", method: "270 772 1122", note: "Holds the rate card. Supplier first, sponsor second." } },
  { k: "trailer", label: "VIP restroom trailer", look: "The most photographed convenience on the property.", seed: { company: "VannGo", note: "Already the selected restroom vendor and rents these." } },
  { k: "restroom-ga", label: "Portable restrooms", look: "The largest single line on the sheet.", seed: { company: "VannGo", note: "Buy all units on one contract." } },
  { k: "restroom-ada", label: "Accessible restrooms", look: "A healthcare or accessibility brand has a real reason.", seed: {} },
  { k: "seat-ga", label: "Tables, chairs, covers", look: "Whoever supplies the picnic tables we cannot find.", seed: {} },
  { k: "officers", label: "Traffic control", look: "A local business that benefits from the road staying open.", seed: { company: "Bedford County Sheriff", note: "Confirms requirement and rate 8 September." } },
  { k: "ems", label: "First aid and EMS", look: "Half solved already: an aircraft and a crew are coming.", seed: { company: "Vanderbilt LifeFlight", note: "Aircraft to the LZ and a booth on the field." } },
  { k: "beverage", label: "Beverage, non alcoholic", look: "Pouring rights. Call the bottler, not corporate.", seed: { company: "Coca-Cola Consolidated", note: "Tennessee bottler. Product, coolers and signage against exclusivity." } },
  { k: "beer", label: "Beer", look: "Two deals: a brewer for pouring rights, a concession split with the permit holder.", seed: { note: "Bedford County beer board licenses standard beer, not the state." } },
  { k: "waste", label: "Waste and janitorial", look: "Price it beside the restrooms and it lands lower.", seed: {} },
  { k: "insurance", label: "Liability cover", look: "A broker may sponsor to be the named broker.", seed: {} },
  { k: "bar", label: "Mobile bar", look: "Licence and certificate first.", seed: {} },
  { k: "entertain", label: "Entertainment and AV", look: "The stage has a voice in Arnie. This is the kit around him.", seed: {} },
  { k: "awards", label: "Awards and signage", look: "Their name on every direction anybody follows.", seed: {} },
  { k: "merch", label: "Merchandise", look: "Cover production and the school keeps every dollar of sales.", seed: {} },
  { k: "timepiece", label: "Timepiece house", look: "Separate from the watch vendor on the field. Do not put the two in conflict.", seed: {} },
  { k: "handbag", label: "Handbag house", look: "Jodi is the contact on the boutique side.", seed: {} },
  { k: "aviation", label: "Private aviation", look: "There is already a helicopter in the plan.", seed: {} },
]

/** [time, what happens, who holds it, is it public] */
export const RUN: [string, string, string, boolean][] = [
  ["6:30 AM", "Traffic officers on site, road signage placed", "Traffic control", false],
  ["7:00 AM", "Vendor and sponsor load in", "Vendors and sponsors", false],
  ["7:30 AM", "Procession cars stage at Nash Creamery", "Procession marshals", false],
  ["7:30 AM", "Car staging window opens", "Parking and staging", false],
  ["8:00 AM", "Judging window opens, runs to 1:00", "Judging panel", false],
  ["8:30 AM", "Procession rolls to the ranch", "Procession marshals", false],
  ["8:30 AM", "Cars parked in front of the crowd, by marque", "Show field", false],
  ["9:00 AM", "Gates open to the public", "All staff", true],
  ["9:00 AM", "Vendor village, merch and activities open", "Vendors", true],
  ["9:00 AM", "Mimosa bar opens, 21 plus", "Mobile bar vendor", true],
  ["9:45 AM", "EMS helicopter lands in front of spectators", "First aid and EMS", false],
  ["11:00 AM", "Silent auction opens", "Charity table", true],
  ["1:00 PM", "Judging closes", "Judging panel", false],
  ["1:00 PM", "Raffle drawn in front of the crowd", "Charity table", true],
  ["1:15 PM", "Silent auction closes", "Charity table", true],
  ["1:30 PM", "Awards", "Title sponsor and judges", true],
  ["3:00 PM", "Public hours end", "All staff", true],
  ["5:00 PM", "Load out complete", "Vendors and sponsors", false],
]

/** [surface, who it is for, state] */
export const LAUNCH: [string, string, string][] = [
  ["pistonpoweredranch.com", "Everyone", "Live. Cached, 95 to 97 on a phone."],
  ["/entry", "Entrants", "Live. Ten entries in, none with photographs until tonight's letters."],
  ["/vendor", "Vendors", "Live. Stripe checkout proven at $250."],
  ["/sponsor", "Sponsors", "Live. No rate card on it, deliberately."],
  ["/entries", "Everyone", "Live. Reads accepted cars only; none accepted yet."],
  ["/store", "Everyone", "Live. Most rows still price TBD."],
  ["/sitemap-review", "Team", "Live. Satellite, coordinates, LZ provisional."],
  ["/status", "Entrants", "Live. The link in every confirmation email."],
  ["/targets", "Team", "Live. Outreach board with sending and a log."],
  ["/console", "Team", "Live. Money behind can_see_money()."],
]

export const DEGREES: [string, string][] = [
  ["", "Not set"],
  ["1", "1st, can call today"],
  ["2", "2nd, know someone"],
  ["3", "3rd, cold"],
]

export const TABS: [string, string, string][] = [
  ["assume", "Assumptions", "the dials"],
  ["build", "Phase 1", "build"],
  ["fill", "Phase 2", "fill it"],
  ["run", "Phase 3", "run the day"],
  ["launch", "Launch", "go public"],
  ["model", "The model", "revenue vs cost"],
  ["log", "Updates", "the team log"],
]

export const usd = (n: number): string => "$" + Math.round(n).toLocaleString("en-US")

export const DEFAULT_DIALS: Record<string, number> = Object.fromEntries(DIALS.map((d) => [d.k, d.v]))

/** Assumptions, read off the dial map, with anything missing or non-numeric read as zero. */
export function assumptionsFrom(dials: Record<string, number>): Assumptions {
  const o = {} as Record<string, number>
  DIALS.forEach((d) => {
    o[d.k] = Number(dials[d.k]) || 0
  })
  return o as unknown as Assumptions
}

/** Everything derived from the assumptions: restrooms, officers, tables, VIP revenue. */
export function deriveFrom(a: Assumptions): Derived {
  const outside = Math.max(0, a.heads - a.vipA - a.vipB)
  const portas = Math.ceil(outside / Math.max(1, a.perLoo))
  const ada = Math.max(3, Math.ceil(portas / 20))
  const officers = Math.max(4, Math.ceil(a.heads / Math.max(1, a.perCop)))
  const supers = officers >= 3 ? 1 : 0
  const tables = a.booths + 20
  const vipRev = a.vipA * a.vipAp + a.vipB * a.vipBp
  return { outside, portas, ada, officers, supers, tables, vipRev }
}

/** A row's live rate, qty, and whether the qty is derived (locked). */
export function rowValue(row: RowDef, a: Assumptions, r: Derived, s: SheetEntry | undefined) {
  const rate = !s || s.rate === undefined ? row.rate : s.rate
  const qty = row.d ? row.d(a, r) : !s || s.qty === undefined ? row.qty ?? 0 : s.qty
  return {
    rate: rate === null || (rate as unknown) === "" ? null : Number(rate),
    qty: Number(qty) || 0,
    derived: !!row.d,
    by: s?.updatedBy,
    at: s?.updatedAt,
  }
}

export interface Totals {
  cost: number
  open: number
  rest: number
  named: number
  slotTotal: number
  vipRev: number
  gap: number
}

const RESTROOM_KEYS = new Set(["restroom-ga", "restroom-ada", "trailer"])

export function totalsFrom(a: Assumptions, r: Derived, sheet: Record<string, SheetEntry>, sponsors: Record<string, SponsorEntry>): Totals {
  let cost = 0
  let open = 0
  let rest = 0
  ROWS.forEach((row) => {
    const { rate, qty } = rowValue(row, a, r, sheet[row.k])
    if (rate === null || !Number.isFinite(rate)) {
      open += 1
      return
    }
    const line = rate * qty
    cost += line
    if (RESTROOM_KEYS.has(row.k)) rest += line
  })
  let named = 0
  SPONSOR_LINES.forEach((l) => {
    ;[1, 2, 3].forEach((i) => {
      const d = sponsors[`${l.k}-${i}`] ?? (i === 1 ? l.seed : null)
      if (d && (d.company || d.contact)) named += 1
    })
  })
  return { cost, open, rest, named, slotTotal: SPONSOR_LINES.length * 3, vipRev: r.vipRev, gap: cost - r.vipRev }
}

/** "8 Sep, 4:15 PM" style, the same shape the source artifact wrote client side. */
export function when(d: Date = new Date()): string {
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })
}

export interface FullState {
  dials: Record<string, number>
  sheet: Record<string, SheetEntry>
  sponsors: Record<string, SponsorEntry>
  changes: ChangeEntry[]
}
