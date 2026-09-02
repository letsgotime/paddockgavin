import type { Metadata } from "next"
import { notFound } from "next/navigation"
import StoreFront from "./StoreFront"
import { loadEvent } from "@/lib/events/load"
import { publicUrl } from "@/lib/events/types"
import { storeItems } from "@/lib/shop/store"

/**
 * Any event's store: tickets, giving, and everything that takes money.
 *
 * One route for all of them, like the public page it sits under. The
 * beneficiary, the VIP rooms and the admission line all come from the events
 * row, so a second event brings its own store rather than a second codebase.
 *
 * Every card is honest about its state. Nothing carries a number that somebody
 * has not actually set: unpriced things read TBD, and they are already wired to
 * checkout, so setting a price puts them on sale with no code change.
 */

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ event: string }> }): Promise<Metadata> {
  const { event } = await params
  const e = await loadEvent(event)
  if (!e) return { title: "Store", robots: { index: false, follow: false } }

  const title = `Store · ${e.name}`
  const description = e.charity
    ? `Give to ${e.charity}, and everything else for ${e.name}.`
    : `Tickets and merchandise for ${e.name}.`
  const url = `${publicUrl(e)}/store`
  const card = e.brand.og

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: e.name,
      type: "website",
      ...(card ? { images: [{ url: card, width: 1200, height: 630, alt: e.brand.ogAlt || e.name }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description, ...(card ? { images: [card] } : {}) },
  }
}

export default async function StorePage({ params }: { params: Promise<{ event: string }> }) {
  const { event } = await params
  const e = await loadEvent(event)
  if (!e) notFound()
  return <StoreFront event={e} items={storeItems(e)} />
}
