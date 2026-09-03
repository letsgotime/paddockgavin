import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "The Vlog",
  description: "Original automotive video from Lebanon, Tennessee. Lot walkarounds, exotic car deliveries, collector mornings, and behind-the-scenes lot operations.",
  openGraph: { title: "The Vlog", description: "Original exotic car video from Lebanon, Tennessee. Walkarounds, deliveries, and lot ops.", url: "https://paddockgavin.com/vlog", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PaddockGavin Vlog" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
