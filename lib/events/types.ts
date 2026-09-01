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
  /** Type that sits on an accent fill. White on a red door, dark on an amber one. */
  onAccent?: string
  second?: string
  secondText?: string
  display?: string
  body?: string
  /** Google Fonts families to fetch, e.g. "Cinzel:wght@500;700;900". */
  fonts?: string[]
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

export interface EventTeaser {
  bg?: string
  film?: string
  poster?: string
  posterAlt?: string
  kicker?: string
  title: string
  body: string
  facts?: [string, string][]
  cta?: EventCta
}

export interface EventBand {
  bg?: string
  kicker?: string
  title: string
  body: string
  stats?: [string, string][]
  cta?: EventCta
  ctas?: EventCta[]
}

export interface EventContent {
  land?: EventBand
  why?: EventBand
  /** Which sections appear, and in what order. */
  sections?: string[]
  teaser?: EventTeaser
  /** The credit under the venue's mark. */
  producer?: string
  hero?: {
    img: string
    alt: string
    /** Where the photograph is framed, as object-position. */
    focal?: string
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
