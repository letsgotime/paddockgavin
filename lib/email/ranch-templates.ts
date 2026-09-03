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
export type Stage =
  | "received"
  | "approved"
  | "waitlisted"
  | "declined"
  | "week-before"
  | "receipt"
  | "assets"
  /* The spectator run down to the gates. Five sends, opt out honoured at every
     one of them, and the count is a promise made at RSVP so it has to hold. */
  | "t-14"
  | "t-10"
  | "t-7"
  | "t-3"
  | "t-1"
  /* Campaign stages. Free general admission stays the headline everywhere, so
     these sell an upgrade to people who have already said yes, never a ticket
     to people who think they need one. */
  | "vip"
  | "packages"
  | "invoice"
  | "merch"
  | "nudge"
  | "thanks"

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
  /** Editorial body for a reminder. Supplied per send; there is no default,
      because inventing one is what put a promise in here that nobody made. */
  body?: string
  body2?: string
  /** Vendor and sponsor packages. Sizes are known; fees are not, so they are
      merge fields rather than numbers I would be guessing at. */
  size?: string
  fee?: string
  power?: string
  dueBy?: string
  payUrl?: string
  shopUrl?: string
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

    case "approved": {
      /* Bay, gate and grouping are set once the field is drawn. Before that
         the email says so; it never prints a gap to a real person. */
      const placed = Boolean(v.bay && v.gate)
      return {
        from: FROM.entry,
        subject: placed ? `You are in. Bay ${v.bay}, gates at ${v.gate}` : "You are in. Your car is on the field for 10 October",
        preheader: placed ? "Your bay, your gate time, and the morning run." : "Your place is held. Bay and gate time follow.",
        eyebrow: "Entry accepted",
        heading: "Your car is in the field",
        blocks: [
          { kind: "lead", text: `${first(v)}, ${car} is in.` },
          {
            kind: "facts",
            rows: [
              ...(v.bay ? [{ label: "Your bay", value: v.bay }] : []),
              ...(v.gate ? [{ label: "Gates open", value: v.gate }] : []),
              ...(v.make ? [{ label: "Grouped with", value: v.make }] : []),
              { label: "When", value: "Saturday 10 October 2026" },
              { label: "Where", value: "Rancho Jaramillo, Unionville, Tennessee" },
            ],
          },
          ...(placed
            ? []
            : ([{ kind: "p", text: "Your bay, your gate time and the make you are grouped with follow in a second email once the field is drawn, in the last week of September." }] as Block[])),
          { kind: "p", text: "Come in at the entrant gate and a marshal will walk you to your bay. Cars are grouped by make, so you will be parked with your own." },
          { kind: "p", text: "One hundred cars stage at Nash Creamery from 7:30am and roll to the ranch together at 8:30am. If you want a place in that run, reply and say so. It fills." },
          { kind: "quiet", text: "Spectators from 9am. We finish at 3pm. Food is beef raised on this ground, dry aged and cooked here." },
        ],
        signoff: "If your plans change, reply and tell us. A bay held for a car that does not arrive is a gap in a field of 300.",
      }
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

    case "vip":
      return vipT("entry", v)

    case "merch":
      return merchT("entry", v)

    case "thanks":
      return thanksT("entry", v)

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
              ...(v.loadIn ? [{ label: "Load in", value: v.loadIn }] : []),
              { label: "Trading", value: "9am to 3pm" },
              { label: "Where", value: "Rancho Jaramillo, Unionville, Tennessee" },
            ],
          },
          { kind: "p", text: v.loadIn
              ? "We will send the site plan with your pitch marked in the last week of September, once the field is set and we know where the cars sit."
              : "Your load in window comes with the site plan, with your pitch marked, in the last week of September, once the field is set and we know where the cars sit." },
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

    case "packages":
      return packagesVendorT(v)

    case "nudge":
      return nudgeT("vendor", v)

    case "thanks":
      return thanksT("vendor", v)

    case "invoice":
      return invoiceT("vendor", v)

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
              ...(v.assetsDue ? [{ label: "Artwork due", value: v.assetsDue }] : []),
              { label: "Event", value: "Saturday 10 October 2026" },
              { label: "Where", value: "Rancho Jaramillo, Unionville, Tennessee" },
            ],
          },
          { kind: "p", text: v.assetsDue
              ? "We need your logo as vector, on a transparent background, plus the exact wording of your name as you want it to appear. Printed material closes on the artwork date above and cannot be reopened."
              : "We need your logo as vector, on a transparent background, plus the exact wording of your name as you want it to appear. Bekah will confirm the artwork date with you; printed material cannot be reopened after it." },
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

    case "packages":
      return packagesSponsorT(v)

    case "nudge":
      return nudgeT("sponsor", v)

    case "thanks":
      return thanksT("sponsor", v)

    case "invoice":
      return invoiceT("sponsor", v)

    default:
      return null
  }
}

