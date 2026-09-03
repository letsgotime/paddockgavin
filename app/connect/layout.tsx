import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Every Link",
  description: "All PaddockGavin links in one place. Instagram, YouTube, TikTok, Supercar IQ, The Gloss Game on Amazon, Paddock20, and more.",
  openGraph: { title: "Every Link", description: "All PaddockGavin links · Instagram, YouTube, TikTok, Supercar IQ, Amazon, Paddock20.", url: "https://paddockgavin.com/connect", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PaddockGavin Links" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
