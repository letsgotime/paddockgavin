import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: { absolute: "PaddockGavin Events · Car shows near Nashville" },
  description: "PaddockGavin Events puts on car shows and days out in Middle Tennessee and Scottsdale. See what is booked, what already ran, and where we host.",
  openGraph: { title: "PaddockGavin Events", description: "Car shows and days out in Middle Tennessee and Scottsdale. See what is booked, what already ran, and where we host.", url: "https://paddockgavin.com/events", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PaddockGavin Events" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
