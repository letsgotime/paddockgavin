import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Lot Ops",
  description: "Lot operations in Lebanon, Tennessee, 2025 to 2026. Every exotic car that arrived went through inspection, photography, staging and verification before a buyer saw it.",
  openGraph: { title: "Lot Ops", description: "Lot operations in Lebanon, Tennessee, 2025 to 2026. Inspection, photography, staging and verification for exotic and luxury cars.", url: "https://paddockgavin.com/lot-ops", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Lot Operations, Lebanon, Tennessee" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
