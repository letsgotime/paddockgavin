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

      {/* ── WALL — full width, first thing ── */}
      <div data-sec="wall" style={{ paddingTop: "clamp(60px,9vw,120px)" }}>
        <HomeWall />
      </div>

      {/* ── STORY — chapter break, big breathing room ── */}
      <div data-sec="story" style={{ paddingTop: "clamp(100px,14vw,200px)" }}>
        <HomeStory />
      </div>

      {/* ── TWO SHIFTS — its own stage ── */}
      <div data-sec="shifts" style={{ paddingTop: "clamp(100px,14vw,200px)" }}>
        <HomeTwoShifts />
      </div>

      {/* ── GARAGE — wide open ── */}
      <div
        data-sec="garage"
        style={{
          paddingTop: "clamp(100px,14vw,200px)",
          maxWidth: 1180,
          width: "100%",
          margin: "0 auto",
          padding: "clamp(100px,14vw,200px) clamp(16px,5vw,48px) 0",
        }}
      >
        <HomeGarage />
      </div>

      {/* ── MEDIA KIT ── */}
      <div
        data-sec="mediakit"
        style={{
          maxWidth: 1180,
          width: "100%",
          margin: "0 auto",
          padding: "clamp(100px,14vw,200px) clamp(16px,5vw,48px) 0",
        }}
      >
        <HomeMediaKit />
      </div>

      {/* ── ASK ME — closing stage ── */}
      <div
        data-sec="contact"
        style={{
          maxWidth: 1180,
          width: "100%",
          margin: "0 auto",
          padding: "clamp(100px,14vw,200px) clamp(16px,5vw,48px) clamp(100px,14vw,200px)",
        }}
      >
        <HomeAskMe />
      </div>

      <SiteFooter />
    </>
  )
}
