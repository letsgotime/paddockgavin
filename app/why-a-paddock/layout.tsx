import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Why a Paddock",
  description: "The word behind PaddockGavin, and Gavin Brooks on always learning: spreadsheets to full-stack to agentic engineering, Supercar IQ, the lot, and where cars met watches at Tires & Timepieces. Nashville, Tennessee.",
  openGraph: { title: "Why a Paddock", description: "The word behind PaddockGavin, always learning, code, the lot, and where cars met watches.", url: "https://paddockgavin.com/why-a-paddock", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Why a Paddock" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
