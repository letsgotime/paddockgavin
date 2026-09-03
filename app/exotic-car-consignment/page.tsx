import type { Metadata } from "next"
import { SourcingPage } from "@/components/sourcing-page"

export const metadata: Metadata = {
  title: "Exotic car consignment, Nashville",
  description: "Consign an exotic car through PaddockGavin. The retail lane: the car is sold on your behalf through a licensed dealer, and any broker fee is set per sale and disclosed before you sign. Nashville, Tennessee.",
  alternates: { canonical: "https://paddockgavin.com/exotic-car-consignment" },
  openGraph: { title: "Exotic car consignment, Nashville", description: "The retail lane, explained. Sold on your behalf through a licensed dealer, fee disclosed before you sign.", url: "https://paddockgavin.com/exotic-car-consignment" },
}

export default function Page() {
  return (
    <SourcingPage
      path="/exotic-car-consignment"
      eyebrow="Exotic car consignment"
      h1="Consignment is the retail lane. Here is what that means."
      lead="In a consignment sale the car is listed and sold on your behalf and you are paid from the sale. It takes longer than wholesale and it is usually worth more. The sale completes through a licensed dealer."
      backdrop="/images/ferrari-upperdeck.webp"
      steps={[
        { title: "Tell me the car", body: "Start the intake with the VIN, or what you know. If consignment is the right lane I will say so; if wholesale is, I will say that instead." },
        { title: "The car is listed and sold on your behalf", body: "Through a licensed dealer, on its licence and under its terms: the paperwork, the financing, the title, the funds and the delivery." },
        { title: "You are paid from the sale", body: "A broker fee, if any, is set per sale and disclosed to you in writing before you sign the broker agreement." },
      ]}
      nashville="I am in Nashville, Tennessee. Seventy-eight cars found for other people so far; the intake is where every one of them started."
      faqs={[
        { q: "What is exotic car consignment?", a: "The car is listed and sold on your behalf, and you are paid from the sale. It is the retail lane: the buyer is the person who will drive the car." },
        { q: "Who actually sells the car?", a: "A licensed dealer. The paperwork, the financing, the title, the funds and the delivery all run on that dealer's licence and under its terms. Nothing is an offer until the selling dealer puts it in writing." },
        { q: "Consignment or wholesale?", a: "Consignment is retail: slower, usually worth more. Wholesale sells to the trade: faster. Start the intake and I will tell you which lane your car belongs in." },
        { q: "What does it cost?", a: "A broker fee, if any, is set per sale and disclosed to you in writing before you sign the broker agreement." },
        { q: "Where are you?", a: "Nashville, Tennessee. The intake works from anywhere." },
      ]}
      related={[
        { href: "/sell-my-exotic-car", label: "Sell my exotic car", note: "Both lanes" },
        { href: "/exotic-car-broker", label: "Looking for a car?", note: "Exotic car broker" },
        { href: "/intake", label: "Start the intake", note: "Two minutes" },
      ]}
    />
  )
}
