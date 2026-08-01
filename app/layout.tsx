import type React from "react"
import type { Metadata, Viewport } from "next"
import { Archivo, Archivo_Black } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _archivo = Archivo({ subsets: ["latin"], variable: "--font-sans" })
const _archivoblack = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "Gavin Paddock — Nashville",
  description:
    "Lot ops. Detailing. Supercar IQ. The person running the operation at duPont REGISTRY is also building the software.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0E1A2A",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#0E1A2A]">
      <body className="font-sans antialiased bg-[#0E1A2A] text-[#E6EAF0]">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
