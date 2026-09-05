import Link from "next/link"

const ARCHIVO = "Archivo, Helvetica, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const NOTCH = "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)"

/** One section, one idea, one button. The shape every homepage section takes. */
export function Section({
  id, eyebrow, tone = "#F2C94C", title, children, cta, link,
}: {
  id: string; eyebrow: string; tone?: string; title: string; children: React.ReactNode
  cta?: { href: string; label: string; external?: boolean }
  link?: { href: string; label: string }
}) {
  return (
    <section id={id} style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)" }}>
      <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".22em", textTransform: "uppercase", color: tone }}>
        <i aria-hidden="true" style={{ width: 22, height: 2, background: tone, flex: "0 0 auto" }} />
        {eyebrow}
      </p>
      <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h2)", lineHeight: 1.05, letterSpacing: "-.025em", color: "#FFFFFF", maxWidth: "18ch", textWrap: "balance" as never }}>
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: ARCHIVO, fontSize: "var(--t-lead)", lineHeight: 1.6, color: "#C4CBD6", maxWidth: "58ch" }}>
        {children}
      </div>
      {(cta || link) && (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 22px", paddingTop: 4 }}>
          {cta && (cta.external ? (
            <a href={cta.href} target="_blank" rel="noopener noreferrer" style={btn(tone)}>{cta.label}</a>
          ) : (
            <Link href={cta.href} style={btn(tone)}>{cta.label}</Link>
          ))}
          {link && <Link href={link.href} className="pg-textlink">{link.label}</Link>}
        </div>
      )}
    </section>
  )
}

function btn(tone: string): React.CSSProperties {
  const dark = tone === "#00D2BE" ? "#00302B" : "#101010"
  return { display: "inline-flex", alignItems: "center", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: tone, color: dark, padding: "15px 28px", clipPath: NOTCH, textDecoration: "none" }
}

/** Three products, as a list, not a paragraph with a plug in it. */
export function ProductRows() {
  const rows = [
    { href: "https://supercariq.com", label: "Supercar IQ", meta: "Sept 2026", tone: "#00D2BE" },
    { href: "https://www.amazon.com/s?k=The+Gloss+Game+Gavin+Brooks", label: "The Gloss Game", meta: "On Amazon", tone: "#F2C94C" },
    { href: "https://paddock20.com", label: "Paddock20", meta: "Software studio", tone: "#8B93A7" },
  ]
  return (
    <div className="pg-e0" style={{ display: "flex", flexDirection: "column", padding: "4px 18px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)" }}>
      {rows.map((r, i) => (
        <a key={r.href} href={r.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "12px 0", borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,.08)" : 0, textDecoration: "none" }}>
          <span style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 15, color: "#EDF1F6", flex: "0 0 auto" }}>{r.label}</span>
          <i aria-hidden="true" style={{ flex: "1 1 auto", height: 0, borderBottom: "1px dotted rgba(255,255,255,.16)" }} />
          <span style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: ".14em", textTransform: "uppercase", color: r.tone, flex: "0 0 auto" }}>{r.meta}</span>
        </a>
      ))}
    </div>
  )
}

/** A captioned photograph between sections. Two per page, not six. */
export function PhotoBreak({ src, pos = "center 40%", caption, credit = "PaddockGavin" }: { src: string; pos?: string; caption: string; credit?: string }) {
  return (
    <figure className="pg-photo-break" style={{ margin: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={caption} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(10,21,35,.5) 0%,rgba(10,21,35,0) 35%,rgba(10,21,35,0) 60%,rgba(10,21,35,.7) 100%)" }} />
      <figcaption style={{ position: "absolute", left: "clamp(16px,4vw,48px)", right: "clamp(16px,4vw,48px)", bottom: 14, display: "flex", justifyContent: "space-between", gap: 12, fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.88)", textShadow: "0 1px 8px rgba(10,21,35,.9)" }}>
        <span>{caption}</span>
        <span>&copy; {credit}</span>
      </figcaption>
    </figure>
  )
}

/** A row of small link cards. */
export function LinkRow({ items, label = "Related" }: { items: { href: string; label: string; note: string }[]; label?: string }) {
  return (
    <nav aria-label={label} className="pg-also">
      {items.map((it) => (
        <Link key={it.href} href={it.href} className="pg-e0" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 4, minHeight: 44, padding: "14px 16px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", textDecoration: "none" }}>
          <span style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 16, color: "#EDF1F6" }}>{it.label}</span>
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "#B4B6B2" }}>{it.note}</span>
        </Link>
      ))}
    </nav>
  )
}

/** The pages that are not sections. */
export function AlsoHere() {
  return <LinkRow label="Also here" items={[
    { href: "/cars", label: "The Garage", note: "29 cars over 30+ years" },
    { href: "/why-a-paddock", label: "Why a Paddock", note: "The word" },
    { href: "/connect", label: "Every link", note: "One page" },
  ]} />
}
