import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { HomeHero } from "@/components/home-hero"
import { HomeWall } from "@/components/home-wall"
import { HomeStory } from "@/components/home-story"
import { HomeTwoShifts } from "@/components/home-two-shifts"
import { HomeGarage } from "@/components/home-garage"
import { HomeMediaKit } from "@/components/home-media-kit"
import { HomeAskMe } from "@/components/home-ask-me"

// Full-bleed photo break — no max-width, edge to edge
function PhotoBreak({ src, pos = "center 40%", h = "clamp(320px,52vw,640px)" }: { src: string; pos?: string; h?: string }) {
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
      style={{ width: "100%", maxWidth: 1180, margin: "0 auto", padding: "clamp(72px,11vw,144px) clamp(16px,5vw,48px)" }}
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
      <div data-sec="wall" style={{ paddingTop: "clamp(48px,7vw,96px)" }}>
        <HomeWall />
      </div>

      {/* ── BREAK ── 918 exhaust ───────────────────── */}
      <PhotoBreak src="/images/918-pipes.webp" pos="center 42%" />

      {/* ── 2. STORY ──────────────────────────────── */}
      <Stage sec="story">
        <HomeStory />
      </Stage>

      {/* ── BREAK ── Cullinan doors up ─────────────── */}
      <PhotoBreak src="/images/cullinan-doors.webp" pos="center 30%" />

      {/* ── 3. TWO SHIFTS ─────────────────────────── */}
      <Stage sec="shifts">
        <HomeTwoShifts />
      </Stage>

      {/* ── BREAK ── 918 + P1 nose-to-nose ─────────── */}
      <PhotoBreak src="/images/918-p1.webp" pos="center 35%" />

      {/* ── 4. THE GARAGE ─────────────────────────── */}
      <Stage sec="garage">
        <HomeGarage />
      </Stage>

      {/* ── BREAK ── Donuts inside ─────────────────── */}
      <PhotoBreak src="/images/donuts-inside.webp" pos="center 38%" />

      {/* ── 5. FOR BRANDS ─────────────────────────── */}
      <Stage sec="mediakit">
        <HomeMediaKit />
      </Stage>

      {/* ── BREAK ── Carrera in traffic ─────────────── */}
      <PhotoBreak src="/images/carrera-traffic.jpg" pos="center 50%" />

      {/* ── 6. ASK ME ─────────────────────────────── */}
      <Stage sec="contact">
        <HomeAskMe />
      </Stage>

      <SiteFooter />
    </>
  )
}
