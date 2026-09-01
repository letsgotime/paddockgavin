import type { RanchEmail, Block } from "./ranch"
import type { DigestNews } from "../events/digest"
import type { EventRow } from "../events/types"

/**
 * The weekly letter to everybody who said they are coming.
 *
 * Two rules shape it.
 *
 * It only says what is true. Every section is built from a count or a name in
 * the database, and a section with nothing to report is left out rather than
 * padded. A weekly letter that invents news to fill itself is one people stop
 * opening, and the standing rule here is that nothing unsettled goes out. That
 * is why there is no "cars accepted" line while every submission is pending,
 * and no partner is named before they have committed.
 *
 * It can always be stopped. This is bulk mail, and Gmail and Yahoo both
 * require a way out of it from bulk senders; the welcome email shipped without
 * one, which the mail audit caught. Every send carries a visible link and the
 * route sets List-Unsubscribe beside it.
 */

export interface DigestVars {
  event: EventRow
  news: DigestNews
  /** Their first name, if we have it. */
  name?: string | null
  /** The one time link that takes them off the list. */
  unsubscribeUrl: string
}

const TOOLS = "https://pistonpoweredranch.com"
const IMG = `${TOOLS}/images/email`

function countdownLine(days: number | null): string {
  if (days === null) return "The day is here."
  if (days === 0) return "It is today."
  if (days === 1) return "Tomorrow."
  if (days <= 7) return `${days} days.`
  return `${days} days out.`
}

export function weeklyDigest(v: DigestVars): RanchEmail & { subject: string; from: string } {
  const { event, news } = v
  const first = (v.name || "").trim().split(/\s+/)[0]
  const blocks: Block[] = []

  blocks.push({
    kind: "lead",
    text: first
      ? `${first}, ${countdownLine(news.daysLeft).toLowerCase()} Here is where the tenth of October stands.`
      : `${countdownLine(news.daysLeft)} Here is where the tenth of October stands.`,
  })

  /* The numbers, which are counted rather than claimed. Party size is what we
     cook and hire against, so it is the one worth showing them. */
  const facts: { label: string; value: string }[] = []
  if (news.daysLeft !== null) facts.push({ label: "Days to go", value: String(news.daysLeft) })
  facts.push({ label: "Coming so far", value: `${news.heads} ${news.heads === 1 ? "person" : "people"}` })
  if (event.venue_name) facts.push({ label: "Where", value: event.venue_name })
  blocks.push({ kind: "facts", rows: facts })

  /* Named only once they have committed. Nobody appears here because we asked. */
  if (news.newPartners.length > 0) {
    blocks.push({ kind: "rule" })
    blocks.push({
      kind: "p",
      text:
        news.newPartners.length === 1
          ? "New this week, and confirmed:"
          : "New this week, and all confirmed:",
    })
    blocks.push({
      kind: "list",
      items: news.newPartners.map((p) => `${p.company}, ${p.kind === "sponsor" ? "partner" : "on vendor row"}`),
    })
  } else if (news.allPartners.length > 0) {
    blocks.push({ kind: "rule" })
    blocks.push({ kind: "p", text: "Confirmed on the day so far:" })
    blocks.push({
      kind: "list",
      items: news.allPartners.map((p) => `${p.company}, ${p.kind === "sponsor" ? "partner" : "on vendor row"}`),
    })
  }

  /* The running order, close in. Earlier than a fortnight it is noise. */
  if (news.runOfShow.length > 0 && news.daysLeft !== null && news.daysLeft <= 21) {
    blocks.push({ kind: "rule" })
    blocks.push({ kind: "p", text: "How the day runs:" })
    blocks.push({ kind: "list", items: news.runOfShow.map((r) => `${r.time_label}, ${r.activity}`) })
  }

  blocks.push({ kind: "rule" })
  blocks.push({
    kind: "p",
    text:
      "Nothing to book and nothing to print. Turn in off Highway 41-A and the marshals will point you down the ranch road. Spectator parking is free, on the pasture south of the show field.",
  })
  blocks.push({ kind: "button", label: "Everything about the day", href: TOOLS })

  /* Three plates of the ground it happens on. Decorative, and deliberately so:
     every fact above is already in words, so a blocked image costs nothing. */
  blocks.push({
    kind: "strip",
    shots: [
      { src: `${IMG}/strip-gate.jpg`, alt: "The gate at Rancho Jaramillo" },
      { src: `${IMG}/strip-barn.jpg`, alt: "The barn on the show field" },
      { src: `${IMG}/strip-dusk.jpg`, alt: "The pasture at dusk" },
    ],
  })

  blocks.push({ kind: "rule" })
  blocks.push({
    kind: "links",
    rows: [
      {
        label: "Stop these emails",
        url: v.unsubscribeUrl,
        note: "One click, no reply needed, and it takes you off the list for good.",
      },
    ],
  })

  const subject =
    news.daysLeft !== null && news.daysLeft <= 7
      ? `${countdownLine(news.daysLeft)} ${event.name}`
      : `${event.name}, ${countdownLine(news.daysLeft)}`

  return {
    from: `${event.name} <hello@pistonpoweredranch.com>`,
    subject,
    preheader: `Where the tenth of October stands. ${news.heads} coming so far.`,
    eyebrow: "The week",
    heading: countdownLine(news.daysLeft),
    /* An animated gif, because it is the only motion an inbox actually plays:
       Gmail and Outlook strip css animation entirely, and Outlook's engine is
       Word. Its first frame is a photograph that stands alone, which is what
       Outlook desktop will show and all anybody gets if images are blocked. */
    image: {
      src: `${IMG}/ranch-motion.gif`,
      alt: `${event.venue_name ?? "The ranch"}, the week before the tenth of October`,
    },
    blocks,
    signoff:
      "You are getting this because you told us you are coming. One short note a week until the day, and then nothing.",
  }
}
