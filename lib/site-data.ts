/* The figures the site repeats, in one place, so no page can drift from another. */
export const STATS = {
  carsFound: 78,
  carsOwned: 29,
  yearsOwning: "30+",
  monthlyViews: "~1,000,000",
  monthlyViewsShort: "~1M",
  eventsRun: "200+",
} as const

export const PILLARS = {
  automotive: { key: "automotive", label: "Automotive", tone: "#F2C94C", href: "/cars" },
  events: { key: "events", label: "PaddockGavin Events", tone: "#00D2BE", href: "/events" },
  detailing: { key: "detailing", label: "Detailing", tone: "#FF9F43", href: "/gloss-game" },
  tech: { key: "tech", label: "Lifestyle & Technology", tone: "#57C7F5", href: "/why-a-paddock" },
} as const

export const PRODUCTS = [
  { key: "siq", label: "Supercar IQ", href: "https://supercariq.com", external: true, meta: "Sept 2026", note: "Point a phone at a car and it tells you what it is", tone: "#00D2BE" },
  { key: "gloss", label: "The Gloss Game", href: "/gloss-game", external: false, meta: "The book", note: "Car detailing, in the right order", tone: "#F2C94C" },
  { key: "p20", label: "Paddock20", href: "https://paddock20.com", external: true, meta: "Software studio", note: "Software for small businesses", tone: "#8B93A7" },
] as const

export const INSTAGRAM = "https://instagram.com/itspaddockgavin"
export const DM = "https://ig.me/m/itspaddockgavin"
