import type React from "react"
import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Book It",
  description: "Book Gavin Brooks for automotive events, content creation, lot operations consulting, or speaking engagements in Nashville, Tennessee and beyond.",
  openGraph: { title: "Book It", description: "Book Gavin Brooks for automotive events, content creation, and lot operations consulting.", url: "https://paddockgavin.com/book", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Book PaddockGavin" }] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }
