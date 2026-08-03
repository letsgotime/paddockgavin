import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Events — PaddockGavin",
  description: "Private automotive events and experiences at duPont REGISTRY Lebanon, Tennessee. Track days, collector car mornings, and custom event production by Gavin Brooks.",
  openGraph: { title: "Events — PaddockGavin", description: "Private automotive events at duPont REGISTRY Lebanon. Track days, collector mornings, and custom event production.", url: "https://paddockgavin.com/events", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PaddockGavin Events" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
