"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface BeholdPost {
  id: string
  sizes?: { medium?: { mediaUrl?: string; width?: number; height?: number }; large?: { mediaUrl?: string }; full?: { mediaUrl?: string } }
  thumbnailUrl?: string
  mediaUrl?: string
  mediaType?: string
  prunedCaption?: string
  caption?: string
  permalink?: string
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

interface LightboxState { index: number }

const BEHOLD_FEEDS = [
  process.env.NEXT_PUBLIC_BEHOLD_FEED_1 ?? "",
  process.env.NEXT_PUBLIC_BEHOLD_FEED_2 ?? "",
  process.env.NEXT_PUBLIC_BEHOLD_FEED_3 ?? "",
].filter(Boolean)

/* Rendered on the server, so the section is there in the first frame. The
   Behold feed replaces them once it answers, if it answers. */
const SEED: WallItem[] = [
  { key: "seed-0", src: "/images/918-pipes.webp",     large: "/images/918-pipes.webp",     caption: "Holy Trinity storage", isVideo: false, permalink: "", wide: true },
  { key: "seed-1", src: "/images/cullinan-doors.webp", large: "/images/cullinan-doors.webp", caption: "Black Badge Mansory Cullinan out of the warehouse at a local cars and coffee", isVideo: false, permalink: "", wide: false },
  { key: "seed-2", src: "/images/carrera-traffic.jpg", large: "/images/carrera-traffic.jpg", caption: "964 Carrera RS, E36 M3 Lightweight, 1 of 1 Dodge Viper on their way back to the warehouse", isVideo: false, permalink: "", wide: false },
  { key: "seed-3", src: "/images/downpipe.webp",      large: "/images/downpipe.webp",      caption: "992 GT3 Catback Exhaust inspection, looking for cats lol", isVideo: false, permalink: "", wide: true },
  { key: "seed-4", src: "/images/918-p1.webp",        large: "/images/918-p1.webp",        caption: "Holy Trinity Charging Center", isVideo: false, permalink: "", wide: false },
]

const ARCHIVO = "Archivo, Helvetica, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

