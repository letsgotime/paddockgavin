import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Gloss Game™ · Gavin Brooks | PaddockGavin",
  description:
    "The Gloss Game by Gavin Brooks. Twelve chapters on car care, built on a driveway in Escondido in 1993 and fifty-five thousand dollars of finding out what wasn't needed. Paperback and Kindle on Amazon.",
  openGraph: {
    type: "book",
    title: "The Gloss Game™, this isn't detailing, it's discipline on display",
    description:
      "Twelve chapters on car care. Built on a driveway in Escondido in 1993. Paperback and Kindle.",
    url: "https://paddockgavin.com/gloss-game",
    siteName: "PaddockGavin",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://paddockgavin.com/gloss-game" },
}

export default function GlossGameLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
