import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "The Garage",
  description: "Gavin Brooks’ own cars. The E92 M3 build, the R8, and the twenty nine he has owned so far.",
  openGraph: { title: "The Garage", description: "Personal builds and walkarounds, car by car.", url: "https://paddockgavin.com/cars", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PaddockGavin Garage" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
