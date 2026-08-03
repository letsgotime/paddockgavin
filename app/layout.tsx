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
    startupImage: "/brand/app-icon-512.png",
  },
  icons: {
    icon:  [{ url: "/brand/favicon-32.png", sizes: "32x32" }, { url: "/brand/favicon-48.png", sizes: "48x48" }],
    apple: [{ url: "/brand/app-icon-192.png", sizes: "192x192" }],
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
        <ScrollProgress />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
