import { NextResponse } from "next/server"

/**
 * Public client config.
 *
 * The Google Maps browser key is public by design and must be locked to this
 * site's referrers in the Google Cloud console. Absence simply means the map
 * runs on its keyless Leaflet engine, which is what it does today.
 */
export const runtime = "nodejs"

export function GET() {
  return NextResponse.json(
    { gmapsKey: process.env.GMAPS_BROWSER_KEY || null },
    { headers: { "Cache-Control": "public, max-age=300, must-revalidate" } },
  )
}
