import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Supercar IQ",
  description: "Supercar IQ: exotic car identification, valuation, and specification app built by PaddockGavin. Identify any supercar by photo, get specs, market value, and history.",
  openGraph: { title: "Supercar IQ", description: "Exotic car identification and valuation app. Identify any supercar by photo, get specs and market value.", url: "https://paddockgavin.com/supercar-iq", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Supercar IQ" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
