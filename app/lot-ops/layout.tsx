import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lot Ops — PaddockGavin",
  description:
    "How Gavin manages one of the most valuable exotic car lots in the country at duPont REGISTRY Lebanon, TN. $125M+ in inventory per month.",
  openGraph: {
    title: "Lot Ops — PaddockGavin",
    description: "$125M+ in exotic inventory. Here's how the lot actually runs.",
    url: "https://paddockgavin.com/lot-ops",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Lot Ops — PaddockGavin" }],
  },
  twitter: { card: "summary_large_image", images: ["/og/home.png"] },
}

export default function LotOpsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
