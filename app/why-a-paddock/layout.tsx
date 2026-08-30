import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Why a Paddock",
  description: "The story behind PaddockGavin. Lot operations, exotic cars, Nashville, and why Gavin Brooks keeps coming back to the same word: paddock.",
  openGraph: { title: "Why a Paddock", description: "The story behind PaddockGavin — lot operations, exotic cars, and Nashville, Tennessee.", url: "https://paddockgavin.com/why-a-paddock", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Why a Paddock" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
