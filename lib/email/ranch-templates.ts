import type { Block, RanchEmail } from "./ranch"

/**
 * Every message the Piston Powered Ranch sends, for every surface, at every
 * stage a submission passes through.
 *
 * The stages are not invented. public.submissions.status is constrained to
 * pending, approved, waitlisted and declined, so the loop is that enum plus the
 * two moments the enum cannot express: the week before the gates open, and a
 * payment landing. Moving a row in the console is what should send these.
 *
 * Rules held throughout, and worth stating because they are easy to lose:
 *   No price, no tier, no attendance figure, no award name. None of those are
 *   settled, and a transactional email is the worst place to guess.
 *   Anything specific to one applicant is a merge field with no default, so a
 *   missing value reads as an obvious gap rather than a plausible lie.
 *   No em dashes, no en dashes, anywhere.
 */

export type Surface = "entry" | "vendor" | "sponsor" | "spectator"
export type Stage = "received" | "approved" | "waitlisted" | "declined" | "week-before" | "receipt" | "assets"

export interface Vars {
  name?: string
  /** The car, the company, or what the stall sells. */
  org?: string
  bay?: string
  gate?: string
  make?: string
  loadIn?: string
  party?: string
  assetsDue?: string
  /** Receipt fields. */
  amount?: string
  receiptNo?: string
  method?: string
  paidOn?: string
  covers?: string
}

export interface Rendered extends RanchEmail {
  subject: string
  from: string
}

const FROM: Record<Surface, string> = {
  entry: "The Piston Powered Ranch <entries@pistonpoweredranch.com>",
  vendor: "The Piston Powered Ranch <vendors@pistonpoweredranch.com>",
  sponsor: "The Piston Powered Ranch <sponsors@pistonpoweredranch.com>",
  spectator: "The Piston Powered Ranch <hello@pistonpoweredranch.com>",
}

const WHEN: Block = {
  kind: "facts",
  rows: [
    { label: "When", value: "Saturday 10 October 2026" },
    { label: "Hours", value: "9am to 3pm" },
    { label: "Where", value: "Rancho Jaramillo, Unionville, Tennessee" },
    { label: "Entry", value: "Free, to show and to watch" },
  ],
}

const first = (v: Vars) => (v.name ?? "").trim().split(/\s+/)[0] || "there"
const gap = "[not set]"

/* ---------------------------------------------------------------- vehicles */

