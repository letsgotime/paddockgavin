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
        <div data-sec="wall"><HomeWall /></div>
        <div data-sec="story"><HomeStory /></div>
        <div data-sec="shifts"><HomeTwoShifts /></div>
        <div data-sec="garage"><HomeGarage /></div>
        <div data-sec="mediakit"><HomeMediaKit /></div>
        <div data-sec="contact"><HomeAskMe /></div>
      </main>
      <SiteFooter />
    </>
  )
}
