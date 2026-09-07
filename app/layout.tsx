import type React from "react"
import type { Metadata, Viewport } from "next"
import { Archivo, Archivo_Black } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { RanchAnalytics } from "@/components/ranch-analytics"
import { ScrollProgress } from "@/components/scroll-progress"
import { RebrandNotice } from "@/components/rebrand-notice"
import { SiteBackdrop } from "@/components/page-backdrop"
import "./globals.css"

const _archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-sans",
  display: "swap",
})
const _archivoblack = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
})

const SITE = "https://paddockgavin.com"

/**
 * The icon follows the door.
 *
 * pistonpoweredranch.com is Rancho Jaramillo's address and its tab carries the
 * bull, not the PaddockGavin mark. The middleware marks a request that arrived
 * on that host, the brand tokens already follow it, and now the icon set and
 * the web manifest do too. Both sets are static files in public/, so nothing
 * is drawn per request and the PaddockGavin door is byte for byte what it was.
 */
const PG_ICONS: Metadata["icons"] = {
  icon: [
    { url: "/icon-dark-32x32.png", sizes: "32x32", type: "image/png" },
    { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    { url: "/icon.svg", type: "image/svg+xml" },
  ],
  apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  shortcut: "/favicon.ico",
}
export const RANCH_ICONS: Metadata["icons"] = {
  icon: [
    { url: "/brand/rj-icon-32.png", sizes: "32x32", type: "image/png" },
    { url: "/brand/rj-icon-64.png", sizes: "64x64", type: "image/png" },
    { url: "/brand/rj-icon-192.png", sizes: "192x192", type: "image/png" },
    { url: "/brand/rj-icon-512.png", sizes: "512x512", type: "image/png" },
  ],
  apple: [{ url: "/brand/rj-icon-180.png", sizes: "180x180", type: "image/png" }],
  shortcut: "/brand/rj-icon-32.png",
}


/* What a ranch address says about itself when a page sets no title of its
   own, the not-found page above all. Before this, pistonpoweredranch.com/rsvp
   answered with the PaddockGavin title in the tab. */
/* Who PaddockGavin is, for the machines. Rendered as a real ld+json script on
   the paddock door only. It used to sit in metadata.other, which Next writes
   out as <meta name="application/ld+json">: a tag no parser reads, and one
   that carried the paddock's Person and LocalBusiness onto every ranch page. */
export const PG_SCHEMA = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE}/#person`,
    name: "Gavin Brooks",
    url: SITE,
    image: `${SITE}/images/gavin-on-lot.jpg`,
    jobTitle: "Automotive creator and software builder",
    address: { "@type": "PostalAddress", addressLocality: "Nashville", addressRegion: "TN", addressCountry: "US" },
    sameAs: [
      "https://www.instagram.com/itspaddockgavin/",
      "https://www.linkedin.com/in/gavinbrooks-leader/",
      "https://github.com/letsgotime",
      "https://www.youtube.com/@paddockgavin",
      "https://www.tiktok.com/@paddockgavin",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE}/#business`,
    name: "PaddockGavin",
    description: "Automotive, tech and lifestyle from Nashville. Original photography and video, collector events, and the software behind them. Vehicle sourcing on request.",
    url: SITE,
    image: `${SITE}/opengraph-image`,
    founder: { "@id": `${SITE}/#person` },
    address: { "@type": "PostalAddress", addressLocality: "Nashville", addressRegion: "TN", addressCountry: "US" },
    areaServed: { "@type": "City", name: "Nashville", containedInPlace: { "@type": "State", name: "Tennessee" } },
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Exotic car brokering and sourcing", url: `${SITE}/exotic-car-broker` } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Selling an exotic car, retail or wholesale", url: `${SITE}/sell-my-exotic-car` } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Exotic car consignment", url: `${SITE}/exotic-car-consignment` } },
    ],
    sameAs: ["https://www.instagram.com/itspaddockgavin/", "https://www.youtube.com/@paddockgavin", "https://www.tiktok.com/@paddockgavin"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: "PaddockGavin",
    description: "Automotive, tech and lifestyle, Nashville, Tennessee.",
    author: { "@id": `${SITE}/#person` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE}/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  },
]

