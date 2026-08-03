import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gallery — PaddockGavin",
  description:
    "Photos from the lot, the garage, and the events. Shot on an iPhone by Gavin Brooks. Nashville, Tennessee.",
  openGraph: {
    title: "Gallery — PaddockGavin",
    description: "Photos from the lot, the garage, and the events. Shot on an iPhone.",
    url: "https://paddockgavin.com/gallery",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Gallery — PaddockGavin" }],
  },
  twitter: { card: "summary_large_image", images: ["/og/home.png"] },
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
