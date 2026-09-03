import { redirect } from "next/navigation"

/** Creator Day is cancelled. The address stays alive; it lands on the events page. */
export default function CreatorDayPage() {
  redirect("/events")
}
