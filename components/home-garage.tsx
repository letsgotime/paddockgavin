import Image from "next/image"
import Link from "next/link"

const SHOTS = [
  { src: "/images/f458-side.webp",          caption: "Ferrari 458 Italia side profile",  pos: "center 35%" },
  { src: "/images/ford-gt-studio.webp",     caption: "Ford GT studio",                   pos: "center 40%" },
  { src: "/images/g993-out.webp",           caption: "993 GT3 outside the paddock",      pos: "center 30%" },
  { src: "/images/donuts-overflow.webp",    caption: "Overflow lot at the Donuts meet",  pos: "center 45%" },
  { src: "/images/downpipe.webp",           caption: "Catback detail work",              pos: "center 40%" },
  { src: "/images/f458-extinguisher.webp",  caption: "458 fire extinguisher mount",      pos: "center 30%" },
]

export function HomeGarage() {
  return (
    <section
      data-screen-label="The garage"
      id="garage"
      style={{ display: "flex", flexDirection: "column", gap: "clamp(40px,6vw,72px)" }}
    >
      {/* Eyebrow */}
      <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "#8B93A7" }}>
        The personal register
      </span>

      {/* Headline */}
      <h2 style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(44px,8vw,96px)", lineHeight: .97, letterSpacing: "-.03em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "13ch" }}>
        Everything I&apos;ve owned,{" "}<span style={{ color: "#F8B800" }}>and what happened to it.</span>
      </h2>

      {/* Stats — huge, open */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(160px,45%),1fr))", gap: "clamp(24px,4vw,48px)", borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: "clamp(28px,4vw,48px)" }}>
        {[
          { label: "Owned",       value: "29",      color: "#F8B800" },
          { label: "Years",       value: "30+",     color: "#00D2BE" },
          { label: "Found for others", value: "78", color: "#8B93A7" },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(48px,7vw,80px)", lineHeight: 1, letterSpacing: "-.04em", color: s.color }}>
              {s.value}
            </span>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "#8B93A7" }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Photo grid — no borders, no clips, just images */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(260px,45%),1fr))", gap: "clamp(6px,1vw,10px)" }}>
        {SHOTS.map((s) => (
          <Link key={s.src} href="/gallery" style={{ position: "relative", display: "block", aspectRatio: "3/2", overflow: "hidden", background: "rgba(21,37,56,.4)", textDecoration: "none" }}>
            <Image src={s.src} alt={s.caption} fill style={{ objectFit: "cover", objectPosition: s.pos, transition: "transform .4s ease" }} loading="lazy" />
          </Link>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/garage" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#F8B800", color: "#101010", padding: "14px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", textDecoration: "none" }}>
          Open the register
        </Link>
        <Link href="/gallery" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.22)", padding: "14px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", textDecoration: "none" }}>
          Full gallery
        </Link>
      </div>
    </section>
  )
}
