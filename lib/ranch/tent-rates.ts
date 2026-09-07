/**
 * The tent vendor's rate card, transcribed from the handwritten sheet.
 *
 * Source: photograph supplied 7 September 2026, contact 270 772 1122, Franklin.
 * Header on the sheet reads "No Concrete", which is a siting condition on these
 * prices rather than a product name: staking, not ballast.
 *
 * These are somebody's trade prices. They are cost, not a customer price, so
 * they belong behind can_see_money() wherever they are shown, exactly like
 * budget_items. Nothing here goes on a public surface.
 *
 * Every figure is transcribed as written. Where the sheet is ambiguous it is
 * marked, and nothing has been rounded, inferred or filled in.
 */

export interface Rate {
  /** As written on the sheet. */
  size: string
  /** US dollars, as written. */
  price: number
  /** Anything the sheet says beside the number. */
  note?: string
}

export interface RateGroup {
  key: string
  label: string
  rates: Rate[]
}

/** Tents, grouped exactly as the sheet groups them. */
export const TENT_RATES: RateGroup[] = [
  {
    key: "auction",
    label: "Auction price",
    rates: [
      { size: "20x30", price: 350 },
      { size: "20x40", price: 400 },
      { size: "30x40", price: 450 },
      { size: "30x50", price: 450 },
      { size: "30x60", price: 475 },
    ],
  },
  {
    key: "white-wedding-3",
    label: "White wedding, 3 piece",
    rates: [
      { size: "40x40", price: 800 },
      { size: "40x60", price: 1300 },
      { size: "40x80", price: 1600 },
      { size: "40x100", price: 1900 },
    ],
  },
  {
    key: "white-wedding-2",
    label: "White wedding, 2 piece",
    rates: [
      { size: "30x30", price: 600 },
      { size: "30x45", price: 650, note: "written over another figure on the sheet" },
      { size: "30x50", price: 700 },
      { size: "30x60", price: 800 },
      { size: "30x70", price: 900 },
    ],
  },
  {
    key: "white-wedding",
    label: "White wedding",
    rates: [
      { size: "20x30", price: 500 },
      { size: "20x40", price: 550 },
    ],
  },
  {
    key: "white-wedding-60w",
    label: "White wedding, 60 wide",
    rates: [
      { size: "60x60", price: 2400, note: "400p on the sheet" },
      { size: "60x90", price: 3000, note: "600p on the sheet" },
    ],
  },
  {
    key: "frame",
    label: "Frame tent",
    rates: [
      { size: "20x20", price: 350 },
      { size: "30x30", price: 550 },
    ],
  },
  {
    key: "old-white-40",
    label: "Old white, 40 wide",
    rates: [
      { size: "40x40", price: 750 },
      { size: "40x60", price: 1200 },
      { size: "40x80", price: 1500 },
    ],
  },
  {
    key: "old-white-30",
    label: "Old white, 30 wide",
    rates: [
      { size: "30x30", price: 500 },
      { size: "30x45", price: 550 },
      { size: "30x60", price: 700 },
    ],
  },
  {
    key: "coloured",
    label: "Coloured and patterned",
    rates: [
      { size: "15x15", price: 300, note: "black and white" },
      { size: "20x20", price: 325, note: "yellow and white" },
      { size: "20x30", price: 350, note: "yellow and white" },
      { size: "20x40", price: 400, note: "white, pw on the sheet" },
      { size: "30x40", price: 550, note: "flag, blue and white" },
      { size: "30x50", price: 600, note: "Beetle Juice" },
    ],
  },
]

/** Everything that is not a tent, priced per unit. */
export const EXTRA_RATES: RateGroup[] = [
  {
    key: "seating",
    label: "Seating and tables",
    rates: [
      { size: "Chair", price: 1.75, note: "auction price" },
      { size: "Chair", price: 2.25, note: "700 available" },
      { size: "Table", price: 8, note: "auction price" },
      { size: "8ft table", price: 10, note: "28 available" },
      { size: "6ft table", price: 8, note: "8 available" },
      { size: "5ft round", price: 10, note: "25 available" },
    ],
  },
  {
    key: "fit-out",
    label: "Fit out",
    rates: [
      { size: "Dance floor 15x15", price: 450 },
      { size: "Stage 4x8", price: 50, note: "6 available" },
      { size: "Sides", price: 15 },
      { size: "Lights", price: 10 },
      { size: "Heater", price: 75 },
      { size: "Fan", price: 25 },
    ],
  },
]

/**
 * A worked example written on the sheet in blue, for a different job: set up
 * 28 April, event 1 May, 60x90 plus dance floor, 225 chairs, 30 rounds, 4L.
 * Kept because it shows how this vendor quotes a whole job, and it is not ours.
 */
export const SHEET_EXAMPLE = {
  setUp: "28 April",
  event: "1 May",
  items: "60x90, dance floor, 225 chairs, 30 rounds, 4L",
} as const

/** The vendor, as written. */
export const TENT_VENDOR = { phone: "270 772 1122", name: "Franklin" } as const
