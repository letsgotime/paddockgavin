import type { Metadata } from "next"

const BLURB = "Closer to the cars. If you have only seen them through a screen, the days out are where you stand next to one, hear it pull on a mobile dyno, or take a lap of your own. Nashville, Tennessee."

export const metadata: Metadata = {
  title: "Automotive, tech and lifestyle, Nashville · PaddockGavin",
  description: BLURB,
  openGraph: {
    title: "Automotive, tech and lifestyle, Nashville · PaddockGavin",
    description: "Closer to the cars. Standing next to one, hearing it on a mobile dyno, taking a lap of your own. Nashville, Tennessee.",
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

      <PhotoBreak src="/images/g993-out.webp" pos="center 40%" caption="Gunther Werks 993, loading out" />

      <Stage sec="wall">
        <HomeWall />
      </Stage>

      <Stage sec="cars">
        <Section id="cars" eyebrow="The cars" tone="#F2C94C" title="If you want to see one properly" cta={{ href: "/cars", label: "The garage" }} link={{ href: "/gallery", label: "The gallery" }}>
          <p style={{ margin: 0 }}>
            Twenty-nine cars over thirty years, and the ones friends and clients hand over the keys to. Every one gets detailed, photographed and written up honestly, so you get what it is like to live with rather than how it looks parked.
          </p>
        </Section>
      </Stage>

      <Stage sec="events">
        <Section id="events" eyebrow="The events" tone="#00D2BE" title="The days people drive to" cta={{ href: "/events", label: "Every event" }} link={{ href: "/book", label: "Book the floor" }}>
          <p style={{ margin: 0 }}>
            Two hundred and counting, on working ranches, in orchards and on showroom floors. If you have only seen these cars online, a day out is where you stand next to one. The next is the Piston Powered Ranch at Rancho Jaramillo, Saturday 10 October.
          </p>
        </Section>
      </Stage>

      <Stage sec="night">
        <Section id="night" eyebrow="The tech" tone="#57C7F5" title="If you have ever wondered what that car was" cta={{ href: "/scoreboard", label: "The scoreboard" }}>
          <p style={{ margin: 0 }}>
            Point a phone at a car and Supercar IQ tells you what it is. Around it sit the other builds and the book on getting paint right.
          </p>
          <ProductRows />
        </Section>
      </Stage>

      <Stage sec="mediakit">
        <HomeMediaKit />
      </Stage>

      <Stage sec="sourcing">
        <Section id="sourcing" eyebrow="And if you need one found" tone="#B4B6B2" title="If you are looking for a particular car" cta={{ href: "/intake", label: "Start the intake" }}>
          <p style={{ margin: 0 }}>
            It is the last thing on this page on purpose. Being around cars all week means the network is usually the fastest way to a specific one. Seventy-eight found so far, retail or wholesale, and the sale completes through a licensed dealer.
          </p>
          <LinkRow items={[
            { href: "/sell-my-exotic-car", label: "Sell my exotic car", note: "Retail or wholesale" },
            { href: "/exotic-car-broker", label: "Find me a car", note: "Every auction open" },
            { href: "/exotic-car-consignment", label: "Consignment", note: "The retail lane" },
          ]} />
        </Section>
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
