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
function PhotoBreak({ src, pos = "center 40%", h = "clamp(280px,42vw,440px)", credit }: { src: string; pos?: string; h?: string; credit?: string }) {
  return (
    <div aria-hidden={!credit} style={{ width: "100%", height: h, position: "relative", overflow: "hidden" }}>
      <img src={src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(10,21,35,.55) 0%,rgba(10,21,35,0) 38%,rgba(10,21,35,0) 62%,rgba(10,21,35,.55) 100%)" }} />
      {credit && (
        <p style={{ position: "absolute", bottom: 10, right: 14, margin: 0, fontFamily: "Inter, sans-serif", fontSize: 10, letterSpacing: "0.08em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>
          &copy; {credit}
        </p>
      )}
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

      {/* ── BREAK ── Yellow 992 on the showroom floor ── */}
      <PhotoBreak src="/images/donuts-z06.webp" pos="center 45%" credit="@ItsPaddockGavin" />

      {/* ── 2. STORY ──────────────────────────────── */}
      <Stage sec="story">
        <HomeStory />
      </Stage>

      {/* ── BREAK ── Outdoor car show lot ───────────── */}
      <PhotoBreak src="/images/donuts-lot.webp" pos="center 30%" credit="@ItsPaddockGavin" />

      {/* ── 3. TWO SHIFTS ─────────────────────────── */}
      <Stage sec="shifts">
        <HomeTwoShifts />
      </Stage>

      {/* ── BREAK ── Donuts Cars & Coffee interior ── */}
      <PhotoBreak src="/images/donuts-inside.webp" pos="center 65%" credit="@ItsPaddockGavin" />

      {/* ── 4. THE GARAGE ─────────────────────────── */}
      <Stage sec="garage">
        <HomeGarage />
      </Stage>

      {/* ── BREAK ── Green 993 GW being loaded ─────── */}
      <PhotoBreak src="/images/g993-out.webp" pos="center 40%" credit="@ItsPaddockGavin" />

      {/* ── 5. FOR BRANDS ─────────────────────────── */}
      <Stage sec="mediakit">
        <HomeMediaKit />
      </Stage>

      {/* ── BREAK ── Black car at sunset ───────────── */}
      <PhotoBreak src="/images/creator-hero.jpg" pos="center 62%" credit="Rickey Bohr" />

      {/* ── 6. ASK ME ─────────────────────────────── */}
      <Stage sec="contact">
        <HomeAskMe />
      </Stage>

      <SiteFooter />
    </>
  )
}
