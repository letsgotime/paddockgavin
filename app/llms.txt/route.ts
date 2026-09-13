import { headers } from "next/headers"

/**
 * What a language model should know about this address, in plain text.
 * Two doors, two answers. Nothing here that the pages do not already say.
 */
export const dynamic = "force-dynamic"

const RANCH = `# The Piston Powered Ranch

> A curated car show at Rancho Jaramillo, a working cattle ranch in Unionville, Tennessee, about an hour south of Nashville. Saturday 10 October 2026, 9am to 3pm. Three hundred collector cars on fourteen acres. Free to attend. A PaddockGavin event. 25% of net profit fills a semi truck with food. Right now it goes to kids.

## Pages
- https://pistonpoweredranch.com : the landing page, the day, the ground, the gallery, the RSVP
- https://pistonpoweredranch.com/entry : enter a car (five photographs minimum, up to fifty, video up to five minutes a clip)
- https://pistonpoweredranch.com/vendor : take a stall on vendor row
- https://pistonpoweredranch.com/vendor/booth : reserve and pay for a booth, 10 by 10 upward
- https://pistonpoweredranch.com/sponsor : sponsor the day
- https://pistonpoweredranch.com/entries : the field, the cars accepted so far
- https://pistonpoweredranch.com/store : give, and the money buys food
- https://pistonpoweredranch.com/clubs : blocks held for car clubs arriving together

## Facts
- Date: Saturday 10 October 2026, gates at nine, field clear by three
- Venue: Rancho Jaramillo, Unionville, Bedford County, Tennessee, off Enon Church Road
- Admission: complimentary for spectators, no ticket
- Entry: cars are chosen one at a time from their photographs; entrants hear either way
- Producer: PaddockGavin, https://paddockgavin.com
- Charity: 25% of net profit fills a semi truck with food. Right now it goes to kids, and the focus can change from time to time
`

const PADDOCK = `# PaddockGavin

> Gavin Brooks, Nashville, Tennessee. Four pillars: automotive; PaddockGavin Events, car events built around cars and lifestyle; detailing, and The Gloss Game, his detailing book; and lifestyle and technology, from spreadsheets to agentic engineering and Supercar IQ. Brokers exotic and luxury cars, retail or wholesale, shopping with a dealer's licence so every auction is open. Producer of The Piston Powered Ranch.

## Pages
- https://paddockgavin.com : the homepage and the four pillars
- https://paddockgavin.com/cars : the Garage, the cars Gavin has owned
- https://paddockgavin.com/features : The Paddock Files, notable cars that came through the lot
- https://paddockgavin.com/events : PaddockGavin Events, upcoming and past
- https://paddockgavin.com/events/tires-and-timepieces : Tires & Timepieces, cars and watches in Scottsdale
- https://paddockgavin.com/track-days : track days near Nashville
- https://paddockgavin.com/gloss-game : The Gloss Game, the detailing book, and the free product index
- https://paddockgavin.com/why-a-paddock : the word behind the name, learning, code and watches
- https://paddockgavin.com/supercar-iq : Supercar IQ, identify a car from a photo
- https://paddockgavin.com/exotic-car-broker : buy, sell or consign an exotic or luxury car
- https://pistonpoweredranch.com : The Piston Powered Ranch, Saturday 10 October 2026
`

export async function GET() {
  const h = await headers()
  const host = (h.get("host") || "").toLowerCase()
  const ranch = h.get("x-pg-brand") === "pistonpoweredranch" || /(^|\.)pistonpoweredranch\.com$/.test(host.split(":")[0])
  return new Response(ranch ? RANCH : PADDOCK, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  })
}
