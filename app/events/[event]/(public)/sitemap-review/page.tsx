import type { Metadata } from "next"
import { notFound } from "next/navigation"
import SitemapReviewApp from "./SitemapReviewApp"

/**
 * The review tool for public.map_features.
 *
 * Every zone and point on this event's site plan sat at a placeholder
 * location roughly two kilometres north of the real property, uncorrected
 * since the table was first seeded. This page is where that gets fixed for
 * good: a real satellite map, every zone and point draggable, every drag
 * saved straight back to the same table the public "On the ground" cards
 * will eventually read positions from.
 *
 * Password gated the same way ranchcontrol is, its own cookie, not shared
 * with that tool's session.
 */
export const metadata: Metadata = {
  title: "Site Plan Review",
  robots: { index: false, follow: false },
}

export default async function SitemapReviewPage({ params }: { params: Promise<{ event: string }> }) {
  const { event } = await params
  if (event !== "pistonpoweredranch") notFound()

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&display=swap" />
      <link rel="stylesheet" href="/vendor/leaflet.css" />
      <SitemapReviewApp eventSlug={event} />
    </>
  )
}
