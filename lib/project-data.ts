/**
 * CLOUDFLARE IMAGES: When you have a CF image ID ready, replace the Unsplash
 * URL with just the UUID from the CF Images dashboard, e.g.:
 *   heroImage: "abc123-uuid-from-cf-images-dashboard"
 *
 * CfImage detects whether the value is a URL or a bare ID automatically.
 *
 * CLOUDFLARE STREAM: Add streamVideoId to any project to show a Stream
 * video player above the overview panel on that project's detail page.
 * Example: streamVideoId: "abc123videouid"
 */

export const PROJECTS = [
  {
    id: "lot-ops",
    title: "duPont REGISTRY Lot Ops",
    year: "2024",
    services: ["Lot Operations", "Events"],
    caption: "The lot at sunrise — cars queued before the doors open",
    linkText: "dupontregistry.com",
    linkUrl: "https://www.dupontregistry.com",
    overview: {
      title: "The operation",
      content:
        "70,000 square feet. Every car that moves — consignment arrivals, dealer trades, auction pulls, photo staging — comes through lot ops first. The job is spatial, logistical, and unforgiving. A Senna that was clean at 7am needs to still be clean at 4pm when the photographer shows up.",
    },
    direction: {
      title: "The discipline",
      content:
        "Available light. Phone camera. No filters. Detail shots over hero shots — a caliper, a badge, the floor. The one clean cutout in the library is a GT3 RS with a real alpha channel. 81 images, all WebP, all captioned.",
    },
    outcome: {
      title: "The result",
      content:
        "$125M+ in monthly throughput running through a lot that one person is responsible for staging, moving, and keeping clean. That number is current. The retainer is active.",
    },
    heroImage: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&h=900&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=900&fit=crop",
    ],
    nextProject: "supercariq",
  },
  {
    id: "supercariq",
    title: "SupercarIQ",
    year: "2024",
    services: ["Software", "AI"],
    caption: "See a car, know everything",
    linkText: "Visit app",
    linkUrl: "#",
    overview: {
      title: "The problem",
      content:
        "See a car in traffic. At an event. In a video. The question is always the same — what is that exactly? Not just make/model. Spec, options, production numbers, what the collector market has been doing with it. The question came up every day on the lot and the answer was always slower than it should be.",
    },
    direction: {
      title: "The build",
      content:
        "Vision model identifies the car from a single photo. Spec and heritage pull from a structured database built on 20+ years of first-hand lot exposure. Market data layers on top. One input, complete picture, no guessing.",
    },
    outcome: {
      title: "The position",
      content:
        "78 cars brokered. Fee to buyers: $0. The value is the access — knowing what the market has been doing with a car before you decide what to do with it. SupercarIQ is the tool that makes that knowledge portable.",
    },
    heroImage: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&h=900&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=1200&h=900&fit=crop",
    ],
    nextProject: "gloss-game",
  },
  {
    id: "gloss-game",
    title: "The Gloss Game",
    year: "2023",
    services: ["Detailing", "Paint Correction"],
    caption: "Gunther Werks 993 — four-frame correction sequence",
    linkText: "Ask what went on them",
    linkUrl: "#",
    overview: {
      title: "The work",
      content:
        "Wash, decon, correct, protect. The cars in the lot get the same attention as the personal fleet. Some of them arrive off a transporter at three in the morning. The light shows everything.",
    },
    direction: {
      title: "The argument",
      content:
        "Paint correction is a long argument with the surface. A McLaren Senna in nine frames. A Gunther Werks 993 in four. A Talbot Yellow 930 Turbo and a signed Saleen S7. The tool list is longer than the car list and that&apos;s correct.",
    },
    outcome: {
      title: "The standard",
      content:
        "Available light, phone camera, no filters — because filters hide the work. The before and after are the pitch. If it looks right in available light at noon, it&apos;s right.",
    },
    heroImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=900&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&h=900&fit=crop",
    ],
    nextProject: "tires-timepieces",
  },
  {
    id: "tires-timepieces",
    title: "Tires & Timepieces",
    year: "2023",
    services: ["Events", "Experiential"],
    caption: "$64M+ in display assets — one room, two days",
    linkText: "View event",
    linkUrl: "#",
    overview: {
      title: "The concept",
      content:
        "Automotive and horological passion in the same room. Cars and watches share more than a collector base — they share the same language around provenance, finishing, and why something is worth what it is.",
    },
    direction: {
      title: "The scale",
      content:
        "$64M+ in display assets. $200K ROI in 48 hours. The logistics are lot ops at event scale: what moves when, where it parks, how the light hits it at 6pm versus 10am.",
    },
    outcome: {
      title: "The footprint",
      content:
        "200+ enterprise events across 22 cities. The experience that comes from doing something at that frequency is not something you get from reading about it. The room knows.",
    },
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=900&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=1200&h=900&fit=crop",
    ],
    nextProject: "lot-ops",
  },
]

export const SERVICES_OPTIONS = [
  "Lot Operations",
  "SupercarIQ / Market Intel",
  "Detailing",
  "Events",
  "Software Build",
  "Other",
]
export const BUDGET_OPTIONS = ["Under $5K", "$5–$15K", "$15–$30K", "$30–$50K", "$50K+"]

export function getProjectById(id: string) {
  return PROJECTS.find((p) => p.id === id)
}

export function getNextProject(currentId: string) {
  const current = getProjectById(currentId)
  if (!current) return PROJECTS[0]
  return getProjectById(current.nextProject) || PROJECTS[0]
}
