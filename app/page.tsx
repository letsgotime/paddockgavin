import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { HomeHero } from "@/components/home-hero"
import { HomeWall } from "@/components/home-wall"
import { HomeStory } from "@/components/home-story"
import { HomeTwoShifts } from "@/components/home-two-shifts"
import { HomeGarage } from "@/components/home-garage"
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
          minWidth: 0,
          maxWidth: 1180,
          margin: "0 auto",
          padding:
            "clamp(14px,2.4vw,22px) clamp(12px,4vw,40px) clamp(40px,7vw,84px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(14px,2.4vw,22px)",
        }}
      >
        <HomeWall />
        <HomeStory />
        <HomeTwoShifts />
        <HomeGarage />
        <HomeAskMe />
      </main>
      <SiteFooter />
    </>
  )
}
