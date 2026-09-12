import Image from "next/image"

/* Shared building blocks for The Paddock Files entries. Extracted from the
   first entry (the 812 Competizione) once a second entry made the pattern
   real rather than speculative. Any entry-specific styling stays in that
   entry's own page.tsx; this file only holds what both share. */

export const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
export const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
export const NOTCH = "polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)"

/** Breaks a section out to the full viewport width from inside a max-width
 *  container. `overflow-x: clip` is set globally (app/globals.css:102), so
 *  this cannot introduce horizontal scroll. */
export function FullBleed({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)", ...style }}>
      {children}
    </div>
  )
}

export function Eyebrow({ children, tone = "#F2C94C", dark }: { children: React.ReactNode; tone?: string; dark?: boolean }) {
  return (
    <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".22em", textTransform: "uppercase", color: dark ? "#EDF1F6" : "#9AA4B2" }}>
      <i aria-hidden="true" style={{ width: 24, height: 2, background: tone, flex: "0 0 auto" }} />
      {children}
    </p>
  )
}

/** A framed photo, glass-tray edged, for the narrow reading column. */
export function Frame({ img, dir, alt, ratio, priority, objectPosition }: { img: string; dir: string; alt: string; ratio: string; priority?: boolean; objectPosition?: string }) {
  return (
    <div className="pg-e0" style={{ position: "relative", aspectRatio: ratio, overflow: "hidden", clipPath: NOTCH }}>
      <Image src={`/images/features/${dir}/${img}.webp`} alt={alt} fill priority={priority} sizes="(max-width: 900px) 100vw, 1080px" style={{ objectFit: "cover", objectPosition: objectPosition || "center" }} />
    </div>
  )
}

export function PullQuote({ children, tone = "#F2C94C" }: { children: React.ReactNode; tone?: string }) {
  return (
    <div className="pg-e1" style={{ clipPath: NOTCH, padding: "clamp(24px,4vw,44px) clamp(22px,4.4vw,52px)", borderLeft: `3px solid ${tone}` }}>
      <p style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "clamp(22px,3.6vw,36px)", lineHeight: 1.16, letterSpacing: "-.02em", color: "#FFFFFF", textWrap: "balance" as never }}>
        {children}
      </p>
    </div>
  )
}

export type DetailBlock = {
  tone: string
  eyebrow: string
  h: string
  body: string
  img: string
  alt: string
  caption: string
  flip: boolean
}

/** One full-bleed image/text spread, alternating sides by `d.flip`. */
export function DetailSpread({ d, dir }: { d: DetailBlock; dir: string }) {
  return (
    <FullBleed>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", direction: d.flip ? "rtl" : "ltr" }} className="pg-detail-spread">
        <div style={{ position: "relative", minHeight: "clamp(320px,52vh,600px)", direction: "ltr" }}>
          <Image src={`/images/features/${dir}/${d.img}.webp`} alt={d.alt} fill sizes="(max-width: 840px) 100vw, 50vw" style={{ objectFit: "cover" }} />
        </div>
        <div style={{ direction: "ltr", display: "flex", alignItems: "center", background: "#0E1B2C" }}>
          <div style={{ padding: "clamp(28px,4vw,56px)", display: "flex", flexDirection: "column", gap: 12, maxWidth: 520, margin: "0 auto" }}>
            <Eyebrow tone={d.tone}>{d.eyebrow}</Eyebrow>
            <h3 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h3)", lineHeight: 1.12, letterSpacing: "-.02em", color: "#FFFFFF" }}>{d.h}</h3>
            <p style={{ margin: 0, fontFamily: ARCHIVO, fontSize: 16.5, lineHeight: 1.62, color: "#C4CBD6" }}>{d.body}</p>
            <p style={{ margin: 0, fontFamily: MONO, fontSize: "var(--t-small)", letterSpacing: ".04em", color: "#77828F" }}>{d.caption}</p>
          </div>
        </div>
      </div>
    </FullBleed>
  )
}

/** Include once per entry page, after the last .pg-detail-spread. */
export const DETAIL_SPREAD_RESPONSIVE_CSS = `
  @media (max-width: 840px) {
    .pg-detail-spread { grid-template-columns: 1fr !important; direction: ltr !important; }
  }
`
