import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Scoreboard — PaddockGavin",
  description:
    "Live stats from the lot — units moved, days on lot, throughput. Gavin's personal scoreboard. Nashville, Tennessee.",
  openGraph: {
    title: "Scoreboard — PaddockGavin",
    description: "Live lot stats. Units moved, days on lot, throughput.",
    url: "https://paddockgavin.com/scoreboard",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Scoreboard — PaddockGavin" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

export default function ScoreboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
