import type React from "react"
import { headers } from "next/headers"
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

/**
 * The brand layer, added to the metadata that was already here.
 *
 * The middleware marks a request that arrived on pistonpoweredranch.com. That
 * becomes CSS custom properties on a wrapper, so the page is in Rancho
 * Jaramillo's colours in the first byte of HTML rather than repainting once
 * JavaScript works out where it is. The design system is untouched: only these
 * five values move.
 */
const RANCHO = {
  "--accent": "#E5141A",
  "--second": "#1424A1",
  "--ink": "#0A1523",
  "--paper": "#FAF8F4",
  "--display": 'Cinzel, "Trajan Pro", "Times New Roman", serif',
} as const

const PADDOCKGAVIN = {
  "--accent": "#F2C94C",
  "--second": "#00D2BE",
  "--ink": "#070D14",
  "--paper": "#EDF1F6",
  "--display": "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif",
} as const

export default async function Layout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const ranchDoor = h.get("x-pg-brand") === "pistonpoweredranch"
  const tokens = ranchDoor ? RANCHO : PADDOCKGAVIN

  return (
    <>
      {ranchDoor ? (
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&display=swap"
        />
      ) : null}
      <div data-brand={ranchDoor ? "rancho" : "paddockgavin"} style={tokens as React.CSSProperties}>
        {children}
      </div>
    </>
  )
}
