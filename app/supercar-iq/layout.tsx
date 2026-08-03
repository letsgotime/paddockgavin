import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SupercarIQ — PaddockGavin",
  description:
    "Test your exotic car knowledge. SupercarIQ is a daily quiz built by Gavin — powered by real lot experience at duPont REGISTRY.",
  openGraph: {
    title: "SupercarIQ — PaddockGavin",
    description: "Test your exotic car knowledge. Built from real lot experience.",
    url: "https://paddockgavin.com/supercar-iq",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "SupercarIQ — PaddockGavin" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

export default function SupercarIQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
