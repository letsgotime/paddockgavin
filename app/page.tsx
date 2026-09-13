import type { Metadata } from "next"
import Link from "next/link"

const BLURB = "Cars, car events you can walk into, detailing, and the technology Gavin Brooks builds. Nashville, Tennessee."

export const metadata: Metadata = {
  title: "Automotive, events, detailing and tech, Nashville · PaddockGavin",
  description: BLURB,
  openGraph: {
    title: "Automotive, events, detailing and tech, Nashville · PaddockGavin",
    description: BLURB,
    url: "https://paddockgavin.com",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PaddockGavin" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

import { PG_SCHEMA } from "./layout"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { HomeHero } from "@/components/home-hero"
import { HomePillars } from "@/components/home-pillars"
import { HomeWall } from "@/components/home-wall"
import { HomeMediaKit } from "@/components/home-media-kit"
import { HomeAskMe } from "@/components/home-ask-me"
import { Section, ProductRows, PhotoBreak } from "@/components/home-sections"
import { PGELockup } from "@/components/pge-brand"
import { DM, PILLARS, STATS } from "@/lib/site-data"
import { getWallPosts } from "@/lib/social"

function Stage({ children, sec }: { children: React.ReactNode; sec: string }) {
  return <div data-sec={sec} className="pg-stage">{children}</div>
}

/**
 * Who this is, then the four pillars, then one section per pillar, then the
 * audience and the business. One idea and one button per section.
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

      <Stage sec="pillars">
        <HomePillars />
      </Stage>

      <Stage sec="paddock">
        <div style={{ borderLeft: "2px solid #F2C94C", paddingLeft: "clamp(16px,2.4vw,26px)", display: "flex", flexDirection: "column", gap: "clamp(12px,1.8vw,18px)" }}>
          <p style={{ margin: 0, fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: "var(--t-eyebrow)", letterSpacing: ".2em", textTransform: "uppercase", color: "#B4B6B2" }}>
            The word
          </p>
          <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "60ch" }}>
            A paddock is the part of a racetrack most people never see: behind pit lane, where the transporters park and the teams work.
          </p>
          <blockquote style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: "var(--t-h3)", lineHeight: 1.32, letterSpacing: "-.014em", color: "#FFFFFF", maxWidth: "42ch", textWrap: "balance" }}>
            Nobody in a paddock is showing off. Everybody has something apart, and everybody is happy to tell you why. You learn more standing around one for an afternoon than you do reading for a year.
          </blockquote>
          <p style={{ margin: 0 }}>
            <Link href="/why-a-paddock" className="pg-textlink">Why a Paddock</Link>
          </p>
        </div>
      </Stage>

      <PhotoBreak src="/images/g993-out.webp" pos="center 40%" caption="Gunther Werks 993, loading out" />

      <Stage sec="cars">
        <Section id="cars" eyebrow={PILLARS.automotive.label} tone={PILLARS.automotive.tone} title="The cars, and what they are like to live with" cta={{ href: "/cars", label: "The Garage" }} link={{ href: "/features", label: "The Paddock Files" }}>
          <p style={{ margin: 0 }}>
            {STATS.carsOwned} cars of my own over {STATS.yearsOwning} years, and the notable ones that came through the lot. Each is written up honestly, so you learn what it is like to live with, not just how it looks parked.
          </p>
        </Section>
      </Stage>

      <Stage sec="events">
        <Section id="events" eyebrow={PILLARS.events.label} tone={PILLARS.events.tone} title="Days built around the cars" cta={{ href: "/events", label: "Every event" }} link={{ href: "/book", label: "Book an event" }}>
          <PGELockup height={32} />
          <p style={{ margin: 0 }}>
            The next one is the Piston Powered Ranch at Rancho Jaramillo, on Saturday 10 October. It is free to come and look, and anybody is welcome.
          </p>
        </Section>
      </Stage>

      <Stage sec="detailing">
        <Section id="detailing" eyebrow={PILLARS.detailing.label} tone={PILLARS.detailing.tone} title="Detailing is where it started" cta={{ href: "/gloss-game", label: "The Gloss Game" }} link={{ href: "/gloss-game#picks", label: "The free product index" }}>
          <p style={{ margin: 0 }}>
            Detailing is how I fell for cars. The Gloss Game is the order I work in, written down: what to buy, what touches the paint, and in what sequence.
          </p>
        </Section>
      </Stage>

      <Stage sec="tech">
        <Section id="tech" eyebrow={PILLARS.tech.label} tone={PILLARS.tech.tone} title="Always learning" cta={{ href: "/why-a-paddock", label: "The whole story" }} link={{ href: "/scoreboard", label: "The Scoreboard" }}>
          <p style={{ margin: 0 }}>
            Spreadsheets first, then code, now agentic engineering. Supercar IQ came out of a question the lot asked every day: what exactly is this car?
          </p>
          <ProductRows />
        </Section>
      </Stage>

      <Stage sec="wall">
        <HomeWall posts={wall} />
      </Stage>

      <Stage sec="mediakit">
        <HomeMediaKit />
      </Stage>

      <Stage sec="work">
        <Section id="work" eyebrow="Work with me" tone="#B4B6B2" title="Buying, selling or consigning a car" cta={{ href: DM, label: "Tell me the car", external: true }} link={{ href: "/exotic-car-broker", label: "How it works" }}>
          <p style={{ margin: 0 }}>
            I buy cars and work around them every day, so buy, sell and consignment offers find their way to me. Through my network I broker exotic and luxury cars, retail or wholesale, and every sale completes through a licensed dealer.
          </p>
        </Section>
      </Stage>

      <PhotoBreak src="/images/creator-hero.webp" pos="center 62%" caption="Aston Martin at golden hour" credit="Rickey Bohr" />

      <Stage sec="contact">
        <HomeAskMe />
      </Stage>

      <SiteFooter />
    </>
  )
}
