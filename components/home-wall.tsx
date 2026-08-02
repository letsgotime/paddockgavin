"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

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
  wide: boolean
}

interface LightboxState {
  pool: WallItem[]
  index: number
  src: string
  caption: string
  isVideo: boolean
  videoSrc?: string
  permalink: string
  position: string
}

const BEHOLD_FEEDS = [
  process.env.NEXT_PUBLIC_BEHOLD_FEED_1 ?? "",
  process.env.NEXT_PUBLIC_BEHOLD_FEED_2 ?? "",
  process.env.NEXT_PUBLIC_BEHOLD_FEED_3 ?? "",
].filter(Boolean)

const SEED_CAPTIONS = [
  "918 Spyder center-exit titanium pipes on the duPont Registry lot",
  "Widebody Cullinan on air, suicide doors open at the show",
  "997 Carrera catching the light on Franklin Rd",
  "Downpipe off, hunting for the cats",
  "918 and P1 nose to nose on the duPont lot",
  "918 Spyder with the Weissach red accents, tucked in the garage",
]

const SEED_IMAGES = [
  "/images/918-pipes.webp",
  "/images/cullinan-doors.webp",
  "/images/carrera-traffic.jpg",
  "/images/downpipe.webp",
  "/images/918-p1.webp",
  "/images/918-grey.webp",
]

