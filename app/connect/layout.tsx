import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Connect — PaddockGavin",
  description:
    "Get in touch with Gavin. Partnerships, press, lot operations, events, or software projects. Nashville, Tennessee.",
  openGraph: {
    title: "Connect — PaddockGavin",
    description: "Partnerships, press, events, or software. Get in touch.",
    url: "https://paddockgavin.com/connect",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Connect — PaddockGavin" }],
  },
  twitter: { card: "summary_large_image", images: ["/og/home.png"] },
}

export default function ConnectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