/* -------------------------------------------------------------- spectators */

const PLATE = {
  src: "https://paddockgavin.com/images/email/ppr-gate-band.jpg",
  alt: "The Rancho Jaramillo gate, with the track running in past the sign",
}

/** The run down to the gates. Five sends, and the count is a promise made at
 *  RSVP, so it has to hold. Editorial body is supplied per send: there is no
 *  default, because inventing one is what put a promise in here nobody made. */
const RUN: Record<string, { days: string; subject: string; eyebrow: string; heading: string; lead: string }> = {
  "t-14": {
    days: "14",
    subject: "Two weeks to the tenth",
    eyebrow: "Two weeks out",
    heading: "Two weeks to the tenth",
    lead: "Far enough out to plan the drive, close enough to put it in the diary properly.",
  },
  "t-10": {
    days: "10",
    subject: "Ten days out: what is on the field",
    eyebrow: "Ten days out",
    heading: "What is coming to the field",
    lead: "The field is close to set. Here is what is coming.",
  },
  "t-7": {
    days: "7",
    subject: "One week: parking, timings and food",
    eyebrow: "One week out",
    heading: "One week out",
    lead: "The practical email. Parking, timings, and what to expect when you arrive.",
  },
  "t-3": {
    days: "3",
    subject: "Three days: the forecast and what to wear",
    eyebrow: "Three days out",
    heading: "Three days out",
    lead: "A field is a field. Here is what the week looks like and how to dress for it.",
  },
  "t-1": {
    days: "1",
    subject: "Tomorrow. Gates at nine",
    eyebrow: "Tomorrow",
    heading: "Gates open tomorrow at nine",
    lead: "Everything is set. This is the last one before we see you.",
  },
}

function spectatorT(stage: Stage, v: Vars): Rendered | null {
  if (stage === "received") {
    return {
      from: FROM.spectator,
      subject: "You are counted for 10 October",
      preheader: "No ticket, nothing to print, nothing to pay.",
      eyebrow: "Free to attend",
      heading: "You are counted",
      image: PLATE,
      blocks: [
        { kind: "lead", text: `Thank you, ${first(v)}. Your party of ${v.party || "one"} is on the list.` },
        { kind: "p", text: "There is no ticket and no charge. The count is what tells us how much food to cook and how many restrooms to hire, so saying you are coming genuinely helps." },
        WHEN,
        { kind: "quiet", text: "Between now and the tenth we will send five short reminders, the last one the day before, and then nothing. Every one of them carries an unsubscribe link and we honour it the same day." },
      ],
      signoff: "Bring people. It is free for them too.",
      unsubscribe: "mailto:hello@pistonpoweredranch.com?subject=Unsubscribe",
    }
  }

  if (stage === "vip") return vipT("spectator", v)
  if (stage === "merch") return merchT("spectator", v)
  if (stage === "thanks") return thanksT("spectator", v)

  const r = RUN[stage]
  if (!r) return null

  const blocks: Block[] = [{ kind: "lead", text: r.lead }]
  /* Their words, when they arrive. Until then the gap is visible rather than
     filled with something plausible. */
  if (v.body) blocks.push({ kind: "p", text: v.body })
  else blocks.push({ kind: "quiet", text: `[${r.days} day reminder: copy to come]` })
  if (v.body2) blocks.push({ kind: "p", text: v.body2 })

  blocks.push(
    stage === "t-1"
      ? {
          kind: "facts",
          rows: [
            { label: "Gates", value: "9am tomorrow" },
            { label: "Finish", value: "3pm" },
            { label: "Parking", value: "Signed from Highway 41-A, free" },
            { label: "Cost", value: "Nothing, for any of it" },
          ],
        }
      : WHEN,
  )
  if (stage === "t-7" || stage === "t-3" || stage === "t-1") {
    blocks.push({ kind: "button", label: "Directions", href: "https://pistonpoweredranch.com" })
  }

  return {
    from: FROM.spectator,
    subject: r.subject,
    preheader: r.lead,
    eyebrow: r.eyebrow,
    heading: r.heading,
    image: stage === "t-1" ? PLATE : undefined,
    blocks,
    signoff:
      stage === "t-1"
        ? "Three hundred cars, chosen one at a time. We will see you tomorrow."
        : undefined,
    unsubscribe: "mailto:hello@pistonpoweredranch.com?subject=Unsubscribe",
  }
}

