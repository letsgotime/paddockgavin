import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Find Me a Car",
  description: "Tell Gavin Brooks what you are looking for. Vehicle sourcing and consignment through duPont REGISTRY Lebanon, Tennessee — the largest exotic car marketplace in the country.",
  openGraph: { title: "Find Me a Car", description: "Vehicle sourcing through duPont REGISTRY Lebanon — the largest exotic car marketplace in the country.", url: "https://paddockgavin.com/intake", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Find Me a Car" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
