/**
 * What an event is, and the one helper that turns its links into paths.
 *
 * Separate from load.ts because that file opens a Postgres pool, and the
 * public page is a client component. Importing one value from a module pulls
 * the whole module, so a single shared file would have put pg, and therefore
 * node's dns, into the browser bundle. It does not build, which is the good
 * version of that mistake.
 */

export interface EventBrand {
  name?: string
  ink?: string
  paper?: string
  accent?: string
  /** The same hue lifted for small text. Text only, never a fill. */
  accentText?: string
  second?: string
  secondText?: string
  display?: string
  body?: string
  logo?: string
  logoOnDark?: string
  wordmark?: string
  icon?: string
  inkName?: string
  paperName?: string
  accentName?: string
  secondName?: string
  host?: string
  tone?: string
}

export interface EventCta {
  label: string
  href: string
  primary?: boolean
}

export interface EventAct {
  id: string
  kicker: string
  title: string
  lede: string
  body: string[]
  img: string
  focal: string
  tone: string
  cta?: EventCta
  ctas?: EventCta[]
  lists?: { head: string; tone: string; items: string[] }[]
  tiers?: { name: string; tone: string; line: string; items: string[] }[]
  grid?: { t: string; b: string }[]
}

export interface EventContent {
  hero?: {
    img: string
    alt: string
    eyebrow: string
    title: string
    titleAccent?: string
    lead: string
    body: string
    ctas: EventCta[]
  }
  acts?: EventAct[]
}

export interface EventRow {
  id: string
  slug: string
  name: string
  venue_name: string | null
  venue_address: string | null
  starts_at: string | null
  ends_at: string | null
  charity: string | null
  status: string
  domain: string | null
  tagline: string | null
  accent: string | null
  brand: EventBrand
  content: EventContent
}

/** Links in the content carry {slug} so one row can serve any event. */
export function resolveHref(href: string, slug: string): string {
  return href.replace(/\{slug\}/g, slug)
}
