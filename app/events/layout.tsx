import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Events — PaddockGavin",
  description:
    "Car events hosted and operated by Gavin — Donuts with duPont, Creator Day, and more. Nashville, Tennessee.",
  openGraph: {
    title: "Events — PaddockGavin",
    description: "Donuts with duPont, Creator Day, and more automotive events in Nashville.",
    url: "https://paddockgavin.com/events",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Events — PaddockGavin" }],
  },
  twitter: { card: "summary_large_image", images: ["/og/home.png"] },
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
