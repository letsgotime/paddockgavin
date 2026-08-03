import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PaddockGavin",
    short_name: "PaddockGavin",
    description: "Cars, builds, books, and software from Nashville. duPont REGISTRY lot ops by day. Paddock20 by night.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0E1A",
    theme_color: "#0A0E1A",
    orientation: "portrait-primary",
    categories: ["automotive", "lifestyle", "shopping"],
    icons: [
      { src: "/brand/app-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "/brand/app-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
      { src: "/brand/favicon-32.png",   sizes: "32x32",   type: "image/png" },
    ],
    screenshots: [
      { src: "/brand/wordmark-dark-bg.png", sizes: "1280x720", type: "image/png", label: "PaddockGavin home" },
    ],
    shortcuts: [
      { name: "The Gloss Game",  short_name: "Gloss",  url: "/gloss-game",  description: "Book about car detailing" },
      { name: "Cars",            short_name: "Cars",   url: "/cars",         description: "Every car I have owned" },
      { name: "Supercar IQ",     short_name: "SIQ",    url: "/supercar-iq", description: "Car verification app" },
    ],
  }
}
