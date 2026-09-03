import type { Metadata } from "next"
import { SourcingPage } from "@/components/sourcing-page"

export const metadata: Metadata = {
  title: "Exotic car broker and sourcing, Nashville",
  description: "Gavin Brooks finds exotic and collector cars for people: concierge brokering, retail or wholesale, shopping with a dealer's licence so every auction is open. 78 found so far. Nashville, Tennessee.",
  alternates: { canonical: "https://paddockgavin.com/exotic-car-broker" },
  openGraph: { title: "Exotic car broker and sourcing, Nashville", description: "Tell me the spec and the budget. 78 found so far, most of them before they were listed.", url: "https://paddockgavin.com/exotic-car-broker" },
}

export default function Page() {
  return (
    <SourcingPage
      path="/exotic-car-broker"
      eyebrow="Exotic car broker"
      h1="Tell me the car. I will find it."
      lead="Concierge brokering and vehicle sourcing. I shop with a dealer's licence, so every auction is open, and the sale completes through a licensed dealer."
      backdrop="/images/f458-front.webp"
      steps={[
        { title: "The spec and the budget", body: "Year, model, spec, colour, miles, budget. Start the intake with what you know. I am the one reading it." },
        { title: "The search", body: "Retail listings, the trade, and the auctions a dealer's licence opens. Most of the 78 cars I have found for people turned up before they were listed." },
        { title: "The offer, in writing", body: "Nothing is an offer until the selling dealer puts it in writing. The paperwork, the financing, the title, the funds and the delivery run on that dealer's licence and under its terms." },
      ]}
      nashville="I am in Nashville, Tennessee. Twenty-nine cars owned over thirty years, seventy-eight found for other people, and the garage is on this site if you want to see what I keep."
      faqs={[
        { q: "What does an exotic car broker do?", a: "Finds the car to your spec, rather than selling you what is on a lot. I search retail listings, the trade and the auctions a dealer's licence opens, and the sale completes through a licensed dealer." },
        { q: "How is the broker paid?", a: "A broker fee, if any, is set per sale and disclosed to you in writing before you sign the broker agreement. Beyond that, how I am paid is between me and the dealer." },
        { q: "Do you buy at auction?", a: "I shop with a dealer's licence, so every auction is open." },
        { q: "Have you done this before?", a: "Seventy-eight cars found for other people so far, most of them before they were listed. Twenty-nine of my own over thirty years." },
        { q: "Where are you based?", a: "Nashville, Tennessee. The intake works from anywhere." },
      ]}
      related={[
        { href: "/sell-my-exotic-car", label: "Selling one instead?", note: "Retail or wholesale" },
        { href: "/cars", label: "The Garage", note: "29 cars over 30+ years" },
        { href: "/intake", label: "Start the intake", note: "Two minutes" },
      ]}
    />
  )
}
