import type { Metadata } from "next"
import Link from "next/link"

const BLURB = "Most people only see these cars on a screen. The days get you closer: three hundred of them on a working ranch, close enough to touch. Nashville."

export const metadata: Metadata = {
  title: "Automotive, tech and lifestyle, Nashville · PaddockGavin",
  description: BLURB,
  openGraph: {
    title: "Automotive, tech and lifestyle, Nashville · PaddockGavin",
    description: "Most people only see these cars on a screen. The days get you closer. Nashville, Tennessee.",
    url: "https://paddockgavin.com",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PaddockGavin" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

import { PG_SCHEMA } from "./layout"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { HomeHero } from "@/components/home-hero"
import { HomeWall } from "@/components/home-wall"
import { HomeMediaKit } from "@/components/home-media-kit"
import { HomeAskMe } from "@/components/home-ask-me"
import { Section, ProductRows, PhotoBreak, AlsoHere, LinkRow } from "@/components/home-sections"
import { getWallPosts } from "@/lib/social"

function Stage({ children, sec }: { children: React.ReactNode; sec: string }) {
  return <div data-sec={sec} className="pg-stage">{children}</div>
}

/**
 * Eight sections, one idea each, one button each. The four that used to say
 * "two shifts" are two. The car numbers live once, in the proof strip under
 * the hero; the audience numbers live under the brands heading.
 */
export default async function HomePage() {
  const wall = await getWallPosts()
  return (
    <>
      {/* Who PaddockGavin is, for the machines. It lives here rather than in
          the root layout because that shell is shared with the ranch door, and
          deciding brand there needs headers(), which is a dynamic API that
          breaks regeneration of the ISR event pages underneath it. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PG_SCHEMA).replace(/</g, "\\u003c") }} />
      <SiteNav active="home" />
      <HomeHero />

      {/* The word the brand is named after, explained where a first-time reader
          will actually meet it. This is Gavin's own sentence, and the audit
          called it the permission structure for the whole site: it was
          reachable only from a footer group called Elsewhere. */}
      <Stage sec="paddock">
        <div style={{ borderLeft: "2px solid #F2C94C", paddingLeft: "clamp(16px,2.4vw,26px)", display: "flex", flexDirection: "column", gap: "clamp(12px,1.8vw,18px)" }}>
          <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 10, fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: "var(--t-eyebrow)", letterSpacing: ".2em", textTransform: "uppercase", color: "#B4B6B2" }}>
            The word
          </p>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "60ch" }}>
            A paddock is the part of a racetrack most people never see. Behind pit lane, where the
            transporters park and the teams work.
          </p>
          <blockquote style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: "var(--t-h3)", lineHeight: 1.32, letterSpacing: "-.014em", color: "#FFFFFF", maxWidth: "42ch", textWrap: "balance" }}>
            Nobody in a paddock is showing off. Everybody has something apart, and everybody is happy
            to tell you why. You learn more standing around one for an afternoon than you do reading
            for a year.
          </blockquote>
          <p style={{ margin: 0 }}>
            <Link href="/why-a-paddock" className="pg-textlink">Why a Paddock</Link>
          </p>
        </div>
      </Stage>

      <PhotoBreak src="/images/g993-out.webp" pos="center 40%" caption="Gunther Werks 993, loading out" />

      <Stage sec="wall">
        <HomeWall posts={wall} />
      </Stage>

      <Stage sec="cars">
        <Section id="cars" eyebrow="The cars" tone="#F2C94C" title="The cars, and what they are like to live with" cta={{ href: "/cars", label: "The garage" }} link={{ href: "/gallery", label: "The gallery" }}>
          <p style={{ margin: 0 }}>
            Twenty-nine cars over thirty years, and the ones friends and clients hand over the keys to. Every one gets detailed, photographed and written up honestly, so you get what it is like to live with rather than how it looks parked.
          </p>
        </Section>
      </Stage>

      <Stage sec="events">
        <Section id="events" eyebrow="The events" tone="#00D2BE" title="The days people drive to" cta={{ href: "/events", label: "Every event" }} link={{ href: "/book", label: "Book an event" }}>
          <p style={{ margin: 0 }}>
            Two hundred and counting, on working ranches and in orchards. The next is the Piston Powered Ranch at Rancho Jaramillo, on Saturday 10 October, and anybody who wants to come is welcome.
          </p>
        </Section>
      </Stage>

      <Stage sec="night">
        <Section id="night" eyebrow="The tech" tone="#57C7F5" title="Point a phone at a car and it tells you what it is" cta={{ href: "/scoreboard", label: "The scoreboard" }}>
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
        <Section id="sourcing" eyebrow="Sourcing" tone="#B4B6B2" title="Looking for a particular car" cta={{ href: "https://ig.me/m/itspaddockgavin", label: "Tell me the car" }}>
          <p style={{ margin: 0 }}>
            The car somebody wants is often one that never gets listed. Most of the seventy-eight came through a phone call rather than a listing, retail or wholesale, and the sale completes through a licensed dealer.
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
