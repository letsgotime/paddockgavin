import { Section } from "@/components/home-sections"

const ARCHIVO = "Archivo, Helvetica, sans-serif"
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

/** The audience numbers, under the audience heading. The car numbers live in the proof strip. */
export function HomeMediaKit() {
  return (
    <Section id="mediakit" eyebrow="For brands" tone="#F2C94C" title="An audience that owns the cars you make things for" cta={{ href: "#contact", label: "Pitch a brand deal" }} link={{ href: "/connect", label: "Every link" }}>
      <p style={{ margin: 0 }}>
        About 1,000,000 views a month and around 7,900 followers, an audience of owners and collectors, watching vertical video with the sound off and the captions on. If you make products, tools or coatings, run events, or have an affiliate program, write me.
      </p>
      <dl className="pg-proof" style={{ margin: "6px 0 0" }}>
        {[
          { v: "~1M",   k: "views a month" },
          { v: "~7,900", k: "followers" },
          { v: "Owners", k: "and collectors" },
          { v: "200+",  k: "events run" },
        ].map((s) => (
          <div key={s.k} className="pg-e0" style={{ padding: "14px 16px 12px", clipPath: "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)" }}>
            <dt style={{ fontFamily: ARCHIVO, fontWeight: 800, fontSize: "var(--t-h3)", lineHeight: 1, letterSpacing: "-.03em", color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>{s.v}</dt>
            <dd style={{ margin: "6px 0 0", fontFamily: MONO, fontSize: "var(--t-eyebrow)", letterSpacing: ".16em", textTransform: "uppercase", color: "#B4B6B2" }}>{s.k}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