/* ------------------------------------------------------------- campaigns */

/* Free to attend is the headline and stays the headline. This is offered to a
   warm list, after somebody has already said they are coming, and it never
   implies a ticket is needed. The two tiers are quoted as ranges because ranges
   are what exist: the perks that separate them are not written down yet, so
   this names what is settled and stops. */
function vipT(surface: Surface, v: Vars): Rendered {
  return {
    from: FROM[surface],
    subject: "A different way to watch the tenth",
    preheader: "Still free to come. This is the version with a chair and shade.",
    eyebrow: "Optional, and only if you want it",
    heading: "A different way to watch",
    blocks: [
      { kind: "lead", text: `${first(v)}, you are already on the list and nothing about that changes. Entry is free and it stays free.` },
      { kind: "p", text: "For anyone who would rather not spend six hours standing on grass, there are two ways to take the day at a slower pace. Both are limited by the number of chairs that fit, not by a sales target." },
      {
        kind: "facts",
        rows: [
          { label: "VIP Patio", value: "From $249" },
          { label: "VIP Owners Quarters", value: "From $499" },
        ],
      },
      { kind: "p", text: "What each includes is being finalised with the ranch this week, and we would rather send you the detail than a promise. Reply with the word patio or quarters and we will hold you a place and send the specifics the moment they are set." },
      { kind: "quiet", text: "If you would rather just walk the field, do exactly that. Three hundred cars, free, and nobody will ask you for anything." },
    ],
    signoff: "Every dollar above the cost of putting the day on goes to Community Elementary School.",
    unsubscribe: "mailto:hello@pistonpoweredranch.com?subject=Unsubscribe",
  }
}

/* Vendors. Sizes and power are settled, fees are not, so the fee is a merge
   field with no default and renders as an obvious gap rather than a number. */
function packagesVendorT(v: Vars): Rendered {
  return {
    from: FROM.vendor,
    subject: "Stall sizes, power, and what it costs",
    preheader: "Four footprints, generator power, and how to pay.",
    eyebrow: "Vendor row",
    heading: "What is available",
    blocks: [
      { kind: "lead", text: `${first(v)}, here is the whole picture so you can decide in one sitting.` },
      {
        kind: "facts",
        rows: [
          { label: "10 by 10", value: v.fee || gap },
          { label: "10 by 20", value: gap },
          { label: "20 by 20", value: gap },
          { label: "40 by 40", value: gap },
          { label: "Generator power", value: v.power || "Available, tell us your draw" },
        ],
      },
      { kind: "p", text: "The row is kept deliberately short so every stall is worth walking to, which is also why we ask what you sell before we quote a size." },
      { kind: "p", text: "Say which footprint you want and whether you need power. We invoice from this system, you pay from the invoice, and your pitch is held the moment it clears." },
      ...(v.payUrl ? ([{ kind: "button", label: "Pay your invoice", href: v.payUrl }] as Block[]) : []),
      WHEN,
    ],
    signoff: "Bekah Stallard answers this address and handles the row.",
  }
}

/* Sponsors. No price appears here, by standing rule: the conversation decides
   the number, and a figure in an email decides it badly. */
