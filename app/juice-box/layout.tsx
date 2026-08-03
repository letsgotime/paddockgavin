import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Juice Box — PaddockGavin",
  description: "EV charging and electric vehicle tools by PaddockGavin. Resources for exotic EV owners, charging infrastructure, and the electric side of the duPont REGISTRY lot.",
  openGraph: { title: "Juice Box — PaddockGavin", description: "EV charging tools and resources for exotic car owners. Electric vehicles on the duPont REGISTRY lot.", url: "https://paddockgavin.com/juice-box", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Juice Box EV" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
