import type { Metadata } from "next"
import { notFound } from "next/navigation"
import MeetingUpdatesApp from "./MeetingUpdatesApp"
import { SiteNav } from "@/components/site-nav"

/**
 * The live, editable planning document at /meetingupdates.
 *
 * Ported from a claude.ai artifact of the same content: same layout, same
 * print sheet, same two pages. The artifact's own save mechanism does not
 * exist outside claude.ai, so this version persists through
 * public.meeting_updates instead, behind the same password gate pattern
 * sitemap-review already uses. Password gated, its own cookie.
 */
export const metadata: Metadata = {
  title: "9/11/26 PPR Event Update",
  robots: { index: false, follow: false },
}

export default async function MeetingUpdatesPage({ params }: { params: Promise<{ event: string }> }) {
  const { event } = await params
  if (event !== "pistonpoweredranch") notFound()

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Archivo:wght@400;500;600;700;800&display=swap" />
      <SiteNav active="events" />
      <MeetingUpdatesApp />
    </>
  )
}
