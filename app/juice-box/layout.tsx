import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Juice Box",
  description: "The car care shelf: the wash, polish and coating products that kept earning their slot, with prices and what each one is for. By PaddockGavin, Nashville.",
  openGraph: { title: "Juice Box", description: "The wash, polish and coating products that kept earning their slot, with prices and what each one is for.", url: "https://paddockgavin.com/juice-box", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "The car care shelf" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