function entryT(stage: Stage, v: Vars): Rendered | null {
  const car = v.org || "your car"
  switch (stage) {
    case "received":
      return {
        from: FROM.entry,
        subject: "Your car is in the queue for 10 October",
        preheader: "We read every entry ourselves. Here is what happens next.",
        eyebrow: "Entry received",
        heading: "Your car is in the queue",
        blocks: [
          { kind: "lead", text: `Thank you for entering ${car}.` },
          { kind: "p", text: "The Piston Powered Ranch takes 300 cars and every one of them is chosen. A person reads your entry rather than a form deciding on a first come basis. That takes us a little time, and it is the reason the field looks the way it does." },
          { kind: "p", text: "You will hear either way. If your car is in, that email carries your gate time, your bay and the make you are grouped with." },
          WHEN,
          { kind: "quiet", text: "Nothing is owed and nothing is due." },
        ],
        signoff: "Reply if anything about the car changes, including if you need to pull out. Knowing early costs us nothing. Knowing on the day costs a space somebody else wanted.",
      }

    case "approved":
      return {
        from: FROM.entry,
        subject: `You are in. Bay ${v.bay || gap}, gates at ${v.gate || gap}`,
        preheader: "Your bay, your gate time, and the morning run.",
        eyebrow: "Entry accepted",
        heading: "Your car is in the field",
        blocks: [
          { kind: "lead", text: `${first(v)}, ${car} is in.` },
          {
            kind: "facts",
            rows: [
              { label: "Your bay", value: v.bay || gap },
              { label: "Gates open", value: v.gate || gap },
              { label: "Grouped with", value: v.make || gap },
              { label: "Where", value: "Rancho Jaramillo, Unionville, Tennessee" },
            ],
          },
          { kind: "p", text: "Come in at the entrant gate and a marshal will walk you to your bay. Cars are grouped by make, so you will be parked with your own." },
          { kind: "p", text: "One hundred cars stage at Nash Creamery from 7:30am and roll to the ranch together at 8:30am. If you want a place in that run, reply and say so. It fills." },
          { kind: "quiet", text: "Spectators from 9am. We finish at 3pm. Food is beef raised on this ground, dry aged and cooked here." },
        ],
        signoff: "If your plans change, reply and tell us. A bay held for a car that does not arrive is a gap in a field of 300.",
      }

    case "waitlisted":
      return {
        from: FROM.entry,
        subject: "Held on the list for 10 October",
        preheader: "Not a no. What being on the list actually means.",
        eyebrow: "Waitlisted",
        heading: "You are on the list",
        blocks: [
          { kind: "lead", text: `${first(v)}, ${car} is held rather than placed.` },
          { kind: "p", text: "Cars withdraw. Every year some do, and when a bay opens we work down this list before we look anywhere else. So this is a real position, not a polite holding pattern." },
          { kind: "p", text: "You do not need to do anything. If a place comes up you will get the same email the accepted cars got, with a bay and a gate time." },
          WHEN,
        ],
        signoff: "If you would rather come and walk the field instead, say so and we will take you off the list. Entry is free either way.",
      }

    case "declined":
      return {
        from: FROM.entry,
        subject: "Not this year, and it is not a verdict on the car",
        preheader: "What happened, and the standing invitation.",
        eyebrow: "Entry",
        heading: "Not this year",
        blocks: [
          { kind: "lead", text: `${first(v)}, we could not fit ${car} into this year's field.` },
          { kind: "p", text: "Three hundred sounds like a lot of cars until you group them by make and start balancing the rows. Cars get left out that we wanted, and yours is one of them." },
          { kind: "p", text: "Come and walk the field anyway. Entry is free, gates open at 9am, and you will be welcome." },
          WHEN,
        ],
        signoff: "If you enter again next year, reply to this email and we will keep the thread so you are not starting from nothing.",
      }

    case "week-before":
      return {
        from: FROM.entry,
        subject: "Saturday: your bay, your gate, and the weather",
        preheader: "Everything for the tenth, in one place.",
        eyebrow: "This Saturday",
        heading: "Gates open Saturday",
        blocks: [
          { kind: "lead", text: `${first(v)}, we are five days out. Here is your day.` },
          {
            kind: "facts",
            rows: [
              { label: "Your bay", value: v.bay || gap },
              { label: "Gates open", value: v.gate || gap },
              { label: "Grouped with", value: v.make || gap },
              { label: "Doors to public", value: "9am" },
              { label: "Field clear", value: "3pm" },
            ],
          },
          { kind: "p", text: "Arrive with a full tank and clean glass. The field is grass, so bring something to stand on if you plan to work under the car." },
          { kind: "p", text: "One hundred cars stage at Nash Creamery from 7:30am and roll in together at 8:30am." },
          { kind: "button", label: "Directions and parking", href: "https://pistonpoweredranch.com" },
        ],
        signoff: "If you cannot make it, reply now rather than Saturday. Somebody on the list would take the bay.",
      }

    default:
      return null
  }
}

/* ----------------------------------------------------------------- vendors */

