import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PaddockGavin · Two shifts. One paddock.",
  description:
    "Gavin Brooks, Nashville, Tennessee. Concierge broker and vehicle sourcer, retail or wholesale, shopping with a dealer's licence so every auction is open. Lot operations and events by day, software by night.",
  openGraph: {
    title: "PaddockGavin · Two shifts. One paddock.",
    description: "Cars used to be the reward. Now they're the work.",
    url: "https://paddockgavin.com",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PaddockGavin" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

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
function PhotoBreak({ src, pos = "center 40%", credit }: { src: string; pos?: string; h?: string; credit?: string }) {
  return (
    <div aria-hidden={!credit} className="pg-photo-break">
      <img src={src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(10,21,35,.55) 0%,rgba(10,21,35,0) 38%,rgba(10,21,35,0) 62%,rgba(10,21,35,.55) 100%)" }} />
      {credit && (
        <p style={{ position: "absolute", bottom: 10, right: 14, margin: 0, fontFamily: "Inter, sans-serif", fontSize: 10, letterSpacing: "0.08em", color: "rgba(255,255,255,0.82)", textTransform: "uppercase" }}>
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
      className="pg-stage"
    >
      {children}
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <SiteNav active="home" />
      <h1 className="sr-only">PaddockGavin · Lot operations and events by day, software by night. Nashville, Tennessee.</h1>
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
      <PhotoBreak src="/images/donuts-z06.webp" pos="center 45%" credit="PaddockGavin" />

      {/* ── 2. STORY ──────────────────────────────── */}
      <Stage sec="story">
        <HomeStory />
      </Stage>

      {/* ── BREAK ── Outdoor car show lot ───────────── */}
      <PhotoBreak src="/images/donuts-lot.webp" pos="center 30%" credit="PaddockGavin" />

      {/* ── 3. TWO SHIFTS ─────────────────────────── */}
      <Stage sec="shifts">
        <HomeTwoShifts />
      </Stage>

      {/* ── BREAK ── Donuts Cars & Coffee interior ── */}
      <PhotoBreak src="/images/donuts-inside.webp" pos="center 65%" credit="PaddockGavin" />

      {/* ── 4. THE GARAGE ─────────────────────────── */}
      <Stage sec="garage">
        <HomeGarage />
      </Stage>

      {/* ── BREAK ── Green 993 GW being loaded ─────── */}
      <PhotoBreak src="/images/g993-out.webp" pos="center 40%" credit="PaddockGavin" />

      {/* ── 5. FOR BRANDS ─────────────────────────── */}
      <Stage sec="mediakit">
        <HomeMediaKit />
      </Stage>

      {/* ── BREAK ── Aston Martin at golden hour ───── */}
      <PhotoBreak src="/images/creator-hero.jpg" pos="center 62%" credit="Rickey Bohr" />

      {/* ── 6. ASK ME ─────────────────────────────── */}
      <Stage sec="contact">
        <HomeAskMe />
      </Stage>

      <SiteFooter />
    </>
  )
}
