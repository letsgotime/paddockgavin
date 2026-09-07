import { NextResponse } from "next/server"

/**
 * The forecast for the day, fetched by us and cached by us.
 *
 * It used to be fetched from api.weather.gov in every visitor's browser. Two
 * things were wrong with that. The National Weather Service saw the address of
 * everyone who opened the page, which is nobody's business but ours, and a
 * service we do not run sat on the critical path of a page we do: their slow
 * minute was our slow minute, in every browser at once.
 *
 * Now it is one request from our server, shared by every visitor for half an
 * hour. NWS asks callers to identify themselves, so we do.
 */
export const runtime = "nodejs"
export const revalidate = 1800

const NWS = "https://api.weather.gov/gridpoints/OHX/59,34/forecast"
const SHOW_DAY = "2026-10-10"

type Period = {
  name: string
  startTime: string
  temperature: number
  temperatureUnit: string
  shortForecast: string
}

export async function GET() {
  try {
    const r = await fetch(NWS, {
      headers: {
        Accept: "application/geo+json",
        "User-Agent": "pistonpoweredranch.com (hello@pistonpoweredranch.com)",
      },
      next: { revalidate },
    })
    if (!r.ok) throw new Error(`NWS ${r.status}`)

    const j = (await r.json()) as { properties?: { periods?: Period[] } }
    const periods = j?.properties?.periods ?? []

    /* The show first, if it is close enough to be in the window at all.
       Otherwise today, so the card has something true to say meanwhile. */
    const pick =
      periods.find((p) => p.startTime?.slice(0, 10) === SHOW_DAY) ||
      periods.find((p) => p.name === "Today") ||
      periods[0]

    if (!pick) return NextResponse.json({ state: "down" }, { status: 200 })

    return NextResponse.json(
      {
        state: "ok",
        name: pick.name,
        startTime: pick.startTime,
        temperature: pick.temperature,
        temperatureUnit: pick.temperatureUnit,
        shortForecast: pick.shortForecast,
        forShowDay: pick.startTime?.slice(0, 10) === SHOW_DAY,
      },
      { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } },
    )
  } catch (err) {
    /* A forecast is a nicety. Never let it fail a page. */
    console.error("[weather]", err instanceof Error ? err.message : err)
    return NextResponse.json({ state: "down" }, { status: 200 })
  }
}
