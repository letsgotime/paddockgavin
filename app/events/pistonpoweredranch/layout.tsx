import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Piston Powered Ranch — PaddockGavin",
  description:
    "The 12 most curated acres in automotive. Three hundred cars at Rancho Jaramillo in Unionville, Tennessee, an hour south of Nashville, on Saturday October 10 2026. Spectating is free, benefiting Community Elementary School.",
  openGraph: {
    title: "The Piston Powered Ranch — PaddockGavin",
    description:
      "The 12 most curated acres in automotive. October 10 2026, an hour south of Nashville. Spectating is free.",
    url: "https://paddockgavin.com/events/pistonpoweredranch",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "The Piston Powered Ranch" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
