import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Lot Ops in Action",
  description: "Lot operations at duPont REGISTRY Lebanon, Tennessee. Every exotic car that arrives goes through inspection, photography, staging, and verification before a buyer sees it.",
  openGraph: { title: "Lot Ops in Action", description: "Lot operations at duPont REGISTRY Lebanon. Inspection, photography, staging, and verification for exotic and luxury cars.", url: "https://paddockgavin.com/lot-ops", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Lot Operations duPont REGISTRY" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
