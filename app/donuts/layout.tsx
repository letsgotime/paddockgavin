import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Donuts with duPont — PaddockGavin",
  description:
    "Donuts with duPont — the Saturday morning cars and coffee event at duPont REGISTRY in Lebanon, TN. Hosted by Gavin.",
  openGraph: {
    title: "Donuts with duPont — PaddockGavin",
    description: "Saturday morning cars and coffee at duPont REGISTRY, Lebanon, TN.",
    url: "https://paddockgavin.com/donuts",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Donuts with duPont" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

export default function DonutsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
