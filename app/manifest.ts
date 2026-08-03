import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PaddockGavin",
    short_name: "PaddockGavin",
    description: "Lot operations and events by day. Software by night. Nashville, Tennessee.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0E1A",
    theme_color: "#0A0E1A",
    orientation: "portrait-primary",
    categories: ["automotive", "lifestyle", "sports"],
    icons: [
      { src: "/images/mark-on-dark-96.png", sizes: "96x96",   type: "image/png", purpose: "any" },
      { src: "/icon-192.png",               sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "/icon-512.png",               sizes: "512x512", type: "image/png", purpose: "any maskable" },
      { src: "/apple-icon.png",             sizes: "180x180", type: "image/png", purpose: "any" },
    ],
    shortcuts: [
      { name: "The Paddock",   short_name: "Paddock",  url: "/lot-ops",     description: "Lot ops, events, and car content" },
      { name: "Find Me a Car", short_name: "Find Car", url: "/intake",      description: "Submit a car search intake" },
      { name: "The Gloss Game",short_name: "Gloss",    url: "/gloss-game",  description: "Book about car detailing" },
      { name: "Supercar IQ",   short_name: "SIQ",      url: "/supercar-iq", description: "Car knowledge and verification" },
    ],
  }
}
