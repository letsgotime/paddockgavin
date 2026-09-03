import type { Metadata } from "next"

const BLURB = "Gavin Brooks, Nashville, Tennessee. Concierge broker and vehicle sourcer, retail or wholesale, shopping with a dealer's licence so every auction is open. 78 cars found for other people, most of them before they were listed."

export const metadata: Metadata = {
  title: "Exotic car broker and sourcing, Nashville · PaddockGavin",
  description: BLURB,
  openGraph: {
    title: "Exotic car broker and sourcing, Nashville · PaddockGavin",
    description: "I find cars for people. Retail or wholesale, every auction open, 78 found so far.",
    url: "https://paddockgavin.com",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PaddockGavin" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { HomeHero } from "@/components/home-hero"
import { HomeWall } from "@/components/home-wall"
import { HomeMediaKit } from "@/components/home-media-kit"
import { HomeAskMe } from "@/components/home-ask-me"
import { Section, ProductRows, PhotoBreak, AlsoHere, LinkRow } from "@/components/home-sections"

function Stage({ children, sec }: { children: React.ReactNode; sec: string }) {
  return <div data-sec={sec} className="pg-stage">{children}</div>
}

/**
 * Eight sections, one idea each, one button each. The four that used to say
 * "two shifts" are two. The car numbers live once, in the proof strip under
 * the hero; the audience numbers live under the brands heading.
 */
export default function HomePage() {
  return (
    <>
      <SiteNav active="home" />
      <HomeHero />

      <Stage sec="sourcing">
        <Section id="sourcing" eyebrow="Sourcing" tone="#F2C94C" title="Selling an exotic car, or looking for one?" cta={{ href: "/intake", label: "Start the intake" }} link={{ href: "/cars", label: "The Garage" }}>
          <p style={{ margin: 0 }}>
            If you want to sell your exotic car, start the intake and I&rsquo;ll take it from there. I have found 78 cars for other people. Concierge broker and vehicle sourcer, retail or wholesale. We shop with a dealer&rsquo;s licence, so every auction is open.
          </p>
          <LinkRow items={[
            { href: "/sell-my-exotic-car", label: "Sell my exotic car", note: "Retail or wholesale" },
            { href: "/exotic-car-broker", label: "Find me a car", note: "Every auction open" },
            { href: "/exotic-car-consignment", label: "Consignment", note: "The retail lane" },
          ]} />
        </Section>
      </Stage>

      <Stage sec="day">
        <Section id="day" eyebrow="Day shift · 08:00 to 18:00" tone="#F2C94C" title="On the lot" cta={{ href: "/lot-ops", label: "Lot Ops in Action" }} link={{ href: "/events", label: "Book the floor for a private event" }}>
          <p style={{ margin: 0 }}>
            The gate opens at eight and I&rsquo;m usually there before the cars. Every delivery gets unloaded, inspected, photographed and logged. Every car goes through inspection, photography, writeup and staging before it reaches a buyer. On event days I open before sunrise and close after the last guest clears the rope.
          </p>
        </Section>
      </Stage>

      <PhotoBreak src="/images/g993-out.webp" pos="center 40%" caption="Gunther Werks 993, loading out" />

      <Stage sec="night">
        <Section id="night" eyebrow="Night shift · after hours" tone="#00D2BE" title="What I build when the gate shuts" cta={{ href: "/scoreboard", label: "The scoreboard" }}>
          <p style={{ margin: 0 }}>
            The problems I run into on the lot are problems other people have too, so I build AI tools for lot operations, inventory and lead capture. I&rsquo;m also a detailing student, working through paint correction and ceramic coating.
          </p>
          <ProductRows />
        </Section>
      </Stage>

      <Stage sec="wall">
        <HomeWall />
      </Stage>

      <Stage sec="mediakit">
        <HomeMediaKit />
      </Stage>

      <Stage sec="also">
        <AlsoHere />
      </Stage>

      <PhotoBreak src="/images/creator-hero.jpg" pos="center 62%" caption="Aston Martin at golden hour" credit="Rickey Bohr" />

      <Stage sec="contact">
        <HomeAskMe />
      </Stage>

      <SiteFooter />
    </>
  )
}
