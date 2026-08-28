import type React from "react"
import type { Metadata } from "next"

/* Flat numbers, no superlative. The earlier line led on "the 12 most curated
   acres in automotive", an unprovable claim from a year one event with no past
   winners to point at, and the old share card carried "in the spirit of
   Monterey Car Week" baked into its pixels where no grep could find it. Both
   are gone. Title stays under 60 characters and the description under 155 so
   neither is truncated in a result, and both use a middot, never an em dash. */
const TITLE = "The Piston Powered Ranch · Tennessee Car Show · Oct 10 2026"
const DESC =
  "Three hundred collector cars on twelve acres at Rancho Jaramillo, an hour south of Nashville. Saturday October 10, 2026. Admission is complimentary."
const CARD = "https://paddockgavin.com/og/ppr-og-1200.jpg"

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://paddockgavin.com/events/pistonpoweredranch" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://paddockgavin.com/events/pistonpoweredranch",
    siteName: "PaddockGavin",
    type: "website",
    images: [
      {
        url: CARD,
        width: 1200,
        height: 628,
        alt: "The Piston Powered Ranch at Rancho Jaramillo, Unionville Tennessee",
      },
    ],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [CARD] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
