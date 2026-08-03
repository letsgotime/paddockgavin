import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Fleet — PaddockGavin",
  description:
    "Gavin's personal fleet — the E92 M3 and the Audi R8. Both daily driven, both earned. Nashville, Tennessee.",
  openGraph: {
    title: "The Fleet — PaddockGavin",
    description: "The E92 M3 and the Audi R8. Both daily driven, both earned.",
    url: "https://paddockgavin.com/cars",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "The Fleet — PaddockGavin" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

export default function CarsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
