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
  /** The share card, 1200x630, absolute. Every event brings its own. */
  og?: string
  /** What the share card shows, for anyone who cannot see it. */
  ogAlt?: string
  inkName?: string
  paperName?: string
  accentName?: string
  secondName?: string
  host?: string
  tone?: string
}

/** Who puts the event on, for structured data. Distinct from content.producer,
 *  which is the line of type under the lockup and is a string. */
export interface EventOrganizer {
  name: string
  url?: string
}

/** What it costs to walk in. Absent means we are not claiming anything. */
export interface EventAdmission {
  free?: boolean
  price?: string
  currency?: string
  /** Where a spectator says they are coming. */
  url?: string
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
  organizer?: EventOrganizer
  admission?: EventAdmission
  producer?: string
  seo?: { title?: string; description?: string }
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

/**
 * Where an event lives for the public.
 *
 * An event with its own domain is the thing people are given: it is on the
 * collateral, the share card and the emails, and it is what they type. That
 * domain is the canonical, and PaddockGavin is the producer standing behind
 * it rather than the destination.
 *
 * The canonical, the Open Graph url, the structured data and the sitemap all
 * have to name the same address or they argue with each other, so they all
 * come through here.
 */
export function publicOrigin(e: { domain?: string | null }): string {
  return e.domain ? `https://${e.domain}` : "https://paddockgavin.com"
}

export function publicUrl(e: { domain?: string | null; slug: string }): string {
  return e.domain ? `https://${e.domain}` : `https://paddockgavin.com/events/${e.slug}`
}

/** Links in the content carry {slug} so one row can serve any event. */
export function resolveHref(href: string, slug: string): string {
  return href.replace(/\{slug\}/g, slug)
}
