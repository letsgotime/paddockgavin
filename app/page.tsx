import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { HomeHero } from "@/components/home-hero"
import { HomeWall } from "@/components/home-wall"
import { HomeStory } from "@/components/home-story"
import { HomeTwoShifts } from "@/components/home-two-shifts"
import { HomeGarage } from "@/components/home-garage"
import { HomeMediaKit } from "@/components/home-media-kit"
import { HomeAskMe } from "@/components/home-ask-me"

export default function HomePage() {
  return (
    <>
      <SiteNav active="home" />
      <HomeHero />
      <main
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          /* Editorial funnel: generous breathing room between every section */
          gap: "clamp(64px,10vw,140px)",
          paddingBottom: "clamp(64px,10vw,140px)",
        }}
      >
        {/* The Wall — full-bleed, no padding */}
        <div data-sec="wall">
          <HomeWall />
        </div>

        {/* Story — constrained content, full-bleed photo inside */}
        <div data-sec="story">
          <HomeStory />
        </div>

        {/* Two Shifts — constrained content, full-bleed photo inside */}
        <div data-sec="shifts">
          <HomeTwoShifts />
        </div>

        {/* Garage */}
        <div
          data-sec="garage"
          style={{
            maxWidth: 1180,
            width: "100%",
            margin: "0 auto",
            padding: "0 clamp(12px,4vw,40px)",
          }}
        >
          <HomeGarage />
        </div>

        {/* Media Kit */}
        <div
          data-sec="mediakit"
          style={{
            maxWidth: 1180,
            width: "100%",
            margin: "0 auto",
            padding: "0 clamp(12px,4vw,40px)",
          }}
        >
          <HomeMediaKit />
        </div>

        {/* Ask Me */}
        <div
          data-sec="contact"
          style={{
            maxWidth: 1180,
            width: "100%",
            margin: "0 auto",
            padding: "0 clamp(12px,4vw,40px)",
          }}
        >
          <HomeAskMe />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
