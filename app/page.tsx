import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { HomeHero } from "@/components/home-hero"
import { HomeWall } from "@/components/home-wall"
import { HomeShiftsCard } from "@/components/home-shifts-card"
import { HomeStory } from "@/components/home-story"
import { HomeTwoShifts } from "@/components/home-two-shifts"
import { HomeGarage } from "@/components/home-garage"
import { HomeMediaKit } from "@/components/home-media-kit"
import { HomeAskMe } from "@/components/home-ask-me"

// Full-bleed photo break — no max-width, edge to edge
function PhotoBreak({ src, pos = "center 40%", h = "clamp(180px,28vw,320px)" }: { src: string; pos?: string; h?: string }) {
  return (
    <div aria-hidden="true" style={{ width: "100%", height: h, position: "relative", overflow: "hidden" }}>
      <img src={src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(10,21,35,.55) 0%,rgba(10,21,35,0) 38%,rgba(10,21,35,0) 62%,rgba(10,21,35,.55) 100%)" }} />
    </div>
  )
}

// Content stage — constrained, generous padding
function Stage({ children, sec }: { children: React.ReactNode; sec: string }) {
  return (
    <div
      data-sec={sec}
      style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1180, margin: "0 auto", padding: "clamp(72px,11vw,144px) clamp(16px,5vw,48px)" }}
    >
      {children}
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <SiteNav active="home" />
      <HomeHero />

      {/* ── 1. THE WALL ───────────────────────────── */}
      <div data-sec="wall" style={{ position: "relative", zIndex: 1, paddingTop: "clamp(48px,7vw,96px)" }}>
        <HomeWall />
      </div>

      {/* ── DAY / NIGHT SHIFTS CARD ───────────────── */}
      <Stage sec="shiftscard">
        <HomeShiftsCard />
      </Stage>

      {/* ── BREAK ── Cullinan on speedway ──────────── */}
      <PhotoBreak src="/images/cullinan-speedway.webp" pos="center 35%" />

      {/* ── 2. STORY ──────────────────────────────── */}
      <Stage sec="story">
        <HomeStory />
      </Stage>

      {/* ── BREAK ── Ferrari red profile ───────────── */}
      <PhotoBreak src="/images/ferrari-red.webp" pos="center 75%" />

      {/* ── 3. TWO SHIFTS ─────────────────────────── */}
      <Stage sec="shifts">
        <HomeTwoShifts />
      </Stage>

      {/* ── BREAK ── 918 charging center ───────────── */}
      <PhotoBreak src="/images/918-charging.webp" pos="center 45%" />

      {/* ── 4. THE GARAGE ─────────────────────────── */}
      <Stage sec="garage">
        <HomeGarage />
      </Stage>

      {/* ── BREAK ── Ferrari upper deck ────────────── */}
      <PhotoBreak src="/images/ferrari-upperdeck.webp" pos="center 40%" />

      {/* ── 5. FOR BRANDS ─────────────────────────── */}
      <Stage sec="mediakit">
        <HomeMediaKit />
      </Stage>

      {/* ── BREAK ── Cage rig detail ───────────────── */}
      <PhotoBreak src="/images/cage-rig.webp" pos="center 50%" />

      {/* ── 6. ASK ME ─────────────────────────────── */}
      <Stage sec="contact">
        <HomeAskMe />
      </Stage>

      <SiteFooter />
    </>
  )
}
