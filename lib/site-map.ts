import { PILLARS, STATS } from "@/lib/site-data"

export type SiteLink = { key: string; href: string; label: string; note: string; external?: boolean }
export type SiteGroup = { key: string; title: string; tone: string; links: SiteLink[] }

/* The whole site, grouped by pillar. The menu, the footer and /connect all render from this. */
export const SITE_GROUPS: SiteGroup[] = [
  {
    key: PILLARS.automotive.key,
    title: PILLARS.automotive.label,
    tone: PILLARS.automotive.tone,
    links: [
      { key: "cars", href: "/cars", label: "The Garage", note: `The ${STATS.carsOwned} cars that were mine` },
      { key: "features", href: "/features", label: "The Paddock Files", note: "Cars that came through" },
      { key: "gallery", href: "/gallery", label: "Gallery", note: "Photos and video" },
    ],
  },
  {
    key: PILLARS.events.key,
    title: PILLARS.events.label,
    tone: PILLARS.events.tone,
    links: [
      { key: "events", href: "/events", label: "Every event", note: "Coming up, and already run" },
      { key: "ranch", href: "/events/pistonpoweredranch", label: "The Piston Powered Ranch", note: "Saturday 10 October" },
      { key: "tt", href: "/events/tires-and-timepieces", label: "Tires & Timepieces", note: "Scottsdale, two editions" },
      { key: "track", href: "/track-days", label: "Track days", note: "Drive it yourself" },
      { key: "book", href: "/book", label: "Book an event", note: "Private events" },
    ],
  },
  {
    key: PILLARS.detailing.key,
    title: PILLARS.detailing.label,
    tone: PILLARS.detailing.tone,
    links: [
      { key: "gloss", href: "/gloss-game", label: "The Gloss Game", note: "The detailing book" },
      { key: "picks", href: "/gloss-game#picks", label: "The Juice Box", note: "The product index, free" },
      { key: "e92", href: "/cars/e92", label: "E92 M3", note: "Twenty-five hours of correction" },
      { key: "r8", href: "/cars/r8", label: "Audi R8 V10", note: "The first supercar" },
      { key: "affiliates", href: "/affiliates", label: "Brands I use", note: "And who took the photos" },
    ],
  },
  {
    key: PILLARS.tech.key,
    title: PILLARS.tech.label,
    tone: PILLARS.tech.tone,
    links: [
      { key: "why", href: "/why-a-paddock", label: "Why a Paddock", note: "Learning, code and watches" },
      { key: "scoreboard", href: "/scoreboard", label: "The Scoreboard", note: "What I build" },
      { key: "siq", href: "/supercar-iq", label: "Supercar IQ", note: "The app" },
      { key: "lotops", href: "/lot-ops", label: "Lot Ops", note: "2025 to 2026" },
    ],
  },
  {
    key: "work",
    title: "Work with me",
    tone: "#B4B6B2",
    links: [
      { key: "broker", href: "/exotic-car-broker", label: "Buy, sell or consign", note: "Exotic and luxury, retail or wholesale" },
      { key: "intake", href: "/intake", label: "Sell a car", note: "Four steps" },
      { key: "partner", href: "/partner", label: "Brands", note: "Reach the audience" },
    ],
  },
  {
    key: "elsewhere",
    title: "Elsewhere",
    tone: "#8B93A7",
    links: [
      { key: "connect", href: "/connect", label: "Every link", note: "One page" },
      { key: "press", href: "/press", label: "Press", note: "Credentials" },
      { key: "shop", href: "/shop", label: "Shop", note: "Made to order" },
      { key: "p20", href: "https://paddock20.com", label: "Paddock20", note: "Software studio", external: true },
    ],
  },
]
