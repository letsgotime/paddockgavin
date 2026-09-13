import type { Metadata } from "next"
import { SourcingPage } from "@/components/sourcing-page"
import { DM, STATS } from "@/lib/site-data"

const DESCRIPTION = `Buy, sell or consign an exotic or luxury car with Gavin Brooks in Nashville. Retail or wholesale, through a licensed dealer, with any broker fee disclosed in writing before you sign. ${STATS.carsFound} cars found for other people so far.`

export const metadata: Metadata = {
  title: "Exotic and luxury car broker, sourcing and consignment, Nashville",
  description: DESCRIPTION,
  alternates: { canonical: "https://paddockgavin.com/exotic-car-broker" },
  openGraph: { title: "Exotic and luxury car broker, sourcing and consignment, Nashville", description: "Buying or selling an exotic car? Tell me the car. Through a licensed dealer, fee disclosed before you sign.", url: "https://paddockgavin.com/exotic-car-broker" },
}

export default function Page() {
  return (
    <SourcingPage
      path="/exotic-car-broker"
      eyebrow="Exotic and luxury car broker · Nashville, Tennessee"
      h1="Buying, selling or consigning? Tell me the car."
      lead="I buy cars and work around them every day, so buy, sell and consignment offers find their way to me. Through my network I broker exotic and luxury cars, retail or wholesale, and every sale completes through a licensed dealer."
      backdrop="/images/f458-front.webp"
      cta={{ href: DM, label: "Tell me the car you want" }}
      secondary={{ href: "/intake", label: "Selling? Start the intake" }}
      photo={{ src: "/images/tt/tt-458-lot.webp", alt: "A white Ferrari 458 parked beside a black Lamborghini at one of our events", caption: "Most of them turn up because somebody went and found them." }}
      lanes={[
        {
          id: "buy",
          eyebrow: "Buying",
          title: "Find me a car",
          lead: `Most of the ${STATS.carsFound} cars I have found for people turned up before they were ever listed.`,
          steps: [
            { title: "The spec and the budget", body: "Year, model, spec, colour, miles, budget. Send what you know and I will fill in the rest." },
            { title: "The search", body: "My network, retail listings, the trade, and the auctions a dealer's licence opens." },
            { title: "The offer, in writing", body: "Nothing is an offer until the selling dealer puts it in writing. The paperwork, the financing, the title, the funds and the delivery run on that dealer's licence and under its terms." },
          ],
          cta: { href: DM, label: "Tell me the car" },
        },
        {
          id: "sell",
          eyebrow: "Selling",
          title: "Sell my exotic car",
          lead: "Tell me what you have and I will tell you which lane it belongs in. If there is a broker fee, you hear the number before you sign anything.",
          steps: [
            { title: "Tell me the car", body: "Start the intake with the VIN, or whatever you know. It comes straight to me, and I read every one." },
            { title: "I tell you the lane", body: "Retail sells the car to the person who will drive it. Wholesale sells it to the trade, which is usually faster. Not sure? Leave it blank and I will tell you." },
            { title: "The sale completes through a licensed dealer", body: "The paperwork, the financing, the title, the funds and the delivery all run on that dealer's licence and under its terms." },
          ],
          cta: { href: "/intake", label: "Start the intake" },
        },
        {
          id: "consignment",
          eyebrow: "Consignment",
          title: "Consignment, the retail lane",
          lead: "The car is listed and sold on your behalf, and you are paid from the sale. It takes longer than wholesale, and it is usually worth more.",
          steps: [
            { title: "Listed and sold on your behalf", body: "Through a licensed dealer, on its licence and under its terms." },
            { title: "You are paid from the sale", body: "A broker fee, if any, is set per sale and disclosed to you in writing before you sign the broker agreement." },
          ],
          cta: { href: "/intake", label: "Start the intake" },
        },
      ]}
      faqs={[
        { q: "What does an exotic car broker do?", a: "Finds the car to your spec, rather than selling you what is on a lot. I search retail listings, the trade and the auctions a dealer's licence opens, and the sale completes through a licensed dealer." },
        { q: "How do I sell my exotic car through PaddockGavin?", a: "Start the intake with the VIN or whatever you know about the car. I read it, tell you whether it belongs in the retail lane or the wholesale lane, and the sale itself completes through a licensed dealer." },
        { q: "Should I sell retail or wholesale?", a: "Retail sells the car to the person who will drive it. Wholesale sells it to the trade, which is usually the faster route. If you are not sure, leave it blank on the intake and I will tell you which lane the car belongs in." },
        { q: "What is exotic car consignment?", a: "The car is listed and sold on your behalf, and you are paid from the sale. It is the retail lane: the buyer is the person who will drive the car." },
        { q: "Who actually sells the car?", a: "A licensed dealer. The paperwork, the financing, the title, the funds and the delivery all run on that dealer's licence and under its terms. Nothing is an offer until the selling dealer puts it in writing." },
        { q: "Is there a broker fee?", a: "A broker fee, if any, is set per sale and disclosed to you in writing before you sign the broker agreement." },
        { q: "Do you buy at auction?", a: "I shop with a dealer's licence, so every auction is open." },
        { q: "Have you done this before?", a: `${STATS.carsFound} cars found for other people so far, most of them before they were listed, and ${STATS.carsOwned} of my own over ${STATS.yearsOwning} years.` },
        { q: "What happens to my details?", a: "The selling dealer collects what a dealer has to: identification, financing details, title paperwork. That is their process on their licence, and I neither receive nor keep it." },
        { q: "Where are you based?", a: "Nashville, Tennessee. The intake works from anywhere." },
      ]}
      related={[
        { href: "/intake", label: "Start the intake", note: "Four steps, for sellers" },
        { href: "/cars", label: "The Garage", note: `The ${STATS.carsOwned} cars that were mine` },
        { href: DM, label: "Tell me the car", note: "Straight to me" },
      ]}
    />
  )
}
