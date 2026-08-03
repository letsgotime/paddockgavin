import type React from "react"
import type { Metadata, Viewport } from "next"
import { Archivo, Archivo_Black } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ScrollProgress } from "@/components/scroll-progress"
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

export const metadata: Metadata = {
  title: "PaddockGavin — two shifts, one paddock",
  description:
    "Gavin runs lot operations and events for duPont REGISTRY by day, and builds software by night. Nashville, Tennessee.",
  metadataBase: new URL("https://paddockgavin.com"),
  openGraph: {
    title: "PaddockGavin — two shifts, one paddock",
    description: "Cars used to be the reward. Now they're the work. Nashville, Tennessee.",
    siteName: "PaddockGavin",
    locale: "en_US",
    type: "website",
    url: "https://paddockgavin.com",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "PaddockGavin" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@PaddockGavin",
    creator: "@PaddockGavin",
    images: ["/og/home.png"],
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
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
        {/* Four-bar speed stripe — pinned to top of every page */}
        <div aria-hidden="true" style={{ display: "flex", width: "100%", height: 5, position: "fixed", top: 0, left: 0, zIndex: 9999 }}>
          <div style={{ flex: 1, background: "#F2C94C" }} />
          <div style={{ flex: 1, background: "#57C7F5" }} />
          <div style={{ flex: 1, background: "#1E3A5F" }} />
          <div style={{ flex: 1, background: "#0A1523" }} />
        </div>
        <ScrollProgress />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
