import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { loadEvent, loadEventSlugs, loadRunOfShow, loadMapFeatures, loadPartners } from "@/lib/events/load"
import { publicOrigin, publicUrl } from "@/lib/events/types"
import EventPublic from "./EventPublic"

/**
 * Any event's public page.
 *
 * One route for all of them. The palette, both typefaces, the words, the date
 * and the venue all come from the events row, so a second event is a row and a
 * logo rather than a second hand written page.
 *
 * Rendered on the server and revalidated, because this is the page the event
 * is found by and a search engine that gets an empty shell indexes an empty
 * shell.
 */

export const revalidate = 300

export async function generateStaticParams() {
  return (await loadEventSlugs()).map((event) => ({ event }))
}

export async function generateMetadata({ params }: { params: Promise<{ event: string }> }): Promise<Metadata> {
  const { event } = await params
  const e = await loadEvent(event)
  if (!e) return { title: "Event not found", robots: { index: false, follow: false } }

  const day = e.starts_at
    ? new Date(e.starts_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago" })
    : ""
  /* Under 60 characters so a result does not truncate it, and a middot rather
     than a dash, which is the house rule everywhere else too. */
  /* A row may carry its own search title under content.seo; otherwise
     name · day, which is what every event gets for free. */
  const title = e.content?.seo?.title || [e.name, day].filter(Boolean).join(" · ")
  const description = e.tagline || `${e.name} at ${e.venue_name ?? ""}.`.trim()
  const canonical = publicUrl(e)

  /* The share card comes off the event row like everything else here, so a
     second event brings its own rather than inheriting the ranch's. Without
     one, a shared link is a bare grey rectangle in every chat app, which is
     what this page shipped as when it moved onto this template. */
  const card = e.brand.og
  const images = card
    ? [{ url: card, width: 1200, height: 630, alt: e.brand.ogAlt || title }]
    : undefined

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website", images },
    twitter: { card: "summary_large_image", title, description, images: images?.map((i) => i.url) },
  }
}

export default async function EventPublicPage({ params }: { params: Promise<{ event: string }> }) {
  const { event } = await params
  const e = await loadEvent(event)
  if (!e) notFound()

  /* Fetched here rather than in the browser, so the day and the ground are in
     the HTML with everything else. */
  const [day, ground, partners] = await Promise.all([
    loadRunOfShow(),
    loadMapFeatures(e.id),
    loadPartners(e.id),
  ])

  /* Only what the row actually holds. An event with no end time says nothing
     about one rather than guessing. */
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: publicUrl(e),
  }
  if (e.tagline) jsonLd.description = e.tagline
  if (e.starts_at) jsonLd.startDate = e.starts_at
  if (e.ends_at) jsonLd.endDate = e.ends_at
  if (e.content?.hero?.img) jsonLd.image = [`${publicOrigin(e)}${e.content.hero.img}`]
  if (e.venue_name) {
    jsonLd.location = {
      "@type": "Place",
      name: e.venue_name,
      ...(e.venue_address ? { address: e.venue_address } : {}),
    }
  }

  /* Who puts it on, and what it costs to walk in. Both come off the row, so an
     event that charges says so and an event that has settled neither says
     nothing rather than having a price invented for it. A free event has to
     state that as an Offer of zero: "no offers" does not mean free to a
     search engine, it means unknown. */
  const org = e.content?.organizer
  if (org?.name) {
    jsonLd.organizer = { "@type": "Organization", name: org.name, ...(org.url ? { url: org.url } : {}) }
  }

  const adm = e.content?.admission
  if (adm && (adm.free || adm.price)) {
    jsonLd.offers = {
      "@type": "Offer",
      price: adm.free ? "0" : adm.price,
      priceCurrency: adm.currency || "USD",
      availability: "https://schema.org/InStock",
      url: adm.url || publicUrl(e),
      ...(e.starts_at ? { validFrom: e.starts_at } : {}),
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EventPublic event={e} day={day} ground={ground} partners={partners} />
    </>
  )
}