function vendorT(stage: Stage, v: Vars): Rendered | null {
  const what = v.org || "your stall"
  switch (stage) {
    case "received":
      return {
        from: FROM.vendor,
        subject: "Stall enquiry received for 10 October",
        preheader: "Three things and we can move quickly.",
        eyebrow: "Stall enquiry",
        heading: "Received, and being read",
        blocks: [
          { kind: "lead", text: `Thank you for asking about a stall, ${first(v)}.` },
          { kind: "p", text: "We take a limited number of vendors so that each one is worth walking to. If you have not already told us, reply with three things and we can move quickly:" },
          { kind: "list", items: ["What you sell or serve", "The footprint you need, including any vehicle or trailer", "Whether you need power, and how much"] },
          WHEN,
        ],
        signoff: "Bekah Stallard will come back to you with what is available.",
      }

    case "approved":
      return {
        from: FROM.vendor,
        subject: "Your stall is confirmed for 10 October",
        preheader: "What is held for you, and what we still need.",
        eyebrow: "Stall confirmed",
        heading: "You have a stall",
        blocks: [
          { kind: "lead", text: `${first(v)}, ${what} is confirmed for the tenth.` },
          {
            kind: "facts",
            rows: [
              { label: "Stall", value: what },
              { label: "Load in", value: v.loadIn || gap },
              { label: "Trading", value: "9am to 3pm" },
              { label: "Where", value: "Rancho Jaramillo, Unionville, Tennessee" },
            ],
          },
          { kind: "p", text: "We will send the site plan with your pitch marked in the last week of September, once the field is set and we know where the cars sit." },
          { kind: "p", text: "Two things we need from you before then: proof of liability insurance, and your final power draw if you asked for power. Reply with both when you have them." },
        ],
        signoff: "Anything about the pitch itself goes to Bekah Stallard, who reads replies to this address.",
      }

    case "waitlisted":
      return {
        from: FROM.vendor,
        subject: "Held on the vendor list for 10 October",
        preheader: "Not a no. Where you stand.",
        eyebrow: "Waitlisted",
        heading: "You are on the list",
        blocks: [
          { kind: "lead", text: `${first(v)}, ${what} is held rather than placed.` },
          { kind: "p", text: "We keep the vendor row deliberately short so that every stall is worth walking to, which means the list moves slowly. It does move: people withdraw, and footprints change once the field is drawn." },
          { kind: "p", text: "You do not need to do anything. If a pitch opens you get the confirmation email with a load in window." },
          WHEN,
        ],
      }

    case "declined":
      return {
        from: FROM.vendor,
        subject: "The vendor row is full for this year",
        preheader: "Full rather than a judgement, and what to do next year.",
        eyebrow: "Stall enquiry",
        heading: "Full for this year",
        blocks: [
          { kind: "lead", text: `${first(v)}, we cannot fit ${what} in this year.` },
          { kind: "p", text: "The row is kept short on purpose, and it filled. That is the whole reason, and it is not a comment on what you sell." },
          { kind: "p", text: "Come as a guest. Entry is free and the food is worth the drive on its own." },
          WHEN,
        ],
        signoff: "Reply to this email if you want to be asked first next year, and we will keep the thread.",
      }

    case "week-before":
      return {
        from: FROM.vendor,
        subject: "Saturday: your load in window and the site plan",
        preheader: "Where to pull in, and when.",
        eyebrow: "This Saturday",
        heading: "Load in on Saturday",
        blocks: [
          { kind: "lead", text: `${first(v)}, five days out. Here is your morning.` },
          {
            kind: "facts",
            rows: [
              { label: "Stall", value: what },
              { label: "Load in", value: v.loadIn || gap },
              { label: "Trading", value: "9am to 3pm" },
              { label: "Load out", value: "From 3pm, once the field clears" },
            ],
          },
          { kind: "p", text: "Vehicles have to be off the grass before the public come in at 9am, so the load in window is firm rather than a guide." },
          { kind: "button", label: "The site plan", href: "https://pistonpoweredranch.com" },
        ],
        signoff: "Bring more change than you think you need. Signal on the ranch is patchy, so do not rely on a card reader alone.",
      }

    case "receipt":
      return receiptT("vendor", v)

    default:
      return null
  }
}

/* ---------------------------------------------------------------- sponsors */