export const RANCH_DEFAULTS: Metadata = {
  /* The paddock's canonical must not leak onto a ranch page that sets none. */
  alternates: { canonical: null },
  title: {
    default: "The Piston Powered Ranch",
    template: "%s · The Piston Powered Ranch",
  },
  description:
    "The Piston Powered Ranch at Rancho Jaramillo, Unionville, Tennessee. Saturday 10 October 2026. Free to attend.",
  openGraph: {
    title: "The Piston Powered Ranch",
    description: "Rancho Jaramillo, Unionville, Tennessee. Saturday 10 October 2026. Free to attend.",
    siteName: "The Piston Powered Ranch",
    locale: "en_US",
    type: "website",
    url: "https://pistonpoweredranch.com",
    images: [{ url: "https://pistonpoweredranch.com/og/ppr-rancho-og-v2.jpg", width: 1200, height: 630, alt: "The Piston Powered Ranch" }],
  },
  /* A ranch page that names no card of its own must not fall back to the
     paddock's handle and image, and its relative URLs resolve to its own host. */
  metadataBase: new URL("https://pistonpoweredranch.com"),
  twitter: {
    card: "summary_large_image",
    title: "The Piston Powered Ranch",
    description: "Rancho Jaramillo, Unionville, Tennessee. Saturday 10 October 2026. Free to attend.",
    images: ["https://pistonpoweredranch.com/og/ppr-rancho-og-v2.jpg"],
  },
  /* The paddock's keyword list is the paddock's. Google reads none of it;
     nothing here is better than the wrong list. */
  keywords: null,
}

const BASE: Metadata = {
  title: {
    default: "Exotic car broker and sourcing, Nashville · PaddockGavin",
    template: "%s · PaddockGavin",
  },
  description:
    "Most people only see these cars on a screen. The days get you closer: three hundred of them on a working ranch, close enough to touch. Nashville.",
  metadataBase: new URL(SITE),
  alternates: { canonical: SITE },
  openGraph: {
    title: "Exotic car broker and sourcing, Nashville · PaddockGavin",
    description: "Most people only see these cars on a screen. The days get you closer. Nashville, Tennessee.",
    siteName: "PaddockGavin",
    locale: "en_US",
    type: "website",
    url: SITE,
    images: [{ url: `${SITE}/opengraph-image`, width: 1200, height: 630, alt: "PaddockGavin · Automotive, tech and lifestyle" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@PaddockGavin",
    creator: "@PaddockGavin",
    images: [`${SITE}/opengraph-image`],
  },
  keywords: ["exotic car broker Nashville", "sell my exotic car", "exotic car sourcing Tennessee", "exotic car content creator Tennessee", "paddock gavin", "automotive software Nashville", "automotive events Nashville", "exotic car events Nashville"],
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PaddockGavin",
  },
}

/**
 * The shell's metadata, and why it no longer reads the request.
 *
 * This used to pick brand from the x-pg-brand header. headers() is a dynamic
 * API, and calling it here made every route in the application dynamic,
 * including the landing, the store and the field, which are the three pages
 * that most want to be cached. The first time Next tried to regenerate one of
 * them the render threw DYNAMIC_SERVER_USAGE and the pages answered 500.
 *
 * Brand is in the path for everything that matters: the middleware rewrites
 * the ranch host into /events/<slug>, so those routes read it from their own
 * params in app/events/[event]/(public)/layout.tsx and stay cacheable. The
 * few shared paths that are served under both doors without a rewrite, the
 * legal pages, carry their own generateMetadata and pay for it themselves.
 */
export const metadata: Metadata = {
  ...BASE,
  icons: PG_ICONS,
  manifest: "/manifest.webmanifest",
}

/* The theme colour is the browser chrome around the page on a phone, and it
   follows the door: the ranch's ink on pistonpoweredranch.com, ours here. */
export const viewport: Viewport = {
  themeColor: "#0A0E1A",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-[#0A1523]">
      <body className={`${_archivo.variable} ${_archivoblack.variable} font-sans antialiased bg-[#0A1523] text-[#B4B6B2]`}>
        {/* Four-bar speed stripe — fixed top, no layout impact so zero CLS contribution */}
        <div
          aria-hidden="true"
          style={{
            display: "flex",
            width: "100%",
            height: 5,
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            contain: "strict",
          }}
        >
          <div style={{ flex: 1, background: "#F8B800" }} />
          <div style={{ flex: 1, background: "#00D2BE" }} />
          <div style={{ flex: 1, background: "#005185" }} />
          <div style={{ flex: 1, background: "#848482" }} />
        </div>
        <SiteBackdrop />
        <ScrollProgress />
        <RebrandNotice />
        {children}
        <Analytics />
        <RanchAnalytics />
      </body>
    </html>
  )
}