function packagesSponsorT(v: Vars): Rendered {
  return {
    from: FROM.sponsor,
    subject: "What a partnership looks like on the tenth",
    preheader: "What is on the table, and what we need to know from you.",
    eyebrow: "Partnership",
    heading: "What is on the table",
    blocks: [
      { kind: "lead", text: `${v.org || "Your company"} in front of three hundred chosen cars, on a working ranch, on one Saturday in October.` },
      { kind: "p", text: "We do not sell tiers off a sheet. What is worth doing depends on what you actually want out of the day, and the honest version of that conversation takes ten minutes rather than a deck." },
      { kind: "p", text: "What is settled and worth knowing before it:" },
      {
        kind: "list",
        items: [
          "Three hundred cars, every one chosen rather than first come",
          "Free for the public, so the gate is not a filter on who sees you",
          "One working ranch, one day, no competing stages",
          "The day benefits Community Elementary School",
        ],
      },
      { kind: "p", text: "Tell us what a good outcome looks like for you and we will tell you straight whether the tenth can deliver it. Where it can, we invoice from this system and everything runs through one person from there." },
      WHEN,
    ],
    signoff: "Gavin Brooks and Bekah Stallard both read this address.",
  }
}

/* An invoice is an ask for money, so it says exactly what for, exactly how
   much, and exactly by when. Nothing else belongs in it. */
function invoiceT(surface: Surface, v: Vars): Rendered {
  return {
    from: FROM[surface],
    subject: `Invoice ${v.receiptNo || ""}`.trim() || "Your invoice",
    preheader: "What it covers, what it costs, and the date it is due.",
    eyebrow: "Invoice",
    heading: "Ready when you are",
    blocks: [
      { kind: "lead", text: `${first(v)}, here is the invoice we agreed.` },
      {
        kind: "facts",
        rows: [
          { label: "Invoice", value: v.receiptNo || gap },
          { label: "For", value: v.covers || gap },
          { label: "Amount", value: v.amount || gap },
          { label: "Due by", value: v.dueBy || gap },
        ],
      },
      ...(v.payUrl ? ([{ kind: "button", label: "Pay this invoice", href: v.payUrl }] as Block[]) : []),
      { kind: "p", text: "Paying it holds your place. Until it clears the space stays on the list, which is not us being difficult: it is the only fair way to run a row that fills." },
      { kind: "quiet", text: "A receipt follows automatically the moment it clears. If anything above is wrong, reply and we will reissue it the same day rather than ask you to pay it anyway." },
    ],
  }
}

/* Merch, offered before the day rather than sold at it. Nothing here names a
   product, because the shop is not built yet and inventing a t-shirt is how an
   email becomes a complaint. It names the reason and links the shop. */
function merchT(surface: Surface, v: Vars): Rendered {
  return {
    from: FROM[surface],
    subject: "Something to wear on the tenth",
    preheader: "Ordered before, worn on the day. Nothing needed at the gate.",
    eyebrow: "Before the day",
    heading: "Something to wear on the tenth",
    blocks: [
      { kind: "lead", text: `${first(v)}, this is the only thing we will try to sell you before October, and it is entirely optional.` },
      { kind: "p", text: "Anything ordered now arrives before the tenth, so it can be worn on the day rather than carried home in a bag. Nothing is sold at the gate that is not sold here first." },
      ...(v.shopUrl ? ([{ kind: "button", label: "See what there is", href: v.shopUrl }] as Block[]) : ([{ kind: "quiet", text: "[shop link to come]" }] as Block[])),
      { kind: "quiet", text: "Entry is still free, and it stays free whether you buy anything or not." },
    ],
    signoff: "What is left after the cost of the day goes to Community Elementary School.",
    unsubscribe: "mailto:hello@pistonpoweredranch.com?subject=Unsubscribe",
  }
}

/* The follow up, for somebody who asked and then went quiet. One message, and
   it gives them an easy way to say no, because a clean no is worth more in
   September than a maybe that has to be chased in October. */
function nudgeT(surface: Surface, v: Vars): Rendered {
  const what = surface === "vendor" ? "a stall" : "a partnership"
  return {
    from: FROM[surface],
    subject: "Still holding a space, and happy to let it go",
    preheader: "One message, and an easy way to say no.",
    eyebrow: "Following up",
    heading: "Still holding a space",
    blocks: [
      { kind: "lead", text: `${first(v)}, we spoke about ${what} for the tenth and I have not heard back, which is completely fine.` },
      { kind: "p", text: "The reason I am writing is that the row fills, and I would rather hold your place deliberately than hold it by accident while somebody else asks for it." },
      { kind: "p", text: "Two replies help either way. Say yes and I will send the invoice. Say not this year and I will take you off the list and stop writing, with no hard feelings and a standing invitation to come as our guest." },
      { kind: "quiet", text: "A no in September costs nobody anything. A no in October costs somebody a space they wanted." },
      WHEN,
    ],
    signoff: surface === "vendor" ? "Bekah Stallard, who reads this address." : "Gavin Brooks and Bekah Stallard, who both read this address.",
  }
}

