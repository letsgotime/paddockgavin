import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Tell me about the car",
  description: "Selling a car? Start with the VIN and the decoder pulls the rest. Four steps: the car, how it has been kept, where it should sell, and how to reach you. Nashville, Tennessee.",
  openGraph: { title: "Tell me about the car", description: "Selling a car? Four steps: the car, how it has been kept, where it should sell, and how to reach you.", url: "https://paddockgavin.com/intake", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Tell me about the car" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
