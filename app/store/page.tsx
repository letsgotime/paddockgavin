import type { Metadata } from "next"
import StoreFront from "./StoreFront"
import { ranchShare } from "@/lib/events/ranch-share"
import { storeItems } from "@/lib/shop/store"

/**
 * Tickets, giving and merchandise, in one place.
 *
 * Everything on it is honest about what it is: a thing you can buy, a thing to
 * ask about, or a thing that is not settled yet. Nothing carries a number that
 * somebody has not actually set, which is why most of the merchandise says so
 * plainly instead of guessing.
 */

export const metadata: Metadata = ranchShare({
  path: "/store",
  title: "Store · The Piston Powered Ranch",
  description:
    "Give to Community Elementary School, ask about the twenty VIP seats, and see the merchandise for October 10 at Rancho Jaramillo.",
})

export default function StorePage() {
  return <StoreFront items={storeItems()} />
}
