import type { Metadata } from "next"
import { SourcingPage } from "@/components/sourcing-page"

export const metadata: Metadata = {
  title: "Sell my exotic car, retail or wholesale, Nashville",
  description: "Selling an exotic car? Tell Gavin Brooks what you have. Retail or wholesale, the sale completes through a licensed dealer, and any broker fee is set per sale and disclosed before you sign. Nashville, Tennessee.",
  alternates: { canonical: "https://paddockgavin.com/sell-my-exotic-car" },
  openGraph: { title: "Sell my exotic car, retail or wholesale", description: "Tell me what you have. Retail or wholesale, through a licensed dealer, fee disclosed before you sign.", url: "https://paddockgavin.com/sell-my-exotic-car" },
}

export default function Page() {
  return (
    <SourcingPage
      path="/sell-my-exotic-car"
      eyebrow="Sell my exotic car"
      h1="Selling an exotic car? Tell me what you have."
      lead="Retail or wholesale, whichever lane fits the car. The sale completes through a licensed dealer, and if there is a broker fee you hear the number before you sign anything."
      backdrop="/images/ferrari-296.webp"
      steps={[
        { title: "Tell me the car", body: "Start the intake with the VIN, or what you know. It comes to me, not a form robot, and I read every one." },
        { title: "I tell you the lane", body: "Retail means the car is sold to the person who will drive it. Wholesale means it goes to the trade, which is usually faster. Not sure which? Leave it blank and I will tell you where it belongs." },
        { title: "The sale completes through a licensed dealer", body: "The paperwork, the financing, the title, the funds and the delivery all run on that dealer's licence and under its terms. Nothing is an offer until the selling dealer puts it in writing." },
      ]}
      nashville="I am in Nashville, Tennessee, and I have found 78 cars for other people, most of them before they were listed. The intake is the start; the car can be anywhere."
      faqs={[
        { q: "How do I sell my exotic car through PaddockGavin?", a: "Start the intake with the VIN or whatever you know about the car. I read it, tell you whether it belongs in the retail lane or the wholesale lane, and the sale itself completes through a licensed dealer." },
        { q: "Should I sell retail or wholesale?", a: "Retail sells the car to the person who will drive it. Wholesale sells it to the trade, which is usually the faster route. If you are not sure, leave it blank on the intake and I will tell you which lane the car belongs in." },
        { q: "Is there a broker fee?", a: "A broker fee, if any, is set per sale and disclosed to you in writing before you sign the broker agreement." },
        { q: "Can I sell my exotic car near Nashville?", a: "PaddockGavin is based in Nashville, Tennessee. The intake works from anywhere." },
        { q: "What happens to my details?", a: "The selling dealer collects what a dealer has to: identification, financing details, title paperwork. That is their process on their licence, and I neither receive nor keep it." },
      ]}
      related={[
        { href: "/exotic-car-broker", label: "Looking for a car instead?", note: "Exotic car broker" },
        { href: "/exotic-car-consignment", label: "Consignment", note: "The retail lane, explained" },
        { href: "/intake", label: "Start the intake", note: "Two minutes" },
      ]}
    />
  )
}
