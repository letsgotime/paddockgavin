import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "The Garage",
  description: "Gavin Brooks' personal garage. The E92 M3 build, the R8, and every car that has moved through Lebanon, Tennessee. Lot operations manager at duPont REGISTRY.",
  openGraph: { title: "The Garage", description: "Personal builds, walkarounds, and the cars that move through duPont REGISTRY Lebanon.", url: "https://paddockgavin.com/cars", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PaddockGavin Garage" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
