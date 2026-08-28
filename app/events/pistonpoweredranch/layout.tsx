import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Piston Powered Ranch — PaddockGavin",
  description:
    "Three hundred curated cars on a working ranch. Saturday October 10 2026, 9:00 AM to 3:00 PM at Rancho Jaramillo in Unionville, Tennessee. Spectating is free, benefiting Community Elementary School.",
  openGraph: {
    title: "The Piston Powered Ranch — PaddockGavin",
    description:
      "Three hundred curated cars on a working ranch. October 10 2026, Unionville TN. Spectating is free.",
    url: "https://paddockgavin.com/events/pistonpoweredranch",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "The Piston Powered Ranch" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
