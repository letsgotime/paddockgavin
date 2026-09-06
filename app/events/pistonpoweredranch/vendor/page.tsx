import type { Metadata } from "next"
import { ranchShare } from "@/lib/events/ranch-share"
import { ApplyPage } from "../_apply"
import { catalogFor, isOnSale } from "@/lib/stripe/catalog"


/* Copy audited against the concours register on 30 August 2026: no tells from
   the Redline list, no Pebble, Amelia or Monterey, no em or en dashes, every
   number on the page confirmed elsewhere in the plan. This is an audit, not a
   Redline run: the copy has not been back through the tool since it was
   written. */
export const metadata: Metadata = ranchShare({
  path: "/vendor",
  title: "Vendor Row · The Piston Powered Ranch",
  description:
    "Vendor spaces on the entry drive at The Piston Powered Ranch, October 10 2026 at Rancho Jaramillo. Spaces start at $250 and scale with footprint.",
})

/* The booth sizes as offers a search engine can read, priced from the
   same catalogue checkout charges from, so the figure here can never
   drift from the figure on the card. The booth page is noindex, which
   is why the offers live on this page. */
function offersSchema() {
  const items = Object.values(catalogFor("pistonpoweredranch") || {}).filter((i) => i.audience === "public" && isOnSale(i))
  const offers = items.map((i) => ({
    "@type": "Offer",
    name: i.name,
    price: ((i.cents || 0) / 100).toFixed(2),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://pistonpoweredranch.com/vendor/booth",
    validThrough: "2026-10-10",
  }))
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Vendor booth at The Piston Powered Ranch",
    description: "Booth space on vendor row at The Piston Powered Ranch, Saturday 10 October 2026, Rancho Jaramillo, Unionville, Tennessee.",
    url: "https://pistonpoweredranch.com/vendor",
    brand: { "@type": "Organization", name: "PaddockGavin", url: "https://paddockgavin.com" },
    offers,
  }
}

export default function Page() {
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema()) }} />
    <ApplyPage
      kicker="Vendor row"
      title="The first thing guests walk past"
      lede="Vendor row runs along the entry drive, between the gate and the show field."
      body={[
        "Spaces start at $250 and scale with footprint. Food vendors work on a share of sales agreed up front, rather than a flat fee.",
        "Tell us what you sell and we will tell you where you fit.",
      ]}
      img="/images/ranch/ppr-gate.jpg"
      focal="center 42%"
      bandImg="/images/donuts-inside.webp"
      bandFocal="center 50%"
      closeImg="/images/ranch/ppr-bins.jpg"
      tone="#4BA3DE"
      asksHead="What to tell us"
      asks={[
        { t: "What you sell", b: "Product, food, service, or something we have not seen yet." },
        { t: "Footprint", b: "How much room you need, and whether you are bringing a trailer." },
        { t: "Power and water", b: "What you need on site so we can place you properly." },
        { t: "Who is working it", b: "How many people will be behind the table." },
      ]}
      form={{ kind: "vendor-application", head: "Tell us what you sell. We will tell you where you fit.", orgLabel: "Business name", askLabel: "What you sell, the footprint you need, power and water, and how many are working it" }}
      closeLine="Every enquiry is answered."
      cta={{ label: "Reserve a booth", href: "/events/pistonpoweredranch/vendor/booth" }}
    />
    </>
  )
}
