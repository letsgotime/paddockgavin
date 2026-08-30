import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "The Scoreboard",
  description: "The PaddockGavin tech stack scoreboard. Every tool, app, and platform Gavin Brooks uses to run lot operations, automotive content, and software development in Nashville, Tennessee.",
  openGraph: { title: "The Scoreboard", description: "Every tool Gavin Brooks uses for lot operations, automotive content, and software development.", url: "https://paddockgavin.com/scoreboard", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PaddockGavin Tech Scoreboard" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
