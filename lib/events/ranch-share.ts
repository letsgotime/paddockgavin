import type { Metadata } from "next"

/**
 * What one ranch page says about itself when it is shared.
 *
 * Next merges metadata shallowly, so a page that defines openGraph replaces
 * its layout's rather than adding to it. Three pages therefore either declare
 * the whole object or inherit the event page's url and unfurl as the event
 * page. This builds the whole object, once, so each page can name itself
 * without three copies of the same nine lines drifting apart.
 */

const ORIGIN = "https://pistonpoweredranch.com"
const CARD = `${ORIGIN}/og/ppr-rancho-og-v2.jpg`
const CARD_ALT = "The Piston Powered Ranch at Rancho Jaramillo, Unionville Tennessee"

export function ranchShare(a: { path: string; title: string; description: string }): Metadata {
  const url = `${ORIGIN}${a.path}`
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: url },
    openGraph: {
      title: a.title,
      description: a.description,
      url,
      siteName: "The Piston Powered Ranch",
      type: "website",
      images: [{ url: CARD, width: 1200, height: 630, alt: CARD_ALT }],
    },
    twitter: { card: "summary_large_image", title: a.title, description: a.description, images: [CARD] },
  }
}
