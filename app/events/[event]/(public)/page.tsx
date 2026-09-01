import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { loadEvent, loadEventSlugs } from "@/lib/events/load"
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
  const title = [e.name, day].filter(Boolean).join(" · ")
  const description = e.tagline || `${e.name} at ${e.venue_name ?? ""}.`.trim()
  const canonical = `https://paddockgavin.com/events/${e.slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function EventPublicPage({ params }: { params: Promise<{ event: string }> }) {
  const { event } = await params
  const e = await loadEvent(event)
  if (!e) notFound()

  /* Only what the row actually holds. An event with no end time says nothing
     about one rather than guessing. */
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `https://paddockgavin.com/events/${e.slug}`,
  }
  if (e.tagline) jsonLd.description = e.tagline
  if (e.starts_at) jsonLd.startDate = e.starts_at
  if (e.ends_at) jsonLd.endDate = e.ends_at
  if (e.content?.hero?.img) jsonLd.image = [`https://paddockgavin.com${e.content.hero.img}`]
  if (e.venue_name) {
    jsonLd.location = {
      "@type": "Place",
      name: e.venue_name,
      ...(e.venue_address ? { address: e.venue_address } : {}),
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EventPublic event={e} />
    </>
  )
}
