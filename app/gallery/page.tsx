"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

interface BeholdPost {
  id: string
  sizes?: { medium?: { mediaUrl?: string; width?: number; height?: number }; large?: { mediaUrl?: string }; full?: { mediaUrl?: string } }
  thumbnailUrl?: string
  mediaUrl?: string
  mediaType?: string
  prunedCaption?: string
  caption?: string
  permalink?: string
  profile?: { username?: string; followersCount?: number }
}

interface WallItem {
  key: string
  src: string
  large: string
  caption: string
  isVideo: boolean
  videoSrc?: string
  permalink: string
  chapter: string
  aspect: string
  span: string
}

interface LightboxState {
  pool: WallItem[]
  index: number
  src: string
  caption: string
  isVideo: boolean
  videoSrc?: string
  permalink: string
  eyebrow: string
  position: string
}

const BEHOLD_FEEDS = [
  process.env.NEXT_PUBLIC_BEHOLD_FEED_1 ?? "",
  process.env.NEXT_PUBLIC_BEHOLD_FEED_2 ?? "",
  process.env.NEXT_PUBLIC_BEHOLD_FEED_3 ?? "",
].filter(Boolean)

const TAG_MAP: Record<string, string> = {
  donuts: "the-room", bts: "nobody-films",
  nobodyfilms: "nobody-films", stuffnobodyfilms: "nobody-films", trunkrelease: "nobody-films",
  detail: "nobody-films", interior: "nobody-films",
  whatidputonit: "what-id-put-on-it", glossgame: "what-id-put-on-it", theglossgame: "what-id-put-on-it",
  detailing: "what-id-put-on-it", paintcorrection: "what-id-put-on-it", ceramic: "what-id-put-on-it",
  theroom: "the-room", donutswithdupont: "the-room", tiresandtimepieces: "the-room",
  tirestimepieces: "the-room", carsandcoffee: "the-room", showroom: "the-room", event: "the-room",
}

const CHAPTERS = [
  {
    id: "nobody-films",
    label: "The stuff nobody films",
    tone: "#00D2BE",
    minmax: "min(190px,46%)",
    blurb: "Trunk releases, hood latches, cup holders, visors, where the charge port hides. The questions you only get to answer by standing next to the car.",
  },
  {
    id: "what-id-put-on-it",
    label: "What I'd put on it",
    tone: "#F2C94C",
    minmax: "min(300px,100%)",
    blurb: "Paint, by car. What goes on it, what stays off it, and what the light does afterwards.",
  },
  {
    id: "the-room",
    label: "The room",
    tone: "#4BA3DE",
    minmax: "min(360px,100%)",
    blurb: "Donuts with duPont, Tires & Timepieces, and whatever rolled onto the deck that morning. The floor is duPont REGISTRY\u2019s, in Lebanon, and I run the events on it.",
  },
]

const SEED: Record<string, string[]> = {
  "nobody-films": [
    "Where the trunk release hides", "993 cabin, carbon and terracotta", "Fire bottle, strapped in",
    "The latch, once you know", "Cup holders, all of them", "Charge port, driver side",
    "The switch nobody finds", "G-Wagen doors open at the barn",
  ],
  "what-id-put-on-it": [
    "Talbot Yellow, corrected", "Ferrari red in the warehouse", "The 993 in Guards Green",
    "Ceramic on a wrap: don\u2019t", "Swirls under the light",
  ],
  "the-room": [
    "Donuts with duPont, 8am", "Ferrari on the upper deck", "Off the transporter, 993",
    "Ford GT in the studio", "Tires & Timepieces", "The deck on a full morning",
    "Ferrari in the lot", "The ramp, rearview",
  ],
}

const SEED_IMAGES: Record<string, string[]> = {
  "nobody-films": [
    "/images/918-pipes.webp", "/images/g993-cabin-sq.webp", "/images/g993-fire-sq.webp",
    "/images/f458-dash.webp", "/images/f458-extinguisher.webp", "/images/aston-wheel.webp",
    "/images/downpipe.webp", "/images/gavin-gwagen-sq.webp",
  ],
  "what-id-put-on-it": [
    "/images/918-grey.webp", "/images/ferrari-red-sq.webp", "/images/g993-out-sq.webp",
    "/images/ferrari-296.webp", "/images/carrera-traffic.jpg",
  ],
  "the-room": [
    "/images/donuts-floor.webp", "/images/ferrari-upperdeck-sq.webp", "/images/g993-ramp-sq.webp",
    "/images/ford-gt-studio-sq.webp", "/images/donuts-inside.webp", "/images/cullinan-doors.webp",
    "/images/ferrari-red.webp", "/images/g993-out.webp",
  ],
}

