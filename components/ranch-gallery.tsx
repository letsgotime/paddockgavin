"use client"

import Image from "next/image"
import { useState } from "react"

/**
 * The place, before the cars arrive.
 *
 * This is what the reel grid was reaching for and could not have: there is one
 * clip in hand and it is already on the page as the teaser, so a three up
 * video wall would have been one film and two holes. There are, however, one
 * hundred and eighty six photographs from the shoot, and nine of them carry
 * the ranch better than any stock frame of a car show could.
 *
 * Shapes are kept as photographed, four by five where the frame is upright and
 * three by two where it is not, because a grid that crops everything to one
 * ratio stops looking photographed and starts looking processed.
 */

const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

type Frame = { src: string; alt: string; wide?: boolean }

const FRAMES: Frame[] = [
  { src: "/images/ranch/g-gate.webp", alt: "The Rancho Jaramillo gate against an afternoon sky" },
  { src: "/images/ranch/g-cattle.webp", alt: "Angus grazing the pasture the field is set on" },
  { src: "/images/ranch/g-drive.webp", alt: "The white rail and the drive curving past the grain bins", wide: true },
  { src: "/images/ranch/g-horse.webp", alt: "A horse looking out over the stall boards" },
  { src: "/images/ranch/g-bales.webp", alt: "Round bales running to the treeline in the morning haze" },
  { src: "/images/ranch/g-barn.webp", alt: "The open bay of the barn looking out to open ground" },
  { src: "/images/ranch/g-chestnut.webp", alt: "A chestnut horse over a weathered board fence" },
  { src: "/images/ranch/g-shadows.webp", alt: "Long fence shadows across the grass in the late sun" },
  { src: "/images/ranch/g-coop.webp", alt: "The birds working the yard beside the coop" },
]

export function RanchGallery({ accent = "#F2C94C" }: { accent?: string }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      id="place"
      style={{ position: "relative", padding: "clamp(52px,9vh,110px) clamp(16px,5vw,40px)" }}
    >
      <style>{`
        .rgGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:1120px;margin:26px auto 0}
        .rgGrid figure{margin:0;position:relative;overflow:hidden;border-radius:14px;
          background:rgba(255,255,255,.04);aspect-ratio:4/5;cursor:zoom-in}
        .rgGrid figure.wide{grid-column:span 2;aspect-ratio:3/2}
        .rgGrid img{transition:transform .6s cubic-bezier(.16,.84,.32,1)}
        .rgGrid figure:hover img{transform:scale(1.04)}
        @media (max-width:820px){
          .rgGrid{grid-template-columns:repeat(2,1fr)}
          .rgGrid figure.wide{grid-column:span 2}
        }
        @media (max-width:460px){
          .rgGrid{grid-template-columns:1fr}
          .rgGrid figure.wide{grid-column:span 1}
        }
        @media (prefers-reduced-motion:reduce){.rgGrid img{transition:none}
          .rgGrid figure:hover img{transform:none}}
        .rgLb{position:fixed;inset:0;z-index:120;background:rgba(4,7,11,.94);
          display:flex;align-items:center;justify-content:center;padding:20px;cursor:zoom-out;
          backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
      `}</style>

      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".2em",
          textTransform: "uppercase", color: accent, fontWeight: 600 }}>
          Four hundred and eight acres
        </div>
        <h2 style={{ margin: "10px 0 0", font: `900 clamp(28px,5vw,44px)/1.03 ${ARCHIVO}`,
          letterSpacing: "-.032em", color: "#fff", textWrap: "balance" }}>
          The ranch, before the field is set
        </h2>
        <p style={{ margin: "13px 0 0", fontSize: 16.5, lineHeight: 1.55, color: "#a9b4c2",
          maxWidth: "58ch" }}>
          It is a working cattle ranch every other day of the year. The gate, the rail, the bins and
          the herd are all still there on the tenth of October, and the three hundred cars park
          among them rather than on top of them.
        </p>
      </div>

      <div className="rgGrid">
        {FRAMES.map((f, i) => (
          <figure key={f.src} className={f.wide ? "wide" : undefined} onClick={() => setOpen(i)}>
            <Image
              src={f.src}
              alt={f.alt}
              fill
              loading="lazy"
              sizes="(max-width:460px) 92vw, (max-width:820px) 46vw, 360px"
              style={{ objectFit: "cover" }}
            />
          </figure>
        ))}
      </div>

      {open !== null ? (
        <div className="rgLb" onClick={() => setOpen(null)} role="dialog" aria-label="Photograph">
          <div style={{ position: "relative", width: "min(1100px,94vw)", height: "min(88vh,1200px)" }}>
            <Image
              src={FRAMES[open].src}
              alt={FRAMES[open].alt}
              fill
              sizes="94vw"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      ) : null}
    </section>
  )
}
