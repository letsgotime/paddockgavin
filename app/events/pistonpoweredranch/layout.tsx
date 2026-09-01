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
/* The same event, shared from the ranch's own door, unfurls in the ranch's
   own brand: the bull mark, Cinzel, Jaramillo Red on Ranch Ink. Canonical
   and og:url still point at the hub, because that is the URL that outlives
   the domain and holds the archive. Only the picture changes. */
const RANCHO_CARD = "https://pistonpoweredranch.com/og/ppr-rancho-og.jpg"

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers()
  const ranchDoor = h.get("x-pg-brand") === "pistonpoweredranch"
  const card = ranchDoor ? RANCHO_CARD : CARD
  return {
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
        url: card,
        width: 1200,
        height: 628,
        alt: "The Piston Powered Ranch at Rancho Jaramillo, Unionville Tennessee",
      },
    ],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [card] },
  }
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
/**
 * Two reds and two blues, because a brand colour and a text colour are not the
 * same job.
 *
 * Measured against the page ground, Jaramillo Red is 3.89:1 and Jaramillo Blue
 * is 1.57:1. Below 3:1 is not "hard to read", it is invisible, and that is
 * exactly what shipped: every eyebrow and label on the ranch door was set in a
 * colour nobody could make out. Our own amber is 12.29:1, so the page was
 * designed against an accent that could carry text and I swapped in one that
 * could not.
 *
 * So: -strong is the brand, used for fills, rules and display sizes where mass
 * carries it. The plain token is the ink tint from the same ramp in the brand
 * kit, and it passes AA for text at any size.
 */
const RANCHO = {
  "--accent": "#FF1A21",        // Jaramillo Red lit for small text, 4.74:1 on the ink. Text only, never a fill
  "--accent-strong": "#E5141A", // Jaramillo Red, for fills and large display
  "--on-accent": "#FFFFFF",     // text on a Jaramillo Red fill, 4.73:1. Never dark type on red
  "--second": "#6E8FE8",        // 6.28:1
  "--second-strong": "#1424A1", // Jaramillo Blue
  "--ink": "#0A1523",
  "--paper": "#FAF8F4",
  "--display": 'Cinzel, "Trajan Pro", "Times New Roman", serif',
} as const

const PADDOCKGAVIN = {
  "--accent": "#F2C94C",        // 12.29:1, carries text and fills alike
  "--accent-strong": "#F2C94C",
  "--on-accent": "#101010",     // dark type on amber, 12.29:1
  "--second": "#00D2BE",        // 10.18:1
  "--second-strong": "#00D2BE",
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
      <style>{`
        /* The ranch marks are in the markup on both doors so the two are
           byte identical, and this is what removes them from ours. It ships
           unconditionally on purpose: putting it inside the rancho only block
           is what let them appear on paddockgavin.com. */
        [data-brand="paddockgavin"] .rjMark { display: none !important; }
      `}</style>
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
            background: var(--accent-strong);
          }
        `}</style>
      ) : null}
      <div data-brand={ranchDoor ? "rancho" : "paddockgavin"}
        style={{ ...(tokens as React.CSSProperties), position: "relative" }}>
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
        position: "absolute",
        top: "clamp(126px,15vh,152px)",
        left: 0,
        right: 0,
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 9,
        pointerEvents: "none",
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
