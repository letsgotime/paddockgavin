import type { Metadata } from "next"

const BLURB = "Gavin Brooks, Nashville. Automotive, tech and the life around both. I buy cars and keep them, detail them, film the ones friends and clients bring me, run the events, and build the software. Sourcing comes with it."

export const metadata: Metadata = {
  title: "Automotive, tech and lifestyle, Nashville · PaddockGavin",
  description: BLURB,
  openGraph: {
    title: "Automotive, tech and lifestyle, Nashville · PaddockGavin",
    description: "Gavin Brooks. Cars I buy and detail, cars my friends and clients bring me, the events I run, and the software I build.",
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
        <Section id="cars" eyebrow="The cars" tone="#F2C94C" title="Mine, and the ones people bring me" cta={{ href: "/cars", label: "The garage" }} link={{ href: "/gallery", label: "The gallery" }}>
          <p style={{ margin: 0 }}>
            Twenty-nine cars over thirty years, and the ones friends and clients hand me the keys to. I detail them, I photograph them, and I say what they are actually like to live with.
          </p>
        </Section>
      </Stage>

      <Stage sec="events">
        <Section id="events" eyebrow="The events" tone="#00D2BE" title="The days people drive to" cta={{ href: "/events", label: "Every event" }} link={{ href: "/book", label: "Book the floor" }}>
          <p style={{ margin: 0 }}>
            Two hundred and counting, on working ranches, in orchards and on showroom floors. The next one is the Piston Powered Ranch at Rancho Jaramillo, Saturday 10 October.
          </p>
        </Section>
      </Stage>

      <Stage sec="night">
        <Section id="night" eyebrow="The tech" tone="#57C7F5" title="Supercar IQ, and the rest of the bench" cta={{ href: "/scoreboard", label: "The scoreboard" }}>
          <p style={{ margin: 0 }}>
            Supercar IQ points a phone at a car and tells you what it is. Around it sit the other builds and the book. I&rsquo;m also a detailing student, working through paint correction and ceramic coating.
          </p>
          <ProductRows />
        </Section>
      </Stage>

      <Stage sec="mediakit">
        <HomeMediaKit />
      </Stage>

      <Stage sec="sourcing">
        <Section id="sourcing" eyebrow="And if you need one found" tone="#B4B6B2" title="Sourcing comes with the rest of it" cta={{ href: "/intake", label: "Start the intake" }}>
          <p style={{ margin: 0 }}>
            It is the last thing on this page on purpose. I am around cars all week, so when somebody needs one found I can usually help. Seventy-eight so far, retail or wholesale, and the sale completes through a licensed dealer.
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
