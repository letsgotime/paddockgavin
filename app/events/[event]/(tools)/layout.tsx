import type { ReactNode } from "react"
import CrmShell from "./CrmShell"

/**
 * Every CRM surface for one event sits inside this.
 *
 * Note what is NOT here: the event's public page. That is the sibling
 * (public) group, which has no CrmShell and is indexable. Two groups under one
 * dynamic segment, so /events/x is the public page and /events/x/targets is
 * the working one, without either layout reaching the other.
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
