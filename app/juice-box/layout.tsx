import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Juice Box — PaddockGavin",
  description:
    "The EV corner — Gavin's honest take on electric vehicles from the perspective of someone who lives in the ICE world. Nashville, Tennessee.",
  openGraph: {
    title: "Juice Box — PaddockGavin",
    description: "An honest take on EVs from someone who lives in the ICE world.",
    url: "https://paddockgavin.com/juice-box",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Juice Box — PaddockGavin" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

export default function JuiceBoxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
