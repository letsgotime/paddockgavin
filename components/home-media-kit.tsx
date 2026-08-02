import Link from "next/link"

export function HomeMediaKit() {
  return (
    <section
      data-screen-label="For brands"
      id="mediakit"
      style={{ display: "flex", flexDirection: "column", gap: "clamp(40px,6vw,72px)" }}
    >
      {/* Eyebrow */}
      <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "#F8B800" }}>
        For brands
      </span>

      {/* Headline */}
      <h2 style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(44px,8vw,96px)", lineHeight: .97, letterSpacing: "-.03em", textTransform: "uppercase", color: "#FFFFFF", maxWidth: "14ch" }}>
        The audience,{" "}<span style={{ color: "#F8B800" }}>in numbers.</span>
      </h2>

      {/* Body */}
      <p style={{ margin: 0, fontFamily: "Archivo, Helvetica, sans-serif", fontSize: "clamp(18px,1.9vw,22px)", lineHeight: 1.65, color: "#C4CBD6", maxWidth: "52ch" }}>
        Vertical, phone-first, captions on. Most of it watched with the sound off. If you want your product in front of people who live in a garage, write me.
      </p>

      {/* Stats — big, open */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(160px,45%),1fr))", gap: "clamp(24px,4vw,48px)", borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: "clamp(28px,4vw,48px)" }}>
        {[
          { label: "Cars owned",       value: "29",         color: "#F8B800" },
          { label: "Found for others", value: "78",         color: "#00D2BE" },
          { label: "Events run",       value: "200+",       color: "#8B93A7" },
          { label: "Based",            value: "Nashville",  color: "#57C7F5" },
        ].map((r) => (
          <div key={r.label} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 900, fontSize: "clamp(48px,6vw,72px)", lineHeight: 1, letterSpacing: "-.04em", color: r.color }}>
              {r.value}
            </span>
            <span style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "#8B93A7" }}>
              {r.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="#contact" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", background: "#F8B800", color: "#101010", padding: "14px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", textDecoration: "none" }}>
          Pitch a brand deal
        </a>
        <Link href="/connect" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Archivo, Helvetica, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".07em", textTransform: "uppercase", color: "#EDF1F6", border: "1px solid rgba(255,255,255,.22)", padding: "14px 28px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)", textDecoration: "none" }}>
          Every link
        </Link>
      </div>
    </section>
  )
}
