import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Car Shows near Nashville, Tennessee",
  description: "Every PaddockGavin car event in Middle Tennessee: what is booked, what already ran, and the properties we represent. Car shows near Nashville, Tennessee.",
  openGraph: { title: "Car Shows near Nashville, Tennessee", description: "Every PaddockGavin car event in Middle Tennessee: what is booked, what already ran, and the properties we represent. Car shows near Nashville, Tennessee.", url: "https://paddockgavin.com/events", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PaddockGavin Events" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
