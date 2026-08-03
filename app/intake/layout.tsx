import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Find Me a Car — PaddockGavin",
  description:
    "Tell Gavin what you're looking for. He'll find it — leveraging direct access to the duPont REGISTRY lot inventory. Nashville, Tennessee.",
  openGraph: {
    title: "Find Me a Car — PaddockGavin",
    description: "Tell Gavin what you're looking for. He'll find it.",
    url: "https://paddockgavin.com/intake",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Find Me a Car — PaddockGavin" }],
  },
  twitter: { card: "summary_large_image", images: ["/og/home.png"] },
}

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
