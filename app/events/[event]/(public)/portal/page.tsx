import type { Metadata } from "next"
import Portal from "./Portal"
import { notFound } from "next/navigation"
import { loadEvent } from "@/lib/events/load"

/**
 * Where a person who is not staff sees their own business with the day.
 *
 * One door for everybody outside the desk: someone who entered a car, a
 * vendor, a sponsor. What they see is decided by what they own, not by a role
 * they were assigned, so there is no third and fourth version of this page to
 * keep in step.
 *
 * Never indexed. There is nothing here for a search engine and everything
 * here belongs to one person.
 */

export async function generateMetadata({ params }: { params: Promise<{ event: string }> }): Promise<Metadata> {
  const { event } = await params
  const e = await loadEvent(event)
  return {
    title: e ? `Your account · ${e.name}` : "Your account",
    description: "Sign in to see what is yours: your entry, your space, and where it stands.",
    robots: { index: false, follow: false, nocache: true },
  }
}

export default async function PortalPage({ params }: { params: Promise<{ event: string }> }) {
  const { event } = await params
  const e = await loadEvent(event)
  if (!e) notFound()
  return <Portal eventSlug={e.slug} eventName={e.name} />
}
