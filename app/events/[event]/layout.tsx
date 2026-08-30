import type { ReactNode } from "react"
import CrmShell from "./CrmShell"

/**
 * Every CRM surface for one event sits inside this.
 *
 * Note what is NOT here: the event's public landing page. That lives at
 * app/events/pistonpoweredranch/page.tsx as a real static route, and Next
 * prefers a static segment over a dynamic one, so the marketing page keeps
 * serving untouched while the working surfaces underneath it resolve here.
 */
export const metadata = {
  robots: { index: false, follow: false },
}

export default async function EventCrmLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ event: string }>
}) {
  const { event } = await params
  return <CrmShell slug={event}>{children}</CrmShell>
}
