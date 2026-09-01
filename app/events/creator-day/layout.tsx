import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Creator Day",
  description: "Creator Day at duPont REGISTRY Lebanon, Tennessee. Automotive content creators get exclusive lot access, walkarounds, and behind-the-scenes time with the inventory.",
  openGraph: { title: "Creator Day", description: "Automotive content creator day at duPont REGISTRY Lebanon, exclusive lot access and walkarounds.", url: "https://paddockgavin.com/events/creator-day", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Creator Day" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
