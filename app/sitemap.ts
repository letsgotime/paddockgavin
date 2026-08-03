import type { MetadataRoute } from "next"

const BASE = "https://paddockgavin.com"

const STATIC: { url: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  // Core
  { url: "/",                        priority: 1.0,  changeFrequency: "weekly"  },
  { url: "/why-a-paddock",           priority: 0.8,  changeFrequency: "yearly"  },
  { url: "/connect",                 priority: 0.7,  changeFrequency: "monthly" },
  { url: "/book",                    priority: 0.7,  changeFrequency: "monthly" },
  { url: "/intake",                  priority: 0.75, changeFrequency: "monthly" },
  // Cars
  { url: "/cars",                    priority: 0.9,  changeFrequency: "monthly" },
  { url: "/cars/r8",                 priority: 0.85, changeFrequency: "monthly" },
  { url: "/cars/e92",                priority: 0.85, changeFrequency: "monthly" },
  // Day shift
  { url: "/lot-ops",                 priority: 0.85, changeFrequency: "monthly" },
  { url: "/gallery",                 priority: 0.75, changeFrequency: "weekly"  },
  { url: "/vlog",                    priority: 0.75, changeFrequency: "weekly"  },
  { url: "/scoreboard",              priority: 0.75, changeFrequency: "weekly"  },
  { url: "/events",                  priority: 0.75, changeFrequency: "monthly" },
  { url: "/events/creator-day",      priority: 0.7,  changeFrequency: "monthly" },
  { url: "/donuts",                  priority: 0.7,  changeFrequency: "monthly" },
  // Night shift / products
  { url: "/gloss-game",              priority: 0.95, changeFrequency: "monthly" },
  { url: "/juice-box",               priority: 0.8,  changeFrequency: "monthly" },
  { url: "/supercar-iq",             priority: 0.85, changeFrequency: "weekly"  },
  // Partnerships
  { url: "/partner",                 priority: 0.7,  changeFrequency: "monthly" },
  { url: "/affiliates",              priority: 0.65, changeFrequency: "monthly" },
  { url: "/press",                   priority: 0.7,  changeFrequency: "monthly" },
  // Legal
  { url: "/legal/terms",             priority: 0.2,  changeFrequency: "yearly"  },
  { url: "/legal/privacy",           priority: 0.2,  changeFrequency: "yearly"  },
  { url: "/legal/trademarks",        priority: 0.2,  changeFrequency: "yearly"  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return STATIC.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE}${url}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
