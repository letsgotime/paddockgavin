import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Donuts with duPont",
  description: "Donuts with duPont: the monthly exotic car morning hosted at duPont REGISTRY Lebanon, Tennessee. Coffee, cars, and the people who own them.",
  openGraph: { title: "Donuts with duPont", description: "Monthly exotic car morning at duPont REGISTRY Lebanon, Tennessee. Coffee, cars, and real collectors.", url: "https://paddockgavin.com/donuts", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Donuts with duPont" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
