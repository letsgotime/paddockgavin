import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Find Me a Car",
  description: "Tell Gavin Brooks what you are looking for. Concierge vehicle sourcing, retail or wholesale, with a dealer's licence so every auction is open. Nashville, Tennessee.",
  openGraph: { title: "Find Me a Car", description: "Concierge vehicle sourcing, retail or wholesale, with a dealer's licence so every auction is open.", url: "https://paddockgavin.com/intake", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Find Me a Car" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
