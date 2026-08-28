import type { Metadata } from "next"
import { ApplyPage } from "../_apply"

export const metadata: Metadata = {
  title: "Vendor Row — The Piston Powered Ranch",
  description:
    "Vendor spaces on the entry drive at The Piston Powered Ranch, October 10 2026 at Rancho Jaramillo. Spaces start at $250 and scale with footprint.",
}

export default function Page() {
  return (
    <ApplyPage
      kicker="Vendor row"
      title="The first thing guests walk past"
      lede="Vendor row runs along the entry drive, between the gate and the show field."
      body={[
        "Spaces start at $250 and scale with footprint. Food vendors work on a share of sales agreed up front, rather than a flat fee.",
        "Tell us what you sell and we will tell you where you fit.",
      ]}
      img="/images/cullinan-doors.webp"
      focal="center 50%"
      tone="#4BA3DE"
      asksHead="What to tell us"
      asks={[
        { t: "What you sell", b: "Product, food, service, or something we have not seen yet." },
        { t: "Footprint", b: "How much room you need, and whether you are bringing a trailer." },
        { t: "Power and water", b: "What you need on site so we can place you properly." },
        { t: "Who is working it", b: "How many people will be behind the table." },
      ]}
      cta={{ label: "Apply for a space", href: "/connect" }}
    />
  )
}
