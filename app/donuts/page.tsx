import { redirect } from "next/navigation"

/**
 * Donuts ran its final edition in August 2026 (see app/events/page.tsx).
 * The address stays alive because it is printed on things; it lands on the
 * events page, where the morning is recorded.
 */
export default function DonutsPage() {
  redirect("/events")
}
