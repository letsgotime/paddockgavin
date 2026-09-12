import type { Metadata } from "next"
import { notFound } from "next/navigation"
import RanchControlApp from "./RanchControlApp"

/**
 * Ranch control: the team's budget and sponsor tracker, password gated,
 * one shared password for the whole team rather than a staff sign in.
 *
 * This is the ported claude.ai artifact Gavin was sharing with Josh, Arnie
 * and Oscar tonight. It lives in (public) rather than (tools) on purpose:
 * (tools) is wrapped by CrmShell, which forces individual staff email or
 * magic link sign in, and this page needs none of that. The gate here is
 * its own thing, a cookie set by /api/ranchcontrol/auth, checked by
 * /api/ranchcontrol itself.
 *
 * Not indexed despite living in (public): this is Gavin's team's working
 * numbers, not a page for the public to find.
 */
/* Icons and the default share image both come from RANCH_DEFAULTS /
   RANCH_ICONS via the (public) group layout; only the title, description and
   share copy are worth overriding for this one page. */
export const metadata: Metadata = {
  title: "Team Workspace",
  description: "Budget, sponsors, and run of show for The Piston Powered Ranch team.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Piston Powered Ranch Team Workspace",
    description: "Budget, sponsors, and run of show, live for the team.",
  },
  twitter: {
    title: "Piston Powered Ranch Team Workspace",
    description: "Budget, sponsors, and run of show, live for the team.",
  },
}

export default async function RanchControlPage({ params }: { params: Promise<{ event: string }> }) {
  const { event } = await params
  /* The dials, the sheet and the sponsor lines below are all specific to
     this one event; there is nothing generic to serve for another slug. */
  if (event !== "pistonpoweredranch") notFound()

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&display=swap" />
      <RanchControlApp />
    </>
  )
}
