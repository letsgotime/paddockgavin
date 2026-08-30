import type React from "react"
import { headers } from "next/headers"

/**
 * Brand tokens, chosen server side.
 *
 * The middleware marks a request that arrived on pistonpoweredranch.com. Here
 * that becomes a set of CSS custom properties on a wrapper, so the page is
 * already in Rancho Jaramillo's colours in the first byte of HTML. Doing it in
 * the browser would mean a flash of our amber before it repainted to their
 * red, which is exactly the seam Gavin asked not to have.
 *
 * The design system does not change. Only these values do.
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
