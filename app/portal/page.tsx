import type { Metadata } from "next"
import Portal from "./Portal"
import { ranchShare } from "@/lib/events/ranch-share"

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

export const metadata: Metadata = {
  ...ranchShare({
    path: "/portal",
    title: "Your account · The Piston Powered Ranch",
    description: "Sign in to see your entry, your space on the field, and where it stands.",
  }),
  robots: { index: false, follow: false, nocache: true },
}

export default function PortalPage() {
  return <Portal />
}