function chapterFromCaption(caption: string): string {
  const tags = (caption || "").toLowerCase().replace(/\s/g, "").match(/#([a-z0-9]+)/g) || []
  for (const t of tags) {
    const key = t.replace("#", "")
    if (TAG_MAP[key]) return TAG_MAP[key]
  }
  return "the-room"
}

export default function GalleryPage() {
  const [items, setItems] = useState<WallItem[]>([])
  const [filter, setFilter] = useState("all")
  const [view, setView] = useState<"chapters" | "grid">("chapters")
  const [lb, setLb] = useState<LightboxState | null>(null)
  const [profile, setProfile] = useState<{ username?: string; followersCount?: number } | null>(null)
  const [loaded, setLoaded] = useState(false)
  const revealRef = useRef<HTMLDivElement>(null)

  const firstLine = (text: string) => {
    const line = String(text || "").split(/\r?\n/).find((l) => l.trim()) || ""
    const clean = line.replace(/#[\w]+/g, "").replace(/\s+/g, " ").trim()
    return clean.length > 78 ? clean.slice(0, 76).trim() + "\u2026" : clean
  }

  const loadFeed = useCallback(async () => {
    const all: WallItem[] = []
    let prof: typeof profile = null

    if (BEHOLD_FEEDS.length) {
      const results = await Promise.all(
        BEHOLD_FEEDS.map((id) =>
          fetch(`https://feeds.behold.so/${id}`)
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        )
      )
      results.forEach((data) => {
        if (!data) return
        const posts: BeholdPost[] = Array.isArray(data) ? data : data.posts || []
        if (data.profile && !prof) prof = data.profile
        posts.slice(0, 18).forEach((p) => {
          const sizes = p.sizes || {}
          const med = (sizes.medium || sizes.large || sizes.full || {}) as { mediaUrl?: string; width?: number; height?: number }
          const w = med.width || 1080
          const h = med.height || 1350
          const src = med.mediaUrl || p.thumbnailUrl || p.mediaUrl || ""
          const large = (sizes.full as { mediaUrl?: string } | undefined)?.mediaUrl || src
          const caption = firstLine(p.prunedCaption || p.caption || "")
          const chapter = chapterFromCaption(p.caption || "")
          const isVideo = (p.mediaType || "").toLowerCase().includes("video")
          const aspect = w >= h * 1.3 ? "16/9" : w >= h * 0.85 ? "1/1" : "4/5"
          all.push({
            key: "bh-" + p.id,
            src, large, caption, isVideo, chapter,
            permalink: p.permalink || "",
            aspect, span: "auto",
          })
        })
      })
      if (prof) setProfile(prof)
    }

    if (all.length === 0) {
      // Seed items from local images
      CHAPTERS.forEach((ch) => {
        const seeds = SEED[ch.id] || []
        const imgs = SEED_IMAGES[ch.id] || []
        seeds.forEach((caption, i) => {
          all.push({
            key: `seed-${ch.id}-${i}`,
            src: imgs[i] || "",
            large: imgs[i] || "",
            caption, isVideo: false,
            chapter: ch.id, permalink: "",
            aspect: i % 3 === 0 ? "16/9" : "1/1", span: "auto",
          })
        })
      })
    }

    setItems(all)
    setLoaded(true)
  }, [])

  useEffect(() => {
    loadFeed()
  }, [loadFeed])

  useEffect(() => {
    if (!lb) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLb(null)
      if (e.key === "ArrowRight") setLb((prev) => {
        if (!prev) return null
        const next = (prev.index + 1) % prev.pool.length
        const item = prev.pool[next]
        return { ...prev, index: next, src: item.src, caption: item.caption, isVideo: item.isVideo, videoSrc: item.videoSrc, permalink: item.permalink, position: `${next + 1} / ${prev.pool.length}` }
      })
      if (e.key === "ArrowLeft") setLb((prev) => {
        if (!prev) return null
        const next = (prev.index - 1 + prev.pool.length) % prev.pool.length
        const item = prev.pool[next]
        return { ...prev, index: next, src: item.src, caption: item.caption, isVideo: item.isVideo, videoSrc: item.videoSrc, permalink: item.permalink, position: `${next + 1} / ${prev.pool.length}` }
      })
    }
    document.addEventListener("keydown", onKey)
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.documentElement.style.overflow = ""
    }
  }, [lb])

  const openLightbox = (pool: WallItem[], index: number) => {
    const item = pool[index]
    setLb({
      pool, index,
      src: item.large || item.src, caption: item.caption,
      isVideo: item.isVideo, videoSrc: item.videoSrc,
      permalink: item.permalink,
      eyebrow: "Gallery",
      position: `${index + 1} / ${pool.length}`,
    })
  }

  const stepLb = (dir: 1 | -1) => {
    setLb((prev) => {
      if (!prev) return null
      const next = (prev.index + dir + prev.pool.length) % prev.pool.length
      const item = prev.pool[next]
      return { ...prev, index: next, src: item.large || item.src, caption: item.caption, isVideo: item.isVideo, videoSrc: item.videoSrc, permalink: item.permalink, position: `${next + 1} / ${prev.pool.length}` }
    })
  }

  const FILTERS = [
    { key: "all", label: "All" },
    { key: "nobody-films", label: "The stuff nobody films" },
    { key: "what-id-put-on-it", label: "What I'd put on it" },
    { key: "the-room", label: "The room" },
  ]

  const fmt = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K"
    return String(n)
  }

  const readouts = [
    { label: "Pillars", value: "3", tone: "#00D2BE" },
    { label: "Frames", value: loaded ? String(items.length) : "\u2014", tone: "#F2C94C" },
    { label: "Followers", value: profile?.followersCount ? fmt(profile.followersCount) : "@itspaddockgavin", tone: "#4BA3DE" },
  ]

  return (
    <>
      <SiteNav active="gallery" />

      {/* Fixed background */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", background: "#0A1523",
        }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.22 }}>
          <Image src="/images/donuts-inside.webp" alt="" fill style={{ objectFit: "cover" }} priority />
        </div>
        <div
          style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(1100px 720px at 84% -6%,rgba(0,210,190,.15),transparent 60%),radial-gradient(1000px 700px at 4% 30%,rgba(0,81,133,.40),transparent 62%),linear-gradient(180deg,rgba(10,21,35,.84),rgba(10,21,35,.95))",
          }}
        />
      </div>

      {/* Filter bar (fixed sub-bar) */}
      <div style={{ position: "fixed", top: 75, left: 0, right: 0, zIndex: 60, padding: "0 clamp(12px,4vw,40px)" }}>
        <div
          style={{
            maxWidth: 1240, margin: "0 auto", position: "relative",
            background: "linear-gradient(150deg,rgba(255,255,255,.075),rgba(255,255,255,.018))",
            backdropFilter: "blur(26px) saturate(170%)", WebkitBackdropFilter: "blur(26px) saturate(170%)",
            border: "1px solid rgba(255,255,255,.12)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.16)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)",
            padding: "9px clamp(12px,2vw,18px)", display: "flex", alignItems: "center", gap: 8, overflowX: "auto",
          }}
        >
          <span
            style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F", flex: "0 0 auto", paddingLeft: 4 }}
          >
            Pillar
          </span>
          {FILTERS.map((f) => {
            const count = f.key === "all" ? items.length : items.filter((i) => i.chapter === f.key).length
            const active = filter === f.key
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                style={{
                  flex: "0 0 auto", cursor: "pointer",
                  fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: ".12em", textTransform: "uppercase",
                  padding: "9px 15px",
                  border: `1px solid ${active ? "#F2C94C" : "rgba(255,255,255,.20)"}`,
                  background: active ? "rgba(242,201,76,.14)" : "rgba(255,255,255,.05)",
                  color: active ? "#F2C94C" : "#EDF1F6",
                  clipPath: "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)",
                  whiteSpace: "nowrap", transition: "border-color .16s,color .16s",
                }}
              >
                {f.label}{" "}
                <span style={{ opacity: 0.62, fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" }}>
                  {count}
                </span>
              </button>
            )
          })}
          <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 8 }} />
          <button
            type="button"
            onClick={() => setView(v => v === "chapters" ? "grid" : "chapters")}
            style={{
              flex: "0 0 auto", cursor: "pointer",
              fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: ".12em", textTransform: "uppercase",
              padding: "9px 15px",
              border: "1px solid rgba(255,255,255,.20)",
              background: "rgba(255,255,255,.05)",
              color: "#EDF1F6",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)",
              whiteSpace: "nowrap",
            }}
          >
            {view === "chapters" ? "Grid" : "Chapters"}
          </button>
        </div>
      </div>
      <div aria-hidden="true" style={{ height: 60 }} />

      <main
        style={{
          position: "relative", zIndex: 1, minWidth: 0, maxWidth: 1240, margin: "0 auto",
          padding: "clamp(16px,2.6vw,26px) clamp(12px,4vw,40px) clamp(40px,7vw,84px)",
          display: "flex", flexDirection: "column", gap: "clamp(20px,3.4vw,40px)",
        }}
      >
        {/* Header */}
        <header ref={revealRef} style={{ display: "flex", flexWrap: "wrap", gap: "clamp(14px,2.4vw,24px)", alignItems: "flex-end" }}>
          <div style={{ flex: "6 1 320px", minWidth: 0 }}>
            <span
              style={{ display: "inline-block", transform: "skewX(-12deg)", background: "#00D2BE", padding: "6px 16px", margin: "0 0 16px" }}
            >
              <span style={{ display: "inline-block", transform: "skewX(12deg)", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 12.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#00302B" }}>
                The gallery
              </span>
            </span>
            <h1
              style={{ margin: "0 0 16px", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 900, fontSize: "clamp(34px,6.4vw,72px)", lineHeight: 1, letterSpacing: "-.03em", textTransform: "uppercase", color: "#FFFFFF", textWrap: "pretty" as never }}
            >
              Shot between jobs,
              <br />
              <span style={{ color: "#F2C94C" }}>in whatever light was there</span>
            </h1>
            <p style={{ margin: 0, fontFamily: "Archivo,Helvetica,sans-serif", fontSize: "clamp(17px,1.7vw,19px)", lineHeight: 1.58, color: "#C4CBD6", maxWidth: "56ch" }}>
              Three pillars. The details nobody bothers to film, what I&rsquo;d put on the paint, and the room these cars pass through. Most of the metal belongs to duPont REGISTRY &mdash; I run their lot, so I&rsquo;m the one standing next to it.
            </p>
          </div>
          <div
            style={{
              flex: "3 1 220px", minWidth: 0,
              background: "linear-gradient(150deg,rgba(255,255,255,.065),rgba(255,255,255,.013))",
              backdropFilter: "blur(22px) saturate(155%)", WebkitBackdropFilter: "blur(22px) saturate(155%)",
              border: "1px solid rgba(255,255,255,.11)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.13)",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
              padding: "clamp(18px,2.4vw,24px)",
              display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(110px,45%),1fr))", gap: 14,
            }}
          >
            {readouts.map((r) => (
              <span key={r.label} style={{ display: "flex", flexDirection: "column", gap: 7, minWidth: 0 }}>
                <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#91918F" }}>{r.label}</span>
                <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 15, letterSpacing: ".08em", textTransform: "uppercase", color: r.tone, fontVariantNumeric: "tabular-nums" }}>{r.value}</span>
              </span>
            ))}
          </div>
        </header>

        {/* Flat grid view */}
        {view === "grid" && (() => {
          const gridItems = filter === "all" ? items : items.filter(i => i.chapter === filter)
          return (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(190px,46%),1fr))", gap: "clamp(10px,1.5vw,16px)", gridAutoFlow: "dense" }}>
              {gridItems.map((item, idx) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => openLightbox(gridItems, idx)}
                  style={{ position:"relative", display:"block", padding:0, border:"1px solid rgba(255,255,255,.11)", cursor:"pointer", background:"rgba(21,37,56,.5)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", boxShadow:"inset 0 1px 0 rgba(255,255,255,.13)", overflow:"hidden", width:"100%", textAlign:"left", aspectRatio:"1", clipPath:"polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)", transition:"border-color .2s" }}
                >
                  {item.src && <Image src={item.src} alt={item.caption} fill loading="lazy" sizes="(max-width:768px) 50vw,25vw" style={{ objectFit:"cover" }} />}
                  <span style={{ position:"absolute", left:0, right:0, bottom:0, padding:"28px 10px 9px", pointerEvents:"none", background:"linear-gradient(to top,rgba(10,21,35,.9) 0%,rgba(10,21,35,0))", display:"block" }}>
                    <span style={{ display:"block", fontFamily:"Archivo,Helvetica,sans-serif", fontWeight:600, fontSize:12, lineHeight:1.4, color:"#EDF1F6" }}>{item.caption}</span>
                  </span>
                </button>
              ))}
            </div>
          )
        })()}

        {/* Chapters view */}
        {view === "chapters" && CHAPTERS.map((ch, ci) => {
          const visibleItems = filter === "all"
            ? items.filter((i) => i.chapter === ch.id)
            : filter === ch.id ? items.filter((i) => i.chapter === ch.id) : []
          if (visibleItems.length === 0 && filter !== "all") return null
          const pool = visibleItems
          return (
            <section
              key={ch.id}
              id={ch.id}
              data-screen-label={ch.label}
              style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2.2vw,22px)", scrollMarginTop: 150 }}
            >
              <div
                style={{ display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,.14)", paddingBottom: 14 }}
              >
                <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 13, letterSpacing: ".14em", color: ch.tone, flex: "0 0 auto", fontVariantNumeric: "tabular-nums" }}>
                  {String(ci + 1).padStart(2, "0")}
                </span>
                <h2
                  style={{ margin: 0, fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 900, fontSize: "clamp(24px,3.4vw,40px)", lineHeight: 1.02, letterSpacing: "-.024em", textTransform: "uppercase", color: "#FFFFFF", flex: "0 1 auto" }}
                >
                  {ch.label}
                </h2>
                <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 16, height: 0, borderBottom: "1px dotted rgba(255,255,255,.2)", transform: "translateY(-6px)" }} />
                <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "#91918F", flex: "0 0 auto" }}>
                  {pool.length} frames
                </span>
              </div>
              <p style={{ margin: 0, fontFamily: "Archivo,Helvetica,sans-serif", fontSize: 17, lineHeight: 1.58, color: "#C4CBD6", maxWidth: "62ch" }}>
                {ch.blurb}
              </p>
              <div
                style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(${ch.minmax},1fr))`, gap: "clamp(10px,1.5vw,16px)", gridAutoFlow: "dense" }}
              >
                {pool.map((item, idx) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => openLightbox(pool, idx)}
                    style={{
                      position: "relative", display: "block", padding: 0,
                      border: "1px solid rgba(255,255,255,.11)", cursor: "pointer",
                      background: "rgba(21,37,56,.5)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,.13)", overflow: "hidden", width: "100%", textAlign: "left",
                      aspectRatio: item.aspect,
                      clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)",
                      transition: "border-color .2s",
                    }}
                  >
                    {item.src && (
                      <Image
                        src={item.src}
                        alt={item.caption}
                        fill
                        loading="lazy"
                        sizes="(max-width:768px) 50vw,33vw"
                        style={{ objectFit: "cover", display: "block" }}
                      />
                    )}
                    <span
                      style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "38px 12px 11px", pointerEvents: "none", background: "linear-gradient(to top,rgba(10,21,35,.95) 8%,rgba(10,21,35,0))", display: "block" }}
                    >
                      <span style={{ display: "block", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 600, fontSize: 13.5, lineHeight: 1.42, color: "#EDF1F6", textWrap: "pretty" as never }}>
                        {item.caption}
                      </span>
                    </span>
                    {item.isVideo && (
                      <span
                        aria-hidden="true"
                        style={{ position: "absolute", right: 10, top: 10, width: 24, height: 24, border: "1.5px solid rgba(255,255,255,.82)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,21,35,.3)" }}
                      >
                        <i style={{ width: 0, height: 0, borderLeft: "7px solid #FFFFFF", borderTop: "4.5px solid transparent", borderBottom: "4.5px solid transparent", marginLeft: 2 }} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )
        })}

        {/* IG CTA */}
        <section
          style={{
            display: "flex", flexWrap: "wrap", gap: "clamp(14px,2.4vw,22px)", alignItems: "center",
            background: "linear-gradient(150deg,rgba(255,255,255,.065),rgba(255,255,255,.013))",
            backdropFilter: "blur(22px) saturate(155%)", WebkitBackdropFilter: "blur(22px) saturate(155%)",
            border: "1px solid rgba(255,255,255,.11)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.13)",
            clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
            padding: "clamp(22px,3.2vw,34px)",
          }}
        >
          <div style={{ flex: "1 1 300px", minWidth: 0 }}>
            <h2 style={{ margin: "0 0 12px", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 900, fontSize: "clamp(24px,3.2vw,36px)", lineHeight: 1.02, letterSpacing: "-.022em", textTransform: "uppercase", color: "#FFFFFF" }}>
              New frames land on Instagram first
            </h2>
            <p style={{ margin: 0, fontFamily: "Archivo,Helvetica,sans-serif", fontSize: 17, lineHeight: 1.58, color: "#C4CBD6", maxWidth: "52ch" }}>
              This page pulls from the feed, so it fills itself in. Come find the ones that never made it here.
            </p>
          </div>
          <div style={{ flex: "0 0 auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href="https://instagram.com/itspaddockgavin"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", background: "#00D2BE", color: "#00302B", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)" }}
            >
              Follow on Instagram
            </a>
            <a
              href="/connect"
              style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.28)", padding: "15px 26px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", transition: "border-color .18s" }}
            >
              Every link
            </a>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {lb && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,21,35,.93)", backdropFilter: "blur(26px) saturate(140%)", WebkitBackdropFilter: "blur(26px) saturate(140%)", display: "flex", flexDirection: "column", padding: "clamp(12px,3vw,32px)", gap: 12 }}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", flex: "0 0 auto" }}>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#00D2BE" }}>{lb.eyebrow}</span>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".14em", color: "#91918F", fontVariantNumeric: "tabular-nums" }}>{lb.position}</span>
            <i aria-hidden="true" style={{ flex: "1 1 auto", minWidth: 12, height: 1, background: "rgba(255,255,255,.16)" }} />
            <button type="button" onClick={() => stepLb(-1)} aria-label="Previous" style={{ cursor: "pointer", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.24)", color: "#EDF1F6", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 14, width: 44, height: 38, display: "flex", alignItems: "center", justifyContent: "center", clipPath: "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)" }}>&larr;</button>
            <button type="button" onClick={() => stepLb(1)} aria-label="Next" style={{ cursor: "pointer", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.24)", color: "#EDF1F6", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 14, width: 44, height: 38, display: "flex", alignItems: "center", justifyContent: "center", clipPath: "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)" }}>&rarr;</button>
            <button type="button" onClick={() => setLb(null)} aria-label="Close" style={{ cursor: "pointer", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.24)", color: "#EDF1F6", fontSize: 20, lineHeight: 1, width: 44, height: 38, display: "flex", alignItems: "center", justifyContent: "center", clipPath: "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)" }}>&times;</button>
          </div>
          {/* Media */}
          <div style={{ flex: "1 1 auto", minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            {lb.isVideo && lb.videoSrc ? (
              <video src={lb.videoSrc} poster={lb.src} controls autoPlay playsInline style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block", background: "#0A1523" }} />
            ) : lb.src ? (
              <Image src={lb.src} alt={lb.caption} fill sizes="100vw" style={{ objectFit: "contain" }} />
            ) : null}
          </div>
          {/* Caption row */}
          <div style={{ flex: "0 0 auto", display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            <span style={{ flex: "1 1 240px", minWidth: 0, fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 600, fontSize: 16, lineHeight: 1.45, color: "#EDF1F6" }}>{lb.caption}</span>
            {lb.permalink && (
              <a
                href={lb.permalink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center", fontFamily: "Archivo,Helvetica,sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".1em", textTransform: "uppercase", color: "#00302B", background: "#00D2BE", padding: "12px 20px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)" }}
              >
                Open on Instagram
              </a>
            )}
          </div>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        <SiteFooter />
      </div>
    </>
  )
}
