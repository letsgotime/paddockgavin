import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "The Gallery — PaddockGavin",
  description: "Exotic and luxury car photography from duPont REGISTRY Lebanon, Tennessee. Original lot photography by Gavin Brooks — Ferrari, McLaren, Lamborghini, Porsche, and more.",
  openGraph: { title: "The Gallery — PaddockGavin", description: "Original exotic car photography from duPont REGISTRY Lebanon. Ferrari, McLaren, Lamborghini, Porsche.", url: "https://paddockgavin.com/gallery", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PaddockGavin Gallery" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
