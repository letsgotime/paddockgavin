import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Creator Day — PaddockGavin",
  description:
    "An exclusive content day at duPont REGISTRY for automotive creators — access to the full exotic inventory, no restrictions. Lebanon, TN.",
  openGraph: {
    title: "Creator Day — PaddockGavin",
    description: "Exclusive content access to the full duPont REGISTRY exotic inventory. Lebanon, TN.",
    url: "https://paddockgavin.com/events/creator-day",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Creator Day — PaddockGavin" }],
  },
  twitter: { card: "summary_large_image", images: ["/og/home.png"] },
}

export default function CreatorDayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