function sponsorT(stage: Stage, v: Vars): Rendered | null {
  const co = v.org || "your company"
  switch (stage) {
    case "received":
      return {
        from: FROM.sponsor,
        subject: "Your note reached the right desk",
        preheader: "Who is reading it, and when you will hear back.",
        eyebrow: "Partner enquiry",
        heading: "Your note reached the right desk",
        blocks: [
          { kind: "lead", text: `Thank you for asking about ${co} at the Piston Powered Ranch.` },
          { kind: "p", text: "Gavin Brooks and Bekah Stallard read every partner enquiry themselves. One of them will come back to you on what you actually asked about, rather than sending the same deck to everybody." },
          WHEN,
          { kind: "p", text: "Three hundred cars, every one of them chosen. Free for the public to attend. The day benefits Community Elementary School." },
        ],
        signoff: "If you have a date you need an answer by, put it in your reply and we will work to it.",
      }

    case "approved":
      return {
        from: FROM.sponsor,
        subject: `${co} is confirmed for 10 October`,
        preheader: "What happens next, and the one date we need from you.",
        eyebrow: "Partnership confirmed",
        heading: "We are glad to have you",
        blocks: [
          { kind: "lead", text: `${co} is confirmed for the tenth.` },
          { kind: "p", text: "Everything from here runs through one person so nothing falls between desks. Bekah Stallard will introduce herself this week and stay with you through to the day." },
          {
            kind: "facts",
            rows: [
              { label: "Artwork due", value: v.assetsDue || gap },
              { label: "Event", value: "Saturday 10 October 2026" },
              { label: "Where", value: "Rancho Jaramillo, Unionville, Tennessee" },
            ],
          },
          { kind: "p", text: "We need your logo as vector, on a transparent background, plus the exact wording of your name as you want it to appear. Printed material closes on the artwork date above and cannot be reopened." },
        ],
        signoff: "Send artwork by replying to this email. It reaches the person who lays out the boards.",
      }

    case "assets":
      return {
        from: FROM.sponsor,
        subject: "We still need your artwork",
        preheader: "One file, and the date the printer closes.",
        eyebrow: "Artwork",
        heading: "One thing outstanding",
        blocks: [
          { kind: "lead", text: `We do not have artwork for ${co} yet.` },
          {
            kind: "facts",
            rows: [
              { label: "Needed", value: "Vector logo, transparent background" },
              { label: "Also", value: "Your name exactly as it should read" },
              { label: "Due", value: v.assetsDue || gap },
            ],
          },
          { kind: "p", text: "After that date the boards go to print and we cannot change them. If the file is difficult to find, reply and say so and we will work with what you have rather than let the date pass." },
        ],
        signoff: "Reply to this email with the file attached.",
      }

    case "declined":
      return {
        from: FROM.sponsor,
        subject: "Not the right fit for this year",
        preheader: "Straight answer, and the door stays open.",
        eyebrow: "Partner enquiry",
        heading: "Not this year",
        blocks: [
          { kind: "lead", text: `${first(v)}, we are not going to be able to make something work with ${co} for the tenth.` },
          { kind: "p", text: "You asked a direct question and this is the direct answer, which is better than going quiet on you in September." },
          { kind: "p", text: "Come to the day as our guest. Entry is free, and it is the easiest way to judge for yourself whether next year is worth a conversation." },
          WHEN,
        ],
        signoff: "Reply to this email and we will keep the thread for next year.",
      }

    case "week-before":
      return {
        from: FROM.sponsor,
        subject: "Saturday: where to find your name, and your arrival",
        preheader: "Your activation, your arrival, your people.",
        eyebrow: "This Saturday",
        heading: "Five days out",
        blocks: [
          { kind: "lead", text: `${co} is on the field this Saturday.` },
          {
            kind: "facts",
            rows: [
              { label: "Your space", value: v.bay || gap },
              { label: "Arrival", value: v.loadIn || gap },
              { label: "Doors to public", value: "9am" },
              { label: "Field clear", value: "3pm" },
            ],
          },
          { kind: "p", text: "Come and find Gavin or Bekah when you arrive. We would rather walk you round ourselves than have you work out the field from a map." },
          { kind: "button", label: "Directions and parking", href: "https://pistonpoweredranch.com" },
        ],
        signoff: "Photographs from the day follow the week after, yours to use.",
      }

    case "receipt":
      return receiptT("sponsor", v)

    default:
      return null
  }
}

/* -------------------------------------------------------------- spectators */

