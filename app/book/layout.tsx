import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book a Session — PaddockGavin",
  description:
    "Book time with Gavin — a lot walkthrough, a consulting session, or an event. Nashville, Tennessee.",
  openGraph: {
    title: "Book a Session — PaddockGavin",
    description: "Schedule time with Gavin. Lot ops, events, or software consulting.",
    url: "https://paddockgavin.com/book",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Book — PaddockGavin" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