/* The day after. It closes the loop, and it is the only message of the year
   that asks for nothing at all. Numbers are merge fields: the count of cars and
   the amount raised are known on the eleventh, not now. */
function thanksT(surface: Surface, v: Vars): Rendered {
  const who =
    surface === "entry" ? "for bringing a car"
    : surface === "vendor" ? "for trading with us"
    : surface === "sponsor" ? "for backing the day"
    : "for coming"
  return {
    from: FROM[surface],
    subject: "Thank you, and what the day did",
    preheader: "What happened, what it raised, and nothing to do.",
    eyebrow: "The day after",
    heading: "Thank you",
    blocks: [
      { kind: "lead", text: `${first(v)}, thank you ${who}.` },
      {
        kind: "facts",
        rows: [
          { label: "Cars on the field", value: v.org || gap },
          { label: "Raised for the school", value: v.amount || gap },
        ],
      },
      { kind: "p", text: "Photographs from the day follow next week and they are yours to use, with no watermark and nothing to credit." },
      { kind: "quiet", text: "There is nothing to do with this email. It is the one message of the year that asks for nothing." },
    ],
    signoff: "Same ground, same weekend, next year. You will hear from us long before then.",
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
  { surface: "entry", stage: "vip", label: "Entrant, VIP upgrade" },
  { surface: "entry", stage: "merch", label: "Entrant, merch" },
  { surface: "entry", stage: "week-before", label: "Entrant, week before" },
  { surface: "entry", stage: "thanks", label: "Entrant, day after" },
  { surface: "vendor", stage: "received", label: "Stall enquiry received" },
  { surface: "vendor", stage: "approved", label: "Stall confirmed" },
  { surface: "vendor", stage: "waitlisted", label: "Stall waitlisted" },
  { surface: "vendor", stage: "declined", label: "Vendor row full" },
  { surface: "vendor", stage: "week-before", label: "Vendor, week before" },
  { surface: "vendor", stage: "thanks", label: "Vendor, day after" },
  { surface: "vendor", stage: "packages", label: "Vendor packages" },
  { surface: "vendor", stage: "nudge", label: "Vendor follow up" },
  { surface: "vendor", stage: "invoice", label: "Vendor invoice" },
  { surface: "vendor", stage: "receipt", label: "Vendor receipt" },
  { surface: "sponsor", stage: "received", label: "Partner enquiry received" },
  { surface: "sponsor", stage: "approved", label: "Partnership confirmed" },
  { surface: "sponsor", stage: "assets", label: "Artwork chase" },
  { surface: "sponsor", stage: "declined", label: "Partner declined" },
  { surface: "sponsor", stage: "week-before", label: "Sponsor, week before" },
  { surface: "sponsor", stage: "thanks", label: "Sponsor, day after" },
  { surface: "sponsor", stage: "packages", label: "Sponsor packages" },
  { surface: "sponsor", stage: "nudge", label: "Sponsor follow up" },
  { surface: "sponsor", stage: "invoice", label: "Sponsor invoice" },
  { surface: "sponsor", stage: "receipt", label: "Sponsor receipt" },
  { surface: "spectator", stage: "received", label: "RSVP counted" },
  { surface: "spectator", stage: "vip", label: "Spectator, VIP upgrade" },
  { surface: "spectator", stage: "merch", label: "Spectator, merch" },
  { surface: "spectator", stage: "t-14", label: "Spectator, 14 days out" },
  { surface: "spectator", stage: "t-10", label: "Spectator, 10 days out" },
  { surface: "spectator", stage: "t-7", label: "Spectator, 7 days out" },
  { surface: "spectator", stage: "t-3", label: "Spectator, 3 days out" },
  { surface: "spectator", stage: "t-1", label: "Spectator, day before" },
  { surface: "spectator", stage: "thanks", label: "Spectator, day after" },
]
