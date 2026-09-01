import type React from "react"
import type { Metadata, Viewport } from "next"
import { Archivo, Archivo_Black } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ScrollProgress } from "@/components/scroll-progress"
import { RebrandNotice } from "@/components/rebrand-notice"
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

export const metadata: Metadata = {
  title: {
    default: "PaddockGavin · Two shifts. One paddock.",
    template: "%s · PaddockGavin",
  },
  description:
    "Gavin runs lot operations and events for duPont REGISTRY by day, and builds software by night. Nashville, Tennessee.",
  metadataBase: new URL(SITE),
  alternates: { canonical: SITE },
  openGraph: {
    title: "PaddockGavin · Two shifts. One paddock.",
    description: "Cars used to be the reward. Now they're the work. Nashville, Tennessee.",
    siteName: "PaddockGavin",
    locale: "en_US",
    type: "website",
    url: SITE,
    images: [{ url: `${SITE}/opengraph-image`, width: 1200, height: 630, alt: "PaddockGavin · Two shifts. One paddock." }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@PaddockGavin",
    creator: "@PaddockGavin",
    images: [`${SITE}/opengraph-image`],
  },
  keywords: ["lot operations Nashville", "duPont REGISTRY", "exotic car content creator Tennessee", "duPont REGISTRY Lebanon Tennessee", "paddock gavin", "automotive software Nashville", "luxury car lot operations", "exotic car events Nashville"],
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${SITE}/#person`,
        name: "Gavin Brooks",
        url: SITE,
        image: `${SITE}/images/gavin-on-lot.jpg`,
        jobTitle: "Lot Operations and Events Manager",
        worksFor: { "@type": "Organization", name: "duPont REGISTRY", url: "https://www.dupontregistry.com" },
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
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: "PaddockGavin",
        description: "Lot ops and events by day. Software by night. Nashville, Tennessee.",
        author: { "@id": `${SITE}/#person` },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE}/?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
    ]),
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PaddockGavin",
  },
}

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
        <ScrollProgress />
        <RebrandNotice />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