function spectatorT(stage: Stage, v: Vars): Rendered | null {
  switch (stage) {
    case "received":
      return {
        from: FROM.spectator,
        subject: "You are counted for 10 October",
        preheader: "No ticket, nothing to print, nothing to pay.",
        eyebrow: "Free to attend",
        heading: "You are counted",
        blocks: [
          { kind: "lead", text: `Thank you, ${first(v)}. Your party of ${v.party || "one"} is on the list.` },
          { kind: "p", text: "There is no ticket and no charge. The count is what tells us how much food to cook and how many restrooms to hire, so saying you are coming genuinely helps." },
          WHEN,
          { kind: "quiet", text: "We will send parking and timings the week before. Nothing else will land in your inbox from us." },
        ],
        signoff: "Bring people. It is free for them too.",
        unsubscribe: "mailto:hello@pistonpoweredranch.com?subject=Unsubscribe",
      }

    case "week-before":
      return {
        from: FROM.spectator,
        subject: "Saturday: parking, timings and what to bring",
        preheader: "The one email we promised, and then we are done.",
        eyebrow: "This Saturday",
        heading: "Everything for Saturday",
        blocks: [
          { kind: "lead", text: "This is the email we said we would send, and it is the last one." },
          {
            kind: "facts",
            rows: [
              { label: "Gates", value: "9am" },
              { label: "Finish", value: "3pm" },
              { label: "Parking", value: "Signed from Highway 41-A, free" },
              { label: "Cost", value: "Nothing, for any of it" },
            ],
          },
          { kind: "p", text: "The field is grass. Wear something you do not mind getting dusty, and flat shoes will serve you better than smart ones." },
          { kind: "p", text: "Food is beef raised on this ground, dry aged and cooked here. Bring cash as well as a card, because signal on the ranch is patchy." },
          { kind: "button", label: "Directions", href: "https://pistonpoweredranch.com" },
        ],
        signoff: "Three hundred cars, chosen one at a time. We will see you there.",
        unsubscribe: "mailto:hello@pistonpoweredranch.com?subject=Unsubscribe",
      }

    default:
      return null
  }
}

/* ---------------------------------------------------------------- receipts */

function receiptT(surface: "vendor" | "sponsor", v: Vars): Rendered {
  return {
    from: FROM[surface],
    subject: `Receipt ${v.receiptNo || ""}`.trim(),
    preheader: "Payment received, and what it covers.",
    eyebrow: "Receipt",
    heading: "Thank you, that is settled",
    blocks: [
      { kind: "lead", text: `We have your payment for the Piston Powered Ranch.` },
      {
        kind: "facts",
        rows: [
          { label: "Receipt", value: v.receiptNo || gap },
          { label: "Paid", value: v.amount || gap },
          { label: "Method", value: v.method || gap },
          { label: "Date", value: v.paidOn || gap },
          { label: "Covers", value: v.covers || gap },
        ],
      },
      {
        kind: "p",
        text:
          surface === "vendor"
            ? "Your pitch is held. The site plan and your load in window follow in the last week of September, once the field is set."
            : "Everything agreed is now in hand. Artwork and placement run through Bekah Stallard from here.",
      },
    ],
    signoff: "Keep this email for your records. Reply to it if anything above is wrong and we will correct it same day.",
  }
}

/* ------------------------------------------------------------------ lookup */

export function ranchTemplate(surface: Surface, stage: Stage, v: Vars = {}): Rendered | null {
  switch (surface) {
    case "entry":
      return entryT(stage, v)
    case "vendor":
      return vendorT(stage, v)
    case "sponsor":
      return sponsorT(stage, v)
    case "spectator":
      return spectatorT(stage, v)
  }
}

/** Every combination that exists, for the preview index and for tests. */
export const CATALOGUE: { surface: Surface; stage: Stage; label: string }[] = [
  { surface: "entry", stage: "received", label: "Car entry received" },
  { surface: "entry", stage: "approved", label: "Car accepted" },
  { surface: "entry", stage: "waitlisted", label: "Car waitlisted" },
  { surface: "entry", stage: "declined", label: "Car not accepted" },
  { surface: "entry", stage: "week-before", label: "Entrant, week before" },
  { surface: "vendor", stage: "received", label: "Stall enquiry received" },
  { surface: "vendor", stage: "approved", label: "Stall confirmed" },
  { surface: "vendor", stage: "waitlisted", label: "Stall waitlisted" },
  { surface: "vendor", stage: "declined", label: "Vendor row full" },
  { surface: "vendor", stage: "week-before", label: "Vendor, week before" },
  { surface: "vendor", stage: "receipt", label: "Vendor receipt" },
  { surface: "sponsor", stage: "received", label: "Partner enquiry received" },
  { surface: "sponsor", stage: "approved", label: "Partnership confirmed" },
  { surface: "sponsor", stage: "assets", label: "Artwork chase" },
  { surface: "sponsor", stage: "declined", label: "Partner declined" },
  { surface: "sponsor", stage: "week-before", label: "Sponsor, week before" },
  { surface: "sponsor", stage: "receipt", label: "Sponsor receipt" },
  { surface: "spectator", stage: "received", label: "RSVP counted" },
  { surface: "spectator", stage: "week-before", label: "Spectator, week before" },
]