export function HomeWall() {
  const [items, setItems] = useState<WallItem[]>(SEED)
  const [lb, setLb] = useState<LightboxState | null>(null)

  const firstLine = (text: string) => {
    const line = String(text || "").split(/\r?\n/).find((l) => l.trim()) || ""
    const clean = line.replace(/#[\w]+/g, "").replace(/\s+/g, " ").trim()
    return clean.length > 78 ? clean.slice(0, 76).trim() + "…" : clean
  }

  useEffect(() => {
    if (!BEHOLD_FEEDS.length) return
    let alive = true
    Promise.all(
      BEHOLD_FEEDS.map((id) => fetch(`https://feeds.behold.so/${id}`).then((r) => (r.ok ? r.json() : null)).catch(() => null))
    ).then((results) => {
      const all: WallItem[] = []
      results.forEach((data) => {
        if (!data) return
        const posts: BeholdPost[] = Array.isArray(data) ? data : data.posts || []
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
      if (alive && all.length >= 4) setItems(all)
    })
    return () => { alive = false }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lb) return
      if (e.key === "Escape") setLb(null)
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  })

  const step = (dir: number) => { if (lb) setLb({ index: (lb.index + dir + items.length) % items.length }) }
  const current = lb ? items[lb.index] : null
  const feature = items[0]
  const grid = items.slice(1, 5)

  return (
    <>
      <section id="wall" data-screen-label="Latest" style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)", scrollMarginTop: 90 }}>
        <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".22em", textTransform: "uppercase", color: "#00D2BE" }}>
          <i aria-hidden="true" style={{ width: 22, height: 2, background: "#00D2BE", flex: "0 0 auto" }} />
          Latest
        </p>
        <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", maxWidth: "18ch", textWrap: "balance" as never }}>
          Filmed on the lot in Lebanon and in my own garage
        </h2>
        <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6" }}>Sound off, captions on.</p>

        <div className="pg-wall">
          {feature && (
            <button type="button" onClick={() => setLb({ index: 0 })} className="pg-e1 pg-wall-feature" style={{ padding: 0, cursor: "pointer", overflow: "hidden", textAlign: "left", clipPath: "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)" }}>
              {feature.src && <Image src={feature.src} alt={feature.caption} fill sizes="(max-width: 800px) 100vw, 50vw" style={{ objectFit: "cover" }} />}
              <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,21,35,.92) 4%,rgba(10,21,35,.08) 50%)" }} />
              <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "clamp(16px,2.6vw,24px)", fontFamily: ARCHIVO, fontWeight: 700, fontSize: "var(--t-h3)", lineHeight: 1.15, letterSpacing: "-.015em", color: "#FFFFFF", textWrap: "pretty" as never }}>
                {feature.caption}
              </span>
            </button>
          )}
          {grid.map((c, j) => (
            <button key={c.key} type="button" onClick={() => setLb({ index: j + 1 })} className="pg-e0 pg-wall-tile" style={{ padding: 0, cursor: "pointer", overflow: "hidden", textAlign: "left", clipPath: "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)" }}>
              {c.src && <Image src={c.src} alt={c.caption} fill loading="lazy" sizes="(max-width: 800px) 50vw, 25vw" style={{ objectFit: "cover" }} />}
              <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "34px 12px 11px", pointerEvents: "none", background: "linear-gradient(to top,rgba(10,21,35,.94) 10%,rgba(10,21,35,0))", fontFamily: ARCHIVO, fontWeight: 600, fontSize: 13, lineHeight: 1.35, color: "#FFFFFF" }}>
                {c.caption}
              </span>
              {c.isVideo && <span aria-hidden="true" style={{ position: "absolute", right: 10, top: 10, width: 24, height: 24, border: "1.5px solid rgba(255,255,255,.8)", borderRadius: "50%" }} />}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 22px", paddingTop: 4 }}>
          <a href="https://instagram.com/itspaddockgavin" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#00D2BE", color: "#00302B", padding: "15px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)", textDecoration: "none" }}>
            Follow @itspaddockgavin
          </a>
          <Link href="/gallery" className="pg-textlink">Full gallery</Link>
        </div>
      </section>

      {current && (
        <div role="dialog" aria-modal="true" aria-label="Photo" onClick={() => setLb(null)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,21,35,.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <button type="button" onClick={(e) => { e.stopPropagation(); setLb(null) }} aria-label="Close" className="pg-e0" style={{ position: "absolute", top: 20, right: 20, width: 44, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#EDF1F6", fontSize: 22 }}>&times;</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(-1) }} aria-label="Previous" className="pg-e0" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#EDF1F6", fontSize: 20 }}>&lsaquo;</button>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 900, width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
            {current.isVideo && current.videoSrc ? (
              <video src={current.videoSrc} controls autoPlay style={{ width: "100%", maxHeight: "70vh", background: "#000" }} />
            ) : current.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={current.large || current.src} alt={current.caption} style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain", display: "block", margin: "0 auto" }} />
            ) : null}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ flex: 1, fontFamily: ARCHIVO, fontSize: 15, color: "#C4CBD6", lineHeight: 1.55 }}>{current.caption}</span>
              <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".14em", color: "#91918F", whiteSpace: "nowrap" }}>{lb!.index + 1} / {items.length}</span>
              {current.permalink && <a href={current.permalink} target="_blank" rel="noopener noreferrer" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".14em", color: "#00D2BE", whiteSpace: "nowrap", textDecoration: "none" }}>View on Instagram</a>}
            </div>
          </div>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(1) }} aria-label="Next" className="pg-e0" style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#EDF1F6", fontSize: 20 }}>&rsaquo;</button>
        </div>
      )}
    </>
  )
}
