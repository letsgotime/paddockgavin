import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Why a Paddock? — PaddockGavin",
  description:
    "The story behind the name. Why a paddock, who Gavin is, and how two very different careers became one identity. Nashville, Tennessee.",
  openGraph: {
    title: "Why a Paddock? — PaddockGavin",
    description: "The story behind the name. Two careers, one identity.",
    url: "https://paddockgavin.com/why-a-paddock",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Why a Paddock? — PaddockGavin" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

export default function WhyAPaddockLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
