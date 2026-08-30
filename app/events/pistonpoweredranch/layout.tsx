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
      {ranchDoor ? (
        <style>{`
          /* Display type carries the brand; body copy stays Archivo in both,
             because a serif running text this long reads worse and "more
             branded" is not the same as better.

             Cinzel is a Trajan style capital face. It needs the opposite
             treatment to Archivo: positive tracking rather than the tight
             negative our display sizes use, or the caps close up and read as
             a wordmark rather than a headline. */
          [data-brand="rancho"] h1,
          [data-brand="rancho"] h2,
          [data-brand="rancho"] h3 {
            font-family: var(--display) !important;
            letter-spacing: .012em !important;
            font-weight: 700 !important;
          }
          /* The modern ranch bit: hairline rules in Jaramillo Red under the
             section marks, the way a brand from a working property signs
             things rather than shouting. */
          [data-brand="rancho"] h2::after {
            content: "";
            display: block;
            width: 54px;
            height: 2px;
            margin-top: 14px;
            background: var(--accent);
          }
        `}</style>
      ) : null}
      <div data-brand={ranchDoor ? "rancho" : "paddockgavin"} style={tokens as React.CSSProperties}>
        {ranchDoor ? <RanchLockup /> : null}
        {children}
      </div>
    </>
  )
}

/**
 * Whose day it is.
 *
 * On pistonpoweredranch.com the ranch's mark leads and PaddockGavin signs the
 * bottom of it, which is the right way round: it is Oscar's ground, we are the
 * people who run the day on it. On our own hub this does not render at all and
 * the page carries our nav as it always has.
 */
function RanchLockup() {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        padding: "26px 20px 4px",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/rj-mark-320.png"
        alt="Rancho Jaramillo"
        width={168}
        height={107}
        style={{ height: "auto", width: "clamp(126px,15vw,168px)" }}
      />
      <span
        style={{
          fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
          fontSize: 9.5,
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: "rgba(237,241,246,.5)",
        }}
      >
        The day run by PaddockGavin
      </span>
    </div>
  )
}