export function HomeWall() {
  const [items, setItems]     = useState<WallItem[]>([])
  const [lb, setLb]           = useState<LightboxState | null>(null)
  const [profile, setProfile] = useState<{ username?: string; followersCount?: number } | null>(null)
  const [loaded, setLoaded]   = useState(false)
  const revealRef             = useRef<HTMLDivElement>(null)

  const firstLine = (text: string) => {
    const line = String(text || "").split(/\r?\n/).find((l) => l.trim()) || ""
    const clean = line.replace(/#[\w]+/g, "").replace(/\s+/g, " ").trim()
    return clean.length > 78 ? clean.slice(0, 76).trim() + "\u2026" : clean
  }

  useEffect(() => {
    const load = async () => {
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
          posts.slice(0, 12).forEach((p) => {
            const sizes = p.sizes || {}
            const med = sizes.medium || sizes.large || sizes.full || {}
            const w = (med as { width?: number }).width || 1080
            const h = (med as { height?: number }).height || 1350
            all.push({
              key: "bh-" + p.id,
              src: (med as { mediaUrl?: string }).mediaUrl || p.thumbnailUrl || p.mediaUrl || "",
              large: ((sizes.large || sizes.full || med) as { mediaUrl?: string }).mediaUrl || p.mediaUrl || "",
              caption: firstLine(p.prunedCaption || p.caption || ""),
              isVideo: p.mediaType === "VIDEO",
              videoSrc: p.mediaType === "VIDEO" ? p.mediaUrl : undefined,
              permalink: p.permalink || "",
              wide: w > h,
            })
          })
        })
        if (prof) setProfile(prof)
      }

      // Fill with seed images if Behold is empty or not configured
      if (all.length < 4) {
        SEED_IMAGES.forEach((src, i) => {
          all.push({
            key: `seed-${i}`,
            src,
            large: src,
            caption: SEED_CAPTIONS[i] || "",
            isVideo: false,
            permalink: "",
            wide: i % 3 === 0,
          })
        })
      }

      setItems(all)
      setLoaded(true)
    }
    load()
  }, [])

  // Scroll-reveal
  useEffect(() => {
    if (!loaded) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("pg-revealed")
        })
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.03 }
    )
    revealRef.current?.querySelectorAll("[data-reveal]").forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [loaded])

  // Keyboard nav in lightbox
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lb) return
      if (e.key === "Escape") setLb(null)
      if (e.key === "ArrowRight") stepLb(1)
      if (e.key === "ArrowLeft") stepLb(-1)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  })

  const open = (pool: WallItem[], index: number) => {
    const it = pool[index]
    setLb({
      pool, index,
      src: it.isVideo ? "" : (it.large || it.src || ""),
      caption: it.caption || "From the wall",
      isVideo: it.isVideo,
      videoSrc: it.videoSrc,
      permalink: it.permalink,
      position: `${index + 1} / ${pool.length}`,
    })
  }

  const stepLb = (dir: number) => {
    if (!lb) return
    const next = (lb.index + dir + lb.pool.length) % lb.pool.length
    open(lb.pool, next)
  }

  const feature = items[0]
  const grid    = items.slice(1)

  const readouts = [
    { label: "Frames",  value: String(items.length), tone: "#00D2BE" },
    { label: "Shot on", value: "A phone",             tone: "#F8B800" },
    ...(profile?.followersCount
      ? [{ label: `@${profile.username || "itspaddockgavin"}`, value: profile.followersCount >= 1000 ? (profile.followersCount / 1000).toFixed(1).replace(/\.0$/, "") + "K" : String(profile.followersCount), tone: "#B4B6B2" }]
      : [{ label: "Location", value: "Nashville TN", tone: "#B4B6B2" }]),
  ]

  return (
    <>
      <style>{`
        @keyframes pgIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        [data-reveal]{opacity:0}
        [data-reveal].pg-revealed{animation:pgIn .7s cubic-bezier(.16,1,.3,1) forwards}
      `}</style>

      <section
        data-screen-label="The wall"
        id="wall"
        ref={revealRef}
        style={{
          maxWidth: 1180,
          width: "100%",
          margin: "0 auto",
          padding: "0 clamp(16px,5vw,48px)",
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(48px,7vw,96px)",
          scrollMarginTop: 140,
        }}
      >
        {/* Feature panel */}
        {feature && (
          <div
            data-reveal
            style={{
              flex: "5 1 300px",
              minWidth: 0,
              position: "relative",
              background: "linear-gradient(150deg,rgba(255,255,255,.07),rgba(255,255,255,.015))",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              border: "1px solid rgba(255,255,255,.12)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => open(items, 0)}
              style={{
                position: "relative",
                display: "block",
                width: "100%",
                padding: 0,
                border: 0,
                background: "transparent",
                cursor: "pointer",
                aspectRatio: "9/16",
                maxHeight: "74vh",
                overflow: "hidden",
              }}
            >
              {feature.src && (
                <Image
                  src={feature.src}
                  alt={feature.caption}
                  fill
                  style={{ objectFit: "cover" }}
                />
              )}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top,rgba(10,21,35,.95) 4%,rgba(10,21,35,.10) 48%,rgba(10,21,35,.44))",
                }}
              />
              {feature.isVideo && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "42%",
                    transform: "translate(-50%,-50%)",
                    width: 72,
                    height: 72,
                    border: "2px solid rgba(255,255,255,.82)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(10,21,35,.26)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                  }}
                >
                  <i
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "19px solid #FFFFFF",
                      borderTop: "12px solid transparent",
                      borderBottom: "12px solid transparent",
                      marginLeft: 6,
                    }}
                  />
                </span>
              )}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "clamp(18px,3vw,26px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                    fontSize: 12,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "#00D2BE",
                  }}
                >
                  Latest
                </span>
                <span
                  style={{
                    fontFamily: "Archivo, Helvetica, sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(24px,3.4vw,38px)",
                    lineHeight: 1.02,
                    letterSpacing: "-.02em",
                    textTransform: "uppercase",
                    color: "#FFFFFF",
                    textWrap: "pretty" as never,
                  }}
                >
                  {feature.caption}
                </span>
              </span>
            </button>
          </div>
        )}

        {/* Right column */}
        <div
          style={{
            flex: "4 1 280px",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "clamp(32px,5vw,56px)",
          }}
        >
          {/* Story card */}
          <div
            data-reveal
            style={{
              background: "linear-gradient(150deg,rgba(255,255,255,.07),rgba(255,255,255,.015))",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              border: "1px solid rgba(255,255,255,.12)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
              padding: "clamp(20px,3vw,32px)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: "skewX(-12deg)",
                background: "#00D2BE",
                padding: "6px 16px",
                alignSelf: "flex-start",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  transform: "skewX(12deg)",
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 12.5,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#00302B",
                }}
              >
                Paddock life
              </span>
            </span>
            <h2
              style={{
                margin: 0,
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(30px,4.6vw,52px)",
                lineHeight: 1.02,
                letterSpacing: "-.025em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                textWrap: "pretty" as never,
              }}
            >
              Cars were the reward.{" "}
              <span style={{ color: "#F8B800" }}>Now they&apos;re the work.</span>
            </h2>
            <p
              style={{
                margin: 0,
                fontFamily: "Archivo, Helvetica, sans-serif",
                fontSize: "clamp(16px,1.5vw,18px)",
                lineHeight: 1.58,
                color: "#C4CBD6",
              }}
            >
              Filmed on the lot in Lebanon and in my own garage. Sound off, captions on.
            </p>
          </div>

          {/* Readouts strip */}
          <div
            data-reveal
            style={{
              background: "linear-gradient(150deg,rgba(255,255,255,.055),rgba(255,255,255,.012))",
              backdropFilter: "blur(20px) saturate(150%)",
              WebkitBackdropFilter: "blur(20px) saturate(150%)",
              border: "1px solid rgba(255,255,255,.10)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.12)",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)",
              padding: "clamp(16px,2.4vw,22px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(120px,45%),1fr))",
              gap: 14,
            }}
          >
            {readouts.map((r) => (
              <span key={r.label} style={{ display: "flex", flexDirection: "column", gap: 7, minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                    fontSize: 12,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "#91918F",
                  }}
                >
                  {r.label}
                </span>
                <span
                  style={{
                    fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                    fontSize: 15,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: r.tone,
                    fontVariantNumeric: "tabular-nums",
                    overflowWrap: "anywhere",
                  }}
                >
                  {r.value}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            flex: "1 1 100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(min(200px,46%),1fr))",
            gap: "clamp(12px,1.8vw,18px)",
          }}
        >
          {grid.slice(0, 8).map((c, j) => (
            <button
              key={c.key}
              type="button"
              data-reveal
              onClick={() => open(items, j + 1)}
              style={{
                position: "relative",
                display: "block",
                padding: 0,
                border: "1px solid rgba(255,255,255,.11)",
                cursor: "pointer",
                background: "rgba(21,37,56,.5)",
                backdropFilter: "blur(18px) saturate(150%)",
                WebkitBackdropFilter: "blur(18px) saturate(150%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,.13)",
                overflow: "hidden",
                width: "100%",
                textAlign: "left",
                aspectRatio: c.wide ? "3/2" : "4/5",
                gridColumn: c.wide ? "span 2" : "auto",
                clipPath: "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)",
              }}
            >
              {c.src && (
                <Image
                  src={c.src}
                  alt={c.caption}
                  fill
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
              )}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "40px 13px 12px",
                  pointerEvents: "none",
                  background:
                    "linear-gradient(to top,rgba(10,21,35,.96) 10%,rgba(10,21,35,0))",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <span
                  style={{
                    fontFamily: "Archivo, Helvetica, sans-serif",
                    fontWeight: 700,
                    fontSize: 14.5,
                    lineHeight: 1.3,
                    color: "#FFFFFF",
                    textWrap: "pretty" as never,
                  }}
                >
                  {c.caption}
                </span>
              </span>
              {c.isVideo && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: 11,
                    top: 11,
                    width: 26,
                    height: 26,
                    border: "1.5px solid rgba(255,255,255,.8)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(10,21,35,.3)",
                    backdropFilter: "blur(5px)",
                    WebkitBackdropFilter: "blur(5px)",
                  }}
                >
                  <i
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "8px solid #FFFFFF",
                      borderTop: "5px solid transparent",
                      borderBottom: "5px solid transparent",
                      marginLeft: 2,
                    }}
                  />
                </span>
              )}
            </button>
          ))}
        </div>

        {/* CTA row */}
        <div style={{ flex: "1 1 100%", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            href="https://instagram.com/itspaddockgavin"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: ".04em",
              textTransform: "uppercase",
              background: "#00D2BE",
              color: "#00302B",
              padding: "15px 26px",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
              textDecoration: "none",
            }}
          >
            Follow @itspaddockgavin
          </a>
          <a
            href="/gallery"
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontFamily: "Archivo, Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: ".04em",
              textTransform: "uppercase",
              color: "#EDF1F6",
              border: "1px solid rgba(255,255,255,.28)",
              padding: "15px 26px",
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)",
              textDecoration: "none",
              transition: "border-color .18s",
            }}
          >
            Full gallery
          </a>
        </div>
      </section>

      {/* Lightbox */}
      {lb && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
          onClick={() => setLb(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(10,21,35,.96)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLb(null) }}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 44,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.2)",
              color: "#EDF1F6",
              fontSize: 22,
              clipPath: "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)",
            }}
          >
            &times;
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); stepLb(-1) }}
            aria-label="Previous"
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              background: "rgba(255,255,255,.08)",
              border: "1px solid rgba(255,255,255,.2)",
              color: "#EDF1F6",
              fontSize: 20,
            }}
          >
            ‹
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 900, width: "100%", display: "flex", flexDirection: "column", gap: 14 }}
          >
            {lb.isVideo && lb.videoSrc ? (
              <video
                src={lb.videoSrc}
                controls
                autoPlay
                style={{ width: "100%", maxHeight: "70vh", background: "#000" }}
              />
            ) : lb.src ? (
              <div style={{ position: "relative", maxHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lb.src}
                  alt={lb.caption}
                  style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain", display: "block" }}
                />
              </div>
            ) : null}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span
                style={{
                  flex: 1,
                  fontFamily: "Archivo, Helvetica, sans-serif",
                  fontSize: 15,
                  color: "#C4CBD6",
                  lineHeight: 1.55,
                }}
              >
                {lb.caption}
              </span>
              <span
                style={{
                  fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                  fontSize: 12,
                  letterSpacing: ".14em",
                  color: "#91918F",
                  whiteSpace: "nowrap",
                }}
              >
                {lb.position}
              </span>
              {lb.permalink && (
                <a
                  href={lb.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
                    fontSize: 12,
                    letterSpacing: ".14em",
                    color: "#00D2BE",
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                  }}
                >
                  View on Instagram
                </a>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); stepLb(1) }}
            aria-label="Next"
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              background: "rgba(255,255,255,.08)",
              border: "1px solid rgba(255,255,255,.2)",
              color: "#EDF1F6",
              fontSize: 20,
            }}
          >
            ›
          </button>
        </div>
      )}
    </>
  )
}
